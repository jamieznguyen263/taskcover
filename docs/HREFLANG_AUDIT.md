# Hreflang Audit

## Locale Pattern

- `en`: unprefixed.
- `fr`: `/fr`.
- `es`: `/es`.
- `x-default`: English default URL.
- Slugs remain English across all locales.

## Verified

- Sitemap alternates are reciprocal for EN/FR/ES/x-default.
- Page metadata generated through `buildMetadata()` uses the same localized
  alternate map.
- Language switcher preserves equivalent route paths and safe query values,
  including pricing `tab` values.
- FR/ES homepage and service links were corrected to stay on localized paths.

## Info Limitation

The static root layout serves raw HTML with `lang="en"`, then a pre-paint script
and `HtmlLangSync` set rendered `/fr` and `/es` to `fr`/`es`. Rendered crawl
verifies the corrected language. A purely server-side per-locale `<html lang>`
would require a broader layout architecture change that may reduce static
generation.

