# Technical SEO Launch Hardening

Task 14 performed a local technical SEO audit before production launch. No
production deploy, DNS change, production secret change, tracking script,
cookie banner, database migration, or new commercial page was added.

## Scope

- Crawlability and route status for public, private, noindex, query, and 404
  routes.
- Indexability, robots rules, sitemap membership, canonical URLs, hreflang
  alternates, metadata, H1 count, Open Graph, JSON-LD, internal links, image
  paths, and locale consistency.
- EN, FR, and ES route families with English slugs preserved.
- Rendered checks at 1440, 1024, 768, and 390 viewport widths.

## Tooling

- `npm run seo:check` performs static route, robots, sitemap-like inventory,
  schema, logo, and keyword ownership checks.
- `npm run seo:crawl -- --base-url=http://127.0.0.1:3100` crawls a local
  production server, reads `/sitemap.xml` and `/robots.txt`, inspects rendered
  metadata, JSON-LD, links, images, status codes, and indexability.
- Headless Edge DevTools viewport emulation was used for rendered screenshots
  and overflow metrics.

## Local QA Evidence

- `npm run seo:check -- --output .next\seo-check-report.json`: 243 sitemap
  URLs, 0 blocking failures.
- `npm run seo:crawl -- --base-url=http://127.0.0.1:3100 --output=.next\seo-crawl-report.json`:
  rendered crawl with 0 critical and 0 high findings.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`,
  `npm run build:cloudflare`, `npm run cf:dry-run`, and
  `npm run production:check` are the Task 14 launch gates.

## Fixed Issues

- Added a generated `robots.txt` route with private/API/thank-you/preview
  exclusions and canonical sitemap reference.
- Localized homepage CTA/module links on FR/ES pages.
- Localized service-detail related service links.
- Localized the homepage market CTA label.
- Restored shared metadata helper use for Insights hub and category routes.
- Added technical SEO tests and scripts.
- Aligned the static checker with the actual sitemap proof-detail inventory.
- Added mobile min-width containment to article and 404 templates.

## Deferred Or Manual Checks

- Raw static server HTML starts with `lang="en"` in the root layout; the
  pre-paint script and client sync set rendered `/fr` and `/es` to the correct
  language before paint. Keeping root layout static preserves the 264 static
  page build. Treat server-only `lang` verification as a future architecture
  review if static generation requirements change.
- Production-only validation remains: live host redirects, Search Console,
  real social unfurl previews, robots/sitemap fetch from `https://taskcover.com`,
  CDN cache headers, and legal review.

