import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { MarketPageTemplate } from "@/components/marketing/markets/market-template";
import {
  getMarketBySlug,
  getMarketSlugs,
  getMarketsContent,
  getSiteContent,
} from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** Pre-render fr/es market detail pages for every market slug. */
export function generateStaticParams() {
  const result: { locale: string; slug: string }[] = [];
  for (const locale of locales.filter((l) => l !== "en")) {
    for (const slug of getMarketSlugs()) {
      result.push({ locale, slug });
    }
  }
  return result;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const locale = localeParam as Locale;
  const market = getMarketBySlug(slug, locale);
  if (!market) return {};

  return buildMetadata({
    title: market.metaTitle,
    description: market.metaDescription,
    path: `/markets/${market.slug}`,
    locale,
  });
}

export default async function LocalizedMarketDetailPage({ params }: Params) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") {
    notFound();
  }
  const locale = localeParam as Locale;
  const market = getMarketBySlug(slug, locale);
  if (!market) {
    notFound();
  }

  const site = getSiteContent(locale);
  const content = getMarketsContent(locale);

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbMarkets, path: "/markets" },
      { name: market.name, path: `/markets/${market.slug}` },
    ],
    locale
  );

  const faq = faqSchema(market.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faq) }}
      />
      <MarketPageTemplate market={market} ui={content.ui} locale={locale} />
    </>
  );
}