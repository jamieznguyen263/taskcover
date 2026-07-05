import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { migrationGuard, summarizeUrl } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. Refusing to run migrations against an unknown database.");
  process.exit(1);
}

const guard = migrationGuard(process.env);
if (!guard.ok) {
  console.error(guard.message);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Database migration failed.");
  process.exit(1);
});

async function main() {
  const migrationDir = path.join(process.cwd(), "drizzle");
  const migrationFiles = fs
    .readdirSync(migrationDir)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  const summary = summarizeUrl(databaseUrl);
  const sql = postgres(databaseUrl as string, { max: 1, prepare: false });

  await sql.unsafe(`
  CREATE TABLE IF NOT EXISTS _taskcover_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )
`);

  const appliedRows = await sql<{ name: string }[]>`SELECT name FROM _taskcover_migrations`;
  const applied = new Set(appliedRows.map((row) => row.name));
  const pending = migrationFiles.filter((file) => !applied.has(file));

  console.log(
    JSON.stringify(
      {
        target: process.env.DATABASE_TARGET,
        host: summary.host,
        database: summary.database,
        pendingMigrationCount: pending.length,
        pendingMigrations: pending,
      },
      null,
      2
    )
  );

  for (const file of pending) {
    const migration = fs.readFileSync(path.join(migrationDir, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(migration);
      await tx`INSERT INTO _taskcover_migrations (name) VALUES (${file})`;
    });
    console.log(`Applied migration: ${file}`);
  }

  await sql.end();
}
