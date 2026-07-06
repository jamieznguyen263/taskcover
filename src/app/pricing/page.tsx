import type { Metadata } from "next";
import { PricingPageView } from "@/components/marketing/pricing/pricing-page-view";
import { getPricingContent } from "@/lib/content";
import { resolvePricingTabId } from "@/content/pricing.types";
import {
  breadcrumbSchema,
  faqSchema,
  serializeJsonLd,
  buildMetadata,
} from "@/lib/seo";

const content = getPricingContent("en");
type PricingPageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export const metadata: Metadata = buildMetadata({
  title: content.metadata.title,
  description: content.metadata.description,
  path: "/pricing",
  locale: "en",
});

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const initialTab = resolvePricingTabId((await searchParams).tab);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.breadcrumbs.home, path: "/" },
                { name: content.breadcrumbs.pricing, path: "/pricing" },
              ],
              "en"
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(faqSchema(content.faq.items)),
        }}
      />
      <PricingPageView locale="en" initialTab={initialTab} />
    </>
  );
}
