# Homepage opening and motion pilot

The English homepage now opens with the selected “Be the answer” direction. This slice covers the hero, selected client logos, need recognition and five service links. The existing Decision Studio follows these sections; the remaining evidence, video and continuation sections retain their previous implementation.

## Behavior

- The hero uses two optimized image layers. The lens responds to fine mouse pointers by at most 8px horizontally, 6px vertically and 1.5 degrees. The content and CTAs remain still and are present in server HTML. A pause control resets the lens. Touch pointers, widths up to 700px and reduced-motion preferences do not enable pointer tracking.
- Client logos enter once and respond to hover, focus and press. All seven are visible without waiting for a marquee. British Council retains its priority-section navigation; the other client buttons retain their existing context dialogs and published case links.
- Service rows remain ordinary links, including on the first touch. Pointer/focus previews update supporting copy beside the illustration. Descriptions remain visible on mobile. No fake tabs, diagnosis, data or new routes were introduced.
- Native dialogs retain Escape, focus restoration and video teardown. The video player remains opt-in. Its prior localhost provider restriction has not been changed or represented as successful playback.
- CSS disables entrance/interaction transitions for reduced motion; the existing hydration-safe preference hook is reused. No permanent animation loop, scroll hijack, new library or 3D runtime.

## Assets and fidelity

The three new images under `public/images/answer/` were generated individually from the selected visual, rather than slicing a full-page mock into the site. Their combined source WebP size is about 257kB. Native text, links and controls remain editable HTML. The glass image is a layered illustration, not real-time optical refraction.

The original Taskcover Agency logo is unchanged. Four light-surface client variants were retrieved from their official websites; URLs and native dimensions are recorded in `client-logo-assets.ts`:

- Agoda: official homepage CDN image.
- CCleaner: official homepage-preloaded SVG.
- FWD: official homepage Contentstack asset.
- BUV: SVG shown in the live official homepage header.

NovaWorld retains its already-approved dark source artwork. A discovered Phan Thiet-specific mark was not substituted for the generic approved client identity. The small dark logo plate is an explicit source-asset constraint and differs from the generated light-surface mock.

## Validation

- Route type generation, TypeScript and ESLint checks passed.
- 46 tests across ten homepage/navigation/proof/SEO-related files passed, including four new opening tests for server-visible content, pause/reduced-motion state, service navigation/focus and retained client/video behavior.
- Production build generated 329 static pages. No GitHub Actions were used.
- Browser checks exercised the lens and pause/reset, service keyboard preview and real navigation, client dialogs and focus restoration, British Council priority navigation, mobile menu and responsive widths 375, 390, 720, 768, 1280 and 1440.
- Visual comparison and remaining limitations are recorded in root `design-qa.md`. Screenshots are local artifacts in `../pr33-qa/motion-opening-20261003/`.

The in-app browser's viewport control does not emulate physical touch hardware or reduced-motion media settings. Responsive mouse-based checks and deterministic preference tests are distinct from an actual phone/OS reduced-motion run. No lead form was submitted.

The supplied lockfile/dependencies are unchanged. The earlier `npm ci` validation remains applicable. No merge or deployment is included.
