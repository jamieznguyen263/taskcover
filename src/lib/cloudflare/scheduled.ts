import "server-only";

import { isDatabaseConfigured } from "@/lib/db/client";
import { getPublishScheduler } from "@/lib/admin/scheduler";
import { processLeadDeliveryJobs, recoverStaleLeadDeliveryLocks } from "@/lib/leads/outbox";
import { logOperationalEvent } from "@/lib/leads/logging";

export type ScheduledTaskSummary = {
  published: Awaited<ReturnType<ReturnType<typeof getPublishScheduler>["publishDueArticles"]>> | null;
  leads: Awaited<ReturnType<typeof processLeadDeliveryJobs>> | null;
  skipped: string[];
};

export async function runScheduledTasks(_env?: unknown, scheduledTime = Date.now()): Promise<ScheduledTaskSummary> {
  const skipped: string[] = [];
  if (!isDatabaseConfigured()) {
    skipped.push("database-unconfigured");
    return { published: null, leads: null, skipped };
  }

  await recoverStaleLeadDeliveryLocks();
  const [published, leads] = await Promise.all([
    getPublishScheduler().publishDueArticles(new Date(scheduledTime)),
    processLeadDeliveryJobs(undefined, new Date(scheduledTime), 10),
  ]);

  logOperationalEvent({
    event: "scheduled_tasks",
    result: `published:${published.published};lead_jobs:${leads.processed}`,
  });

  return { published, leads, skipped };
}
