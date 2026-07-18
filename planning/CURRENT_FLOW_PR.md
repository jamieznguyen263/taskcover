# Current Flow PR

**Active pair: FLOW-010 (Documents) + FLOW-011 (Smart rules & limited AI)** — one PR, one
additive migration (`0010_flow_documents.sql`), base `main`. This closes Wave 3.

History: FLOW-001–009 merged (#14, #15, #17, #18, #19, #20). Workflow unchanged.

## FLOW-010 scope — Documents

- Tables: `documents` (title, kind, body, version, visibility internal|shared, optional
  client/project links), `document_versions` (append-only snapshots), `document_work_links`.
- Nine kinds (strategy / brief / meeting_note / sop / report / proposal / research /
  decision / general). **Every save snapshots the previous body into `document_versions`
  transactionally**, so history is complete and version numbers are sequential.
- `/flow/docs` list + create; `/flow/docs/[id]` view/edit (edit = new version), version
  history, related work, client/project links. Internal documents are invisible to anyone
  without `internal-notes:view` (enforced in `DocumentRepository`, not the UI).
- New capabilities `docs:view` / `docs:manage` (member+), with a `role_presets` UPDATE in the
  same migration (replayed by `migration-consistency.test.ts`). Docs nav enabled;
  quick-create "New document" and command menu "Go to Docs" wired.

## FLOW-011 scope — Smart rules & limited AI (deterministic)

> **Design note:** this slice deliberately ships **deterministic** assistance — no LLM, no
> external/paid API call (per the project constraint). Every "smart" feature is transparent
> and testable, and the **preview-before-create / no-autonomous-execution** contract from the
> blueprint is honoured. A real LLM can slot behind the same preview UI later without
> changing the safety model.

- **Meeting-note action extraction** (`action-extraction.ts`, pure + unit-tested): parses a
  meeting-note body for unchecked task boxes (`- [ ] …`), `ACTION:`/`TODO:`/`Follow-up`
  markers, and `@name to …` lines; skips checked boxes; de-dupes. On a meeting-note document
  the user **reviews the candidates and picks which become work** — creation is a separate,
  explicit action that links the new work back to the document.
- **Permission-aware search** (`/flow/search`, `SearchRepository`): substring match across
  clients / projects / work / documents, **each branch gated by the caller's capability**, so
  a result set can never contain something the user can't open; internal-only documents are
  excluded without `internal-notes:view`. Command menu gains "Search everything".

## Non-scope for this pair

- **LLM-backed features** (freeform summaries, semantic search, natural-language action
  extraction) — deferred behind the deterministic versions; the preview contract is already
  in place for when a model is added. No paid API is called.
- **TipTap WYSIWYG editor** — documents use a Markdown body for v1 (versioned, linkable); a
  rich editor is a follow-up, same pattern as the deferred file-upload UI (FLOW-007).
- Document templates as first-class records (the `project_templates` precedent stands; doc
  templates can seed a body later), document-level comments, cross-document linking.

## Acceptance checks

1. Migration 0010 creates only the three document tables + enum/indexes and updates only
   `role_presets` — zero changes to previously existing tables.
2. Editing a document creates a new version transactionally; history is never lost.
3. Internal documents and internal search results require `internal-notes:view`.
4. Action extraction only ever *proposes*; work is created by an explicit, separate action.
5. Search results are capability-gated per type.
6. `/admin`, the public site, and the external shell are unchanged.
7. Full battery passes: lint, typecheck, full vitest, `next build`, Cloudflare build, dry-run.
