# Performance And Accessibility Launch Checklist

## Ready Locally

- `npm run perf:check`
- `npm run a11y:check`
- `npm run visual:check`
- `npm run launch:qa`
- `npm run launch:qa -- --base-url=http://127.0.0.1:3100`
- Public bundle boundary source checks.
- Image/media dimension and video-placeholder checks.
- Data Request accessible validation fix.
- Header logo branding adjustment.
- 160-check CDP responsive overflow sweep across 32 representative routes and 5 viewport widths.

## Requires Local Production Build

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run build:cloudflare`
- `npm run cf:dry-run`
- `npm run production:check`
- `npm run seo:check`
- `npm run seo:crawl -- --base-url=http://localhost:3100`

## Requires Browser/Rendered QA

- Completed locally with CDP/screenshot tooling for the launch viewport set.
- Repeat in staging after the Cloudflare Worker is deployed.

## Requires Staging

- Worker TTFB and cache headers.
- Cloudflare routing, redirects, robots, sitemap.
- Lead provider unavailable behavior with staging env.
- Turnstile placeholder/real staging keys if configured.

## Requires Production Field Data

- Core Web Vitals field LCP, INP, CLS.
- Search Console indexing.
- Live social unfurl and CDN behavior.

## Task 16 Measurement QA

- Consent banner, Cookie Preferences integration, consent-mode mapping,
  consent-aware GTM loading, typed events, attribution capture, Google Ads
  readiness, and debug panel are implemented.
- Repeat browser QA for banner mobile layout, keyboard access, focus states,
  reject non-essential behavior, customize/save/reset behavior, and dataLayer
  safety before staging.
- GTM and ad scripts remain dormant unless environment IDs and consent gates
  allow them.

## Must Not Happen In Task 15

- Production deploy.
- DNS changes.
- External migrations.
- Production secrets or provider activation.
- Live ads, hardcoded tracking IDs, DNS changes, external migrations, or
  provider activation without a separate approval.
