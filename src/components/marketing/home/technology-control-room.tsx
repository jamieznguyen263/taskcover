"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Monitor, Target } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Technology — Search Intelligence control-room.
 *
 * Tabbed layout: left list of module tabs, right detail panel.
 * The detail panel is content-rich with a two-column internal layout:
 *  - Left: title, summary, capability bullets, business decision
 *  - Right: mini visual related to the module
 *
 * Each module includes capabilities, monitoring points, and the business
 * decision it supports — so it feels like a real intelligence layer.
 */

type Module = {
  id: string;
  title: string;
  detail: string;
  capabilities?: readonly string[];
  monitors?: string;
  decision?: string;
  visual?: string;
};

/* --- Mini visuals per module (illustrative, no fake numbers) --- */

function MiniVisual({ type }: { type: string }) {
  switch (type) {
    case "crawl-health":
      return (
        <div className="flex flex-col gap-2">
          {["Indexed", "Crawled", "Orphaned"].map((label, i) => {
            const pct = [92, 85, 8][i];
            const color = ["bg-brand-emerald", "bg-brand-teal", "bg-amber-400"][i];
            return (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-medium text-secondary">{label}</span>
                  <span className="text-muted">{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                  <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    case "intent-matrix":
      return (
        <div className="grid grid-cols-3 gap-1.5">
          {["Commercial", "Info", "Trans."].map((label, i) => (
            <div key={label} className="rounded-lg border border-line bg-white p-2 text-center">
              <p className="text-[9px] font-medium text-muted">{label}</p>
              <p className="mt-1 text-sm font-semibold text-graphite">{[62, 71, 48][i]}%</p>
            </div>
          ))}
        </div>
      );
    case "ai-coverage":
      return (
        <div className="flex flex-col gap-2">
          {["Your Brand", "Competitor A", "Competitor B"].map((label, i) => (
            <div key={label} className="flex items-center justify-between text-[10px]">
              <span className="font-medium text-secondary">{label}</span>
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, dot) => (
                  <span
                    key={dot}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      dot < [7, 4, 6][i] ? "bg-brand-emerald" : "bg-line-soft",
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "cluster-coverage":
      return (
        <div className="flex flex-wrap gap-1.5">
          {["Pillar A", "Cluster 1", "Cluster 2", "Cluster 3", "Gap", "Gap"].map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-md px-2 py-1 text-[9px] font-medium",
                tag === "Gap"
                  ? "border border-amber-300 bg-amber-50 text-amber-700"
                  : "border border-line bg-surface-tint text-graphite",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      );
    case "serp-comparison":
      return (
        <div className="flex flex-col gap-1.5">
          {["Organic", "Featured", "Local Pack", "AI Overview"].map((label, i) => (
            <div key={label} className="flex items-center justify-between rounded-md border border-line bg-white px-2 py-1.5 text-[10px]">
              <span className="font-medium text-secondary">{label}</span>
              <span className="font-semibold text-graphite">{["Active", "Tracking", "Tracking", "Tracking"][i]}</span>
            </div>
          ))}
        </div>
      );
    case "kpi-dashboard":
      return (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Visibility", value: "↑" },
            { label: "Authority", value: "↑" },
            { label: "Leads", value: "↑" },
            { label: "Revenue", value: "↑" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-line bg-white p-2 text-center">
              <p className="text-[9px] text-muted">{kpi.label}</p>
              <p className="text-sm font-bold text-brand-emerald">{kpi.value}</p>
            </div>
          ))}
        </div>
      );
    case "funnel-chart":
      return (
        <div className="flex flex-col gap-1">
          {["Visits", "Engaged", "Leads", "Customers"].map((label, i) => {
            const width = [100, 65, 28, 12][i];
            return (
              <div key={label} className="flex items-center gap-2">
                <span className="w-16 text-[9px] font-medium text-muted">{label}</span>
                <div className="flex-1">
                  <div
                    className="h-4 rounded bg-gradient-to-r from-brand-green to-brand-teal"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    case "mention-graph":
      return (
        <svg viewBox="0 0 120 80" className="h-20 w-full" role="img" aria-label="Mention graph">
          <circle cx="20" cy="40" r="8" fill="#10E66A" opacity="0.3" stroke="#188AAC" strokeWidth="1" />
          {[{ x: 50, y: 20 }, { x: 50, y: 55 }, { x: 85, y: 35 }, { x: 100, y: 60 }].map((p, i) => (
            <g key={i}>
              <line x1="28" y1="40" x2={p.x - 6} y2={p.y} stroke="#10E66A" strokeWidth="1" opacity="0.4" />
              <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#10E66A" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      );
    default:
      return null;
  }
}

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

      <div className="grid gap-4 rounded-2xl border border-line bg-surface-tint p-4 lg:grid-cols-[260px_1fr]">
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
                    : "border-transparent bg-transparent hover:bg-white/60",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold",
                    isActive ? "bg-brand-gradient text-white" : "bg-surface-tint text-muted",
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

        {/* Detail panel — two-column: content + mini visual */}
        <div className="relative min-h-[280px] rounded-xl border border-line bg-white p-6">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid h-full gap-6 sm:grid-cols-[1.3fr_1fr]"
            >
              {/* Left: content */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Active module
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-graphite">{current.title}</h3>
                <p className="text-sm leading-relaxed text-secondary">{current.detail}</p>

                {/* Capabilities */}
                {current.capabilities && current.capabilities.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                      Capabilities
                    </p>
                    <ul className="grid gap-1.5">
                      {current.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2 text-xs text-secondary">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-brand-teal" aria-hidden="true" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What we monitor */}
                {current.monitors && (
                  <div className="flex flex-col gap-1.5 rounded-lg border border-line-soft bg-surface-tint/50 p-3">
                    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      <Monitor className="h-3 w-3" aria-hidden="true" />
                      What we monitor
                    </p>
                    <p className="text-xs text-secondary">{current.monitors}</p>
                  </div>
                )}

                {/* Business decision */}
                {current.decision && (
                  <div className="flex flex-col gap-1.5 rounded-lg border border-brand-teal/20 bg-brand-teal/[0.04] p-3">
                    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                      <Target className="h-3 w-3" aria-hidden="true" />
                      Business decision it supports
                    </p>
                    <p className="text-xs text-secondary">{current.decision}</p>
                  </div>
                )}
              </div>

              {/* Right: mini visual */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Module preview
                </p>
                <div className="flex h-full flex-col justify-center rounded-lg border border-line-soft bg-surface-tint/50 p-4">
                  {current.visual && <MiniVisual type={current.visual} />}
                </div>
              </div>
            </motion.div>
        </div>
      </div>
    </Container>
  );
}