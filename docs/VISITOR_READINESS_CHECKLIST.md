# Visitor Readiness Checklist

Task 12 readiness items:

- Company identity uses Taskcover Agency by Stoa Global Corporation.
- Public address, phone, and email are visible in footer, contact, and legal/trust pages.
- About, Methodology, How We Work, Privacy Policy, Cookie Policy, Terms, Accessibility, Data Request, and Cookie Preferences exist in EN/FR/ES.
- Localized 404 and global error states avoid stack traces and internal details.
- Organization schema uses only verified fields.
- Breadcrumb schema is emitted on new indexable pages.
- Sitemap includes indexable trust/legal pages and excludes Admin, preview, and thank-you pages.
- Data Request uses the existing lead architecture and does not collect government ID or sensitive documents by default.
- Cookie preferences save/reset locally and do not load analytics or advertising scripts.
- Final legal review is still required before launch.

Production deployment, DNS changes, provider secret configuration, and external migrations remain out of scope for Task 12.

## Task 13 Commercial SEO Readiness

- Keyword-family ownership documented.
- URL inventory and cannibalization audit created.
- No doorway, city, swapped-location, or duplicate commercial pages created.
- EN/FR/ES route localization preserved with English slugs.
- Private Admin and thank-you routes excluded from the commercial map.
- Final Task 13 quality gates still need to pass before launch.

## Task 13B UI/IA Readiness

- Header IA now guides visitors through Services, Solutions, Work, Insights,
  and Company instead of exposing old page families as a flat list.
- Mobile navigation now uses accordion groups, Escape close behavior, link-close
  behavior, and localized language labels.
- Footer now keeps company identity, contact details, conversion CTAs, legal,
  accessibility, and data-request paths visible.
- Homepage hero cockpit uses localized illustrative data and one permission
  disclosure.
- Verified case-study proof wording replaces selected-experience brand wording
  in the homepage hero.
- Final legal review, deployment, DNS, provider secrets, analytics, and consent
  tooling remain separate launch tasks.
## Pricing Readiness

- Pricing page is available in EN/FR/ES at `/pricing`, `/fr/pricing`, and
  `/es/pricing`.
- All prices are USD starting points with a visible scope disclaimer.
- Local SEO Starter and SEO Mentor Office Hours are clearly limited entry
  scopes, not full-service execution campaigns.
- Free SEO Audit and Strategy Call remain the primary paths for exact pricing.
- The page states that ad spend, full content writing, development
  implementation, translation production, guaranteed backlinks, and guaranteed
  rankings are not included unless scoped.
- No production deployment, DNS change, tracking script, fake discount, fake
  scarcity, or outcome guarantee is required for pricing readiness.

## About Story Readiness

- About page is available in EN/FR/ES at `/about`, `/fr/about`, and `/es/about`.
- The page explains the confirmed 2017 Southeast Asia white-label origin, 2018
  delivery systems, 2019 Canada/US commercial direction, and today's
  USA/Canada/Australia positioning.
- Leadership is limited to Jamiez Nguyen — Founder & CEO and John Edward — CTO.
- Team image slots render intentional placeholders until real approved portrait
  assets are added at `/team/jamiez-nguyen.webp` and `/team/john-edward.webp`.
- No social links, fake portraits, invented offices, invented awards,
  certifications, guaranteed outcomes, or unsupported case-study dates are
  introduced.
- Canonical, hreflang, sitemap inclusion, metadata, breadcrumbs, accessibility,
  and mobile behavior remain part of final QA.

## Task 14 Technical SEO Readiness

- `robots.txt` exists, returns 200 locally, references the canonical sitemap,
  and excludes Admin, API, preview, and thank-you paths.
- `sitemap.xml` contains 243 canonical localized public URLs and excludes
  private/noindex/query routes.
- `npm run seo:check` and `npm run seo:crawl` are available for repeatable local
  launch checks.
- Rendered crawl found 0 critical/high technical SEO findings.
- DevTools viewport QA covered 1440, 1024, 768, and 390 widths with no document
  horizontal overflow; article tables and mobile TOC remain contained in
  intended scroll regions.
- Production deploy, DNS, production secrets, analytics/tracking, legal review,
  Search Console, and live social preview validation remain separate launch
  checks.

## Task 15 Performance, Accessibility, And Visual Readiness

- `npm run perf:check`, `npm run a11y:check`, `npm run visual:check`, and
  `npm run launch:qa` are available for local launch guardrails.
- Public bundle checks prevent Admin, Tiptap, database, Cloudinary, and chart
  code from being imported by public marketing client components.
- Hero video remains poster/placeholder-first with no default video URL and no
  autoplay.
- Data Request now has custom accessible validation, field-level errors,
  first-error focus, and direct email fallback behavior.
- Header logo dimensions and responsive brand size were adjusted without
  increasing header height.
- Article tables, pricing tabs, sample audit tabs, mobile menu, footer groups,
  and client logos have source-level overflow/aspect-ratio protections.
- Browser viewport QA and Core Web Vitals lab checks still need to be repeated
  against local production/staging output before launch.

## Task 16 Consent And Measurement Readiness

- Localized consent banner exists for EN/FR/ES public routes.
- Cookie Preferences uses the same consent model as the banner.
- Strictly necessary is always on; preferences, analytics, and marketing are
  off by default.
- GTM and Google Ads are environment-driven and disabled when IDs are missing.
- Lead success events require durable backend acceptance.
- UTM/click-id attribution storage requires analytics or marketing consent and
  expires after 60 days.
- Debug panel is development/debug-only and exposes no secrets or PII.
- Production deployment, DNS changes, live ads, and provider activation remain
  manual post-QA steps.
