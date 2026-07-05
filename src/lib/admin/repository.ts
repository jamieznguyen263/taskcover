import "server-only";

import { and, count, desc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import type { InsightArticle, InsightStatus } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  adminAuditLogs,
  adminInvites,
  adminSessions,
  adminUsers,
  insightArticleGroups,
  insightArticleLocalizations,
  insightArticleRevisions,
  mediaAssets,
  mediaUsages,
  workflowEvents,
} from "@/lib/db/schema";
import { hashToken, normalizeEmail } from "./security";
import { publishedArticleSnapshotSchema, validateJsonPayload, validatePublishPayload } from "./validation";

export type AdminUserSession = {
  userId: string;
  email: string;
  role: "admin" | "editor";
  displayName: string;
  sessionId: string;
};

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

  async saveLocalizationDraft(input: {
    groupId: string;
    locale: Locale;
    lockVersion: number;
    actorId: string;
    payload: {
      slug: string;
      internalTitle: string;
      publicH1: string;
      excerpt: string;
      editorDocument: unknown;
      normalizedBlocks: unknown;
      searchStrategy: unknown;
      evidenceData: unknown;
      internalLinkData: unknown;
      metadata: unknown;
      schemaConfiguration: unknown;
      localizationData: unknown;
    };
  }) {
    const validated = validatePublishPayload(input.payload);
    const socialMetadata = {
      ogTitle: validated.metadata.ogTitle,
      ogDescription: validated.metadata.ogDescription,
      ogImage: validated.metadata.ogImage,
      twitterTitle: validated.metadata.twitterTitle,
      twitterDescription: validated.metadata.twitterDescription,
      twitterImage: validated.metadata.twitterImage,
    };

    return this.db.transaction(async (tx) => {
      const [updatedGroup] = await tx
        .update(insightArticleGroups)
        .set({
          lockVersion: sql`${insightArticleGroups.lockVersion} + 1`,
          updatedAt: new Date(),
          updatedBy: input.actorId,
        })
        .where(and(eq(insightArticleGroups.id, input.groupId), eq(insightArticleGroups.lockVersion, input.lockVersion)))
        .returning();

      if (!updatedGroup) throw new Error("Conflict detected. Reload the latest article before saving.");

      const existing = await tx.query.insightArticleLocalizations.findFirst({
        where: and(eq(insightArticleLocalizations.articleGroupId, input.groupId), eq(insightArticleLocalizations.locale, input.locale)),
      });

      if (existing) {
        const [row] = await tx
          .update(insightArticleLocalizations)
          .set({
            slug: input.payload.slug,
            internalTitle: input.payload.internalTitle,
            publicH1: input.payload.publicH1,
            excerpt: input.payload.excerpt,
            ...validated,
            socialMetadata,
            draftVersion: sql`${insightArticleLocalizations.draftVersion} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(insightArticleLocalizations.id, existing.id))
          .returning();
        return { group: updatedGroup, localization: row };
      }

      const [row] = await tx
        .insert(insightArticleLocalizations)
        .values({
          articleGroupId: input.groupId,
          locale: input.locale,
          slug: input.payload.slug,
          internalTitle: input.payload.internalTitle,
          publicH1: input.payload.publicH1,
          excerpt: input.payload.excerpt,
          ...validated,
          socialMetadata,
        })
        .returning();
      return { group: updatedGroup, localization: row };
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
          eq(insightArticleGroups.draftWorkflowStatus, "published"),
          isNull(insightArticleGroups.archivedAt)
        )
      );
    return rows
      .map((row) => row.snapshot)
      .filter(Boolean)
      .map((snapshot) => validateJsonPayload(publishedArticleSnapshotSchema, snapshot, "Published snapshot"));
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
    return this.db.query.adminUsers.findMany({
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
      orderBy: desc(adminUsers.createdAt),
    });
  }

  async listMedia() {
    return this.db.query.mediaAssets.findMany({
      where: isNull(mediaAssets.deletedAt),
      orderBy: desc(mediaAssets.createdAt),
      limit: 100,
    });
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
}

function scrubAuditMetadata(metadata: Record<string, unknown>) {
  const blocked = new Set(["password", "token", "session", "cookie", "secret", "articleBody", "editorDocument"]);
  return Object.fromEntries(Object.entries(metadata).filter(([key]) => !blocked.has(key)));
}
