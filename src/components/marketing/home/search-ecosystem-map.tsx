"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Eye, MousePointerClick, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import type { SearchSurface, SearchSurfaceLabels } from "@/content/home.types";
import { cn } from "@/lib/utils";

const MAP_SIZE = 420;
const CENTER = 210;

const surfaceMotion: {
  radius: number;
  angleOffset: number;
  x: number[];
  y: number[];
  duration: number;
}[] = [
  { radius: 144, angleOffset: -8, x: [0, 9, -4, 3, 0], y: [0, -8, 5, -2, 0], duration: 5.6 },
  { radius: 152, angleOffset: 4, x: [0, -7, 6, -3, 0], y: [0, 7, -6, 3, 0], duration: 6.2 },
  { radius: 132, angleOffset: -5, x: [0, 6, -8, 4, 0], y: [0, -5, 7, -4, 0], duration: 5.9 },
  { radius: 156, angleOffset: 7, x: [0, -9, 4, -6, 0], y: [0, 5, -8, 4, 0], duration: 6.8 },
  { radius: 138, angleOffset: -3, x: [0, 8, -5, 6, 0], y: [0, 8, -6, 2, 0], duration: 6.4 },
  { radius: 150, angleOffset: 6, x: [0, -6, 8, -4, 0], y: [0, -7, 4, 6, 0], duration: 5.7 },
  { radius: 134, angleOffset: -7, x: [0, 7, -9, 2, 0], y: [0, 6, -3, 7, 0], duration: 6.6 },
  { radius: 154, angleOffset: 5, x: [0, -8, 5, -7, 0], y: [0, -4, 8, -5, 0], duration: 6.1 },
  { radius: 140, angleOffset: 2, x: [0, 6, -4, 8, 0], y: [0, -8, 6, -3, 0], duration: 5.8 },
];

