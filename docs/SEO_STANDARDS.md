# Taskcover Agency — SEO Standards

This document governs on-page SEO and structured data. It exists to keep the
site both search-friendly and **honest**.

## 1. On-page SEO

- **One clear `<h1>` per page.** Subsequent sections use `<h2>` via
  `SectionHeader`.
- **Unique title and meta description** per page. Use `buildMetadata()` from
  `src/lib/seo.ts`.
- **Clean URL structure** matching the route (see `SITE_ARCHITECTURE.md`).
- **Proper heading hierarchy** (`h1` → `h2` → `h3`). Do not skip levels.
- **Semantic HTML**: `header`, `main`, `nav`, `section`, `article`, `figure`,
  `figcaption`, `footer`.
- **Internal linking**: every page links to relevant services, industries,
  markets, and proof pages. Footer provides a consistent global nav.
- **Image alt text**: every meaningful image has descriptive alt. Decorative
  images use `alt=""` or `aria-hidden`.
- **Performance-conscious**: prefer server components; lazy-load client-only
  widgets; avoid layout shift.
- **Helpful, expert-led, people-first content.** No keyword stuffing.

## 2. No duplicate doorway pages

- Market pages (USA / Canada / Australia) must each have **unique local
  context** — not the same copy with the country name swapped.
- Service and industry pages must be genuinely differentiated.

## 3. Structured data policy

Schema is emitted via `<script type="application/ld+json">` using the safe
serializer in `src/lib/seo.ts` (`serializeJsonLd`).

| Schema type       | When to use                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `Organization`    | Global, in root layout. Safe fields only.                                |
| `BreadcrumbList`  | Any page deeper than the homepage, via `breadcrumbSchema()`.             |
| `Article`         | Insight/article detail pages, when real articles exist.                  |
| `VideoObject`     | Pages hosting real video testimonials/spokesperson videos, with details. |
| `FAQPage`         | **Only** when FAQs are genuinely visible on the page.                    |

### Hard rules

- **No fake review schema.**
- **No spammy aggregate ratings.**
- **No fabricated case-study metrics** in schema or copy.
- **No fake proof schema** for reviews, videos, people, awards, or media.
- Organization schema omits phone/address/founder/awards until verified.
- For `Article` and `VideoObject`, only include fields backed by real data.

## 4. Metadata helpers

`src/lib/seo.ts` provides:

- `buildMetadata({ title, description, path, locale, ogImage, noIndex, keywords })`
  → returns a `Metadata` object with localized canonical, OG, Twitter fields,
  and hreflang `alternates.languages` (en/fr/es/x-default). `path` is the
  UNPREFIXED base path; the helper localizes it for the given `locale`.
- `organizationSchema()` → safe Organization JSON-LD (locale-neutral).
- `breadcrumbSchema(items, locale)` → BreadcrumbList JSON-LD with localized
  paths (and localized labels you pass in).
- `faqSchema(faqs)` → FAQPage JSON-LD (pass localized FAQs where translated).
- `serializeJsonLd(data)` → XSS-safe string for `dangerouslySetInnerHTML`.

## 5. Open Graph & Twitter

- Default OG image: `public/brand/og-default.svg` (placeholder).
- Per-page OG images can be passed via `buildMetadata({ ogImage })`.
- Replace the placeholder OG with a real branded 1200×630 asset before launch.

## 6. Service page schema (Task 3)

Service detail pages (`/services/[slug]`) emit two JSON-LD blocks:

- **BreadcrumbList** — Home → Services → Service (via `breadcrumbSchema()`).
- **FAQPage** — only because FAQs are **genuinely visible** on the page (via
  `faqSchema()`).

Rules:
- **No `Service` schema type** with fake offers/prices — we don't publish
  fabricated pricing or availability.
- **No `Review` or `AggregateRating`** schema on service pages.
- One H1 per service page (the `h1` field from `src/data/services.ts`).
- Unique `metaTitle` + `metaDescription` per service (also from the data file).
- Internal links to related services are rendered as visible anchors (the
  "next best modules" rail), satisfying internal-linking best practices.

### Enriched service data fields (Task 3C)

Each service in `src/data/services.ts` carries the following optional-but-preferred
fields. They are **display-only** (not emitted into JSON-LD) and exist to give
every page consistent, buyer-oriented depth before i18n:

