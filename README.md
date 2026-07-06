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

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Standard Next.js production build |
| `npm run build:cloudflare` | OpenNext Cloudflare Worker build |
| `npm run preview:cloudflare` | Local Worker preview, after Hyperdrive local variable check |
| `npm run cf:typegen` | Generate Cloudflare environment types |
| `npm run cf:dry-run` | Wrangler deploy dry-run |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Offline Vitest suite |
| `npm run seo:check` | Static technical SEO checks for sitemap, robots, schema, logos, and keyword ownership |
| `npm run seo:crawl` | Local rendered technical SEO crawler; pass `-- --base-url=http://localhost:3100` |
| `npm run perf:check` | Static Task 15 performance/public-bundle/media guardrails |
| `npm run a11y:check` | Static Task 15 accessibility guardrails |
| `npm run visual:check` | Static Task 15 responsive/overflow/motion guardrails |
| `npm run launch:qa` | Runs all Task 15 launch QA guardrails; accepts `-- --base-url=http://localhost:3100` for rendered route sampling |
| `npm run production:check` | Offline production activation configuration check |
| `npm run production:predeploy` | Local pre-deploy gate; does not deploy or migrate |
| `npm run db:status` | Read-only migration/database status |
| `npm run db:migrate` | Guarded migration; requires `DATABASE_TARGET` |
| `npm run db:verify` | Read-only schema/index verification |
| `npm run admin:create` | First Admin bootstrap or explicit credential rotation |
| `npm run admin:verify` | Read-only Admin account verification |
| `npm run insights:import` | Import local Insights content into the configured DB |
| `npm run insights:verify-database` | Verify database-backed Insights counts and visibility |
| `npm run leads:smoke` | Mock-mode lead submission smoke harness |
| `npm run integrations:test-resend` | Offline Resend readiness check; `-- --live` sends one test email |
| `npm run integrations:test-hubspot` | Offline HubSpot readiness check; live writes require explicit flags |
| `npm run integrations:test-calcom` | Cal.com URL safety check |
| `npm run integrations:test-turnstile` | Turnstile configuration check |
| `npm run integrations:test-cloudinary` | Cloudinary signed upload readiness check |
| `npm run rate-limits:verify` | Lead/admin rate-limit verification |
| `npm run scheduler:verify` | Cron/scheduler wiring verification |
| `npm run smoke:deployment` | Safe post-deploy route smoke test |

## Documentation

- [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md)
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- [`docs/UI_SOURCES.md`](./docs/UI_SOURCES.md)
- [`docs/SITE_ARCHITECTURE.md`](./docs/SITE_ARCHITECTURE.md)
- [`docs/SEO_STANDARDS.md`](./docs/SEO_STANDARDS.md)
- [`docs/TECHNICAL_SEO_LAUNCH_HARDENING.md`](./docs/TECHNICAL_SEO_LAUNCH_HARDENING.md)
- [`docs/TECHNICAL_SEO_URL_INVENTORY.md`](./docs/TECHNICAL_SEO_URL_INVENTORY.md)
- [`docs/PERFORMANCE_AUDIT.md`](./docs/PERFORMANCE_AUDIT.md)
- [`docs/ACCESSIBILITY_AUDIT.md`](./docs/ACCESSIBILITY_AUDIT.md)
- [`docs/FINAL_VISUAL_QA_REPORT.md`](./docs/FINAL_VISUAL_QA_REPORT.md)

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
## Production readiness

Taskcover is prepared for Cloudflare Workers with OpenNext. Start with:

- `docs/CLOUDFLARE_DEPLOYMENT.md`
- `docs/NEON_HYPERDRIVE_SETUP.md`
- `docs/PRODUCTION_ENVIRONMENT_MATRIX.md`
- `docs/STAGING_DEPLOYMENT.md`
- `docs/PRODUCTION_DEPLOYMENT.md`
- `docs/PRODUCTION_ROLLBACK.md`
- `docs/INTEGRATION_TESTING.md`
- `docs/LEAD_DELIVERY_ARCHITECTURE.md`
- `docs/PRODUCTION_ACTIVATION_CHECKLIST.md`

Do not deploy production or apply external database migrations without explicit approval and credentials.
