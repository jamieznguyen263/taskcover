"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Brand / partner experience marquee.
 *
 * A continuously moving horizontal strip of text logo-style pills with fade
 * masks on the left/right edges. Slow, smooth, premium — not loud. Pauses on
 * hover and respects prefers-reduced-motion.
 *
 * No official logos are used unless assets are permissioned. Text pills only.
 */
export function BrandMarquee({
  caption,
  items,
  className,
}: {
  caption?: React.ReactNode;
  items: readonly string[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...items, ...items];

  return (
    <Container className={cn("flex flex-col gap-6", className)}>
      {caption ? (
        <p className="mx-auto max-w-2xl text-center text-sm text-muted">
          {caption}
        </p>
      ) : null}

      <div
        className="group relative overflow-hidden"
        role="marquee"
        aria-label="Selected brand and partner experience"
      >
        {/* Edge fade masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24"
        />

        <ul
          className={cn(
            "flex w-max items-center gap-3",
            !reduceMotion && "animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]"
          )}
        >
          {loop.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="inline-flex shrink-0 items-center rounded-xl border border-line bg-white px-5 py-2.5 shadow-[0_2px_8px_-4px_rgba(24,138,172,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:border-brand-teal/30"
            >
              <span className="text-sm font-semibold tracking-tight text-graphite">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}