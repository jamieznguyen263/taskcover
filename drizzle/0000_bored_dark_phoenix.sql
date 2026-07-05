CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."admin_user_status" AS ENUM('invited', 'active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."admin_audit_event" AS ENUM('login_success', 'login_failure', 'logout', 'password_change', 'session_revoke', 'user_invite', 'invite_accept', 'role_change', 'user_disable', 'user_reactivate', 'article_create', 'article_save', 'submit_for_review', 'request_changes', 'approve', 'schedule', 'reschedule', 'cancel_schedule', 'publish', 'archive', 'restore_revision', 'media_upload', 'media_metadata_update', 'media_delete', 'scheduler_success', 'scheduler_failure');--> statement-breakpoint
CREATE TYPE "public"."insight_workflow_status" AS ENUM('draft', 'in-review', 'approved', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'fr', 'es');--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event" "admin_audit_event" NOT NULL,
	"actor_id" uuid,
	"target_type" text,
	"target_id" text,
	"summary" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_hash" text,
	"user_agent_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"normalized_email" text NOT NULL,
	"role" "admin_role" NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"invited_by" uuid,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone,
	"user_agent_summary" text,
	"ip_hash" text,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"normalized_email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"status" "admin_user_status" DEFAULT 'invited' NOT NULL,
	"display_name" text NOT NULL,
	"last_login_at" timestamp with time zone,
	"password_changed_at" timestamp with time zone,
	"disabled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insight_article_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"translation_group_id" text NOT NULL,
	"shared_slug" text NOT NULL,
	"category_slug" text NOT NULL,
	"author_key" text NOT NULL,
	"draft_workflow_status" "insight_workflow_status" DEFAULT 'draft' NOT NULL,
	"published_revision_group_id" uuid,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"approved_by" uuid,
	"lock_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insight_article_localizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_group_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"slug" text NOT NULL,
	"internal_title" text NOT NULL,
	"public_h1" text NOT NULL,
	"excerpt" text NOT NULL,
	"editor_document" jsonb NOT NULL,
	"normalized_blocks" jsonb NOT NULL,
	"published_snapshot" jsonb,
	"search_strategy" jsonb NOT NULL,
	"evidence_data" jsonb NOT NULL,
	"internal_link_data" jsonb NOT NULL,
	"metadata" jsonb NOT NULL,
	"social_metadata" jsonb NOT NULL,
	"schema_configuration" jsonb NOT NULL,
	"localization_data" jsonb NOT NULL,
	"publish_qa_snapshot" jsonb,
	"cover_media_id" uuid,
	"draft_version" integer DEFAULT 1 NOT NULL,
	"published_revision_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insight_article_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"revision_group_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"localization_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"editor_document" jsonb NOT NULL,
	"normalized_blocks" jsonb NOT NULL,
	"article_snapshot" jsonb NOT NULL,
	"metadata_snapshot" jsonb NOT NULL,
	"seo_snapshot" jsonb NOT NULL,
	"evidence_snapshot" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revision_reason" text NOT NULL,
	"workflow_transition" text NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"provider_asset_id" text NOT NULL,
	"secure_url" text NOT NULL,
	"delivery_url" text NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"caption" text,
	"credit" text,
	"folder" text,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"width" integer,
	"height" integer,
	"bytes" integer,
	"format" text,
	"uploaded_by" uuid,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_usages" (
	"media_asset_id" uuid NOT NULL,
	"article_group_id" uuid NOT NULL,
	"localization_id" uuid,
	"usage_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_usages_media_asset_id_article_group_id_usage_type_pk" PRIMARY KEY("media_asset_id","article_group_id","usage_type")
);
--> statement-breakpoint
CREATE TABLE "workflow_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_group_id" uuid NOT NULL,
	"from_status" "insight_workflow_status",
	"to_status" "insight_workflow_status" NOT NULL,
	"actor_id" uuid,
	"note" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actor_id_admin_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_invited_by_admin_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD CONSTRAINT "insight_article_groups_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD CONSTRAINT "insight_article_groups_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD CONSTRAINT "insight_article_groups_approved_by_admin_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_localizations" ADD CONSTRAINT "insight_article_localizations_article_group_id_insight_article_groups_id_fk" FOREIGN KEY ("article_group_id") REFERENCES "public"."insight_article_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_localizations" ADD CONSTRAINT "insight_article_localizations_cover_media_id_media_assets_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_revisions" ADD CONSTRAINT "insight_article_revisions_localization_id_insight_article_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."insight_article_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_revisions" ADD CONSTRAINT "insight_article_revisions_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_admin_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_article_group_id_insight_article_groups_id_fk" FOREIGN KEY ("article_group_id") REFERENCES "public"."insight_article_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_localization_id_insight_article_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."insight_article_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_events" ADD CONSTRAINT "workflow_events_article_group_id_insight_article_groups_id_fk" FOREIGN KEY ("article_group_id") REFERENCES "public"."insight_article_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_events" ADD CONSTRAINT "workflow_events_actor_id_admin_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_audit_logs_event_idx" ON "admin_audit_logs" USING btree ("event");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_target_idx" ON "admin_audit_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_invites_token_hash_idx" ON "admin_invites" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "admin_invites_email_idx" ON "admin_invites" USING btree ("normalized_email");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_sessions_token_hash_idx" ON "admin_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "admin_sessions_user_idx" ON "admin_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_normalized_email_idx" ON "admin_users" USING btree ("normalized_email");--> statement-breakpoint
CREATE INDEX "admin_users_status_idx" ON "admin_users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "insight_article_groups_translation_group_idx" ON "insight_article_groups" USING btree ("translation_group_id");--> statement-breakpoint
CREATE INDEX "insight_article_groups_workflow_idx" ON "insight_article_groups" USING btree ("draft_workflow_status");--> statement-breakpoint
CREATE INDEX "insight_article_groups_scheduled_idx" ON "insight_article_groups" USING btree ("scheduled_at");--> statement-breakpoint
CREATE UNIQUE INDEX "insight_article_localizations_group_locale_idx" ON "insight_article_localizations" USING btree ("article_group_id","locale");--> statement-breakpoint
CREATE INDEX "insight_article_localizations_slug_locale_idx" ON "insight_article_localizations" USING btree ("slug","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "insight_article_revisions_localization_number_idx" ON "insight_article_revisions" USING btree ("localization_id","revision_number");--> statement-breakpoint
CREATE INDEX "insight_article_revisions_group_idx" ON "insight_article_revisions" USING btree ("revision_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_provider_asset_idx" ON "media_assets" USING btree ("provider","provider_asset_id");--> statement-breakpoint
CREATE INDEX "media_assets_search_idx" ON "media_assets" USING btree ("alt_text");--> statement-breakpoint
CREATE INDEX "workflow_events_group_idx" ON "workflow_events" USING btree ("article_group_id");
