import { z } from "zod";
import { insightCategorySlugs, insightStatuses, type InsightArticle, type InsightBlock } from "@/content/insights.types";
import { locales } from "@/lib/i18n";

export const adminRoleSchema = z.enum(["admin", "editor"]);
export const adminUserStatusSchema = z.enum(["invited", "active", "disabled"]);
export const workflowStatusSchema = z.enum(insightStatuses);
export const localeSchema = z.enum(locales);

export const tiptapDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.unknown()).optional(),
});

const insightLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  note: z.string().optional(),
});

const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
  accessedAt: z.string().min(1),
  publishedAt: z.string().optional(),
  primarySource: z.boolean(),
  supportsClaimIds: z.array(z.string()),
  locale: z.union([localeSchema, z.literal("global")]),
  notes: z.string().optional(),
});

const claimSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  requiresEvidence: z.boolean(),
  sourceIds: z.array(z.string()),
});

export const searchStrategySchema = z.object({
  focusKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  primaryIntent: z.string(),
  secondaryIntents: z.array(z.string()),
  targetAudience: z.string(),
  funnelStage: z.enum(["awareness", "consideration", "decision", "retention"]),
  coreQuestion: z.string(),
  primaryEntity: z.string(),
  supportingEntities: z.array(z.string()),
  topicCluster: z.string(),
  parentPillar: z.string(),
  targetMarkets: z.array(z.string()),
  serpObservations: z.array(z.string()),
  featuredSnippetOpportunity: z.string(),
  aiCitationOpportunity: z.string(),
  uniqueInformationGain: z.string(),
  refreshTrigger: z.string(),
});

export const contentEvidenceSchema = z.object({
  sources: z.array(sourceSchema),
  claims: z.array(claimSchema),
  factCheckStatus: z.enum(["checked", "needs-review"]),
  originalInsights: z.array(z.string()),
  caseStudyReferences: z.array(z.string()),
  complianceNotes: z.array(z.string()),
});

export const internalLinkingSchema = z.object({
  requiredInternalLinks: z.array(insightLinkSchema),
  suggestedInternalLinks: z.array(insightLinkSchema),
  serviceLinks: z.array(insightLinkSchema),
  industryLinks: z.array(insightLinkSchema),
  marketLinks: z.array(insightLinkSchema),
  caseStudyLinks: z.array(insightLinkSchema),
  sampleAuditLinks: z.array(insightLinkSchema),
  relatedArticleSlugs: z.array(z.string()),
  recommendedAnchors: z.array(z.string()),
});

export const metadataSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  canonical: z.string(),
  robots: z.enum(["index,follow", "noindex,nofollow"]),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
  twitterTitle: z.string(),
  twitterDescription: z.string(),
  twitterImage: z.string(),
  breadcrumbLabel: z.string(),
});

export const schemaConfigurationSchema = z.object({
  schemaType: z.enum(["Article", "BlogPosting"]),
  faqItems: z.array(z.object({ question: z.string(), answer: z.string() })),
  aboutEntities: z.array(z.string()),
  mentions: z.array(z.string()),
  citationReferences: z.array(z.string()),
});

export const localizationDataSchema = z.object({
  hreflangGroup: z.string(),
  xDefaultSlug: z.string(),
  translationStatus: z.enum(["complete", "needs-review"]),
  translationNotes: z.string(),
});

const blocksSchema: z.ZodType<InsightBlock[]> = z.custom<InsightBlock[]>((value) => Array.isArray(value), {
  message: "Expected InsightBlock[]",
});

export const publishedArticleSnapshotSchema: z.ZodType<InsightArticle> = z.custom<InsightArticle>((value) => {
  const article = value as Partial<InsightArticle>;
  return Boolean(
    article &&
      typeof article.id === "string" &&
      typeof article.slug === "string" &&
      localeSchema.safeParse(article.locale).success &&
      insightCategorySlugs.includes(article.category as never) &&
      article.status === "published" &&
      Array.isArray(article.blocks)
  );
}, "Published snapshot must be a published InsightArticle.");

export function validateJsonPayload<T>(schema: z.ZodType<T>, payload: unknown, label: string): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new Error(`${label} validation failed: ${result.error.issues.map((issue) => issue.message).join("; ")}`);
  }
  return result.data;
}

export function validatePublishPayload(payload: {
  editorDocument: unknown;
  normalizedBlocks: unknown;
  searchStrategy: unknown;
  evidenceData: unknown;
  internalLinkData: unknown;
  metadata: unknown;
  schemaConfiguration: unknown;
  localizationData: unknown;
}) {
  return {
    editorDocument: validateJsonPayload(tiptapDocumentSchema, payload.editorDocument, "Editor document"),
    normalizedBlocks: validateJsonPayload(blocksSchema, payload.normalizedBlocks, "Normalized blocks"),
    searchStrategy: validateJsonPayload(searchStrategySchema, payload.searchStrategy, "Search strategy"),
    evidenceData: validateJsonPayload(contentEvidenceSchema, payload.evidenceData, "Evidence"),
    internalLinkData: validateJsonPayload(internalLinkingSchema, payload.internalLinkData, "Internal linking"),
    metadata: validateJsonPayload(metadataSchema, payload.metadata, "Metadata"),
    schemaConfiguration: validateJsonPayload(schemaConfigurationSchema, payload.schemaConfiguration, "Schema"),
    localizationData: validateJsonPayload(localizationDataSchema, payload.localizationData, "Localization"),
  };
}
