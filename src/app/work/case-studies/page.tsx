import type { Metadata } from "next";
import { CaseStudiesView } from "@/components/marketing/work/case-studies-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";

const content = getWorkContent("en");
const page = content.pages["case-studies"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/work/case-studies",
  locale: "en",
});

export default function CaseStudiesPage() {
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
                { name: page.h1, path: "/work/case-studies" },
              ],
              "en"
            )
          ),
        }}
      />
      <CaseStudiesView locale="en" />
    </>
  );
}
