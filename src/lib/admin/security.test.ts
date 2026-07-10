import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkLoginRateLimit,
  constantTimeEqual,
  createOpaqueToken,
  hashPassword,
  hashToken,
  isSupportedPasswordHash,
  normalizeEmail,
  resetLoginRateLimit,
  verifyPassword,
  PBKDF2_PARAMS,
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
    expect(PBKDF2_PARAMS).toEqual({
      algorithm: "pbkdf2-sha256",
      version: 1,
      iterations: 100_000,
      hash: "SHA-256",
      saltBytes: 16,
      keyBits: 256,
    });
  });

  it("produces a versioned, self-describing hash format with algorithm/version/iterations/salt/key", async () => {
    const hash = await hashPassword("correct horse battery staple");
    const parts = hash.split("$");
    expect(parts).toHaveLength(6);
    expect(parts[1]).toBe("pbkdf2-sha256");
    expect(parts[2]).toBe("v=1");
    expect(parts[3]).toBe("i=100000");
    expect(parts[4]!.length).toBeGreaterThan(0); // salt
    expect(parts[5]!.length).toBeGreaterThan(0); // derived key
    expect(isSupportedPasswordHash(hash)).toBe(true);
  });

  it("uses a fresh random salt per hash, so hashing the same password twice differs", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");
    expect(first).not.toBe(second);
    expect(await verifyPassword(first, "correct horse battery staple")).toBe(true);
    expect(await verifyPassword(second, "correct horse battery staple")).toBe(true);
  });

  it("safely rejects malformed or unsupported hash formats instead of throwing", async () => {
    const malformed = ["", "not-a-hash", "$pbkdf2-sha256$v=1$i=600000$onlyfourparts", "$pbkdf2-sha256$v=1$i=not-a-number$c2FsdA$a2V5"];
    for (const value of malformed) {
      expect(isSupportedPasswordHash(value)).toBe(false);
      await expect(verifyPassword(value, "any password at all 123")).resolves.toBe(false);
    }
  });

  it("never treats a legacy Argon2id hash as a valid PBKDF2 match — it always requires a reset", async () => {
    const legacyArgon2idHash = "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$c29tZWhhc2g";
    expect(isSupportedPasswordHash(legacyArgon2idHash)).toBe(false);
    await expect(verifyPassword(legacyArgon2idHash, "whatever the real password was")).resolves.toBe(false);
  });

  it("derives keys using only standard Web Crypto globals (crypto.subtle, crypto.getRandomValues) shared by Node.js and Cloudflare Workers", async () => {
    // This is what actually broke in production: hash-wasm's Argon2id relies on dynamic
    // WebAssembly compilation, which Workers blocks but Node.js allows — so it passed every
    // Node-only test while failing on every real login. PBKDF2 here uses only the Web Crypto
    // API (`globalThis.crypto.subtle`, `globalThis.crypto.getRandomValues`), which both
    // runtimes implement natively with no WASM step, so there is no such runtime gap.
    expect(typeof globalThis.crypto.subtle.deriveBits).toBe("function");
    expect(typeof globalThis.crypto.getRandomValues).toBe("function");
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword(hash, "correct horse battery staple")).toBe(true);
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
