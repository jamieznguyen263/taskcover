import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { getLocalizedSite, getPricingContent } from "@/lib/content";
import { locales, localizePath, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import {
  defaultPricingTabId,
  pricingTabIds,
  resolvePricingTabId,
} from "@/content/pricing.types";

function allPlans(locale: Locale) {
  return getPricingContent(locale).tabs.items.flatMap((tab) => tab.plans);
}

describe("pricing page content architecture", () => {
  it("has complete localized pricing data with required disclosure notes", () => {
    for (const locale of locales) {
      const content = getPricingContent(locale);
      expect(content.hero.h1).toBeTruthy();
      expect(content.recurringNote).toMatch(/USD/);
      expect(content.scopeNote).toBeTruthy();
      expect(content.tabs.items).toHaveLength(5);
      expect(content.comparison.columns).toHaveLength(6);
      expect(content.comparison.contextTitle).toBeTruthy();
      expect(content.comparison.fullComparisonLabel).toBeTruthy();
      expect(content.comparison.rows.length).toBeGreaterThanOrEqual(15);
      expect(content.decisionGuide.paths).toHaveLength(5);
      expect(content.decisionGuide.paths.map((path) => path.tabId)).toEqual([
        "local",
        "national",
        "global",
        "mentor",
        "audits",
      ]);
      expect(content.drivers.items).toHaveLength(12);
      expect(content.customScope.useCases).toContain(
        locale === "en"
          ? "International SEO"
          : locale === "fr"
            ? "SEO international"
            : "SEO internacional"
      );
      expect(content.faq.items).toHaveLength(14);
    }
  });

  it("validates pricing tab query values and falls back safely", () => {
    for (const tabId of pricingTabIds) {
      expect(resolvePricingTabId(tabId)).toBe(tabId);
      expect(resolvePricingTabId([tabId, "local"])).toBe(tabId);
    }

    expect(resolvePricingTabId("enterprise")).toBe(defaultPricingTabId);
    expect(resolvePricingTabId(undefined)).toBe(defaultPricingTabId);
  });

  it("keeps required commercial positioning in the plan data", () => {
    const content = getPricingContent("en");
    const plans = allPlans("en");
    const local = plans.find((plan) => plan.id === "local-starter");
    const nationalGrowth = plans.find((plan) => plan.id === "national-growth");
    const mentorGrowth = plans.find((plan) => plan.id === "mentor-growth-advisory");
    const ppc = plans.find((plan) => plan.id === "ppc-management");

    expect(local?.price).toBe("From $1,000/month");
    expect(local?.scopeGuard).toContain("Designed for one location");
    expect(nationalGrowth?.recommended).toBe(true);
    expect(mentorGrowth?.recommended).toBe(true);
    expect(ppc?.price).toContain("10-12% of ad spend");
    expect(ppc?.scopeGuard).toContain("Ad spend is not included");
    expect(content.comparison.exactPricingNote).toContain("free audit");
    expect(content.recurringNote).toBe(
      "All pricing is shown in USD. Final pricing depends on market, site complexity, competition, content needs, and execution speed. Contact us or request a free audit for the most accurate scope."
    );
  });

  it("includes the SEO Mentor tab, comparison columns, and custom pricing section", () => {
    const content = getPricingContent("en");
    expect(content.tabs.items.map((tab) => tab.id)).toContain("mentor");
    expect(content.tabs.items.find((tab) => tab.id === "mentor")?.plans).toHaveLength(5);
    expect(content.comparison.columns.map((column) => column.id)).toEqual([
      "localStarter",
      "nationalFoundation",
      "nationalGrowth",
      "globalExpansion",
      "mentorGrowth",
      "enterpriseCustom",
    ]);
    expect(content.customScope.title).toBe("Need a custom scope?");
  });

  it("keeps pricing CTA hrefs localized without introducing new routes", () => {
    for (const locale of locales) {
      const content = getPricingContent(locale);
      const hrefs = [
        content.hero.primaryCta.href,
        content.hero.secondaryCta.href,
        content.customScope.primaryCta.href,
        content.customScope.secondaryCta.href,
        content.finalCta.primaryCta.href,
        content.finalCta.secondaryCta.href,
        ...content.tabs.items.flatMap((tab) => [
          ...(tab.cta ? [tab.cta.href] : []),
          ...tab.plans.flatMap((plan) => (plan.cta ? [plan.cta.href] : [])),
        ]),
      ];

      for (const href of hrefs) {
        expect(localizePath(href, locale)).toMatch(
          locale === "en" ? /^\// : new RegExp(`^/${locale}(/|$)`)
        );
      }
    }
  });

  it("localizes pricing routes and visible labels across EN/FR/ES", () => {
    expect(localizePath("/pricing", "en")).toBe("/pricing");
    expect(localizePath("/pricing", "fr")).toBe("/fr/pricing");
    expect(localizePath("/pricing", "es")).toBe("/es/pricing");

    const en = getPricingContent("en");
    const fr = getPricingContent("fr");
    const es = getPricingContent("es");

    expect(fr.hero.h1).not.toBe(en.hero.h1);
    expect(es.hero.h1).not.toBe(en.hero.h1);
    expect(fr.hero.primaryCta.label).not.toBe(en.hero.primaryCta.label);
    expect(es.hero.primaryCta.label).not.toBe(en.hero.primaryCta.label);
    expect(JSON.stringify(fr)).not.toContain("Pricing for Local, National");
    expect(JSON.stringify(es)).not.toContain("Pricing for Local, National");
  });

  it("adds Pricing to localized global navigation and footer", () => {
    for (const locale of locales) {
      const site = getLocalizedSite(locale);
      expect(site.navigation.map((item) => item.href)).toContain(localizePath("/pricing", locale));
      expect(site.footer.groups.flatMap((group) => group.links.map((link) => link.href))).toContain(
        localizePath("/pricing", locale)
      );
    }
  });

  it("includes pricing routes in the sitemap with localized alternates", async () => {
    const entries = await sitemap();
    for (const locale of locales) {
      const url = `${siteConfig.url}${localizePath("/pricing", locale)}`;
      const entry = entries.find((item) => item.url === url);
      expect(entry).toBeTruthy();
      expect(entry?.alternates?.languages?.en).toBe(`${siteConfig.url}/pricing`);
      expect(entry?.alternates?.languages?.fr).toBe(`${siteConfig.url}/fr/pricing`);
      expect(entry?.alternates?.languages?.es).toBe(`${siteConfig.url}/es/pricing`);
      expect(entry?.alternates?.languages?.["x-default"]).toBe(`${siteConfig.url}/pricing`);
    }
  });

  it("emits FAQ schema only on pages where the visible FAQ component is rendered", () => {
    const englishRoute = readFileSync(join(process.cwd(), "src/app/pricing/page.tsx"), "utf8");
    const localizedRoute = readFileSync(
      join(process.cwd(), "src/app/[locale]/pricing/page.tsx"),
      "utf8"
    );
    const view = readFileSync(
      join(process.cwd(), "src/components/marketing/pricing/pricing-page-view.tsx"),
      "utf8"
    );
    const interactiveFlow = readFileSync(
      join(process.cwd(), "src/components/marketing/pricing/pricing-interactive-flow.tsx"),
      "utf8"
    );

    expect(englishRoute).toContain("faqSchema(content.faq.items)");
    expect(localizedRoute).toContain("faqSchema(content.faq.items)");
    expect(view).toContain("FAQAccordion");
    expect(view).toContain("custom-pricing-title");
    expect(interactiveFlow).toContain("content.recurringNote");
    expect(interactiveFlow).toContain("content.comparison.fullComparisonLabel");
  });

  it("creates only the pricing route files needed for this task", () => {
    expect(existsSync(join(process.cwd(), "src/app/pricing/page.tsx"))).toBe(true);
    expect(existsSync(join(process.cwd(), "src/app/[locale]/pricing/page.tsx"))).toBe(true);
    expect(existsSync(join(process.cwd(), "src/app/seo-pricing/page.tsx"))).toBe(false);
    expect(existsSync(join(process.cwd(), "src/app/local-seo-pricing/page.tsx"))).toBe(false);
    expect(existsSync(join(process.cwd(), "src/app/national-seo-pricing/page.tsx"))).toBe(false);
  });
});
