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

## FLOW-003 external-access decisions — 2026-07-17

- **Externals share the single identity/login system** via a third `admin_role` value,
  `'external'` — no second user table, no second login. The enum extension
  (`ALTER TYPE ... ADD VALUE`) is safe inside the migration transaction on PG12+ because
  no statement in the same transaction uses the new value.
- **CMS isolation is enforced at every entry point,** not by navigation: `requireAdminSession`
  bounces externals to `/flow` (and its return type narrows to `AdminCmsSession`, so the
  compiler forces future CMS code through the gate); all `/api/admin/*` routes reject
  external sessions via `isCmsRole`; CMS user lists, invite lists, and article-assignee
  lists exclude externals.
- **Invitation reuses the CMS invite machinery unchanged:** an external invitation is a
  standard `admin_invites` row (role `external`) plus a `flow_external_invites` metadata
  row (kind, organization, expiry, download/upload). The collaborator sets a password
  through the existing accept-invite page; their `external_memberships` row is provisioned
  lazily from the metadata on first `/flow` visit (idempotent). No `AdminRepository` code
  changed for invite creation.
- **Access-window semantics:** revoked > not-started > expired > active, evaluated on every
  request (`evaluateExternalAccess`); expiry timestamps are inclusive ("at expiry" =
  expired); a null expiry means manual-revoke-only. Waiting-style reminders/escalation for
  expiring access are later-wave concerns.
- **Managing externals requires `administration:view`** — no new capability was added in
  FLOW-003, because adding one would desynchronize the role-preset seeds shipped in 0005
  (still unmerged). Revisit when a dedicated `externals:manage` capability is warranted.
- **Project-scoped sharing is deferred to FLOW-005** (projects do not exist yet). FLOW-003
  delivers identity, invitation, expiry/revoke, the external shell, and hard isolation from
  every internal surface; `can_download`/`can_upload` are stored now and enforced when
  files arrive (FLOW-007).

## Delivery-workflow revision — 2026-07-17 (after the FLOW-003 stacked-PR incident)

PR #16 (FLOW-003) was stacked on the FLOW-002 branch; both were merged within seconds and
the FLOW-003 merge landed on the already-squashed base branch instead of `main`, requiring
re-land PR #17. Locked going forward: **no stacked PRs — every FLOW PR bases on `main`**;
slices ship in pairs (004+005, 006+007, 008+009, 010+011, 012) with one additive migration
per PR and per-slice commits; the full validation battery runs once per PR.

## FLOW-004/005 decisions — 2026-07-17

- **Client health is explainable by construction:** a human-set state plus a written
  reason. Watch/At-risk require a reason; Not-assessed clears it. No scores, no automation
  (deterministic signals may inform it in FLOW-011, still preview-first).
- **Capability changes ship with a role_presets UPDATE in the same migration**, and
  `migration-consistency.test.ts` now replays INSERT + UPDATE statements across all
  migrations so the final DB state must match code. New: `clients:view`/`projects:view`
  (member+ — client context is company-wide for internal staff), `clients:manage`/
  `projects:manage` (manager+).
- **Internal projects have no client** (`kind = 'internal'`, `client_id` null); client
  projects keep history if their client is later detached (`ON DELETE set null`, enforced
  in code rather than a CHECK constraint).
- **Project creation is transactional** — the creator's membership is written with the
  project so no project is ever ownerless.
- **project_templates ship as schema + repository only.** Template UI and instantiation
  (default work items with relative deadlines) land with FLOW-006, when work items exist.
- **client_memberships ship as table only** — management UI waits until client scoping
  drives visibility (FLOW-006/007).

## FLOW-006/007 decisions — 2026-07-17

- **Work status is a free flow, not a state machine.** The five statuses allow any→any
  transitions so non-technical staff are never blocked; the sole invariant is data
  integrity around Waiting (a target is required to enter it, cleared on leaving) —
  `resolveStatusChange` in src/lib/work/work-domain.ts, unit-tested.
- **Exactly one accountable owner:** `work_items.owner_id` is NOT NULL with `ON DELETE
  restrict` — you cannot delete a user who still owns work; reassign first. Contributors,
  reviewer, and watchers are all optional.
