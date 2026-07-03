import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProofPageTemplate } from "@/components/marketing/proof/proof-page-template";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import {
  getProofContent,
  getProofPageBySlug,
  getProofPageSlugs,
  type ProofPageSlug,
} from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProofPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getProofPageBySlug(slug, "en");
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/proof/${page.slug}`,
    locale: "en",
  });
}

export default async function ProofDetailPage({ params }: Params) {
  const { slug } = await params;
  const page = getProofPageBySlug(slug, "en");
  if (!page) notFound();
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
                { name: page.label, path: `/proof/${page.slug}` },
              ],
              "en"
            )
          ),
        }}
      />
      <ProofPageTemplate slug={page.slug as ProofPageSlug} locale="en" />
    </>
  );
}
