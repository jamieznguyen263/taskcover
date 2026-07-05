import { loadEnvConfig } from "@next/env";
import postgres from "postgres";

loadEnvConfig(process.cwd());

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run admin:verify -- admin@example.com");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for admin:verify.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Admin verification failed.");
  process.exit(1);
});

async function main() {
  const sql = postgres(process.env.DATABASE_URL as string, { max: 1, prepare: false });
  const rows = await sql<{ role: string; status: string; password_hash: string; plaintext_password?: string }[]>`
  SELECT role, status, password_hash FROM admin_users WHERE normalized_email = ${email.trim().toLowerCase()} LIMIT 1
`;
  await sql.end();

  const admin = rows[0];
  const result = {
    exists: Boolean(admin),
    roleAdmin: admin?.role === "admin",
    active: admin?.status === "active",
    passwordHashFormatValid: admin?.password_hash?.startsWith("$argon2id$") ?? false,
    plaintextPasswordFields: "not present in schema",
    sessionRequired: false,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.exists || !result.roleAdmin || !result.active || !result.passwordHashFormatValid) process.exitCode = 1;
}