| Field | Where it renders | Notes |
|-------|------------------|-------|
| `deliverables[].tag` | Deliverable ledger tier chip | One of the allowed tag strings; falls back to an em-dash if omitted. |
| `useCases[].signal` | "Trigger" column in the decision-path layout | Answers "what situation tells a buyer this is right for them?" |
| `process[].timing` | Badge on each process timeline node | Use concrete labels (`Week 1`, `Weeks 1–2`, `Month 1`, `Monthly`, `Quarterly`, `Ongoing`). |

No field in this list is added to structured data. They are purely on-page
content used by `ServicePageTemplate`.

---

## 7. Internationalization (i18n) — Task 4A

The site supports English (default, unprefixed), French (`/fr`), and Spanish
(`/es`). Full details in `docs/I18N_STRATEGY.md`.

- Each page emits `<link rel="alternate" hreflang="...">` for `en`, `fr`,
  `es`, and `x-default` via `buildMetadata({ path, locale })`.
- The canonical URL matches the current locale path.
- Open Graph `locale` is localized (`en_US`, `fr_FR`, `es_ES`).
- BreadcrumbList JSON-LD uses localized paths and labels.
- FAQPage JSON-LD uses localized FAQ content where translated.
- The sitemap (`src/app/sitemap.ts`) includes all localized routes with
  hreflang alternates.

Hard rules:
- No locale may be served under the wrong prefix (e.g. French content under
  an unprefixed URL). The route prefix is the source of truth.
- Slugs are English (shared) for now; localized slugs are a future task.

## 8. Industry page schema (Task 5)

Industry detail pages (`/industries/[slug]`) emit two JSON-LD blocks:

- **BreadcrumbList** — Home → Industries → Industry (via `breadcrumbSchema()`).
- **FAQPage** — only because FAQs are **genuinely visible** on the page (via
  `faqSchema()`).

Rules:
- **No `Review` or `AggregateRating`** schema on industry pages.
- **No fabricated metrics or case-study numbers** in schema or copy.
- One H1 per industry page (the `h1` field from the industry content).
- Unique `metaTitle` + `metaDescription` per industry (localized per locale).
- Industry content uses outcome categories (clearer search coverage, stronger
  trust signals, etc.) — never fake percentages or revenue numbers.
- Brand names referenced as experience context only, never as endorsement.

## 9. Local market context (USA / Canada / Australia)

Each market page must include:

- Unique intro describing that market’s search behavior and trust signals.
- Region-specific examples (e.g. bilingual demand in Canada, metro concentration
  in Australia, multi-state dynamics in the USA).
- Localized internal links to relevant services and industries.
- A clear call to action tailored to that market.

## 10. Proof + Authority pages

Proof pages (`/proof` and `/proof/[slug]`) emit localized metadata,
canonical URLs, hreflang alternates, and BreadcrumbList schema only.

Rules:
- No `Review` schema.
- No `AggregateRating` schema.
- No fake `Person`, `ProfilePage`, `VideoObject`, awards, logos, sameAs links,
  or organization relationships.
- `VideoObject` may be emitted only for a real verified public video record
  with complete source URL, thumbnail, title, description, and valid date data.
- `Person` or `ProfilePage` may be emitted only when a verified public
  spokesperson profile exists.
- `ItemList` may be emitted only for real public proof records when useful and
  valid.
- Empty proof registries must render evidence policy and verification
  workflow content, not placeholder proof.

## 11. Work, Case Studies, and Client Results

Work pages (`/work`, `/work/case-studies`, `/work/sample-audits`,
`/work/sample-audits/[slug]`, `/work/search-growth-frameworks`, and
`/work/client-results`) emit localized metadata, canonical URLs, hreflang
alternates, and BreadcrumbList schema only.

Task 8B adds case-study detail pages at `/work/case-studies/[slug]`,
`/fr/work/case-studies/[slug]`, and `/es/work/case-studies/[slug]`. Each detail
page must have a unique localized title and meta description, canonical,
EN/FR/ES/x-default hreflang alternates, localized Open Graph metadata, one H1,
semantic H2/H3 structure, and localized BreadcrumbList schema. The sitemap must
include all 30 localized case-study detail routes while preserving existing
routes.

Rules:
- No `Review` or `AggregateRating` schema.
- No fake `Dataset`, `CaseStudy`, `Person`, `VideoObject`, awards, logos,
  client `Organization`, or performance-claim schema.
- Sample audit pages are illustrative public deliverables and must include
  visible disclosure text.
- Named case studies render only through `getPublicCaseStudies()`.
- Client results render only through `getVerifiedPublicResults()`.
- Empty registries must render standards and evidence requirements, not
  "placeholder", "coming soon", anonymous success stories, or fake metrics.
- Do not turn narrative app ratings, review context, or awards into Review,
  AggregateRating, endorsement, or unsupported Organization schema.

