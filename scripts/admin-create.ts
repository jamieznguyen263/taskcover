import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { hashPassword, MIN_PASSWORD_LENGTH, normalizeEmail } from "../src/lib/admin/crypto";
import { assertCredentialBootstrapTarget } from "../src/lib/admin/user-bootstrap";

loadEnvConfig(process.cwd());

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
  assertCredentialBootstrapTarget(process.env);

  const normalizedEmail = normalizeEmail(email);
  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const existingRows = await sql<{ id: string }[]>`SELECT id FROM admin_users WHERE normalized_email = ${normalizedEmail} LIMIT 1`;
    if (existingRows[0] && !allowUpdate) {
      throw new Error("Admin user already exists. Re-run with --update-existing to intentionally rotate credentials.");
    }

    const rl = readline.createInterface({ input, output });
    let displayName: string;
    let password: string;
    try {
      displayName = (await rl.question("Display name: ")).trim();
      password = await questionHidden(rl, "Password: ");
    } finally {
      rl.close();
      if (input.isTTY && input.isRaw) input.setRawMode(false);
    }
    if (!displayName) throw new Error("Display name is required.");
    if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);

    const passwordHash = await hashPassword(password);
    const user = await sql.begin(async (tx) => {
      const rows = await tx<{ id: string; email: string }[]>`
    INSERT INTO admin_users (email, normalized_email, display_name, role, status, password_hash, password_changed_at, updated_at)
    VALUES (${normalizedEmail}, ${normalizedEmail}, ${displayName}, 'admin', 'active', ${passwordHash}, now(), now())
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
      const nextUser = rows[0];
      if (!nextUser) throw new Error("Admin bootstrap did not return a user.");
      if (existingRows[0]) await tx`UPDATE admin_sessions SET revoked_at = now() WHERE user_id = ${nextUser.id} AND revoked_at IS NULL`;
      await tx`
    INSERT INTO admin_audit_logs (event, actor_id, target_type, target_id, summary, metadata)
    VALUES (
      'password_change',
      ${nextUser.id},
      'admin_user',
      ${nextUser.id},
      ${existingRows[0] ? "Admin password rotation completed through explicit bootstrap command." : "First Admin bootstrap completed."},
      '{}'::jsonb
    )
      `;
      return nextUser;
    });
    console.log(`Admin ready: ${user.email}`);
  } finally {
    await sql.end();
  }
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
