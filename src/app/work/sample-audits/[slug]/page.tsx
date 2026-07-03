import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SampleAuditTemplate } from "@/components/marketing/work/sample-audit-template";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import {
  getSampleAuditBySlug,
  getSampleAuditSlugs,
  getWorkContent,
  type SampleAuditSlug,
} from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSampleAuditSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const sample = getSampleAuditBySlug(slug, "en");
  if (!sample) return {};
  return buildMetadata({
    title: sample.metaTitle,
    description: sample.metaDescription,
    path: `/work/sample-audits/${slug}`,
    locale: "en",
  });
}

export default async function SampleAuditDetailPage({ params }: Params) {
  const { slug } = await params;
  const sample = getSampleAuditBySlug(slug, "en");
  if (!sample) notFound();
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
                { name: content.pages["sample-audits"].h1, path: "/work/sample-audits" },
                { name: sample.title, path: `/work/sample-audits/${slug}` },
              ],
              "en"
            )
          ),
        }}
      />
      <SampleAuditTemplate slug={slug as SampleAuditSlug} locale="en" />
    </>
  );
}
