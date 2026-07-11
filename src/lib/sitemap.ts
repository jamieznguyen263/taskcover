import { insightCategorySlugs } from "@/content/insights.types";
import { trustPagePaths } from "@/content/trust";
import {
  getCaseStudySlugs,
  getIndustrySlugs,
  getMarketSlugs,
  getProofPageSlugs,
  getSampleAuditSlugs,
  getServiceSlugs,
} from "@/lib/content";
import { locales, localizePath, type Locale } from "@/lib/i18n";
import { getInsightSitemapRecords, type InsightSitemapRecord } from "@/lib/insights/content";
import { siteConfig } from "@/lib/site";

type SitemapChangeFrequency = "weekly" | "monthly";

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
  alternates: { languages: Record<string, string> };
};

function articleLastModified(value: string, fallback: Date) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export function buildInsightSitemapEntries(records: InsightSitemapRecord[], fallbackLastModified: Date): SitemapEntry[] {
  const groups = new Map<string, InsightSitemapRecord[]>();
  for (const record of records) {
    const group = groups.get(record.translationGroupId) ?? [];
    group.push(record);
    groups.set(record.translationGroupId, group);
  }

  return records.map((record) => {
    const siblings = groups.get(record.translationGroupId) ?? [record];
    const languages = Object.fromEntries(
      siblings.map((sibling) => [
        sibling.locale,
        canonicalUrl(`/insights/${sibling.categorySlug}/${sibling.articleSlug}`, sibling.locale),
      ])
    );
    const fallback = siblings.find((sibling) => sibling.locale === "en") ?? siblings[0];
    if (fallback) {
      languages["x-default"] = canonicalUrl(`/insights/${fallback.categorySlug}/${fallback.articleSlug}`, fallback.locale);
    }
    return {
      url: canonicalUrl(`/insights/${record.categorySlug}/${record.articleSlug}`, record.locale),
      lastModified: articleLastModified(record.updatedAt, fallbackLastModified),
      changeFrequency: "monthly",
      priority: 0.74,
      alternates: { languages },
    };
  });
}

const canonicalOrigin = siteConfig.url.replace(/\/+$/, "");

function canonicalUrl(basePath: string, locale: Locale) {
  return `${canonicalOrigin}${localizePath(basePath, locale)}`;
}

function alternatesFor(basePath: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[locale] = canonicalUrl(basePath, locale);
  }
  alternates["x-default"] = canonicalUrl(basePath, "en");
  return alternates;
}

function addLocalizedEntries(
  entries: SitemapEntry[],
  basePath: string,
  options: { lastModified: Date; changeFrequency: SitemapChangeFrequency; priority: number }
) {
  const alternates = alternatesFor(basePath);
  for (const locale of locales) {
    entries.push({
      url: canonicalUrl(basePath, locale),
      lastModified: options.lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: { languages: alternates },
    });
  }
}

export async function buildSitemapEntries(lastModified = new Date(), insightRecords?: InsightSitemapRecord[]): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  const staticBases = [
    "/",
    "/services",
    "/industries",
    "/markets",
    "/proof",
    "/work",
    "/insights",
    "/work/case-studies",
    "/work/sample-audits",
    "/work/search-growth-frameworks",
    "/work/client-results",
    "/pricing",
    "/free-seo-audit",
    "/book-a-call",
    "/contact",
    ...Object.values(trustPagePaths),
  ];

  for (const basePath of staticBases) {
    addLocalizedEntries(entries, basePath, {
      lastModified,
      changeFrequency: "weekly",
      priority: basePath === "/" ? 1 : 0.9,
    });
  }

  for (const slug of insightCategorySlugs) {
    addLocalizedEntries(entries, `/insights/${slug}`, {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.78,
    });
  }

  entries.push(...buildInsightSitemapEntries(insightRecords ?? await getInsightSitemapRecords(), lastModified));

  for (const slug of getServiceSlugs()) {
    addLocalizedEntries(entries, `/services/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const slug of getIndustrySlugs()) {
    addLocalizedEntries(entries, `/industries/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const slug of getMarketSlugs()) {
    addLocalizedEntries(entries, `/markets/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const slug of getProofPageSlugs()) {
    addLocalizedEntries(entries, `/proof/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const slug of getSampleAuditSlugs()) {
    addLocalizedEntries(entries, `/work/sample-audits/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.72,
    });
  }

  for (const slug of getCaseStudySlugs()) {
    addLocalizedEntries(entries, `/work/case-studies/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.76,
    });
  }

  return entries;
}

export function renderSitemapXml(entries: SitemapEntry[]) {
  const urls = entries.map((entry) => {
    const links = Object.entries(entry.alternates.languages)
      .map(
        ([hreflang, href]) =>
          `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`
      )
      .join("");

    return [
      "<url>",
      `<loc>${escapeXml(entry.url)}</loc>`,
      links,
      `<lastmod>${entry.lastModified.toISOString()}</lastmod>`,
      `<changefreq>${entry.changeFrequency}</changefreq>`,
      `<priority>${entry.priority}</priority>`,
      "</url>",
    ].join("");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

export async function renderTaskcoverSitemapXml(lastModified = new Date()) {
  return renderSitemapXml(await buildSitemapEntries(lastModified));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
