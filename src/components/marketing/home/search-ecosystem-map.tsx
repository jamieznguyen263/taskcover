"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import type { SearchSurface, SearchSurfaceLabels } from "@/content/home.types";
import { cn } from "@/lib/utils";

const CENTER = 50;
const RADIUS = 37;

function polarToPercent(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
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
  return (
    <GradientBorderCard>
      <div className="grid gap-5">
        <div>
          <p className="text-sm font-semibold text-brand-teal">
            {surface ? surface.label : labels.defaultTitle}
          </p>
          <p className="mt-2 text-base leading-relaxed text-secondary">
            {surface ? surface.buyersSee : labels.defaultBody}
          </p>
        </div>

        {surface ? (
          <div className="grid gap-3">
            {[
              { label: labels.buyersSee, value: surface.buyersSee },
              { label: labels.taskcoverImproves, value: surface.taskcoverImproves },
              { label: labels.growthSupport, value: surface.growthSupport },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-secondary">{item.value}</p>
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
  const firstPosition = surfaces[0] ? polarToPercent(surfaces[0].angle) : { x: 50, y: 12 };

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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-graphite shadow-sm">
              <MousePointerClick className="h-4 w-4 text-brand-teal" aria-hidden="true" />
              {labels.desktopGuidance}
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
              <div
                aria-hidden="true"
                className="absolute inset-[18%] rounded-full border border-brand-teal/15 bg-white/45 shadow-[inset_0_0_70px_rgba(24,138,172,0.08)]"
              />
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gradient-soft blur-2xl"
              />

              <svg className="absolute inset-0 h-full w-full" aria-hidden="true" viewBox="0 0 100 100">
                {surfaces.map((surface, index) => {
                  const pos = polarToPercent(surface.angle);
                  const isActive = activeId === surface.id;
                  return (
                    <motion.line
                      key={surface.id}
                      x1={CENTER}
                      y1={CENTER}
                      x2={pos.x}
                      y2={pos.y}
                      stroke={isActive ? "#10E66A" : "#188AAC"}
                      strokeWidth={isActive ? 0.7 : 0.35}
                      strokeLinecap="round"
                      initial={false}
                      animate={
                        reduceMotion
                          ? { opacity: isActive ? 0.75 : 0.32 }
                          : { opacity: isActive ? [0.65, 1, 0.65] : [0.22, 0.46, 0.22] }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 2.6 + (index % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }
                      }
                    />
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-teal/25 bg-white text-center shadow-soft">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-graphite">
                  Taskcover
                  <span className="mt-1 block text-[10px] font-semibold text-brand-teal">Search OS</span>
                </span>
              </div>

              <div
                className="absolute z-20 flex items-center gap-2 rounded-full border border-brand-green/25 bg-white px-3 py-1.5 text-xs font-semibold text-graphite shadow-soft"
                style={{ left: `${Math.min(firstPosition.x + 6, 78)}%`, top: `${Math.max(firstPosition.y - 6, 4)}%` }}
              >
                {labels.startHere}
                <ArrowUpRight className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
              </div>

              {surfaces.map((surface, index) => {
                const pos = polarToPercent(surface.angle);
                const isActive = activeId === surface.id;
                return (
                  <motion.button
                    key={surface.id}
                    type="button"
                    aria-label={surface.ariaLabel}
                    aria-pressed={isActive}
                    onClick={() => setActiveId(surface.id)}
                    onFocus={() => setActiveId(surface.id)}
                    onMouseEnter={() => setActiveId(surface.id)}
                    className="group absolute z-30 flex min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
                    animate={
                      reduceMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, scale: isActive ? 1.08 : [1, 1.04, 1] }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: isActive ? 0.2 : 2.8, delay: index * 0.08, repeat: isActive ? 0 : Infinity }
                    }
                  >
                    <span
                      className={cn(
                        "absolute h-12 w-12 rounded-full border transition",
                        isActive
                          ? "border-brand-green/70 bg-brand-green/15 shadow-[0_0_0_8px_rgba(16,230,106,0.12)]"
                          : "border-brand-teal/20 bg-white shadow-sm group-hover:border-brand-teal/45",
                      )}
                    />
                    <span
                      className={cn(
                        "relative h-4 w-4 rounded-full border transition",
                        isActive
                          ? "border-brand-green bg-brand-green"
                          : "border-brand-teal bg-white group-hover:bg-brand-teal",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-[calc(100%+0.35rem)] whitespace-nowrap rounded-full border bg-white px-2 py-1 text-[11px] font-semibold shadow-sm transition",
                        isActive
                          ? "translate-y-0 border-brand-teal/30 text-graphite opacity-100"
                          : "translate-y-1 border-line text-secondary opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                      )}
                    >
                      {surface.shortLabel}
                    </span>
                  </motion.button>
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
                        ? "border-brand-teal bg-surface-tint text-graphite"
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
