# Current Flow PR

**Active slice: FLOW-001 — Work Application Shell**

## Scope

- Canonical planning documents (this set of 5 files).
- Authenticated internal route at **`/flow`** (see route-decision note in
  [TASKCOVER_FLOW_BLUEPRINT.md](./TASKCOVER_FLOW_BLUEPRINT.md) — `/work` is already a public
  marketing route and is not touched).
- Reuse of the existing admin session (`requireAdminSession`) — no second login system.
- Work application shell: sidebar, header, main area with a polished non-fake empty state.
- Command-menu shell with static safe commands (`Go to Home`, `Go to Content CMS`,
  `Sign out`) and full keyboard behavior.
- Quick-create trigger shell with disabled "coming later" options.
- Reusable detail-drawer primitive, demonstrated via a safe local preview on the Home page.
- `WORK_APP_ENABLED` feature flag with a documented, production-safe default.

## Non-scope (do not implement in this slice)

New membership/role/permission schema, teams, clients, projects, work items, inbox
persistence, notifications, documents, file uploads, freelancer/partner invitation, smart
rules, AI functionality, SEO tracking of any kind, a search database, fake dashboards, a
full mobile application.

## Dependencies

Existing admin authentication/session (`src/lib/admin/session.ts`,
`src/lib/admin/security.ts`), existing design tokens (`src/app/globals.css`), existing
`AdminShell` visual pattern (`src/components/admin/admin-shell.tsx`) for brand consistency.

## Acceptance checks

1. `/flow` exists and requires authentication (redirects to `/admin/login` when signed out).
2. Existing authentication/session is reused, not duplicated.
3. `/admin` behavior is unchanged.
4. Existing admin/editor accounts can access `/flow`.
5. Shell is visually polished and responsive.
6. Sidebar and header are reusable components.
7. Admin role sees a working link back to Content CMS (`/admin`).
8. Command menu keyboard behavior works (open, navigate, escape, focus trap).
9. Detail drawer primitive is accessible (keyboard close, focus management, reduced motion,
   no layout overflow).
10. No fake operational data anywhere in the shell.
11. No future business tables/migrations are created.
12. SEO Tracking is absent from new navigation and planning docs.
13. Canonical planning files are complete and internally consistent.
14. Public website behavior (including the public `/work` marketing route) is unchanged.
15–19. Lint, typecheck, tests, production build, and Cloudflare build/dry-run all pass.
20. Full diff self-reviewed before commit.

## Stop conditions specific to this slice

- A migration would be required (would mean scope crept into FLOW-002+).
- `/flow` cannot be protected without touching `/admin` auth internals in a breaking way.
- Any of the excluded SEO functionality would need to be reintroduced to make navigation
  make sense (it should not).
