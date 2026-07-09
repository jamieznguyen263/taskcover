import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getCaseStudies,
  getHomeContent,
  getServiceBySlug,
  getWorkContent,
} from "@/lib/content";
import { clientLogoAssets, publicClientLogoAssets } from "@/content/home-proof-assets";
import { getInsightsContent } from "@/lib/insights/content";
import { locales } from "@/lib/i18n";

describe("Task 13C reviewed UI proof data", () => {
  it("uses local verified logo assets for the homepage brand strip", () => {
    expect(clientLogoAssets).toHaveLength(12);
    expect(publicClientLogoAssets).toHaveLength(10);
    expect(
      clientLogoAssets
        .filter((asset) => asset.permissionStatus === "permission-review")
        .map((asset) => asset.id)
    ).toEqual(["british-council", "skyscanner"]);

    for (const locale of locales) {
      const home = getHomeContent(locale);
      expect(home.brandExperience.logos).toHaveLength(10);

      for (const logo of home.brandExperience.logos) {
        expect(logo.src).toMatch(/^\/brand-logos\/.+\.webp$/);
        expect(logo.alt).toContain(logo.clientName);
        expect(logo.permissionStatus).toBe("approved-case-study");
        expect(logo.caseStudySlug).toBeTruthy();
        expect(logo.width).toBeGreaterThan(400);
        expect(logo.height).toBeGreaterThan(250);
        expect(existsSync(path.join(process.cwd(), "public", logo.src.replace(/^\//, "")))).toBe(true);
      }

      const publicIds = new Set(home.brandExperience.logos.map((logo) => logo.id));
      expect(publicIds.has("british-council")).toBe(false);
      expect(publicIds.has("skyscanner")).toBe(false);
    }
  });

  it("keeps homepage Stream video card and radial-map copy localized", () => {
    const english = getHomeContent("en");
    for (const locale of locales) {
      const home = getHomeContent(locale);
      expect(home.heroVideo.previewIframeUrl).toContain("cloudflarestream.com");
      expect(home.heroVideo.playerIframeUrl).toContain("cloudflarestream.com");
      expect(home.heroVideo.posterUrl).toContain("thumbnail.jpg");
      expect(home.heroVideo.playLabel).toBeTruthy();
      expect(home.heroVideo.modalTitle).toBeTruthy();
      expect(home.searchHasChanged.surfaces).toHaveLength(9);
      for (const surface of home.searchHasChanged.surfaces) {
        expect(surface.ariaLabel).toBeTruthy();
        expect(surface.buyersSee).toBeTruthy();
        expect(surface.taskcoverImproves).toBeTruthy();
        expect(surface.growthSupport).toBeTruthy();
      }
    }
    expect(getHomeContent("fr").heroVideo.caption).not.toBe(english.heroVideo.caption);
    expect(getHomeContent("es").searchHasChanged.labels.startHere).not.toBe(english.searchHasChanged.labels.startHere);
  });

  it("maps case-study services to localized names instead of raw slugs", () => {
    const slugLike = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

    for (const locale of locales) {
      const cases = getCaseStudies(locale);
      expect(cases).toHaveLength(10);
      for (const item of cases) {
        expect(item.visualGallery[0]?.src).toMatch(/^\/case-studies\//);
        expect(item.metrics.some((metric) => metric.displayPublicly && metric.context.length > 20)).toBe(true);
        for (const slug of item.serviceSlugs) {
          const service = getServiceBySlug(slug, locale);
          expect(service?.title).toBeTruthy();
          expect(service?.title).not.toMatch(slugLike);
        }
      }
    }
  });

  it("has localized labels for the reviewed case library and results modules", () => {
    for (const locale of locales) {
      const ui = getWorkContent(locale).ui;
      expect(ui.caseStudyLibrary).toBeTruthy();
      expect(ui.verifiedOutcomesByGrowthLever).toBeTruthy();
      expect(ui.serviceToProofMap).toBeTruthy();
      expect(ui.caseToResultMatrix).toBeTruthy();
      expect(ui.clearFilters).toBeTruthy();
      expect(ui.resultCount).toContain("{count}");
    }
  });

  it("feeds the insights conversion rail from article metadata", () => {
    for (const locale of locales) {
      const content = getInsightsContent(locale);
      expect(content.ui.relatedSample).toBeTruthy();
      expect(content.ui.startFreeAudit).toBeTruthy();
      const published = content.articles.filter((article) => article.status === "published");
      expect(published.length).toBeGreaterThan(0);
      for (const article of published) {
        expect(article.internalLinking.serviceLinks.length).toBeGreaterThan(0);
        expect(article.internalLinking.sampleAuditLinks.length).toBeGreaterThan(0);
      }
    }
  });
});
