import crypto from "node:crypto";
import type { InsightArticle, InsightCategorySlug, InsightStatus } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import { createStarterTiptapDocument, normalizeTiptapToInsightBlocks } from "./normalization";
import { articleDraftSchema } from "./validation";

export type EditableLocalization = {
  id: string;
  locale: Locale;
  draftVersion: number;
  editorDocument: unknown;
  article: InsightArticle;
  publishedSnapshot: InsightArticle | null;
};

export type EditableArticleGroup = {
  id: string;
  status: InsightStatus;
  lockVersion: number;
  scheduledAt: string | null;
  publishedAt: string | null;
  approvedAt: string | null;
  localizations: EditableLocalization[];
};

export function createDraftArticle(input: {
  groupId: string;
  translationGroupId: string;
  slug: string;
  category: InsightCategorySlug;
  locale: Locale;
  author: string;
  now?: Date;
}): { article: InsightArticle; editorDocument: unknown } {
  const now = (input.now ?? new Date()).toISOString();
  const title = input.slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const editorDocument = createStarterTiptapDocument(title);
  const prefix = input.locale === "en" ? "" : `/${input.locale}`;
  const article: InsightArticle = {
    id: input.groupId,
    slug: input.slug,
    translationGroupId: input.translationGroupId,
    locale: input.locale,
    internalTitle: title,
    h1: title,
    excerpt: "",
    category: input.category,
    tags: [],
    author: input.author,
    status: "draft",
    publishedAt: now,
    updatedAt: now,
    lastFactCheckedAt: now,
    readingTime: 0,
    coverImage: "",
    coverImageAlt: "",
    coverImageCaption: "",
    blocks: normalizeTiptapToInsightBlocks(editorDocument),
    searchStrategy: {
      focusKeyword: "", secondaryKeywords: [], primaryIntent: "", secondaryIntents: [], targetAudience: "",
      funnelStage: "awareness", coreQuestion: "", primaryEntity: "", supportingEntities: [], topicCluster: "",
      parentPillar: "", targetMarkets: [], serpObservations: [], featuredSnippetOpportunity: "",
      aiCitationOpportunity: "", uniqueInformationGain: "", refreshTrigger: "",
    },
    contentEvidence: { sources: [], claims: [], factCheckStatus: "needs-review", originalInsights: [], caseStudyReferences: [], complianceNotes: [] },
    internalLinking: {
      requiredInternalLinks: [], suggestedInternalLinks: [], serviceLinks: [], industryLinks: [], marketLinks: [],
      caseStudyLinks: [], sampleAuditLinks: [], relatedArticleSlugs: [], recommendedAnchors: [],
    },
    metadata: {
      metaTitle: "", metaDescription: "", canonical: `${prefix}/insights/${input.category}/${input.slug}`,
      robots: "index,follow", ogTitle: "", ogDescription: "", ogImage: "", twitterTitle: "",
      twitterDescription: "", twitterImage: "", breadcrumbLabel: title,
    },
    schema: { schemaType: "Article", faqItems: [], aboutEntities: [], mentions: [], citationReferences: [] },
    localization: {
      hreflangGroup: input.translationGroupId, xDefaultSlug: input.slug, translationStatus: "needs-review", translationNotes: "",
    },
    publishQa: { summary: "Publish QA has not run.", checkedAt: now },
  };
  return { article: articleDraftSchema.parse(article), editorDocument };
}

export function materializePublishedSnapshot(article: InsightArticle, now = new Date()): InsightArticle {
  const timestamp = now.toISOString();
  return articleDraftSchema.parse({
    ...article,
    status: "published",
    publishedAt: timestamp,
    updatedAt: timestamp,
    scheduledAt: undefined,
    publishQa: { ...article.publishQa, checkedAt: timestamp },
  });
}

export function newTranslationGroupId() {
  return `insight-${crypto.randomUUID()}`;
}

export class ContentConflictError extends Error {
  readonly code = "conflict";
}

export class ContentStateError extends Error {
  readonly code = "invalid-state";
}

