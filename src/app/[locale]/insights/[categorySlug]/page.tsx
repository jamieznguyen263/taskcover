import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getInsightCategory, getInsightsByCategory, getInsightsContent } from "@/lib/insights/content";
import { insightCategorySlugs, type InsightCategorySlug } from "@/content/insights.types";
import { InsightCategoryView } from "@/components/marketing/insights/insights-views";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string; categorySlug: string }> };

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "en")
    .flatMap((locale) => insightCategorySlugs.map((categorySlug) => ({ locale, categorySlug })));
}

function asCategory(value: string): InsightCategorySlug | undefined {
  return insightCategorySlugs.includes(value as InsightCategorySlug)
    ? (value as InsightCategorySlug)
    : undefined;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, categorySlug } = await params;
  const category = asCategory(categorySlug);
  if (!isLocale(localeParam) || !category) return {};
  const locale = localeParam as Locale;
  const content = getInsightCategory(category, locale);
  if (!content) return {};
  const path = `/insights/${category}`;
  return buildMetadata({
    title: content.h1,
    description: content.description,
    path,
    locale,
  });
}

export default async function LocalizedInsightCategoryPage({ params }: Params) {
  const { locale: localeParam, categorySlug } = await params;
  const category = asCategory(categorySlug);
  if (!isLocale(localeParam) || localeParam === "en" || !category) notFound();
  const locale = localeParam as Locale;
  const content = getInsightsContent(locale);
  const categoryContent = getInsightCategory(category, locale);
  if (!categoryContent) notFound();
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
                { name: categoryContent.label, path: `/insights/${category}` },
              ],
              locale
            )
          ),
        }}
      />
      <InsightCategoryView locale={locale} category={categoryContent} articles={await getInsightsByCategory(category, locale)} />
    </>
  );
}
