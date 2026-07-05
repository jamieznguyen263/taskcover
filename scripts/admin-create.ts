import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { AdminRepository } from "../src/lib/admin/repository";
import { hashPassword } from "../src/lib/admin/security";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run admin:create -- admin@example.com");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required. Refusing to create credentials without a configured database.");
  process.exit(1);
}

const rl = readline.createInterface({ input, output });
const displayName = await rl.question("Display name: ");
const password = await rl.question("Password (input may be visible in this terminal): ");
rl.close();

const repo = new AdminRepository();
const user = await repo.upsertAdminUser({
  email,
  displayName: displayName || email,
  role: "admin",
  status: "active",
  passwordHash: await hashPassword(password),
});
await repo.audit({
  event: "password_change",
  actorId: user.id,
  targetType: "admin_user",
  targetId: user.id,
  summary: "First Admin bootstrap or password update completed.",
});
console.log(`Admin ready: ${user.email}`);
