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
  const provider = process.env.RATE_LIMIT_PROVIDER ?? "memory";
  if (provider !== "memory") {
    // Future durable providers plug in here. Until then, fail closed only for
    // malformed keys, not for unsupported config names.
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

export function rateLimitKeyFromRequest(ip: string, formType: string) {
  const namespace = process.env.RATE_LIMIT_NAMESPACE || "taskcover-leads";
  return `${namespace}:${formType}:${ip || "unknown"}`;
}