function polarToPoint(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function surfacePoint(surface: SearchSurface, index: number) {
  const motion = surfaceMotion[index % surfaceMotion.length];
  return polarToPoint(surface.angle + motion.angleOffset, motion.radius);
}

function toPercent(value: number) {
  return (value / MAP_SIZE) * 100;
}

function connectionPath(point: { x: number; y: number }, index: number) {
  const dx = point.x - CENTER;
  const dy = point.y - CENTER;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const curve = index % 2 === 0 ? 18 : -18;
  const controlX = CENTER + dx * 0.54 + (-dy / length) * curve;
  const controlY = CENTER + dy * 0.54 + (dx / length) * curve;
  return `M ${CENTER} ${CENTER} Q ${controlX.toFixed(1)} ${controlY.toFixed(1)} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
}

function networkPath(from: { x: number; y: number }, to: { x: number; y: number }, index: number) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const curve = index % 2 === 0 ? 14 : -14;
  const controlX = midX + (-dy / length) * curve;
  const controlY = midY + (dx / length) * curve;
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${controlX.toFixed(1)} ${controlY.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

function SurfaceDetail({
  surface,
  labels,
  message,
}: {
  surface: SearchSurface | undefined;
  labels: SearchSurfaceLabels;
  message: React.ReactNode;
}) {
  const detailItems = surface
    ? [
        {
          label: labels.buyersSee,
          value: surface.buyersSee,
          Icon: Eye,
          cardClass: "border-cyan-200/80 bg-[linear-gradient(135deg,rgba(236,254,255,0.92),rgba(239,246,255,0.98))]",
          iconClass: "bg-cyan-500/12 text-cyan-700 ring-cyan-200",
          markerClass: "bg-cyan-500",
        },
        {
          label: labels.taskcoverImproves,
          value: surface.taskcoverImproves,
          Icon: Sparkles,
          cardClass: "border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(240,253,250,0.98))]",
          iconClass: "bg-emerald-500/12 text-emerald-700 ring-emerald-200",
          markerClass: "bg-emerald-500",
        },
        {
          label: labels.growthSupport,
          value: surface.growthSupport,
          Icon: TrendingUp,
          cardClass: "border-teal-200/80 bg-[linear-gradient(135deg,rgba(240,253,244,0.98),rgba(236,254,255,0.96))]",
          iconClass: "bg-brand-teal/10 text-brand-teal ring-brand-teal/20",
          markerClass: "bg-brand-gradient",
        },
      ]
    : [];

  return (
    <GradientBorderCard className="shadow-[0_24px_80px_-48px_rgba(24,138,172,0.65)]">
      <div className="grid gap-5">
        <div className="rounded-[1.25rem] border border-brand-teal/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,253,248,0.9))] p-5">
          <p className="text-sm font-semibold text-brand-teal">
            {surface ? surface.label : labels.defaultTitle}
          </p>
          <p className="mt-2 text-base leading-relaxed text-secondary">
            {surface ? surface.buyersSee : labels.defaultBody}
          </p>
        </div>

        {surface ? (
          <div className="grid gap-3">
            {detailItems.map((item) => (
              <div
                key={item.label}
                className={cn("relative overflow-hidden rounded-2xl border p-4 shadow-sm", item.cardClass)}
              >
                <span
                  aria-hidden="true"
                  className={cn("absolute left-0 top-4 h-9 w-1 rounded-r-full", item.markerClass)}
                />
                <div className="flex items-start gap-3 pl-1">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1",
                      item.iconClass,
                    )}
                  >
                    <item.Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-secondary">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <p className="border-t border-line-soft pt-4 text-base font-medium text-graphite">
          {message}
        </p>
      </div>
    </GradientBorderCard>
  );
}

export function SearchEcosystemMap({
  eyebrow,
  title,
  titleId,
  description,
  message,
  surfaces,
  labels,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  message: React.ReactNode;
  surfaces: readonly SearchSurface[];
  labels: SearchSurfaceLabels;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = React.useState(surfaces[0]?.id);
  const activeSurface = surfaces.find((surface) => surface.id === activeId) ?? surfaces[0];
  const points = surfaces.map(surfacePoint);

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

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div className="order-2 min-w-0 lg:order-1">
          <div className="hidden lg:block">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-teal/25 bg-white px-4 py-2 text-sm font-semibold text-graphite shadow-[0_14px_35px_-28px_rgba(24,138,172,0.8)]">
              <MousePointerClick className="h-4 w-4 text-brand-teal" aria-hidden="true" />
              {labels.desktopGuidance}
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-brand-teal/10 bg-[radial-gradient(circle_at_50%_48%,rgba(16,230,106,0.12),rgba(236,254,255,0.68)_38%,rgba(255,255,255,0.92)_72%)] shadow-[inset_0_0_90px_rgba(24,138,172,0.08)]">
              <motion.div
                aria-hidden="true"
                className="absolute inset-[13%] rounded-full border border-dashed border-brand-teal/18"
                animate={reduceMotion ? undefined : { rotate: [0, 4, -3, 0], scale: [1, 1.015, 0.99, 1] }}
                transition={reduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-[23%] rounded-full border border-brand-green/15 bg-white/35 blur-[0.2px]"
                animate={reduceMotion ? undefined : { rotate: [0, -5, 3, 0], opacity: [0.55, 0.82, 0.6, 0.55] }}
                transition={reduceMotion ? undefined : { duration: 13, repeat: Infinity, ease: "easeInOut" }}
              />

              <svg className="absolute inset-0 h-full w-full" aria-hidden="true" viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
                <defs>
                  <radialGradient id="searchMapHubGradient">
                    <stop offset="0%" stopColor="#10E66A" stopOpacity="0.32" />
                    <stop offset="55%" stopColor="#188AAC" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#197DB4" stopOpacity="0.04" />
                  </radialGradient>
                  <linearGradient id="searchMapLineGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#188AAC" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#10E66A" stopOpacity="0.75" />
                  </linearGradient>
                </defs>

                {points.map((point, index) => {
                  const target = points[(index + 2) % points.length];
                  return (
                    <motion.path
                      key={`mesh-${surfaces[index]?.id}`}
                      d={networkPath(point, target, index)}
                      fill="none"
                      stroke="url(#searchMapLineGradient)"
                      strokeWidth="0.75"
                      strokeDasharray="3 7"
                      strokeLinecap="round"
                      initial={false}
                      animate={
                        reduceMotion
                          ? { opacity: 0.16 }
                          : { opacity: [0.1, 0.28, 0.14], pathLength: [0.35, 0.95, 0.45], strokeDashoffset: [0, -18, -36] }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 7 + (index % 3), delay: index * 0.18, repeat: Infinity, ease: "easeInOut" }
                      }
                    />
                  );
                })}

                {surfaces.map((surface, index) => {
                  const point = points[index];
                  const isActive = activeId === surface.id;
                  return (
                    <motion.path
                      key={`line-${surface.id}`}
                      d={connectionPath(point, index)}
                      fill="none"
                      stroke={isActive ? "#10E66A" : "#188AAC"}
                      strokeWidth={isActive ? 1.8 : 1.05}
                      strokeLinecap="round"
                      initial={false}
                      animate={
                        reduceMotion
                          ? { opacity: isActive ? 0.82 : 0.34, pathLength: 1 }
                          : {
                              opacity: isActive ? [0.72, 1, 0.72] : [0.26, 0.52, 0.3],
                              pathLength: isActive ? [0.55, 1, 0.72] : [0.38, 0.86, 0.44],
                            }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: isActive ? 3.1 : 4.8 + (index % 4) * 0.4, delay: index * 0.1, repeat: Infinity, ease: "easeInOut" }
                      }
                    />
                  );
                })}
              </svg>

              <motion.div
                className="absolute left-1/2 top-1/2 z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-teal/25 bg-white/90 text-center shadow-[0_24px_70px_-34px_rgba(24,138,172,0.9)] backdrop-blur"
                animate={reduceMotion ? undefined : { scale: [1, 1.035, 1], boxShadow: ["0 24px 70px -34px rgba(24,138,172,0.9)", "0 28px 82px -34px rgba(16,230,106,0.82)", "0 24px 70px -34px rgba(24,138,172,0.9)"] }}
                transition={reduceMotion ? undefined : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="absolute inset-[-18px] rounded-full bg-[radial-gradient(circle,rgba(16,230,106,0.18),rgba(24,138,172,0.02)_70%)]" aria-hidden="true" />
                <span className="relative text-xs font-bold uppercase tracking-[0.12em] text-graphite">
                  Taskcover
                  <span className="mt-1 block text-[10px] font-semibold text-brand-teal">Search OS</span>
                </span>
              </motion.div>

              {surfaces.map((surface, index) => {
                const point = points[index];
                const motionSpec = surfaceMotion[index % surfaceMotion.length];
                const isActive = activeId === surface.id;
                return (
                  <motion.div
                    key={surface.id}
                    className="absolute z-30"
                    style={{ left: `${toPercent(point.x)}%`, top: `${toPercent(point.y)}%` }}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.78 }}
                    animate={
                      reduceMotion
                        ? { opacity: 1, scale: 1, x: 0, y: 0 }
                        : { opacity: 1, scale: 1, x: motionSpec.x, y: motionSpec.y }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            opacity: { duration: 0.35, delay: index * 0.05 },
                            scale: { duration: 0.35, delay: index * 0.05 },
                            x: { duration: motionSpec.duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.23 },
                            y: { duration: motionSpec.duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.23 },
                          }
                    }
                  >
                    <button
                      type="button"
                      aria-label={surface.ariaLabel}
                      aria-pressed={isActive}
                      onClick={() => setActiveId(surface.id)}
                      onFocus={() => setActiveId(surface.id)}
                      onMouseEnter={() => setActiveId(surface.id)}
                      className="group relative flex min-h-16 min-w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
                    >
                      <span
                        className={cn(
                          "absolute h-14 w-14 rounded-full border transition duration-300",
                          isActive
                            ? "border-brand-green/80 bg-brand-green/18 shadow-[0_0_0_10px_rgba(16,230,106,0.14),0_18px_40px_-22px_rgba(16,230,106,0.92)]"
                            : "border-brand-teal/28 bg-white/95 shadow-[0_14px_38px_-26px_rgba(24,138,172,0.9)] group-hover:border-brand-teal/65 group-hover:bg-surface-tint",
                        )}
                      />
                      {!reduceMotion ? (
                        <motion.span
                          aria-hidden="true"
                          className={cn(
                            "absolute h-14 w-14 rounded-full border",
                            isActive ? "border-brand-green/50" : "border-brand-teal/20",
                          )}
                          animate={
                            isActive
                              ? { scale: [1, 1.42, 1], opacity: [0.58, 0, 0.42] }
                              : { scale: [1, 1.18, 1], opacity: [0.2, 0.42, 0.2] }
                          }
                          transition={{
                            duration: isActive ? 2.1 : 3.5 + (index % 3) * 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.12,
                          }}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative h-4 w-4 rounded-full border transition duration-300",
                          isActive
                            ? "border-brand-green bg-brand-green shadow-[0_0_18px_rgba(16,230,106,0.72)]"
                            : "border-brand-teal bg-white group-hover:bg-brand-teal",
                        )}
                      />
                      <span
                        className={cn(
                          "pointer-events-none absolute top-[calc(100%+0.35rem)] max-w-28 whitespace-nowrap rounded-full border bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur transition duration-200",
                          isActive
                            ? "translate-y-0 border-brand-teal/40 text-graphite opacity-100"
                            : "translate-y-1 border-line text-secondary opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                        )}
                      >
                        {surface.shortLabel}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-graphite shadow-sm">
              <MousePointerClick className="h-4 w-4 text-brand-teal" aria-hidden="true" />
              {labels.mobileGuidance}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {surfaces.map((surface) => {
                const isActive = activeId === surface.id;
                return (
                  <button
                    key={surface.id}
                    type="button"
                    aria-label={surface.ariaLabel}
                    aria-pressed={isActive}
                    onClick={() => setActiveId(surface.id)}
                    onFocus={() => setActiveId(surface.id)}
                    className={cn(
                      "min-h-12 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
                      isActive
                        ? "border-brand-teal bg-surface-tint text-graphite shadow-sm"
                        : "border-line bg-white text-secondary",
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", isActive ? "bg-brand-green" : "bg-brand-teal")} />
                      {surface.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <SurfaceDetail surface={activeSurface} labels={labels} message={message} />
        </div>
      </div>
    </Container>
  );
}
