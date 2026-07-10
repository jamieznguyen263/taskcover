import type { InsightArticle } from "@/content/insights.types";
import { commercialUrlIntentMap } from "@/content/seo/url-intent-map";

export type InternalLinkTarget = {
  href: string;
  label: string;
  pageType: string;
  keywordFamily: string;
  funnelStage: string;
};

export type InternalLinkSuggestion = {
  href: string;
  anchorText: string;
  reason: string;
  pageType: string;
};

/**
 * Provider boundary for internal-link recommendations. The local provider
 * works from the static site inventory plus published Insights. Future
 * semantic/AI providers implement the same interface.
 */
export interface InternalLinkSuggestionProvider {
  listTargets(): InternalLinkTarget[];
  suggest(article: InsightArticle, existingHrefs: Set<string>): InternalLinkSuggestion[];
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

const GENERIC_TOKENS = new Set(["seo", "search", "the", "and", "for", "with", "your", "how", "what", "why", "page", "pages", "site"]);

function meaningfulTokens(values: string[]): Set<string> {
  const tokens = new Set<string>();
  for (const value of values) for (const token of tokenize(value)) if (!GENERIC_TOKENS.has(token)) tokens.add(token);
  return tokens;
}

export class LocalInventoryLinkProvider implements InternalLinkSuggestionProvider {
  constructor(private readonly publishedArticles: { slug: string; category: string; h1: string; focusKeyword: string }[] = []) {}

  listTargets(): InternalLinkTarget[] {
    const routes = commercialUrlIntentMap
      .filter((entry) => entry.indexable && (entry.recommendation === "keep" || entry.recommendation === "improve"))
      .map((entry) => ({
        href: entry.route,
        label: entry.primaryKeywordFamily,
        pageType: entry.pageType,
        keywordFamily: entry.primaryKeywordFamily,
        funnelStage: entry.funnelStage,
      }));
    const articles = this.publishedArticles.map((article) => ({
      href: `/insights/${article.category}/${article.slug}`,
      label: article.h1,
      pageType: "insight article",
      keywordFamily: article.focusKeyword,
      funnelStage: "awareness",
    }));
    return [...routes, ...articles];
  }

  suggest(article: InsightArticle, existingHrefs: Set<string>): InternalLinkSuggestion[] {
    const articleTokens = meaningfulTokens([
      article.searchStrategy.focusKeyword,
      ...article.searchStrategy.secondaryKeywords,
      article.searchStrategy.topicCluster,
      article.searchStrategy.primaryEntity,
      ...article.searchStrategy.supportingEntities,
      article.h1,
    ]);
    const selfHref = `/insights/${article.category}/${article.slug}`;
    const suggestions: InternalLinkSuggestion[] = [];

    for (const target of this.listTargets()) {
      if (target.href === selfHref || existingHrefs.has(target.href)) continue;
      const targetTokens = meaningfulTokens([target.keywordFamily, target.label]);
      const overlap = [...targetTokens].filter((token) => articleTokens.has(token));
      if (overlap.length >= 2) {
        suggestions.push({
          href: target.href,
          anchorText: target.label,
          pageType: target.pageType,
          reason: `Shares topic terms with this article: ${overlap.slice(0, 4).join(", ")}.`,
        });
      }
    }

    const funnelTarget = article.searchStrategy.funnelStage === "decision" ? "/book-a-call" : "/free-seo-audit";
    if (!existingHrefs.has(funnelTarget)) {
      suggestions.push({
        href: funnelTarget,
        anchorText: funnelTarget === "/book-a-call" ? "Book a strategy call" : "Get a free SEO audit",
        pageType: "lead conversion page",
        reason: `Standard conversion path for ${article.searchStrategy.funnelStage || "this"} funnel-stage content.`,
      });
    }

    return suggestions.slice(0, 12);
  }
}

export function collectExistingHrefs(article: InsightArticle): Set<string> {
  const linking = article.internalLinking;
  return new Set(
    [
      ...linking.requiredInternalLinks,
      ...linking.suggestedInternalLinks,
      ...linking.serviceLinks,
      ...linking.industryLinks,
      ...linking.marketLinks,
      ...linking.caseStudyLinks,
      ...linking.sampleAuditLinks,
    ].map((link) => link.href)
  );
}

export function duplicateAnchorWarnings(article: InsightArticle): string[] {
  const linking = article.internalLinking;
  const all = [
    ...linking.requiredInternalLinks,
    ...linking.suggestedInternalLinks,
    ...linking.serviceLinks,
    ...linking.industryLinks,
    ...linking.marketLinks,
    ...linking.caseStudyLinks,
    ...linking.sampleAuditLinks,
  ];
  const byAnchor = new Map<string, Set<string>>();
  for (const link of all) {
    const anchor = link.label.trim().toLowerCase();
    if (!anchor) continue;
    const hrefs = byAnchor.get(anchor) ?? new Set<string>();
    hrefs.add(link.href);
    byAnchor.set(anchor, hrefs);
  }
  return [...byAnchor.entries()]
    .filter(([, hrefs]) => hrefs.size > 1)
    .map(([anchor, hrefs]) => `Anchor “${anchor}” points to ${hrefs.size} different URLs. Use distinct anchors per destination.`);
}
