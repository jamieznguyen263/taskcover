# Taskcover Agency — i18n Strategy

This document governs multilingual support for the site. It is the source of
truth for supported languages, URL strategy, routing, content files, fallback
policy, SEO/hreflang, and the language switcher.

## 1. Supported languages

| Code   | Language  | Display label | HTML lang | OG locale |
|--------|-----------|---------------|-----------|-----------|
| `en`   | English   | English       | `en`      | `en_US`   |
| `fr`   | French    | Français      | `fr`      | `fr_FR`   |
| `es`   | Spanish   | Español       | `es`      | `es_ES`   |

English is the **default locale**.

## 2. URL strategy

- **English (default) is unprefixed.**
  - `/` — English homepage
  - `/services` — English services hub
  - `/services/technical-seo` — English service detail
- **French uses `/fr`.**
  - `/fr` — French homepage
  - `/fr/services` — French services hub
  - `/fr/services/technical-seo` — French service detail
- **Spanish uses `/es`.**
  - `/es` — Spanish homepage
  - `/es/services` — Spanish services hub
  - `/es/services/technical-seo` — Spanish service detail

The route prefix is the **single source of truth** for the active locale.
The absence of `/fr` or `/es` resolves to English.

## 3. Slug strategy (Task 4A)

- Slugs are **not localized** yet.
- All locales share the English slugs (e.g. `/fr/services/technical-seo`).
- Localized URL slugs (e.g. `/fr/services/seo-technique`) are a **future**
  enhancement and are noted in §11.

## 4. Language switcher rules

The language switcher is available in:
- Desktop header (compact dropdown)
- Mobile menu (stacked list)
- Footer

Behavior:
1. Switching language **preserves the equivalent page path**.
   - `/services/technical-seo` → `/fr/services/technical-seo`
   - `/fr/services/technical-seo` → `/es/services/technical-seo`
   - `/es/services/technical-seo` → `/services/technical-seo`
2. The active language is visibly selected (checkmark + highlighted row).
3. English links to the unprefixed path; fr/es link to the prefixed path.
4. The switcher derives locale from `usePathname()` (route prefix) — never
   from a stale cookie.
5. If the equivalent page does not exist, it falls back to the localized
   homepage (`/`, `/fr`, or `/es`).

## 5. No stale cookie bug

- The app does **not** set a locale cookie that overrides the route.
- A cookie/localStorage value may optionally remember a *preference* for
  future neutral navigation (e.g. the logo link), but it **must never**
  override an explicit route prefix.
- The active locale is always derived from the URL.

## 6. Content file structure

```
src/content/
  en/
    site.ts        # nav, CTAs, footer, common UI strings (English)
    home.ts        # homepage content (English)
    services.ts    # services hub + per-service short fields (English)
    proof.ts       # proof hub + detail page content (English)
    work.ts        # work hub, channels, and sample deliverables (English)
  fr/
    site.ts        # French
    home.ts        # French
    services.ts    # French
    proof.ts       # French
    work.ts        # French
  es/
    site.ts        # Spanish
    home.ts        # Spanish
    services.ts    # Spanish
    proof.ts       # Spanish
    work.ts        # Spanish
  home.types.ts    # shared HomeContent type
  services.types.ts# shared ServicesContent type
  proof.types.ts   # shared proof and evidence record types
  work.types.ts    # shared work, sample, and result record types
```

Content accessors live in `src/lib/content.ts`:
- `getSiteContent(locale)` / `getLocalizedSite(locale)`
- `getHomeContent(locale)`
- `getServicesContent(locale)`
- `getServiceBySlug(slug, locale)` — merged Service (localized hero + English deep body)
- `getServiceSlugs()` — shared slugs
- `getServices(locale)` — all services merged for a locale
- `getProofContent(locale)`
- `getProofPageBySlug(slug, locale)`
- `getProofPageSlugs()`
- public-only proof registry helpers
- `getWorkContent(locale)`
- `getWorkPageContent(slug, locale)`
- `getSampleAuditBySlug(slug, locale)`
- `getSampleAuditSlugs()`
- public-only Work registry helpers

Components and routes must use these accessors, not raw content imports.

## 7. Fallback policy

