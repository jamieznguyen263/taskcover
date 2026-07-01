import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { ServicesHubView } from "@/components/marketing/services/services-hub-view";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "SEO Services Built to Work Together | Taskcover Agency",
  description:
    "Search growth services that connect SEO, AI Search, PPC, Content, Digital PR, Local, eCommerce, International, Mentorship, and Audits into one system.",
  path: "/services",
  locale: "en",
});

export default function ServicesHubPage() {
  const site = getSiteContent("en");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: site.ui.home, path: "/" },
                { name: site.ui.services, path: "/services" },
              ],
              "en"
            )
          ),
        }}
      />
      <ServicesHubView locale="en" />
    </>
  );
}