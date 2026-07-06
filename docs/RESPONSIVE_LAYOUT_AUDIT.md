# Responsive Layout Audit

## Summary

Task 15 adds automated source checks for the known high-risk responsive areas and a rendered CDP overflow sweep across the launch viewport set.

## Covered By `npm run visual:check`

- Global body overflow guard.
- Header logo sizing and mobile menu containment.
- Footer responsive column grid.
- Pricing tab rail overflow behavior.
- Pricing proof horizontal rail containment.
- Insights article table containment.
- Insights article min-width and sticky rail layout guards.
- Sample audits tab/table containment.
- Client logo aspect-ratio preservation.
- Homepage logo strip reduced-motion/static mobile layout.

## Viewport Checklist

- 1440px: desktop nav, hero, radial map, pricing comparison, article side rails.
- 1280px: header spacing, proof rails, case-study cards.
- 1024px: tablet header/menu transition, pricing and insight templates.
- 768px: tablet/mobile menu, form fields, sample audit tabs.
- 390px: mobile header logo, pricing rail, footer groups, FR/ES long labels.

## Rendered Results

- Local production server: `http://127.0.0.1:3100`.
- CDP route/viewport sweep: 32 representative routes x 5 viewport widths = 160 checks.
- Result: 0 document-level horizontal overflow failures after the Spanish 1024px header fix.
- Rendered launch QA: 221 checks passed, 0 failed.
- Rendered SEO crawl: 256 pages, 0 critical, 0 high.

## Fixes

- Moved full desktop header navigation from `lg` to `xl` so localized labels do not overflow at 1024px.
- Kept the mobile/tablet accordion menu available through 1024px.
- Scoped service SVG gradient IDs per visual to remove duplicate rendered IDs.

## Deferred

Repeat screenshot review in staging. Local screenshots were saved outside the repo in `C:\tmp\taskcover-task15-screens` and should not be committed.