For Task 4A, the following fields are **fully translated** in all locales:
- Site UI: nav labels, CTA labels, footer headings/links/footnote
- Homepage: hero, section eyebrows/titles/descriptions, FAQ, final CTA, audit block
- Services: hub hero/positioning/description, connect + which-service sections,
  per-service `title`, `shortLabel`, `h1`, `positioning`, `subheadline`,
  `summary`, `outcomePromise`, `metaTitle`, `metaDescription`
- Proof: hub content, all 5 detail pages, proof/disclosure UI labels,
  evidence-policy empty states, private-reference wording, CTAs, metadata,
  and breadcrumb labels
- Work: hub content, all 4 channel pages, all 8 sample deliverables,
  illustrative disclosures, case-study/result standards, CTAs, metadata,
  and breadcrumb labels

The following **falls back to English** (canonical source in `src/data/`)
and is documented as acceptable in Task 4A:
- Homepage deep arrays: operating-system steps, growth plays, services bento
  cards, industries, markets, methodology phases, technology modules, media
  commentary, video proof, comparison rows, brand experience strip
- Service deep body: problem, approach, deliverables, use cases, process,
  outcomes, FAQs

No broken/`undefined` fields are shown — fallback is controlled and silent.

## 8. SEO / hreflang rules

- Each page emits a **canonical URL** for its locale via `buildMetadata()`.
- Each page emits **hreflang alternates** (`alternates.languages`):
  - `en` → unprefixed URL
  - `fr` → `/fr` URL
  - `es` → `/es` URL
  - `x-default` → English (default) URL
- Open Graph `locale` is localized (`en_US`, `fr_FR`, `es_ES`).
- BreadcrumbList JSON-LD uses **localized paths and localized labels**.
- FAQPage JSON-LD uses localized FAQ content where translated (homepage FAQ
  is fully translated; service FAQs fall back to English in 4A).
- Organization schema remains locale-neutral (global, in root layout).

Examples:
```
/services/technical-seo:
  en          -> /services/technical-seo
  fr          -> /fr/services/technical-seo
  es          -> /es/services/technical-seo
  x-default   -> /services/technical-seo
```

## 9. Sitemap rules

`src/app/sitemap.ts` emits `/sitemap.xml` including:
- Homepage en/fr/es
- Services hub en/fr/es
- All 11 service detail pages en/fr/es
- Industries hub and all 7 industry detail pages en/fr/es
- Markets hub and all 3 market detail pages en/fr/es
- Proof hub and all 5 proof detail pages en/fr/es
- Work hub, all 4 Work channel pages, all 10 case-study detail pages, and all
  8 sample-audit detail pages en/fr/es

Each entry includes hreflang alternate references.

## 10. Routing implementation

- English routes stay at `app/page.tsx`, `app/services/page.tsx`,
  `app/services/[slug]/page.tsx` (unprefixed).
- French/Spanish routes live under `app/[locale]/`:
  - `app/[locale]/page.tsx`
  - `app/[locale]/services/page.tsx`
  - `app/[locale]/services/[slug]/page.tsx`
  - `app/[locale]/proof/page.tsx`
  - `app/[locale]/proof/[slug]/page.tsx`
  - `app/[locale]/work/page.tsx`
  - `app/[locale]/work/*/page.tsx`
  - `app/[locale]/work/case-studies/[slug]/page.tsx`
- `[locale]` only generates `fr` and `es` via `generateStaticParams`.
- All routes are statically generated (SSG) at build time.

## 11. Future slug localization note

Localized URL slugs are **not** implemented in Task 4A. When added:
- Each service will need a localized slug per locale.
- `getServiceSlugs(locale)` and `generateStaticParams` must return
  locale-specific slugs.
- `localizePath` must map base path → localized slug path.
- Internal links, sitemap, and hreflang must use localized slugs.

Until then, English slugs are shared across all locales.

Task 8B follows this rule for case-study slugs:

- `/work/case-studies/[slug]`
- `/fr/work/case-studies/[slug]`
- `/es/work/case-studies/[slug]`

The page copy, metadata, filters, gallery labels, breadcrumbs, and CTAs are
localized in EN/FR/ES while slugs remain English.

## 12. Translation QA checklist

