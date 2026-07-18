# Current Flow PR

**Active pair: FLOW-008 (Home / Manager Control View) + FLOW-009 (Inbox / Notifications)**
— one PR, one additive migration (`0009_flow_notifications.sql`), base `main`.

History: FLOW-001–007 merged (#14, #15, #17, #18, #19). Workflow unchanged: no stacked PRs,
slice pairs, one migration per PR, full battery once per PR.

## FLOW-008 scope — Home & Manager Control View

- No new tables — Home aggregates the existing `work_items` for the session user
  (`HomeRepository`). Buckets: **My focus** (owned, due within 3 days), **Overdue** (owned,
  past due, open), **Needs attention** (owned, in review or waiting), **My work** (all open
  owned), and a manager-only **Review queue** (items where I'm the reviewer and status =
  review). Managers (`members:view`) also see a lightweight **workload signal** (open items
  per owner).
- `/flow` Home is now role-aware: internal users get the buckets above (with a friendly
  empty state when they own nothing); external collaborators keep their own shared-workspace
  Home; the old FLOW-001 drawer demo is removed.

## FLOW-009 scope — Inbox & Notifications

- Table: `notifications` (recipient, actor, kind, state, target, project, title/body/href,
  snoozed_until). Nine kinds; four states (unread/read/snoozed/done).
- Notifications are emitted from work actions: **assignment** to the owner on create/update,
  **review_request** to the reviewer when set. `emit()` never notifies the actor themselves
  and de-dupes an existing open item, so re-saving doesn't spam the Inbox.
- `/flow/inbox`: actionable list **grouped** into "Action required" vs "Updates"
  (`NOTIFICATION_GROUP`), with per-item **mark read / done / snooze** (3h / tomorrow / next
  week) and a **mark-all-read**. A snooze that elapses re-surfaces as unread — the badge, the
  list filter, and the unread count all agree via the pure `notification-domain` helpers.
- Inbox nav is enabled for internal and external shells, with an **unread badge** in the
  sidebar and mobile nav; command menu gains "Go to Inbox".

## Non-scope for this pair

- **Waiting reminders / escalation** — `waiting_target` is a *category* (client, teammate,
  …), not a specific user, so there's no single recipient to notify yet. Deferred until
  waiting targets can name a person; the notification kind exists for it.
- **Deadline-warning and mention notifications** — kinds exist; emission waits for a
  scheduler (deadline) and mentions in comments (FLOW-011 text features).
- **Approval actions inline in the Inbox** — the Inbox deep-links to the work item where the
  status change happens; a one-click approve-from-Inbox is a later polish.
- Real-time updates, email/push delivery, per-project notification preferences.

## Acceptance checks

1. Migration 0009 creates only the `notifications` table + enums/indexes — zero changes to
   existing tables, no `role_presets` change (no new capability needed).
2. Home buckets and Inbox reads are scoped to the session user; Inbox mutations only touch
   the caller's own rows (`setState` filters by recipient).
3. Snooze/unread/active semantics are consistent across badge, count, and list (one pure
   helper set, unit-tested).
4. Notifications never fire to the actor and never duplicate an open item.
5. `/admin`, the public site, and the external shell are unchanged.
6. Full battery passes: lint, typecheck, full vitest, `next build`, Cloudflare build, dry-run.
