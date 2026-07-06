# Canonical Audit

Canonical URLs are built through `buildMetadata({ path, locale })` using
`https://taskcover.com`.

## Rules Verified

- EN pages canonicalize to unprefixed English URLs.
- FR pages canonicalize to `/fr/...`.
- ES pages canonicalize to `/es/...`.
- Pricing query variants canonicalize to `/pricing`, `/fr/pricing`, or
  `/es/pricing`.
- Sitemap URLs match localized canonical patterns.
- Admin, preview, thank-you, and 404 routes are not sitemap canonical URLs.
- Canonical and hreflang groups share the same base path.

## Result

No critical/high canonical issues remain. Insights hub/category routes were
updated to use the shared metadata helper so their canonical, OG, Twitter, and
hreflang behavior matches the rest of the site.

