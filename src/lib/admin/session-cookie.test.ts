import { describe, expect, it } from "vitest";
import { adminSessionCookieOptions } from "./session-cookie";

describe("admin session cookie options", () => {
  it("scopes the cookie to '/' so it reaches /api/admin/* routes (not just /admin pages)", () => {
    const options = adminSessionCookieOptions(new Date("2026-07-11T00:00:00Z"));
    // A "/admin"-scoped cookie is never sent to /api/admin/* → autosave/transition 401.
    expect(options.path).toBe("/");
  });

  it("keeps the cookie hardened", () => {
    const options = adminSessionCookieOptions(new Date());
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
  });
});
