import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { IndustriesHubView } from "@/components/marketing/industries/industries-hub-view";
import { getIndustriesContent, getSiteContent } from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

/** Pre-render fr/es industry hubs. */
export function generateStaticParams() {
  return locales
    .filter((l) => l !== "en")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const content = getIndustriesContent(locale);

  return buildMetadata({
    title: content.hub.h1,
    description: content.hub.description,
    path: "/industries",
    locale,
  });
}

export default async function LocalizedIndustriesHubPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") {
    notFound();
  }
  const locale = localeParam as Locale;
  const content = getIndustriesContent(locale);
  const site = getSiteContent(locale);

  const breadcrumb = breadcrumbSchema(
    [
      { name: site.ui.home, path: "/" },
      { name: content.ui.breadcrumbIndustries, path: "/industries" },
    ],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <IndustriesHubView locale={locale} />
    </>
  );
}