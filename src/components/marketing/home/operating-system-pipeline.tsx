"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, RotateCw } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Taskcover Search Operating System — pipeline diagram.
 *
 * Renders the 8-stage system as a connected horizontal pipeline on desktop
 * (with animated flow lines between stages) and a vertical connected stack
 * on mobile. Each stage reveals input/action/output logic in a detail panel.
 * A loop indicator shows Reporting feeding back into Strategy.
 */

type Step = {
  label: string;
  description: string;
  input?: string;
  action?: string;
  output?: string;
};

export function OperatingSystemPipeline({
  eyebrow,
  title,
  titleId,
  description,
  steps,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  steps: readonly Step[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const current = steps[active];

  return (
    <Container className={cn("flex flex-col gap-12", className)}>
      <div className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
        >
          {title}
        </h2>
        <p className="text-pretty text-base leading-relaxed text-secondary sm:text-lg">
          {description}
        </p>
      </div>

      {/* Desktop: horizontal connected pipeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Flow rail background */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[27px] h-0.5 bg-line"
          />
          {/* Animated progress overlay */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-[27px] h-0.5 bg-brand-gradient"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduceMotion ? 0 : 1.2, ease: "easeOut" as const }}
          />

          <ol className="relative grid grid-cols-8 gap-2">
            {steps.map((step, i) => {
              const isActive = active === i;
              return (
                <motion.li
                  key={step.label}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.08 }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="flex cursor-pointer flex-col items-center text-center"
                >
                  {/* Node */}
                  <span
                    className={cn(
                      "relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-semibold transition-all duration-300",
                      isActive
                        ? "border-brand-teal bg-brand-gradient text-white shadow-[0_8px_24px_-8px_rgba(24,138,172,0.5)]"
                        : "border-line bg-white text-graphite hover:border-brand-teal/40"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="mt-3 text-xs font-semibold text-graphite">
                    {step.label}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Loop indicator: Reporting -> Strategy */}
        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-medium text-muted">
          <RotateCw className="h-3 w-3 text-brand-teal" aria-hidden="true" />
          <span>Reporting loops insight back into Strategy</span>
        </div>

        {/* Active stage detail panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-6 grid max-w-3xl gap-4 rounded-2xl border border-line bg-surface-tint p-6 sm:grid-cols-[auto_1fr]"
        >
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-teal">
              Stage {active + 1}
            </p>
            <p className="text-lg font-semibold text-graphite">{current.label}</p>
            <p className="text-sm leading-relaxed text-secondary">
              {current.description}
            </p>
          </div>
          {(current.input || current.action || current.output) && (
            <div className="grid gap-2 sm:grid-cols-3">
              {current.input && (
                <div className="rounded-lg border border-line bg-white p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Input</p>
                  <p className="mt-1 text-xs text-secondary">{current.input}</p>
                </div>
              )}
              {current.action && (
                <div className="rounded-lg border border-line bg-white p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Action</p>
                  <p className="mt-1 text-xs text-secondary">{current.action}</p>
                </div>
              )}
              {current.output && (
                <div className="rounded-lg border border-brand-teal/30 bg-white p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">Output</p>
                  <p className="mt-1 text-xs text-secondary">{current.output}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile: vertical connected stack with I/O */}
      <ol className="flex flex-col gap-0 lg:hidden">
        {steps.map((step, i) => (
          <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-brand-teal/40 to-line"
              />
            )}
            <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
              {i + 1}
            </span>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-semibold text-graphite">{step.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-secondary">
                {step.description}
              </p>
              {step.output && (
                <p className="mt-1.5 text-[11px] font-medium text-brand-teal">
                  → {step.output}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-2 text-sm font-medium text-brand-teal">
        <span>Each stage compounds into the next</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </Container>
  );
}