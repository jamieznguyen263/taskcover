# Core 56 structured content import

This workflow moves a researched article package into the Taskcover Admin SEO OS without bypassing the editor, validation, workflow, or immutable publication model.

## Safety model

- The importer creates or updates **drafts only**.
- It refuses to update an article group unless its workflow state is `draft`.
- The JSON payload is validated before database writes.
- Tiptap is the source of truth for body blocks; `normalized_blocks` and reading time are derived from the editor document.
- Every write is transactional and audited.
- `creationKey` is a stable UUID, making repeated imports idempotent.
- Dry-run is the default. A database write requires `--write`.
- `--target` must match `DATABASE_TARGET`.
- Production requires both `--write` and `--confirm-production-import`; the resulting article still remains a draft.

## Selective locale policy

The localization rows stored in an article group are its atomic publication set.

- A Core 56 payload with `publicationLocales: ["en"]` creates an English-only article group.
- It does not create empty French or Spanish pages.
- Existing multilingual groups remain multilingual because their EN/FR/ES localizations already exist.
- To add French later, re-import the same `creationKey` with `publicationLocales: ["en", "fr"]` and complete payloads for both locales.
- The importer refuses to remove a locale that already exists in the group. Locale-set reduction requires a deliberate migration, not a content import.

## Payload contract

```json
{
  "schemaVersion": 1,
  "creationKey": "11111111-1111-4111-8111-111111111111",
  "sharedSlug": "generative-engine-optimization-guide",
  "category": "ai-search",
  "author": "Taskcover Editorial Team",
  "publicationLocales": ["en"],
  "localizations": {
    "en": {
      "editorDocument": {
        "type": "doc",
        "content": []
      },
      "article": {
        "internalTitle": "TC-007 — GEO practical guide",
        "h1": "Generative Engine Optimization: A Practical Guide",
        "excerpt": "...",
        "searchStrategy": {},
        "contentEvidence": {},
        "internalLinking": {},
        "metadata": {},
        "schema": {},
        "localization": {}
      }
    }
  },
  "assignment": {
    "assigneeEmail": "editor@taskcover.com",
    "reviewerEmail": "admin@taskcover.com",
    "priority": "high",
    "dueDate": "2026-07-18T12:00:00.000Z"
  },
  "importNote": "Core 56 pilot draft"
}
```

The `article` object is a structured patch over Taskcover's normal draft defaults. The importer protects system-managed identity and workflow fields:

- `id`
- `translationGroupId`
- `locale`
- `category`
- `author`
- `status`
- publication and update timestamps
- normalized body blocks
- reading time

Body blocks supplied inside `article.blocks` are ignored. The importer always derives them from `editorDocument` using the same normalizer as the visual editor.

## Commands

### Staging dry-run

```bash
npm run insights:import-draft -- \
  --file=content-production/core56/TC-007.en.json \
  --actor-email=editor@taskcover.com \
  --target=staging \
  --dry-run
```

Omitting both `--dry-run` and `--write` also performs a dry-run.

### Staging write

```bash
npm run insights:import-draft -- \
  --file=content-production/core56/TC-007.en.json \
  --actor-email=editor@taskcover.com \
  --target=staging \
  --write
```

### Production draft import

```bash
npm run insights:import-draft -- \
  --file=content-production/core56/TC-007.en.json \
  --actor-email=editor@taskcover.com \
  --target=production \
  --write \
  --confirm-production-import
```

This does not approve, schedule, or publish the article.

## Dry-run report

The command prints JSON with:

- target and mode
- create/update action
- article group ID, when already known
- creation key, slug, category, and publication locales
- block, claim, source, and internal-link counts per locale
- blocking Publish QA errors
- non-blocking warnings

Publish QA errors are reported but do not prevent importing a valid draft. They must be resolved in the Admin editor before approval or publication.

## Recommended Core 56 operating sequence

1. Validate the keyword and intent in the target markets.
2. Prepare sources and claim-to-source mapping.
3. Write the editor-native Tiptap document and structured article fields.
4. Run the staging dry-run.
5. Import to staging as a draft.
6. Review Document, Search Strategy, Evidence, Internal Linking, Metadata, Schema, GEO, and Publish QA in Admin.
7. Submit through the normal Staff → Admin workflow.
8. Publish only after Admin approval.
