# Admin Database Schema

The Admin content operating system uses PostgreSQL through Drizzle.

Core tables:

- `admin_users`
- `admin_sessions`
- `admin_invites`
- `insight_article_groups`
- `insight_article_localizations`
- `insight_article_revisions`
- `media_assets`
- `media_usages`
- `workflow_events`
- `admin_audit_logs`

Complex article fields are stored as JSONB only after Zod validation. Published public content is an immutable `InsightArticle` snapshot in `insight_article_localizations.published_snapshot`; public database reads must use this snapshot only.

Migrations are generated/checked in under `drizzle/`. They are not applied automatically during build and must not be run against an unknown production database.
