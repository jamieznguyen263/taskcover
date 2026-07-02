import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { IndustriesHubView } from "@/components/marketing/industries/industries-hub-view";
import { getIndustriesContent, getSiteContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Industry SEO Systems | Travel, Education, Healthcare, Legal & More",
  description:
    "Industry-specific SEO systems for travel, education, healthcare, legal, SaaS, eCommerce, and franchise. Each vertical has different intent, trust, content, and conversion paths.",
  path: "/industries",
  locale: "en",
});

export default function IndustriesHubPage() {
  const content = getIndustriesContent("en");
  const site = getSiteContent("en");

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbIndustries, path: "/industries" },
    ],
    "en"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <IndustriesHubView locale="en" />
    </>
  );
}