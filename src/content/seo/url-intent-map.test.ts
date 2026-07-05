import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  commercialUrlIntentMap,
  keywordFamilyMap,
  localizedCommercialRoute,
  noindexCommercialExclusions,
} from "./url-intent-map";

describe("commercial SEO architecture map", () => {
  it("has one primary URL per keyword family", () => {
    const families = new Set<string>();
    for (const entry of keywordFamilyMap) {
      expect(families.has(entry.family)).toBe(false);
      families.add(entry.family);
      expect(entry.primaryUrl).toMatch(/^\//);
      expect(entry.supportingUrls).not.toContain(entry.primaryUrl);
    }
  });

  it("does not map private or post-conversion routes as commercial targets", () => {
    const serialized = JSON.stringify({ commercialUrlIntentMap, keywordFamilyMap });
    for (const route of noindexCommercialExclusions) {
      expect(serialized).not.toContain(route);
    }
  });

  it("generates localized commercial routes with English slugs", () => {
    expect(localizedCommercialRoute("/services/technical-seo", "en")).toBe("/services/technical-seo");
    expect(localizedCommercialRoute("/services/technical-seo", "fr")).toBe("/fr/services/technical-seo");
    expect(localizedCommercialRoute("/markets/canada-seo-agency", "es")).toBe("/es/markets/canada-seo-agency");
  });

  it("keeps indexable commercial primary URLs in the sitemap", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url.replace("https://taskcover.com", "")));
    const exactPrimaryUrls = [...new Set(keywordFamilyMap.map((entry) => entry.primaryUrl))].filter(
      (url) => !url.includes("[")
    );

    for (const url of exactPrimaryUrls) {
      expect(urls.has(localizedCommercialRoute(url, "en")), `${url} should be in the English sitemap`).toBe(true);
      expect(urls.has(localizedCommercialRoute(url, "fr")), `${url} should be in the French sitemap`).toBe(true);
      expect(urls.has(localizedCommercialRoute(url, "es")), `${url} should be in the Spanish sitemap`).toBe(true);
    }
  });

  it("marks commercial inventory records with localized canonical and hreflang status", () => {
    for (const entry of commercialUrlIntentMap) {
      expect(entry.localeAvailability).toEqual(["en", "fr", "es"]);
      expect(entry.canonicalStatus).toBe("localized canonical");
      expect(entry.hreflangStatus).toBe("en/fr/es/x-default");
      if (entry.primaryIntent === "primary commercial intent") {
        expect(entry.indexable).toBe(true);
        expect(entry.recommendation).not.toBe("noindex");
      }
    }
  });
});
