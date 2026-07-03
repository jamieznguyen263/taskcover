import type { Metadata } from "next";
import { ClientResultsView } from "@/components/marketing/work/client-results-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";

const content = getWorkContent("en");
const page = content.pages["client-results"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/work/client-results",
  locale: "en",
});

export default function ClientResultsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.work, path: "/work" },
                { name: page.h1, path: "/work/client-results" },
              ],
              "en"
            )
          ),
        }}
      />
      <ClientResultsView locale="en" />
    </>
  );
}