- [ ] `/` renders English hero headline + nav + footer in English.
- [ ] `/fr` renders French hero headline + nav + footer in French.
- [ ] `/es` renders Spanish hero headline + nav + footer in Spanish.
- [ ] Language switcher changes the **full page content**, not only header/footer.
- [ ] Switching from `/services/technical-seo` to French navigates to
      `/fr/services/technical-seo` (equivalent path preserved).
- [ ] Switching back to English navigates to `/services/technical-seo` (unprefixed).
- [ ] Mobile language switcher works and preserves the page path.
- [ ] No hydration errors or `undefined` rendered strings.
- [ ] `<link rel="alternate" hreflang="...">` present for en/fr/es/x-default.
- [ ] Canonical URL matches the current locale path.
- [ ] Sitemap includes all localized routes.
- [ ] No horizontal overflow from longer French/Spanish nav labels.
- [ ] Service page hero title changes language when locale changes.

## 13. Lead Funnel Localization (Task 9)

Lead funnel slugs remain English across locales:

- `/free-seo-audit`, `/fr/free-seo-audit`, `/es/free-seo-audit`
- `/book-a-call`, `/fr/book-a-call`, `/es/book-a-call`
- `/contact`, `/fr/contact`, `/es/contact`
- `/thank-you`, `/fr/thank-you`, `/es/thank-you`

Language switching preserves safe funnel query values only, including
`intent=media`, `intent=private-reference`, `intent=partnership`, and safe
thank-you `type` values. Lead content, field labels, validation messages,
fallbacks, and thank-you states live in `src/content/*/leads.ts`.
## Task 10: Insights Localization

Insights content is complete in English, French, and Spanish. English remains unprefixed; French and Spanish use `/fr` and `/es`. Category and article slugs remain English for this phase so language switching can preserve equivalent article and category paths.

Localized content includes article bodies, metadata, breadcrumbs, category labels, filter UI, dates, reading time, source labels, CTA labels, author descriptions, and FAQ schema text. Public routes must not fall back to English for visible French or Spanish Insights UI.

Admin UI remains English-only in Task 10B, but the content model requires complete EN/FR/ES article localizations before approval, scheduling, or publishing.
## Production Integration Locales

Lead confirmation emails and thank-you flows must remain localized for EN/FR/ES.

- English remains unprefixed.
- French uses `/fr`.
- Spanish uses `/es`.
- Resend visitor confirmations use localized copy.
- Cal.com CTA display is localized by the page context, but the configured booking URL must not carry PII.

## Trust and Legal Localization (Task 12)

The following routes are localized in English, French, and Spanish while keeping
English slugs: `/about`, `/methodology`, `/how-we-work`, `/privacy-policy`,
`/cookie-policy`, `/terms`, `/accessibility`, `/data-request`, and
`/cookie-preferences`.

The pages use `src/content/trust.ts` and shared trust/legal page components.
Language switching preserves equivalent paths across all three locales.

## Commercial SEO Localization (Task 13)

Task 13 commercial SEO mapping keeps English slugs across locales and maps every
commercial URL family to EN/FR/ES availability. Public-facing changes must
localize headings, metadata, CTAs, labels, link text, descriptions, and
breadcrumb labels. The typed commercial route helper in
`src/content/seo/url-intent-map.ts` uses `localizePath()` so future QA can verify
English, French, and Spanish route forms without creating localized slug
variants.

## Global Navigation and Dashboard Localization (Task 13B)

Task 13B requires localized public UI for:

- Top-level header labels.
- Desktop mega-menu group titles, descriptions, links, chips, and contextual
  CTAs.
- Mobile accordion labels and language labels.
- Footer group titles and link labels.
- Homepage Search Growth Cockpit title, signals, opportunity map, entity
  rows, sprint queue, conversion path, and illustrative disclosure.

`getLocalizedSite(locale)` localizes nested `megaMenu` links as well as
header, footer, and CTA links. English remains unprefixed; French and Spanish
use `/fr` and `/es` with English slugs.

No new public UI introduced in Task 13B may render hardcoded English on `/fr`
or `/es`.

## Task 13C Localization Additions

The video placeholder, homepage logo alt text, radial search-surface map, case-study library filters, proof module labels, Client Results modules, and Insights article rail labels are all locale-owned in EN/FR/ES content files. English slugs remain unchanged for `/fr` and `/es` routes.
