"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Technology — Search Intelligence control-room.
 *
 * Replaces the repeated 8-card grid with a tabbed control-room layout:
 * a left list of module tabs and a right detail panel. Selecting a module
 * shows its detail. Avoids repeating the same phrase across modules.
 */

type Module = {
  id: string;
  title: string;
  detail: string;
};

export function TechnologyControlRoom({
  eyebrow,
  title,
  description,
  modules,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  modules: readonly Module[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const current = modules[active];

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

      <div className="grid gap-4 rounded-2xl border border-line bg-surface-tint p-4 lg:grid-cols-[280px_1fr]">
        {/* Module list */}
        <div className="flex flex-col gap-1" role="tablist" aria-label="Technology modules">
          {modules.map((m, i) => {
            const isActive = active === i;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all duration-200",
                  isActive
                    ? "border-brand-teal/40 bg-white shadow-[0_8px_24px_-16px_rgba(24,138,172,0.4)]"
                    : "border-transparent bg-transparent hover:bg-white/60"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold",
                    isActive ? "bg-brand-gradient text-white" : "bg-surface-tint text-muted"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("text-sm font-medium", isActive ? "text-graphite" : "text-secondary")}>
                  {m.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="relative min-h-[200px] rounded-xl border border-line bg-white p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Active module
                </span>
              </div>
              <h3 className="text-lg font-semibold text-graphite">{current.title}</h3>
              <p className="text-sm leading-relaxed text-secondary">{current.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}