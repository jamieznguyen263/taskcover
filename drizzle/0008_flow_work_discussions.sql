CREATE TYPE "public"."comment_visibility" AS ENUM('internal', 'shared');--> statement-breakpoint
CREATE TYPE "public"."work_member_relation" AS ENUM('contributor', 'watcher');--> statement-breakpoint
CREATE TYPE "public"."work_status" AS ENUM('to_do', 'in_progress', 'waiting', 'review', 'done');--> statement-breakpoint
CREATE TYPE "public"."work_type" AS ENUM('task', 'deliverable', 'request', 'approval', 'milestone');--> statement-breakpoint
CREATE TYPE "public"."work_waiting_target" AS ENUM('client', 'manager', 'teammate', 'freelancer', 'partner', 'external_party');--> statement-breakpoint
CREATE TABLE "activity_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"project_id" uuid,
	"event" text NOT NULL,
	"summary" text NOT NULL,
	"visibility" "comment_visibility" DEFAULT 'internal' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_checklist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_item_id" uuid NOT NULL,
	"label" text NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"author_id" uuid,
	"body" text NOT NULL,
	"visibility" "comment_visibility" DEFAULT 'internal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_dependencies" (
	"work_item_id" uuid NOT NULL,
	"depends_on_work_item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_dependencies_work_item_id_depends_on_work_item_id_pk" PRIMARY KEY("work_item_id","depends_on_work_item_id")
);
--> statement-breakpoint
CREATE TABLE "work_file_links" (
	"file_id" uuid NOT NULL,
	"work_item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_file_links_file_id_work_item_id_pk" PRIMARY KEY("file_id","work_item_id")
);
--> statement-breakpoint
CREATE TABLE "work_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"url" text NOT NULL,
	"content_type" text DEFAULT '' NOT NULL,
	"size_bytes" integer,
	"visibility" "comment_visibility" DEFAULT 'internal' NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_item_members" (
	"work_item_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"relation" "work_member_relation" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_item_members_work_item_id_user_id_relation_pk" PRIMARY KEY("work_item_id","user_id","relation")
);
--> statement-breakpoint
CREATE TABLE "work_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"type" "work_type" DEFAULT 'task' NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" "work_status" DEFAULT 'to_do' NOT NULL,
	"owner_id" uuid NOT NULL,
	"reviewer_id" uuid,
	"waiting_target" "work_waiting_target",
	"waiting_note" text DEFAULT '' NOT NULL,
	"due_at" timestamp with time zone,
	"position" integer DEFAULT 0 NOT NULL,
	"created_by" uuid,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_actor_id_admin_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_checklist_items" ADD CONSTRAINT "work_checklist_items_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_comments" ADD CONSTRAINT "work_comments_thread_id_discussion_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."discussion_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_comments" ADD CONSTRAINT "work_comments_author_id_admin_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_dependencies" ADD CONSTRAINT "work_dependencies_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_dependencies" ADD CONSTRAINT "work_dependencies_depends_on_work_item_id_work_items_id_fk" FOREIGN KEY ("depends_on_work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_file_links" ADD CONSTRAINT "work_file_links_file_id_work_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."work_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_file_links" ADD CONSTRAINT "work_file_links_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_files" ADD CONSTRAINT "work_files_uploaded_by_admin_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_item_members" ADD CONSTRAINT "work_item_members_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_item_members" ADD CONSTRAINT "work_item_members_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_parent_id_work_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_owner_id_admin_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."admin_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_reviewer_id_admin_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_events_target_idx" ON "activity_events" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "activity_events_project_idx" ON "activity_events" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "discussion_threads_work_idx" ON "discussion_threads" USING btree ("work_item_id");--> statement-breakpoint
CREATE INDEX "work_checklist_items_work_idx" ON "work_checklist_items" USING btree ("work_item_id");--> statement-breakpoint
CREATE INDEX "work_comments_thread_idx" ON "work_comments" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "work_files_uploader_idx" ON "work_files" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "work_item_members_user_idx" ON "work_item_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "work_items_project_idx" ON "work_items" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "work_items_owner_idx" ON "work_items" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "work_items_status_idx" ON "work_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "work_items_parent_idx" ON "work_items" USING btree ("parent_id");--> statement-breakpoint
-- FLOW-006/007 capability additions (work:view, work:manage, internal-notes:view for all
-- internal levels). capability_set mirrors src/lib/work/capabilities.ts (authoritative);
-- migration-consistency.test.ts replays these UPDATEs to detect drift.
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view"]'::jsonb, "updated_at" = now() WHERE "key" = 'member';--> statement-breakpoint
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","members:view","clients:manage","projects:manage"]'::jsonb, "updated_at" = now() WHERE "key" = 'manager';--> statement-breakpoint
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","members:view","clients:manage","projects:manage","teams:manage","administration:view"]'::jsonb, "updated_at" = now() WHERE "key" = 'admin';--> statement-breakpoint
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","members:view","clients:manage","projects:manage","teams:manage","administration:view"]'::jsonb, "updated_at" = now() WHERE "key" = 'owner';
