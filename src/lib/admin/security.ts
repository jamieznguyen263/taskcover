import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
export {
  ARGON2ID_PARAMS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  constantTimeEqual,
  createOpaqueToken,
  hashPassword,
  hashSecurityIdentifier,
  hashToken,
  normalizeEmail,
  summarizeUserAgent,
  validatePasswordShape,
  verifyPassword,
} from "./crypto";

export const ADMIN_SESSION_COOKIE = "taskcover_admin_session";

const loginBuckets = new Map<string, { count: number; resetsAt: number }>();

type RuntimeEnv = {
  ADMIN_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
  RATE_LIMIT_COORDINATOR?: { getByName(name: string): { check(input: { key: string; limit?: number; windowMs?: number; now?: number }): Promise<{ allowed: boolean }> } };
};

export async function checkLoginRateLimit(key: string, now = Date.now()) {
  const provider = String(process.env.AUTH_RATE_LIMIT_PROVIDER ?? "memory");
  const runtimeEnv = getRuntimeEnv();
  if (provider === "cloudflare" && runtimeEnv?.ADMIN_RATE_LIMITER) {
    const result = await runtimeEnv.ADMIN_RATE_LIMITER.limit({ key });
    return result.success;
  }
  if (provider === "durable-object" && runtimeEnv?.RATE_LIMIT_COORDINATOR) {
    const namespace = process.env.AUTH_RATE_LIMIT_NAMESPACE || "taskcover-admin-auth";
    const stub = runtimeEnv.RATE_LIMIT_COORDINATOR.getByName(`${namespace}:${key}`);
    const result = await stub.check({ key, limit: 8, windowMs: 15 * 60 * 1000, now });
    return result.allowed;
  }
  if (provider !== "memory" && process.env.NODE_ENV === "production") {
    return false;
  }

  const bucket = loginBuckets.get(key);
  if (!bucket || bucket.resetsAt <= now) {
    loginBuckets.set(key, { count: 1, resetsAt: now + 15 * 60 * 1000 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= 8;
}

export function resetLoginRateLimit(key: string) {
  loginBuckets.delete(key);
}

function getRuntimeEnv(): RuntimeEnv | undefined {
  try {
    return getCloudflareContext().env as RuntimeEnv;
  } catch {
    return undefined;
  }
}
