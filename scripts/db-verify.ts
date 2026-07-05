import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { summarizeUrl } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const expectedTables = [
  "admin_users",
  "admin_sessions",
  "admin_invites",
  "admin_audit_logs",
  "insight_article_groups",
  "insight_article_localizations",
  "insight_article_revisions",
  "workflow_events",
  "media_assets",
  "media_usages",
  "lead_submissions",
  "lead_delivery_jobs",
  "lead_delivery_attempts",
  "lead_provider_links",
  "lead_status_events",
];

const expectedIndexes = [
  "admin_users_normalized_email_idx",
  "lead_submissions_idempotency_idx",
  "lead_delivery_jobs_idempotency_idx",
  "insight_article_groups_translation_group_idx",
  "insight_article_localizations_group_locale_idx",
  "insight_article_revisions_localization_number_idx",
];

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for db:verify.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Database verification failed.");
  process.exit(1);
});

async function main() {
  const summary = summarizeUrl(databaseUrl);
  const sql = postgres(databaseUrl as string, { max: 1, prepare: false });
  const tableRows = await sql<{ table_name: string }[]>`
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
`;
  const indexRows = await sql<{ indexname: string }[]>`
  SELECT indexname FROM pg_indexes WHERE schemaname = 'public'
`;
  const migrationRows = await sql<{ name: string }[]>`
  SELECT name FROM _taskcover_migrations ORDER BY name
`.catch(() => []);
  await sql.end();

  const tables = new Set(tableRows.map((row) => row.table_name));
  const indexes = new Set(indexRows.map((row) => row.indexname));
  const missingTables = expectedTables.filter((name) => !tables.has(name));
  const missingIndexes = expectedIndexes.filter((name) => !indexes.has(name));
  const result = {
    host: summary.host,
    database: summary.database,
    connectivity: "configured",
    migrationVersion: migrationRows.at(-1)?.name ?? "history unavailable",
    expectedTables: missingTables.length ? "missing" : "configured",
    requiredIndexesAndUniqueConstraints: missingIndexes.length ? "missing" : "configured",
    leadOutboxTables: ["lead_submissions", "lead_delivery_jobs", "lead_delivery_attempts", "lead_provider_links", "lead_status_events"].every((name) =>
      tables.has(name)
    )
      ? "configured"
      : "missing",
    adminTables: ["admin_users", "admin_sessions", "admin_invites", "admin_audit_logs"].every((name) => tables.has(name)) ? "configured" : "missing",
    insightsTables: ["insight_article_groups", "insight_article_localizations"].every((name) => tables.has(name)) ? "configured" : "missing",
    revisionTables: tables.has("insight_article_revisions") ? "configured" : "missing",
    schedulerFields: tables.has("insight_article_groups") ? "configured" : "missing",
    missingTables,
    missingIndexes,
  };

  console.log(JSON.stringify(result, null, 2));
  if (missingTables.length || missingIndexes.length) process.exitCode = 1;
}
