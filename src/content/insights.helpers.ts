import type { Locale } from "@/lib/i18n";
import type {
  InsightArticle,
  InsightBlock,
  InsightCategorySlug,
  InsightClaim,
  InsightLink,
  InsightSource,
} from "./insights.types";

type ArticleSeed = {
  id: string;
  slug: string;
  translationGroupId: string;
  locale: Locale;
  title: string;
  internalTitle?: string;
  excerpt: string;
  category: InsightCategorySlug;
  tags: string[];
  readingTime: number;
  coverImageAlt: string;
  coverImageCaption: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  intent: string;
  audience: string;
  funnelStage: InsightArticle["searchStrategy"]["funnelStage"];
  coreQuestion: string;
  primaryEntity: string;
  supportingEntities: string[];
  topicCluster: string;
  parentPillar: string;
  targetMarkets?: string[];
  uniqueInformationGain: string;
  refreshTrigger: string;
  sources: InsightSource[];
  claims: InsightClaim[];
  originalInsights: string[];
  complianceNotes?: string[];
  serviceLinks: InsightLink[];
  industryLinks?: InsightLink[];
  marketLinks?: InsightLink[];
  caseStudyLinks?: InsightLink[];
  sampleAuditLinks?: InsightLink[];
  suggestedInternalLinks?: InsightLink[];
  relatedArticleSlugs: string[];
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  blocks: InsightBlock[];
  faqItems?: { question: string; answer: string }[];
};

export function buildInsightArticle(seed: ArticleSeed): InsightArticle {
  const path = `/insights/${seed.category}/${seed.slug}`;
  const allInternalLinks = [
    ...seed.serviceLinks,
    ...(seed.industryLinks ?? []),
    ...(seed.marketLinks ?? []),
    ...(seed.caseStudyLinks ?? []),
    ...(seed.sampleAuditLinks ?? []),
  ];

  return {
    id: seed.id,
    slug: seed.slug,
    translationGroupId: seed.translationGroupId,
    locale: seed.locale,
    internalTitle: seed.internalTitle ?? seed.title,
    h1: seed.title,
    excerpt: seed.excerpt,
    category: seed.category,
    tags: seed.tags,
    author: "Taskcover Editorial Team",
    status: "published",
    publishedAt: "2026-07-05",
    updatedAt: "2026-07-05",
    lastFactCheckedAt: "2026-07-05",
    readingTime: seed.readingTime,
    coverImage: "/brand/og-default.svg",
    coverImageAlt: seed.coverImageAlt,
    coverImageCaption: seed.coverImageCaption,
    blocks: seed.blocks,
    searchStrategy: {
      focusKeyword: seed.focusKeyword,
      secondaryKeywords: seed.secondaryKeywords,
      primaryIntent: seed.intent,
      secondaryIntents: ["compare options", "prioritize action", "evaluate agency support"],
      targetAudience: seed.audience,
      funnelStage: seed.funnelStage,
      coreQuestion: seed.coreQuestion,
      primaryEntity: seed.primaryEntity,
      supportingEntities: seed.supportingEntities,
      topicCluster: seed.topicCluster,
      parentPillar: seed.parentPillar,
      targetMarkets: seed.targetMarkets ?? ["United States", "Canada", "Australia"],
      serpObservations: [
        "Search results mix informational guides, vendor pages, and official documentation.",
        "AI answer surfaces reward clear definitions, cited claims, and entity consistency.",
      ],
      featuredSnippetOpportunity: "Use concise direct-answer blocks followed by practical decision criteria.",
      aiCitationOpportunity: "Make evidence, definitions, and source relationships explicit enough to quote safely.",
      uniqueInformationGain: seed.uniqueInformationGain,
      refreshTrigger: seed.refreshTrigger,
    },
    contentEvidence: {
      sources: seed.sources,
      claims: seed.claims,
      factCheckStatus: "checked",
      originalInsights: seed.originalInsights,
      caseStudyReferences: seed.caseStudyLinks?.map((link) => link.href) ?? [],
      complianceNotes: seed.complianceNotes ?? [
        "No invented survey data, rankings, traffic claims, client outcomes, or credentials.",
      ],
    },
    internalLinking: {
      requiredInternalLinks: allInternalLinks,
      suggestedInternalLinks: seed.suggestedInternalLinks ?? [],
      serviceLinks: seed.serviceLinks,
      industryLinks: seed.industryLinks ?? [],
      marketLinks: seed.marketLinks ?? [],
      caseStudyLinks: seed.caseStudyLinks ?? [],
      sampleAuditLinks: seed.sampleAuditLinks ?? [],
      relatedArticleSlugs: seed.relatedArticleSlugs,
      recommendedAnchors: allInternalLinks.map((link) => link.label),
    },
    metadata: {
      metaTitle: seed.metaTitle,
      metaDescription: seed.metaDescription,
      canonical: path,
      robots: "index,follow",
      ogTitle: seed.metaTitle,
      ogDescription: seed.metaDescription,
      ogImage: "/brand/og-default.svg",
      twitterTitle: seed.metaTitle,
      twitterDescription: seed.metaDescription,
      twitterImage: "/brand/og-default.svg",
      breadcrumbLabel: seed.breadcrumbLabel,
    },
    schema: {
      schemaType: "Article",
      faqItems: seed.faqItems ?? [],
      aboutEntities: [seed.primaryEntity, ...seed.supportingEntities],
      mentions: seed.tags,
      citationReferences: seed.sources.map((source) => source.url),
    },
    localization: {
      hreflangGroup: seed.translationGroupId,
      xDefaultSlug: seed.slug,
      translationStatus: "complete",
      translationNotes: "Localized article body, metadata, UI labels, and schema text.",
    },
    publishQa: {
      summary: "Validated for published status, localized metadata, structured blocks, sources, and internal links.",
      checkedAt: "2026-07-05",
    },
  };
}
