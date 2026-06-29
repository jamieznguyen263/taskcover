# Brand assets — Taskcover Agency

## Official assets (current)

These files are the **official Taskcover logo assets**, copied from the
provided logo package (`brand-source/Taskcover Logo.zip`) into production
locations used by the site (`src/lib/site.ts`).

| File                          | Source variant                         | Usage                                  |
| ----------------------------- | -------------------------------------- | -------------------------------------- |
| `taskcover-horizontal.png`    | Horizontal Logo — White Background     | Header / footer wordmark               |
| `taskcover-icon.png`          | Avatar Logo — White Background         | Favicon, social avatar, small UI badges |
| `og-default.svg`              | On-brand placeholder (gradient)        | Default Open Graph / Twitter share image (replace with branded PNG when available) |

Only **white-background** variants are used in the main UI per brand rules.
Black-background and colorful-background variants are intentionally excluded
from `public/brand/`.

## Source archive

The original logo package is stored at:

```
brand-source/Taskcover Logo.zip
brand-source/taskcover-logo-extracted/Taskcover Logo/
```

Do **not** commit large duplicates of the full archive into `public/` — only
the production-ready variants above belong in `public/brand/`.

## Logo usage rules

See [`docs/DESIGN_SYSTEM.md`](../../docs/DESIGN_SYSTEM.md) for the full guide.

- Prefer white-background / transparent variants. **Do not** use the
  black-background or colorful-background variants in the main UI.
- Do not distort, recolor, stretch, crop, or recreate the official logo.
- Use the horizontal logo in the header.
- Use the avatar/icon version for favicon, small badges, social preview, and
  compact UI.

## Replacing / extending assets

1. To use a different official variant, copy it into `public/brand/` and update
   `src/lib/site.ts` (`siteConfig.logo`).
2. For a higher-quality OG image, add `public/brand/og-default.png` (1200×630)
   and update `siteConfig.ogImage`.