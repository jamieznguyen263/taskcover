import type { Metadata } from "next";
import { PricingPageView } from "@/components/marketing/pricing/pricing-page-view";
import { getPricingContent } from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  serializeJsonLd,
  buildMetadata,
} from "@/lib/seo";

const content = getPricingContent("en");

export const metadata: Metadata = buildMetadata({
  title: content.metadata.title,
  description: content.metadata.description,
  path: "/pricing",
  locale: "en",
});

export default function PricingPage() {
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
      <PricingPageView locale="en" />
    </>
  );
}
