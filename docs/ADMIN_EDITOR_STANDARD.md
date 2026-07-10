# Admin Editor Standard

The Admin editor is English-only for the UI, while article content supports EN/FR/ES.

Required tabs:

1. Document
2. Search Strategy
3. Content & Evidence
4. Internal Linking
5. Metadata & Social
6. Schema
7. Localization
8. Publish QA

The Document tab uses Tiptap directly. Editor JSON is validated and normalized into `InsightBlock[]`; public rendering remains the existing typed block renderer. Raw HTML is not part of the publication pipeline.

Autosave requirements:

- Debounced saves
- Visible states: Saving, Saved, Unsaved changes, Save failed, Conflict detected
- Optimistic concurrency through `lockVersion`/draft versions
- No database revision for every keystroke
- Warn before navigation with unsaved changes

The editor sends the complete draft to `POST /api/admin/insights/autosave` after a 1.2 second debounce. `Saved` is shown only after the database returns a new lock version. Network failure remains `Save failed`; a stale lock returns `Conflict detected` and offers reload. The editor accepts structured JSON for the non-document tabs and rejects raw HTML/editor nodes.
