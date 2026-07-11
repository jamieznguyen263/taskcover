import { z } from "zod";
import { insightCategorySlugs, insightStatuses, type InsightArticle, type InsightBlock, type InsightRichText } from "@/content/insights.types";
import { locales } from "@/lib/i18n";

export const adminRoleSchema = z.enum(["admin", "editor"]);
export const adminUserStatusSchema = z.enum(["invited", "active", "disabled"]);
export const workflowStatusSchema = z.enum(insightStatuses);
export const localeSchema = z.enum(locales);

export const tiptapDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.unknown()).max(5000).optional(),
}).strict().superRefine((document, context) => {
  if (containsUnsafeEditorNode(document)) {
    context.addIssue({ code: "custom", message: "Raw HTML and executable editor nodes are not allowed." });
  }
});

const slugSchema = z.string().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case.");
const dateStringSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Expected a valid ISO date or datetime.");

export const createArticleInputSchema = z.object({
  creationKey: z.string().uuid(),
  sharedSlug: slugSchema,
  category: z.enum(insightCategorySlugs),
}).strict();

export const createCommentInputSchema = z.object({
  articleGroupId: z.string().uuid(),
  kind: z.enum(["comment", "change-request", "submission-note", "approval-note"]),
  body: z.string().trim().min(1).max(5000),
  locale: localeSchema.optional(),
}).strict();

export const resolveCommentInputSchema = z.object({
  commentId: z.string().uuid(),
}).strict();

export const updateAssignmentInputSchema = z.object({
  articleGroupId: z.string().uuid(),
  ownerId: z.string().uuid().nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  reviewerId: z.string().uuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
}).strict();

export const transitionArticleInputSchema = z.object({
  articleId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
  to: workflowStatusSchema,
  note: z.string().trim().max(2000).optional(),
  scheduledAt: z.string().datetime().optional(),
}).strict();

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
  excludedEntities: z.array(z.string()).optional(),
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
  sourceLocale: localeSchema.optional(),
  assignedTranslator: z.string().max(200).optional(),
  localeReviewStatus: z.enum(["pending", "approved", "changes-requested"]).optional(),
  syncedFromSourceVersion: z.number().int().nonnegative().optional(),
  localeKeyword: z.string().max(300).optional(),
});

const linkForBlockSchema = z.object({ label: z.string().min(1), href: z.string().min(1), note: z.string().optional() });
const faqItemSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });
const inlineMarkSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bold") }),
  z.object({ type: z.literal("italic") }),
  z.object({ type: z.literal("code") }),
  z.object({ type: z.literal("link"), href: z.string().min(1).max(2000) }),
]);
const richTextSegmentSchema = z.object({
  text: z.string(),
  marks: z.array(inlineMarkSchema).max(12).optional(),
});
const richTextSchema: z.ZodType<InsightRichText> = z.union([z.string(), z.array(richTextSegmentSchema).max(2000)]) as z.ZodType<InsightRichText>;

