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

import { markets as marketsEn } from "@/content/en/markets";
import { markets as marketsFr } from "@/content/fr/markets";
import { markets as marketsEs } from "@/content/es/markets";

import { proof as proofEn } from "@/content/en/proof";
import { proof as proofFr } from "@/content/fr/proof";
import { proof as proofEs } from "@/content/es/proof";
import { work as workEn } from "@/content/en/work";
import { work as workFr } from "@/content/fr/work";
import { work as workEs } from "@/content/es/work";
import { leads as leadsEn } from "@/content/en/leads";
import { leads as leadsFr } from "@/content/fr/leads";
import { leads as leadsEs } from "@/content/es/leads";
import { pricing as pricingEn } from "@/content/en/pricing";
import { pricing as pricingFr } from "@/content/fr/pricing";
import { pricing as pricingEs } from "@/content/es/pricing";
import {
  getProofItemsByType,
  getPrivateReferenceAvailability,
  getPublicProofItems,
  getVerifiedPublicProofItems,
  getVerifiedPublicProofItemsByType,
} from "@/content/proof.registry";
import {
  getPublicCaseStudies,
  getVerifiedPublicResults,
  getWorkItemsByType,
} from "@/content/work.registry";

import type { SiteContent } from "@/content/en/site";
import type { HomeContent } from "@/content/home.types";
import type { ServicesContent } from "@/content/services.types";
import type { IndustriesContent } from "@/content/industries.types";
import type { MarketsContent } from "@/content/markets.types";
import type { ProofContent, ProofPageSlug, ProofType } from "@/content/proof.types";
import type {
  CaseStudy,
  CaseStudySlug,
  SampleAuditSlug,
  WorkContent,
  WorkPageSlug,
  WorkType,
} from "@/content/work.types";
import type { LeadsContent } from "@/content/leads.types";
import type { PricingContent } from "@/content/pricing.types";

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

const marketsMap: Record<Locale, MarketsContent> = {
  en: marketsEn,
  fr: marketsFr,
  es: marketsEs,
};

const proofMap: Record<Locale, ProofContent> = {
  en: proofEn,
  fr: proofFr,
  es: proofEs,
};

const workMap: Record<Locale, WorkContent> = {
  en: workEn,
  fr: workFr,
  es: workEs,
};

const leadsMap: Record<Locale, LeadsContent> = {
  en: leadsEn,
  fr: leadsFr,
  es: leadsEs,
};

