# Taskcover Agency — Homepage Vibe Standard

> **Status:** Approved master standard for all future pages.
> Updated for the human-feedback polish pass (Task 2D).
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
- Tinted treatments are allowed for semantic meaning:
  - Pain points: subtle warm amber tint (`amber-50/60`, `border-amber-200/60`)
  - Opportunity: subtle teal tint (`brand-teal/[0.04]`)
  - Solution: subtle emerald tint (`brand-emerald/[0.05]`)
  - Traditional/vendor comparison: muted slate (`surface-soft`)

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
  intentional tighter sections (e.g. brand marquee `py-14`).

---

## 6. No repeated section structure rule (critical)

Within the same page, **do not repeat the same section structure, layout
pattern, or UI logic.** Each section must have a distinct structure,
interaction pattern, visual rhythm, and delivery style.

Homepage section delivery methods (all different):

| # | Section | Delivery method |
|---|---------|-----------------|
| 1 | Hero | Split layout + floating SEO-tool-like dashboard |
| 2 | Brand experience | Moving brand/partner marquee with fade masks |
| 3 | Search has changed | Interactive ecosystem network map (labeled nodes + particle flow) |
| 4 | Operating system | Connected horizontal pipeline with input/action/output logic + loop |
| 5 | Growth plays | Playbook system (featured panel + rail selector + system mapping) |
| 6 | Services | Asymmetric bento with content-rich feature card |
| 7 | Industries | Tabbed sector rail + tinted detail panel with chips |
| 8 | Markets | Regional panels with map-dot accent headers + differentiator |
| 9 | Video trust | Compact premium proof framework |
| 10 | Media | Editorial commentary rows (no placeholder publications) |
| 11 | Methodology | 30/60/90 phased timeline |
| 12 | Technology | Tabbed Search Intelligence control-room |
| 13 | Comparison | Premium two-column contrast (not a flat table) |
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
- Huge empty card surfaces with too little content

---

## 7. Card style

- Cards are **tactile**: `card-lift` utility adds a hover lift
  (`translateY(-4px)`) with a controlled brand-tinted shadow.
- Borders soften/lighten on hover (`hover:border-brand-teal/40`).
- Premium shadows are layered and soft — never heavy drop shadows.
- Icon tiles use `bg-brand-gradient text-white` in compact rounded squares.
- Link affordances use `text-brand-teal` with arrow icons that translate on
  hover.
- Feature cards must be **content-rich**, not empty surfaces. Large cards
  include mini roadmaps, chips, or outcome previews.

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

## 9. Proof wording rules (public-ready)

- **Never fake proof.** No invented testimonials, metrics, or case-study
  numbers.
- Brand names (Agoda, Skyscanner, British Council, Avis) are referenced as
  **"selected team and partner experience"** only — they do not imply
  endorsement.
- **No public-facing internal wording.** The following must never appear on
  the public homepage:
  - "placeholder"
  - "coming soon"
  - "ready for real links"
  - "demo score"
  - "replace with"
  - "until verified data is connected"
  - "Publication — Article title placeholder"
- A single subtle illustrative disclaimer is allowed where necessary:
  > "Illustrative dashboard preview — verified client data is added only
  > with permission."
- Do not overuse disclaimers.
- Video/press/proof sections present a **structured framework** ready for
  permissioned assets — not empty placeholders.

---

## 10. Dynamic / tactile / 3D-depth rules

- **Layered surfaces:** dashboard modules use `depth-layered` (triple-shadow)
  and `halo-soft` (gradient halo) to feel like floating UI, not flat cards.
- **Perspective:** `perspective-1000` wrapper + optional `tilt-left`/`tilt-right`
  for command-center modules (used sparingly).
- **Hover lift:** `card-lift` on interactive cards and dashboard tiles.
- **Animated connection lines:** `flow-line` (dashed SVG stroke with
  `flow-dash` animation) for pipeline/network/authority visuals.
- **Particle flow:** animated particles moving along SVG lines toward the hub
  for the ecosystem map (knowledge-graph feel).
- **Pulse indicators:** `pulse-dot` for "live"/"active" status dots.
- **Gradient sheen:** `sheen` for premium card hover (sparingly — max 1–2 per
  page).
- **Marquee:** slow, smooth horizontal brand strip that pauses on hover.
- All effects are disabled under `prefers-reduced-motion`.
- No heavy 3D libraries. Prefer CSS/SVG/motion-based effects.

---

## 11. Dashboard / data visualization style (SEO-tool-like)

- The hero dashboard is the **Search Intelligence Command Center** — it must
  feel like a premium SEO intelligence platform (Semrush/Ahrefs logic), not a
  random collection of cramped boxes.
- **Required structure:**
  - Top KPI row: Search Volume, Organic Visibility, AI Visibility, Site Health
  - Main chart: organic visibility / search demand trend
  - Score module: AI Search, Audit, Authority (compact score **rows**, not rings)
  - Keyword opportunity / content gap list
  - Search intent distribution
