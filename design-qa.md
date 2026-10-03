# Opening motion pilot — design QA

**final result: passed — scoped opening pilot**

Scope: English homepage hero, selected partners, need recognition and services. This is the opening pilot proposed and accepted before implementation; the later full-homepage mock sections are not claimed as implemented in this slice.

## Visual source and comparison

- Source: `../pr33-qa/brand-refinement-20261003/01-opening-desktop.png` (857×1836), cropped through services at y=1465 for the scoped comparison.
- Mobile source: `../pr33-qa/brand-refinement-20261003/04-opening-mobile.png` (874×1800), two consecutive 390-ish presentation strips rather than a literal browser capture.
- Implementation: `http://127.0.0.1:3335/`, production build, desktop CSS viewport 1440×1000; capture content width 1425 due browser screenshot geometry. Mobile viewport 390×844.
- Comparison artifact: `../pr33-qa/motion-opening-20261003/desktop-comparison.png`. Both scoped source and implementation are normalized to 720px wide, preserving each image's aspect ratio. The source is left and actual browser page is right. Do not infer equal pixel density from the mock's requested 1440px prompt.
- Initial browser evidence: `desktop-opening.jpg`, `desktop-hero.jpg`, `desktop-services-focus.jpg`, `mobile-opening.jpg`, `mobile-hero.jpg`, `mobile-services.jpg` in that same folder.

## Findings and fixes

- [P2, resolved in post-fix comparison] Hero type and overall height were lighter/shorter than the target. Display size raised to 140px maximum, copy to 22px and hero height to 860px; mobile overrides remain restrained.
- [P2, resolved in post-fix comparison] Supporting text, partner context and service descriptions were undersized. Increased key sizes and service-name weight; desktop question/output copy now uses two readable columns. Removed the forced desktop service-heading break.
- [P2, fixed and observed] Initial lens was too large. Its maximum width was reduced to 560px, restoring the balance of headline and artwork.
- [P2, resolved in post-fix mobile comparison] Mobile background questions crossed the heading and the lens sat too far below the CTA. Restricted the question field to the lower artwork area and tightened mobile-only gaps. Removed redundant supporting-logo captions on mobile; descriptive button names and dialogs remain available.
- [P3, source constraint] NovaWorld's approved source has a black background. The implementation preserves that asset rather than recoloring it or using an unapproved project-specific mark.

## Five fidelity surfaces

- Typography: actual Geist/Geist Mono from existing app, native HTML. Exact source color and size rules are used rather than raster microtext. Post-fix comparison confirms the stronger display/body hierarchy.
- Spacing/rhythm: same opening sequence and generous whitespace. Existing navigation retains Insights and its working menus; these were not removed to mimic omitted mock details. Static service descriptions and native destinations remain available.
- Color: existing green/emerald primary actions with dark labels, graphite headings, semantic deep-teal links and pale mint selection. This is not a claim that all rendered states pass a full accessibility audit.
- Images: generated discrete optical assets match the selected subject and palette. Actual brand assets are used; no handcrafted SVG or CSS recreation of the lens. NovaWorld deviation is documented. The supporting artwork retains the same image while focus changes its framing and adjacent copy; it does not fabricate five distinct service diagrams.
- Copy: selected proposition and five services retained. Existing client context and case facts remain authoritative. No client proof enters the hero, no added founder portrait, no invented growth figures.

## Interaction evidence and limits

Browser verified: bounded pointer response, pause resets transform to none, service focus changes its supporting copy, one click opens the AI Search service, client dialog closes with Escape and restores focus, British Council selects the priority view, mobile menu opens/closes. Responsive checks report no horizontal overflow at 375/390/720/768/1280/1440px; all five services and seven logos remain in the DOM.

Reduced-motion state and server HTML are covered by tests and CSS inspection. OS media emulation and physical touch were not available through this browser control; do not label those as actual device tests. Existing video iframe creation/teardown is tested, while actual localhost playback remains subject to the existing Cloudflare Stream allowlist. No real enquiry submitted.

## Final gate

Post-fix desktop-opening.jpg (1425×2749) and mobile-opening.jpg (390×1460) were recaptured from the final production build. desktop-comparison.png and mobile-comparison.png place source and actual content side by side. The mobile source uses the left strip crop at (38,32), 382×1187, normalized to390px wide; the real viewport is390×844 and the extended capture covers the opening. Source and actual preserve their aspect ratios and different content heights are shown rather than stretched. No remaining P0/P1/P2 issue blocks this scoped pilot. Minor residual polish: the mobile artwork begins with a more defined white-to-image boundary than the mock; a later asset refinement can soften it without changing layout. The documented NovaWorld source constraint remains P3. No full-homepage fidelity or device/accessibility certification is claimed.
