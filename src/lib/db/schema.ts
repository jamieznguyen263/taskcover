import {
  type AnyPgColumn,
  boolean,
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

// "external" (FLOW-003) marks freelancer/partner collaborators: they share the single
// identity + login system but are hard-blocked from every CMS surface (see
// requireAdminSession and the /api/admin route gates) and use external_memberships
// instead of organization_memberships for Taskcover Flow access.
export const adminRoleEnum = pgEnum("admin_role", ["admin", "editor", "external"]);
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
  "reopen",
  "scheduler_success",
  "scheduler_failure",
  "integration_test",
  "comment_create",
  "comment_resolve",
  "assignment_update",
]);
export const contentPriorityEnum = pgEnum("content_priority", ["low", "normal", "high", "urgent"]);
export const contentCommentKindEnum = pgEnum("content_comment_kind", [
  "comment",
  "change-request",
  "submission-note",
  "approval-note",
]);
export const leadSubmissionStatusEnum = pgEnum("lead_submission_status", [
  "accepted",
  "processing",
  "completed",
  "needs_attention",
  "cancelled",
]);
export const leadDeliveryJobStatusEnum = pgEnum("lead_delivery_job_status", [
  "pending",
  "processing",
  "succeeded",
  "retrying",
  "dead-letter",
  "cancelled",
]);
export const leadDeliveryProviderEnum = pgEnum("lead_delivery_provider", ["resend", "hubspot"]);
export const workAccessLevelEnum = pgEnum("work_access_level", ["owner", "admin", "manager", "member"]);
export const workMembershipStatusEnum = pgEnum("work_membership_status", ["active", "disabled"]);
export const externalOrganizationKindEnum = pgEnum("external_organization_kind", ["freelancer", "partner"]);
export const externalMembershipKindEnum = pgEnum("external_membership_kind", [
  "freelancer",
  "partner_manager",
  "partner_member",
  "read_only_guest",
]);
export const clientHealthStateEnum = pgEnum("client_health_state", ["good", "watch", "at_risk", "unknown"]);
export const projectKindEnum = pgEnum("project_kind", ["client", "internal"]);
export const workStatusEnum = pgEnum("work_status", ["to_do", "in_progress", "waiting", "review", "done"]);
export const workTypeEnum = pgEnum("work_type", ["task", "deliverable", "request", "approval", "milestone"]);
export const workWaitingTargetEnum = pgEnum("work_waiting_target", [
  "client",
  "manager",
  "teammate",
  "freelancer",
  "partner",
  "external_party",
]);
export const workMemberRelationEnum = pgEnum("work_member_relation", ["contributor", "watcher"]);
export const commentVisibilityEnum = pgEnum("comment_visibility", ["internal", "shared"]);
export const leadDeliveryJobTypeEnum = pgEnum("lead_delivery_job_type", [
  "resend-internal-notification",
  "resend-visitor-confirmation",
  "hubspot-contact-sync",
  "hubspot-company-sync",
  "hubspot-deal-sync",
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
    creationKey: text("creation_key"),
    draftWorkflowStatus: insightWorkflowStatusEnum("draft_workflow_status").notNull().default("draft"),
    publishedRevisionGroupId: uuid("published_revision_group_id"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => adminUsers.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => adminUsers.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    ownerId: uuid("owner_id").references(() => adminUsers.id, { onDelete: "set null" }),
    assigneeId: uuid("assignee_id").references(() => adminUsers.id, { onDelete: "set null" }),
    reviewerId: uuid("reviewer_id").references(() => adminUsers.id, { onDelete: "set null" }),
    dueDate: timestamp("due_date", { withTimezone: true }),
    priority: contentPriorityEnum("priority").notNull().default("normal"),
    lockVersion: integer("lock_version").notNull().default(1),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("insight_article_groups_translation_group_idx").on(table.translationGroupId),
    uniqueIndex("insight_article_groups_creation_key_idx").on(table.creationKey),
    index("insight_article_groups_workflow_idx").on(table.draftWorkflowStatus),
    index("insight_article_groups_scheduled_idx").on(table.scheduledAt),
    index("insight_article_groups_assignee_idx").on(table.assigneeId),
    index("insight_article_groups_due_idx").on(table.dueDate),
  ]
);

export const contentComments = pgTable(
  "content_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleGroupId: uuid("article_group_id").notNull().references(() => insightArticleGroups.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => adminUsers.id, { onDelete: "set null" }),
    kind: contentCommentKindEnum("kind").notNull().default("comment"),
    body: text("body").notNull(),
    locale: localeEnum("locale"),
    // Reserved for future inline comments: a stable anchor into the document.
    blockAnchor: text("block_anchor"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: uuid("resolved_by").references(() => adminUsers.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [
    index("content_comments_group_idx").on(table.articleGroupId),
    index("content_comments_unresolved_idx").on(table.articleGroupId, table.resolvedAt),
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
    draftSnapshot: jsonb("draft_snapshot").notNull(),
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

export const leadSubmissions = pgTable(
  "lead_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    idempotencyKey: text("idempotency_key").notNull(),
    requestType: text("request_type").notNull(),
    locale: localeEnum("locale").notNull(),
    name: text("name").notNull(),
    normalizedEmail: text("normalized_email").notNull(),
    company: text("company"),
    role: text("role"),
    websiteUrl: text("website_url"),
    market: text("market"),
    industry: text("industry"),
    serviceInterests: text("service_interests").array().notNull().default(sql`ARRAY[]::text[]`),
    primaryChallenge: text("primary_challenge"),
    goals: text("goals"),
    timeline: text("timeline"),
    investmentRange: text("investment_range"),
    currentTrafficRange: text("current_traffic_range"),
    paidSearchActivity: text("paid_search_activity"),
    preferredTimeZone: text("preferred_time_zone"),
    preferredCallWindows: text("preferred_call_windows").array().notNull().default(sql`ARRAY[]::text[]`),
    message: text("message"),
    consentVersion: text("consent_version").notNull().default("2026-07-05"),
    sourcePath: text("source_path").notNull(),
    landingPath: text("landing_path"),
    referrerDomain: text("referrer_domain"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    clickIdentifiers: jsonb("click_identifiers").notNull().default({}),
    status: leadSubmissionStatusEnum("status").notNull().default("accepted"),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull().defaultNow(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("lead_submissions_idempotency_idx").on(table.idempotencyKey),
    index("lead_submissions_email_idx").on(table.normalizedEmail),
    index("lead_submissions_status_idx").on(table.status),
    index("lead_submissions_created_at_idx").on(table.createdAt),
  ]
);

export const leadDeliveryJobs = pgTable(
  "lead_delivery_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").notNull().references(() => leadSubmissions.id, { onDelete: "cascade" }),
    provider: leadDeliveryProviderEnum("provider").notNull(),
    jobType: leadDeliveryJobTypeEnum("job_type").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    status: leadDeliveryJobStatusEnum("status").notNull().default("pending"),
    attemptCount: integer("attempt_count").notNull().default(0),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lockedBy: text("locked_by"),
    lastErrorCategory: text("last_error_category"),
    lastErrorAt: timestamp("last_error_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("lead_delivery_jobs_idempotency_idx").on(table.idempotencyKey),
    index("lead_delivery_jobs_due_idx").on(table.status, table.nextAttemptAt),
    index("lead_delivery_jobs_lead_idx").on(table.leadId),
  ]
);

export const leadDeliveryAttempts = pgTable(
  "lead_delivery_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id").notNull().references(() => leadDeliveryJobs.id, { onDelete: "cascade" }),
    provider: leadDeliveryProviderEnum("provider").notNull(),
    jobType: leadDeliveryJobTypeEnum("job_type").notNull(),
    result: text("result").notNull(),
    errorCategory: text("error_category"),
    statusCodeCategory: text("status_code_category"),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("lead_delivery_attempts_job_idx").on(table.jobId)]
);

export const leadProviderLinks = pgTable(
  "lead_provider_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").notNull().references(() => leadSubmissions.id, { onDelete: "cascade" }),
    provider: leadDeliveryProviderEnum("provider").notNull(),
    linkType: text("link_type").notNull(),
    providerId: text("provider_id").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("lead_provider_links_unique_idx").on(table.leadId, table.provider, table.linkType),
    index("lead_provider_links_provider_id_idx").on(table.provider, table.providerId),
  ]
);

/*
 * Taskcover Flow — FLOW-002 (memberships, roles, teams).
 * Flow extends the existing admin_users identity rather than creating a second one:
 * every membership row references admin_users. Capability decisions are made in code
 * (src/lib/work/capabilities.ts); role_presets exists for display and future custom
 * presets, seeded with the four system presets in migration 0005.
 */

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    accessLevel: workAccessLevelEnum("access_level").notNull().default("member"),
    status: workMembershipStatusEnum("status").notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("organization_memberships_user_idx").on(table.userId),
    index("organization_memberships_status_idx").on(table.status),
  ]
);

