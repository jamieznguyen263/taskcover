import "server-only";

import crypto from "node:crypto";
import { and, count, desc, eq, gt, inArray, isNotNull, isNull, lt, max, ne, sql } from "drizzle-orm";
import type { InsightArticle, InsightCategorySlug, InsightStatus } from "@/content/insights.types";
import { locales, type Locale } from "@/lib/i18n";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  adminAuditLogs,
  adminInvites,
  adminSessions,
  adminUsers,
  contentComments,
  insightArticleGroups,
  insightArticleLocalizations,
  insightArticleRevisions,
  mediaAssets,
  mediaUsages,
  workflowEvents,
} from "@/lib/db/schema";
import { hashToken, normalizeEmail } from "./security";
import { assertWorkflowDecision } from "./workflow";
import { createDraftArticle, ContentConflictError, ContentStateError, materializePublishedSnapshot, newTranslationGroupId, type EditableArticleGroup } from "./content-model";
import { articleDraftSchema, createArticleInputSchema, publishedArticleSnapshotSchema, saveArticleInputSchema, transitionArticleInputSchema, validateJsonPayload } from "./validation";
import type { AdminRole } from "./permissions";
import { normalizeTiptapToInsightBlocks } from "./normalization";
import { computeReadingTime } from "./geo-analysis";
import { validateInsightArticle, type PublishQaResult } from "@/lib/insights/publish-qa";

export type AdminUserSession = {
  userId: string;
  email: string;
  // "external" (FLOW-003) sessions are valid for /flow only; requireAdminSession and the
  // /api/admin routes reject them before any CMS work happens.
  role: "admin" | "editor" | "external";
  displayName: string;
  sessionId: string;
};

/** A session that has passed the CMS gate — the only shape CMS pages/actions work with. */
export type AdminCmsSession = AdminUserSession & { role: "admin" | "editor" };

export type ArticleSummary = {
  id: string;
  title: string;
  category: string;
  status: InsightStatus;
  hasPublishedSnapshot: boolean;
  localeCount: number;
  updatedAt: Date;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  lockVersion: number;
  ownerId: string | null;
  assigneeId: string | null;
  reviewerId: string | null;
  createdBy: string | null;
  dueDate: Date | null;
  priority: "low" | "normal" | "high" | "urgent";
};

export type ArticleAssignment = {
  ownerId: string | null;
  assigneeId: string | null;
  reviewerId: string | null;
  dueDate: string | null;
  priority: "low" | "normal" | "high" | "urgent";
};

export type ContentComment = {
  id: string;
  articleGroupId: string;
  authorId: string | null;
  authorName: string | null;
  kind: "comment" | "change-request" | "submission-note" | "approval-note";
  body: string;
  locale: Locale | null;
  resolvedAt: Date | null;
  resolvedByName: string | null;
  createdAt: Date;
};

export type WorkflowEventEntry = {
  id: string;
  fromStatus: InsightStatus | null;
  toStatus: InsightStatus;
  actorName: string | null;
  note: string | null;
  createdAt: Date;
};

export type DashboardStats = {
  total: number;
  draft: number;
  inReview: number;
  approved: number;
  scheduled: number;
  published: number;
  archived: number;
};

export class AdminRepository {
  constructor(private readonly db: AdminDb = getDb()) {}

  async findUserByEmail(email: string) {
    return this.db.query.adminUsers.findFirst({
      where: eq(adminUsers.normalizedEmail, normalizeEmail(email)),
    });
  }

