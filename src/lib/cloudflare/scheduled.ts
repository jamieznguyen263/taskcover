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
  const scheduler = getPublishScheduler();
  if (!scheduler.isConfigured()) skipped.push("publishing-scheduler-disabled");

  const [published, leads] = await Promise.all([
    scheduler.isConfigured() ? scheduler.publishDueArticles(new Date(scheduledTime)) : Promise.resolve(null),
    processLeadDeliveryJobs(undefined, new Date(scheduledTime), 10),
  ]);

  logOperationalEvent({
    event: "scheduled_tasks",
    result: `published:${published?.published ?? 0};lead_jobs:${leads.processed}`,
  });

  return { published, leads, skipped };
}
