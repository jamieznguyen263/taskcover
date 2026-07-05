import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getInsightCategory, getInsightsByCategory, getInsightsContent } from "@/lib/insights/content";
import { insightCategorySlugs, type InsightCategorySlug } from "@/content/insights.types";
import { InsightCategoryView } from "@/components/marketing/insights/insights-views";
import { siteConfig } from "@/lib/site";

type Params = { params: Promise<{ categorySlug: string }> };

export function generateStaticParams() {
  return insightCategorySlugs.map((categorySlug) => ({ categorySlug }));
}

function asCategory(value: string): InsightCategorySlug | undefined {
  return insightCategorySlugs.includes(value as InsightCategorySlug)
    ? (value as InsightCategorySlug)
    : undefined;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = asCategory(categorySlug);
  if (!category) return {};
  const content = getInsightCategory(category, "en");
  if (!content) return {};
  const path = `/insights/${category}`;
  return {
    title: content.h1,
    description: content.description,
    alternates: {
      canonical: `${siteConfig.url}${path}`,
      languages: {
        en: `${siteConfig.url}${path}`,
        fr: `${siteConfig.url}/fr${path}`,
        es: `${siteConfig.url}/es${path}`,
        "x-default": `${siteConfig.url}${path}`,
      },
    },
  };
}

export default async function InsightCategoryPage({ params }: Params) {
  const { categorySlug } = await params;
  const category = asCategory(categorySlug);
  if (!category) notFound();
  const content = getInsightsContent("en");
  const categoryContent = getInsightCategory(category, "en");
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
              "en"
            )
          ),
        }}
      />
      <InsightCategoryView locale="en" category={categoryContent} articles={await getInsightsByCategory(category, "en")} />
    </>
  );
}
