# Insights Content Standard

Task 10 adds a provider-neutral multilingual Insights engine for public editorial content. The public UI consumes `InsightsProvider` from `src/lib/insights/provider.ts`; local content lives in `src/content/{en,fr,es}/insights.ts` and can later be replaced by the Task 10B Admin or a CMS without rebuilding the renderer.

## Architecture

- Types: `src/content/insights.types.ts`
- Shared source registry: `src/content/insights.registry.ts`
- Local provider: `src/lib/insights/local-provider.ts`
- Public accessors: `src/lib/insights/content.ts`
- SEO/schema helpers: `src/lib/insights/seo.ts`
- Related logic: `src/lib/insights/related.ts`
- Publish QA: `src/lib/insights/publish-qa.ts`

Public pages must never import raw locale article arrays directly.

## Document Model

Articles use typed blocks, not raw HTML. Supported blocks include paragraphs, headings, lists, direct answers, key takeaways, definitions, callouts, comparison tables, checklists, steps, evidence notes, FAQ, decision frameworks, sample-audit references, related services, CTAs, and dividers.

Rendering rules:

- Use semantic HTML.
- Generate heading anchors and table of contents from structured heading blocks.
- Render accessible tables with captions.
- Do not use uncontrolled HTML or `dangerouslySetInnerHTML` for article body content.
- FAQ schema may be emitted only when matching visible FAQ blocks exist.

## Article Fields

Each article is prepared for the future eight-tab Admin model:

- Document: slug, locale, title, excerpt, category, author, dates, status, reading time, cover image, blocks.
- Search Strategy: focus keyword, intent, audience, entities, topic cluster, markets, AI citation opportunity, refresh trigger.
- Content & Evidence: sources, claims, fact-check status, original insights, compliance notes.
- Internal Linking: service, industry, market, case-study, sample-audit, and related article links.
- Metadata & Social: meta title, description, canonical, robots, OG, Twitter, breadcrumb label.
- Schema: Article/BlogPosting, FAQ items, entities, mentions, citation references.
- Localization: hreflang group, x-default slug, translation status.
- Publish QA: structured report summary and reusable validation functions.

## Workflow

Supported statuses are `draft`, `in-review`, `approved`, `scheduled`, `published`, and `archived`. Public routes, sitemap entries, search/filter metadata, and related logic use only articles that are `published` and not scheduled for a future date.

## Categories

Registered category slugs are:

- `seo-guides`
- `ai-search`
- `technical-seo`
- `content-authority`
- `local-international-seo`
- `ppc-search-intelligence`
- `seo-mentor`

English slugs are shared across locales. SEO Mentor may curate cross-category articles without fabricating entries.

## Evidence Rules

Do not invent research, survey data, rankings, traffic results, expert quotes, citations, client examples, awards, credentials, or publication dates. Use primary or authoritative sources for factual claims. Separate Taskcover interpretation from evidence. Taskcover pages may be internal links but not independent evidence sources.

## Internal Linking

Articles should link naturally to relevant services, industries, markets, case studies, sample audits, and lead funnel pages. Links must support the reader journey and avoid stuffing.

Task 13 clarifies that Insights articles support commercial pages; they do not
own service, market, or industry commercial intent. Articles should link to the
canonical service or market page when a reader is ready for implementation, but
article H1s, metadata, and copy should remain informational and evidence-led.
The canonical relationships are mapped in `docs/KEYWORD_TO_URL_MAP.md` and
`docs/INTERNAL_LINKING_ARCHITECTURE.md`.

## Schema Rules

Allowed schema for Insights:

- Article or BlogPosting
- BreadcrumbList
- FAQPage only when visible FAQ content matches exactly

Do not add Review, AggregateRating, fake Person, unsupported HowTo, fake awards, or fake ratings schema.

## Multilingual Rules

Public content is complete in English, French, and Spanish. UI strings, metadata, breadcrumbs, dates, reading time labels, sources, filters, CTAs, and article bodies must be localized. English remains unprefixed; French and Spanish use `/fr` and `/es`.

## Publish QA

Reusable validation checks include H1, metadata, slug shape, canonical shape, author, valid dates, cover alt text, category registration, blocks, required translations, internal links, related slugs, visible FAQ/schema match, Article schema completeness, canonical/hreflang relationship, no accidental noindex, source URL shape, and evidence-backed claims.

Publish QA must not block publication based on word count, keyword density, exact keyword repetition, arbitrary readability scores, SEO scores, or ranking predictions.

## Future Admin/CMS Migration

Task 10B can replace the local provider with an Admin-backed provider that implements the same `InsightsProvider` interface. The block model, workflow statuses, source model, QA checks, and schema helpers are already structured for that migration.

Task 10B adds `INSIGHTS_PROVIDER=database` for published PostgreSQL snapshots. Database mode must expose published immutable `InsightArticle` snapshots only. Draft, in-review, approved, scheduled future, and archived records must never be returned by public provider calls.
