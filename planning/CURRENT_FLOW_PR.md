# Current Flow PR

**Active slice: FLOW-003 — Freelancer and partner access** (stacked on FLOW-002, PR #15)

(FLOW-001 merged via PR #14. FLOW-002 in review as PR #15 — its scope section below still
applies to that PR.)

## FLOW-003 scope

- Migration `drizzle/0006_flow_external_access.sql` (additive; one `ALTER TYPE admin_role
  ADD VALUE 'external'`, safe because the value is never used inside the same transaction):
  `external_membership_kind` enum, `external_memberships` and `flow_external_invites`
  tables.
- **CMS isolation:** `requireAdminSession` bounces `role='external'` sessions to `/flow`
  and now returns the narrowed `AdminCmsSession`; every `/api/admin/*` route rejects
  external sessions via `isCmsRole`; CMS user/invite/assignee listings exclude externals.
- External invitation workflow: `/flow/admin` creates a standard `admin_invites` row
  (role `external`) plus Flow metadata (`flow_external_invites`) — the existing
  accept-invite page works unchanged; the membership is provisioned lazily from the
  metadata on first `/flow` visit.
- Access windows: `evaluateExternalAccess` (revoked > not-started > expired > active) runs
  on every request; expiry is automatic, revoke is immediate via `/flow/admin`.
- External shell: own navigation (Home, Inbox, My Work, Shared Projects, Shared Files —
  Home live, rest pending FLOW-005/006), own Home, no quick-create/Administration/CMS
  anywhere; blocked states render explanatory screens with sign-out.

## FLOW-003 non-scope

Project-scoped sharing mechanics (needs projects — FLOW-005), shared files/comments
(FLOW-007), external Inbox (FLOW-009). `external_memberships.can_download/can_upload` are
stored now and enforced when files exist.

## FLOW-002 scope (PR #15)

- Migration `drizzle/0005_flow_memberships.sql` (additive only): `work_access_level`,
  `work_membership_status`, `external_organization_kind` enums; `organization_memberships`,
  `role_presets`, `teams`, `team_memberships`, `external_organizations` tables; system
  role-preset seeds; backfill of every existing `admin_users` row into
  `organization_memberships`.
- Capability model in code (`src/lib/work/capabilities.ts`) — deny-by-default, strictly
  cumulative levels (member ⊂ manager ⊂ admin = owner). `role_presets` rows are display
  copies; authorization never reads them.
- Legacy-role mapping (`src/lib/work/membership.ts`): admin → admin, editor → member,
  nobody auto-promoted to owner.
- `WorkSession` (`src/lib/work/session.ts`): existing Admin session enriched with the
  organization membership; lazy self-healing provisioning for users created after the
  migration; `requireWorkSession(capability)` guard for pages and server actions.
- Access gate extended with `membership-disabled` (a disabled Flow membership blocks /flow
  while the CMS session stays valid).
- Administration page `/flow/admin`: members list, teams management (create team,
  add/remove members via server actions, each re-checking `teams:manage`), system role
  presets display. Page re-checks `administration:view` itself — nav visibility is not
  authorization.
- Navigation and command menu become capability-driven; the Content CMS link stays
  legacy-role-gated because /admin authorizes on that role.

## Non-scope (do not implement in this slice)

External memberships/invitations (FLOW-003 — `external_organizations` is created but has no
code paths), clients, projects, work items, inbox, documents, files, access-level change UI,
audit/activity events for Flow actions (arrives with FLOW-007 `activity_events`), smart
rules, AI functionality, SEO tracking of any kind.

## Dependencies

FLOW-001 (merged). Existing admin auth/session, Drizzle schema + hand-run migration script
(`scripts/db-migrate.ts`), existing design tokens and Work shell components.

## Acceptance checks

1. Migration 0005 is purely additive; `/admin` and the public site behave identically before
   and after it runs.
2. Every existing admin/editor keeps `/flow` access after the migration (backfill), and users
   created later are provisioned lazily on first access.
3. Authorization is deny-by-default and enforced server-side in pages **and** server actions.
4. A disabled membership blocks `/flow` without affecting the CMS session.
5. `/flow/admin` is reachable only with `administration:view` (404 otherwise).
6. Teams can be created and staffed; team writes require `teams:manage`.
7. No second identity/login system; no changes to `/admin` behavior.
8. Lint, typecheck, tests, production build, Cloudflare build + dry-run all pass.
9. Migration is **not** executed by the implementer against any shared database — it ships
   in the PR and is applied through the deploy pipeline after review.

## Stop conditions specific to this slice

- The migration would require destructive changes to existing tables (it must stay additive).
- Backfill cannot be expressed idempotently (`ON CONFLICT DO NOTHING` + unique user index).
- Authorization would need to weaken any existing /admin check.
