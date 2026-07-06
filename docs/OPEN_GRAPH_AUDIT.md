# Open Graph Audit

## Verified

- Shared metadata helper emits OG title, description, URL, locale, site name,
  and image for indexable pages.
- Twitter metadata follows the same title/description/image source.
- Pricing, about/trust/legal, service, industry, market, case-study,
  sample-audit, and Insights routes have sensible localized social metadata.
- Insights hub/category metadata now uses the shared helper.

## Deferred

Local checks cannot validate real unfurl cache behavior from LinkedIn, X,
Slack, Facebook, or iMessage. Repeat social preview checks after production
deployment and final OG image approval.

