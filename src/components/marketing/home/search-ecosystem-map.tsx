"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { cn } from "@/lib/utils";

/**
 * Search Ecosystem Map.
 *
 * Renders the fragmented modern search landscape as an interactive network:
 * a central "Your brand" hub with satellite surfaces (Google, AI, Local, etc.)
 * connected by animated SVG lines. This replaces a flat card grid and makes
 * the "search has changed" message tangible.
 *
 * On mobile, falls back to a clean radial list so it stays legible.
 */

type Surface = {
  id: string;
  label: string;
  note: string;
  /** Position on the ring (0-360 degrees, 0 = top) */
  angle: number;
};

const surfaces: Surface[] = [
  { id: "google", label: "Google Organic", note: "Core SERP visibility", angle: 0 },
  { id: "ai", label: "AI Overviews", note: "AI-assisted discovery", angle: 40 },
  { id: "llm", label: "ChatGPT & LLMs", note: "Generative answers", angle: 80 },
  { id: "local", label: "Local Results", note: "Maps & local pack", angle: 120 },
  { id: "reviews", label: "Review Platforms", note: "Trust & reputation", angle: 160 },
  { id: "youtube", label: "YouTube", note: "Video search", angle: 200 },
  { id: "forums", label: "Reddit & Forums", note: "Community search", angle: 240 },
  { id: "press", label: "Publications", note: "Editorial authority", angle: 280 },
  { id: "landing", label: "Landing Pages", note: "Conversion intent", angle: 320 },
];

// Ring geometry (viewBox 0 0 400 400, center 200,200)
const CX = 200;
const CY = 200;
const RING_RADIUS = 140;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function SearchEcosystemMap({
  eyebrow,
  title,
  titleId,
  description,
  message,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  message: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.5,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.6, delay: 0.2 + i * 0.05, ease: "easeOut" as const },
    }),
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.6 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.3 + i * 0.05 },
    }),
  };

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

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Network map (desktop) / list (mobile) */}
        <div className="order-2 lg:order-1">
          {/* Desktop SVG network */}
          <div className="hidden lg:block">
            <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-md" role="img" aria-labelledby="ecosystem-map-title">
              <title id="ecosystem-map-title">Search ecosystem network map</title>
              {/* Connection lines */}
              {surfaces.map((s, i) => {
                const pos = polarToCartesian(CX, CY, RING_RADIUS, s.angle);
                const isActive = activeId === s.id;
                return (
                  <motion.line
                    key={`line-${s.id}`}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                    x1={CX}
                    y1={CY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isActive ? "#10E66A" : "#188AAC"}
                    strokeWidth={isActive ? 2 : 1}
                    className="flow-line"
                    style={{ opacity: isActive ? 0.8 : 0.4 }}
                  />
                );
              })}

              {/* Center hub */}
              <motion.g
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <circle cx={CX} cy={CY} r="38" fill="url(#hubGrad)" />
                <circle cx={CX} cy={CY} r="38" fill="none" stroke="#188AAC" strokeWidth="1" opacity="0.3" />
                <text x={CX} y={CY - 4} textAnchor="middle" className="fill-graphite text-[10px] font-bold">
                  Your
                </text>
                <text x={CX} y={CY + 8} textAnchor="middle" className="fill-graphite text-[10px] font-bold">
                  Brand
                </text>
              </motion.g>

              <defs>
                <radialGradient id="hubGrad">
                  <stop offset="0%" stopColor="#10E66A" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#197DB4" stopOpacity="0.08" />
                </radialGradient>
              </defs>

              {/* Satellite nodes */}
              {surfaces.map((s, i) => {
                const pos = polarToCartesian(CX, CY, RING_RADIUS, s.angle);
                const isActive = activeId === s.id;
                return (
                  <motion.g
                    key={s.id}
                    custom={i}
                    variants={nodeVariants}
                    initial="hidden"
                    animate="visible"
                    onMouseEnter={() => setActiveId(s.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 8 : 6}
                      fill={isActive ? "#10E66A" : "#FFFFFF"}
                      stroke="#188AAC"
                      strokeWidth="1.5"
                      className="transition-all"
                    />
                    {isActive && (
                      <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#10E66A" strokeWidth="1" opacity="0.4" />
                    )}
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Mobile radial list */}
          <ul className="grid grid-cols-2 gap-2 lg:hidden">
            {surfaces.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-0.5 rounded-xl border border-line bg-white p-3"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-graphite">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" aria-hidden="true" />
                  {s.label}
                </span>
                <span className="text-[11px] text-muted">{s.note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Active surface detail / default list */}
        <div className="order-1 lg:order-2">
          <GradientBorderCard>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-brand-teal">
                {activeId
                  ? surfaces.find((s) => s.id === activeId)?.label
                  : "Nine surfaces. One system."}
              </p>
              <p className="text-base leading-relaxed text-secondary">
                {activeId
                  ? surfaces.find((s) => s.id === activeId)?.note
                  : "Hover the map to see how each surface connects to your brand. Taskcover does not treat them as separate channels — they are one connected search growth system."}
              </p>
              <p className="border-t border-line-soft pt-4 text-base font-medium text-graphite">
                {message}
              </p>
            </div>
          </GradientBorderCard>
        </div>
      </div>
    </Container>
  );
}