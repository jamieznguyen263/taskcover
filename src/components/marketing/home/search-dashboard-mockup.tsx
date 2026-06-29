"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Bot, Gauge, MapPin, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/marketing/shared/dashboard-card";
import { MetricCard } from "@/components/marketing/shared/metric-card";
import { cn } from "@/lib/utils";

/**
 * Bright "Search Intelligence Command Center" mockup for the hero.
 *
 * IMPORTANT: All metrics shown are illustrative demo data for the product
 * visual only. They are NOT claims about real client results. Numbers must be
 * replaced with verified, attributable data before any marketing claim is made
 * on a live page. See docs/SEO_STANDARDS.md.
 */

const visibilityTrend = [
  { m: "Jan", v: 48 },
  { m: "Feb", v: 52 },
  { m: "Mar", v: 57 },
  { m: "Apr", v: 61 },
  { m: "May", v: 66 },
  { m: "Jun", v: 72 },
  { m: "Jul", v: 78 },
];

const keywordIntent = [
  { m: "Jan", commercial: 22, informational: 41, transactional: 12 },
  { m: "Feb", commercial: 26, informational: 44, transactional: 15 },
  { m: "Mar", commercial: 31, informational: 47, transactional: 18 },
  { m: "Apr", commercial: 35, informational: 49, transactional: 22 },
  { m: "May", commercial: 39, informational: 51, transactional: 25 },
  { m: "Jun", commercial: 43, informational: 53, transactional: 29 },
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

export function SearchDashboardMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-line bg-white p-3 shadow-[0_30px_80px_-40px_rgba(24,138,172,0.45)] sm:p-4",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl bg-brand-gradient-soft opacity-60"
      />
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Visibility trend */}
        <DashboardCard
          className="lg:col-span-4"
          title="Organic visibility trend"
          subtitle="Illustrative demo data"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-tint px-2 py-1 text-[11px] font-semibold text-brand-teal">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +30 pts
            </span>
          }
        >
          <div className="h-40">
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
                  stroke="#188AAC"
                  strokeWidth={2}
                  fill="url(#visGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Scores column */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <MetricCard
            label="AI readiness"
            value="—"
            tone="brand"
            footnote="Demo score"
          />
          <MetricCard
            label="Technical health"
            value="—"
            tone="teal"
            footnote="Demo score"
          />
          <div className="col-span-2 flex items-center gap-2 rounded-xl border border-line bg-surface-tint p-3 text-xs text-muted">
            <Bot className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            Scores are placeholders until verified data is connected.
          </div>
        </div>

        {/* Keyword opportunity map */}
        <DashboardCard
          className="lg:col-span-3"
          title="Keyword opportunity map"
          subtitle="Commercial · Informational · Transactional"
        >
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keywordIntent} margin={{ top: 6, right: 6, bottom: 0, left: -22 }}>
                <CartesianGrid stroke="#E5EEF3" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="commercial" name="Commercial" stroke="#10E66A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="informational" name="Informational" stroke="#188AAC" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="transactional" name="Transactional" stroke="#197DB4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Mini stat tiles */}
        <DashboardCard
          className="lg:col-span-3"
          title="Search coverage"
          subtitle="Surface mix (illustrative)"
        >
          <ul className="grid grid-cols-2 gap-3">
            {[
              { icon: Activity, label: "Content authority coverage", value: "—" },
              { icon: Gauge, label: "Revenue / lead attribution", value: "—" },
              { icon: MapPin, label: "Local pack presence", value: "—" },
              { icon: Bot, label: "AI answer presence", value: "—" },
            ].map((tile) => (
              <li
                key={tile.label}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface-tint p-3"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  <tile.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-muted">
                    {tile.label}
                  </span>
                  <span className="text-sm font-semibold text-graphite">
                    {tile.value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>

      <p className="relative mt-3 px-1 text-[11px] text-muted">
        Demo visualization only — replace with verified data before publishing
        performance claims.
      </p>
    </div>
  );
}