- **Growth-oriented illustrative metrics standard (Task 2D):**
  - Use positive, upward-trending illustrative numbers:
    Search Volume ~240K, Organic Visibility ~90%, AI Visibility ~95%,
    Site Health ~98%, Audit Score ~98%, Authority Score ~92%.
  - Use green/emerald/teal positive colors, arrow-up icons, positive deltas,
    progress bars, and upward trend lines.
  - The dashboard must feel like growth, improvement, and opportunity.
  - Keep the professional disclaimer:
    "Illustrative dashboard preview — verified client data is added only with
    permission."
  - Do NOT present the numbers as real client results.
- **Overflow prevention (Task 2D):**
  - Score rings must NOT spill outside cards. If circular rings do not fit,
    use compact score rows with progress bars instead.
  - Add `overflow-hidden` only where appropriate — do not simply hide broken
    content. Fix spacing, card width, and responsive behavior at the source.
- **Spacing:** more white space, larger/clearer modules, fewer cramped boxes.
- Charts use brand gradient strokes/fills (green → teal → blue).
- Mini-visuals in service cards are distinct per service.
- Data visuals must **communicate search intelligence**, not be decorative.
- A single subtle disclaimer is used instead of scattered "demo"/"placeholder"
  labels.

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
  - Ecosystem map → horizontal node selector
  - Pipeline → vertical connected stack with output bullets
  - Industries rail → stacked tabs + detail panel
  - Comparison → stacked comparison cards
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
- ❌ Public-facing placeholder/coming-soon/internal wording.
- ❌ Huge empty card surfaces with too little content.
- ❌ Flat plain tables for comparison (use a visual contrast system).

---

## 17. Component-specific standards (Task 2D)

### Header & footer logo visibility
- Header logo must be **clearly visible and premium** — not extremely small.
  Use `h-9 sm:h-11` with `max-w-[200px] sm:max-w-[240px]` and `object-contain`.
  Logo must remain sharp (no blur).
- Footer logo must sit in a **light logo card/pill** (`bg-white border shadow-sm`)
  so it stays clear on the soft footer background. Use `h-9 sm:h-10`.
- The CTA must not visually dominate the logo. Keep header balanced.

### Premium brand marquee
- Two-row marquee: Row 1 = brand names, Row 2 = capability tags.
- Tiles must feel like **premium brand-proof tiles**, not simple filter tags:
  - Stronger soft shadow, gradient halo on hover, better tile sizing and
    typography, hover lift, clearer fade masks at edges.
- Thin top/bottom gradient dividers.
- Keep safe wording: "Selected team and partner experience across global
  brands, campaigns, and search programs."
- Never use "Trusted by".

### Floating DNA / knowledge-graph motion
- The search ecosystem map uses **floating DNA / knowledge-graph feel**:
  - Nodes drift very slightly (organic, floating).
  - Line connections breathe/sway gently (opacity oscillation, not blinking).
  - Hub has subtle breathing glow, not flashing.
  - No strong blinking/pulsing lines toward the hub.
- Motion must feel premium, organic, floating, connected — bright and clean,
  not cyber or neon.

### Color-coded Input/Action/Output (Operating System)
- Input: blue/teal tint with database/search icon.
- Action: emerald/green tint with bolt/gear icon.
- Output: teal-blue tint with check/result icon.

### Color-coded Challenge/Strategy/Output (Growth Playbook)
- Challenge: soft amber/red tint + alert icon + left accent bar.
- Strategy: soft teal/blue tint + target icon + left accent bar.
- Output: soft green/emerald tint + check icon + left accent bar.

### Services bento — no layout holes
- Use a clear 12-column or 4-column bento grid.
- Every card span must be deliberate. No large blank gaps.
- SEO Strategy is the larger feature card but must not create layout holes.
- Include PPC Management and SEO Mentor Service to fill the grid.
- Every card retains a distinct micro-visual.

### Technology panels — no empty whitespace
- Each active module panel includes: summary, 3–4 capability bullets, "What
  we monitor", "Business decision it supports", and a mini visual.
- Use a two-column internal panel: left = content, right = mini visual.
- Mini visuals are illustrative UI labels only — no fake specific metrics.

---

## 18. Service page adaptation rules (Task 3)

Service pages (`/services` and `/services/[slug]`) must match the homepage
vibe while using **distinct section structures per page**. Each service
detail page uses the shared `ServicePageTemplate` from
`src/components/marketing/services/service-template.tsx`, which enforces
section variety.

### Hub (`/services`)
- Hero is a **split layout** with a floating **service constellation**
  (services as nodes orbiting a "Search Growth System" core). Not a grid.
- "How services connect" is a **layered capability stack** (Foundation →
  Demand → Reach → Acceleration), not a repeated card grid.
- Service cards include a **distinct outcome chip** per service, not just
  title + paragraph.
