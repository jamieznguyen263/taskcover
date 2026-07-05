import type { Metadata } from "next";
import { breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getInsightsContent } from "@/lib/insights/content";
import { InsightsHubView } from "@/components/marketing/insights/insights-views";

const content = getInsightsContent("en");

export const metadata: Metadata = {
  title: "Insights: SEO, AI Search, Content Authority & PPC",
  description: content.hub.description,
  alternates: {
    canonical: "https://taskcover.com/insights",
    languages: {
      en: "https://taskcover.com/insights",
      fr: "https://taskcover.com/fr/insights",
      es: "https://taskcover.com/es/insights",
      "x-default": "https://taskcover.com/insights",
    },
  },
};

export default function InsightsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.insights, path: "/insights" },
              ],
              "en"
            )
          ),
        }}
      />
      <InsightsHubView locale="en" />
    </>
  );
}
