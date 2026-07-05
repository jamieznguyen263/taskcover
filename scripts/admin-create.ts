import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadEnvConfig } from "@next/env";
import { argon2id } from "hash-wasm";
import postgres from "postgres";

loadEnvConfig(process.cwd());

const MIN_PASSWORD_LENGTH = 12;
const ARGON2ID_PARAMS = {
  memorySize: 19456,
  iterations: 2,
  parallelism: 1,
  hashLength: 32,
} as const;

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Admin bootstrap failed.");
  process.exit(1);
});

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((arg) => !arg.startsWith("--"));
  const allowUpdate = args.includes("--update-existing");

  if (!email) {
    console.error("Usage: npm run admin:create -- admin@example.com [--update-existing]");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required. Refusing to create credentials without a configured database.");
    process.exit(1);
  }

  const normalizedEmail = normalizeEmail(email);
  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  const existingRows = await sql<{ id: string }[]>`SELECT id FROM admin_users WHERE normalized_email = ${normalizedEmail} LIMIT 1`;
  if (existingRows[0] && !allowUpdate) {
    await sql.end();
    console.error("Admin user already exists. Re-run with --update-existing to intentionally rotate credentials.");
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });
  const displayName = await rl.question("Display name: ");
  const password = await questionHidden(rl, "Password: ");
  rl.close();

  if (password.length < MIN_PASSWORD_LENGTH) {
    await sql.end();
    console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const rows = await sql<{ id: string; email: string }[]>`
    INSERT INTO admin_users (email, normalized_email, display_name, role, status, password_hash, password_changed_at, updated_at)
    VALUES (${normalizedEmail}, ${normalizedEmail}, ${displayName || email}, 'admin', 'active', ${passwordHash}, now(), now())
    ON CONFLICT (normalized_email)
    DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      role = 'admin',
      status = 'active',
      password_hash = EXCLUDED.password_hash,
      password_changed_at = now(),
      updated_at = now()
    RETURNING id, email
  `;
  const user = rows[0];
  await sql`
    INSERT INTO admin_audit_logs (event, actor_id, target_type, target_id, summary, metadata)
    VALUES (
      'password_change',
      ${user.id},
      'admin_user',
      ${user.id},
      ${existingRows[0] ? "Admin password rotation completed through explicit bootstrap command." : "First Admin bootstrap completed."},
      '{}'::jsonb
    )
  `;
  await sql.end();
  console.log(`Admin ready: ${user.email}`);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string) {
  return argon2id({
    password,
    salt: crypto.randomBytes(16),
    ...ARGON2ID_PARAMS,
    outputType: "encoded",
  });
}

async function questionHidden(rl: readline.Interface, prompt: string) {
  if (!input.isTTY) return rl.question(prompt);

  output.write(prompt);
  input.setRawMode(true);
  input.resume();

  return new Promise<string>((resolve) => {
    let value = "";
    const onData = (chunk: Buffer) => {
      const text = chunk.toString("utf8");
      if (text === "\r" || text === "\n" || text === "\r\n") {
        input.setRawMode(false);
        input.off("data", onData);
        output.write("\n");
        resolve(value);
        return;
      }
      if (text === "\u0003") {
        input.setRawMode(false);
        process.exit(130);
      }
      if (text === "\b" || text === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += text;
    };
    input.on("data", onData);
  });
}
