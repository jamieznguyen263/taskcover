import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { isSupportedPasswordHash } from "../src/lib/admin/crypto";
import { defaultVerificationRole, parseAdminRole, readFlagValue } from "../src/lib/admin/user-bootstrap";

loadEnvConfig(process.cwd());

const args = process.argv.slice(2);
const email = args.find((arg, index) => !arg.startsWith("--") && args[index - 1] !== "--role");
const defaultRole = defaultVerificationRole(process.env.npm_lifecycle_event);
const expectedRole = parseAdminRole(readFlagValue(args, "--role"), defaultRole);
if (!email) {
  console.error("Usage: npm run admin:verify -- admin@example.com [--role admin|editor]");
  process.exit(1);
}
const normalizedEmail = email.trim().toLowerCase();
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
  let rows: { role: string; status: string; password_hash: string }[];
  try {
    rows = await sql<{ role: string; status: string; password_hash: string }[]>`
      SELECT role, status, password_hash FROM admin_users WHERE normalized_email = ${normalizedEmail} LIMIT 1
    `;
  } finally {
    await sql.end();
  }

  const admin = rows[0];
  const result = {
    exists: Boolean(admin),
    role: admin?.role ?? null,
    expectedRole,
    roleMatches: admin?.role === expectedRole,
    active: admin?.status === "active",
    passwordHashFormatValid: admin ? isSupportedPasswordHash(admin.password_hash) : false,
    plaintextPasswordFields: "not present in schema",
    sessionRequired: false,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.exists || !result.roleMatches || !result.active || !result.passwordHashFormatValid) process.exitCode = 1;
}
