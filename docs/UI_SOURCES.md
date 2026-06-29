# Taskcover Agency — UI Sources

This project selectively uses high-quality open-source UI patterns. We do **not**
blindly paste large third-party components — every pattern is adapted into a
clean local component that matches the Taskcover design system.

## 1. Approved UI sources

| Source         | Used for                                                  |
| -------------- | --------------------------------------------------------- |
| **shadcn/ui**  | Composition patterns, `cn()` helper, accessibility base   |
| **Magic UI**   | Inspiration for marquee, borders, animated accents        |
| **21st.dev**   | Inspiration for bento layouts, dashboards, cards          |
| **Radix UI**   | Primitives for accordion, tabs, slot (when single child)  |
| **Recharts**   | Lightweight charts for the search dashboard mockup        |
| **lucide-react** | Icon set                                               |
| **Motion Primitives** (style reference) | Interaction patterns (adapted, not copied) |
| **Tremor** (style reference) | Dashboard card / metric patterns (adapted)    |

## 2. Rules for adapting open-source UI

1. **Copy the pattern, not the file.** Re-implement inside
   `src/components/marketing/...` using Taskcover tokens.
2. **Strip unrelated props.** Keep APIs minimal and predictable.
3. **Use `cn()` from `src/lib/utils`.** Always allow `className` overrides.
4. **Token-based styling.** Reference `bg-brand-gradient`, `border-line`,
   `bg-surface-tint`, etc. — never hardcode competitor palettes.
5. **No dark mode.** Remove any `dark:` variants from imported snippets.
6. **Accessibility preserved.** Keyboard focus, ARIA, and roles must remain
   intact (Radix primitives handle most of this).
7. **Bundle hygiene.** Avoid importing entire icon libraries or component kits
   — import only what is used.
8. **TypeScript clean.** No `any` (lint enforces this). Provide explicit prop
   types.

## 3. Component quality checklist

Before a component is considered done it must:

- [ ] Use semantic HTML (`section`, `nav`, `figure`, `ul`/`ol`, `dl`).
- [ ] Have a single, clear responsibility.
- [ ] Accept a `className` prop merged via `cn()`.
- [ ] Use Taskcover design tokens (no hardcoded brand colors outside tokens).
- [ ] Be mobile-first responsive.
- [ ] Pass keyboard accessibility (focus visible, operable).
- [ ] Include `aria-label` / `aria-hidden` where appropriate.
- [ ] Have no `any` types and pass `tsc --noEmit`.
- [ ] Pass `eslint`.
- [ ] Contain **no fabricated data** — content comes from `src/data/*.ts` or
      explicit props.