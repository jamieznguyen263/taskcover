# Localization Technical Audit

## Verified

- EN is unprefixed; FR uses `/fr`; ES uses `/es`.
- Shared English slugs remain the standard for localized routes.
- Header, mobile nav, footer, pricing, about, legal/trust, forms, case studies,
  insights labels, metadata, breadcrumbs, and primary CTAs are locale-owned.
- Language switch preserves equivalent route paths.
- Pricing `tab` query values are preserved by the language switcher when valid.
- Rendered `/fr` and `/es` pages report corrected `html lang` after the
  pre-paint/client sync path.

## Fixed

- FR/ES homepage links that previously pointed to unprefixed EN routes.
- FR/ES service related links that previously pointed to unprefixed EN routes.
- Hardcoded homepage `View market` label on FR/ES.

## Info

Raw server HTML language remains the static-root-layout limitation documented in
`docs/HREFLANG_AUDIT.md`.

