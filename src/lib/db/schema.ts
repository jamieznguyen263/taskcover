import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const adminRoleEnum = pgEnum("admin_role", ["admin", "editor"]);
export const adminUserStatusEnum = pgEnum("admin_user_status", ["invited", "active", "disabled"]);
export const insightWorkflowStatusEnum = pgEnum("insight_workflow_status", [
  "draft",
  "in-review",
  "approved",
  "scheduled",
  "published",
  "archived",
]);
export const localeEnum = pgEnum("locale", ["en", "fr", "es"]);
export const auditEventEnum = pgEnum("admin_audit_event", [
  "login_success",
  "login_failure",
  "logout",
  "password_change",
  "session_revoke",
  "user_invite",
  "invite_accept",
  "role_change",
  "user_disable",
  "user_reactivate",
  "article_create",
  "article_save",
  "submit_for_review",
  "request_changes",
  "approve",
  "schedule",
  "reschedule",
  "cancel_schedule",
  "publish",
  "archive",
  "restore_revision",
  "media_upload",
  "media_metadata_update",
  "media_delete",
  "scheduler_success",
  "scheduler_failure",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    normalizedEmail: text("normalized_email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: adminRoleEnum("role").notNull().default("editor"),
    status: adminUserStatusEnum("status").notNull().default("invited"),
    displayName: text("display_name").notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("admin_users_normalized_email_idx").on(table.normalizedEmail),
    index("admin_users_status_idx").on(table.status),
  ]
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    userAgentSummary: text("user_agent_summary"),
    ipHash: text("ip_hash"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("admin_sessions_token_hash_idx").on(table.tokenHash),
    index("admin_sessions_user_idx").on(table.userId),
  ]
);

export const adminInvites = pgTable(
  "admin_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    normalizedEmail: text("normalized_email").notNull(),
    role: adminRoleEnum("role").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    invitedBy: uuid("invited_by").references(() => adminUsers.id, { onDelete: "set null" }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("admin_invites_token_hash_idx").on(table.tokenHash),
    index("admin_invites_email_idx").on(table.normalizedEmail),
  ]
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull(),
    providerAssetId: text("provider_asset_id").notNull(),
    secureUrl: text("secure_url").notNull(),
    deliveryUrl: text("delivery_url").notNull(),
    altText: text("alt_text").notNull().default(""),
    caption: text("caption"),
    credit: text("credit"),
    folder: text("folder"),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes"),
    format: text("format"),
    uploadedBy: uuid("uploaded_by").references(() => adminUsers.id, { onDelete: "set null" }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("media_assets_provider_asset_idx").on(table.provider, table.providerAssetId),
    index("media_assets_search_idx").on(table.altText),
  ]
);

export const insightArticleGroups = pgTable(
  "insight_article_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    translationGroupId: text("translation_group_id").notNull(),
    sharedSlug: text("shared_slug").notNull(),
    categorySlug: text("category_slug").notNull(),
    authorKey: text("author_key").notNull(),
    draftWorkflowStatus: insightWorkflowStatusEnum("draft_workflow_status").notNull().default("draft"),
    publishedRevisionGroupId: uuid("published_revision_group_id"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => adminUsers.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => adminUsers.id, { onDelete: "set null" }),
    lockVersion: integer("lock_version").notNull().default(1),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("insight_article_groups_translation_group_idx").on(table.translationGroupId),
    index("insight_article_groups_workflow_idx").on(table.draftWorkflowStatus),
    index("insight_article_groups_scheduled_idx").on(table.scheduledAt),
  ]
);

export const insightArticleLocalizations = pgTable(
  "insight_article_localizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleGroupId: uuid("article_group_id").notNull().references(() => insightArticleGroups.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    slug: text("slug").notNull(),
    internalTitle: text("internal_title").notNull(),
    publicH1: text("public_h1").notNull(),
    excerpt: text("excerpt").notNull(),
    editorDocument: jsonb("editor_document").notNull(),
    normalizedBlocks: jsonb("normalized_blocks").notNull(),
    publishedSnapshot: jsonb("published_snapshot"),
    searchStrategy: jsonb("search_strategy").notNull(),
    evidenceData: jsonb("evidence_data").notNull(),
    internalLinkData: jsonb("internal_link_data").notNull(),
    metadata: jsonb("metadata").notNull(),
    socialMetadata: jsonb("social_metadata").notNull(),
    schemaConfiguration: jsonb("schema_configuration").notNull(),
    localizationData: jsonb("localization_data").notNull(),
    publishQaSnapshot: jsonb("publish_qa_snapshot"),
    coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    draftVersion: integer("draft_version").notNull().default(1),
    publishedRevisionId: uuid("published_revision_id"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("insight_article_localizations_group_locale_idx").on(table.articleGroupId, table.locale),
    index("insight_article_localizations_slug_locale_idx").on(table.slug, table.locale),
  ]
);

export const insightArticleRevisions = pgTable(
  "insight_article_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    revisionGroupId: uuid("revision_group_id").notNull().defaultRandom(),
    localizationId: uuid("localization_id").notNull().references(() => insightArticleLocalizations.id, { onDelete: "cascade" }),
    revisionNumber: integer("revision_number").notNull(),
    editorDocument: jsonb("editor_document").notNull(),
    normalizedBlocks: jsonb("normalized_blocks").notNull(),
    articleSnapshot: jsonb("article_snapshot").notNull(),
    metadataSnapshot: jsonb("metadata_snapshot").notNull(),
    seoSnapshot: jsonb("seo_snapshot").notNull(),
    evidenceSnapshot: jsonb("evidence_snapshot").notNull(),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    revisionReason: text("revision_reason").notNull(),
    workflowTransition: text("workflow_transition").notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("insight_article_revisions_localization_number_idx").on(table.localizationId, table.revisionNumber),
    index("insight_article_revisions_group_idx").on(table.revisionGroupId),
  ]
);

export const mediaUsages = pgTable(
  "media_usages",
  {
    mediaAssetId: uuid("media_asset_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
    articleGroupId: uuid("article_group_id").notNull().references(() => insightArticleGroups.id, { onDelete: "cascade" }),
    localizationId: uuid("localization_id").references(() => insightArticleLocalizations.id, { onDelete: "cascade" }),
    usageType: text("usage_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.mediaAssetId, table.articleGroupId, table.usageType] }),
  ]
);

export const workflowEvents = pgTable(
  "workflow_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleGroupId: uuid("article_group_id").notNull().references(() => insightArticleGroups.id, { onDelete: "cascade" }),
    fromStatus: insightWorkflowStatusEnum("from_status"),
    toStatus: insightWorkflowStatusEnum("to_status").notNull(),
    actorId: uuid("actor_id").references(() => adminUsers.id, { onDelete: "set null" }),
    note: text("note"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("workflow_events_group_idx").on(table.articleGroupId)]
);

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    event: auditEventEnum("event").notNull(),
    actorId: uuid("actor_id").references(() => adminUsers.id, { onDelete: "set null" }),
    targetType: text("target_type"),
    targetId: text("target_id"),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    ipHash: text("ip_hash"),
    userAgentSummary: text("user_agent_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("admin_audit_logs_event_idx").on(table.event),
    index("admin_audit_logs_target_idx").on(table.targetType, table.targetId),
    index("admin_audit_logs_created_at_idx").on(table.createdAt),
  ]
);
