# Work and Case Study Standard

This document governs Taskcover Work pages, sample deliverables, case studies,
client results, and future verified outcome publication.

## Work Item Types

Work records use `src/content/work.types.ts` and
`src/content/work.registry.ts`.

Allowed types are `case-study`, `sample-audit`, `framework`,
`client-result`, `roadmap`, and `research-output`.

## Sample Deliverable Rules

Sample deliverables are public methodology examples only. They must use:

- `illustrative: true`
- no client name
- no client domain
- no real-client metric claim
- no quote, endorsement, screenshot, or dashboard source
- visible disclosure copy near the top of the page

Required disclosure:

> Illustrative sample deliverable. It demonstrates Taskcover's methodology and
> does not represent a specific client engagement or result.

Localized French and Spanish equivalents must be professional and visible.

## Illustrative Data Rules

Allowed sample visuals may use qualitative statuses, workflow stages,
severity categories, generic issue types, topic clusters, and architecture
relationships.

Do not use fake-looking revenue, traffic, ranking, lead, conversion,
ad-spend, or before/after datasets.

## Case Study Publication Requirements

A named case study may render only when all are true:

- permission is `verified-public`
- evidence is `verified`
- `publicDisclosure` is `true`
- `requiredContextComplete` is `true`
- client identity permission exists
- engagement context is documented
- baseline context is documented
- methodology is documented
- timeframe is documented
- measurement source is approved
- outcome context is complete
- wording is approved
- public assets are approved

Task 8B adds a second requirement for published detail pages: approved case
studies must be complete, not teaser summaries. Each public case detail page
must include overview, client background, challenge, objectives, strategy,
execution, services delivered, results, key metrics, a 2-3 image gallery, key
learning, related services, related industry, related market, and final CTA.

Within a single case-study page, sections must not repeat the same layout logic
over and over. Use distinct structures such as dossiers, diagnostic panels,
objective ladders, strategy maps, workstream boards, ledgers, outcome boards,
metric bands, compact galleries, insight memos, and related rails.

Every metric must preserve its source meaning. Do not change numbers, invent
baselines, add unsupported platforms, combine unrelated metrics, or overstate
attribution. When source context is limited, display the metric as a verified
published result with limited context.

The helper `getPublicCaseStudies()` must be used instead of manual filtering.

## Client Result Verification Requirements

A public result may render only when all are true:

- verified evidence
- verified public permission
- public disclosure
- measurement source
- baseline
- timeframe
- relevant methodology
- approved wording

Use `getVerifiedPublicResults()` instead of manual filtering.

## Public and Private Evidence Rules

Private, pending, internal, expired, or unverified records must never expose:

- client name
- domain
- quote
- metric
- screenshot
- document
- source URL
- identity
- engagement detail

Confidential work may be described only as a protected handling policy.

## Measurement Context Requirements

Taskcover can discuss measurement categories such as qualified organic demand,
non-brand visibility, technical health, content coverage, AI answer readiness,
local visibility, conversion paths, lead quality, and reporting confidence.

Do not imply these metrics improved for clients unless a verified public result
record exists.

## Prohibited Claims

Do not invent case studies, brands, testimonials, campaign timelines,
rankings, traffic increases, conversions, revenue, percentages, screenshots,
awards, source URLs, logos, or client quotes.

Do not use "placeholder" or "coming soon" language on public Work pages.

## Adding a Verified Case Study

1. Add a `case-study` record to `work.registry.ts`.
2. Store private notes in `internalNotes` only.
3. Confirm public identity permission and approved wording.
4. Attach only public-approved assets.
5. Set `permissionStatus: "verified-public"`.
6. Set `verificationStatus: "verified"`.
7. Set `publicDisclosure: true`.
8. Set `requiredContextComplete: true`.
9. Verify the case-study page renders the record.
10. Run lint, typecheck, build, and route QA.

## Adding a Verified Result

1. Add a `client-result` record to `work.registry.ts`.
2. Confirm measurement source, baseline, timeframe, and methodology.
3. Confirm public permission and approved wording.
4. Do not expose private dashboards or source URLs unless explicitly approved.
5. Set the verified-public flags.
6. Verify the result page renders the record.
7. Run lint, typecheck, build, and route QA.

## EN/FR/ES Content Requirements

Work copy lives in:

- `src/content/en/work.ts`
- `src/content/fr/work.ts`
- `src/content/es/work.ts`

Routes keep English slugs for now. Public UI on `/fr` and `/es` must use
localized content.

## UI Rules

Work pages must feel operational and deliverable-led. No two sections on the
same page should repeat the same layout logic. Sample pages must show method,
inputs, priorities, and outputs without looking like fake client dashboards.

Every two-column section must contain meaningful content on both sides.
Disclosures must be premium, visible, and not hidden as tiny text.

The homepage may include only one compact case-study preview section: one
highlighted case, one verified metric or outcome summary, supporting copy, and
a CTA to `/work/case-studies`. Do not add a carousel, a large multi-case
showcase, or all 10 cases to the homepage.

Case-study galleries use only 2-3 approved local images per case. Do not
hotlink source assets.

Public agency naming is always Taskcover Agency.

## SEO and Schema Rules

Every Work page uses localized metadata, canonical URLs, hreflang alternates,
and BreadcrumbList schema.

Do not add Review, AggregateRating, fake Dataset, fake CaseStudy, fake Person,
fake VideoObject, fake Organization, awards, or performance-claim schema.

CreativeWork schema is optional only for real illustrative public samples and
must not imply client ownership or client results.
