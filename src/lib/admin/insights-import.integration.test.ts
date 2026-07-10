import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { describe, expect, it } from "vitest";
import { importInsights } from "../../../scripts/insights-import";

loadEnvConfig(process.cwd());
loadIgnoredDatabaseEnv();

describe("Insights import idempotency against the staging database", () => {
  it("re-running import leaves group/localization/revision counts and published_revision_group_id unchanged", async () => {
    if (process.env.DATABASE_TARGET === "production") throw new Error("Integration test refuses DATABASE_TARGET=production.");
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the staging integration test.");
    const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    try {
      const first = await importInsights(sql);
      const afterFirst = await snapshot(sql);

      const second = await importInsights(sql);
      const afterSecond = await snapshot(sql);

      expect(second.groups).toBe(first.groups);
      expect(second.localizations).toBe(first.localizations);
      expect(afterSecond.groupCount).toBe(afterFirst.groupCount);
      expect(afterSecond.localizationCount).toBe(afterFirst.localizationCount);
      expect(afterSecond.revisionCount).toBe(afterFirst.revisionCount);

      // published_revision_group_id must be stable across re-imports, not replaced with a fresh
      // (and therefore orphaned) UUID on every run.
      expect(afterSecond.pointers).toEqual(afterFirst.pointers);

      // Every group's published_revision_group_id must resolve to at least one real revision row —
      // this is the exact invariant the earlier bug violated.
      for (const pointer of afterSecond.pointers) {
        expect(pointer.publishedRevisionGroupId).not.toBeNull();
        expect(pointer.matchingRevisionCount).toBeGreaterThan(0);
      }
    } finally {
      await sql.end();
    }
  }, 180_000);
});

async function snapshot(sql: postgres.Sql) {
  const [groupCountRow] = await sql<{ c: number }[]>`SELECT count(*)::int AS c FROM insight_article_groups`;
  const [localizationCountRow] = await sql<{ c: number }[]>`SELECT count(*)::int AS c FROM insight_article_localizations`;
  const [revisionCountRow] = await sql<{ c: number }[]>`SELECT count(*)::int AS c FROM insight_article_revisions`;
  const pointers = await sql<{ translation_group_id: string; published_revision_group_id: string | null; matching_revision_count: number }[]>`
    SELECT g.translation_group_id, g.published_revision_group_id,
      (SELECT count(*)::int FROM insight_article_revisions r
       INNER JOIN insight_article_localizations l ON l.id = r.localization_id
       WHERE l.article_group_id = g.id AND r.revision_group_id = g.published_revision_group_id) AS matching_revision_count
    FROM insight_article_groups g
    ORDER BY g.translation_group_id
  `;
  return {
    groupCount: groupCountRow!.c,
    localizationCount: localizationCountRow!.c,
    revisionCount: revisionCountRow!.c,
    pointers: pointers.map((row) => ({
      translationGroupId: row.translation_group_id,
      publishedRevisionGroupId: row.published_revision_group_id,
      matchingRevisionCount: row.matching_revision_count,
    })),
  };
}

function loadIgnoredDatabaseEnv() {
  if (process.env.DATABASE_URL && process.env.DATABASE_TARGET) return;
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(DATABASE_URL|DATABASE_TARGET)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const value = match[2]!.trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[match[1]!]) process.env[match[1]!] = value;
  }
}