export const insightBlockSchema: z.ZodType<InsightBlock> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: richTextSchema }),
  z.object({ type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3), z.literal(4)]), text: z.string(), id: z.string().optional() }),
  z.object({ type: z.literal("bullet-list"), items: z.array(richTextSchema) }),
  z.object({ type: z.literal("numbered-list"), items: z.array(richTextSchema) }),
  z.object({ type: z.literal("quote"), quote: richTextSchema, attribution: z.string().optional() }),
  z.object({ type: z.literal("direct-answer"), title: z.string(), answer: z.string() }),
  z.object({ type: z.literal("key-takeaways"), title: z.string(), items: z.array(z.string()) }),
  z.object({ type: z.literal("definition"), term: z.string(), definition: z.string() }),
  z.object({ type: z.literal("callout"), title: z.string(), body: z.string(), tone: z.enum(["green", "blue", "amber"]).optional() }),
  z.object({ type: z.literal("comparison-table"), caption: z.string(), columns: z.array(z.string()), rows: z.array(z.array(z.string())) }),
  z.object({ type: z.literal("checklist"), title: z.string(), items: z.array(z.object({ label: z.string(), detail: z.string() })) }),
  z.object({ type: z.literal("steps"), title: z.string(), steps: z.array(z.object({ title: z.string(), body: z.string() })) }),
  z.object({ type: z.literal("evidence"), claimId: z.string(), summary: z.string(), sourceIds: z.array(z.string()) }),
  z.object({ type: z.literal("expert-insight"), title: z.string(), body: z.string() }),
  z.object({ type: z.literal("faq"), items: z.array(faqItemSchema) }),
  z.object({ type: z.literal("pros-cons"), title: z.string(), pros: z.array(z.string()), cons: z.array(z.string()) }),
  z.object({ type: z.literal("decision-framework"), title: z.string(), criteria: z.array(z.object({ signal: z.string(), action: z.string() })) }),
  z.object({ type: z.literal("case-study-reference"), title: z.string(), href: z.string(), summary: z.string() }),
  z.object({ type: z.literal("sample-audit-reference"), title: z.string(), href: z.string(), summary: z.string() }),
  z.object({ type: z.literal("related-service"), title: z.string(), href: z.string(), summary: z.string() }),
  z.object({ type: z.literal("cta"), title: z.string(), body: z.string(), primary: linkForBlockSchema, secondary: linkForBlockSchema.optional() }),
  z.object({ type: z.literal("statistic"), value: z.string(), label: z.string(), sourceId: z.string().optional(), note: z.string().optional() }),
  z.object({ type: z.literal("code"), code: z.string(), language: z.string().optional() }),
  z.object({ type: z.literal("image"), src: z.string(), alt: z.string(), caption: z.string().optional(), credit: z.string().optional(), width: z.number().int().positive().optional(), height: z.number().int().positive().optional(), mediaAssetId: z.string().optional(), lqip: z.string().optional() }),
  z.object({ type: z.literal("video"), provider: z.literal("youtube"), videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "Invalid YouTube video ID."), title: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal("divider") }),
]) as z.ZodType<InsightBlock>;

const blocksSchema: z.ZodType<InsightBlock[]> = z.array(insightBlockSchema).max(2000) as z.ZodType<InsightBlock[]>;

export const articleDraftSchema: z.ZodType<InsightArticle> = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  translationGroupId: z.string().min(1).max(200),
  locale: localeSchema,
  internalTitle: z.string().min(1).max(300),
  h1: z.string().min(1).max(300),
  excerpt: z.string().max(1000),
  category: z.enum(insightCategorySlugs),
  tags: z.array(z.string().max(100)).max(50),
  author: z.string().min(1).max(200),
  expertReviewer: z.string().max(200).optional(),
  editor: z.string().max(200).optional(),
  status: workflowStatusSchema,
  publishedAt: dateStringSchema,
  updatedAt: dateStringSchema,
  lastFactCheckedAt: dateStringSchema,
  scheduledAt: z.string().datetime().optional(),
  readingTime: z.number().int().nonnegative().max(1000),
  coverImage: z.string().max(2000),
  coverImageAlt: z.string().max(500),
  coverImageCaption: z.string().max(1000),
  blocks: blocksSchema,
  searchStrategy: searchStrategySchema,
  contentEvidence: contentEvidenceSchema,
  internalLinking: internalLinkingSchema,
  metadata: metadataSchema,
  schema: schemaConfigurationSchema,
  localization: localizationDataSchema,
  publishQa: z.object({ summary: z.string().max(2000), checkedAt: dateStringSchema }),
}).strict();

export const saveArticleInputSchema = z.object({
  articleId: z.string().uuid(),
  locale: localeSchema,
  expectedVersion: z.number().int().positive(),
  editorDocument: tiptapDocumentSchema,
  article: articleDraftSchema,
}).strict().superRefine((input, context) => {
  if (input.article.id !== input.articleId || input.article.locale !== input.locale) {
    context.addIssue({ code: "custom", message: "Article identity does not match the save target." });
  }
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

function containsUnsafeEditorNode(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsUnsafeEditorNode);
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (typeof record.type === "string" && ["html", "script", "iframe"].includes(record.type.toLowerCase())) return true;
  if ("html" in record) return true;
  return Object.values(record).some(containsUnsafeEditorNode);
}
