# Sitemap Audit

`src/app/sitemap.ts` emits localized canonical routes with hreflang alternates.

## Included

- EN, FR, ES homepage.
- Services hub and 11 service detail routes.
- Industries hub and 7 industry detail routes.
- Markets hub and 3 market detail routes.
- Proof hub and 5 proof detail routes.
- Work hub, case-study hub/detail, sample-audit hub/detail, search frameworks,
  and client results.
- Insights hub, 7 category routes, and published article routes.
- Pricing, free SEO audit, book-a-call, contact.
- About, methodology, how-we-work, and legal/trust pages.

## Excluded

- Admin, API, preview, thank-you, 404/error pages.
- Pricing tab query URLs.
- Draft/scheduled/unpublished Insights content.
- Non-canonical duplicates.

## Result

`npm run seo:check` validates 243 sitemap URLs with no duplicate, private, API,
preview, thank-you, or query URLs. Rendered crawl verified `/sitemap.xml`
returns 200 locally.

