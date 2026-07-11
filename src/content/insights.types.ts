import type { Locale } from "@/lib/i18n";

export const insightCategorySlugs = [
  "seo-guides",
  "ai-search",
  "technical-seo",
  "content-authority",
  "local-international-seo",
  "ppc-search-intelligence",
  "seo-mentor",
] as const;

export const insightStatuses = [
  "draft",
  "in-review",
  "approved",
  "scheduled",
  "published",
  "archived",
] as const;

export type InsightCategorySlug = (typeof insightCategorySlugs)[number];
export type InsightStatus = (typeof insightStatuses)[number];

export type InsightSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  primarySource: boolean;
  supportsClaimIds: string[];
  locale: Locale | "global";
  notes?: string;
};

export type InsightClaim = {
  id: string;
  text: string;
  requiresEvidence: boolean;
  sourceIds: string[];
};

export type InsightLink = {
  label: string;
  href: string;
  note?: string;
};

export type InsightFaqItem = {
  question: string;
  answer: string;
};

export type InsightBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string; id?: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "numbered-list"; items: string[] }
  | { type: "quote"; quote: string; attribution?: string }
  | { type: "direct-answer"; title: string; answer: string }
  | { type: "key-takeaways"; title: string; items: string[] }
  | { type: "definition"; term: string; definition: string }
  | { type: "callout"; title: string; body: string; tone?: "green" | "blue" | "amber" }
  | {
      type: "comparison-table";
      caption: string;
      columns: string[];
      rows: string[][];
    }
  | { type: "checklist"; title: string; items: { label: string; detail: string }[] }
  | { type: "steps"; title: string; steps: { title: string; body: string }[] }
  | { type: "evidence"; claimId: string; summary: string; sourceIds: string[] }
  | { type: "expert-insight"; title: string; body: string }
  | { type: "faq"; items: InsightFaqItem[] }
  | { type: "pros-cons"; title: string; pros: string[]; cons: string[] }
  | {
      type: "decision-framework";
      title: string;
      criteria: { signal: string; action: string }[];
    }
  | { type: "case-study-reference"; title: string; href: string; summary: string }
  | { type: "sample-audit-reference"; title: string; href: string; summary: string }
  | { type: "related-service"; title: string; href: string; summary: string }
  | { type: "cta"; title: string; body: string; primary: InsightLink; secondary?: InsightLink }
  | { type: "statistic"; value: string; label: string; sourceId?: string; note?: string }
  | { type: "code"; code: string; language?: string }
  | { type: "image"; src: string; alt: string; caption?: string; credit?: string; width?: number; height?: number; mediaAssetId?: string; lqip?: string }
  | { type: "divider" };

export type InsightArticle = {
  id: string;
  slug: string;
  translationGroupId: string;
  locale: Locale;
  internalTitle: string;
  h1: string;
  excerpt: string;
  category: InsightCategorySlug;
  tags: string[];
  author: string;
  expertReviewer?: string;
  editor?: string;
  status: InsightStatus;
  publishedAt: string;
  updatedAt: string;
  lastFactCheckedAt: string;
  scheduledAt?: string;
  readingTime: number;
  coverImage: string;
  coverImageAlt: string;
  coverImageCaption: string;
  blocks: InsightBlock[];
  searchStrategy: {
    focusKeyword: string;
    secondaryKeywords: string[];
    primaryIntent: string;
    secondaryIntents: string[];
    targetAudience: string;
    funnelStage: "awareness" | "consideration" | "decision" | "retention";
    coreQuestion: string;
    primaryEntity: string;
    supportingEntities: string[];
    topicCluster: string;
    parentPillar: string;
    targetMarkets: string[];
    serpObservations: string[];
    featuredSnippetOpportunity: string;
    aiCitationOpportunity: string;
    uniqueInformationGain: string;
    refreshTrigger: string;
    excludedEntities?: string[];
  };
  contentEvidence: {
    sources: InsightSource[];
    claims: InsightClaim[];
    factCheckStatus: "checked" | "needs-review";
    originalInsights: string[];
    caseStudyReferences: string[];
    complianceNotes: string[];
  };
  internalLinking: {
    requiredInternalLinks: InsightLink[];
    suggestedInternalLinks: InsightLink[];
    serviceLinks: InsightLink[];
    industryLinks: InsightLink[];
    marketLinks: InsightLink[];
    caseStudyLinks: InsightLink[];
    sampleAuditLinks: InsightLink[];
    relatedArticleSlugs: string[];
    recommendedAnchors: string[];
  };
  metadata: {
    metaTitle: string;
    metaDescription: string;
    canonical: string;
    robots: "index,follow" | "noindex,nofollow";
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    breadcrumbLabel: string;
  };
  schema: {
    schemaType: "Article" | "BlogPosting";
    faqItems: InsightFaqItem[];
    aboutEntities: string[];
    mentions: string[];
    citationReferences: string[];
  };
  localization: {
    hreflangGroup: string;
    xDefaultSlug: string;
    translationStatus: "complete" | "needs-review";
    translationNotes: string;
    sourceLocale?: Locale;
    assignedTranslator?: string;
    localeReviewStatus?: "pending" | "approved" | "changes-requested";
    syncedFromSourceVersion?: number;
    localeKeyword?: string;
  };
  publishQa: {
    summary: string;
    checkedAt: string;
  };
};

export type InsightCategoryContent = {
  slug: InsightCategorySlug;
  label: string;
  eyebrow: string;
  h1: string;
  description: string;
  context: string;
  visualVariant:
    | "guide"
    | "ai"
    | "technical"
    | "authority"
    | "international"
    | "ppc"
    | "mentor";
  relatedServices: InsightLink[];
  relatedIndustries: InsightLink[];
  relatedMarkets: InsightLink[];
  curatedArticleSlugs: string[];
  cta: {
    title: string;
    body: string;
    primary: InsightLink;
  };
};

export type InsightsContent = {
  ui: {
    insights: string;
    home: string;
    allCategories: string;
    featured: string;
    latest: string;
    readArticle: string;
    readMore: string;
    searchPlaceholder: string;
    filterByCategory: string;
    filterByTopic: string;
    filterByService: string;
    noResults: string;
    minutes: string;
    published: string;
    updated: string;
    tableOfContents: string;
    executiveSummary: string;
    keyTakeaways: string;
    sources: string;
    relatedServices: string;
    relatedSample: string;
    relatedArticles: string;
    startFreeAudit: string;
    author: string;
    finalCta: string;
    categoryContext: string;
    topicCluster: string;
    recommendedPaths: string;
    sourceLabel: string;
    accessed: string;
    evidence: string;
    searchGrowthMap: string;
  };
  hub: {
    eyebrow: string;
    h1: string;
    description: string;
    featuredTitle: string;
    topicMapTitle: string;
    topicMapDescription: string;
    pathsTitle: string;
    paths: { title: string; body: string; href: string }[];
    cta: {
      title: string;
      body: string;
      primary: InsightLink;
      secondary: InsightLink;
    };
  };
  author: {
    name: string;
    description: string;
  };
  categories: Record<InsightCategorySlug, InsightCategoryContent>;
  articles: InsightArticle[];
};