export const rolePresets = pgTable(
  "role_presets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    capabilitySet: jsonb("capability_set").notNull().default([]),
    isSystemPreset: boolean("is_system_preset").notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("role_presets_key_idx").on(table.key)]
);

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("teams_name_idx").on(table.name)]
);

export const teamMemberships = pgTable(
  "team_memberships",
  {
    teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.teamId, table.userId] }),
    index("team_memberships_user_idx").on(table.userId),
  ]
);

export const externalOrganizations = pgTable(
  "external_organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    kind: externalOrganizationKindEnum("kind").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("external_organizations_name_idx").on(table.name)]
);

/*
 * FLOW-003 — external collaborator access. One membership per external user; access is
 * bounded by [access_start_at, access_expiry_at] and by revoked_at, evaluated on every
 * /flow request (src/lib/work/external-access.ts). Externals never receive an
 * organization_memberships row.
 */
export const externalMemberships = pgTable(
  "external_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    externalOrganizationId: uuid("external_organization_id").references(() => externalOrganizations.id, {
      onDelete: "set null",
    }),
    kind: externalMembershipKindEnum("kind").notNull(),
    accessStartAt: timestamp("access_start_at", { withTimezone: true }).notNull().defaultNow(),
    accessExpiryAt: timestamp("access_expiry_at", { withTimezone: true }),
    canDownload: boolean("can_download").notNull().default(false),
    canUpload: boolean("can_upload").notNull().default(false),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedBy: uuid("revoked_by").references(() => adminUsers.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("external_memberships_user_idx").on(table.userId),
    index("external_memberships_org_idx").on(table.externalOrganizationId),
  ]
);

