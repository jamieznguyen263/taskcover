import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getDb", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/test";
  });

  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("creates a fresh client on every call instead of caching one across requests", async () => {
    // Cloudflare Workers cannot reuse I/O objects (DB connections) across requests: a connection
    // created during one request hangs forever if reused by a later request instead of erroring.
    // A module-level cached client is exactly the anti-pattern that caused a real production
    // outage (intermittent hung logins). This test guards against that pattern reappearing.
    const { getDb } = await import("./client");
    const first = getDb();
    const second = getDb();
    expect(first).not.toBe(second);
  });
});
