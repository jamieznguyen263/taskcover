import type { Metadata } from "next";
import { ProofHubView } from "@/components/marketing/proof/proof-hub-view";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getProofContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: getProofContent("en").hub.metaTitle,
  description: getProofContent("en").hub.metaDescription,
  path: "/proof",
  locale: "en",
});

export default function ProofHubPage() {
  const content = getProofContent("en");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.proof, path: "/proof" },
              ],
              "en"
            )
          ),
        }}
      />
      <ProofHubView locale="en" />
    </>
  );
}
