import type { InsightArticle, InsightStatus } from "@/content/insights.types";
import { validateInsightArticle } from "@/lib/insights/publish-qa";
import { assertCanTransition, type AdminRole } from "./permissions";

export type WorkflowDecision = {
  from: InsightStatus;
  to: InsightStatus;
  role: AdminRole;
  translations?: InsightArticle[];
  blockingQaErrors?: number;
};

export function assertWorkflowDecision(decision: WorkflowDecision) {
  assertCanTransition(decision.role, decision.from, decision.to);

  if (["approved", "scheduled", "published"].includes(decision.to)) {
    const translations = decision.translations ?? [];
    if (!translations.some((article) => article.locale === "en")) {
      throw new Error(`Cannot ${decision.to}: missing en source localization.`);
    }

    const blockingErrors = decision.blockingQaErrors ?? translations.reduce((count, article) => {
      return count + validateInsightArticle(article, translations).filter((result) => result.severity === "error").length;
    }, 0);

    if (blockingErrors > 0) {
      throw new Error(`Cannot ${decision.to}: Publish QA has blocking errors.`);
    }
  }
}

export function isPublishedSnapshotLive(article: InsightArticle, now = new Date()) {
  return article.status === "published" && (!article.scheduledAt || new Date(article.scheduledAt).getTime() <= now.getTime());
}