  async upsertAdminUser(input: {
    email: string;
    displayName: string;
    role: "admin" | "editor";
    passwordHash: string;
    status?: "invited" | "active" | "disabled";
  }) {
    const normalizedEmail = normalizeEmail(input.email);
    const [user] = await this.db
      .insert(adminUsers)
      .values({
        email: input.email,
        normalizedEmail,
        displayName: input.displayName,
        role: input.role,
        status: input.status ?? "active",
        passwordHash: input.passwordHash,
        passwordChangedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: adminUsers.normalizedEmail,
        set: {
          email: input.email,
          displayName: input.displayName,
          role: input.role,
          status: input.status ?? "active",
          passwordHash: input.passwordHash,
          passwordChangedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createSession(input: {
    userId: string;
    token: string;
    expiresAt: Date;
    userAgentSummary: string | null;
    ipHash: string | null;
  }) {
    const [session] = await this.db
      .insert(adminSessions)
      .values({
        userId: input.userId,
        tokenHash: hashToken(input.token),
        expiresAt: input.expiresAt,
        userAgentSummary: input.userAgentSummary,
        ipHash: input.ipHash,
        lastUsedAt: new Date(),
      })
      .returning();
    return session;
  }

  async resolveSession(token: string): Promise<AdminUserSession | null> {
    const tokenHash = hashToken(token);
    const row = await this.db
      .select({
        sessionId: adminSessions.id,
        userId: adminUsers.id,
        email: adminUsers.email,
        role: adminUsers.role,
        displayName: adminUsers.displayName,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
      .where(
        and(
          eq(adminSessions.tokenHash, tokenHash),
          gt(adminSessions.expiresAt, new Date()),
          isNull(adminSessions.revokedAt),
          eq(adminUsers.status, "active")
        )
      )
      .limit(1);

    if (!row[0]) return null;
    await this.db.update(adminSessions).set({ lastUsedAt: new Date() }).where(eq(adminSessions.id, row[0].sessionId));
    return row[0];
  }

  async revokeSession(sessionId: string) {
    await this.db.update(adminSessions).set({ revokedAt: new Date() }).where(eq(adminSessions.id, sessionId));
  }

  async revokeUserSessions(userId: string) {
    await this.db.update(adminSessions).set({ revokedAt: new Date() }).where(eq(adminSessions.userId, userId));
  }

  async createInvite(input: {
    email: string;
    role: "admin" | "editor";
    token: string;
    expiresAt: Date;
    invitedBy: string;
  }) {
    const [invite] = await this.db
      .insert(adminInvites)
      .values({
        email: input.email,
        normalizedEmail: normalizeEmail(input.email),
        role: input.role,
        tokenHash: hashToken(input.token),
        expiresAt: input.expiresAt,
        invitedBy: input.invitedBy,
      })
      .returning();
    return invite;
  }

  async acceptInvite(input: { token: string; passwordHash: string; displayName: string }) {
    const tokenHash = hashToken(input.token);
    return this.db.transaction(async (tx) => {
      const invite = await tx.query.adminInvites.findFirst({
        where: and(eq(adminInvites.tokenHash, tokenHash), isNull(adminInvites.acceptedAt), isNull(adminInvites.revokedAt), gt(adminInvites.expiresAt, new Date())),
      });
      if (!invite) throw new Error("Invite is invalid or expired.");

      const [user] = await tx
        .insert(adminUsers)
        .values({
          email: invite.email,
          normalizedEmail: invite.normalizedEmail,
          displayName: input.displayName,
          role: invite.role,
          status: "active",
          passwordHash: input.passwordHash,
          passwordChangedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: adminUsers.normalizedEmail,
          set: {
            displayName: input.displayName,
            role: invite.role,
            status: "active",
            passwordHash: input.passwordHash,
            passwordChangedAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .returning();

      await tx.update(adminSessions).set({ revokedAt: new Date() }).where(and(eq(adminSessions.userId, user.id), isNull(adminSessions.revokedAt)));
      await tx.update(adminInvites).set({ acceptedAt: new Date() }).where(eq(adminInvites.id, invite.id));
      return user;
    });
  }

  async dashboardStats(): Promise<DashboardStats> {
    const rows = await this.db
      .select({ status: insightArticleGroups.draftWorkflowStatus, value: count() })
      .from(insightArticleGroups)
      .groupBy(insightArticleGroups.draftWorkflowStatus);

    const stats: DashboardStats = {
      total: 0,
      draft: 0,
      inReview: 0,
      approved: 0,
      scheduled: 0,
      published: 0,
      archived: 0,
    };

    for (const row of rows) {
      stats.total += row.value;
      if (row.status === "draft") stats.draft = row.value;
      if (row.status === "in-review") stats.inReview = row.value;
      if (row.status === "approved") stats.approved = row.value;
      if (row.status === "scheduled") stats.scheduled = row.value;
      if (row.status === "published") stats.published = row.value;
      if (row.status === "archived") stats.archived = row.value;
    }
    return stats;
  }

  async listArticleSummaries(): Promise<ArticleSummary[]> {
    const rows = await this.db
      .select({
        id: insightArticleGroups.id,
        title: insightArticleGroups.sharedSlug,
        category: insightArticleGroups.categorySlug,
        status: insightArticleGroups.draftWorkflowStatus,
        publishedRevisionGroupId: insightArticleGroups.publishedRevisionGroupId,
        localeCount: count(insightArticleLocalizations.id),
        updatedAt: insightArticleGroups.updatedAt,
        scheduledAt: insightArticleGroups.scheduledAt,
        publishedAt: insightArticleGroups.publishedAt,
        lockVersion: insightArticleGroups.lockVersion,
        ownerId: insightArticleGroups.ownerId,
        assigneeId: insightArticleGroups.assigneeId,
        reviewerId: insightArticleGroups.reviewerId,
        createdBy: insightArticleGroups.createdBy,
        dueDate: insightArticleGroups.dueDate,
        priority: insightArticleGroups.priority,
      })
      .from(insightArticleGroups)
      .leftJoin(insightArticleLocalizations, eq(insightArticleGroups.id, insightArticleLocalizations.articleGroupId))
      .groupBy(insightArticleGroups.id)
      .orderBy(desc(insightArticleGroups.updatedAt));

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      status: row.status,
      hasPublishedSnapshot: Boolean(row.publishedRevisionGroupId),
      localeCount: row.localeCount,
      updatedAt: row.updatedAt,
      scheduledAt: row.scheduledAt,
      publishedAt: row.publishedAt,
      lockVersion: row.lockVersion,
      ownerId: row.ownerId,
      assigneeId: row.assigneeId,
      reviewerId: row.reviewerId,
      createdBy: row.createdBy,
      dueDate: row.dueDate,
      priority: row.priority,
    }));
  }

  async getArticleGroup(id: string) {
    const group = await this.db.query.insightArticleGroups.findFirst({
      where: eq(insightArticleGroups.id, id),
    });
    if (!group) return null;
    const localizations = await this.db.query.insightArticleLocalizations.findMany({
      where: eq(insightArticleLocalizations.articleGroupId, id),
    });
    const revisions = await this.db.query.insightArticleRevisions.findMany({
      where: sql`${insightArticleRevisions.localizationId} IN (SELECT id FROM insight_article_localizations WHERE article_group_id = ${id})`,
      orderBy: desc(insightArticleRevisions.createdAt),
      limit: 25,
    });
    return { group, localizations, revisions };
  }

  /** Pure transform from a raw getArticleGroup result to the editable view (no DB access). */
  toEditableArticleGroup(value: Awaited<ReturnType<AdminRepository["getArticleGroup"]>>): EditableArticleGroup | null {
    if (!value) return null;
    return {
      id: value.group.id,
      status: value.group.draftWorkflowStatus,
      lockVersion: value.group.lockVersion,
      scheduledAt: value.group.scheduledAt?.toISOString() ?? null,
      publishedAt: value.group.publishedAt?.toISOString() ?? null,
      approvedAt: value.group.approvedAt?.toISOString() ?? null,
      localizations: value.localizations.map((localization) => ({
        id: localization.id,
        locale: localization.locale,
        draftVersion: localization.draftVersion,
        editorDocument: localization.editorDocument,
        article: articleDraftSchema.parse(localization.draftSnapshot),
        publishedSnapshot: localization.publishedSnapshot ? publishedArticleSnapshotSchema.parse(localization.publishedSnapshot) : null,
      })),
    };
  }

  async getEditableArticleGroup(id: string): Promise<EditableArticleGroup | null> {
    return this.toEditableArticleGroup(await this.getArticleGroup(id));
  }

  async createArticleDraft(input: {
    creationKey: string;
    sharedSlug: string;
    category: InsightCategorySlug;
    actorId: string;
    author: string;
  }) {
    const parsed = createArticleInputSchema.parse({ creationKey: input.creationKey, sharedSlug: input.sharedSlug, category: input.category });
    return this.db.transaction(async (tx) => {
      const existing = await tx.query.insightArticleGroups.findFirst({
        where: eq(insightArticleGroups.creationKey, parsed.creationKey),
      });
      if (existing) return { articleId: existing.id, created: false };

      const translationGroupId = newTranslationGroupId();
      const [group] = await tx
        .insert(insightArticleGroups)
        .values({
          translationGroupId,
          sharedSlug: parsed.sharedSlug,
          categorySlug: parsed.category,
          authorKey: input.author,
          creationKey: parsed.creationKey,
          draftWorkflowStatus: "draft",
          createdBy: input.actorId,
          updatedBy: input.actorId,
          lockVersion: 1,
        })
        .onConflictDoNothing({ target: insightArticleGroups.creationKey })
        .returning();

      if (!group) {
        const concurrent = await tx.query.insightArticleGroups.findFirst({ where: eq(insightArticleGroups.creationKey, parsed.creationKey) });
        if (!concurrent) throw new Error("Draft creation conflict could not be resolved.");
        return { articleId: concurrent.id, created: false };
      }

      for (const locale of locales) {
        const { article, editorDocument } = createDraftArticle({
          groupId: group.id,
          translationGroupId,
          slug: parsed.sharedSlug,
          category: parsed.category,
          locale,
          author: input.author,
        });
        await tx.insert(insightArticleLocalizations).values({
          articleGroupId: group.id,
          locale,
          slug: article.slug,
          internalTitle: article.internalTitle,
          publicH1: article.h1,
          excerpt: article.excerpt,
          editorDocument,
          normalizedBlocks: article.blocks,
          draftSnapshot: article,
          searchStrategy: article.searchStrategy,
          evidenceData: article.contentEvidence,
          internalLinkData: article.internalLinking,
          metadata: article.metadata,
          socialMetadata: socialMetadataFor(article),
          schemaConfiguration: article.schema,
          localizationData: article.localization,
          publishQaSnapshot: [],
          draftVersion: 1,
        });
      }

      await tx.insert(workflowEvents).values({ articleGroupId: group.id, fromStatus: null, toStatus: "draft", actorId: input.actorId, note: "Draft created." });
      await tx.insert(adminAuditLogs).values({
        event: "article_create",
        actorId: input.actorId,
        targetType: "insight_article_group",
        targetId: group.id,
        summary: "Insight draft group created.",
        metadata: { category: parsed.category, locales: [...locales] },
      });
      return { articleId: group.id, created: true };
    });
  }

  async saveArticleDraft(input: {
    articleId: string;
    locale: Locale;
    expectedVersion: number;
    editorDocument: unknown;
    article: InsightArticle;
    actorId: string;
  }) {
    const parsed = saveArticleInputSchema.parse({
      articleId: input.articleId,
      locale: input.locale,
      expectedVersion: input.expectedVersion,
      editorDocument: input.editorDocument,
      article: input.article,
    });
    const normalizedBlocks = normalizeTiptapToInsightBlocks(parsed.editorDocument);
    const now = new Date();
    const nextArticle = articleDraftSchema.parse({
      ...parsed.article,
      status: "draft",
      blocks: normalizedBlocks,
      readingTime: computeReadingTime(normalizedBlocks),
      updatedAt: now.toISOString(),
    });

    return this.db.transaction(async (tx) => {
      const [group] = await tx
        .update(insightArticleGroups)
        .set({ lockVersion: sql`${insightArticleGroups.lockVersion} + 1`, updatedAt: now, updatedBy: input.actorId })
        .where(and(
          eq(insightArticleGroups.id, parsed.articleId),
          eq(insightArticleGroups.lockVersion, parsed.expectedVersion),
          eq(insightArticleGroups.draftWorkflowStatus, "draft")
        ))
        .returning();

      if (!group) {
        const current = await tx.query.insightArticleGroups.findFirst({ where: eq(insightArticleGroups.id, parsed.articleId) });
        if (!current) throw new ContentStateError("Article does not exist.");
        if (current.lockVersion !== parsed.expectedVersion) throw new ContentConflictError("Conflict detected. Reload the latest article before saving.");
        throw new ContentStateError(`Articles in ${current.draftWorkflowStatus} cannot be edited.`);
      }

      const [localization] = await tx
        .update(insightArticleLocalizations)
        .set({
          slug: nextArticle.slug,
          internalTitle: nextArticle.internalTitle,
          publicH1: nextArticle.h1,
          excerpt: nextArticle.excerpt,
          editorDocument: parsed.editorDocument,
          normalizedBlocks,
          draftSnapshot: nextArticle,
          searchStrategy: nextArticle.searchStrategy,
          evidenceData: nextArticle.contentEvidence,
          internalLinkData: nextArticle.internalLinking,
          metadata: nextArticle.metadata,
          socialMetadata: socialMetadataFor(nextArticle),
          schemaConfiguration: nextArticle.schema,
          localizationData: nextArticle.localization,
          draftVersion: sql`${insightArticleLocalizations.draftVersion} + 1`,
          updatedAt: now,
        })
        .where(and(eq(insightArticleLocalizations.articleGroupId, parsed.articleId), eq(insightArticleLocalizations.locale, parsed.locale)))
        .returning();
      if (!localization) throw new ContentStateError(`Missing ${parsed.locale} localization.`);

      await tx.insert(adminAuditLogs).values({
        event: "article_save",
        actorId: input.actorId,
        targetType: "insight_article_group",
        targetId: parsed.articleId,
        summary: `Saved ${parsed.locale} draft content.`,
        metadata: { locale: parsed.locale, lockVersion: group.lockVersion },
      });
      return { lockVersion: group.lockVersion, draftVersion: localization.draftVersion, savedAt: now.toISOString() };
    });
  }

  async transitionArticle(input: {
    articleId: string;
    expectedVersion: number;
    to: InsightStatus;
    note?: string;
    scheduledAt?: string;
    actorId: string | null;
    role: AdminRole;
    schedulerConfigured?: boolean;
  }) {
    const parsed = transitionArticleInputSchema.parse({
      articleId: input.articleId,
      expectedVersion: input.expectedVersion,
      to: input.to,
      note: input.note,
      scheduledAt: input.scheduledAt,
    });
    return this.db.transaction(async (tx) => {
      const group = await tx.query.insightArticleGroups.findFirst({ where: eq(insightArticleGroups.id, parsed.articleId) });
      if (!group) throw new ContentStateError("Article does not exist.");
      if (group.draftWorkflowStatus === "archived" && parsed.to === "draft") throw new ContentStateError("Archived content must be restored from a specific immutable revision.");
      if (group.lockVersion !== parsed.expectedVersion) throw new ContentConflictError("Workflow state changed. Reload before continuing.");
      if (parsed.to === "scheduled" && !input.schedulerConfigured) throw new ContentStateError("Scheduled publishing is disabled for this environment.");
      if (parsed.to === "scheduled" && (!parsed.scheduledAt || new Date(parsed.scheduledAt).getTime() <= Date.now())) {
        throw new ContentStateError("Schedule time must be in the future.");
      }

      const localizationRows = await tx.query.insightArticleLocalizations.findMany({
        where: eq(insightArticleLocalizations.articleGroupId, group.id),
      });
      const drafts = localizationRows.map((row) => articleDraftSchema.parse(row.draftSnapshot));
      assertWorkflowDecision({ from: group.draftWorkflowStatus, to: parsed.to, role: input.role, translations: drafts });

      const now = new Date();
      const qaByLocale = new Map<Locale, PublishQaResult[]>();
      if (["approved", "scheduled", "published"].includes(parsed.to)) {
        for (const article of drafts) qaByLocale.set(article.locale, validateInsightArticle(article, drafts));
      }

      let revisionGroupId: string | undefined;
      if (parsed.to === "published") {
        revisionGroupId = crypto.randomUUID();
        const snapshots = drafts.map((article) => materializePublishedSnapshot(article, now));
        for (const snapshot of snapshots) {
          const errors = validateInsightArticle(snapshot, snapshots).filter((item) => item.severity === "error");
          if (errors.length) throw new ContentStateError(`Cannot publish ${snapshot.locale}: ${errors.map((item) => item.message).join("; ")}`);
        }

        for (const row of localizationRows) {
          const snapshot = snapshots.find((article) => article.locale === row.locale)!;
          const [revisionCount] = await tx
            .select({ value: max(insightArticleRevisions.revisionNumber) })
            .from(insightArticleRevisions)
            .where(eq(insightArticleRevisions.localizationId, row.id));
          const [revision] = await tx.insert(insightArticleRevisions).values({
            revisionGroupId,
            localizationId: row.id,
            revisionNumber: (revisionCount?.value ?? 0) + 1,
            editorDocument: row.editorDocument,
            normalizedBlocks: row.normalizedBlocks,
            articleSnapshot: snapshot,
            metadataSnapshot: snapshot.metadata,
            seoSnapshot: snapshot.searchStrategy,
            evidenceSnapshot: snapshot.contentEvidence,
            createdBy: input.actorId,
            revisionReason: parsed.note || "Published from Admin workflow.",
            workflowTransition: `${group.draftWorkflowStatus}->published`,
          }).returning();
          await tx.update(insightArticleLocalizations).set({
            draftSnapshot: snapshot,
            publishedSnapshot: snapshot,
            publishedRevisionId: revision.id,
            publishQaSnapshot: validateInsightArticle(snapshot, snapshots),
            updatedAt: now,
          }).where(eq(insightArticleLocalizations.id, row.id));
        }
      } else {
        for (const row of localizationRows) {
          const draft = articleDraftSchema.parse({
            ...articleDraftSchema.parse(row.draftSnapshot),
            status: parsed.to,
            scheduledAt: parsed.to === "scheduled" ? parsed.scheduledAt : undefined,
            updatedAt: now.toISOString(),
            publishQa: {
              summary: summarizeQa(qaByLocale.get(row.locale) ?? []),
              checkedAt: now.toISOString(),
            },
          });
          await tx.update(insightArticleLocalizations).set({
            draftSnapshot: draft,
            publishQaSnapshot: qaByLocale.get(row.locale) ?? [],
            updatedAt: now,
          }).where(eq(insightArticleLocalizations.id, row.id));
        }
      }

      const update = {
        draftWorkflowStatus: parsed.to,
        lockVersion: sql`${insightArticleGroups.lockVersion} + 1`,
        updatedAt: now,
        updatedBy: input.actorId,
        scheduledAt: parsed.to === "scheduled" ? new Date(parsed.scheduledAt!) : null,
        approvedBy: parsed.to === "approved" ? input.actorId : group.approvedBy,
        approvedAt: parsed.to === "approved" ? now : group.approvedAt,
        publishedRevisionGroupId: revisionGroupId ?? group.publishedRevisionGroupId,
        publishedAt: parsed.to === "published" ? now : group.publishedAt,
        archivedAt: parsed.to === "archived" ? now : parsed.to === "draft" || parsed.to === "published" ? null : group.archivedAt,
      };
      const [updated] = await tx.update(insightArticleGroups).set(update).where(and(
        eq(insightArticleGroups.id, group.id),
        eq(insightArticleGroups.lockVersion, parsed.expectedVersion),
        eq(insightArticleGroups.draftWorkflowStatus, group.draftWorkflowStatus)
      )).returning();
      if (!updated) throw new ContentConflictError("Workflow state changed concurrently.");

      await tx.insert(workflowEvents).values({
        articleGroupId: group.id,
        fromStatus: group.draftWorkflowStatus,
        toStatus: parsed.to,
        actorId: input.actorId,
        note: parsed.note,
        metadata: parsed.scheduledAt ? { scheduledAt: parsed.scheduledAt } : {},
      });
      await tx.insert(adminAuditLogs).values({
        event: auditEventFor(group.draftWorkflowStatus, parsed.to),
        actorId: input.actorId,
        targetType: "insight_article_group",
        targetId: group.id,
        summary: `Article workflow changed from ${group.draftWorkflowStatus} to ${parsed.to}.`,
        metadata: { from: group.draftWorkflowStatus, to: parsed.to },
      });
      return { articleId: group.id, status: updated.draftWorkflowStatus, lockVersion: updated.lockVersion, qa: Object.fromEntries(qaByLocale) };
    });
  }

  async restorePublishedRevision(input: { articleId: string; revisionId: string; expectedVersion: number; actorId: string; role: AdminRole; note?: string }) {
    if (input.role !== "admin") throw new ContentStateError("Only Admin can restore published revisions.");
    return this.db.transaction(async (tx) => {
      const group = await tx.query.insightArticleGroups.findFirst({ where: eq(insightArticleGroups.id, input.articleId) });
      if (!group) throw new ContentStateError("Article does not exist.");
      if (group.lockVersion !== input.expectedVersion) throw new ContentConflictError("Workflow state changed. Reload before restoring.");
      if (group.draftWorkflowStatus !== "archived") throw new ContentStateError("Only archived articles can restore a published revision.");

      const target = await tx.query.insightArticleRevisions.findFirst({ where: eq(insightArticleRevisions.id, input.revisionId) });
      if (!target) throw new ContentStateError("Published revision does not exist.");
      const localizationRows = await tx.query.insightArticleLocalizations.findMany({
        where: eq(insightArticleLocalizations.articleGroupId, group.id),
      });
      if (!localizationRows.some((row) => row.id === target.localizationId)) throw new ContentStateError("Revision does not belong to this article.");
      const revisions = await tx.query.insightArticleRevisions.findMany({
        where: and(
          eq(insightArticleRevisions.revisionGroupId, target.revisionGroupId),
          inArray(insightArticleRevisions.localizationId, localizationRows.map((row) => row.id))
        ),
      });
      if (revisions.length !== locales.length) throw new ContentStateError("Revision group is incomplete and cannot be restored.");

      const now = new Date();
      for (const row of localizationRows) {
        const revision = revisions.find((item) => item.localizationId === row.id);
        if (!revision) throw new ContentStateError(`Revision is missing ${row.locale}.`);
        const restored = articleDraftSchema.parse({
          ...publishedArticleSnapshotSchema.parse(revision.articleSnapshot),
          status: "draft",
          scheduledAt: undefined,
          updatedAt: now.toISOString(),
        });
        await tx.update(insightArticleLocalizations).set({
          editorDocument: revision.editorDocument,
          normalizedBlocks: revision.normalizedBlocks,
          draftSnapshot: restored,
          slug: restored.slug,
          internalTitle: restored.internalTitle,
          publicH1: restored.h1,
          excerpt: restored.excerpt,
          searchStrategy: restored.searchStrategy,
          evidenceData: restored.contentEvidence,
          internalLinkData: restored.internalLinking,
          metadata: restored.metadata,
          socialMetadata: socialMetadataFor(restored),
          schemaConfiguration: restored.schema,
          localizationData: restored.localization,
          draftVersion: sql`${insightArticleLocalizations.draftVersion} + 1`,
          updatedAt: now,
        }).where(eq(insightArticleLocalizations.id, row.id));
      }

      const [updated] = await tx.update(insightArticleGroups).set({
        draftWorkflowStatus: "draft",
        archivedAt: group.archivedAt,
        scheduledAt: null,
        updatedBy: input.actorId,
        updatedAt: now,
        lockVersion: sql`${insightArticleGroups.lockVersion} + 1`,
      }).where(and(
        eq(insightArticleGroups.id, group.id),
        eq(insightArticleGroups.lockVersion, input.expectedVersion),
        eq(insightArticleGroups.draftWorkflowStatus, "archived")
      )).returning();
      if (!updated) throw new ContentConflictError("Workflow state changed concurrently.");

      await tx.insert(workflowEvents).values({
        articleGroupId: group.id,
        fromStatus: "archived",
        toStatus: "draft",
        actorId: input.actorId,
        note: input.note || "Restored immutable published revision into a new draft.",
        metadata: { revisionGroupId: target.revisionGroupId },
      });
      await tx.insert(adminAuditLogs).values({
        event: "restore_revision",
        actorId: input.actorId,
        targetType: "insight_article_group",
        targetId: group.id,
        summary: "Published revision restored into an editable draft.",
        metadata: { revisionGroupId: target.revisionGroupId },
      });
      return { articleId: group.id, status: updated.draftWorkflowStatus, lockVersion: updated.lockVersion };
    });
  }

  async listPublishedSnapshots(locale: Locale): Promise<InsightArticle[]> {
    const rows = await this.db
      .select({ snapshot: insightArticleLocalizations.publishedSnapshot })
      .from(insightArticleLocalizations)
      .innerJoin(insightArticleGroups, eq(insightArticleGroups.id, insightArticleLocalizations.articleGroupId))
      .where(
        and(
          eq(insightArticleLocalizations.locale, locale),
          isNotNull(insightArticleGroups.publishedRevisionGroupId),
          isNull(insightArticleGroups.archivedAt)
        )
      );
    return rows
      .map((row) => row.snapshot)
      .filter(Boolean)
      .map((snapshot) => validateJsonPayload(publishedArticleSnapshotSchema, snapshot, "Published snapshot"));
  }

  /**
   * Lightweight targets for internal-link suggestions. Selects only the four
   * fields the suggestion provider needs from indexed columns plus one JSON
   * field, instead of loading every published article's full snapshot blob.
   */
  async listPublishedLinkTargets(locale: Locale): Promise<{ slug: string; category: string; h1: string; focusKeyword: string }[]> {
    const rows = await this.db
      .select({
        slug: insightArticleLocalizations.slug,
        category: insightArticleGroups.categorySlug,
        h1: insightArticleLocalizations.publicH1,
        focusKeyword: sql<string | null>`${insightArticleLocalizations.searchStrategy} ->> 'focusKeyword'`,
      })
      .from(insightArticleLocalizations)
      .innerJoin(insightArticleGroups, eq(insightArticleGroups.id, insightArticleLocalizations.articleGroupId))
      .where(
        and(
          eq(insightArticleLocalizations.locale, locale),
          isNotNull(insightArticleGroups.publishedRevisionGroupId),
          isNull(insightArticleGroups.archivedAt)
        )
      );
    return rows.map((row) => ({ slug: row.slug, category: row.category, h1: row.h1, focusKeyword: row.focusKeyword ?? "" }));
  }

  async createWorkflowEvent(input: {
    articleGroupId: string;
    fromStatus: InsightStatus | null;
    toStatus: InsightStatus;
    actorId: string | null;
    note?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.db.insert(workflowEvents).values(input);
  }

  async audit(input: {
    event: typeof adminAuditLogs.$inferInsert.event;
    actorId?: string | null;
    targetType?: string;
    targetId?: string;
    summary: string;
    metadata?: Record<string, unknown>;
    ipHash?: string | null;
    userAgentSummary?: string | null;
  }) {
    await this.db.insert(adminAuditLogs).values({
      event: input.event,
      actorId: input.actorId,
      targetType: input.targetType,
      targetId: input.targetId,
      summary: input.summary,
      metadata: scrubAuditMetadata(input.metadata ?? {}),
      ipHash: input.ipHash,
      userAgentSummary: input.userAgentSummary,
    });
  }

  async listAuditLogs() {
    return this.db.query.adminAuditLogs.findMany({
      orderBy: desc(adminAuditLogs.createdAt),
      limit: 100,
    });
  }

  async listUsers() {
    // CMS user management covers CMS accounts only; external collaborators (FLOW-003)
    // are managed from /flow/admin and never appear here.
    const rows = await this.db.query.adminUsers.findMany({
      columns: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      where: ne(adminUsers.role, "external"),
      orderBy: desc(adminUsers.createdAt),
    });
    return rows.filter((row): row is typeof row & { role: AdminRole } => row.role !== "external");
  }

  async listPendingInvites() {
    // External invites (role='external') live on /flow/admin, not in the CMS invite list.
    const rows = await this.db.query.adminInvites.findMany({
      columns: { id: true, email: true, role: true, expiresAt: true, createdAt: true },
      where: and(
        isNull(adminInvites.acceptedAt),
        isNull(adminInvites.revokedAt),
        gt(adminInvites.expiresAt, new Date()),
        ne(adminInvites.role, "external")
      ),
      orderBy: desc(adminInvites.createdAt),
    });
    return rows.filter((row): row is typeof row & { role: AdminRole } => row.role !== "external");
  }

  async revokeInvite(input: { inviteId: string; actorId: string }) {
    return this.db.transaction(async (tx) => {
      const [invite] = await tx.update(adminInvites).set({ revokedAt: new Date() }).where(and(eq(adminInvites.id, input.inviteId), isNull(adminInvites.acceptedAt), isNull(adminInvites.revokedAt))).returning();
      if (!invite) throw new ContentStateError("Invite is unavailable or already used.");
      await tx.insert(adminAuditLogs).values({ event: "user_invite", actorId: input.actorId, targetType: "admin_user", targetId: invite.normalizedEmail, summary: "Admin invitation revoked.", metadata: { action: "revoked" } });
      return invite.id;
    });
  }

  async updateUserAccess(input: { targetUserId: string; actorId: string; role?: AdminRole; status?: "active" | "disabled" }) {
    if (input.targetUserId === input.actorId && (input.role === "editor" || input.status === "disabled")) {
      throw new ContentStateError("Admins cannot demote or disable their own active session.");
    }
    return this.db.transaction(async (tx) => {
      const current = await tx.query.adminUsers.findFirst({ where: eq(adminUsers.id, input.targetUserId) });
      if (!current) throw new ContentStateError("User does not exist.");
      const nextRole = input.role ?? current.role;
      const nextStatus = input.status ?? current.status;
      const sensitiveChange = nextRole !== current.role || nextStatus === "disabled";
      const [updated] = await tx.update(adminUsers).set({
        role: nextRole,
        status: nextStatus,
        disabledAt: nextStatus === "disabled" ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(adminUsers.id, current.id)).returning();
      if (sensitiveChange) await tx.update(adminSessions).set({ revokedAt: new Date() }).where(and(eq(adminSessions.userId, current.id), isNull(adminSessions.revokedAt)));
      const event = nextRole !== current.role ? "role_change" : nextStatus === "disabled" ? "user_disable" : "user_reactivate";
      await tx.insert(adminAuditLogs).values({ event, actorId: input.actorId, targetType: "admin_user", targetId: current.id, summary: `Admin user access updated: role=${nextRole}, status=${nextStatus}.`, metadata: { previousRole: current.role, nextRole, previousStatus: current.status, nextStatus, sessionsRevoked: sensitiveChange } });
      return updated;
    });
  }

  async listMedia() {
    return this.db.query.mediaAssets.findMany({
      where: isNull(mediaAssets.deletedAt),
      orderBy: desc(mediaAssets.createdAt),
      limit: 100,
    });
  }

  /** Persist an uploaded asset. Idempotent on (provider, providerAssetId). */
  async recordMediaAsset(input: {
    provider: string;
    providerAssetId: string;
    secureUrl: string;
    deliveryUrl: string;
    altText?: string;
    width?: number;
    height?: number;
    bytes?: number;
    format?: string;
    folder?: string;
    uploadedBy: string;
  }) {
    const [asset] = await this.db
      .insert(mediaAssets)
      .values({
        provider: input.provider,
        providerAssetId: input.providerAssetId,
        secureUrl: input.secureUrl,
        deliveryUrl: input.deliveryUrl,
        altText: input.altText ?? "",
        width: input.width,
        height: input.height,
        bytes: input.bytes,
        format: input.format,
        folder: input.folder,
        uploadedBy: input.uploadedBy,
      })
      .onConflictDoUpdate({
        target: [mediaAssets.provider, mediaAssets.providerAssetId],
        set: { secureUrl: input.secureUrl, deliveryUrl: input.deliveryUrl, width: input.width, height: input.height, bytes: input.bytes, format: input.format, updatedAt: new Date() },
      })
      .returning();
    await this.db.insert(adminAuditLogs).values({
      event: "media_upload",
      actorId: input.uploadedBy,
      targetType: "media_asset",
      targetId: asset.id,
      summary: "Media asset uploaded.",
      metadata: { provider: input.provider, format: input.format, width: input.width, height: input.height },
    });
    return asset;
  }

  async canDeleteMedia(id: string) {
    const usage = await this.db.select({ value: count() }).from(mediaUsages).where(eq(mediaUsages.mediaAssetId, id));
    return (usage[0]?.value ?? 0) === 0;
  }

  async listDueScheduledGroups(now = new Date()) {
    return this.db.query.insightArticleGroups.findMany({
      where: and(eq(insightArticleGroups.draftWorkflowStatus, "scheduled"), lt(insightArticleGroups.scheduledAt, now)),
      limit: 25,
    });
  }

  async listComments(articleGroupId: string): Promise<ContentComment[]> {
    const author = this.db.select({ id: adminUsers.id, displayName: adminUsers.displayName }).from(adminUsers).as("comment_author");
    const rows = await this.db
      .select({
        id: contentComments.id,
        articleGroupId: contentComments.articleGroupId,
        authorId: contentComments.authorId,
        authorName: author.displayName,
        kind: contentComments.kind,
        body: contentComments.body,
        locale: contentComments.locale,
        resolvedAt: contentComments.resolvedAt,
        resolvedBy: contentComments.resolvedBy,
        createdAt: contentComments.createdAt,
      })
      .from(contentComments)
      .leftJoin(author, eq(contentComments.authorId, author.id))
      .where(eq(contentComments.articleGroupId, articleGroupId))
      .orderBy(desc(contentComments.createdAt))
      .limit(200);

    const resolverIds = [...new Set(rows.map((row) => row.resolvedBy).filter((id): id is string => Boolean(id)))];
    const resolvers = resolverIds.length
      ? await this.db.select({ id: adminUsers.id, displayName: adminUsers.displayName }).from(adminUsers).where(inArray(adminUsers.id, resolverIds))
      : [];
    const resolverName = new Map(resolvers.map((user) => [user.id, user.displayName]));

    return rows.map((row) => ({
      id: row.id,
      articleGroupId: row.articleGroupId,
      authorId: row.authorId,
      authorName: row.authorName,
      kind: row.kind,
      body: row.body,
      locale: row.locale,
      resolvedAt: row.resolvedAt,
      resolvedByName: row.resolvedBy ? (resolverName.get(row.resolvedBy) ?? null) : null,
      createdAt: row.createdAt,
    }));
  }

  async createComment(input: {
    articleGroupId: string;
    authorId: string;
    kind: "comment" | "change-request" | "submission-note" | "approval-note";
    body: string;
    locale?: Locale;
  }) {
    return this.db.transaction(async (tx) => {
      const group = await tx.query.insightArticleGroups.findFirst({ where: eq(insightArticleGroups.id, input.articleGroupId), columns: { id: true } });
      if (!group) throw new ContentStateError("Article does not exist.");
      const [comment] = await tx
        .insert(contentComments)
        .values({ articleGroupId: input.articleGroupId, authorId: input.authorId, kind: input.kind, body: input.body, locale: input.locale })
        .returning();
      await tx.insert(adminAuditLogs).values({
        event: "comment_create",
        actorId: input.authorId,
        targetType: "insight_article_group",
        targetId: input.articleGroupId,
        summary: `Comment added (${input.kind}).`,
        metadata: { kind: input.kind, commentId: comment.id },
      });
      return comment;
    });
  }

  async resolveComment(input: { commentId: string; actorId: string; role: AdminRole }) {
    return this.db.transaction(async (tx) => {
      const comment = await tx.query.contentComments.findFirst({ where: eq(contentComments.id, input.commentId) });
      if (!comment) throw new ContentStateError("Comment does not exist.");
      if (comment.resolvedAt) return comment;
      if (input.role !== "admin" && comment.authorId !== input.actorId) {
        throw new ContentStateError("Only the comment author or an Admin can resolve a comment.");
      }
      const [updated] = await tx
        .update(contentComments)
        .set({ resolvedAt: new Date(), resolvedBy: input.actorId, updatedAt: new Date() })
        .where(and(eq(contentComments.id, input.commentId), isNull(contentComments.resolvedAt)))
        .returning();
      await tx.insert(adminAuditLogs).values({
        event: "comment_resolve",
        actorId: input.actorId,
        targetType: "insight_article_group",
        targetId: comment.articleGroupId,
        summary: "Comment resolved.",
        metadata: { commentId: comment.id },
      });
      return updated ?? comment;
    });
  }

  async updateAssignment(input: {
    articleGroupId: string;
    actorId: string;
    ownerId?: string | null;
    assigneeId?: string | null;
    reviewerId?: string | null;
    dueDate?: string | null;
    priority?: "low" | "normal" | "high" | "urgent";
  }) {
    return this.db.transaction(async (tx) => {
      const group = await tx.query.insightArticleGroups.findFirst({ where: eq(insightArticleGroups.id, input.articleGroupId) });
      if (!group) throw new ContentStateError("Article does not exist.");
      const [updated] = await tx
        .update(insightArticleGroups)
        .set({
          ownerId: input.ownerId !== undefined ? input.ownerId : group.ownerId,
          assigneeId: input.assigneeId !== undefined ? input.assigneeId : group.assigneeId,
          reviewerId: input.reviewerId !== undefined ? input.reviewerId : group.reviewerId,
          dueDate: input.dueDate !== undefined ? (input.dueDate ? new Date(input.dueDate) : null) : group.dueDate,
          priority: input.priority ?? group.priority,
          updatedAt: new Date(),
        })
        .where(eq(insightArticleGroups.id, input.articleGroupId))
        .returning();
      await tx.insert(adminAuditLogs).values({
        event: "assignment_update",
        actorId: input.actorId,
        targetType: "insight_article_group",
        targetId: input.articleGroupId,
        summary: "Article assignment updated.",
        metadata: {
          ownerId: updated.ownerId,
          assigneeId: updated.assigneeId,
          reviewerId: updated.reviewerId,
          dueDate: updated.dueDate?.toISOString() ?? null,
          priority: updated.priority,
        },
      });
      return updated;
    });
  }

  async listWorkflowEvents(articleGroupId: string, limit = 30): Promise<WorkflowEventEntry[]> {
    const rows = await this.db
      .select({
        id: workflowEvents.id,
        fromStatus: workflowEvents.fromStatus,
        toStatus: workflowEvents.toStatus,
        actorName: adminUsers.displayName,
        note: workflowEvents.note,
        createdAt: workflowEvents.createdAt,
      })
      .from(workflowEvents)
      .leftJoin(adminUsers, eq(workflowEvents.actorId, adminUsers.id))
      .where(eq(workflowEvents.articleGroupId, articleGroupId))
      .orderBy(desc(workflowEvents.createdAt))
      .limit(limit);
    return rows;
  }

  async listOpenChangeRequestGroupIds(): Promise<Set<string>> {
    const rows = await this.db
      .selectDistinct({ articleGroupId: contentComments.articleGroupId })
      .from(contentComments)
      .where(and(eq(contentComments.kind, "change-request"), isNull(contentComments.resolvedAt)));
    return new Set(rows.map((row) => row.articleGroupId));
  }

  async listRecentWorkflowNotes(limit = 20) {
    return this.db
      .select({
        id: workflowEvents.id,
        articleGroupId: workflowEvents.articleGroupId,
        title: insightArticleGroups.sharedSlug,
        fromStatus: workflowEvents.fromStatus,
        toStatus: workflowEvents.toStatus,
        note: workflowEvents.note,
        actorName: adminUsers.displayName,
        createdAt: workflowEvents.createdAt,
      })
      .from(workflowEvents)
      .innerJoin(insightArticleGroups, eq(workflowEvents.articleGroupId, insightArticleGroups.id))
      .leftJoin(adminUsers, eq(workflowEvents.actorId, adminUsers.id))
      .where(isNotNull(workflowEvents.note))
      .orderBy(desc(workflowEvents.createdAt))
      .limit(limit);
  }

  async listAssignableUsers() {
    // Only CMS users can own or be assigned CMS articles — never external collaborators.
    const rows = await this.db.query.adminUsers.findMany({
      columns: { id: true, displayName: true, role: true },
      where: and(eq(adminUsers.status, "active"), ne(adminUsers.role, "external")),
      orderBy: desc(adminUsers.createdAt),
    });
    return rows.filter((row): row is typeof row & { role: AdminRole } => row.role !== "external");
  }
}

function scrubAuditMetadata(metadata: Record<string, unknown>) {
  const blocked = new Set(["password", "token", "session", "cookie", "secret", "articleBody", "editorDocument"]);
  return Object.fromEntries(Object.entries(metadata).filter(([key]) => !blocked.has(key)));
}

function socialMetadataFor(article: InsightArticle) {
  return {
    ogTitle: article.metadata.ogTitle,
    ogDescription: article.metadata.ogDescription,
    ogImage: article.metadata.ogImage,
    twitterTitle: article.metadata.twitterTitle,
    twitterDescription: article.metadata.twitterDescription,
    twitterImage: article.metadata.twitterImage,
  };
}

function summarizeQa(results: PublishQaResult[]) {
  if (!results.length) return "Publish QA has not run.";
  const errors = results.filter((item) => item.severity === "error").length;
  const warnings = results.filter((item) => item.severity === "warning").length;
  const passed = results.filter((item) => item.severity === "pass").length;
  return `${errors} blocking errors, ${warnings} warnings, ${passed} passed checks.`;
}

function auditEventFor(from: InsightStatus, to: InsightStatus): typeof adminAuditLogs.$inferInsert.event {
  if (from === "draft" && to === "in-review") return "submit_for_review";
  if ((from === "in-review" || from === "approved") && to === "draft") return "request_changes";
  if (from === "in-review" && to === "approved") return "approve";
  if (from === "approved" && to === "scheduled") return "schedule";
  if (from === "scheduled" && to === "approved") return "cancel_schedule";
  if ((from === "approved" || from === "scheduled") && to === "published") return "publish";
  if (from === "published" && to === "archived") return "archive";
  if (from === "published" && to === "draft") return "reopen";
  if (from === "archived" && to === "draft") return "restore_revision";
  throw new ContentStateError(`No audit event is defined for ${from} -> ${to}.`);
}