const pricingMap: Record<Locale, PricingContent> = {
  en: pricingEn,
  fr: pricingFr,
  es: pricingEs,
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
    megaMenu: base.megaMenu.map((item) => ({
      ...item,
      groups: item.groups.map((group) => ({
        ...group,
        links: group.links.map((link) => ({ ...link, href: loc(link.href) })),
      })),
      cta: item.cta ? { ...item.cta, href: loc(item.cta.href) } : undefined,
    })),
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

/* -------------------------------------------------------------------------- */
/* Markets                                                                     */
/* -------------------------------------------------------------------------- */

/** All market slugs (shared across locales — English canonical). */
export const marketSlugs = [
  "usa-seo-agency",
  "canada-seo-agency",
  "australia-seo-agency",
] as const;

/** All proof detail slugs (shared across locales). */
export const proofPageSlugs = [
  "brand-experience",
  "media-features",
  "client-reviews",
  "video-reviews",
  "spokesperson",
] as const satisfies readonly ProofPageSlug[];

export const workPageSlugs = [
  "case-studies",
  "sample-audits",
  "search-growth-frameworks",
  "client-results",
] as const satisfies readonly WorkPageSlug[];

export const sampleAuditSlugs = [
  "technical-seo-audit",
  "ai-search-visibility-review",
  "content-gap-map",
  "local-seo-audit",
  "ecommerce-search-architecture",
  "international-seo-market-map",
  "ppc-organic-intelligence",
  "90-day-search-growth-roadmap",
] as const satisfies readonly SampleAuditSlug[];

export const caseStudySlugs = [
  "british-university-vietnam",
  "casa-madera",
  "the-bamboo-bar",
  "matthew-jeffery-law-firm",
  "skatepro",
  "agoda",
  "avis",
  "novaworld",
  "ccleaner",
  "fwd-insurance",
] as const satisfies readonly CaseStudySlug[];

/**
 * Return markets content for a locale (hub + all 3 markets + UI strings).
 * Falls back to English if the locale file is somehow missing.
 */
export function getMarketsContent(locale: Locale): MarketsContent {
  return marketsMap[locale] ?? marketsEn;
}

/** Return all market slugs (shared across locales). */
export function getMarketSlugs(): string[] {
  return [...marketSlugs];
}

/**
 * Return a localized market object by slug, or undefined if not found.
 */
export function getMarketBySlug(
  slug: string,
  locale: Locale
): MarketsContent["markets"][string] | undefined {
  const content = getMarketsContent(locale);
  return content.markets[slug];
}

/**
 * Return all markets for a locale as an ordered array (matching hub order).
 */
export function getMarkets(
  locale: Locale
): MarketsContent["markets"][string][] {
  const content = getMarketsContent(locale);
  return marketSlugs
    .map((slug) => content.markets[slug])
    .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* Proof + Authority                                                           */
/* -------------------------------------------------------------------------- */

export function getProofContent(locale: Locale): ProofContent {
  return proofMap[locale] ?? proofEn;
}

export function getProofPageBySlug(
  slug: string,
  locale: Locale
): ProofContent["pages"][ProofPageSlug] | undefined {
  if (!(proofPageSlugs as readonly string[]).includes(slug)) return undefined;
  return getProofContent(locale).pages[slug as ProofPageSlug];
}

export function getProofPageSlugs(): string[] {
  return [...proofPageSlugs];
}

export {
  getProofItemsByType,
  getPrivateReferenceAvailability,
  getPublicProofItems,
  getVerifiedPublicProofItems,
  getVerifiedPublicProofItemsByType,
};

export type { ProofPageSlug, ProofType };

/* -------------------------------------------------------------------------- */
/* Work                                                                        */
/* -------------------------------------------------------------------------- */

export function getWorkContent(locale: Locale): WorkContent {
  return workMap[locale] ?? workEn;
}

export function getLeadsContent(locale: Locale): LeadsContent {
  return leadsMap[locale] ?? leadsEn;
}

export function getPricingContent(locale: Locale): PricingContent {
  return pricingMap[locale] ?? pricingEn;
}

export function getWorkPageContent(
  slug: string,
  locale: Locale
): WorkContent["pages"][WorkPageSlug] | undefined {
  if (!(workPageSlugs as readonly string[]).includes(slug)) return undefined;
  return getWorkContent(locale).pages[slug as WorkPageSlug];
}

export function getSampleAuditBySlug(
  slug: string,
  locale: Locale
): WorkContent["samples"][SampleAuditSlug] | undefined {
  if (!(sampleAuditSlugs as readonly string[]).includes(slug)) return undefined;
  return getWorkContent(locale).samples[slug as SampleAuditSlug];
}

export function getSampleAuditSlugs(): string[] {
  return [...sampleAuditSlugs];
}

export function getCaseStudySlugs(): string[] {
  return [...caseStudySlugs];
}

export function getCaseStudyBySlug(
  slug: string,
  locale: Locale
): CaseStudy | undefined {
  if (!(caseStudySlugs as readonly string[]).includes(slug)) return undefined;
  return getWorkContent(locale).caseStudyDetails[slug as CaseStudySlug];
}

export function getCaseStudies(locale: Locale): CaseStudy[] {
  const content = getWorkContent(locale);
  return caseStudySlugs.map((slug) => content.caseStudyDetails[slug]).filter(Boolean);
}

export {
  getPublicCaseStudies,
  getVerifiedPublicResults,
  getWorkItemsByType,
};

export type { SampleAuditSlug, WorkPageSlug, WorkType };
export type { CaseStudySlug };
