# Admin Content Spec

Task 10B will build a Notion/Google Docs-style content Admin. Task 10 prepares the public rendering and content architecture only; it does not build Admin UI.

## Roles

- Admin: manage users, settings, publishing, scheduling, archival, and final approvals.
- Editor: create, edit, localize, review, and submit content for approval.

## Workflow

Supported workflow states:

`Draft -> In Review -> Approved -> Scheduled -> Published -> Archived`

Scheduled content must not render publicly until the scheduled date is active. Public filtering, sitemap, and related logic must never expose unpublished content.

## Eight Admin Tabs

### 1. Document

Fields: id, slug, translation group, locale, internal title, H1, excerpt, category, tags, author, reviewer, editor, status, dates, reading time, cover image, alt text, caption, and structured blocks.

### 2. Search Strategy

Fields: focus keyword, secondary keywords, primary and secondary intents, target audience, funnel stage, core question, primary entity, supporting entities, topic cluster, parent pillar, target markets, SERP observations, featured snippet opportunity, AI citation opportunity, unique information gain, and refresh trigger.

### 3. Content & Evidence

Fields: sources, claims, fact-check status, original insights, case-study references, and compliance notes. Claims that require evidence must reference source IDs.

### 4. Internal Linking

Fields: required links, suggested links, service links, industry links, market links, case-study links, sample-audit links, related article slugs, and recommended anchors.

### 5. Metadata & Social

Fields: meta title, meta description, canonical, robots, OG title/description/image, Twitter title/description/image, and breadcrumb label.

### 6. Schema

Fields: schema type, FAQ items, about entities, mentions, citation references, and structured validation state. FAQ schema must match visible FAQ blocks exactly.

### 7. Localization

Fields: hreflang group, x-default slug, translation status, translation notes, locale-specific metadata, locale-specific blocks, and localized source notes where needed.

### 8. Publish QA

Fields: generated QA report, pass/warning/error results, unresolved blockers, reviewer notes, and final approval record. QA checks must not use keyword density, arbitrary SEO scores, readability scores, or ranking predictions.

## Block Editor

The editor should support typed blocks compatible with `src/content/insights.types.ts`: paragraphs, headings, lists, quotes, direct answers, key takeaways, definitions, callouts, comparison tables, checklists, steps, evidence, expert insight, images, figures, code, FAQ, pros/cons, decision frameworks, case-study references, sample-audit references, related services, CTAs, and dividers.

Blocks require revision history and preview support. Preview must render through the same public block renderer used by published pages.

## Scheduling And Preview

Scheduled articles can be previewed by authorized users but must remain absent from public routes, sitemap, related content, and search/filter metadata until active. Preview should validate locale, canonical, hreflang, schema, and internal links before approval.

## Future CMS Migration

The Admin or CMS should implement the `InsightsProvider` interface rather than changing public page components. This keeps routing, schema, related logic, sitemap behavior, and block rendering stable.
