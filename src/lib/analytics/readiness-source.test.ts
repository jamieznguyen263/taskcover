import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("analytics and consent source guardrails", () => {
  it("keeps consent banner localized and non-essential choices off by default", () => {
    const banner = source("src/components/marketing/analytics/consent-banner.tsx");
    expect(banner).toContain('fr: {');
    expect(banner).toContain('accept: "Tout accepter"');
    expect(banner).toContain('es: {');
    expect(banner).toContain('reject: "Rechazar no esenciales"');
    expect(banner).toContain("const defaultChoices: BannerState = { preferences: false, analytics: false, marketing: false }");
  });

  it("uses the same consent helper from banner and preferences page", () => {
    const banner = source("src/components/marketing/analytics/consent-banner.tsx");
    const preferences = source("src/components/marketing/trust/cookie-preferences-client.tsx");
    expect(banner).toContain("saveConsentPreferences");
    expect(preferences).toContain("saveConsentPreferences");
    expect(preferences).toContain("defaultConsentPreferences");
  });

  it("keeps primary conversion success out of thank-you pages", () => {
    expect(source("src/components/marketing/analytics/thank-you-analytics.tsx")).toContain('"thank_you_view"');
    expect(source("src/components/marketing/analytics/thank-you-analytics.tsx")).not.toContain("trackAcceptedLeadSuccess");
  });
});
