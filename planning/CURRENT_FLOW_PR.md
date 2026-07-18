# Current Flow PR

**Active pair: FLOW-006 (Unified Work) + FLOW-007 (Discussions, Files, Activity)** — one PR,
one additive migration (`0008_flow_work_discussions.sql`), base `main`.

History: FLOW-001 (#14), FLOW-002 (#15), FLOW-003 (#17 re-land), FLOW-004+005 (#18) all
merged. Workflow unchanged: no stacked PRs, slice pairs, one migration per PR, full battery
once per PR.

## FLOW-006 scope — Unified Work

- Tables: `work_items` (one unified object with display `type`; five company-wide statuses;
  exactly one accountable `owner_id` NOT NULL; optional reviewer; `waiting_target` +
  `waiting_note`; self-referential `parent_id` for parent/child), `work_item_members`
  (contributor/watcher), `work_dependencies` (simple finish-to-start), `work_checklist_items`.
- Status is a **free flow** (any→any) by design — no rigid state machine blocks
  non-technical staff. The only invariant (`resolveStatusChange`, unit-tested): entering
  Waiting requires a target ("waiting for whom?"); leaving Waiting clears it.
- `/flow/projects/[projectId]`: Work section with **List and Board views** (view toggle),
  create work, and a **detail drawer** reached by a shareable URL
  (`?work=<id>`, reusing the FLOW-001 DetailDrawer primitive). The drawer edits status,
  details (title/type/owner/reviewer/due/description), and checklist inline.
- Capabilities `work:view` / `work:manage` (both member+ — work is company-wide for internal
  staff).

## FLOW-007 scope — Discussions, Files, Activity

- Tables: `discussion_threads`, `work_comments` (visibility internal|shared),
  `work_files` + `work_file_links` (visibility internal|shared), `activity_events` (Flow-
  native timeline; `event` is a plain string, not an enum, so new kinds never need an
  `ALTER TYPE`).
- **Internal vs shared comments are visibly distinct** (amber "Internal" vs teal "Shared")
  and **enforced in the repository, not the UI**: `DiscussionRepository` filters internal
  rows out of every read when `includeInternal` is false. Callers derive that from
  `internal-notes:view`, which external collaborators never hold. `resolveCommentVisibility`
  (unit-tested) guarantees an author who can't see internal notes can never post one.
- Work create/status changes write `activity_events`; the drawer shows the discussion and a
  per-item activity timeline.
- New capability `internal-notes:view` (member+, never external) marks the internal/external
  boundary.

## Non-scope for this pair

- **Calendar view** — List + Board ship now; Calendar is deferred (a due-date calendar is
  low-value until Inbox/Home deadline surfaces exist in FLOW-008/009).
- **Real file uploads** — `work_files`/`work_file_links` tables and `DiscussionRepository`
  read/write methods ship (visibility-enforced), but the upload UI is deferred: safe uploads
  need the same signed-storage path the CMS media flow uses, which belongs in its own slice
  rather than bolted on here. No half-built upload UI ships.
- Project template instantiation into work items (FLOW template data exists; wiring is a
  follow-up), deep dependency cycle detection (v1 guards self + direct A↔B only), Inbox
  notifications from work events (FLOW-009), external project-scoped work visibility (the
  visibility plumbing is in place; the project-sharing surface is FLOW-009+).

## Acceptance checks

1. Migration 0008 creates only new tables/enums/indexes/FKs and updates only `role_presets`
   rows — zero changes to previously existing tables.
2. Every work/discussion read and write re-checks capabilities server-side; internal
   comments/files/activity are filtered for anyone without `internal-notes:view`.
3. Waiting cannot be set without a target; leaving Waiting clears it.
4. Work always has exactly one owner (NOT NULL + required in the form).
5. The detail drawer is reachable and shareable by URL and closes back to the project.
6. `/admin`, the public site, and the external shell are unchanged.
7. Full battery passes: lint, typecheck, full vitest, `next build`, Cloudflare build, dry-run.
