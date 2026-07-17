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
