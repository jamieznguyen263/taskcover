# Motion And Reduced-Motion Audit

## Summary

Task 15 confirms decorative motion is guarded by global CSS and source checks.

## Findings

- Global `prefers-reduced-motion: reduce` disables animations/transitions and removes transform hover lifts.
- Public components importing `motion/react` call `useReducedMotion`.
- Homepage radial map, dashboard modules, market/industry selectors, and motion panels have reduced-motion paths.
- Homepage logo strip renders a static grid when reduced motion is requested.
- Video placeholder does not require motion to understand or use.

## Fixes

- Added `npm run perf:check` guard requiring motion components to include reduced-motion handling.
- Added `npm run visual:check` guard for global reduced-motion CSS.

## Remaining Manual Checks

- Browser test with reduced motion enabled at 390px and 1440px.
- Confirm no motion causes layout shift or hides controls.
