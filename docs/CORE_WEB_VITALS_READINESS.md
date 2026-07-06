# Core Web Vitals Readiness

Task 15 readiness summary. This is a lab/source readiness document, not field data.

## Targets

- LCP: 2.5s or better where feasible in lab/staging.
- INP risk: under 200ms where measurable or no obvious long-interaction risk.
- CLS: 0.1 or better.

## Current Readiness

| Metric | Readiness | Notes |
| --- | --- | --- |
| LCP | Ready for staging validation | Homepage hero is text-first, logo/video proof is not a real video load, and critical copy is not lazy-loaded. |
| INP | Low obvious risk | Interactive widgets are scoped, no public chart/editor bundles are loaded, and forms/tabs use simple state. |
| CLS | Ready for staging validation | Logo, case-study, pricing logo, and article cover dimensions/stable containers are in place. |
| TBT / JS cost | Ready for bundle validation | Public client boundaries are checked by `npm run perf:check`; Admin/Tiptap imports are blocked from public components. |

## Local Checks

- `npm run perf:check`: passed, 0 blocking findings.
- `npm run launch:qa`: passed, 38 checks, 0 failures.
- `npm run launch:qa -- --base-url=http://127.0.0.1:3100`: passed, 221 checks, 0 failures.
- CDP responsive sweep: 160 route/viewport combinations, 0 document-level overflow failures.
- `npm run build:cloudflare` and `npm run cf:dry-run`: passed locally; Wrangler dry-run upload estimate was 5417.21 KiB raw / 916.37 KiB gzip.

## Production-Only Checks

- Real LCP/CLS/INP field data after production launch.
- Cloudflare Worker TTFB and cache behavior.
- CDN compression and cache headers for images, scripts, CSS, sitemap, and robots.

## Staging Checks

Run a production build through the Worker/staging path, then collect DevTools or Lighthouse lab values for `/`, `/pricing?tab=mentor`, a case-study detail, an Insights article, and `/free-seo-audit`.
