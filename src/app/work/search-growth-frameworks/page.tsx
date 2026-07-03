import type { Metadata } from "next";
import { SearchFrameworksView } from "@/components/marketing/work/search-frameworks-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";

const content = getWorkContent("en");
const page = content.pages["search-growth-frameworks"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/work/search-growth-frameworks",
  locale: "en",
});

export default function SearchFrameworksPage() {
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
                { name: page.h1, path: "/work/search-growth-frameworks" },
              ],
              "en"
            )
          ),
        }}
      />
      <SearchFrameworksView locale="en" />
    </>
  );
}
