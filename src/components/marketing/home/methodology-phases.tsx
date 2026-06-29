import * as React from "react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Methodology — 30/60/90-day phased timeline.
 *
 * Groups the methodology into three phases (Diagnose & Map, Build & Fix,
 * Authority & Conversion) with phase labels and the steps in each phase.
 * Improves scanability over a flat vertical timeline.
 */

export function MethodologyPhases({
  eyebrow,
  title,
  description,
  phases,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  phases: readonly {
    phase: string;
    label: string;
    detail: string;
    steps: readonly string[];
  }[];
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

      <div className="grid gap-5 md:grid-cols-3">
        {phases.map((p, i) => (
          <div
            key={p.phase}
            className={cn(
              "relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-white p-6",
              i === 0 && "md:translate-y-0"
            )}
          >
            {/* Phase accent */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {p.phase}
              </span>
              <span className="text-2xl font-semibold text-brand-gradient">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-graphite">{p.label}</h3>
            <p className="text-sm leading-relaxed text-secondary">{p.detail}</p>

            <ul className="mt-1 flex flex-col gap-1.5">
              {p.steps.map((step) => (
                <li key={step} className="flex items-start gap-2 text-xs text-secondary">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}