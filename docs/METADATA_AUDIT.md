# Metadata Audit

## Verified

- Indexable pages include title, meta description, canonical, hreflang, Open
  Graph title/description/url/image, and Twitter metadata where the project
  helper is used.
- Rendered crawl checked one H1 on indexable pages.
- Service, industry, market, case-study, sample-audit, pricing, about, legal,
  and lead-funnel pages keep localized metadata through content accessors.
- Insights hub/category routes now use the shared metadata helper.

## Fixed

- Insights hub and category routes had simpler metadata than the rest of the
  site. They now emit shared canonical, hreflang, OG, and Twitter fields.
- Homepage FR/ES market CTA UI label no longer renders hardcoded English.

## Deferred

Production social preview validation must be repeated against deployed URLs and
the final branded OG asset before public launch.

