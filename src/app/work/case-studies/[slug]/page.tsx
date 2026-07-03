import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/marketing/work/case-study-template";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getCaseStudyBySlug, getCaseStudySlugs, getWorkContent, type CaseStudySlug } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug, "en");
  if (!study) return {};
  return buildMetadata({
    title: study.metaTitle,
    description: study.metaDescription,
    path: `/work/case-studies/${slug}`,
    locale: "en",
    ogImage: study.visualGallery[0]?.src,
  });
}

export default async function CaseStudyDetailPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug, "en");
  if (!study) notFound();
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
                { name: content.pages["case-studies"].h1, path: "/work/case-studies" },
                { name: study.clientName, path: `/work/case-studies/${slug}` },
              ],
              "en"
            )
          ),
        }}
      />
      <CaseStudyTemplate slug={slug as CaseStudySlug} locale="en" />
    </>
  );
}
