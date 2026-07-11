# Admin Publishing Workflow

Workflow states:

`Draft -> In Review -> Approved -> Scheduled -> Published -> Archived`

Rules:

- Editors can create, edit, preview, save, upload media, and submit for review.
- Admins can request changes, approve, schedule, publish now, cancel schedules, archive, restore revisions, manage users, view audit logs, and trigger publishing.
- Approval, scheduling, and publishing require a complete English source article. FR/ES localizations are optional and are exposed only after their own review is complete.
- Blocking Publish QA errors prevent approval, scheduling, and publishing.
- Editing a published article keeps the live published snapshot intact and creates draft changes.
- Publishing creates immutable revisions and updates the published pointer transactionally.

Scheduled publishing endpoint:

- `POST /api/internal/publishing/run`
- Header: `x-taskcover-publish-secret: <PUBLISH_CRON_SECRET>`
- Returns summarized counts only.
- No GET publishing.

The workflow is enforced by `AdminRepository.transitionArticle`, not by UI visibility. The live public provider selects only rows with a non-null published revision pointer and no archive timestamp, so draft, review, approved, and future-scheduled changes cannot replace the live snapshot. A published article can be reopened into a new draft without changing its live snapshot. Archive hides the pointer; restore requires an Admin-selected immutable revision and creates a new draft.
