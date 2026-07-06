# Indexability Audit

## Indexable

The rendered crawler verified canonical public pages return 200 locally, are not
`noindex`, include title, meta description, canonical, hreflang alternates, Open
Graph basics, and one H1. Pricing query variants such as `?tab=mentor` render
but canonicalize to the clean pricing URL and are not included in the sitemap.

Representative checked routes include homepage, services, industries, markets,
work, proof, case studies, sample audits, client results, insights, pricing,
lead funnel, contact, about, methodology, how-we-work, and legal/trust pages in
EN plus FR/ES equivalents.

## Noindex Or Private

- `/thank-you`, `/fr/thank-you`, `/es/thank-you`
- `/admin` and `/admin/*`
- `/admin/insights/[id]/preview`
- `/api/*`
- unmatched 404 routes
- unsafe query variants that should not become standalone pages

These are excluded from the sitemap. Admin and preview pages are private/noindex
and are not linked from public navigation.

## Result

0 critical and 0 high indexability findings in the rendered local crawl.

