import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { locales } from "@/lib/i18n";
import { AdminRepository } from "./repository";
import { getAdminIntegrationStatus } from "./env";

export type PublishingJobResult = {
  scanned: number;
  published: number;
  failed: number;
  skipped: number;
};

export interface PublishScheduler {
  isConfigured(): boolean;
  getStatus(): { provider: string; configured: boolean; message: string };
  publishDueArticles(now?: Date): Promise<PublishingJobResult>;
}

export class DatabasePublishScheduler implements PublishScheduler {
  constructor(private readonly repo = new AdminRepository()) {}

  isConfigured() {
    return getAdminIntegrationStatus().schedulerConfigured;
  }

  getStatus() {
    const status = getAdminIntegrationStatus();
    return {
      provider: status.schedulerProvider,
      configured: status.schedulerConfigured,
      message: status.schedulerConfigured ? "Scheduler secret and provider are configured." : "Scheduling automation is not configured.",
    };
  }

  async publishDueArticles(now = new Date()): Promise<PublishingJobResult> {
    const due = await this.repo.listDueScheduledGroups(now);
    const result: PublishingJobResult = { scanned: due.length, published: 0, failed: 0, skipped: 0 };

    for (const group of due) {
      try {
        await this.repo.transitionArticle({
          articleId: group.id,
          expectedVersion: group.lockVersion,
          to: "published",
          actorId: null,
          role: "admin",
          schedulerConfigured: true,
          note: "Published by scheduler.",
        });
        await this.repo.audit({ event: "scheduler_success", targetType: "insight_article_group", targetId: group.id, summary: "Scheduled article group processed." });
        for (const locale of locales) {
          revalidatePath(locale === "en" ? "/insights" : `/${locale}/insights`);
        }
        revalidateTag("insights", "max");
        result.published += 1;
      } catch {
        result.failed += 1;
        await this.repo.audit({ event: "scheduler_failure", targetType: "insight_article_group", targetId: group.id, summary: "Scheduled article group failed." });
      }
    }

    return result;
  }
}

export function getPublishScheduler() {
  return new DatabasePublishScheduler();
}
