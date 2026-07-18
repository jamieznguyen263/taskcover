# Current Flow PR

**Active pair: FLOW-004 (Clients) + FLOW-005 (Projects)** — one PR, one migration, base `main`

History: FLOW-001 merged (#14), FLOW-002 merged (#15), FLOW-003 re-landed to main (#17 —
the original #16 was a stacked PR whose merge landed on its base branch instead of main).

## Delivery workflow (revised after FLOW-003)

- **No stacked PRs.** Every FLOW PR bases on `main` and waits for the previous merge.
- **Slices ship in pairs** with one additive migration per PR: 004+005, 006+007, 008+009,
  010+011, then 012 alone. Per-slice commits inside the PR keep review readable.
- Cheap checks (tsc + focused vitest) run during development; the full battery (full
  vitest, lint, `next build`, Cloudflare build, dry-run) runs once per PR before push.
- Migrations are never executed by the implementer; the deploy pipeline applies them after
  merge (dev `DATABASE_URL` points at production Neon).

## FLOW-004 scope — Clients

- Tables (in migration `0007_flow_clients_projects.sql`): `clients` (explainable health:
  state + written reason), `client_contacts`, `client_memberships` (table only; management
  UI deferred until client scoping matters for visibility, FLOW-006/007).
- `/flow/clients`: list with health badges + reasons, Account Manager, live project counts;
  create (manager+).
- `/flow/clients/[clientId]`: health editing (reason required for Watch/At-risk, cleared
  for Not-assessed — `validateClientHealthUpdate`), contacts add/remove, project list,
  placeholders for FLOW-006/007/010 attachments.
- New capabilities `clients:view` (member+) and `clients:manage` (manager+); role-preset
  rows updated by the same migration, replayed by `migration-consistency.test.ts`.

## FLOW-005 scope — Projects

- Tables (same migration): `projects` (kind client|internal; client projects reference a
  client, enforced in code so detached clients keep history), `project_memberships`,
  `project_templates` (schema + repository only — template UI and instantiation into work
  items land with FLOW-006, when work items exist to instantiate).
- `/flow/projects`: list (kind, client, created); transactional creation — project + the
  creator's membership land together (`projects:manage`).
- `/flow/projects/[projectId]`: member add/remove, Work placeholder for FLOW-006.
- Capabilities `projects:view` (member+), `projects:manage` (manager+).
- Quick-create "New project" now links to `/flow/projects`; nav enables Clients and
  Projects; command menu gains Go to Clients / Go to Projects.

## Non-scope for this pair

Work items and views (FLOW-006), discussions/files/activity (FLOW-007), template
instantiation and template UI (FLOW-006), client-membership management UI, relative
deadline execution (stored as template data only), any external-collaborator project
sharing (needs FLOW-006 scoping), archive/delete UI for clients/projects.

## Acceptance checks

1. Migration 0007 creates only new tables/enums and updates only `role_presets` rows —
   zero changes to previously existing tables.
2. All four pages re-check capabilities server-side (deny-by-default); externals get 404s.
3. Client health can never be set to Watch/At-risk without a reason.
4. Project creation is transactional (never an ownerless project).
5. `/admin`, the public site, and the external shell behave identically.
6. Full battery passes: lint, typecheck, full vitest, `next build`, Cloudflare build,
   dry-run.
