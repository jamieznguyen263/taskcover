import { afterEach, describe, expect, it } from "vitest";
import { createConsentPreferences } from "@/lib/consent/preferences";
import { googleAdsConversionLabel, isGoogleAdsConversionConfigured, pushGoogleAdsConversion } from "./google-ads";

const env = {
  NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123",
  NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL: "free-label",
  NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL: "call-label",
  NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL: "contact-label",
};

describe("Google Ads conversion readiness", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    delete process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    delete process.env.NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL;
  });

  it("requires conversion ID and action label", () => {
    expect(isGoogleAdsConversionConfigured("free_audit", env)).toBe(true);
    expect(googleAdsConversionLabel("strategy_call", env)).toBe("call-label");
    expect(isGoogleAdsConversionConfigured("contact", { NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123" })).toBe(false);
  });

  it("does not push conversions without marketing consent", () => {
    const win = fakeWindow();
    const denied = createConsentPreferences({ analytics: true, marketing: false });
    expect(pushGoogleAdsConversion("free_audit", { requestType: "seo-audit", locale: "en", pagePath: "/free-seo-audit" }, denied)).toBe(false);
    expect(win.dataLayer).toEqual([]);
  });

  it("pushes a PII-free readiness event when configured and marketing consent is granted", () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = "AW-123";
    process.env.NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL = "free-label";
    const win = fakeWindow();
    const granted = createConsentPreferences({ marketing: true });
    expect(pushGoogleAdsConversion("free_audit", { requestType: "seo-audit", locale: "en", pagePath: "/free-seo-audit?email=x" }, granted)).toBe(true);
    expect(win.dataLayer[0]).toMatchObject({
      event: "google_ads_conversion_ready",
      conversion_action: "free_audit",
      conversion_label: "free-label",
      request_type: "seo-audit",
      page_path: "/free-seo-audit",
    });
  });
});

function fakeWindow() {
  const win = {
    location: { pathname: "/free-seo-audit" },
    dataLayer: [] as unknown[],
    dispatchEvent: () => true,
  };
  (globalThis as unknown as Record<string, unknown>).window = win;
  return win;
}
