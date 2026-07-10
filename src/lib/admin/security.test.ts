import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkLoginRateLimit,
  constantTimeEqual,
  createOpaqueToken,
  hashPassword,
  hashToken,
  normalizeEmail,
  resetLoginRateLimit,
  verifyPassword,
  ARGON2ID_PARAMS,
} from "./security";

describe("admin security", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it("hashes and verifies passwords with generic false on invalid password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toContain("correct horse");
    expect(await verifyPassword(hash, "correct horse battery staple")).toBe(true);
    expect(await verifyPassword(hash, "wrong horse battery staple")).toBe(false);
    expect(ARGON2ID_PARAMS).toEqual({ memorySize: 19456, iterations: 2, parallelism: 1, hashLength: 32 });
  });

  it("normalizes email and hashes opaque tokens", () => {
    const token = createOpaqueToken();
    expect(token).toHaveLength(43);
    expect(hashToken(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(normalizeEmail(" Admin@Example.COM ")).toBe("admin@example.com");
  });

  it("uses constant time equality only for equal-length strings", () => {
    expect(constantTimeEqual("abc", "abc")).toBe(true);
    expect(constantTimeEqual("abc", "abd")).toBe(false);
    expect(constantTimeEqual("abc", "abcd")).toBe(false);
  });

  it("rate limits repeated login attempts", async () => {
    resetLoginRateLimit("test");
    for (let index = 0; index < 8; index += 1) expect(await checkLoginRateLimit("test")).toBe(true);
    expect(await checkLoginRateLimit("test")).toBe(false);
    resetLoginRateLimit("test");
  });

  it("fails closed in production when the configured Cloudflare binding is unavailable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AUTH_RATE_LIMIT_PROVIDER", "cloudflare");
    expect(await checkLoginRateLimit("missing-binding")).toBe(false);
  });
});
