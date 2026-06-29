# Taskcover Agency

Search Growth Agency for **Google, AI Search, and Revenue**.

Taskcover Agency helps ambitious brands in the USA, Canada, and Australia grow
organic visibility, build authority, improve AI search readiness, and convert
high-intent search demand into measurable business outcomes.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config)
- [Radix UI](https://www.radix-ui.com/) primitives
- [Recharts](https://recharts.org/) for charts
- [lucide-react](https://lucide.dev/) for icons
- [class-variance-authority](https://cva.style/) + `tailwind-merge` + `clsx`

## Project structure

```
src/
  app/                     # Next.js App Router (layout, page, globals.css)
  components/
    marketing/
      home/                # Homepage-specific components (e.g. dashboard mockup)
      layout/              # Site header / footer
      shared/              # Reusable marketing primitives
  data/                    # Content arrays (source of truth for copy)
  lib/                     # site config, SEO helpers, cn() util
public/
  brand/                   # Logo + OG assets (placeholders until official)
docs/                      # PROJECT_BRIEF, DESIGN_SYSTEM, UI_SOURCES,
                           # SITE_ARCHITECTURE, SEO_STANDARDS
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the dev server (Turbopack)     |
| `npm run build`  | Production build                     |
| `npm run start`  | Run the production build             |
| `npm run lint`   | ESLint                               |

Type-check with `npx tsc --noEmit`.

## Documentation

- [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md)
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- [`docs/UI_SOURCES.md`](./docs/UI_SOURCES.md)
- [`docs/SITE_ARCHITECTURE.md`](./docs/SITE_ARCHITECTURE.md)
- [`docs/SEO_STANDARDS.md`](./docs/SEO_STANDARDS.md)

## Brand assets

Official logo assets belong in `public/brand/`. On-brand SVG placeholders are
checked in. Replace each file with the official asset (same filename) when
provided. See [`public/brand/README.md`](./public/brand/README.md).

## Credibility rules

This project follows a strict **no fake claims** policy:

- No invented awards, metrics, testimonials, or press links.
- Brand names (Agoda, Skyscanner, British Council, Avis, etc.) are referenced
  only as _selected team and partner experience_, never as endorsements.
- Until verified data is provided, the UI uses clearly-labeled placeholders.

See [`docs/SEO_STANDARDS.md`](./docs/SEO_STANDARDS.md) for the full policy.