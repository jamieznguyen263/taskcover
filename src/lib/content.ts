/**
 * Content accessors — the single entry point for locale-aware content.
 *
 * Components and routes should never import raw content files directly.
 * Instead they call:
 *   getSiteContent(locale)
 *   getHomeContent(locale)
 *   getServicesContent(locale)
 *   getServiceBySlug(slug, locale)   // merged Service with localized hero fields
 *   getServiceSlugs()                 // shared slugs across locales
 *
 * Fallback policy (see docs/I18N_STRATEGY.md):
 *  - If a locale content file is somehow missing a key, English is used.
 *  - Deep service body content (problem, approach, deliverables, etc.) is
 *    sourced from the English canonical data and may remain English in 4A.
 */

import { type Locale, localizePath } from "@/lib/i18n";
import {
  services as servicesData,
  getServiceBySlug as getBaseServiceBySlug,
  getServiceSlugs as getBaseServiceSlugs,
  type Service,
} from "@/data/services";

import { site as siteEn } from "@/content/en/site";
import { site as siteFr } from "@/content/fr/site";
import { site as siteEs } from "@/content/es/site";

import { home as homeEn } from "@/content/en/home";
import { home as homeFr } from "@/content/fr/home";
import { home as homeEs } from "@/content/es/home";

import { services as servicesEn } from "@/content/en/services";
import { services as servicesFr } from "@/content/fr/services";
import { services as servicesEs } from "@/content/es/services";

import { industries as industriesEn } from "@/content/en/industries";
import { industries as industriesFr } from "@/content/fr/industries";
import { industries as industriesEs } from "@/content/es/industries";

import type { SiteContent } from "@/content/en/site";
import type { HomeContent } from "@/content/home.types";
import type { ServicesContent } from "@/content/services.types";
import type { IndustriesContent } from "@/content/industries.types";

const siteMap: Record<Locale, SiteContent> = {
  en: siteEn,
  fr: siteFr,
  es: siteEs,
};

const homeMap: Record<Locale, HomeContent> = {
  en: homeEn,
  fr: homeFr,
  es: homeEs,
};

const servicesMap: Record<Locale, ServicesContent> = {
  en: servicesEn,
  fr: servicesFr,
  es: servicesEs,
};

const industriesMap: Record<Locale, IndustriesContent> = {
  en: industriesEn,
  fr: industriesFr,
  es: industriesEs,
};

/** All industry slugs (shared across locales — English canonical). */
export const industrySlugs = [
  "travel-seo",
  "education-seo",
  "healthcare-seo",
  "legal-immigration-seo",
  "saas-seo",
  "ecommerce-seo",
  "franchise-local-seo",
] as const;

/** Priority industries highlighted on the hub. */
export const priorityIndustrySlugs = ["travel-seo", "education-seo"] as const;

export function getSiteContent(locale: Locale): SiteContent {
  return siteMap[locale] ?? siteEn;
}

export function getHomeContent(locale: Locale): HomeContent {
  return homeMap[locale] ?? homeEn;
}

export function getServicesContent(locale: Locale): ServicesContent {
  return servicesMap[locale] ?? servicesEn;
}

/**
 * Return all service slugs. Slugs are shared across locales (English canonical).
 */
export function getServiceSlugs(): string[] {
  return getBaseServiceSlugs();
}

/**
 * Return a merged Service for a given slug + locale.
 * The high-visibility fields (h1, positioning, subheadline, summary, meta,
 * outcomePromise, title, shortLabel) are replaced with localized values when
 * available; deep body content falls back to the English canonical source.
 */
export function getServiceBySlug(slug: string, locale: Locale): Service | undefined {
  const base = getBaseServiceBySlug(slug);
  if (!base) return undefined;
  const loc = servicesMap[locale]?.services?.[slug];
  if (!loc) return base;
  return { ...base, ...loc };
}

/**
 * Return all services for a locale (merged). Useful for the hub and sitemap.
 */
export function getServices(locale: Locale): Service[] {
  return servicesData.map((s) => {
    const loc = servicesMap[locale]?.services?.[s.slug];
    return loc ? { ...s, ...loc } : s;
  });
}

/**
 * Localize all hrefs in the site content (nav + footer) for a given locale.
 * Returns a shallow copy with all `href` values passed through localizePath.
 * English hrefs stay unchanged (unprefixed); fr/es get the prefix.
 */
export function getLocalizedSite(locale: Locale): SiteContent {
  const base = getSiteContent(locale);
  const loc = (href: string) => localizePath(href, locale);
  return {
    ...base,
    navigation: base.navigation.map((n) => ({ ...n, href: loc(n.href) })),
    primaryCta: { ...base.primaryCta, href: loc(base.primaryCta.href) },
    secondaryCta: { ...base.secondaryCta, href: loc(base.secondaryCta.href) },
    footer: {
      ...base.footer,
      groups: base.footer.groups.map((g) => ({
        ...g,
        links: g.links.map((l) => ({ ...l, href: loc(l.href) })),
      })),
    },
    ui: {
      ...base.ui,
    },
  };
}

/**
 * Return industries content for a locale (hub + all 7 industries + UI strings).
 * Falls back to English if the locale file is somehow missing.
 */
export function getIndustriesContent(locale: Locale): IndustriesContent {
  return industriesMap[locale] ?? industriesEn;
}

/** Return all industry slugs (shared across locales). */
export function getIndustrySlugs(): string[] {
  return [...industrySlugs];
}

/**
 * Return a localized industry object by slug, or undefined if not found.
 */
export function getIndustryBySlug(
  slug: string,
  locale: Locale
): IndustriesContent["industries"][string] | undefined {
  const content = getIndustriesContent(locale);
  return content.industries[slug];
}

/**
 * Return all industries for a locale as an ordered array (matching hub order).
 */
export function getIndustries(
  locale: Locale
): IndustriesContent["industries"][string][] {
  const content = getIndustriesContent(locale);
  return industrySlugs
    .map((slug) => content.industries[slug])
    .filter(Boolean);
}

/** Check whether a slug is a priority industry (highlighted on the hub). */
export function isPriorityIndustry(slug: string): boolean {
  return (priorityIndustrySlugs as readonly string[]).includes(slug);
}
