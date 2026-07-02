# Taskcover Agency — Site Architecture

This is the planned sitemap. Not all routes are built yet — Phase 1 (this
commit) ships the homepage and the foundation. Routes marked **(planned)** do
not yet have pages and currently rely on the global layout (header/footer).

## i18n (Task 4A) ✅

The site supports three locales with English as the default (unprefixed):

- `en` — English (default) — `/`, `/services`, `/services/[slug]`
- `fr` — French — `/fr`, `/fr/services`, `/fr/services/[slug]`
- `es` — Spanish — `/es`, `/es/services`, `/es/services/[slug]`

Route prefix is the source of truth for the active locale. See
`docs/I18N_STRATEGY.md`.

- `app/page.tsx` — English homepage
- `app/[locale]/page.tsx` — French/Spanish homepage (generates `fr`, `es`)
- `app/services/page.tsx` — English services hub
- `app/[locale]/services/page.tsx` — French/Spanish services hub
- `app/services/[slug]/page.tsx` — English service detail
- `app/[locale]/services/[slug]/page.tsx` — French/Spanish service detail
- `app/sitemap.ts` — emits all localized routes with hreflang alternates

## Top-level

- `/` — Homepage ✅ (built)
- `/fr` — French homepage ✅ (built)
- `/es` — Spanish homepage ✅ (built)

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

Localized equivalents (`/fr/services/*`, `/es/services/*`) are also built for
all 11 services. Slugs are shared (English) for now; localized slugs are a
future enhancement (see `I18N_STRATEGY.md` §11).

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

## Industries ✅ (built)

- `/industries` ✅
- `/industries/travel-seo` ✅
- `/industries/education-seo` ✅
- `/industries/healthcare-seo` ✅
- `/industries/legal-immigration-seo` ✅
- `/industries/saas-seo` ✅
- `/industries/ecommerce-seo` ✅
- `/industries/franchise-local-seo` ✅

Localized equivalents (`/fr/industries/*`, `/es/industries/*`) are also built for
all 7 industries. Slugs are shared (English) for now; localized slugs are a
future enhancement (see `I18N_STRATEGY.md` §11).

> The hub (`/industries`) uses a sector signal dashboard + interactive sector
> rail + comparison matrix + service bundle rails. Each detail page uses the
> shared `IndustryPageTemplate` with 9 distinct sections and an
> industry-specific visual. Travel and Education are flagged as priority
> sectors with relevant team/partner experience context. See
> `docs/HOMEPAGE_VIBE_STANDARD.md` §19.
>
> **Credibility rules:** No fabricated metrics, testimonials, case-study
> numbers, or fake proof. Brand names (Agoda, Skyscanner, British Council) are
> referenced only as selected team/partner experience context — never as
> endorsement.

## Markets ✅ (built)

- `/markets` ✅
- `/markets/usa-seo-agency` ✅
- `/markets/canada-seo-agency` ✅
- `/markets/australia-seo-agency` ✅

Localized equivalents (`/fr/markets/*`, `/es/markets/*`) are also built for
all 3 markets. Slugs are shared (English) for now; localized slugs are a
future enhancement (see `I18N_STRATEGY.md` §11).

> The hub (`/markets`) uses a global market command dashboard + interactive
> regional selector + comparison matrix + stacked regional growth playbooks.
> Each detail page uses the shared `MarketPageTemplate` with 11 distinct
> sections and a market-specific regional intelligence visual. See
> `docs/HOMEPAGE_VIBE_STANDARD.md` §20.
>
> **Market page adaptation rules:**
> - Market pages **must** differentiate regional search behavior, trust
>   signals, local/national opportunities, PPC demand capture, and AI search
>   readiness — never duplicate content with the country name swapped
>   (doorway-page behavior).
> - Market page two-column sections **must** include meaningful secondary
>   panels (fit summary, leverage panel, angle cards) to avoid empty visual
>   space beside section headings.
>
> **Credibility rules:** No fabricated metrics, testimonials, case-study
> numbers, awards, or fake proof. Taskcover is positioned as serving clients
> in USA, Canada, and Australia — not necessarily headquartered there. Safe
> wording only: "Selected team and partner experience across global brands,
> campaigns, and search programs."

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
- Use `buildMetadata({ path, locale })` from `src/lib/seo.ts` for canonical,
  OG, Twitter, and hreflang alternates. The helper localizes the path.
- Add `BreadcrumbList` schema via `breadcrumbSchema(items, locale)` where
  appropriate — it localizes both labels' paths.
- Content is accessed via `src/lib/content.ts` accessors
  (`getHomeContent`, `getServicesContent`, `getServiceBySlug`, etc.), never
  via raw imports of locale files.
- The header/footer derive locale from the route prefix via `useLocale()`.
- The language switcher preserves the equivalent page path across locales.
- Internal links from the footer (`src/components/marketing/layout/site-footer.tsx`)
  are localized automatically for the active locale.
- See `docs/I18N_STRATEGY.md` for the full multilingual strategy.
