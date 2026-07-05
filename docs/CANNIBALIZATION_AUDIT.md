# Cannibalization Audit

## Summary

The site has broad commercial coverage, but most overlap is manageable because the current architecture separates service capability, industry application, regional context, proof, informational articles, and conversion paths. No delete or merge action is recommended before launch.

## Issues and Recommendations

| Overlap | Risk | Pages involved | Recommendation | Implemented in Task 13 |
| --- | --- | --- | --- | --- |
| Homepage vs SEO agency | Medium | `/`, `/services/seo-agency` | Homepage owns "search growth agency"; service page owns "SEO agency" and "SEO strategy". Avoid making the homepage a duplicate service page. | Documented in keyword map. |
| Services hub vs service details | Medium | `/services`, `/services/[slug]` | Hub should remain service selection; details own commercial keyword families. | Documented in inventory. |
| SEO audit service vs free audit funnel | Medium | `/services/seo-audit`, `/free-seo-audit` | Service page owns audit services intent; funnel owns conversion. Keep both, link clearly. | Tests cover sitemap and map. |
| Technical SEO service vs audit checklist article | Medium | `/services/technical-seo`, `/insights/technical-seo/technical-seo-audit-checklist-growing-websites` | Article remains informational; service page remains commercial. Add contextual links only. | Documented. |
| AI Search vs GEO terminology | Medium | `/services/ai-search-optimization`, `/insights/ai-search/measure-ai-search-visibility` | Consolidate GEO under AI Search until distinct demand/content depth justifies a page. | Documented, no new page. |
| PPC service vs PPC article | Medium | `/services/ppc-management`, `/insights/ppc-search-intelligence/seo-vs-ppc-search-growth-system` | Service owns paid search management; article supports SEO/PPC decision-making. | Documented. |
| International SEO vs market pages | Medium | `/services/international-seo`, `/markets/*-seo-agency` | Service owns cross-market system; market pages own regional buyer context. | Documented. |
| Local SEO vs franchise-local SEO | Medium | `/services/local-seo`, `/industries/franchise-local-seo` | Service owns capability; industry owns scale/franchise vertical. Avoid city pages. | Documented. |
| eCommerce service vs eCommerce industry | Medium | `/services/ecommerce-seo`, `/industries/ecommerce-seo` | Service owns capability; industry owns vertical problem. Strengthen crosslinks, not duplicates. | Documented. |
| SEO Mentor service vs mentor Insights category | Medium | `/services/seo-mentor-service`, `/insights/seo-mentor` | Service owns paid advisory; category owns learning support. | Documented. |
| Proof pages vs case-study pages | Low | `/proof`, `/work/case-studies`, `/work/client-results` | Proof pages explain standards; case studies show approved narratives; results page defines measurement rules. | Documented. |
| Market-specific SEO pages vs possible city pages | High if created | `/markets/usa-seo-agency`, possible city pages | Do not create city pages or swapped-location pages. | No city pages created. |

## Safe Improvements

- Keep one primary URL per keyword family in `src/content/seo/url-intent-map.ts`.
- Keep private and post-conversion routes out of the commercial map.
- Use service pages as commercial destinations from Insights and proof pages.
- Keep all proof claims evidence-gated.

## Deferred Actions

- Review live search data after launch before creating any additional commercial pages.
- If a new page is proposed later, require distinct intent, proof depth, localized copy, canonical/hreflang readiness, CTA clarity, and non-duplication.