## Lead Funnel SEO (Task 9)

Indexable lead funnel pages are `/free-seo-audit`, `/book-a-call`, and
`/contact` across EN/FR/ES. Each page uses localized metadata, canonical URLs,
hreflang alternates, Open Graph metadata, one H1, and BreadcrumbList schema.

`/thank-you` is `noindex` and excluded from sitemap. It must not include PII,
submission IDs, conversion values, or fake ContactPoint data in metadata.

Do not add fake Review, AggregateRating, ContactPoint, opening-hours, physical
location, appointment, or booking schema to the lead funnel.
## Task 10: Insights SEO Rules

Insights articles use localized metadata, canonical URLs, hreflang alternates for `en`, `fr`, `es`, and `x-default`, Article JSON-LD, BreadcrumbList JSON-LD, and FAQPage JSON-LD only when visible FAQ blocks exist.

Do not add fake review, AggregateRating, Person, HowTo, award, or rating schema. Do not publish fake dates, invented statistics, invented expert quotes, invented rankings, or unsupported client examples.

Source-backed factual claims use the source model in `src/content/insights.types.ts`. Taskcover pages may be internal links, but they are not independent evidence sources. Publish QA intentionally rejects keyword density, arbitrary SEO scores, readability scores, and ranking predictions as publication gates.

Admin and preview routes are always `noindex`, are excluded from sitemap generation, and must not emit public canonical, Open Graph, or schema metadata. Draft preview routes require authentication and no-store behavior.
## Production Canonical Host

The production canonical origin is `https://taskcover.com`.

- `www.taskcover.com` must redirect permanently to `taskcover.com`.
- Metadata, Open Graph URLs, sitemap entries, robots sitemap URL, and hreflang URLs use the canonical origin.
- Local, preview, staging, and workers.dev hosts must not be redirected to production.
- Admin and thank-you pages stay noindex and are excluded from the sitemap.

## Task 12 Trust, Legal, and Visitor Readiness

About, Methodology, How We Work, Privacy Policy, Cookie Policy, Terms,
Accessibility, Data Request, and Cookie Preferences are indexable across
EN/FR/ES. They emit canonical URLs, hreflang alternates, Open Graph metadata,
one H1, and BreadcrumbList schema.

Organization schema now includes verified public company details only:
Taskcover Agency, Stoa Global Corporation, taskcover.com, business@taskcover.com,
+1 (802) 802-9299, and 169 Madison Avenue, New York, NY 10016, United States.
Do not add founder, founding date, awards, sameAs links, ratings, reviews,
opening hours, or unverified locations.

Legal pages are website-ready drafts for final legal review. Do not claim
attorney-reviewed compliance, GDPR/CCPA compliance as a legal conclusion,
guaranteed SEO/SEM results, certifications, awards, fake testimonials, fake
reviews, or fake social profiles.

## Task 13 Commercial Keyword Ownership

Task 13 adds a qualitative keyword-to-URL map in
`src/content/seo/url-intent-map.ts` and supporting docs under
`docs/COMMERCIAL_*`, `docs/KEYWORD_TO_URL_MAP.md`,
`docs/CANNIBALIZATION_AUDIT.md`, `docs/INTERNAL_LINKING_ARCHITECTURE.md`, and
`docs/SEM_LANDING_PAGE_READINESS.md`.

Rules:

- Each commercial keyword family has one primary URL.
- Existing canonical service, industry, and market pages are preferred over new
  pages.
- Insights articles are informational support and must not be rewritten into
  duplicate commercial pages.
- Proof and Work pages support decision-stage evaluation but do not replace
  service pages.
- New SEM landing pages require distinct purpose, consent/tracking readiness,
  localized copy, proof support, and no overlap with organic pages.
- No doorway pages, city pages, fake offices, fake local business schema, fake
  reviews, fake ratings, or ranking guarantees.

## Task 13B Navigation SEO Safety

Task 13B changed global navigation and footer grouping only. It preserves:

- Existing public route inventory.
- Canonical URL generation.
- Hreflang alternates.
- Sitemap inclusion/exclusion rules.
- Keyword-family primary URL ownership.
- Admin, preview, and thank-you exclusions.

The header can expose supporting routes through mega-menu groups, but those
links must not redefine a page's primary keyword ownership. Do not add
root-level duplicate pages such as `/seo-agency`, `/technical-seo-agency`, or
country-name variants outside the existing `/markets/*` structure.

## Task 13C SEO Safety

