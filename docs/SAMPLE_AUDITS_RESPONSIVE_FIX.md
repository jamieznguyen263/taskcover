# Sample Audits Responsive Fix

Task 13C fixes the `/work/sample-audits` horizontal clipping issue.

## Fixes Applied

- Hero grid columns now use `minmax(0, ...)` tracks.
- Hero children and preview panels use `min-w-0`.
- The right preview card is contained with `overflow-hidden`.
- The tab strip remains a contained horizontal scroll area with `overflow-x-auto` and `scroll-px-2`.
- Tab widths are constrained responsively instead of forcing the page wider.
- Preview answer cards and lower grids use min-width containment.
- Global CSS prevents body-level horizontal scrolling with `overflow-x: clip` and a hidden fallback.

## QA Targets

Review widths: 1440, 1280, 1024, 768, and 390 px.

Expected behavior: no clipped right edge, no hidden CTA, no body horizontal scrollbar, and contained horizontal scrolling only inside tab/table areas.
