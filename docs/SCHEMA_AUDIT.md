# Schema Audit

## Allowed Schema

- `Organization` in the root layout with verified company fields only.
- `BreadcrumbList` on deeper public pages.
- `Article` on Insights articles.
- `FAQPage` only when FAQ content is visible.

## Verified Organization Fields

- Taskcover Agency
- Stoa Global Corporation
- 169 Madison Avenue, New York, NY 10016, United States
- `business@taskcover.com`
- `+1 (802) 802-9299`

## Safety Checks

The tests and static checker reject unsafe schema patterns for this launch:
Review, AggregateRating, LocalBusiness, fake `sameAs`, fake awards, fake social
profiles, or unsupported person/location claims.

## Result

0 critical/high schema issues remain. No new risky schema was added for Task 14.

