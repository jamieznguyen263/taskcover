import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { clientLogoAssets, publicClientLogoAssets } from "@/content/client-logo-assets";
import { keywordFamilyMap } from "@/content/seo/url-intent-map";
import { getHomeContent, getProofPageSlugs } from "@/lib/content";
import {
  getLocaleFromPathname,
  locales,
  localizePath,
  stripLocaleFromPath,
  type Locale,
} from "@/lib/i18n";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { buildSitemapEntries as sitemap } from "@/lib/sitemap";

function pathFromUrl(value: string) {
  const url = new URL(value);
  return `${url.pathname}${url.search}`;
}

function expectedAlternates(basePath: string) {
  return Object.fromEntries([
    ...locales.map((locale) => [
      locale,
      `${siteConfig.url}${localizePath(basePath, locale as Locale)}`,
    ]),
    ["x-default", `${siteConfig.url}${localizePath(basePath, "en")}`],
  ]);
}

describe("technical SEO launch rules", () => {
  it("emits robots rules with sitemap and private path exclusions", () => {
    const config = robots();
    const disallow = Array.isArray(config.rules)
      ? config.rules.flatMap((rule) => rule.disallow ?? [])
      : config.rules.disallow ?? [];
    const disallowText = Array.isArray(disallow) ? disallow.join(" ") : String(disallow);

    expect(config.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    expect(disallowText).toContain("/admin");
    expect(disallowText).toContain("/api");
    expect(disallowText).toContain("/thank-you");
    expect(disallowText).not.toContain("/_next");
    expect(disallowText).not.toContain("/brand");
  });

  it("keeps sitemap canonical, localized, and free of private/query URLs", async () => {
    const entries = await sitemap();
    const paths = entries.map((entry) => pathFromUrl(entry.url));

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.some((path) => path.includes("/admin"))).toBe(false);
    expect(paths.some((path) => path.includes("/api"))).toBe(false);
    expect(paths.some((path) => path.includes("/thank-you"))).toBe(false);
    expect(paths.some((path) => path.includes("?"))).toBe(false);

    for (const route of ["/pricing", "/about", "/methodology", "/how-we-work", "/work/case-studies", "/work/sample-audits"]) {
      for (const locale of locales) {
        expect(paths).toContain(localizePath(route, locale as Locale));
      }
    }

    for (const slug of getProofPageSlugs()) {
      for (const locale of locales) {
        expect(paths).toContain(localizePath(`/proof/${slug}`, locale as Locale));
      }
    }
  });

  it("keeps sitemap hreflang alternates reciprocal by locale", async () => {
    const entries = await sitemap();
    for (const entry of entries) {
      const path = pathFromUrl(entry.url);
      const base = stripLocaleFromPath(path);
      const locale = getLocaleFromPathname(path);
      const expected = expectedAlternates(base);
      expect(entry.url).toBe(`${siteConfig.url}${localizePath(base, locale)}`);
      expect(entry.alternates?.languages).toMatchObject(expected);
    }
  });

  it("keeps pricing tabs canonicalized to the clean localized route", () => {
    for (const locale of locales) {
      const metadata = buildMetadata({
        title: "Pricing",
        description: "Pricing check",
        path: "/pricing",
        locale: locale as Locale,
      });
      expect(metadata.alternates?.canonical).toBe(
        `${siteConfig.url}${localizePath("/pricing", locale as Locale)}`
      );
    }
  });

  it("uses verified Organization schema fields only", () => {
    const schema = organizationSchema();
    const serialized = JSON.stringify(schema);
    expect(schema).toMatchObject({
      "@type": "Organization",
      name: "Taskcover Agency",
      legalName: "Stoa Global Corporation",
      email: "business@taskcover.com",
      telephone: "+1 (802) 802-9299",
      address: {
        streetAddress: "169 Madison Avenue",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10016",
        addressCountry: "United States",
      },
    });
    expect(serialized).not.toMatch(/Review|AggregateRating|LocalBusiness|sameAs/);
  });

  it("keeps public logo registry safe and permission-review brands hidden", () => {
    for (const asset of publicClientLogoAssets) {
      expect(asset.alt).toBeTruthy();
      expect(existsSync(join(process.cwd(), "public", asset.logoPath.replace(/^\//, "")))).toBe(true);
    }

    for (const asset of clientLogoAssets.filter((item) => item.permissionStatus === "permission-review")) {
      expect(asset.publicUsage).toBe(false);
    }
  });

  it("keeps homepage market card CTA labels localized", () => {
    expect(getHomeContent("en").ui.viewMarket).toBe("View market");
    expect(getHomeContent("fr").ui.viewMarket).toBe("Voir le marché");
    expect(getHomeContent("es").ui.viewMarket).toBe("Ver mercado");
  });

  it("preserves one primary URL per keyword family", () => {
    const families = new Set<string>();
    for (const entry of keywordFamilyMap) {
      expect(families.has(entry.family)).toBe(false);
      families.add(entry.family);
      expect(entry.primaryUrl).toMatch(/^\//);
    }
  });
});
