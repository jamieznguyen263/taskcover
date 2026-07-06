# Robots Audit

`src/app/robots.ts` emits `/robots.txt` as a static metadata route.

## Verified Rules

- Returns 200 locally.
- Uses canonical sitemap URL: `https://taskcover.com/sitemap.xml`.
- Allows public crawling from `/`.
- Disallows private or utility route families:
  - `/admin`
  - `/admin/`
  - `/api`
  - `/api/`
  - `/thank-you`
  - `/fr/thank-you`
  - `/es/thank-you`
  - `/*/preview`
  - `/preview/`
- Does not block `/_next`, `/brand`, public images, CSS, or JS assets.

## Production Notes

After launch, fetch `https://taskcover.com/robots.txt` and verify the same
sitemap URL and private exclusions through the deployed CDN.

