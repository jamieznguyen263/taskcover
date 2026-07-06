import { describe, expect, it } from "vitest";
import { isAnalyticsConfigured } from "./data-layer";

describe("GTM readiness", () => {
  it("does not configure GTM without an environment ID", () => {
    expect(isAnalyticsConfigured({})).toBe(false);
    expect(isAnalyticsConfigured({ NEXT_PUBLIC_GTM_ID: "" })).toBe(false);
  });

  it("respects the optional enabled flag", () => {
    expect(isAnalyticsConfigured({ NEXT_PUBLIC_GTM_ID: "GTM-TEST", NEXT_PUBLIC_GTM_ENABLED: "false" })).toBe(false);
    expect(isAnalyticsConfigured({ NEXT_PUBLIC_GTM_ID: "GTM-TEST", NEXT_PUBLIC_GTM_ENABLED: "true" })).toBe(true);
  });
});
