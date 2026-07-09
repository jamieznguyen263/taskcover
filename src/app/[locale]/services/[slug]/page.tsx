import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { ServicePageTemplate } from "@/components/marketing/services/service-template";
import {
  getServiceBySlug,
  getServiceSlugs,
  getServicesContent,
  getSiteContent,
} from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n";

type Params = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Pre-render fr/es × all service slugs. */
export function generateStaticParams() {
  const slugs = getServiceSlugs();
  return locales
    .filter((l) => l !== "en")
    .flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const service = getServiceBySlug(slug, locale);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    locale,
  });
}

export default async function LocalizedServiceDetailPage({ params }: Params) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") {
    notFound();
  }
  const locale = localeParam as Locale;
  const service = getServiceBySlug(slug, locale);
  if (!service) {
    notFound();
  }

  const site = getSiteContent(locale);

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: site.ui.services, path: "/services" },
      { name: service.shortLabel, path: `/services/${service.slug}` },
    ],
    locale
  );

  const faq = faqSchema(service.faqs);
  const serviceStructuredData = serviceSchema(service, locale);
  const content = getServicesContent(locale);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceStructuredData) }}
      />
      <ServicePageTemplate service={service} ui={content.ui} locale={locale} />
    </>
  );
}
