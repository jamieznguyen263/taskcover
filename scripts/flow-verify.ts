/**
 * Taskcover Flow go-live verification — READ ONLY.
 *
 * Run after applying migrations 0005–0010 (locally against staging, then production) to
 * confirm the schema, the membership backfill, and the seeded role presets all landed
 * correctly. It only issues SELECTs — it never writes — so it is safe to point at any
 * database, including production. Exits non-zero if anything is off, so it can gate a
 * rollout step.
 *
 *   npm run flow:verify
 *
 * See planning/TASKCOVER_FLOW_ROLLOUT.md §1.
 */
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { summarizeUrl } from "../src/lib/ops/production-activation";
import { CAPABILITIES_BY_ACCESS_LEVEL, type WorkAccessLevel } from "../src/lib/work/capabilities";

loadEnvConfig(process.cwd());

const FLOW_TABLES = [
  // 0005
  "organization_memberships",
  "role_presets",
  "teams",
  "team_memberships",
  "external_organizations",
  // 0006
  "external_memberships",
  "flow_external_invites",
  // 0007
  "clients",
  "client_contacts",
  "client_memberships",
  "projects",
  "project_memberships",
  "project_templates",
  // 0008
  "work_items",
  "work_item_members",
  "work_dependencies",
  "work_checklist_items",
  "discussion_threads",
  "work_comments",
  "work_files",
  "work_file_links",
  "activity_events",
  // 0009
  "notifications",
  // 0010
  "documents",
  "document_versions",
  "document_work_links",
];

const FLOW_MIGRATIONS = [
  "0005_flow_memberships.sql",
  "0006_flow_external_access.sql",
  "0007_flow_clients_projects.sql",
  "0008_flow_work_discussions.sql",
  "0009_flow_notifications.sql",
  "0010_flow_documents.sql",
];

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for flow:verify.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Flow verification failed.");
  process.exit(1);
});

async function main() {
  const summary = summarizeUrl(databaseUrl!);
  const sql = postgres(databaseUrl as string, { max: 1, prepare: false });
  const problems: string[] = [];

  try {
    // 1. Tables
    const tableRows = await sql<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `;
    const tables = new Set(tableRows.map((r) => r.table_name));
    const missingTables = FLOW_TABLES.filter((name) => !tables.has(name));
    if (missingTables.length) problems.push(`Missing Flow tables: ${missingTables.join(", ")}`);

    // 2. Migrations recorded
    const migrationRows = await sql<{ name: string }[]>`SELECT name FROM _taskcover_migrations`.catch(() => []);
    const applied = new Set(migrationRows.map((r) => r.name));
    const missingMigrations = FLOW_MIGRATIONS.filter((name) => !applied.has(name));
    if (missingMigrations.length) problems.push(`Migrations not recorded as applied: ${missingMigrations.join(", ")}`);

    // 3. Membership backfill — every non-external admin_user has an organization membership.
    let backfill: string;
    if (missingTables.includes("organization_memberships")) {
      backfill = "skipped (table missing)";
    } else {
      const [{ count: missingMemberships }] = await sql<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM admin_users u
        WHERE u.role <> 'external'
          AND NOT EXISTS (SELECT 1 FROM organization_memberships m WHERE m.user_id = u.id)
      `;
      if (missingMemberships > 0) {
        problems.push(`${missingMemberships} internal admin_users have no organization_membership (backfill incomplete).`);
        backfill = "incomplete";
      } else {
        backfill = "complete";
      }
    }

    // 4. Role presets match code (capability_set is the display mirror of capabilities.ts).
    let presets: string;
    if (missingTables.includes("role_presets")) {
      presets = "skipped (table missing)";
    } else {
      const presetRows = await sql<{ key: string; capability_set: unknown }[]>`
        SELECT key, capability_set FROM role_presets
      `;
      const byKey = new Map(presetRows.map((r) => [r.key, r.capability_set]));
      const keys: WorkAccessLevel[] = ["owner", "admin", "manager", "member"];
      let drift = 0;
      for (const key of keys) {
        const seeded = byKey.get(key);
        if (!Array.isArray(seeded)) {
          problems.push(`role_presets missing or malformed row for '${key}'.`);
          drift++;
          continue;
        }
        const expected = [...CAPABILITIES_BY_ACCESS_LEVEL[key]].sort();
        const actual = [...(seeded as string[])].sort();
        if (JSON.stringify(expected) !== JSON.stringify(actual)) {
          problems.push(`role_presets '${key}' capability_set drifted from code.`);
          drift++;
        }
      }
      presets = drift === 0 ? "match code" : "drifted";
    }

    console.log(
      JSON.stringify(
        {
          host: summary.host,
          database: summary.database,
          flowTables: missingTables.length ? "missing" : "configured",
          migrations: missingMigrations.length ? "incomplete" : "applied",
          membershipBackfill: backfill,
          rolePresets: presets,
          problems,
        },
        null,
        2
      )
    );
  } finally {
    await sql.end();
  }

  if (problems.length) process.exitCode = 1;
}
