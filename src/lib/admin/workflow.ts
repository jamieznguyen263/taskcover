import type { InsightArticle, InsightStatus } from "@/content/insights.types";
import { locales } from "@/lib/i18n";
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
    const localeSet = new Set(translations.map((article) => article.locale));
    for (const locale of locales) {
      if (!localeSet.has(locale)) {
        throw new Error(`Cannot ${decision.to}: missing ${locale} localization.`);
      }
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
