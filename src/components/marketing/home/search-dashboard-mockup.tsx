"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Gauge, Search, Sparkles, TrendingUp } from "lucide-react";
import type { HomeContent } from "@/content/home.types";
import { cn } from "@/lib/utils";

type DashboardContent = HomeContent["dashboard"];
type Signal = DashboardContent["signals"][number];

const iconMap = {
  search: Search,
  trend: TrendingUp,
  sparkles: Sparkles,
  gauge: Gauge,
} satisfies Record<Signal["icon"], typeof Search>;

const toneStyles = {
  green: {
    icon: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    fill: "bg-brand-green",
    text: "text-brand-emerald",
  },
  emerald: {
    icon: "text-brand-emerald",
    bg: "bg-brand-emerald/10",
    border: "border-brand-emerald/20",
    fill: "bg-brand-emerald",
    text: "text-brand-emerald",
  },
  teal: {
    icon: "text-brand-teal",
    bg: "bg-brand-teal/10",
    border: "border-brand-teal/20",
    fill: "bg-brand-teal",
    text: "text-brand-teal",
  },
  blue: {
    icon: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    fill: "bg-brand-blue",
    text: "text-brand-blue",
  },
} satisfies Record<Signal["tone"], Record<"icon" | "bg" | "border" | "fill" | "text", string>>;

function SignalCard({ signal }: { signal: Signal }) {
  const Icon = iconMap[signal.icon];
  const tone = toneStyles[signal.tone];

  return (
    <div className="rounded-xl border border-line bg-white p-3.5 shadow-[0_10px_24px_-20px_rgba(24,138,172,0.45)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {signal.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-graphite">
            {signal.value}
          </p>
        </div>
        <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg border", tone.bg, tone.border)}>
          <Icon className={cn("h-4 w-4", tone.icon)} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="truncate text-[11px] text-secondary">{signal.status}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tone.bg, tone.text)}>
          {signal.delta}
        </span>
      </div>
    </div>
  );
}