Task 13C does not alter keyword-to-URL ownership, route slugs, canonical strategy, hreflang, x-default, sitemap behavior, noindex rules, structured data, or metadata strategy. The Client Results and Case Studies changes enrich existing routes only. New proof modules must not invent metrics, rankings, testimonials, or private results.

## Pricing Page SEO

The pricing routes (`/pricing`, `/fr/pricing`, `/es/pricing`) are indexable
decision-stage pages. They use localized metadata, canonical URLs, hreflang
alternates, Open Graph metadata, one H1, BreadcrumbList schema, and FAQPage
schema only because the FAQ is visible.

Do not add Review, AggregateRating, LocalBusiness, fake Offer, or unsafe pricing
schema. Pricing must be described as USD starting points, with final pricing
dependent on market, site complexity, competition, content needs, and execution
speed. Do not guarantee rankings, backlinks, placements, traffic, or revenue.

## About Story SEO

The About routes (`/about`, `/fr/about`, `/es/about`) are indexable company
story pages. They use localized metadata, canonical URLs, hreflang alternates,
Open Graph metadata, one H1, and BreadcrumbList schema.

Do not add Review, AggregateRating, fake award, fake rating, fake social,
LocalBusiness, or unsupported Person schema. Person schema may be considered
only when every field is verified and no social `sameAs`, fake credentials,
awards, alumni, education, or portrait image is invented.

The visible story may reference verified case-study links as methodology
influence, but must not assign those case studies to unsupported company
history years or imply guaranteed SEO outcomes.

## Task 14 Technical SEO Launch Hardening

Before launch, run:

- `npm run seo:check`
- `npm run seo:crawl -- --base-url=http://localhost:3100`

Current launch standards:

- `robots.txt` must include the canonical sitemap URL and must not block public
  JS, CSS, image, or brand assets.
- The sitemap must include only canonical indexable public URLs and exclude
  Admin, API, preview, thank-you, 404/error, draft, and query URLs.
- Pricing tab query variants render but canonicalize to the clean pricing route.
- EN canonicals are unprefixed; FR/ES canonicals use `/fr` and `/es`.
- Hreflang alternates must include `en`, `fr`, `es`, and `x-default`.
- Organization schema uses verified fields only and must not add Review,
  AggregateRating, LocalBusiness, fake social, fake office, or fake rating data.
- British Council and Skyscanner remain hidden while in `permission-review`.

See the Task 14 audit set:

- `docs/TECHNICAL_SEO_LAUNCH_HARDENING.md`
- `docs/TECHNICAL_SEO_DEFECT_LOG.md`
- `docs/INDEXABILITY_AUDIT.md`
- `docs/ROBOTS_AUDIT.md`
- `docs/SITEMAP_AUDIT.md`
- `docs/CANONICAL_AUDIT.md`
- `docs/HREFLANG_AUDIT.md`
- `docs/METADATA_AUDIT.md`
- `docs/INTERNAL_LINK_AUDIT.md`
- `docs/SCHEMA_AUDIT.md`
- `docs/IMAGE_SEO_AUDIT.md`
- `docs/LOCALIZATION_TECHNICAL_AUDIT.md`
- `docs/ROUTE_STATUS_AUDIT.md`
- `docs/OPEN_GRAPH_AUDIT.md`

## Task 15 Performance And Accessibility Preservation

- Task 15 launch QA must not change canonical, hreflang, sitemap, robots, or
  Task 13 keyword-to-URL ownership unless fixing a verified bug.
- Pricing query URLs stay excluded from sitemap and canonicalize to the clean
  localized `/pricing` route.
- Public bundle hardening must not remove indexable text, proof context,
  localized copy, or internal links just to improve lab scores.
- Media optimization must preserve meaningful alt text and keep decorative
  images hidden from assistive technology.
- Technical SEO checks remain `npm run seo:check` and rendered
  `npm run seo:crawl -- --base-url=http://localhost:3100`.

## Task 16 Analytics And SEM Measurement Preservation

- Consent, GTM, GA4, Google Ads, and attribution work must not add or remove
  indexable public routes.
- Admin, API, preview, thank-you, 404/error, draft, and query routes remain
  excluded from sitemap rules where already excluded.
- Thank-you pages remain `noindex` and excluded from the sitemap.
- Pricing query variants continue to canonicalize to the clean localized
  `/pricing` route.
- Event names and UTM conventions do not redefine keyword-to-URL ownership.
- No schema is added for fake offers, reviews, ratings, local offices,
  guarantees, or unsupported conversion claims.
- SEM launch requires legal/provider review and must not be described as GDPR,
  CCPA, or other legal compliance certification.
