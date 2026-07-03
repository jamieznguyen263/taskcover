import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchFrameworksView } from "@/components/marketing/work/search-frameworks-view";
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
  const page = getWorkContent(locale).pages["search-growth-frameworks"];
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/work/search-growth-frameworks",
    locale,
  });
}

export default async function LocalizedSearchFrameworksPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const content = getWorkContent(locale);
  const page = content.pages["search-growth-frameworks"];
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
                { name: page.h1, path: "/work/search-growth-frameworks" },
              ],
              locale
            )
          ),
        }}
      />
      <SearchFrameworksView locale={locale} />
    </>
  );
}
