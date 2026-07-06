# Performance Audit

Task 15 performance review for launch hardening.

## Scope

Reviewed representative public routes and templates: homepage, pricing, services, industries, markets, work/proof, case studies, client results, sample audits, Insights, lead forms, trust/legal pages, localized FR/ES pages, and 404.

The local static page count remains 264 from Task 14. The sitemap inventory remains 243 canonical localized public URLs. The new Task 15 source inventory covers 279 localized route variants for QA sampling, including query and non-sitemap smoke routes.

## Findings

- Public client components are limited to interactive surfaces: navigation, language switching, pricing tabs, forms, radial map, filters, accordions, cookie preferences, and homepage interactive modules.
- `@tiptap` imports are isolated to Admin editor code.
- No public route imports `recharts`.
- Homepage video is poster/placeholder first; no real or fake video URL is configured by default.
- Future hero video loads only after user action and uses `preload="none"`.
- Logo assets have registry dimensions and stable aspect-ratio containers.
- Article tables, pricing comparisons, sample audit tables, and mobile rails use explicit overflow containers.
- The header logo now has intrinsic image dimensions and a slightly stronger responsive width.
- Rendered local QA passed with 221 checks and 0 failures.
- CDP responsive overflow sweep passed 160 route/viewport checks across 1440px, 1280px, 1024px, 768px, and 390px.

## Fixes Applied

- Added `npm run perf:check` through `scripts/launch-qa.ts`.
- Added public bundle, media, reduced-motion, and route-inventory checks.
- Added intrinsic dimensions and async decoding to header/footer logo images.
- Added dimensions/lazy decoding to pricing proof logos and Insights cover image.
- Moved full desktop navigation to the `xl` breakpoint to avoid localized tablet header overflow at 1024px.
- Scoped service SVG IDs per visual to remove rendered duplicate-ID risk.
- Added Vitest guardrails in `src/lib/launch-qa-readiness.test.ts`.

## Deferred

- Do not claim production field Core Web Vitals until production has traffic.
- Lighthouse or DevTools trace values must be collected against staging/production-like Workers output.
- CDN cache headers and Cloudflare edge latency need deployed Worker verification.

## Task 16 Notes

Analytics/consent work should add measurement without changing public rendering, causing layout shift, or loading tracking scripts before consent where required.
