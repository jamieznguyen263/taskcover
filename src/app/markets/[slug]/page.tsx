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

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every market page at build time. */
export function generateStaticParams() {
  return getMarketSlugs().map((slug) => ({ slug }));
}

/** Unique metadata per market page. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const market = getMarketBySlug(slug, "en");
  if (!market) return {};

  return buildMetadata({
    title: market.metaTitle,
    description: market.metaDescription,
    path: `/markets/${market.slug}`,
    locale: "en",
  });
}

export default async function MarketDetailPage({ params }: Params) {
  const { slug } = await params;
  const market = getMarketBySlug(slug, "en");
  if (!market) {
    notFound();
  }

  const site = getSiteContent("en");
  const content = getMarketsContent("en");

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbMarkets, path: "/markets" },
      { name: market.name, path: `/markets/${market.slug}` },
    ],
    "en"
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
      <MarketPageTemplate market={market} ui={content.ui} locale="en" />
    </>
  );
}