import { describe, expect, it } from "vitest";
import { isTrackingExcludedPath, pageTypeForPath, sanitizePathOnly } from "./routes";

describe("analytics route safety", () => {
  it("excludes Admin, API, preview, invite, internal, and debug routes", () => {
    for (const path of ["/admin", "/fr/admin/users", "/api/leads", "/preview/foo", "/insights/a/b/preview", "/invite/abc", "/internal/health", "/debug/analytics"]) {
      expect(isTrackingExcludedPath(path)).toBe(true);
    }
  });

  it("excludes Taskcover Flow — staff using the internal PM app are not marketing traffic", () => {
    for (const path of ["/flow", "/flow/projects", "/flow/clients/abc", "/fr/flow/inbox"]) {
      expect(isTrackingExcludedPath(path)).toBe(true);
    }
  });

  it("allows public and supporting thank-you routes without query leakage", () => {
    expect(isTrackingExcludedPath("/thank-you?type=seo-audit")).toBe(false);
    expect(sanitizePathOnly("/pricing?tab=mentor&gclid=secret")).toBe("/pricing");
    expect(pageTypeForPath("/fr/work/case-studies/example")).toBe("case_study");
  });
});
