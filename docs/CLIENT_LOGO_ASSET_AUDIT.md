# Client Logo Asset Audit

Task 13C replaced the homepage text-pill proof strip with local verified case-study visual assets. No remote logos, stock assets, or invented client marks were added.

## Decision

The repository does not currently include standalone transparent SVG/PNG client logos for the 10 verified case studies. The best approved local assets are the first case-study WebP visuals under `public/case-studies/{slug}/image-1.webp`. These are treated as permissioned logo/proof cards, preserved with their original aspect ratios, and rendered with `object-contain`.

## Inventory

| Client | Current asset | Type | Dimensions | Panel | Quality status | Replacement status | Usage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| British University Vietnam | `/case-studies/british-university-vietnam/image-1.webp` | WebP | 1080 x 600 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| Casa Madera | `/case-studies/casa-madera/image-1.webp` | WebP | 1080 x 600 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| The Bamboo Bar | `/case-studies/the-bamboo-bar/image-1.webp` | WebP | 1080 x 600 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| Matthew Jeffery Law Firm | `/case-studies/matthew-jeffery-law-firm/image-1.webp` | WebP | 1400 x 778 | Light | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| SkatePro | `/case-studies/skatepro/image-1.webp` | WebP | 1080 x 600 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| Agoda | `/case-studies/agoda/image-1.webp` | WebP | 1400 x 788 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| Avis | `/case-studies/avis/image-1.webp` | WebP | 1400 x 778 | Light | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| NovaWorld | `/case-studies/novaworld/image-1.webp` | WebP | 1400 x 778 | Light | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| CCleaner | `/case-studies/ccleaner/image-1.webp` | WebP | 1080 x 600 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |
| FWD Insurance | `/case-studies/fwd-insurance/image-1.webp` | WebP | 1080 x 600 | Dark | Approved local case-study proof card | No better standalone logo found | Homepage logo strip, case library, client results |

## Rendering Rules

- Use only local assets under `public/`.
- Preserve aspect ratio with `object-contain`.
- Do not upscale tiny logo files into blurry proof cards.
- Prefer standalone transparent logo files in the future, but only if they are permissioned and committed locally.
- Provide meaningful alt text in EN, FR, and ES.
- Use dark panels only when the original asset requires it.

## Remaining Limitation

The current assets are case-study visual cards, not transparent brand logo files. Replacing them with standalone logos requires permissioned local logo source files for each client.
