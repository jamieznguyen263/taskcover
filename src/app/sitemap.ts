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
import {
  getServiceSlugs,
  getIndustrySlugs,
  getMarketSlugs,
  getProofPageSlugs,
  getCaseStudySlugs,
  getSampleAuditSlugs,
} from "@/lib/content";

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

  // Homepage + top-level hubs for each locale.
  const staticBases = [
    "/",
    "/services",
    "/industries",
    "/markets",
    "/proof",
    "/work",
    "/work/case-studies",
    "/work/sample-audits",
    "/work/search-growth-frameworks",
    "/work/client-results",
  ];
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

  // All 7 industry detail pages for each locale.
  const industrySlugs = getIndustrySlugs();
  for (const slug of industrySlugs) {
    const base = `/industries/${slug}`;
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

  // All 3 market detail pages for each locale.
  const marketSlugs = getMarketSlugs();
  for (const slug of marketSlugs) {
    const base = `/markets/${slug}`;
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

  // All 5 proof detail pages for each locale.
  const proofSlugs = getProofPageSlugs();
  for (const slug of proofSlugs) {
    const base = `/proof/${slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}${localizePath(base, locale as Locale)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages: alts(base) },
      });
    }
  }

  // All 8 sample audit detail pages for each locale.
  const sampleSlugs = getSampleAuditSlugs();
  for (const slug of sampleSlugs) {
    const base = `/work/sample-audits/${slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}${localizePath(base, locale as Locale)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.72,
        alternates: { languages: alts(base) },
      });
    }
  }

  // All 10 verified case-study detail pages for each locale.
  const caseSlugs = getCaseStudySlugs();
  for (const slug of caseSlugs) {
    const base = `/work/case-studies/${slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}${localizePath(base, locale as Locale)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.76,
        alternates: { languages: alts(base) },
      });
    }
  }

  return entries;
}
