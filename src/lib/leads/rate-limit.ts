import { getCloudflareContext } from "@opennextjs/cloudflare";
import crypto from "node:crypto";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  key: string;
  limit?: number;
  windowMs?: number;
  now?: number;
};

export async function checkRateLimit({
  key,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  now = Date.now(),
}: RateLimitOptions): Promise<RateLimitResult> {
  const provider = String(process.env.RATE_LIMIT_PROVIDER ?? "memory");
  const runtimeEnv = getRuntimeEnv();
  if (provider === "cloudflare" && runtimeEnv?.LEAD_RATE_LIMITER) {
    const result = await runtimeEnv.LEAD_RATE_LIMITER.limit({ key });
    return { allowed: result.success, remaining: result.success ? 1 : 0, resetAt: now + windowMs };
  }
  if (provider === "durable-object" && runtimeEnv?.RATE_LIMIT_COORDINATOR) {
    const stub = runtimeEnv.RATE_LIMIT_COORDINATOR.getByName(key);
    return stub.check({ key, limit, windowMs, now });
  }
  if (provider !== "memory" && process.env.NODE_ENV === "production") {
    return { allowed: false, remaining: 0, resetAt: now + windowMs };
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}

export function isProductionRateLimitConfigured() {
  return String(process.env.RATE_LIMIT_PROVIDER ?? "memory") === "cloudflare" && Boolean(getRuntimeEnv()?.LEAD_RATE_LIMITER);
}

export function rateLimitKeyFromRequest(ip: string, formType: string) {
  const namespace = process.env.RATE_LIMIT_NAMESPACE || "taskcover-leads";
  const ipHash = crypto.createHash("sha256").update(ip || "unknown").digest("hex");
  return `${namespace}:${formType}:${ipHash}`;
}

function getRuntimeEnv():
  | {
      LEAD_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
      RATE_LIMIT_COORDINATOR?: { getByName(name: string): { check(input: RateLimitOptions): Promise<RateLimitResult> } };
    }
  | undefined {
  try {
    return getCloudflareContext().env as {
      LEAD_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
      RATE_LIMIT_COORDINATOR?: { getByName(name: string): { check(input: RateLimitOptions): Promise<RateLimitResult> } };
    };
  } catch {
    return undefined;
  }
}
