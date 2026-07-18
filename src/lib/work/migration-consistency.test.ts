import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CAPABILITIES_BY_ACCESS_LEVEL, SYSTEM_ROLE_PRESETS } from "./capabilities";

/**
 * role_presets rows mirror src/lib/work/capabilities.ts for display; code is authoritative
 * for authorization. This test replays every migration's role_presets writes (the 0005
 * INSERT seeds plus any later UPDATE statements) and fails if the final database state
 * would drift from the code. When capabilities change, ship an UPDATE in the same PR.
 */
function computeSeededCapabilitySets(): Map<string, string[]> {
  const migrationDir = path.join(process.cwd(), "drizzle");
  const files = fs
    .readdirSync(migrationDir)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  const state = new Map<string, string[]>();
  for (const file of files) {
    const sqlText = fs.readFileSync(path.join(migrationDir, file), "utf8");

    // INSERT seed rows: ('key', 'Name', 'Description', '[...]'::jsonb, ...)
    for (const match of sqlText.matchAll(/\('([a-z_]+)',[^)]*?'(\[[^\]]*\])'::jsonb/g)) {
      if (sqlText.includes('INSERT INTO "role_presets"')) {
        state.set(match[1], JSON.parse(match[2]) as string[]);
      }
    }

    // Later capability updates: UPDATE "role_presets" SET "capability_set" = '[...]'::jsonb ... WHERE "key" = 'x'
    for (const match of sqlText.matchAll(
      /UPDATE "role_presets" SET "capability_set" = '(\[[^\]]*\])'::jsonb[^;]*WHERE "key" = '([a-z_]+)'/g
    )) {
      state.set(match[2], JSON.parse(match[1]) as string[]);
    }
  }
  return state;
}

describe("role-preset migration consistency", () => {
  it("final seeded capability_set matches code for every system preset", () => {
    const seeded = computeSeededCapabilitySets();
    for (const preset of SYSTEM_ROLE_PRESETS) {
      const dbSet = seeded.get(preset.key);
      expect(dbSet, `no seed/update found for preset '${preset.key}'`).toBeDefined();
      expect([...dbSet!].sort()).toEqual([...CAPABILITIES_BY_ACCESS_LEVEL[preset.key]].sort());
    }
  });

  it("backfill in 0005 maps admin->admin and editor->member, never owner", () => {
    const migration = fs.readFileSync(path.join(process.cwd(), "drizzle", "0005_flow_memberships.sql"), "utf8");
    expect(migration).toContain(`WHEN "role" = 'admin' THEN 'admin'::"work_access_level"`);
    expect(migration).toContain(`ELSE 'member'::"work_access_level"`);
    expect(migration).not.toContain(`'owner'::"work_access_level"`);
  });
});
