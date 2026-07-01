"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUp, Gauge, Search, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bright "Search Intelligence Command Center" mockup for the hero.
 *
 * Designed to feel like a premium SEO intelligence platform (Semrush/Ahrefs
 * logic) while staying on-brand: green → emerald → teal → blue.
 *
 * Growth-oriented illustrative metrics (not real client results):
 *  - Top KPI row: Search Volume, Organic Visibility, AI Visibility, Site Health
 *  - Main chart: organic visibility / search demand trend (upward)
 *  - Score module: AI Search, Audit, Authority as compact score rows
 *  - Keyword opportunity list + search intent distribution
 *
 * All metrics are illustrative for the product visual only. A single subtle
 * disclaimer is used instead of scattered "demo"/"placeholder" labels.
 *
 * Accessibility: respects prefers-reduced-motion.
 */

const visibilityTrend = [
  { m: "Jan", v: 72, d: 150 },
  { m: "Feb", v: 76, d: 166 },
  { m: "Mar", v: 81, d: 178 },
  { m: "Apr", v: 84, d: 191 },
  { m: "May", v: 87, d: 204 },
  { m: "Jun", v: 89, d: 218 },
  { m: "Jul", v: 90, d: 240 },
];

type TooltipPayloadItem = {
  dataKey?: string | number;
  name?: string;
  value?: string | number;
  color?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-graphite">{label}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="text-muted">
          <span
            className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
            style={{ background: p.color }}
          />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

/* Compact score row — replaces rings to avoid overflow, stays inside the card */
function ScoreRow({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: number;
  delta: string;
  tone: "brand" | "teal" | "blue";
}) {
  const barFrom =
    tone === "brand"
      ? "from-brand-green"
      : tone === "teal"
        ? "from-brand-teal"
        : "from-brand-blue";
  const valueColor =
    tone === "brand"
      ? "text-brand-emerald"
      : tone === "teal"
        ? "text-brand-teal"
        : "text-brand-blue";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-secondary">{label}</span>
        <span className="inline-flex items-center gap-1">
          <span className={cn("text-sm font-semibold", valueColor)}>{value}%</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-emerald/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-emerald">
            <ArrowUp className="h-2.5 w-2.5" aria-hidden="true" />
            {delta}
          </span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
        <motion.span
          className={cn("h-full rounded-full bg-gradient-to-r to-brand-teal", barFrom)}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function SearchDashboardMockup({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.07,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const moduleVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className={cn("perspective-1000 relative", className)}>
      {/* Soft gradient halo behind the whole module */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-gradient-soft blur-2xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative overflow-hidden rounded-3xl border border-line bg-white/95 p-4 backdrop-blur-sm sm:p-5",
          "depth-layered halo-soft",
        )}
      >
        {/* Top status bar */}
        <motion.div
          variants={moduleVariants}
          className="mb-4 flex items-center justify-between rounded-xl border border-line-soft bg-surface-tint px-4 py-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-brand-emerald" />
            <span className="text-xs font-semibold text-graphite">
              Search Intelligence Command Center
            </span>
          </div>
          <span className="hidden items-center gap-1 text-[11px] font-medium text-muted sm:inline-flex">
            <Search className="h-3 w-3 text-brand-teal" aria-hidden="true" />
            Unified search overview
          </span>
        </motion.div>

        {/* Top KPI row */}
        <motion.div
          variants={moduleVariants}
          className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            { label: "Search Volume", value: "240K", icon: Search, tone: "text-brand-teal", delta: "+18%" },
            { label: "Organic Visibility", value: "90", icon: TrendingUp, tone: "text-brand-emerald", suffix: "%", delta: "+22 pts" },
            { label: "AI Visibility", value: "95", icon: Sparkles, tone: "text-brand-blue", suffix: "%", delta: "+31 pts" },
            { label: "Site Health", value: "98", icon: Gauge, tone: "text-brand-teal", suffix: "%", delta: "+6 pts" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="card-lift rounded-xl border border-line bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
                  {kpi.label}
                </span>
                <kpi.icon className={cn("h-3.5 w-3.5", kpi.tone)} aria-hidden="true" />
              </div>
              <div className="mt-1.5 flex items-end justify-between gap-1">
                <p className="text-2xl font-semibold tracking-tight text-graphite">
                  {kpi.value}
                  {kpi.suffix ? (
                    <span className="text-sm font-medium text-muted">{kpi.suffix}</span>
                  ) : null}
                </p>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-emerald/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-emerald">
                  <ArrowUp className="h-2.5 w-2.5" aria-hidden="true" />
                  {kpi.delta}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main chart + score module */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Visibility trend — main feature */}
          <motion.div variants={moduleVariants} className="lg:col-span-2">
            <div className="card-lift h-full rounded-2xl border border-line bg-white p-5 ring-brand-glow">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-graphite">
                    Organic visibility trend
                  </p>
                  <p className="text-xs text-muted">Demand-weighted share of voice</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-brand-emerald">
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  +18 pts
                </span>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visibilityTrend} margin={{ top: 6, right: 6, bottom: 0, left: -22 }}>
                    <defs>
                      <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10E66A" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#197DB4" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E5EEF3" vertical={false} />
                    <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="v"
                      name="Visibility"
                      stroke="#10E66A"
                      strokeWidth={2.5}
                      fill="url(#visGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Score module — compact rows instead of rings to prevent overflow */}
          <motion.div variants={moduleVariants}>
            <div className="card-lift flex h-full flex-col rounded-2xl border border-line bg-white p-5 ring-brand-glow">
              <p className="text-sm font-semibold text-graphite">Search scores</p>
              <p className="text-xs text-muted">AI, audit, and authority signals</p>
              <div className="mt-4 flex flex-col gap-4">
                <ScoreRow label="AI Search Score" value={95} delta="12 pts" tone="brand" />
                <ScoreRow label="Audit Score" value={98} delta="4 pts" tone="teal" />
                <ScoreRow label="Authority Score" value={92} delta="9 pts" tone="blue" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary row: keyword opportunities + intent distribution */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Keyword opportunity / content gap list */}
          <motion.div variants={moduleVariants}>
            <div className="card-lift h-full rounded-2xl border border-line bg-white p-5 ring-brand-glow">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-graphite">
                  Keyword opportunities
                </p>
                <span className="rounded-full bg-brand-emerald/10 px-2 py-0.5 text-[10px] font-medium text-brand-emerald">
                  Growth
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  { kw: "enterprise seo platform", vol: "12.4K", diff: 42 },
                  { kw: "ai search optimization", vol: "8.9K", diff: 38 },
                  { kw: "technical seo audit", vol: "6.1K", diff: 51 },
                ].map((row) => (
                  <li
                    key={row.kw}
                    className="flex items-center justify-between rounded-lg border border-line-soft bg-surface-tint/50 px-3 py-2"
                  >
                    <span className="truncate text-xs font-medium text-graphite">
                      {row.kw}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] text-muted">{row.vol}/mo</span>
                      <span
                        className={cn(
                          "inline-flex h-1.5 w-10 overflow-hidden rounded-full bg-line-soft",
                        )}
                        aria-hidden="true"
                      >
                        <span
                          className="h-full rounded-full bg-brand-gradient"
                          style={{ width: `${row.diff}%` }}
                        />
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Search intent distribution */}
          <motion.div variants={moduleVariants}>
            <div className="card-lift h-full rounded-2xl border border-line bg-white p-5 ring-brand-glow">
              <p className="text-sm font-semibold text-graphite">
                Search intent distribution
              </p>
              <p className="text-xs text-muted">Share of qualified demand</p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  { label: "Commercial", pct: 62, tone: "bg-brand-green" },
                  { label: "Informational", pct: 71, tone: "bg-brand-teal" },
                  { label: "Transactional", pct: 48, tone: "bg-brand-blue" },
                ].map((row) => (
                  <li key={row.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-graphite">{row.label}</span>
                      <span className="text-muted">{row.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                      <motion.span
                        className={cn("h-full rounded-full", row.tone)}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <p className="mt-4 px-1 text-[11px] text-muted">
          Illustrative dashboard preview — verified client data is added only with permission.
        </p>
      </motion.div>
    </div>
  );
}