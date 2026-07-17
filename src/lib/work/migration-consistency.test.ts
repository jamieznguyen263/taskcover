import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CAPABILITIES_BY_ACCESS_LEVEL, SYSTEM_ROLE_PRESETS } from "./capabilities";

/**
 * Migration 0005 seeds role_presets with capability_set JSON that mirrors
 * src/lib/work/capabilities.ts. Code is authoritative for authorization; this test keeps
 * the seeded display copies from silently drifting when capabilities change.
 */
describe("migration 0005 role-preset seeds", () => {
  const migration = fs.readFileSync(
    path.join(process.cwd(), "drizzle", "0005_flow_memberships.sql"),
    "utf8"
  );

  it("seeds every system preset with exactly the capabilities defined in code", () => {
    for (const preset of SYSTEM_ROLE_PRESETS) {
      const rowPattern = new RegExp(`\\('${preset.key}',[^)]*'(\\[[^\\]]*\\])'::jsonb`, "m");
      const match = migration.match(rowPattern);
      expect(match, `seed row for preset '${preset.key}' not found`).not.toBeNull();
      const seeded = JSON.parse(match![1]) as string[];
      expect(seeded.sort()).toEqual([...CAPABILITIES_BY_ACCESS_LEVEL[preset.key]].sort());
    }
  });

  it("backfills memberships mapping admin->admin and editor->member, never owner", () => {
    expect(migration).toContain(`WHEN "role" = 'admin' THEN 'admin'::"work_access_level"`);
    expect(migration).toContain(`ELSE 'member'::"work_access_level"`);
    expect(migration).not.toContain(`'owner'::"work_access_level"`);
  });
});
