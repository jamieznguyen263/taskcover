# Taskcover Flow — Logical Schema (planning only)

This document captures the **accepted future logical schema** for Taskcover Flow. It is
planning documentation. **No migrations exist yet** — FLOW-001 introduces zero new tables.
Tables are grouped by the wave that introduces them; columns are indicative, not final DDL,
and will be refined when the owning FLOW-XXX slice is implemented.

Existing tables this schema builds on (already in the repository, not redefined here):
`admin_users`, `admin_sessions`, `admin_invites`, `admin_audit_logs` (see
`src/lib/admin/repository.ts` and `drizzle/` migrations). Taskcover Flow membership extends
`admin_users` rather than duplicating identity.

## FLOW-002 — Memberships, roles, teams

```
organization_memberships   -- links an existing admin_users row to an internal access level
  id, user_id -> admin_users.id, access_level (owner|admin|manager|member),
  status (active|disabled), created_at, updated_at

role_presets
  id, name, description, capability_set (jsonb), is_system_preset, created_at

teams
  id, name, description, created_at

team_memberships
  id, team_id -> teams.id, user_id -> admin_users.id, created_at

external_organizations
  id, name, kind (freelancer|partner), created_at
```

## FLOW-003 — Freelancer and partner access

```
external_memberships
  id, external_organization_id -> external_organizations.id, user_id -> admin_users.id,
  role (freelancer|partner_manager|partner_member|read_only_guest),
  access_start_at, access_expiry_at, can_download, can_upload,
  revoked_at, revoked_by, created_at
```

## FLOW-004 — Clients

```
clients
  id, name, health_state, health_reason, account_manager_id -> admin_users.id,
  created_at, updated_at, archived_at

client_contacts
  id, client_id -> clients.id, name, email, phone, role_title, created_at

client_memberships
  id, client_id -> clients.id, user_id -> admin_users.id, created_at
```

## FLOW-005 — Projects and templates

```
projects
  id, client_id -> clients.id (nullable for internal projects), name, kind (client|internal),
  status, template_id -> project_templates.id (nullable), created_by -> admin_users.id,
  created_at, updated_at, archived_at

project_memberships
  id, project_id -> projects.id, user_id -> admin_users.id, created_at

project_templates
  id, name, description, default_work_items (jsonb), relative_deadlines (jsonb), created_at
```

## FLOW-006 — Unified Work

```
work_items
  id, project_id -> projects.id, type (task|deliverable|request|approval|milestone),
  title, description, status (to_do|in_progress|waiting|review|done),
  owner_id -> admin_users.id, reviewer_id -> admin_users.id (nullable),
  waiting_on_type (client|manager|teammate|freelancer|partner|external_party, nullable),
  waiting_on_ref (nullable), parent_work_item_id -> work_items.id (nullable),
  due_at, created_at, updated_at

work_item_members
  id, work_item_id -> work_items.id, user_id -> admin_users.id,
  relation (contributor|watcher), created_at

work_dependencies
  id, work_item_id -> work_items.id, depends_on_work_item_id -> work_items.id, created_at

work_checklist_items
  id, work_item_id -> work_items.id, label, is_done, position, created_at
```

## FLOW-007 — Discussions, files, activity

```
discussion_threads
  id, work_item_id -> work_items.id, created_at

comments
  id, thread_id -> discussion_threads.id, author_id -> admin_users.id, body,
  visibility (internal|shared), created_at

files
  id, storage_key, filename, content_type, size_bytes, uploaded_by -> admin_users.id,
  created_at

file_links
  id, file_id -> files.id, work_item_id -> work_items.id (nullable),
  document_id -> documents.id (nullable), client_id -> clients.id (nullable), created_at

activity_events
  id, actor_id -> admin_users.id, target_type, target_id, event, summary, metadata (jsonb),
  created_at
```

## FLOW-009 — Inbox and notifications

```
notifications
  id, recipient_id -> admin_users.id, kind (assignment|mention|feedback|review_request|
    approval_request|deadline_warning|waiting_reminder|external_update|system_warning),
  target_type, target_id, state (unread|read|snoozed|done), snoozed_until,
  created_at
```

## FLOW-010 — Documents

```
documents
  id, title, kind (strategy|brief|meeting_note|sop|report|proposal|research|decision|
    general), client_id -> clients.id (nullable), project_id -> projects.id (nullable),
  visibility (internal|shared), created_by -> admin_users.id, created_at, updated_at,
  archived_at

document_versions
  id, document_id -> documents.id, body (tiptap json), created_by -> admin_users.id,
  created_at

document_work_links
  id, document_id -> documents.id, work_item_id -> work_items.id, created_at
```

## FLOW-011 — Smart rules

```
automation_rules
  id, name, trigger (jsonb), action (jsonb), is_enabled, created_by -> admin_users.id,
  created_at
```

## FLOW-001 scope for this document

FLOW-001 creates **no tables from this document**. It exists to record the accepted shape
so FLOW-002 onward implement consistent, reviewed migrations instead of ad hoc schema.
