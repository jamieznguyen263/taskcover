# Taskcover Agency — Site Architecture

This is the planned sitemap. Not all routes are built yet — Phase 1 (this
commit) ships the homepage and the foundation. Routes marked **(planned)** do
not yet have pages and currently rely on the global layout (header/footer).

## Top-level

- `/` — Homepage ✅ (built)

## Services ✅ (built)

- `/services` ✅
- `/services/seo-agency` ✅
- `/services/technical-seo` ✅
- `/services/ai-search-optimization` ✅
- `/services/content-marketing` ✅
- `/services/digital-pr-link-building` ✅
- `/services/local-seo` ✅
- `/services/ecommerce-seo` ✅
- `/services/international-seo` ✅
- `/services/ppc-management` ✅
- `/services/seo-mentor-service` ✅
- `/services/seo-audit` ✅

> The hub (`/services`) uses a service constellation + layered capability
> stack + decision guide. Each detail page uses the shared
> `ServicePageTemplate` with 10 distinct sections and a service-specific
> visual. See `docs/HOMEPAGE_VIBE_STANDARD.md` §18.
>
> **Data depth (Task 3C):** All 11 service pages now carry enriched,
> service-specific data across problem, approach, deliverables (with `tag`
> chips), use cases (with `signal` triggers), process (with `timing`), and
> outcomes. Every page also has a service-specific CTA preview panel.
> Pages are ready for i18n.

## Industries `(planned)`

- `/industries`
- `/industries/travel-seo`
- `/industries/education-seo`
- `/industries/healthcare-seo`
- `/industries/legal-immigration-seo`
- `/industries/saas-seo`
- `/industries/ecommerce-seo`
- `/industries/franchise-local-seo`

## Markets `(planned)`

- `/markets`
- `/markets/usa-seo-agency`
- `/markets/canada-seo-agency`
- `/markets/australia-seo-agency`

> Each market page **must** have unique local context. Do not duplicate copy.

## Work / proof `(planned)`

- `/work`
- `/work/case-studies`
- `/work/client-results`
- `/work/video-testimonials`
- `/proof`
- `/proof/brand-experience`
- `/proof/press`
- `/proof/client-reviews`
- `/proof/media-features`
- `/proof/spokesperson`

## Methodology & technology `(planned)`

- `/methodology`
- `/technology`

## Insights `(planned)`

- `/insights` (index)
- `/insights/[slug]` (article detail with `Article` schema)

## Conversion `(planned)`

- `/free-seo-audit`
- `/book-a-call`
- `/contact`
- `/thank-you`

## Notes

- Use Next.js App Router conventions: `app/<route>/page.tsx`.
- Use `buildMetadata()` from `src/lib/seo.ts` for canonical + OG metadata.
- Add `BreadcrumbList` schema via `breadcrumbSchema()` where appropriate.
- Internal links from the footer (`src/components/marketing/layout/site-footer.tsx`)
  point to the planned routes above so navigation is consistent from day one.