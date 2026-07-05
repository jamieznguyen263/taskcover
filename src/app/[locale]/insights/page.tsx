import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getInsightsContent } from "@/lib/insights/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { InsightsHubView } from "@/components/marketing/insights/insights-views";
import { siteConfig } from "@/lib/site";
import { localizePath } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const content = getInsightsContent(locale);
  return {
    title: content.hub.h1,
    description: content.hub.description,
    alternates: {
      canonical: `${siteConfig.url}${localizePath("/insights", locale)}`,
      languages: {
        en: `${siteConfig.url}/insights`,
        fr: `${siteConfig.url}/fr/insights`,
        es: `${siteConfig.url}/es/insights`,
        "x-default": `${siteConfig.url}/insights`,
      },
    },
  };
}

export default async function LocalizedInsightsPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const content = getInsightsContent(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.insights, path: "/insights" },
              ],
              locale
            )
          ),
        }}
      />
      <InsightsHubView locale={locale} />
    </>
  );
}
