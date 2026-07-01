/**
 * SEO helpers for Taskcover Agency.
 *
 * Design rules (see docs/SEO_STANDARDS.md):
 *  - No fake review schema.
 *  - No spammy aggregate ratings.
 *  - Only emit schema types we can back with real data.
 *  - Safe placeholders for Organization fields (omit phone/address until verified).
 *
 * i18n (Task 4A):
 *  - buildMetadata() now accepts an optional locale + base path and emits
 *    canonical, hreflang alternates, and a localized OG locale.
 *  - English stays unprefixed; fr/es are prefixed.
 */

import type { Metadata } from "next";
import { siteConfig } from "./site";
import {
  type Locale,
  defaultLocale,
  localizePath,
  getAlternateHreflangs,
  localeOgLocale,
} from "./i18n";

type BuildMetadataInput = {
  title: string;
  description: string;
  /**
   * Base path WITHOUT locale prefix, e.g. "/" or "/services/technical-seo".
   * The helper localizes it for the current locale (canonical) and all alts.
   */
  path?: string;
  /** Active locale for this page. Defaults to English. */
  locale?: Locale;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path = "/",
  locale = defaultLocale,
  ogImage,
  noIndex = false,
  keywords = [],
}: BuildMetadataInput): Metadata {
  const localizedPath = localizePath(path, locale);
  const canonicalUrl = `${siteConfig.url}${localizedPath}`;
  const image = ogImage ?? siteConfig.ogImage;

  // Build hreflang alternates as absolute URLs.
  const alternates = getAlternateHreflangs(path).map((alt) => ({
    hreflang: alt.hreflang,
    href: `${siteConfig.url}${alt.href}`,
  }));

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        alternates.map((a) => [a.hreflang, a.href])
      ),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${title} | ${siteConfig.name}`,
      siteName: siteConfig.name,
      description,
      locale: localeOgLocale[locale],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [image],
    },
  };
}

/**
 * Safe Organization schema.
 * Intentionally omits phone, address, founder, foundingDate, awards, and
 * aggregateRating until verified data is available. Do not invent values.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: "Taskcover",
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    areaServed: siteConfig.markets.map((country) => ({
      "@type": "Country",
      name: country,
    })),
    knowsAbout: [
      "SEO Strategy",
      "Technical SEO",
      "AI Search Optimization",
      "Content Marketing",
      "Digital PR",
      "Local SEO",
      "eCommerce SEO",
      "International SEO",
      "Search Analytics",
    ],
    logo: `${siteConfig.url}${siteConfig.logo.horizontal}`,
  };
}

/**
 * BreadcrumbList schema builder.
 * Items use the UNPREFIXED base path + a locale; the builder localizes the path.
 */
export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(
  items: BreadcrumbItem[],
  locale: Locale = defaultLocale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${localizePath(item.path, locale)}`,
    })),
  };
}

/**
 * FAQPage schema builder.
 * Only call this on pages where the FAQs are genuinely visible in the DOM.
 */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/**
 * Serialize a JSON-LD object for safe inline rendering.
 * Escapes "<" to mitigate XSS injection per Next.js docs guidance.
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}