- "Which service is right for you?" is a **scenario decision guide** with
  `DecisionPathAccent` visuals (Blind spots → Visible, etc.), not a flat
  list.

### Detail pages (`/services/[slug]`)
Each page has **10 sections, each with a distinct UI treatment**:

| # | Section | Delivery method |
|---|---------|-----------------|
| 1 | Hero | Split layout + service-specific floating visual |
| 2 | Problem | Diagnostic scanner panel (numbered issue rows, amber accents, severity radar) + "Where this service creates leverage" panel (left column balances the scanner on the right) |
| 3 | Approach | Layered operating model (vertical stack with gradient number rail, not cards) |
| 4 | Deliverables | Implementation ledger (table-like board with alternating rows + priority/tier chips) |
| 5 | Use cases | Decision paths (trigger → fit rows with arrow connectors, not identical cards) |
| 6 | Process | Vertical timeline with rail connector (numbered nodes on a gradient rail + timing badges) |
| 7 | Outcomes | Ascending staircase (indented steps with Trophy on final outcome, not a card grid) |
| 8 | Related | Horizontal "next best modules" rail (chips, not cards) |
| 9 | FAQ | Two-column header + compact accordion |
| 10 | Final CTA | Service-specific audit preview panel (rows tailored by service slug) |

**Critical rule — service detail pages must use distinct section delivery
methods and cannot stack repeated card-row sections.** No two sections on a
single service detail page may share the same structure, layout pattern, or
UI logic. In particular, avoid repeating:
- centered section header + card row
- left text + right cards
- same 3-column / 4-column card grids
- same horizontal row cards
- same list-card style
- same CTA panel style
- same rounded white boxes everywhere
- generic icon + title + paragraph pattern

The exact same section structure can be reused across different service
pages, but within a single service page the sections must not visually
repeat each other.

### Service-specific visuals (Part C)
Each service has a unique hero visual and deliverable micro-visual in
`src/components/marketing/services/service-visuals.tsx`. See the file
header for the full metaphor mapping.

---

## 19. Industry page adaptation rules (Task 5)

Industry pages (`/industries` and `/industries/[slug]`) must match the homepage
vibe while using **distinct section structures per page**. Each industry detail
page uses the shared `IndustryPageTemplate` from
`src/components/marketing/industries/industry-template.tsx`, which enforces
section variety.

### Hub (`/industries`)
- Hero is a **split layout** with a floating **sector signal dashboard**
  (industries as signal nodes around a "Search Intent" core). Not a grid.
- "Sector map" is an **interactive vertical rail + detail preview panel**.
  Travel and Education are flagged as **priority sectors** with a pulse dot.
- "Search behavior matrix" is a **table-style comparison grid** with visual
  level bars (not a card grid).
- "Service bundles" is a **horizontal grouped rail** with chip-style links.

### Detail pages (`/industries/[slug]`)
Each page has **9 sections, each with a distinct UI treatment**:

| # | Section | Delivery method |
|---|---------|-----------------|
| 1 | Hero | Split layout + industry-specific floating visual |
| 2 | Search Behavior | Horizontal intent funnel flow (stage labels + connected content) |
| 3 | Pain Points | Diagnostic scanner panel (numbered rows + severity radar + opportunities panel) |
| 4 | Solution | Connected operating model (hexagonal grid with numbered nodes + connector arrows) |
| 5 | Recommended Services | Vertical module stack rail (numbered rows linking to service pages) + fit summary & bundle map panel (left column balances the module rail on the right) |
| 6 | Content & Authority | Dual pipeline + ladder (content pillars list + authority ladder with shield capstone) |
| 7 | Outcomes | Outcome ledger grid (category icons, no fake metrics) |
| 8 | FAQ | Two-column header + compact accordion |
| 9 | Final CTA | Industry-specific audit preview panel (rows tailored by industry slug) |

**Critical rule — industry detail pages must use distinct section delivery
methods and cannot stack repeated card-row sections.**

### Industry-specific visuals (Part C)
Each industry has a unique hero visual in
`src/components/marketing/industries/industry-visuals.tsx`:
- Travel: destination SERP + booking funnel
- Education: program research + decision cycle loop
- Healthcare: trust + local provider map
- Legal: high-trust intake funnel
- SaaS: category + comparison matrix
- eCommerce: category architecture + product grid
- Franchise: multi-location pack grid

### Priority industries
Travel and Education are flagged as priority sectors because Taskcover has
relevant team/partner experience context (Agoda, Skyscanner, British Council).
Brand names are referenced as experience context only — never as endorsement.

---

## 20. Customer journey (homepage reference)

The homepage guides users through:

**Problem → New Search Landscape → Taskcover Search System → Services →
Industries → Markets → Proof → Methodology → Technology → Audit CTA**

Future pages should preserve this logical, evidence-led progression within
their own scope.

---

*This standard is the source of truth. All future pages must conform to it.
Update this document if the approved vibe evolves — do not silently diverge.*
