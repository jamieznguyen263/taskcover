# Commercial SEO Architecture

Task 13 establishes a qualitative commercial SEO architecture for Taskcover before launch. This is not Ahrefs, Semrush, CPC, volume, difficulty, or forecasting research. It is a search-intent and URL ownership map based on the implemented site.

## Principles

- One primary URL owns each commercial keyword family.
- Existing canonical service, industry, market, proof, and funnel pages are strengthened before new pages are considered.
- No doorway pages, city pages, location-name swaps, fake proof, fake ratings, fake offices, or fake local business schema.
- French and Spanish use the same English slugs under `/fr` and `/es`.
- Commercial pages stay indexable only when they have localized metadata, canonical, hreflang, proof path, and CTA path.
- Informational Insights support commercial pages; they do not become duplicate service pages.

## Commercial Architecture

| Layer | Primary role | Representative URLs | Recommendation |
| --- | --- | --- | --- |
| Homepage | Broad search-growth agency positioning | `/` | Keep broad, avoid over-optimizing against `/services/seo-agency`. |
| Services hub | Service selection and SEO services intent | `/services` | Keep as hub, support service-detail pages. |
| Service details | Primary commercial capability pages | `/services/seo-agency`, `/services/technical-seo`, `/services/ai-search-optimization`, `/services/seo-audit` | Keep as canonical commercial URLs. |
| Industry pages | Vertical commercial intent | `/industries/travel-seo`, `/industries/education-seo`, `/industries/saas-seo` | Keep industry-specific, avoid duplicate "agency" clones. |
| Market pages | Regional commercial intent | `/markets/usa-seo-agency`, `/markets/canada-seo-agency`, `/markets/australia-seo-agency` | Keep regional and non-local-office claims safe. |
| Proof and Work | Decision support and evidence | `/work/case-studies`, `/work/sample-audits`, `/proof` | Keep as proof/support, not primary service pages. |
| Insights | Informational support | `/insights/...` | Support internal links and topical authority, not SEM landing pages. |
| Lead funnel | Conversion | `/free-seo-audit`, `/book-a-call`, `/contact` | Keep as localized conversion routes. |
| Trust/legal | Trust, compliance, no sales intent | `/privacy-policy`, `/cookie-policy`, `/data-request` | Keep informational/trust role. |
| Private/post-conversion | Noindex/excluded | `/admin`, `/thank-you` | Exclude from commercial map and sitemap. |

## New Page Decision

No new public commercial pages were created in Task 13. The proposed root-level pages such as `/seo-agency`, `/technical-seo-agency`, `/ai-search-agency`, `/ppc-management-agency`, `/usa-seo-agency`, and industry-specific agency pages would duplicate already implemented service, market, and industry URLs.

## Implemented Artifacts

- `src/content/seo/url-intent-map.ts` stores the typed URL intent and keyword family map.
- `src/content/seo/url-intent-map.test.ts` enforces key architecture constraints.
- Commercial documentation now explains URL ownership, cannibalization, gaps, internal links, SEM readiness, and launch risks.
