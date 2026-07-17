# Taskcover Flow — Locked Decisions

Append-only decision log. Once a decision lands here it should not be silently reversed by a
later slice — reopening it requires a new dated entry explaining why.

## SEO tracking is removed from scope

- SEO Tracking is removed from Taskcover Flow entirely.
- No DataForSEO integration.
- No Google Search Console integration.
- No client SEO dashboard, keyword rank tracking, Site Health, or AI Visibility features.
- No SEO API cost center or paid API governance module.
- No Semrush-style replacement.

This applies to every wave in [TASKCOVER_FLOW_ROADMAP.md](./TASKCOVER_FLOW_ROADMAP.md).
Existing, already-implemented SEO tooling for the public marketing site
(`scripts/seo-check.ts`, `scripts/seo-crawl.ts`) is unrelated legacy marketing-site tooling
and is out of scope for this decision — it is left untouched, not removed, because it isn't
part of Taskcover Flow.

## Internal route is `/flow`, not `/work` — 2026-07-17

`taskcover.com/work` is an existing, live, public marketing route (case studies, sample
audits, client results). Taskcover Flow's internal application mounts at
**`taskcover.com/flow`** instead. See the "Route decision" section of
[TASKCOVER_FLOW_BLUEPRINT.md](./TASKCOVER_FLOW_BLUEPRINT.md) for the full rationale. Every
later FLOW-XXX slice must use `/flow` as the internal app's URL prefix; internal code
directory names (`src/components/work/`, `src/lib/work/`) keep the word "work" because they
name the product domain, not the URL.

## No second identity/login system

Taskcover Flow reuses the existing `admin_users` / `admin_sessions` tables and
`src/lib/admin/session.ts` session helpers. FLOW-002 extends this identity with
organization-level membership and role data; it does not replace it. This was true before
FLOW-001 and FLOW-001 does not change it — recorded here because multiple future slices
depend on it holding.

## FLOW-001 feature flag default — 2026-07-17

`WORK_APP_ENABLED` defaults to **enabled** when unset. Rationale: `/flow` is fully gated
behind the existing admin session (`requireAdminSession`), carries no business data in
FLOW-001, and cannot be reached by an unauthenticated or public visitor. There is no
production risk in leaving it on by default. Setting `WORK_APP_ENABLED=false` in any
environment fully disables the route (renders `notFound()`) without affecting `/admin` or
the public site. This decision should be revisited before FLOW-004+ introduces real client
data, at which point a stricter default may be warranted.

## FLOW-002 membership decisions — 2026-07-17

- **Legacy-role mapping:** CMS `admin` → Flow `admin`; CMS `editor` → Flow `member`. Nobody
  is auto-promoted to `owner` — owner elevation is an explicit human action (a one-row
  update an Owner/Admin performs deliberately). Disabled CMS accounts backfill as disabled
  memberships.
- **Backfill is belt-and-braces:** migration 0005 backfills users existing at migration
  time; `WorkRepository.ensureMembership` lazily provisions users created afterwards (e.g.
  via CMS invites) on first `/flow` access with the same mapping. Both paths are idempotent
  (`ON CONFLICT (user_id) DO NOTHING`). The CMS invite flow is deliberately untouched.
- **Capabilities live in code:** `src/lib/work/capabilities.ts` is the single authority for
  authorization; the `role_presets` table mirrors the sets for display and future custom
  presets. `migration-consistency.test.ts` fails if the seeded JSON drifts from code.
- **Deny-by-default everywhere:** pages and server actions call
  `requireWorkSession(capability)` themselves; navigation visibility is never authorization.
  A disabled Flow membership blocks `/flow` while the CMS session and `/admin` keep working.
- **Flow-side audit logging deferred to FLOW-007** (`activity_events`). The existing CMS
  audit enum is not extended in FLOW-002 to avoid `ALTER TYPE ... ADD VALUE`-in-transaction
  hazards for a nonessential write.
- **Migrations ship in the PR, they are not run by the implementer.** `DATABASE_URL` in the
  dev environment points at production Neon; migration 0005 must be applied via the deploy
  pipeline (`npm run db:migrate` with its existing guard) after review.
- **`external_organizations` is created inert** in 0005 to match the accepted schema
  grouping; all code paths for it belong to FLOW-003.
