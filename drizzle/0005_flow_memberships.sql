CREATE TYPE "public"."external_organization_kind" AS ENUM('freelancer', 'partner');--> statement-breakpoint
CREATE TYPE "public"."work_access_level" AS ENUM('owner', 'admin', 'manager', 'member');--> statement-breakpoint
CREATE TYPE "public"."work_membership_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TABLE "external_organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"kind" "external_organization_kind" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"access_level" "work_access_level" DEFAULT 'member' NOT NULL,
	"status" "work_membership_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_presets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"capability_set" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_system_preset" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_memberships" (
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_memberships_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_by" uuid,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "external_organizations_name_idx" ON "external_organizations" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_memberships_user_idx" ON "organization_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "organization_memberships_status_idx" ON "organization_memberships" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "role_presets_key_idx" ON "role_presets" USING btree ("key");--> statement-breakpoint
CREATE INDEX "team_memberships_user_idx" ON "team_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_name_idx" ON "teams" USING btree ("name");--> statement-breakpoint
-- FLOW-002 data: seed the four system role presets. capability_set mirrors
-- src/lib/work/capabilities.ts, which is the authoritative source for authorization
-- decisions; these rows exist for display and future custom presets.
INSERT INTO "role_presets" ("key", "name", "description", "capability_set", "is_system_preset") VALUES
	('owner', 'Owner', 'Full control of Taskcover Flow, including administration.', '["flow:access","teams:view","members:view","teams:manage","administration:view"]'::jsonb, true),
	('admin', 'Admin', 'Administration, teams, and member management.', '["flow:access","teams:view","members:view","teams:manage","administration:view"]'::jsonb, true),
	('manager', 'Manager', 'Member visibility on top of everyday member access.', '["flow:access","teams:view","members:view"]'::jsonb, true),
	('member', 'Member', 'Everyday access to Taskcover Flow.', '["flow:access","teams:view"]'::jsonb, true)
ON CONFLICT ("key") DO NOTHING;--> statement-breakpoint
-- FLOW-002 backfill: every existing CMS user gets a Flow membership derived from their
-- legacy role (admin -> admin, editor -> member; nobody is auto-promoted to owner) and
-- their current account status. Users created after this migration are provisioned
-- lazily on first /flow access with the same mapping (src/lib/work/repository.ts).
INSERT INTO "organization_memberships" ("user_id", "access_level", "status")
SELECT
	"id",
	CASE WHEN "role" = 'admin' THEN 'admin'::"work_access_level" ELSE 'member'::"work_access_level" END,
	CASE WHEN "status" = 'disabled' THEN 'disabled'::"work_membership_status" ELSE 'active'::"work_membership_status" END
FROM "admin_users"
ON CONFLICT ("user_id") DO NOTHING;
