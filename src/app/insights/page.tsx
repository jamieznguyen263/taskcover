import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getInsightsContent } from "@/lib/insights/content";
import { InsightsHubView } from "@/components/marketing/insights/insights-views";

const content = getInsightsContent("en");

export const metadata: Metadata = buildMetadata({
  title: "Insights: SEO, AI Search, Content Authority & PPC",
  description: content.hub.description,
  path: "/insights",
  locale: "en",
});

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
