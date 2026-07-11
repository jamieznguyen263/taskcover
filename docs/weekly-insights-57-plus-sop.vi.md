# Weekly Insights SOP - Article 57+

Muc tieu: sau khi Core 56 backfill hoan tat, Taskcover chuyen sang nhịp 1 bai/tuần bat dau tu bai 57 ma khong giam chat luong SEO, technical SEO, evidence, hay internal linking.

## Weekly Cadence

Default cadence:

- Monday: choose topic and search intent.
- Tuesday: create brief and source list.
- Wednesday: draft.
- Thursday: editorial, source, technical SEO QA.
- Friday: publish EN and run post-publish QA.
- Following Monday: update internal links and monitor early Search Console/analytics signals.

## Article 57+ Intake Criteria

Do not start a weekly article unless it has:

- one primary intent
- one owning URL
- one primary keyword or query family
- one money/supporting page target
- at least three internal link targets
- source plan for material claims
- information gain requirement
- forbidden claims list
- refresh/update trigger

## Weekly Brief Template

```markdown
# Weekly Insights Brief - TC-057

## Core

- Article ID:
- Working title:
- Final H1:
- Suggested slug:
- Primary keyword:
- Secondary keywords:
- Search intent:
- Funnel:
- Target market:
- Target words:
- Primary money page:
- Supporting pages:
- Category:
- Update cycle:

## Why This Article Exists

- Primary reader problem:
- Business reason:
- Cannibalization check:
- Existing URL this must not duplicate:
- Information gain requirement:

## SERP And Source Validation

- Date checked:
- Search location/language:
- Dominant page type:
- Dominant format:
- Required subtopics:
- Unique gap Taskcover can own:
- Source keys / URLs:
- Claims requiring evidence:

## Outline

- Opening answer requirement:
- H2/H3 outline:
- Mandatory FAQ:
- Original asset/table/checklist:
- Visual/data plan:

## Internal Links

- Required links:
- Suggested links:
- Anchor text:
- Related article slugs:

## Technical SEO Rules

- Recommended schema:
- FAQPage only if visible FAQ exists:
- Canonical:
- Hreflang:
- Sitemap inclusion:
- Noindex exclusions:

## Forbidden Claims

- No ranking guarantee.
- No fabricated statistics.
- No unsupported causal claim.
- No fake client result.
- No guaranteed AI mention/citation.
```

## Claude Prompt For Article 57+

```text
You are Taskcover's senior SEO Content Executive and SEO Technical Content Editor.

Write one English-first Insights article only, using the attached weekly brief as source of truth.

Required output:
- Use the same `articlePackages` JSON contract from `docs/core56-claude-output-contract.md`.
- Return exactly one article package.
- Do not add extra article IDs.
- Verify current primary sources before making Google, AI Search, schema, hreflang, Core Web Vitals, or platform-specific claims.
- Do not invent statistics, client results, expert quotes, awards, ratings, reviews, or certifications.
- Do not promise rankings, revenue, traffic, AI mentions, or AI citations.
- Use Taskcover service pages as internal links only, not evidence sources.
- Include a direct opening answer, H2/H3 sections, source-backed claims, visible FAQ only when needed, and a final CTA aligned with the primary money page.

Before finalizing:
- list source URLs used
- list claims needing human verification
- list technical SEO risks
- list cannibalization risks
- confirm schema types and FAQ visibility
```

## Weekly Codex Pipeline

When Claude returns article 57+:

1. Save output inside `.claude-output/`.
2. Validate against the same contract. If this is outside Core 56, use the contract manually until a TC-057 manifest row exists.
3. Convert to `src/content/backfill/weekly-tc-057.ts` or create through Admin if the CMS path is preferred.
4. Run:

```powershell
npm run insights:backfill:validate
npm run insights:verify-database
npm run typecheck
npm run lint
```

5. Review admin preview.
6. Publish EN.
7. Run post-publish SEO checks.

## Monthly Maintenance

At the end of each month:

- add internal links from older articles to newly published articles
- check if any Core 56 articles need refresh
- review duplicate/cannibalization risk
- update sitemap/indexability checks
- review Search Console query drift
- add next four weekly briefs to the backlog

## Quality Bar

Weekly does not mean lighter QA. It means smaller scope per week.

Every article still needs:

- helpful content
- source-backed material claims
- clean metadata
- visible schema parity
- internal links in body
- no fake proof
- no ranking guarantees
- post-publish QA
