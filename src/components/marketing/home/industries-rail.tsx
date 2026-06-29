"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Industries — vertical sector rail with detail preview.
 *
 * Layout: a left rail of industry tabs (click/hover to select) and a right
 * detail panel showing the pain/opportunity/solution for the active industry.
 * This is intentionally different from the Services bento grid and the Markets
 * panels — no repeated card grid.
 *
 * On mobile, collapses to a vertical accordion-style list.
 */

type Industry = {
  title: string;
  short: string;
  pain: string;
  opportunity: string;
  solution: string;
  href: string;
};

export function IndustriesRail({
  eyebrow,
  title,
  titleId,
  description,
  industries,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  industries: readonly Industry[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);

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
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line bg-surface-tint p-6 sm:p-8">
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
                  Active vertical
                </p>
                <h3 className="mt-1 text-xl font-semibold text-graphite">
                  {industries[active].title}
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Pain point
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">
                    {industries[active].pain}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Opportunity
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">
                    {industries[active].opportunity}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Taskcover solution
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">
                    {industries[active].solution}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Link
                  href={industries[active].href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline"
                >
                  View {industries[active].short}
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