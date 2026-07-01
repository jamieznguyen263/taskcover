"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2, Target, Workflow } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Search Growth Playbook.
 *
 * Replaces the uniform 3-column card grid with a playbook system:
 *  - One featured Growth Play panel (challenge → strategy → output)
 *  - Remaining plays in a stacked rail / command-list selector
 *  - Selecting/hovering a rail item updates the featured panel
 *  - Shows each play's connection to the Taskcover Search Operating System
 *
 * Tactile depth: gradient border on the active panel, layered cards.
 */

type Play = {
  title: string;
  tag: string;
  challenge: string;
  strategy: string;
  output: string;
  systemStages: readonly string[];
  cta: { label: string; href: string };
};

export function GrowthPlaybook({
  eyebrow,
  title,
  titleId,
  description,
  featured,
  plays,
  labels,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  featured: Play;
  plays: readonly Play[];
  labels?: {
    featuredPlay: string;
    challenge: string;
    strategy: string;
    output: string;
    connectedToSystem: string;
  };
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const all = [featured, ...plays];
  const [active, setActive] = React.useState(0);
  const current = all[active];
  const L = labels ?? {
    featuredPlay: "Featured play",
    challenge: "Challenge",
    strategy: "Strategy",
    output: "Output",
    connectedToSystem: "Connected to the Search Operating System",
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

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Play selector rail */}
        <div className="flex flex-col gap-2" role="tablist" aria-label="Growth plays">
          {all.map((play, i) => {
            const isActive = active === i;
            return (
              <button
                key={play.title}
                type="button"
                role="tab"
                aria-selected={isActive}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn(
                  "group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200",
                  isActive
                    ? "border-brand-teal/40 bg-white shadow-[0_8px_24px_-16px_rgba(24,138,172,0.4)]"
                    : "border-transparent bg-transparent hover:bg-white/60"
                )}
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-graphite">{play.title}</span>
                  <span className="inline-flex w-fit items-center rounded-full bg-surface-tint px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                    {play.tag}
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

        {/* Featured play panel */}
        <div className="relative rounded-2xl bg-brand-gradient p-px shadow-sm">
          <div className="h-full w-full rounded-[15px] bg-white p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col gap-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                      {L.featuredPlay}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-graphite">
                      {current.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-tint px-3 py-1 text-[11px] font-semibold text-graphite">
                    <Target className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                    {current.tag}
                  </span>
                </div>

                {/* Challenge → Strategy → Output flow — color-coded with accent bars */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="relative overflow-hidden rounded-xl border border-amber-200/60 bg-amber-50/60 p-4">
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-amber-400/70" />
                    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      {L.challenge}
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">{current.challenge}</p>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-brand-blue/20 bg-brand-blue/[0.04] p-4">
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-teal/70" />
                    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                      <Target className="h-3 w-3" aria-hidden="true" />
                      {L.strategy}
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">{current.strategy}</p>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-brand-emerald/20 bg-brand-emerald/[0.05] p-4">
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-emerald/70" />
                    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-emerald">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      {L.output}
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">{current.output}</p>
                  </div>
                </div>

                {/* System connection */}
                <div className="flex flex-col gap-2 rounded-xl border border-line-soft bg-surface-tint/30 p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                    <Workflow className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                    {L.connectedToSystem}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {current.systemStages.map((stage, i) => (
                      <React.Fragment key={stage}>
                        <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-[11px] font-medium text-graphite">
                          {stage}
                        </span>
                        {i < current.systemStages.length - 1 && (
                          <span className="self-center text-muted" aria-hidden="true">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-1">
                  <Link
                    href={current.cta.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline"
                  >
                    {current.cta.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Container>
  );
}