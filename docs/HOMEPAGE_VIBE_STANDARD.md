# Taskcover Agency — Homepage Vibe Standard

> **Status:** Approved master standard for all future pages.
> Once a page is built, it must match this document's tone, structure, motion,
> spacing, CTA style, proof rules, and conversion rhythm.

This document defines the approved homepage vibe that all future Taskcover
pages must follow. It captures the brand tone, visual direction, section
rhythm, card style, CTA style, proof wording, dynamic/tactile/3D-depth rules,
dashboard/data visualization style, motion rules, mobile rules, SEO rules,
conversion rules, and what future pages must avoid.

---

## 1. Brand tone

- **Bright, premium, enterprise-grade.** Never brooding, never neon, never
  crypto/gaming energy.
- Voice: confident, evidence-led, direct. No hype words ("skyrocket",
  "dominate", "crush"). No fear-mongering.
- Promise framing: visibility + authority + AI readiness + revenue — not
  "rankings only."
- The site sells a **connected search growth system**, not random SEO tasks.

---

## 2. Visual direction

- **Bright-only.** Backgrounds are white (`#FFFFFF`), off-white (`#F8FAFC`),
  or light blue-tint (`#F4F8FB`). No dark theme. No black/dark navy heroes.
- Feel: a premium **"Search Intelligence Command Center"** — layered, tactile,
  data-rich — not a static brochure.
- Rounded surfaces (`rounded-xl` → `rounded-3xl`), subtle borders
  (`border-line`, `border-line-soft`), soft controlled shadows.
- Generous whitespace; consistent section rhythm via the `Section` component
  (`py-20 sm:py-24 lg:py-28`).

---

## 3. Color usage

- Brand gradient: green `#10E66A` → emerald `#12C679` → teal `#188AAC` →
  blue `#197DB4`.
- Use the gradient **controlled and premium**:
  - CTA fills and borders
  - Hero/dashboard glow
  - Small section accents (eyebrow dot, timeline line)
  - Data-visualization highlights
  - Card emphasis (sparingly)
- Do **not** overuse gradients. No rainbow gradients. No neon clutter. Most
  surfaces stay white and clean.
- Text: graphite `#0F172A` for headings, secondary `#475569` for body, muted
  `#64748B` for captions.

---

## 4. Typography

- Geist Sans (primary), Geist Mono (mono accents).
- Headings: `font-semibold tracking-tight`.
- H1: `text-4xl sm:text-5xl lg:text-6xl`, balanced, tight leading.
- H2 (section headers): `text-3xl sm:text-4xl lg:text-[2.75rem]`.
- Body: `text-base sm:text-lg`, `leading-relaxed`.
- Eyebrow labels: `text-xs font-semibold uppercase tracking-[0.14em]`.

---

## 5. Section rhythm

- Alternate section backgrounds: `default` (white) → `soft` (`#F8FAFC`) →
  `tint` (`#F4F8FB`) to create visual cadence.
- Hero starts on `tint` with a subtle grid + gradient halo.
- Consistent vertical padding via `Section` (`py-20 sm:py-24 lg:py-28`), with
  intentional tighter sections (e.g. brand strip `py-14`).

---

## 6. No repeated section structure rule (critical)

Within the same page, **do not repeat the same section structure, layout
pattern, or UI logic.** Each section must have a distinct structure,
interaction pattern, visual rhythm, and delivery style.

Homepage section delivery methods (all different):

| # | Section | Delivery method |
|---|---------|-----------------|
| 1 | Hero | Split layout + floating layered dashboard |
| 2 | Brand experience | Text-only pill strip |
| 3 | Search has changed | Interactive ecosystem network map (SVG) |
| 4 | Operating system | Connected horizontal pipeline diagram |
| 5 | Growth plays | Challenge/strategy/output editorial cards |
| 6 | Services | Asymmetric bento with unique SVG micro-visuals |
| 7 | Industries | Tabbed sector rail + detail preview |
| 8 | Markets | Regional panels with map-dot accent headers |
| 9 | Video trust | Video-first featured layout (2:1 + sidebar) |
| 10 | Press | Editorial list/clipping style |
| 11 | Methodology | Vertical timeline |
| 12 | Technology | Dashboard module grid with live indicators |
| 13 | Comparison | Three-column contrast table |
| 14 | Free audit CTA | Audit report preview with scorecards |
| 15 | FAQ | Two-column header + accordion |
| 16 | Final CTA | Full-width gradient-halo panel |

**Avoid at all costs:**
- Bento grid after bento grid
- Repeated 3-column card layouts
- Repeated left-text / right-visual layouts
- Identical "section header + card grid" pattern across multiple sections
- Every card using the same icon + title + paragraph pattern
- Generic agency landing page repetition

---

## 7. Card style

- Cards are **tactile**: `card-lift` utility adds a hover lift
  (`translateY(-4px)`) with a controlled brand-tinted shadow.
- Borders soften/lighten on hover (`hover:border-brand-teal/40`).
- Premium shadows are layered and soft — never heavy drop shadows.
- Icon tiles use `bg-brand-gradient text-white` in compact rounded squares.
- Link affordances use `text-brand-teal` with arrow icons that translate on
  hover.

---

## 8. CTA style

