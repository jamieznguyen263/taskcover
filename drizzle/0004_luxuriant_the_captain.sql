CREATE TYPE "public"."content_comment_kind" AS ENUM('comment', 'change-request', 'submission-note', 'approval-note');--> statement-breakpoint
CREATE TYPE "public"."content_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
ALTER TYPE "public"."admin_audit_event" ADD VALUE 'comment_create';--> statement-breakpoint
ALTER TYPE "public"."admin_audit_event" ADD VALUE 'comment_resolve';--> statement-breakpoint
ALTER TYPE "public"."admin_audit_event" ADD VALUE 'assignment_update';--> statement-breakpoint
CREATE TABLE "content_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_group_id" uuid NOT NULL,
	"author_id" uuid,
	"kind" "content_comment_kind" DEFAULT 'comment' NOT NULL,
	"body" text NOT NULL,
	"locale" "locale",
	"block_anchor" text,
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD COLUMN "owner_id" uuid;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD COLUMN "assignee_id" uuid;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD COLUMN "reviewer_id" uuid;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD COLUMN "priority" "content_priority" DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_article_group_id_insight_article_groups_id_fk" FOREIGN KEY ("article_group_id") REFERENCES "public"."insight_article_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_author_id_admin_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_resolved_by_admin_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_comments_group_idx" ON "content_comments" USING btree ("article_group_id");--> statement-breakpoint
CREATE INDEX "content_comments_unresolved_idx" ON "content_comments" USING btree ("article_group_id","resolved_at");--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD CONSTRAINT "insight_article_groups_owner_id_admin_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD CONSTRAINT "insight_article_groups_assignee_id_admin_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD CONSTRAINT "insight_article_groups_reviewer_id_admin_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "insight_article_groups_assignee_idx" ON "insight_article_groups" USING btree ("assignee_id");--> statement-breakpoint
CREATE INDEX "insight_article_groups_due_idx" ON "insight_article_groups" USING btree ("due_date");