import { describe, expect, it } from "vitest";
import {
  checkLoginRateLimit,
  constantTimeEqual,
  createOpaqueToken,
  hashPassword,
  hashToken,
  normalizeEmail,
  resetLoginRateLimit,
  verifyPassword,
} from "./security";

describe("admin security", () => {
  it("hashes and verifies passwords with generic false on invalid password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toContain("correct horse");
    expect(await verifyPassword(hash, "correct horse battery staple")).toBe(true);
    expect(await verifyPassword(hash, "wrong horse battery staple")).toBe(false);
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

  it("rate limits repeated login attempts", () => {
    resetLoginRateLimit("test");
    for (let index = 0; index < 8; index += 1) expect(checkLoginRateLimit("test")).toBe(true);
    expect(checkLoginRateLimit("test")).toBe(false);
    resetLoginRateLimit("test");
  });
});
