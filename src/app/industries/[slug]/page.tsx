import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { IndustryPageTemplate } from "@/components/marketing/industries/industry-template";
import {
  getIndustryBySlug,
  getIndustrySlugs,
  getIndustriesContent,
  getSiteContent,
} from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every industry page at build time. */
export function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ slug }));
}

/** Unique metadata per industry page. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug, "en");
  if (!industry) return {};

  return buildMetadata({
    title: industry.metaTitle,
    description: industry.metaDescription,
    path: `/industries/${industry.slug}`,
    locale: "en",
  });
}

export default async function IndustryDetailPage({ params }: Params) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug, "en");
  if (!industry) {
    notFound();
  }

  const site = getSiteContent("en");
  const content = getIndustriesContent("en");

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbIndustries, path: "/industries" },
      { name: industry.name, path: `/industries/${industry.slug}` },
    ],
    "en"
  );

  const faq = faqSchema(industry.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faq) }}
      />
      <IndustryPageTemplate industry={industry} ui={content.ui} locale="en" />
    </>
  );
}