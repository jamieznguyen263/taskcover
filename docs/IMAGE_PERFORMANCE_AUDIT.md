# Image And Media Performance Audit

## Summary

Task 15 image/media pass focused on layout stability, safe loading, and proof asset integrity.

## Findings

- Homepage video card has no configured real/fake video URL by default.
- Future video rendering is interaction-gated and uses `preload="none"`.
- Client logo assets are registry-backed with width, height, local path, alt text, and permission status.
- Permission-review brands remain hidden from public usage.
- Case-study detail images use `next/image` with width/height.
- Client logo tiles use a fixed aspect ratio and `object-contain`.
- Insights article cover image uses the 1200x630 OG SVG dimensions.
- Header logo sizing was visually checked at desktop and mobile widths.
- Service decorative SVG gradients now use per-visual IDs so repeated inline SVGs remain valid HTML.

## Fixes Applied

- Header and footer Taskcover logo images now include intrinsic dimensions.
- Pricing proof logo images now include registry dimensions, lazy loading, and async decoding.
- Insights article cover image now includes width/height, lazy loading, and async decoding.
- Header full navigation now starts at `xl`, preventing localized tablet header crowding around the language switcher and CTA.
- Added `npm run perf:check` and Vitest guardrails for media defaults.

## Deferred

- No new video files were added.
- No stock media or fake video was introduced.
- If approved real video assets are provided later, add captions/transcripts and confirm no eager video download before interaction.
