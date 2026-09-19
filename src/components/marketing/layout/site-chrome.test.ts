import { describe, expect, it } from "vitest";
import { isApplicationRoute } from "./site-chrome";

describe("site chrome route split", () => {
  it("treats Flow and the CMS as application routes in every locale", () => {
    for (const path of ["/flow", "/flow/projects", "/flow/clients/abc", "/admin", "/admin/insights", "/fr/flow", "/es/admin/media"]) {
      expect(isApplicationRoute(path)).toBe(true);
    }
  });

  it("keeps marketing pages on the public chrome", () => {
    for (const path of ["/", "/pricing", "/services/technical-seo", "/fr/insights", "/work/case-studies/example"]) {
      expect(isApplicationRoute(path)).toBe(false);
    }
  });

  it("does not match routes that merely start with the same letters", () => {
    expect(isApplicationRoute("/flowers")).toBe(false);
    expect(isApplicationRoute("/administration-services")).toBe(false);
  });

  it("falls back to the public chrome when the pathname is unknown", () => {
    expect(isApplicationRoute(null)).toBe(false);
    expect(isApplicationRoute(undefined)).toBe(false);
  });
});
