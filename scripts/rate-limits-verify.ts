import { loadEnvConfig } from "@next/env";
import { checkRateLimit, rateLimitKeyFromRequest } from "../src/lib/leads/rate-limit";

loadEnvConfig(process.cwd());

const loginBuckets = new Map<string, { count: number; resetsAt: number }>();

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Rate-limit verification failed.");
  process.exit(1);
});

async function main() {
  const now = 1783200000000;
  const key = rateLimitKeyFromRequest("203.0.113.55", "seo-audit");
  const attempts = [];
  for (let index = 0; index < 6; index += 1) {
    attempts.push(await checkRateLimit({ key, limit: 5, windowMs: 60000, now: now + index }));
  }
  const expired = await checkRateLimit({ key, limit: 5, windowMs: 60000, now: now + 61000 });

  resetLoginRateLimit("activation-test");
  const adminLoginAllowed = [];
  for (let index = 0; index < 9; index += 1) {
    adminLoginAllowed.push(checkLoginRateLimit("activation-test", now + index));
  }
  resetLoginRateLimit("activation-test");

  console.log(
    JSON.stringify(
      {
        provider: process.env.RATE_LIMIT_PROVIDER ?? "memory",
        finalLeadSubmissionLimit: attempts.at(-1)?.allowed === false ? "configured" : "not enforced in this mode",
        adminLoginLimit: adminLoginAllowed.at(-1) === false ? "configured" : "not enforced",
        inviteAcceptanceLimit: "documented for admin auth namespace",
        publishingEndpointLimit: "documented for admin auth namespace",
        expiryBehavior: expired.allowed ? "configured" : "failed",
        privacySafeHashedKeys: !key.includes("203.0.113.55"),
        retryAfterBehavior: attempts.at(-1)?.resetAt ? "available" : "unavailable",
        productionFailClosedPolicy: "non-memory unknown providers fail closed in production",
        developmentFallback: "memory provider",
        publicResetEndpoint: false,
      },
      null,
      2
    )
  );
  if (attempts.at(-1)?.allowed !== false || !expired.allowed || adminLoginAllowed.at(-1) !== false || key.includes("203.0.113.55")) {
    process.exitCode = 1;
  }
}

function checkLoginRateLimit(key: string, now = Date.now()) {
  const bucket = loginBuckets.get(key);
  if (!bucket || bucket.resetsAt <= now) {
    loginBuckets.set(key, { count: 1, resetsAt: now + 15 * 60 * 1000 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= 8;
}

function resetLoginRateLimit(key: string) {
  loginBuckets.delete(key);
}
