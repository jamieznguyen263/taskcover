import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientResultsView } from "@/components/marketing/work/client-results-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const locale = localeParam as Locale;
  const page = getWorkContent(locale).pages["client-results"];
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/work/client-results",
    locale,
  });
}

export default async function LocalizedClientResultsPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const content = getWorkContent(locale);
  const page = content.pages["client-results"];
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
                { name: page.h1, path: "/work/client-results" },
              ],
              locale
            )
          ),
        }}
      />
      <ClientResultsView locale={locale} />
    </>
  );
}
