# Admin Publishing Workflow

Workflow states:

`Draft -> In Review -> Approved -> Scheduled -> Published -> Archived`

Rules:

- Editors can create, edit, preview, save, upload media, and submit for review.
- Admins can request changes, approve, schedule, publish now, cancel schedules, archive, restore revisions, manage users, view audit logs, and trigger publishing.
- Approval, scheduling, and publishing require complete EN/FR/ES translations.
- Blocking Publish QA errors prevent approval, scheduling, and publishing.
- Editing a published article keeps the live published snapshot intact and creates draft changes.
- Publishing creates immutable revisions and updates the published pointer transactionally.

Scheduled publishing endpoint:

- `POST /api/internal/publishing/run`
- Header: `x-taskcover-publish-secret: <PUBLISH_CRON_SECRET>`
- Returns summarized counts only.
- No GET publishing.
