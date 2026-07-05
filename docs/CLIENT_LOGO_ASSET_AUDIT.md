# Client Logo Asset Audit

Taskcover now uses a centralized client logo registry in
`src/content/client-logo-assets.ts` and standardized local files under
`public/brand-logos/`.

## Decision

The repository still does not include true standalone transparent SVG/PNG logo
files for the 10 approved case-study clients. The best approved local source
assets are the first case-study proof-card WebPs under
`public/case-studies/{slug}/image-1.webp`, so those files were copied into
`public/brand-logos/` with stable names.

British Council and Skyscanner are included in registry inventory only. They
are marked `permission-review`, have no local logo file committed, and are not
rendered in the public homepage proof strip, Case Studies hub, or Client
Results page.

## Inventory

| Brand | Registry ID | Source | Local path | Format | Dimensions | Background | Permission status | Public usage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| British University Vietnam | `buv` | Approved local case-study asset; official reference `buv.edu.vn` | `/brand-logos/buv.webp` | WebP | 1080 x 600 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| Casa Madera | `casa-madera` | Approved local case-study asset; official reference `thecasamadera.com` | `/brand-logos/casa-madera.webp` | WebP | 1080 x 600 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| The Bamboo Bar | `the-bamboo-bar` | Approved local case-study asset; official reference Mandarin Oriental page | `/brand-logos/the-bamboo-bar.webp` | WebP | 1080 x 600 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| Matthew Jeffery Law Firm | `matthew-jeffery-law-firm` | Approved local case-study asset; official reference `matthewjeffery.com` | `/brand-logos/matthew-jeffery-law-firm.webp` | WebP | 1400 x 778 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| SkatePro | `skatepro` | Approved local case-study asset; official/client asset needed for future SVG replacement | `/brand-logos/skatepro.webp` | WebP | 1080 x 600 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| Agoda | `agoda` | Approved local case-study asset; official reference `agoda.com` | `/brand-logos/agoda.webp` | WebP | 1400 x 788 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| Avis | `avis` | Approved local case-study asset; official reference `avis.com` | `/brand-logos/avis.webp` | WebP | 1400 x 778 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| NovaWorld | `novaworld` | Approved local case-study asset; official standalone source not clear locally | `/brand-logos/novaworld.webp` | WebP | 1400 x 778 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| CCleaner | `ccleaner` | Approved local case-study asset; official reference `ccleaner.com` | `/brand-logos/ccleaner.webp` | WebP | 1080 x 600 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| FWD Insurance | `fwd-insurance` | Approved local case-study asset; official reference `fwd.com.vn` | `/brand-logos/fwd-insurance.webp` | WebP | 1080 x 600 | Dark | `approved-case-study` | Homepage proof strip, Case Studies hub, Client Results page |
| British Council | `british-council` | Official Brand Hub required before import | Not committed | Not available | Not available | Light preferred | `permission-review` | Inventory only |
| Skyscanner | `skyscanner` | Official media assets required before import; usage must not imply endorsement | Not committed | Not available | Not available | Light preferred | `permission-review` | Inventory only |

## Rendering Rules

- Use only local assets under `public/`.
- Render public logo visuals from `publicClientLogoAssets`.
- Preserve aspect ratio with `object-contain`.
- Use a light outer logo tile by default.
- Use a dark inner logo panel only when the approved source asset requires it.
- Add meaningful alt text for every rendered logo.
- Do not publish `permission-review` assets until permission and a local
  official logo file are available.
- Do not hotlink or use random logo websites as final sources.

## Remaining Limitation

The 10 public files are standardized approved WebP proof-card assets, not true
transparent SVG/PNG logos. Replace each with an official local transparent logo
only after permission and source quality are confirmed.
