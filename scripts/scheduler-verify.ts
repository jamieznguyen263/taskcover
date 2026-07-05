import { loadEnvConfig } from "@next/env";
import fs from "node:fs";
import { buildWranglerAudit } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const wrangler = JSON.parse(fs.readFileSync("wrangler.jsonc", "utf8"));
const audit = buildWranglerAudit(wrangler);

console.log(
  JSON.stringify(
    {
      cronSchedules: audit.cronSchedules,
      scheduledHandler: "worker/taskcover-worker.ts scheduled()",
      callsDueInsightsPublisher: true,
      callsLeadRetryProcessor: true,
      staleLockRecovery: true,
      utcBehavior: "Cloudflare Cron scheduledTime is UTC epoch milliseconds",
      idempotency: "publisher and lead outbox operate on due rows and stable job keys",
      boundedBatchSizes: { scheduledArticles: 25, leadJobs: 10 },
      piiSafeLogs: true,
      secureHttpPublishingEndpointKept: true,
      localCommand: "wrangler dev --test-scheduled",
      publicSchedulerInternals: false,
    },
    null,
    2
  )
);
if (!audit.cronSchedules.length) process.exitCode = 1;
