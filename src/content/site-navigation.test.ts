import { describe, expect, it } from "vitest";
import { getHomeContent, getLocalizedSite } from "@/lib/content";
import { locales, stripLocaleFromPath, type Locale } from "@/lib/i18n";
import { trustPagePaths } from "@/content/trust";
import { keywordFamilyMap } from "@/content/seo/url-intent-map";

function siteHrefs(locale: Locale): string[] {
  const site = getLocalizedSite(locale);
  return [
    ...site.navigation.map((item) => item.href),
    ...site.megaMenu.flatMap((menu) => [
      ...(menu.cta ? [menu.cta.href] : []),
      ...menu.groups.flatMap((group) => group.links.map((link) => link.href)),
    ]),
    site.primaryCta.href,
    site.secondaryCta.href,
    ...site.footer.groups.flatMap((group) => group.links.map((link) => link.href)),
  ];
}

function pathnameOnly(path: string): string {
  return stripLocaleFromPath(path).split("?")[0] || "/";
}

describe("global site navigation IA", () => {
  it("uses the Task 13B top-level IA instead of the old flat header", () => {
    const site = getLocalizedSite("en");
    expect(site.navigation.map((item) => item.label)).toEqual([
      "Services",
      "Solutions",
      "Work",
      "Insights",
      "Company",
    ]);
    expect(site.megaMenu.map((item) => item.id)).toEqual([
      "services",
      "solutions",
      "work",
      "insights",
      "company",
    ]);
    expect(site.navigation.map((item) => item.label)).not.toContain("Industries");
    expect(site.navigation.map((item) => item.label)).not.toContain("Markets");
    expect(site.navigation.map((item) => item.label)).not.toContain("Proof");
  });

  it("localizes nested mega-menu, CTA, and footer hrefs with English slugs", () => {
    for (const locale of locales) {
      const hrefs = siteHrefs(locale);
      for (const href of hrefs) {
        expect(href).toMatch(/^\//);
        if (locale === "en") {
          expect(href.startsWith("/fr/")).toBe(false);
          expect(href.startsWith("/es/")).toBe(false);
        } else {
          expect(href === `/${locale}` || href.startsWith(`/${locale}/`)).toBe(true);
          expect(pathnameOnly(href)).not.toMatch(/^\/(fr|es)\//);
        }
      }
    }
  });

  it("keeps legal, trust, and data-request paths visible from the footer", () => {
    const footerPaths = new Set(
      getLocalizedSite("en").footer.groups.flatMap((group) =>
        group.links.map((link) => pathnameOnly(link.href))
      )
    );

    for (const path of Object.values(trustPagePaths)) {
      expect(footerPaths).toContain(path);
    }
    expect(footerPaths).toContain("/contact");
    expect(footerPaths).toContain("/free-seo-audit");
    expect(footerPaths).toContain("/book-a-call");
  });

  it("localizes the homepage dashboard and removes old hardcoded mockup copy", () => {
    const english = getHomeContent("en");
    const french = getHomeContent("fr");
    const spanish = getHomeContent("es");

    expect(english.hero.proofLine).not.toContain("Agoda");
    expect(french.hero.proofLine).not.toContain("Agoda");
    expect(spanish.hero.proofLine).not.toContain("Agoda");
    expect(french.dashboard.title).not.toBe(english.dashboard.title);
    expect(spanish.dashboard.title).not.toBe(english.dashboard.title);

    const serialized = JSON.stringify([english.dashboard, french.dashboard, spanish.dashboard]);
    expect(serialized).not.toContain("Search Intelligence Command Center");
    expect(serialized).not.toContain("Keyword opportunities");
    expect(serialized).not.toContain("Illustrative dashboard preview");
  });

  it("does not introduce root-level duplicate commercial URL targets", () => {
    const forbiddenRootDuplicates = new Set([
      "/seo-agency",
      "/technical-seo-agency",
      "/ai-search-agency",
      "/content-marketing-agency",
      "/ppc-management-agency",
      "/local-seo-agency",
      "/international-seo-agency",
      "/usa-seo-agency",
      "/canada-seo-agency",
      "/australia-seo-agency",
    ]);

    const normalizedHrefs = new Set(siteHrefs("en").map(pathnameOnly));
    for (const path of forbiddenRootDuplicates) {
      expect(normalizedHrefs).not.toContain(path);
    }

    const primaryByFamily = new Map(keywordFamilyMap.map((entry) => [entry.family, entry.primaryUrl]));
    expect(primaryByFamily.get("SEO agency")).toBe("/services/seo-agency");
    expect(primaryByFamily.get("technical SEO")).toBe("/services/technical-seo");
    expect(primaryByFamily.get("SEO services")).toBe("/services");
  });
});
