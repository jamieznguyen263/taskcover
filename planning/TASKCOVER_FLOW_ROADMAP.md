# Taskcover Flow — Canonical Roadmap

Each slice below is implemented one at a time, in order, unless a dependency forces
reordering. See [CURRENT_FLOW_PR.md](./CURRENT_FLOW_PR.md) for the slice actively in
progress and [FLOW_DECISIONS.md](./FLOW_DECISIONS.md) for locked product decisions.

## Status — 2026-07-19: all 12 slices implemented ✅

| Slice | Ships in | Status |
|-------|----------|--------|
| FLOW-001 Work application shell | PR #14 | ✅ merged |
| FLOW-002 Memberships, roles, teams | PR #15 | ✅ merged |
| FLOW-003 Freelancer & partner access | PR #17 | ✅ merged |
| FLOW-004 Clients + FLOW-005 Projects | PR #18 | ✅ merged |
| FLOW-006 Unified Work + FLOW-007 Discussions/Files/Activity | PR #19 | ✅ merged |
| FLOW-008 Home/Manager view + FLOW-009 Inbox/Notifications | PR #20 | ✅ merged |
| FLOW-010 Documents + FLOW-011 Smart rules (deterministic) | PR #21 | ✅ merged |
| FLOW-012 Hardening & rollout | this PR | 🟢 in review |

From FLOW-004 on, slices shipped in pairs (one additive migration per PR, full validation
once per PR). See [TASKCOVER_FLOW_ROLLOUT.md](./TASKCOVER_FLOW_ROLLOUT.md) for the runbook.
The detailed slice objectives below remain the acceptance record for each.

## Wave 1 — Application foundation

### FLOW-001 — Work application shell (ACTIVE — see CURRENT_FLOW_PR.md)
- Depends on: existing admin auth/session.
- Objective: authenticated `/flow` route reusing existing session, sidebar/header shell,
  command-menu shell, detail-drawer primitive, feature flag, no business schema.
- Acceptance boundary: no membership/role schema, no Clients/Projects/Work/Inbox
  persistence, no fake data.

### FLOW-002 — Memberships, roles, and teams
- Depends on: FLOW-001.
- Objective: `organization_memberships`, `role_presets`, `teams`, `team_memberships`,
  capability model, deny-by-default authorization, backfill of existing admin/editor users.
- Acceptance boundary: no external (freelancer/partner) access yet.

### FLOW-003 — Freelancer and partner access
- Depends on: FLOW-002.
- Objective: `external_organizations`, `external_memberships`, project-scoped access,
  invitation workflow, access expiry, external navigation, internal-data isolation.
- Acceptance boundary: isolation must be verified before this slice is accepted.

## Wave 2 — Agency core

### FLOW-004 — Clients
- Depends on: FLOW-002.
- Objective: `clients`, `client_contacts`, `client_memberships`, Client Workspace,
  explainable client health.

### FLOW-005 — Projects and templates
- Depends on: FLOW-004.
- Objective: `projects`, `project_memberships`, `project_templates`, transactional project
  creation, relative deadlines.

### FLOW-006 — Unified Work
- Depends on: FLOW-005.
- Objective: `work_items` and related tables, five canonical statuses, one accountable
  Owner, Reviewer/contributors, Waiting metadata, parent/child Work, checklists, simple
  dependencies, List/Board/Calendar views.

### FLOW-007 — Discussions, files, and activity
- Depends on: FLOW-006.
- Objective: work discussions, shared vs. internal comments, private file uploads, activity
  timeline, external visibility enforcement.

## Wave 3 — Daily operations

### FLOW-008 — Home and Manager Control View
- Depends on: FLOW-006, FLOW-007.
- Objective: role-aware Home, My Focus, My Work, Needs Attention, manager review queue,
  overdue/waiting summaries, basic workload signals.

### FLOW-009 — Inbox and notifications
- Depends on: FLOW-006, FLOW-007.
- Objective: actionable Inbox, notification states, snooze, grouping, waiting reminders,
  review/approval actions.

### FLOW-010 — Documents
- Depends on: FLOW-004, FLOW-005.
- Objective: `documents`, TipTap editing, version history, client/project links, related
  Work, visibility controls, document templates.

### FLOW-011 — Smart rules and limited AI assistance
- Depends on: FLOW-006, FLOW-007, FLOW-009, FLOW-010.
- Objective: preset deterministic rules, meeting-note action extraction, client/project
  summaries, permission-aware search, preview-before-create for AI-suggested records, no
  autonomous execution.

## Wave 4 — Production readiness

### FLOW-012 — Hardening and rollout
- Depends on: all prior slices.
- Objective: performance, accessibility, security, permission audit, external-data isolation
  testing, migration verification, staging rollout, staff onboarding, feature rollout.

## Explicitly out of scope for the entire roadmap

SEO Tracking, DataForSEO, Google Search Console integration, keyword rank tracking, Site
Health, AI Visibility, SEO API cost center, client SEO dashboards — see
[FLOW_DECISIONS.md](./FLOW_DECISIONS.md). Also out of scope for all waves: Slack-style
chat/DMs/presence, client portal, sales CRM pipeline, billing/invoicing, performance
scoring, Gantt charts, portfolio management, custom databases, formula/rollup systems,
unlimited custom statuses, a no-code automation canvas, native mobile apps, real-time
collaborative editing, autonomous AI agents, complex field-level permissions, generic
workflow-engine infrastructure.
