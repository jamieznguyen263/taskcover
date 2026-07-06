# Public Bundle Audit

## Summary

Task 15 confirms public bundle boundaries are launch-safe at the source level.

## Checks

- Admin editor and Tiptap imports are isolated to `src/components/admin/article-editor.tsx`.
- Public marketing client components do not import Admin modules, database modules, `postgres`, `drizzle-orm`, Cloudinary, `@tiptap/*`, or `recharts`.
- `server-only` remains available for server-side boundaries.
- Client components are present where interactivity is required: menus, language switcher, pricing tabs, filters, forms, radial map, cookie preferences, and homepage interactive visuals.

## Fixes

- Added `npm run perf:check` public import guard.
- Added Vitest coverage for Admin/Tiptap/public-client boundaries.

## Deferred

- Analyze emitted chunk sizes after `npm run build` and Cloudflare build.
- Revisit installed-but-unused heavy dependencies in a later dependency hygiene task if they remain unused after launch.

## Result

`npm run perf:check` passed with no public bundle blocking findings.