/*
 * FLOW-004 — Clients. Health is explainable by design: a human-set state plus a written
 * reason (src/lib/work/client-health.ts), never an opaque score.
 */
export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    healthState: clientHealthStateEnum("health_state").notNull().default("unknown"),
    healthReason: text("health_reason").notNull().default(""),
    accountManagerId: uuid("account_manager_id").references(() => adminUsers.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("clients_name_idx").on(table.name)]
);

export const clientContacts = pgTable(
  "client_contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull().default(""),
    phone: text("phone").notNull().default(""),
    roleTitle: text("role_title").notNull().default(""),
    ...timestamps,
  },
  (table) => [index("client_contacts_client_idx").on(table.clientId)]
);

// Which internal users are attached to a client (beyond the single Account Manager).
// Table ships with FLOW-004 per the accepted schema; management UI arrives when client
// scoping starts mattering for visibility (FLOW-006/007).
export const clientMemberships = pgTable(
  "client_memberships",
  {
    clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.clientId, table.userId] }),
    index("client_memberships_user_idx").on(table.userId),
  ]
);

/*
 * FLOW-005 — Projects. A project is a specific goal or delivery cycle; kind 'client'
 * projects reference a client, 'internal' ones do not (enforced in code, not by
 * constraint, so archived clients can be detached without losing history).
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
    kind: projectKindEnum("kind").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    templateId: uuid("template_id").references(() => projectTemplates.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("projects_client_idx").on(table.clientId)]
);

export const projectMemberships = pgTable(
  "project_memberships",
  {
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.userId] }),
    index("project_memberships_user_idx").on(table.userId),
  ]
);

// Template shape: default_work_items = [{ title, type, offsetDays }] with deadlines
// relative to project creation. Instantiation into real work items lands with FLOW-006;
// until then templates are schema + repository only (no UI), per planning/FLOW_DECISIONS.md.
export const projectTemplates = pgTable(
  "project_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    defaultWorkItems: jsonb("default_work_items").notNull().default([]),
    relativeDeadlines: jsonb("relative_deadlines").notNull().default([]),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [uniqueIndex("project_templates_name_idx").on(table.name)]
);

/*
 * FLOW-006 — Unified Work. One work_items table with a display `type`; the five statuses
 * are company-wide. Every item has exactly one accountable Owner (notNull). Waiting carries
 * a target ("waiting for whom?"); the app clears it when leaving Waiting.
 */
export const workItems = pgTable(
  "work_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references((): AnyPgColumn => workItems.id, { onDelete: "cascade" }),
    type: workTypeEnum("type").notNull().default("task"),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    status: workStatusEnum("status").notNull().default("to_do"),
    ownerId: uuid("owner_id").notNull().references(() => adminUsers.id, { onDelete: "restrict" }),
    reviewerId: uuid("reviewer_id").references(() => adminUsers.id, { onDelete: "set null" }),
    waitingTarget: workWaitingTargetEnum("waiting_target"),
    waitingNote: text("waiting_note").notNull().default(""),
    dueAt: timestamp("due_at", { withTimezone: true }),
    position: integer("position").notNull().default(0),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("work_items_project_idx").on(table.projectId),
    index("work_items_owner_idx").on(table.ownerId),
    index("work_items_status_idx").on(table.status),
    index("work_items_parent_idx").on(table.parentId),
  ]
);

