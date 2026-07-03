import type { Metadata } from "next";
import { SampleAuditsView } from "@/components/marketing/work/sample-audits-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";

const content = getWorkContent("en");
const page = content.pages["sample-audits"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/work/sample-audits",
  locale: "en",
});

export default function SampleAuditsPage() {
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
                { name: page.h1, path: "/work/sample-audits" },
              ],
              "en"
            )
          ),
        }}
      />
      <SampleAuditsView locale="en" />
    </>
  );
}
