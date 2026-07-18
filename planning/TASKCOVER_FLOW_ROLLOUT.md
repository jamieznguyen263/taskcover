# Taskcover Flow — Rollout Runbook (FLOW-012)

The one document to follow when taking Taskcover Flow from "merged" to "live for staff".
Everything here is deliberately reversible and staged. Migrations are **never** run by the
implementer against a shared database — they ship in PRs and are applied through this runbook.

## 0. Preconditions

- All slices FLOW-001 … FLOW-011 merged to `main`.
- `WORK_APP_ENABLED` currently defaults to enabled but `/flow` is fully gated behind the
  existing admin session — no unauthenticated or public exposure exists at any point.
- Dev/CI `DATABASE_URL` points at production Neon; treat every migration as production-bound.

## 1. Migration apply order (0005 → 0010)

Apply in sequence via the existing guarded runner (`npm run db:migrate`, which tracks applied
files in `_taskcover_migrations` and wraps each file in a transaction). All six are additive
(verified by `migration-integrity.test.ts` — no DROP/ALTER COLUMN/DELETE, no changes to any
pre-Flow table):

| # | File | Adds |
|---|------|------|
| 0005 | `0005_flow_memberships.sql` | memberships, role_presets (seeded), teams, team_memberships, external_organizations + **backfill** of every admin_user |
| 0006 | `0006_flow_external_access.sql` | `admin_role` value `external`, external_memberships, flow_external_invites |
| 0007 | `0007_flow_clients_projects.sql` | clients, client_contacts, client_memberships, projects, project_memberships, project_templates + preset UPDATE |
| 0008 | `0008_flow_work_discussions.sql` | work_items (+members/deps/checklist), discussion_threads, work_comments, work_files, work_file_links, activity_events + preset UPDATE |
| 0009 | `0009_flow_notifications.sql` | notifications |
| 0010 | `0010_flow_documents.sql` | documents, document_versions, document_work_links + preset UPDATE |

**Verification after apply:** `npm run db:status` should report 0 pending. Spot-check that
every existing admin/editor now has an `organization_memberships` row (the backfill) and that
`role_presets` holds four rows whose `capability_set` matches
`src/lib/work/capabilities.ts` (the same invariant `migration-consistency.test.ts` enforces
in CI).

## 2. Staging rollout

1. Apply 0005–0010 to staging.
2. Smoke the critical paths with a real Admin and a real Editor account:
   - `/flow` Home renders role-aware buckets; `/admin` and the public site are unchanged.
   - Create a client → set health (Watch requires a reason) → add a contact.
   - Create a client project → add a member → create work → change status to Waiting (a
     target is required) → add a checklist item and an internal vs shared comment.
   - Create a meeting-note document with `- [ ]` lines → extract actions → create work →
     confirm it links back. Search finds all of the above.
   - Assign work to a second user → they see the Inbox badge + item → snooze/done.
3. **External isolation check (the security-critical one):** invite an external collaborator
   from `/flow/admin`, accept via the standard invite link, then confirm as that user:
   - Only the external shell is visible — no Clients/Projects/Docs/Administration/CMS nav.
   - `/admin` bounces to `/flow`; every `/api/admin/*` route returns 401.
   - Internal comments/documents/activity never appear.
   - Revoke access → the collaborator is blocked on next request; expiry does the same
     automatically.

## 3. Production rollout

1. Apply 0005–0010 to production during a low-traffic window; `db:status` → 0 pending.
2. Keep `WORK_APP_ENABLED` **enabled** (its safe default). If anything looks wrong, set
   `WORK_APP_ENABLED=false` to dark-launch `/flow` (renders 404) **without touching** `/admin`
   or the public site — the kill switch is instant and side-effect-free.
3. Owner elevates the intended people from `admin` to `owner` (a deliberate one-row update —
   the backfill never auto-creates owners).

## 4. Staff onboarding (what to tell the team)

- Taskcover Flow lives at **taskcover.com/flow**; sign in with your existing Taskcover Admin
  credentials — there is no separate account.
- Access levels: **Owner/Admin** run administration and teams; **Managers** manage clients,
  projects, and members; **Members** do everyday work. Everyone sees clients, projects,
  work, and docs (client context is the point of the product).
- Client health is a state **plus a written reason** — Watch/At-risk always need the "why".
- Work has exactly one accountable **Owner**; use Waiting when you're blocked and say **who**
  you're waiting on.
- Comments are **Internal** (teammates only) or **Shared** (visible to external
  collaborators) — the label is always shown; when in doubt it defaults to the safer choice.
- Freelancers/partners are invited from Administration with an access window and download/
  upload permissions; they only ever see what's explicitly shared.

## 5. Rollback

No migration is destructive, so rollback is a code-level revert plus the feature flag; the
new tables are additive and can be left in place (they don't affect `/admin` or the public
site). If a specific slice misbehaves, `WORK_APP_ENABLED=false` disables all of `/flow`
immediately while a fix is prepared.
