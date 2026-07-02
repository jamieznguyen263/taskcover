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
import { locales, isLocale, type Locale } from "@/lib/i18n";

type Params = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Pre-render fr/es × all industry slugs. */
export function generateStaticParams() {
  const slugs = getIndustrySlugs();
  return locales
    .filter((l) => l !== "en")
    .flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const industry = getIndustryBySlug(slug, locale);
  if (!industry) return {};

  return buildMetadata({
    title: industry.metaTitle,
    description: industry.metaDescription,
    path: `/industries/${industry.slug}`,
    locale,
  });
}

export default async function LocalizedIndustryDetailPage({ params }: Params) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") {
    notFound();
  }
  const locale = localeParam as Locale;
  const industry = getIndustryBySlug(slug, locale);
  if (!industry) {
    notFound();
  }

  const site = getSiteContent(locale);
  const content = getIndustriesContent(locale);

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbIndustries, path: "/industries" },
      { name: industry.name, path: `/industries/${industry.slug}` },
    ],
    locale
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
      <IndustryPageTemplate industry={industry} ui={content.ui} locale={locale} />
    </>
  );
}