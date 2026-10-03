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

The user explicitly approved British Council and Skyscanner logo usage in this
task on 2026-10-01. Local official-source assets now use `user-approved` status
and appear in the English v3 homepage client showcase. This records the user's
authorization, not independent verification of an endorsement. Neither client
has been given a fabricated case-study route; the case-study proof helper still
includes only approved case-study WebPs with real slugs.

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
| British Council | `british-council` | Official website's cookie-brand image | `/brand-logos/british-council.png` | PNG | 249 x 78 | Light | `user-approved` | English homepage client showcase |
| Skyscanner | `skyscanner` | Official website's access-check header | `/brand-logos/skyscanner.svg` | SVG | 910 x 149 | Light | `user-approved` | English homepage client showcase |

## Rendering Rules

- Use only local assets under `public/`.
- Case-study proof tiles use `publicClientLogoAssets`; the v3 homepage's existing
  client-context buttons also use registry-backed `user-approved` assets.
- Preserve aspect ratio with `object-contain`.
- Use a light outer logo tile by default.
- Use a dark inner logo panel only when the approved source asset requires it.
- Standalone logos have meaningful alt text. Logos inside named client buttons
  use empty alt text to avoid repeating the visible client name; each original
  button has an explicit accessible name and inert duplicates stay hidden.
- Do not publish `permission-review` assets until permission and a local
  official logo file are available.
- Do not hotlink or use random logo websites as final sources.

## Remaining Limitation

The 10 public files are standardized approved WebP proof-card assets, not true
transparent SVG/PNG logos. Replace each with an official local transparent logo
only after permission and source quality are confirmed.

## Official-source imports

- British Council: original PNG displayed on `https://www.britishcouncil.org/`,
  from `https://cdn.cookielaw.org/logos/2956bc99-bb45-46aa-b9a5-334d197be6ca/dd85ed8a-deed-4a38-9070-ff9176e324a3/BC-logo.png`.
- Skyscanner: original inline SVG displayed by the official site when
  `https://www.skyscanner.net/media/media-assets` returned its access-check page.
  The SVG path and viewBox are unchanged. Its computed `#0062e3` fill is included
  in the local file so the external image retains the original source color.
  No CAPTCHA was solved and the protected media page was not accessed.
- Both files are served locally. No hotlink, generated logo, new client result,
  sponsorship claim, package or infrastructure was added.
