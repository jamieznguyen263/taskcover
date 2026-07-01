"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { cn } from "@/lib/utils";

/**
 * Search Ecosystem Map — floating DNA / knowledge-graph feel.
 *
 * Renders the fragmented modern search landscape as an interactive network:
 * a central "Your brand" hub with satellite surfaces (Google, AI, Local, etc.)
 * connected by gentle, breathing SVG lines.
 *
 * Motion philosophy:
 *  - Nodes drift very slightly (organic, floating)
 *  - Line connections breathe/sway gently (opacity, not stroke-dash blinking)
 *  - Hub has subtle breathing glow, not flashing
 *  - No strong blinking/pulsing toward the hub
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
          {/* Desktop SVG network — floating DNA / knowledge-graph */}
          <div className="hidden lg:block">
            <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-md" role="img" aria-labelledby="ecosystem-map-title">
              <title id="ecosystem-map-title">Search ecosystem network map</title>

              {/* Connection lines — gentle breathing opacity, no blinking dash */}
              {surfaces.map((s, i) => {
                const pos = polarToCartesian(CX, CY, RING_RADIUS, s.angle);
                const isActive = activeId === s.id;
                return (
                  <motion.line
                    key={`line-${s.id}`}
                    x1={CX}
                    y1={CY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isActive ? "#10E66A" : "#188AAC"}
                    strokeWidth={isActive ? 2 : 1.25}
                    initial={{ opacity: 0 }}
                    animate={
                      reduceMotion
                        ? { opacity: isActive ? 0.7 : 0.35 }
                        : {
                            opacity: isActive
                              ? [0.65, 0.8, 0.65]
                              : [0.3, 0.45, 0.3],
                          }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 4 + (i % 3),
                            repeat: Infinity,
                            ease: "easeInOut" as const,
                            delay: i * 0.3,
                          }
                    }
                  />
                );
              })}

              {/* Center hub — subtle breathing glow */}
              <motion.g
                initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Breathing halo */}
                {!reduceMotion && (
                  <motion.circle
                    cx={CX}
                    cy={CY}
                    r="48"
                    fill="url(#hubGrad)"
                    animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.06, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
                    style={{ transformOrigin: `${CX}px ${CY}px` }}
                  />
                )}
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

              {/* Satellite nodes — gentle floating drift */}
              {surfaces.map((s, i) => {
                const pos = polarToCartesian(CX, CY, RING_RADIUS, s.angle);
                const isActive = activeId === s.id;
                return (
                  <motion.g
                    key={s.id}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                    animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    onMouseEnter={() => setActiveId(s.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className="cursor-pointer"
                  >
                    {/* Floating wrapper — gentle organic drift */}
                    <motion.g
                      animate={
                        reduceMotion
                          ? {}
                          : {
                              x: [0, 1.5, 0, -1.5, 0],
                              y: [0, -1.5, 0, 1.5, 0],
                            }
                      }
                      transition={{
                        duration: 6 + (i % 4),
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                        delay: i * 0.4,
                      }}
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