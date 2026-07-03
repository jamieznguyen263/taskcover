import type { Metadata } from "next";
import { WorkHubView } from "@/components/marketing/work/work-hub-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: getWorkContent("en").hub.metaTitle,
  description: getWorkContent("en").hub.metaDescription,
  path: "/work",
  locale: "en",
});

export default function WorkPage() {
  const content = getWorkContent("en");
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
              ],
              "en"
            )
          ),
        }}
      />
      <WorkHubView locale="en" />
    </>
  );
}