function ProgressRow({
  row,
  index,
  reduceMotion,
}: {
  row: DashboardContent["entityRows"][number];
  index: number;
  reduceMotion: boolean | null;
}) {
  const width = 68 + index * 9;

  return (
    <li className="rounded-lg border border-line-soft bg-surface-tint/60 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-xs font-semibold text-graphite">{row.label}</span>
        <span className="shrink-0 text-xs font-semibold text-brand-teal">{row.value}</span>
      </div>
      <p className="mt-1 truncate text-[11px] text-secondary">{row.status}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-soft">
        <motion.span
          className="block h-full rounded-full bg-brand-gradient"
          style={{ width: `${width}%` }}
          initial={false}
          animate={{ width: `${width}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: index * 0.08 }}
        />
      </div>
    </li>
  );
}

export function SearchDashboardMockup({
  dashboard,
  className,
}: {
  dashboard: DashboardContent;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const moduleVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className={cn("perspective-1000 relative", className)} aria-label={dashboard.title}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-gradient-soft blur-2xl"
      />

      <motion.div className="relative overflow-hidden rounded-3xl border border-line bg-white/95 p-4 shadow-[0_30px_80px_-40px_rgba(24,138,172,0.45)] backdrop-blur-sm sm:p-5">
        <motion.div
          variants={moduleVariants}
          className="mb-4 rounded-xl border border-line-soft bg-surface-tint px-4 py-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-brand-emerald" />
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                  {dashboard.title}
                </p>
              </div>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-secondary">
                {dashboard.subtitle}
              </p>
            </div>
            <span className="hidden rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted sm:inline-flex">
              {dashboard.signals[0]?.status}
            </span>
          </div>
        </motion.div>

        <motion.div variants={moduleVariants} className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dashboard.signals.map((signal) => (
            <SignalCard key={signal.label} signal={signal} />
          ))}
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
          <motion.section
            variants={moduleVariants}
            className="rounded-2xl border border-line bg-white p-4 ring-brand-glow"
            aria-labelledby="search-dashboard-opportunities"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="search-dashboard-opportunities" className="text-sm font-semibold text-graphite">
                  {dashboard.opportunityTitle}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-secondary">
                  {dashboard.opportunitySubtitle}
                </p>
              </div>
              <span className="rounded-full bg-brand-teal/10 px-2 py-0.5 text-[10px] font-semibold text-brand-teal">
                {dashboard.labels.value}
              </span>
            </div>

            <div className="relative mt-4 h-56 overflow-hidden rounded-xl border border-line-soft bg-surface-tint">
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="dashboard-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10e66a" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#197db4" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
                <path
                  d="M 36 132 C 110 74, 172 50, 246 82 S 360 150, 430 106"
                  fill="none"
                  stroke="url(#dashboard-line)"
                  strokeWidth="2"
                  strokeDasharray="7 7"
                  className={cn(!reduceMotion && "flow-line")}
                />
                <line x1="12%" y1="78%" x2="88%" y2="22%" stroke="#ddeaf0" strokeWidth="1" />
                <line x1="12%" y1="22%" x2="88%" y2="78%" stroke="#ddeaf0" strokeWidth="1" />
              </svg>

              {dashboard.opportunities.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line bg-white/95 p-2 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, delay: index * 0.06 }}
                >
                  <p className="truncate text-[11px] font-semibold text-graphite">{item.label}</p>
                  <p className="truncate text-[10px] text-secondary">{item.intent}</p>
                  <span className="mt-1 inline-flex rounded-full bg-brand-emerald/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-emerald">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            variants={moduleVariants}
            className="rounded-2xl border border-line bg-white p-4 ring-brand-glow"
            aria-labelledby="search-dashboard-entity"
          >
            <h2 id="search-dashboard-entity" className="text-sm font-semibold text-graphite">
              {dashboard.entityTitle}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-secondary">
              {dashboard.entitySubtitle}
            </p>
            <ul className="mt-4 grid gap-2">
              {dashboard.entityRows.map((row, index) => (
                <ProgressRow
                  key={row.label}
                  row={row}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </ul>
          </motion.section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.88fr]">
          <motion.section
            variants={moduleVariants}
            className="rounded-2xl border border-line bg-white p-4 ring-brand-glow"
            aria-labelledby="search-dashboard-queue"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="search-dashboard-queue" className="text-sm font-semibold text-graphite">
                  {dashboard.queueTitle}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-secondary">
                  {dashboard.queueSubtitle}
                </p>
              </div>
              <Sparkles className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            </div>
            <ul className="mt-4 grid gap-2">
              {dashboard.queueRows.map((row) => (
                <li
                  key={row.task}
                  className="rounded-lg border border-line-soft bg-surface-tint/55 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-graphite">{row.task}</p>
                    <p className="mt-1 text-[11px] text-secondary">{row.status}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                    <span className="rounded-full bg-brand-emerald/10 px-2 py-0.5 text-brand-emerald">
                      {dashboard.labels.impact}: {row.impact}
                    </span>
                    <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-brand-blue">
                      {dashboard.labels.effort}: {row.effort}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            variants={moduleVariants}
            className="rounded-2xl border border-line bg-white p-4 ring-brand-glow"
            aria-labelledby="search-dashboard-path"
          >
            <h2 id="search-dashboard-path" className="text-sm font-semibold text-graphite">
              {dashboard.pathTitle}
            </h2>
            <ol className="mt-4 grid gap-2">
              {dashboard.pathSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="min-w-0 text-xs font-semibold text-graphite">{step}</span>
                  {index < dashboard.pathSteps.length - 1 && (
                    <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-brand-teal" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </motion.section>
        </div>

        <p className="mt-4 px-1 text-[11px] leading-relaxed text-muted">
          {dashboard.disclosure}
        </p>
      </motion.div>
    </div>
  );
}
