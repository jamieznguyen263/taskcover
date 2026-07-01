/**
 * Next.js sitemap — emits /sitemap.xml with all localized routes.
 *
 * Includes:
 *  - Homepage en/fr/es
 *  - Services hub en/fr/es
 *  - All 11 service detail pages en/fr/es
 *
 * Each entry includes hreflang alternates for en/fr/es/x-default.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { locales, localizePath, type Locale } from "@/lib/i18n";
import { getServiceSlugs } from "@/lib/content";

export const dynamic = "force-static";

function alts(basePath: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of locales) {
    const code = l === "en" ? "en" : l;
    map[code] = `${siteConfig.url}${localizePath(basePath, l as Locale)}`;
  }
  map["x-default"] = `${siteConfig.url}${localizePath(basePath, "en")}`;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Homepage + services hub for each locale.
  const staticBases = ["/", "/services"];
  for (const base of staticBases) {
    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}${localizePath(base, locale as Locale)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: base === "/" ? 1 : 0.9,
        alternates: { languages: alts(base) },
      });
    }
  }

  // All 11 service detail pages for each locale.
  const slugs = getServiceSlugs();
  for (const slug of slugs) {
    const base = `/services/${slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}${localizePath(base, locale as Locale)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alts(base) },
      });
    }
  }

  return entries;
}