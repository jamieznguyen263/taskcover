import type { InsightArticle } from "@/content/insights.types";

function overlapScore(a: string[], b: string[]) {
  const bSet = new Set(b.map((item) => item.toLowerCase()));
  return a.reduce((score, item) => score + (bSet.has(item.toLowerCase()) ? 1 : 0), 0);
}

export function rankRelatedArticles(
  article: InsightArticle,
  candidates: InsightArticle[],
  limit = 3
): InsightArticle[] {
  const manualOrder = new Map(
    article.internalLinking.relatedArticleSlugs.map((slug, index) => [slug, 1000 - index])
  );

  return candidates
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const manualScore = manualOrder.get(candidate.slug) ?? 0;
      const categoryScore = candidate.category === article.category ? 80 : 0;
      const topicScore = candidate.searchStrategy.topicCluster === article.searchStrategy.topicCluster ? 50 : 0;
      const entityScore = overlapScore(
        article.searchStrategy.supportingEntities,
        candidate.searchStrategy.supportingEntities
      ) * 12;
      const tagScore = overlapScore(article.tags, candidate.tags) * 8;
      const serviceScore = overlapScore(
        article.internalLinking.serviceLinks.map((link) => link.href),
        candidate.internalLinking.serviceLinks.map((link) => link.href)
      ) * 10;

      return {
        article: candidate,
        score: manualScore + categoryScore + topicScore + entityScore + tagScore + serviceScore,
      };
    })
    .sort((a, b) => b.score - a.score || a.article.publishedAt.localeCompare(b.article.publishedAt))
    .slice(0, limit)
    .map((item) => item.article);
}
