# Internal Link Audit

## Verified

The rendered crawler collected internal links from indexable pages and found 0
critical/high broken public internal links. Public navigation, footer, CTAs,
pricing tabs, case studies, sample audits, insights, contact/data-request, and
language-switch paths were covered by local crawl and tests.

## Fixed

- Homepage module/CTA links now localize through `localizePath()` for FR/ES.
- Service detail related-service links now localize for FR/ES.
- Homepage market card CTA label is locale-owned.
- The crawler now ignores private/noindex probe pages when deciding whether a
  broken link is a public SEO blocker.

## Notes

Links to noindex utility pages are not exposed in public navigation. Contact
intent query links are treated as safe conversion links and are not sitemap
URLs.

