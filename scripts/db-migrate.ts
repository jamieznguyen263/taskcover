import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. Refusing to run migrations against an unknown database.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1 });
const migrationPath = path.join(process.cwd(), "drizzle", "0000_bored_dark_phoenix.sql");
const migration = fs.readFileSync(migrationPath, "utf8");

await sql.unsafe(migration);
await sql.end();
console.log("Applied admin content OS migrations.");
