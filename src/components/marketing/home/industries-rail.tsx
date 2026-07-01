"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Industries — vertical sector rail with detail preview.
 */

type Industry = {
  title: string;
  short: string;
  pain: string;
  opportunity: string;
  solution: string;
  intentPattern?: string;
  trustSignals?: string;
  recommendedServices?: readonly string[];
  href: string;
};

export function IndustriesRail({
  eyebrow,
  title,
  titleId,
  description,
  industries,
  labels,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  industries: readonly Industry[];
  labels?: {
    activeVertical: string;
    painPoint: string;
    opportunity: string;
    taskcoverSolution: string;
    intentPattern: string;
    trustSignals: string;
    recommendedServices: string;
    view: string;
  };
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const current = industries[active];
  const L = labels ?? {
    activeVertical: "Active vertical",
    painPoint: "Pain point",
    opportunity: "Opportunity",
    taskcoverSolution: "Taskcover solution",
    intentPattern: "Intent pattern",
    trustSignals: "Trust signals",
    recommendedServices: "Recommended services",
    view: "View",
  };

  return (
    <Container className={cn("flex flex-col gap-10", className)}>
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

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sector rail */}
        <div role="tablist" aria-label="Industries" className="flex flex-col gap-1">
          {industries.map((ind, i) => {
            const isActive = active === i;
            return (
              <button
                key={ind.title}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200",
                  isActive
                    ? "border-brand-teal/40 bg-white shadow-[0_8px_24px_-16px_rgba(24,138,172,0.4)]"
                    : "border-transparent bg-transparent hover:bg-white/60"
                )}
              >
                <span className="flex flex-col">
                  <span className={cn("text-sm font-semibold transition-colors", isActive ? "text-graphite" : "text-secondary")}>
                    {ind.short}
                  </span>
                </span>
                <span
                  className={cn(
                    "h-6 w-1 rounded-full transition-all duration-300",
                    isActive ? "bg-brand-gradient" : "bg-transparent"
                  )}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-line bg-surface-tint p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col gap-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                  {L.activeVertical}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-graphite">
                  {current.title}
                </h3>
              </div>

              {/* Tinted cards: pain / opportunity / solution */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-4 shadow-[0_2px_8px_-4px_rgba(217,119,6,0.18)]">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {L.painPoint}
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">
                    {current.pain}
                  </p>
                </div>
                <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/[0.04] p-4 shadow-[0_2px_8px_-4px_rgba(24,138,172,0.18)]">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {L.opportunity}
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">
                    {current.opportunity}
                  </p>
                </div>
                <div className="rounded-xl border border-brand-emerald/20 bg-brand-emerald/[0.05] p-4 shadow-[0_2px_8px_-4px_rgba(18,198,121,0.18)]">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-emerald">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {L.taskcoverSolution}
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">
                    {current.solution}
                  </p>
                </div>
              </div>

              {/* Extra compact rows */}
              <div className="grid gap-2 sm:grid-cols-3">
                {current.intentPattern && (
                  <div className="rounded-lg border border-line-soft bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{L.intentPattern}</p>
                    <p className="mt-1 text-xs text-secondary">{current.intentPattern}</p>
                  </div>
                )}
                {current.trustSignals && (
                  <div className="rounded-lg border border-line-soft bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{L.trustSignals}</p>
                    <p className="mt-1 text-xs text-secondary">{current.trustSignals}</p>
                  </div>
                )}
                {current.recommendedServices && current.recommendedServices.length > 0 && (
                  <div className="rounded-lg border border-line-soft bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{L.recommendedServices}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {current.recommendedServices.map((s) => (
                        <span key={s} className="inline-flex items-center rounded-md bg-surface-tint px-1.5 py-0.5 text-[10px] font-medium text-graphite">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-2">
                <Link
                  href={current.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline"
                >
                  {L.view} {current.short}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}