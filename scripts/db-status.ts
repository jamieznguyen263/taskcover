import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { summarizeUrl } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for db:status.");
  process.exit(1);
}

const target = process.env.DATABASE_TARGET ?? "unconfirmed";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Database status failed.");
  process.exit(1);
});

async function main() {
  const summary = summarizeUrl(databaseUrl);
  const sql = postgres(databaseUrl as string, { max: 1, prepare: false });

  const migrationRows = await sql<{ name: string; applied_at: Date }[]>`
  SELECT name, applied_at FROM _taskcover_migrations ORDER BY name
`.catch(() => []);
  const tableRows = await sql<{ table_name: string }[]>`
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
`;

  await sql.end();

  console.log(
    JSON.stringify(
      {
        target,
        host: summary.host,
        database: summary.database,
        migrationHistoryPresent: migrationRows.length > 0,
        appliedMigrations: migrationRows.map((row) => row.name),
        tableCount: tableRows.length,
      },
      null,
      2
    )
  );
}
