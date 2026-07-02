import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { MarketsHubView } from "@/components/marketing/markets/markets-hub-view";
import { getMarketsContent, getSiteContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Market SEO Systems | USA, Canada & Australia Search Growth",
  description:
    "Regional SEO systems for the USA, Canada, and Australia. Each market has different SERP competition, trust signals, local demand, and AI search behavior — one connected system tuned per market.",
  path: "/markets",
  locale: "en",
});

export default function MarketsHubPage() {
  const content = getMarketsContent("en");
  const site = getSiteContent("en");

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbMarkets, path: "/markets" },
    ],
    "en"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <MarketsHubView locale="en" />
    </>
  );
}