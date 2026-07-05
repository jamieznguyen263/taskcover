import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getInsightBySlug, getInsightCategory, getInsightArticleSlugs, getInsightsContent, getRelatedInsights } from "@/lib/insights/content";
import { articleJsonLd, faqJsonLd, getInsightPath } from "@/lib/insights/seo";
import { InsightArticleView } from "@/components/marketing/insights/insights-views";
import { siteConfig } from "@/lib/site";

type Params = { params: Promise<{ categorySlug: string; articleSlug: string }> };

export async function generateStaticParams() {
  return (await getInsightArticleSlugs())
    .filter((item) => item.locale === "en")
    .map((item) => ({
      categorySlug: item.categorySlug,
      articleSlug: item.articleSlug,
    }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params;
  const article = await getInsightBySlug(articleSlug, "en");
  if (!article || article.category !== categorySlug) return {};
  const path = getInsightPath(article);
  return {
    title: article.metadata.metaTitle,
    description: article.metadata.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}${path}`,
      languages: {
        en: `${siteConfig.url}${path}`,
        fr: `${siteConfig.url}/fr${path}`,
        es: `${siteConfig.url}/es${path}`,
        "x-default": `${siteConfig.url}${path}`,
      },
    },
    openGraph: {
      type: "article",
      title: article.metadata.ogTitle,
      description: article.metadata.ogDescription,
      url: `${siteConfig.url}${path}`,
      images: [{ url: article.metadata.ogImage }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.twitterTitle,
      description: article.metadata.twitterDescription,
      images: [article.metadata.twitterImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function InsightArticlePage({ params }: Params) {
  const { categorySlug, articleSlug } = await params;
  const article = await getInsightBySlug(articleSlug, "en");
  if (!article || article.category !== categorySlug) notFound();
  const content = getInsightsContent("en");
  const category = getInsightCategory(article.category, "en");
  if (!category) notFound();
  const related = await getRelatedInsights(article.slug, "en", 3);
  const faq = faqJsonLd(article);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd(article, "en")) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.insights, path: "/insights" },
                { name: category.label, path: `/insights/${article.category}` },
                { name: article.metadata.breadcrumbLabel, path: getInsightPath(article) },
              ],
              "en"
            )
          ),
        }}
      />
      {faq ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faq) }} /> : null}
      <InsightArticleView article={article} related={related} locale="en" />
    </>
  );
}
