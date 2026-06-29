import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { ServicePageTemplate } from "@/components/marketing/services/service-template";
import { getServiceBySlug, getServiceSlugs } from "@/data/services";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every service page at build time. */
export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

/** Unique metadata per service page. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortLabel, path: `/services/${service.slug}` },
  ]);

  const faq = faqSchema(service.faqs);

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
      <ServicePageTemplate service={service} />
    </>
  );
}