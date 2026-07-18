import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * FLOW-012 migration verification. Every Taskcover Flow migration (0005+) must be strictly
 * additive so it can be applied to the live database — shared with the running CMS — with
 * zero risk to existing data. This test fails if any Flow migration contains a destructive
 * statement or touches a table that predates Taskcover Flow.
 */
const FLOW_MIGRATION_RANGE = /^00(0[5-9]|1\d)_/; // 0005 and up
const DESTRUCTIVE = [
  /\bDROP\s+TABLE\b/i,
  /\bDROP\s+COLUMN\b/i,
  /\bALTER\s+COLUMN\b/i,
  /\bDROP\s+CONSTRAINT\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bTRUNCATE\b/i,
  /\bDROP\s+TYPE\b/i,
];

// Tables that existed before Taskcover Flow. A Flow migration may reference them only in FK
// clauses (REFERENCES) and in the intentional, guarded backfills/reads — never restructure
// them. role_presets is a Flow table (created in 0005) so its UPDATEs are fine.
const PREEXISTING_TABLES = [
  "admin_users",
  "admin_sessions",
  "admin_invites",
  "media_assets",
  "insight_article_groups",
  "insight_article_localizations",
  "insight_article_revisions",
  "content_comments",
  "media_usages",
  "workflow_events",
  "admin_audit_logs",
  "lead_submissions",
  "lead_delivery_jobs",
  "lead_delivery_attempts",
  "lead_provider_links",
  "lead_status_events",
];

function flowMigrations(): { file: string; sql: string }[] {
  const dir = path.join(process.cwd(), "drizzle");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".sql") && FLOW_MIGRATION_RANGE.test(file))
    .sort()
    .map((file) => ({ file, sql: fs.readFileSync(path.join(dir, file), "utf8") }));
}

describe("Flow migration integrity (FLOW-012)", () => {
  const migrations = flowMigrations();

  it("finds the expected set of Flow migrations (0005–0010)", () => {
    expect(migrations.map((m) => m.file)).toEqual([
      "0005_flow_memberships.sql",
      "0006_flow_external_access.sql",
      "0007_flow_clients_projects.sql",
      "0008_flow_work_discussions.sql",
      "0009_flow_notifications.sql",
      "0010_flow_documents.sql",
    ]);
  });

  it("contains no destructive statements", () => {
    for (const { file, sql } of migrations) {
      for (const pattern of DESTRUCTIVE) {
        expect(pattern.test(sql), `${file} contains a destructive statement matching ${pattern}`).toBe(false);
      }
    }
  });

  it("never runs CREATE TABLE, ALTER TABLE ... ADD COLUMN, or CREATE INDEX against a pre-existing table", () => {
    for (const { file, sql } of migrations) {
      for (const table of PREEXISTING_TABLES) {
        expect(new RegExp(`CREATE TABLE "${table}"`).test(sql), `${file} recreates ${table}`).toBe(false);
        expect(
          new RegExp(`ALTER TABLE "${table}"[^;]*ADD COLUMN`, "i").test(sql),
          `${file} adds a column to pre-existing ${table}`
        ).toBe(false);
        expect(
          new RegExp(`CREATE (?:UNIQUE )?INDEX[^;]*ON "${table}"`, "i").test(sql),
          `${file} indexes pre-existing ${table}`
        ).toBe(false);
      }
    }
  });

  it("only ALTER TABLE statements are ADD CONSTRAINT on Flow tables (FK wiring)", () => {
    for (const { file, sql } of migrations) {
      const alters = sql.match(/ALTER TABLE [^;]*/gi) ?? [];
      for (const alter of alters) {
        expect(/ADD CONSTRAINT/i.test(alter), `${file} has a non-additive ALTER: ${alter.slice(0, 80)}`).toBe(true);
      }
    }
  });
});
