"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { CheckCircle2, Globe2, ArrowRight } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Markets — regional comparison panels with a mini map accent.
 *
 * Layout: three side-by-side country panels, each with a distinct map-region
 * accent stripe at the top, context copy, a differentiator badge, and
 * highlight checks. The visual treatment is intentionally different from the
 * Industries rail and Services bento.
 */

type Market = {
  title: string;
  region: string;
  context: string;
  href: string;
  highlights: readonly string[];
  differentiator?: string;
  /** Map dot positions (percent) for the region accent */
  mapDots: readonly { x: number; y: number }[];
};

export function MarketsPanels({
  eyebrow,
  title,
  titleId,
  description,
  markets,
  labels,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  markets: readonly Market[];
  labels?: { viewMarket: string };
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const L = labels ?? { viewMarket: "View market" };

  return (
    <Container className={cn("flex flex-col gap-10", className)}>
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

      <div className="grid gap-5 md:grid-cols-3">
        {markets.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.1 }}
          >
            <Link
              href={m.href}
              className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:border-brand-teal/40"
            >
              {/* Region accent header with map dots */}
              <div className="relative h-24 overflow-hidden bg-surface-tint">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-brand-gradient-soft opacity-60"
                />
                {/* Stylized region dots */}
                <svg viewBox="0 0 200 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  {m.mapDots.map((dot, di) => (
                    <circle
                      key={di}
                      cx={`${dot.x}%`}
                      cy={`${dot.y}%`}
                      r="3"
                      fill="#10E66A"
                      stroke="#188AAC"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  ))}
                  {/* Connection lines between dots */}
                  {m.mapDots.length > 1 &&
                    m.mapDots.slice(0, -1).map((dot, di) => (
                      <line
                        key={`l-${di}`}
                        x1={`${dot.x}%`}
                        y1={`${dot.y}%`}
                        x2={`${m.mapDots[di + 1].x}%`}
                        y2={`${m.mapDots[di + 1].y}%`}
                        stroke="#188AAC"
                        strokeWidth="0.8"
                        opacity="0.3"
                        strokeDasharray="3 3"
                      />
                    ))}
                </svg>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
                    <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-graphite">
                    {m.region}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold text-graphite">{m.title}</p>
                  {m.differentiator && (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-brand-teal/30 bg-brand-teal/[0.06] px-2 py-0.5 text-[10px] font-semibold text-brand-teal">
                      {m.differentiator}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-secondary">{m.context}</p>
                <ul className="flex flex-col gap-1.5 pt-1">
                  {m.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-secondary">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal">
                  {L.viewMarket}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