- **Comment/file/activity visibility is enforced in the repository, never the UI.**
  `DiscussionRepository` drops internal rows from every read when `includeInternal` is
  false; callers pass `hasCapability(level, "internal-notes:view")`, which externals never
  hold. `resolveCommentVisibility` makes it impossible for a non-internal author to post an
  internal comment even if the form is tampered with.
- **activity_events uses a plain-string `event`, not a pg enum** — deliberately, so future
  event kinds never require an `ALTER TYPE ... ADD VALUE` migration. This is the Flow-native
  timeline; the CMS `admin_audit_logs` enum is left untouched (FLOW-002 decision holds).
- **Calendar view deferred:** List + Board ship in FLOW-006; a calendar is low-value until
  FLOW-008/009 add deadline surfaces (Home/Inbox). Not dropped — resequenced.
- **Real file uploads deferred:** the `work_files`/`work_file_links` schema and repository
  ship (visibility-enforced), but safe upload UI needs the CMS's signed-storage path and
  belongs in its own slice. No half-built upload UI ships now.
- **Simple dependencies only (v1):** `addDependency` guards self-dependency and direct A↔B
  cycles; deep cycle detection is a FLOW-008 concern, matching the blueprint's "simple
  dependencies".

## FLOW-008/009 decisions — 2026-07-17

- **Home is pure aggregation, no new tables.** HomeRepository buckets existing work_items
  for the session user (My focus / Overdue / Needs attention / My work + a manager Review
  queue and workload signal). This keeps FLOW-008 migration-free; the pair's only migration
  is FLOW-009's notifications table.
- **No new capability for Inbox/Home.** Any internal member already has work:view; reading
  your own Home/Inbox needs no extra grant, so role_presets is untouched by 0009. Revisit
  only if notification *administration* (e.g. broadcast) is ever added.
- **Notification integrity rules live in `emit()`:** never notify the actor about their own
  action, and de-dupe against an existing non-done item for the same recipient+target+kind.
  Together these stop the Inbox from spamming on repeated saves.
- **One pure helper set owns snooze/unread/active semantics**
  (`src/lib/work/notification-domain.ts`): a snooze that elapses re-surfaces as unread, done
  is always hidden, and the badge/count/list all call the same functions so they can never
  disagree. Unit-tested.
- **Inbox mutations are self-scoped:** `NotificationRepository.setState` filters by
  `recipientId` (from the session), so a user can only change their own notifications even
  if an id is guessed.
- **Waiting reminders deferred, deliberately:** `work_items.waiting_target` is a category
  (client/teammate/…), not a specific user, so there is no single recipient to notify. The
  `waiting_reminder` kind exists; emission waits until waiting targets can name a person.
  Same pattern for `deadline_warning` (needs a scheduler) and `mention` (needs comment
  mentions, FLOW-011).

## FLOW-010/011 decisions — 2026-07-19

- **Document history is append-only and transactional:** every edit snapshots the outgoing
  body into `document_versions` inside the same transaction that bumps the live row, so a
  document always carries its full lineage and version numbers stay sequential.
- **Documents reuse the internal|shared visibility boundary** (FLOW-007). Internal documents
  and internal search hits are filtered in the repository for anyone without
  `internal-notes:view` — never in the UI. New capabilities `docs:view`/`docs:manage`
  (member+), shipped with a role_presets UPDATE in migration 0010.
- **FLOW-011 ships deterministic assistance, not an LLM.** The project constraint forbids
  paid external API calls, so "limited AI assistance" is delivered as transparent,
  unit-tested logic: pattern-based meeting-note action extraction and capability-gated
  substring search. This fully satisfies the blueprint's hard requirements —
  **preview-before-create** and **no autonomous execution** — and a real model can later sit
  behind the identical preview UI without weakening that contract. Recorded so a future slice
  doesn't mistake "no LLM yet" for "AI was dropped".
- **Action extraction proposes; it never creates autonomously.** `extractActions` returns
  candidates; turning them into work is a separate user action that also links the work back
  to the source document. Checked boxes are treated as done and skipped.
- **Search is permission-aware by construction:** each result branch in `SearchRepository`
  is wrapped in its own `hasCapability` check, so results can never leak a record the caller
  can't open.
- **Markdown body, not TipTap, for v1 documents** — versioned and linkable now; a WYSIWYG
  editor is a deferred enhancement (same pattern as the FLOW-007 file-upload UI).
