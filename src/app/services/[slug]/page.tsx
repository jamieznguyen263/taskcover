import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { ServicePageTemplate } from "@/components/marketing/services/service-template";
import { getServiceBySlug, getServiceSlugs, getServicesContent, getSiteContent } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every service page at build time. */
export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

/** Unique metadata per service page. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug, "en");
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    locale: "en",
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getServiceBySlug(slug, "en");
  if (!service) {
    notFound();
  }

  const site = getSiteContent("en");

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: site.ui.services, path: "/services" },
      { name: service.shortLabel, path: `/services/${service.slug}` },
    ],
    "en"
  );

  const faq = faqSchema(service.faqs);
  const content = getServicesContent("en");

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
      <ServicePageTemplate service={service} ui={content.ui} />
    </>
  );
}