- **Primary CTA:** `Get Free SEO Audit`
- **Secondary CTA options:** `View Our Search System`, `Book Strategy Call`
- Primary button: `bg-brand-gradient text-white` with a premium glow shadow,
  hover brightness + shadow lift.
- Secondary button: white surface with line border, hover border + tint.
- Outline variant: gradient ring border with white fill.
- The audit CTA appears at hero, mid-page (audit section), and final CTA —
  not on every section.

---

## 9. Proof wording rules

- **Never fake proof.** No invented testimonials, metrics, or case-study
  numbers.
- Brand names (Agoda, Skyscanner, British Council, Avis) are referenced as
  **"selected team and partner experience"** only — they do not imply
  endorsement.
- Where real data is unavailable, use clearly-labeled placeholders (`—`,
  `Coming soon`, `Placeholder`, `Demo visualization only`).
- No fake review schema. No aggregate rating schema. No fabricated
  case-study metrics in schema or copy.
- Video/press/written-quote slots render as neutral placeholders until real,
  permissioned assets are provided.

---

## 10. Dynamic / tactile / 3D-depth rules

- **Layered surfaces:** dashboard modules use `depth-layered` (triple-shadow)
  and `halo-soft` (gradient halo) to feel like floating UI, not flat cards.
- **Perspective:** `perspective-1000` wrapper + optional `tilt-left`/`tilt-right`
  for command-center modules (used sparingly).
- **Hover lift:** `card-lift` on interactive cards and dashboard tiles.
- **Animated connection lines:** `flow-line` (dashed SVG stroke with
  `flow-dash` animation) for pipeline/network/authority visuals.
- **Pulse indicators:** `pulse-dot` for "live"/"active" status dots.
- **Gradient sheen:** `sheen` for premium card hover (sparingly — max 1–2 per
  page).
- All effects are disabled under `prefers-reduced-motion`.
- No heavy 3D libraries. Prefer CSS/SVG/motion-based effects.

---

## 11. Dashboard / data visualization style

- The hero dashboard is the **Search Intelligence Command Center**: layered
  cards, floating metrics, animated charts (Recharts), a live status bar with
  pulse dot.
- Charts use brand gradient strokes/fills (green → teal → blue).
- Metrics use placeholder values (`—`) with "Demo score" / "Illustrative
  demo data" footnotes until verified data exists.
- Mini-visuals in service cards are distinct per service (roadmap, crawl map,
  citation, cluster, authority graph, map pins, product grid, dashboard bars).
- Data visuals must **communicate search intelligence**, not be decorative.

---

## 12. Motion rules

- Motion supports comprehension, not distraction.
- Entry animations: subtle fade + rise (`opacity 0→1`, `y 16→0`), staggered
  children, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hover transitions: `duration-200` to `duration-500`.
- Respect `prefers-reduced-motion` globally (all animation/transform disabled).
- No parallax-for-parallax'sake. No flashing/strobing. No decorative noise.
- Mobile animation is lighter (fewer simultaneous effects).

---

## 13. Mobile rules

- Mobile-first responsive grids.
- Complex desktop visuals degrade cleanly:
  - Ecosystem map → 2-column radial list
  - Pipeline → vertical connected stack
  - Industries rail → stacked tabs + detail panel
- Mobile menu: full-width links + full-width primary CTA.
- No layout shift. No horizontal overflow.
- Touch targets ≥ 40px.

---

## 14. SEO rules

- **One H1 per page.** Section headers use H2 via `SectionHeader`.
- Clean heading hierarchy (H1 → H2 → H3). No skipped levels.
- Unique title + meta description per page via `buildMetadata()`.
- Semantic HTML: `header`, `main`, `nav`, `section`, `article`, `figure`,
  `figcaption`, `footer`.
- `aria-labelledby` links sections to their headings.
- Organization schema in root layout (safe fields only).
- BreadcrumbList on deeper pages.
- No fake review/aggregate-rating schema.
- Internal links to services, industries, markets, and proof throughout.

---

## 15. Conversion rules

- Primary conversion: **Free SEO Audit**.
- CTA repetition is strategic: hero, dedicated audit section (with report
  preview), and final CTA. Not on every section.
- The audit section feels like a **preview of an SEO audit report**
  (scorecards, checklist, report panel) — not a generic form box.
- Copy supports high-ticket agency lead generation: evidence-led, system-led,
  revenue-framed.

---

## 16. What future pages must avoid

- ❌ Dark theme, dark heroes, neon/crypto/gaming vibes.
- ❌ Repeating the same section structure twice on one page.
- ❌ Uniform icon + title + paragraph card grids for every section.
- ❌ Overusing gradients or shadows.
- ❌ Fabricated metrics, testimonials, or press links.
- ❌ Official client logos without permissioned assets.
- ❌ Heavy 3D libraries; prefer CSS/SVG/motion.
- ❌ Layout shift, horizontal overflow, inaccessible motion.
- ❌ Skipping heading levels or using more than one H1.
- ❌ Generic agency landing-page repetition.

---

## 17. Customer journey (homepage reference)

The homepage guides users through:

**Problem → New Search Landscape → Taskcover Search System → Services →
Industries → Markets → Proof → Methodology → Technology → Audit CTA**

Future pages should preserve this logical, evidence-led progression within
their own scope.

---

*This standard is the source of truth. All future pages must conform to it.
Update this document if the approved vibe evolves — do not silently diverge.*