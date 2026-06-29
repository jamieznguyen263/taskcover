import * as React from "react";
import { Check, X } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Premium comparison system — Traditional SEO vs Taskcover.
 *
 * Replaces the flat table with a visually persuasive two-column contrast:
 *  - Left: Traditional (muted/slate styling, soft X indicators)
 *  - Right: Taskcover (brand highlight, check indicators, recommended badge)
 *
 * Mobile collapses to stacked comparison cards.
 */

type Row = {
  dimension: string;
  traditional: string;
  taskcover: string;
};

export function PremiumComparison({
  eyebrow,
  title,
  description,
  rows,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  rows: readonly Row[];
  className?: string;
}) {
  return (
    <Container className={cn("flex flex-col gap-10", className)}>
      <div className="flex max-w-2xl flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
          {eyebrow}
        </span>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {title}
        </h2>
        <p className="text-pretty text-base leading-relaxed text-secondary sm:text-lg">
          {description}
        </p>
      </div>

      {/* Column headers */}
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="hidden sm:block" />
        <div className="hidden text-center sm:block">
          <span className="inline-flex items-center rounded-full border border-line bg-surface-tint px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Dimension
          </span>
        </div>
        <div className="hidden text-center sm:block">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
            Connected search system
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.dimension}
            className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]"
          >
            {/* Dimension label */}
            <div className="hidden flex-col justify-center rounded-2xl border border-line bg-white px-5 py-4 sm:flex">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Dimension</p>
              <p className="text-sm font-semibold text-graphite">{row.dimension}</p>
            </div>

            {/* Traditional */}
            <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface-soft px-5 py-4">
              <div className="flex items-center gap-2 sm:hidden">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Traditional · {row.dimension}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <X className="h-3 w-3" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-secondary">{row.traditional}</p>
              </div>
            </div>

            {/* Taskcover */}
            <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-brand-teal/30 bg-white px-5 py-4 shadow-[0_10px_30px_-18px_rgba(24,138,172,0.4)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-brand-gradient-soft opacity-50"
              />
              <div className="relative flex items-center gap-2 sm:hidden">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  Taskcover · {row.dimension}
                </span>
              </div>
              <div className="relative flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium leading-relaxed text-graphite">
                  {row.taskcover}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}