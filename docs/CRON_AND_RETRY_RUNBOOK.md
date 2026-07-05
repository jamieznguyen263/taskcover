# Cron and Retry Runbook

Cloudflare Cron runs every 5 minutes through `worker/taskcover-worker.ts`.

The scheduled handler calls `runScheduledTasks()` which:

- Publishes due Insights.
- Recovers stale lead job locks.
- Processes a bounded batch of lead delivery jobs.

The secure HTTP endpoint `/api/internal/publishing/run` calls the same service and requires `x-taskcover-publish-secret`.

Logs include only provider, job type, safe lead reference, result category, duration, retry count, and timestamp.
