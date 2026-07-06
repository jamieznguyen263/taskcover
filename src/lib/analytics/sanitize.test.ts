import { describe, expect, it } from "vitest";
import { dataLayerEventObject, sanitizeAnalyticsPayload } from "./sanitize";

describe("analytics sanitizer", () => {
  it("keeps safe event fields and strips PII-shaped metadata", () => {
    const safe = sanitizeAnalyticsPayload({
      locale: "en",
      page_path: "/free-seo-audit?gclid=secret&email=test@example.com",
      pricing_tab: "mentor",
      form_type: "seo-audit",
      name: "Jane",
      email: "jane@example.com",
      phone: "+15555555555",
      message: "private details",
      full_url: "https://example.com/?gclid=secret",
      websiteUrl: "https://lead.example",
      turnstileToken: "token",
      gclid: "raw-click-id",
      gclid_present: true,
    });
    expect(safe).toEqual({
      locale: "en",
      page_path: "/free-seo-audit",
      pricing_tab: "mentor",
      form_type: "seo-audit",
      gclid_present: true,
    });
  });

  it("builds stable dataLayer objects without raw URL query values", () => {
    expect(dataLayerEventObject("pricing_tab_view", { page_path: "/pricing?tab=mentor", pricing_tab: "mentor" })).toEqual({
      event: "pricing_tab_view",
      event_name: "pricing_tab_view",
      page_path: "/pricing",
      pricing_tab: "mentor",
    });
  });
});
