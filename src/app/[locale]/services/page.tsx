import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { ServicesHubView } from "@/components/marketing/services/services-hub-view";
import { getServicesContent, getSiteContent } from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales
    .filter((l) => l !== "en")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const content = getServicesContent(locale);
  return buildMetadata({
    title: content.hub.h1,
    description: content.hub.description,
    path: "/services",
    locale,
  });
}

export default async function LocalizedServicesHubPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") {
    notFound();
  }
  const locale = localeParam as Locale;
  const site = getSiteContent(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: site.ui.home, path: "/" },
                { name: site.ui.services, path: "/services" },
              ],
              locale
            )
          ),
        }}
      />
      <ServicesHubView locale={locale} />
    </>
  );
}