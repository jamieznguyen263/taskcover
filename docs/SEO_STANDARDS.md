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