export const workItemMembers = pgTable(
  "work_item_members",
  {
    workItemId: uuid("work_item_id").notNull().references(() => workItems.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    relation: workMemberRelationEnum("relation").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.workItemId, table.userId, table.relation] }),
    index("work_item_members_user_idx").on(table.userId),
  ]
);

// Simple finish-to-start dependencies: work_item waits on depends_on_work_item.
export const workDependencies = pgTable(
  "work_dependencies",
  {
    workItemId: uuid("work_item_id").notNull().references(() => workItems.id, { onDelete: "cascade" }),
    dependsOnWorkItemId: uuid("depends_on_work_item_id").notNull().references(() => workItems.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.workItemId, table.dependsOnWorkItemId] })]
);

export const workChecklistItems = pgTable(
  "work_checklist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workItemId: uuid("work_item_id").notNull().references(() => workItems.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    isDone: boolean("is_done").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("work_checklist_items_work_idx").on(table.workItemId)]
);

/*
 * FLOW-007 — Discussions, files, activity. Comments carry a visibility: `internal` comments
 * are invisible to external collaborators; `shared` comments cross the boundary. Enforcement
 * is in the repository (src/lib/work/discussion-repository.ts), never the UI.
 */
export const discussionThreads = pgTable(
  "discussion_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workItemId: uuid("work_item_id").notNull().references(() => workItems.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("discussion_threads_work_idx").on(table.workItemId)]
);

export const workComments = pgTable(
  "work_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id").notNull().references(() => discussionThreads.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => adminUsers.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    visibility: commentVisibilityEnum("visibility").notNull().default("internal"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("work_comments_thread_idx").on(table.threadId)]
);

export const workFiles = pgTable(
  "work_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: text("filename").notNull(),
    url: text("url").notNull(),
    contentType: text("content_type").notNull().default(""),
    sizeBytes: integer("size_bytes"),
    visibility: commentVisibilityEnum("visibility").notNull().default("internal"),
    uploadedBy: uuid("uploaded_by").references(() => adminUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("work_files_uploader_idx").on(table.uploadedBy)]
);

export const workFileLinks = pgTable(
  "work_file_links",
  {
    fileId: uuid("file_id").notNull().references(() => workFiles.id, { onDelete: "cascade" }),
    workItemId: uuid("work_item_id").notNull().references(() => workItems.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.fileId, table.workItemId] })]
);

// Flow-native activity timeline. Kept separate from the CMS admin_audit_logs enum so the
// two systems evolve independently (planning/FLOW_DECISIONS.md, FLOW-002). event is a plain
// string, not an enum, so new event kinds never need an ALTER TYPE.
export const activityEvents = pgTable(
  "activity_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => adminUsers.id, { onDelete: "set null" }),
    targetType: text("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    summary: text("summary").notNull(),
    visibility: commentVisibilityEnum("visibility").notNull().default("internal"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("activity_events_target_idx").on(table.targetType, table.targetId),
    index("activity_events_project_idx").on(table.projectId),
  ]
);

// External-invite metadata rides alongside the existing admin_invites row (role='external')
// so the CMS accept-invite flow needs zero changes; the membership is provisioned lazily
// from this metadata on the collaborator's first /flow visit.
export const flowExternalInvites = pgTable(
  "flow_external_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    inviteId: uuid("invite_id").notNull().references(() => adminInvites.id, { onDelete: "cascade" }),
    externalOrganizationId: uuid("external_organization_id").references(() => externalOrganizations.id, {
      onDelete: "set null",
    }),
    kind: externalMembershipKindEnum("kind").notNull(),
    accessStartAt: timestamp("access_start_at", { withTimezone: true }).notNull().defaultNow(),
    accessExpiryAt: timestamp("access_expiry_at", { withTimezone: true }),
    canDownload: boolean("can_download").notNull().default(false),
    canUpload: boolean("can_upload").notNull().default(false),
    createdBy: uuid("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("flow_external_invites_invite_idx").on(table.inviteId)]
);

export const leadStatusEvents = pgTable(
  "lead_status_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").notNull().references(() => leadSubmissions.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("lead_status_events_lead_idx").on(table.leadId)]
);
