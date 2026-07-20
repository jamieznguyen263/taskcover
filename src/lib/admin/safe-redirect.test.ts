import { describe, expect, it } from "vitest";
import { resolveSafeRedirect } from "./safe-redirect";

describe("resolveSafeRedirect", () => {
  it("allows same-origin absolute paths", () => {
    expect(resolveSafeRedirect("/flow")).toBe("/flow");
    expect(resolveSafeRedirect("/flow/projects/abc?work=1")).toBe("/flow/projects/abc?work=1");
    expect(resolveSafeRedirect("/admin/users")).toBe("/admin/users");
  });

  it("falls back when nothing is supplied", () => {
    expect(resolveSafeRedirect(undefined)).toBe("/admin");
    expect(resolveSafeRedirect(null)).toBe("/admin");
    expect(resolveSafeRedirect("")).toBe("/admin");
  });

  it("blocks off-site redirects", () => {
    expect(resolveSafeRedirect("https://evil.com")).toBe("/admin");
    expect(resolveSafeRedirect("//evil.com")).toBe("/admin");
    expect(resolveSafeRedirect("javascript:alert(1)")).toBe("/admin");
    expect(resolveSafeRedirect("/\\evil.com")).toBe("/admin");
  });

  it("blocks header-injection attempts", () => {
    expect(resolveSafeRedirect("/flow\nLocation: https://evil.com")).toBe("/admin");
  });

  it("honours a custom fallback", () => {
    expect(resolveSafeRedirect(undefined, "/flow")).toBe("/flow");
  });
});
