import { z } from "zod";
import { insightCategorySlugs, type InsightArticle } from "@/content/insights.types";
import { locales, type Locale } from "@/lib/i18n";
import { validateInsightArticle, type PublishQaResult } from "@/lib/insights/publish-qa";
import { createDraftArticle } from "./content-model";
import { computeReadingTime } from "./geo-analysis";
import { normalizeTiptapToInsightBlocks } from "./normalization";
import { articleDraftSchema, tiptapDocumentSchema } from "./validation";

const localeSchema = z.enum(locales);
const slugSchema = z.string().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case.");
const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());

const importLocalizationSchema = z.object({
  editorDocument: tiptapDocumentSchema,
  article: z.record(z.string(), z.unknown()).default({}),
}).strict();

export const contentImportPayloadSchema = z.object({
  schemaVersion: z.literal(1),
  creationKey: z.string().uuid(),
  sharedSlug: slugSchema,
  category: z.enum(insightCategorySlugs),
  author: z.string().trim().min(1).max(200),
  publicationLocales: z.array(localeSchema).min(1).max(locales.length),
  localizations: z.record(z.string(), importLocalizationSchema),
  assignment: z.object({
    ownerEmail: emailSchema.optional(),
    assigneeEmail: emailSchema.optional(),
    reviewerEmail: emailSchema.optional(),
    dueDate: z.string().datetime().nullable().optional(),
    priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  }).strict().optional(),
  importNote: z.string().trim().max(2000).optional(),
}).strict().superRefine((payload, context) => {
  const uniqueLocales = new Set(payload.publicationLocales);
  if (uniqueLocales.size !== payload.publicationLocales.length) {
    context.addIssue({ code: "custom", path: ["publicationLocales"], message: "publicationLocales must not contain duplicates." });
  }

  const provided = Object.keys(payload.localizations);
  for (const locale of provided) {
    if (!(locales as readonly string[]).includes(locale)) {
      context.addIssue({ code: "custom", path: ["localizations", locale], message: `Unsupported locale: ${locale}.` });
    }
    if (!uniqueLocales.has(locale as Locale)) {
      context.addIssue({
        code: "custom",
        path: ["localizations", locale],
        message: "Every supplied localization must be included in publicationLocales. Add translations only when they are ready to join the atomic publication set.",
      });
    }
  }

  for (const locale of payload.publicationLocales) {
    if (!payload.localizations[locale]) {
      context.addIssue({ code: "custom", path: ["localizations", locale], message: `Missing required ${locale} localization payload.` });
    }
  }
});

export type ContentImportPayload = z.infer<typeof contentImportPayloadSchema>;

export type ExistingImportLocalization = {
  article: InsightArticle;
  editorDocument: unknown;
};

export type PreparedImportLocalization = {
  locale: Locale;
  article: InsightArticle;
  editorDocument: unknown;
  qa: PublishQaResult[];
  summary: {
    slug: string;
    h1: string;
    blocks: number;
    claims: number;
    sources: number;
    internalLinks: number;
    blockingErrors: number;
    warnings: number;
  };
};

export type PreparedContentImport = {
  payload: ContentImportPayload;
  localizations: PreparedImportLocalization[];
  blockingErrors: number;
  warnings: number;
};

export function prepareContentImport(
  input: unknown,
  context: {
    groupId?: string;
    translationGroupId?: string;
    existingLocalizations?: Partial<Record<Locale, ExistingImportLocalization>>;
    now?: Date;
  } = {}
): PreparedContentImport {
  const payload = contentImportPayloadSchema.parse(input);
  const now = context.now ?? new Date();
  const groupId = context.groupId ?? "content-import-preview-group";
  const translationGroupId = context.translationGroupId ?? `insight-${payload.creationKey}`;

  const staged = payload.publicationLocales.map((locale) => {
    const existing = context.existingLocalizations?.[locale];
    const base = existing?.article ?? createDraftArticle({
      groupId,
      translationGroupId,
      slug: payload.sharedSlug,
      category: payload.category,
      locale,
      author: payload.author,
      now,
    }).article;
    const localization = payload.localizations[locale]!;
    const article = mergeArticleDraft(base, localization.article, localization.editorDocument, payload, locale, now);
    return { locale, article, editorDocument: localization.editorDocument };
  });

  const articles = staged.map((item) => item.article);
  const localizations = staged.map((item): PreparedImportLocalization => {
    const qa = validateInsightArticle(item.article, articles);
    const internalLinks = [
      ...item.article.internalLinking.requiredInternalLinks,
      ...item.article.internalLinking.suggestedInternalLinks,
      ...item.article.internalLinking.serviceLinks,
      ...item.article.internalLinking.industryLinks,
      ...item.article.internalLinking.marketLinks,
      ...item.article.internalLinking.caseStudyLinks,
      ...item.article.internalLinking.sampleAuditLinks,
    ].filter((link) => link.href).length;
    return {
      ...item,
      qa,
      summary: {
        slug: item.article.slug,
        h1: item.article.h1,
        blocks: item.article.blocks.length,
        claims: item.article.contentEvidence.claims.length,
        sources: item.article.contentEvidence.sources.length,
        internalLinks,
        blockingErrors: qa.filter((result) => result.severity === "error").length,
        warnings: qa.filter((result) => result.severity === "warning").length,
      },
    };
  });

  return {
    payload,
    localizations,
    blockingErrors: localizations.reduce((sum, item) => sum + item.summary.blockingErrors, 0),
    warnings: localizations.reduce((sum, item) => sum + item.summary.warnings, 0),
  };
}

function mergeArticleDraft(
  base: InsightArticle,
  patchInput: Record<string, unknown>,
  editorDocument: unknown,
  payload: ContentImportPayload,
  locale: Locale,
  now: Date
): InsightArticle {
  const patch = patchInput as Partial<InsightArticle>;
  const blocks = normalizeTiptapToInsightBlocks(editorDocument);
  const timestamp = now.toISOString();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const article = {
    ...base,
    ...patch,
    id: base.id,
    translationGroupId: base.translationGroupId,
    locale,
    category: payload.category,
    author: payload.author,
    status: "draft" as const,
    publishedAt: base.publishedAt,
    updatedAt: timestamp,
    scheduledAt: undefined,
    readingTime: computeReadingTime(blocks),
    blocks,
    searchStrategy: { ...base.searchStrategy, ...asRecord(patch.searchStrategy) },
    contentEvidence: { ...base.contentEvidence, ...asRecord(patch.contentEvidence) },
    internalLinking: { ...base.internalLinking, ...asRecord(patch.internalLinking) },
    metadata: {
      ...base.metadata,
      canonical: `${prefix}/insights/${payload.category}/${typeof patch.slug === "string" ? patch.slug : base.slug}`,
      ...asRecord(patch.metadata),
    },
    schema: { ...base.schema, ...asRecord(patch.schema) },
    localization: {
      ...base.localization,
      ...asRecord(patch.localization),
      hreflangGroup: base.translationGroupId,
      xDefaultSlug: payload.sharedSlug,
    },
    publishQa: { summary: "Publish QA has not run.", checkedAt: timestamp },
  };

  return articleDraftSchema.parse(article);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
