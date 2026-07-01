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
- Organization schema omits phone/address/founder/awards until verified.
- For `Article` and `VideoObject`, only include fields backed by real data.

## 4. Metadata helpers

`src/lib/seo.ts` provides:

- `buildMetadata({ title, description, path, ogImage, noIndex, keywords })`
  → returns a `Metadata` object with canonical, OG, and Twitter fields.
- `organizationSchema()` → safe Organization JSON-LD.
- `breadcrumbSchema(items)` → BreadcrumbList JSON-LD.
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

## 7. Local market context (USA / Canada / Australia)

Each market page must include:

- Unique intro describing that market’s search behavior and trust signals.
- Region-specific examples (e.g. bilingual demand in Canada, metro concentration
  in Australia, multi-state dynamics in the USA).
- Localized internal links to relevant services and industries.
- A clear call to action tailored to that market.