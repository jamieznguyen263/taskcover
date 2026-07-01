"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Premium Brand / partner experience marquee.
 *
 * A continuously moving horizontal strip of premium brand-proof tiles with
 * gradient halos, soft shadows, and stronger fade masks at the edges.
 * Two rows: brands row + capabilities row. Pauses on hover and respects
 * prefers-reduced-motion.
 *
 * No official logos are used unless assets are permissioned. Text tiles only.
 */

function MarqueeRow({
  items,
  reverse = false,
  duration = 45,
}: {
  items: readonly string[];
  reverse?: boolean;
  duration?: number;
}) {
  const loop = [...items, ...items];
  return (
    <div className="group relative overflow-hidden">
      {/* Edge fade masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-surface-soft via-surface-soft/80 to-transparent sm:w-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-surface-soft via-surface-soft/80 to-transparent sm:w-32"
      />
      <ul
        className={cn(
          "flex w-max items-center gap-4",
          reverse
            ? "animate-[marquee-reverse_var(--dur)_linear_infinite]"
            : "animate-[marquee_var(--dur)_linear_infinite]",
        )}
        style={{ ["--dur" as string]: `${duration}s` }}
      >
        {loop.map((name, i) => (
          <li
            key={`${name}-${i}`}
            className="group/tile relative inline-flex shrink-0 items-center rounded-2xl border border-line bg-white px-6 py-3 shadow-[0_4px_20px_-8px_rgba(24,138,172,0.25)] ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:ring-brand-teal/10"
          >
            {/* Subtle gradient halo on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-gradient-soft opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
            />
            <span className="relative text-base font-semibold tracking-tight text-graphite sm:text-lg">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrandMarquee({
  caption,
  items,
  rowBrands,
  rowCapabilities,
  className,
}: {
  caption?: React.ReactNode;
  items?: readonly string[];
  rowBrands?: readonly string[];
  rowCapabilities?: readonly string[];
  className?: string;
}) {
  void items; // kept for API compat; two-row split preferred
  const reduceMotion = useReducedMotion();

  // If two-row data provided, use it; otherwise fall back to single items
  const hasTwoRows = (rowBrands?.length ?? 0) > 0 && (rowCapabilities?.length ?? 0) > 0;

  return (
    <Container className={cn("flex flex-col gap-6", className)}>
      {caption ? (
        <p className="mx-auto max-w-2xl text-center text-sm font-medium text-secondary sm:text-base">
          {caption}
        </p>
      ) : null}

      {/* Premium gradient band divider */}
      <div className="relative">
        {/* Thin top/bottom divider with gradient accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent"
        />

        {reduceMotion ? (
          /* Reduced motion: static grid layout */
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-wrap justify-center gap-3">
              {(hasTwoRows ? rowBrands! : items ?? []).map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-2xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-graphite shadow-sm"
                >
                  {name}
                </span>
              ))}
            </div>
            {hasTwoRows && (
              <div className="flex flex-wrap justify-center gap-3">
                {rowCapabilities!.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-2xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-graphite shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : hasTwoRows ? (
          <div className="flex flex-col gap-3 py-2">
            <MarqueeRow items={rowBrands!} duration={40} />
            <MarqueeRow items={rowCapabilities!} duration={50} reverse />
          </div>
        ) : (
          <div className="py-2">
            <MarqueeRow items={items ?? []} duration={40} />
          </div>
        )}
      </div>
    </Container>
  );
}