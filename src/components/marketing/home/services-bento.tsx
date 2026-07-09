"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Services — asymmetric bento grid with unique micro-visuals.
 *
 * The large SEO Strategy feature card is content-rich: it includes a mini
 * roadmap, capability chips, and a business outcome preview. The remaining
 * cards each have a distinct inline SVG micro-visual.
 */

type ServiceCard = {
  title: string;
  outcome: string;
  href: string;
  span: "wide" | "tall" | "default";
  visual: string;
};

type FeatureCard = {
  title: string;
  outcome: string;
  href: string;
  roadmap: readonly { phase: string; detail: string }[];
  chips: readonly string[];
  outcomePreview: string;
};

/* --- Micro-visuals (inline SVG, illustrative only) --- */

function CrawlVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Crawl and index map">
      <circle cx="100" cy="40" r="14" fill="url(#crawlGrad)" stroke="#188AAC" strokeWidth="1.5" />
      {[
        { x: 30, y: 20 },
        { x: 30, y: 60 },
        { x: 170, y: 20 },
        { x: 170, y: 60 },
        { x: 100, y: 8 },
      ].map((p, i) => (
        <g key={i}>
          <line x1="100" y1="40" x2={p.x} y2={p.y} stroke="#DDEAF0" strokeWidth="1" />
          <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#10E66A" strokeWidth="1.5" />
        </g>
      ))}
      <defs>
        <radialGradient id="crawlGrad">
          <stop offset="0%" stopColor="#10E66A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#188AAC" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CitationVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="AI answer citation">
      <rect x="10" y="10" width="120" height="60" rx="8" fill="#F4F8FB" stroke="#DDEAF0" strokeWidth="1" />
      <rect x="20" y="20" width="80" height="4" rx="2" fill="#188AAC" />
      <rect x="20" y="30" width="100" height="3" rx="1.5" fill="#DDEAF0" />
      <rect x="20" y="38" width="70" height="3" rx="1.5" fill="#DDEAF0" />
      <rect x="140" y="20" width="50" height="12" rx="6" fill="#10E66A" opacity="0.2" />
      <text x="165" y="29" textAnchor="middle" className="fill-graphite" style={{ fontSize: "7px", fontWeight: "600" }}>Source</text>
      <rect x="140" y="40" width="50" height="12" rx="6" fill="#10E66A" opacity="0.2" />
      <text x="165" y="49" textAnchor="middle" className="fill-graphite" style={{ fontSize: "7px", fontWeight: "600" }}>Cite</text>
    </svg>
  );
}

function ClusterVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Topic cluster map">
      <circle cx="100" cy="40" r="12" fill="#188AAC" />
      <text x="100" y="43" textAnchor="middle" className="fill-white" style={{ fontSize: "7px", fontWeight: "700" }}>Hub</text>
      {[
        { x: 40, y: 20 },
        { x: 40, y: 55 },
        { x: 160, y: 20 },
        { x: 160, y: 55 },
        { x: 100, y: 10 },
        { x: 100, y: 70 },
      ].map((p, i) => (
        <g key={i}>
          <line x1="100" y1="40" x2={p.x} y2={p.y} stroke="#DDEAF0" strokeWidth="1" />
          <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#10E66A" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

function WebsiteVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Website development growth stack">
      <rect x="12" y="12" width="112" height="56" rx="8" fill="#FFFFFF" stroke="#DDEAF0" strokeWidth="1" />
      <rect x="22" y="22" width="58" height="6" rx="3" fill="#188AAC" />
      <rect x="22" y="34" width="82" height="4" rx="2" fill="#DDEAF0" />
      <rect x="22" y="44" width="54" height="4" rx="2" fill="#DDEAF0" />
      <rect x="22" y="55" width="42" height="7" rx="3.5" fill="#10E66A" opacity="0.7" />
      {[
        { x: 146, y: 20, label: "SEO" },
        { x: 162, y: 40, label: "AI" },
        { x: 146, y: 60, label: "Lead" },
      ].map((item) => (
        <g key={item.label}>
          <line x1="124" y1="40" x2={item.x - 18} y2={item.y} stroke="#DDEAF0" strokeWidth="1" />
          <rect x={item.x - 18} y={item.y - 9} width="36" height="18" rx="6" fill="#F4F8FB" stroke="#10E66A" strokeWidth="1" />
          <text x={item.x} y={item.y + 3} textAnchor="middle" className="fill-graphite" style={{ fontSize: "7px", fontWeight: "700" }}>{item.label}</text>
        </g>
      ))}
    </svg>
  );
}

function AuthorityVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Authority and mention graph">
      <rect x="20" y="25" width="30" height="30" rx="4" fill="#F4F8FB" stroke="#188AAC" strokeWidth="1" />
      <text x="35" y="43" textAnchor="middle" className="fill-muted" style={{ fontSize: "7px" }}>You</text>
      {[
        { x: 90, y: 15 },
        { x: 90, y: 40 },
        { x: 90, y: 65 },
        { x: 150, y: 28 },
        { x: 150, y: 52 },
      ].map((p, i) => (
        <g key={i}>
          <line x1="50" y1="40" x2={p.x} y2={p.y} stroke="#10E66A" strokeWidth="1" opacity="0.5" className="flow-line" />
          <rect x={p.x - 10} y={p.y - 7} width="20" height="14" rx="3" fill="#FFFFFF" stroke="#10E66A" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

function PinsVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Local map pins">
      <rect x="0" y="20" width="200" height="60" fill="#F4F8FB" />
      {[...Array(5)].map((_, i) => (
        <line key={i} x1={i * 40} y1="20" x2={i * 40} y2="80" stroke="#E5EEF3" strokeWidth="1" />
      ))}
      {[
        { x: 50, y: 45 },
        { x: 100, y: 35 },
        { x: 150, y: 55 },
      ].map((p, i) => (
        <g key={i}>
          <path
            d={`M ${p.x} ${p.y} C ${p.x - 6} ${p.y - 10}, ${p.x - 6} ${p.y - 18}, ${p.x} ${p.y - 18} C ${p.x + 6} ${p.y - 18}, ${p.x + 6} ${p.y - 10}, ${p.x} ${p.y}`}
            fill="#10E66A"
            stroke="#188AAC"
            strokeWidth="1"
          />
          <circle cx={p.x} cy={p.y - 13} r="2.5" fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  );
}

function ProductsVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="eCommerce product grid">
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <rect
              x={10 + col * 47}
              y={10 + row * 32}
              width="40"
              height="26"
              rx="4"
              fill="#FFFFFF"
              stroke="#DDEAF0"
              strokeWidth="1"
            />
            <rect
              x={15 + col * 47}
              y={15 + row * 32}
              width="30"
              height="12"
              rx="2"
              fill="#F4F8FB"
            />
            <rect
              x={15 + col * 47}
              y={31 + row * 32}
              width="18"
              height="3"
              rx="1.5"
              fill="#10E66A"
              opacity="0.6"
            />
          </g>
        ))
      )}
    </svg>
  );
}

function DashboardVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Analytics dashboard">
      <rect x="5" y="10" width="190" height="60" rx="6" fill="#FFFFFF" stroke="#DDEAF0" strokeWidth="1" />
      {[20, 35, 28, 45, 38, 52].map((h, i) => (
        <rect
          key={i}
          x={20 + i * 28}
          y={64 - h}
          width="16"
          height={h}
          rx="2"
          fill={i === 5 ? "#10E66A" : "#188AAC"}
          opacity={i === 5 ? 1 : 0.4 + i * 0.1}
        />
      ))}
      <polyline
        points="28,44 56,38 84,42 112,30 140,34 168,20"
        fill="none"
        stroke="#188AAC"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function GlobeVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="International SEO globe">
      <circle cx="100" cy="40" r="28" fill="none" stroke="#188AAC" strokeWidth="1.5" />
      <ellipse cx="100" cy="40" rx="28" ry="12" fill="none" stroke="#188AAC" strokeWidth="1" opacity="0.5" />
      <ellipse cx="100" cy="40" rx="12" ry="28" fill="none" stroke="#188AAC" strokeWidth="1" opacity="0.5" />
      <line x1="72" y1="40" x2="128" y2="40" stroke="#188AAC" strokeWidth="1" opacity="0.5" />
      <line x1="100" y1="12" x2="100" y2="68" stroke="#188AAC" strokeWidth="1" opacity="0.5" />
      {[{ x: 60, y: 25 }, { x: 140, y: 55 }, { x: 115, y: 20 }].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10E66A" stroke="#188AAC" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

function PpcVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="PPC search ads">
      <rect x="10" y="14" width="180" height="52" rx="6" fill="#FFFFFF" stroke="#DDEAF0" strokeWidth="1" />
      <text x="20" y="28" className="fill-muted" style={{ fontSize: "6px", fontWeight: "600" }}>AD</text>
      <rect x="20" y="34" width="100" height="5" rx="2.5" fill="#188AAC" />
      <rect x="20" y="44" width="80" height="3" rx="1.5" fill="#DDEAF0" />
      {[1, 2, 3].map((p) => (
        <rect key={p} x={130 + (p - 1) * 18} y="34" width="14" height="14" rx="3" fill="#10E66A" opacity={0.2 + p * 0.15} />
      ))}
      <path d="M 170 58 L 176 48 L 182 58 Z" fill="#10E66A" />
    </svg>
  );
}

function MentorVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="SEO mentor sessions">
      <rect x="10" y="15" width="120" height="50" rx="8" fill="#F4F8FB" stroke="#DDEAF0" strokeWidth="1" />
      <circle cx="35" cy="35" r="8" fill="#10E66A" opacity="0.3" stroke="#188AAC" strokeWidth="1" />
      <rect x="28" y="46" width="14" height="3" rx="1.5" fill="#188AAC" />
      <rect x="25" y="51" width="20" height="3" rx="1.5" fill="#DDEAF0" />
      <rect x="55" y="28" width="60" height="4" rx="2" fill="#188AAC" />
      <rect x="55" y="38" width="50" height="3" rx="1.5" fill="#DDEAF0" />
      <rect x="55" y="45" width="55" height="3" rx="1.5" fill="#DDEAF0" />
      {[1, 2, 3, 4].map((d) => (
        <rect key={d} x={140 + (d - 1) * 13} y={55 - d * 8} width="9" height={d * 8} rx="2" fill="#10E66A" opacity={0.3 + d * 0.15} />
      ))}
    </svg>
  );
}

const visualMap: Record<string, ({ className }: { className?: string }) => React.ReactElement> = {
  crawl: CrawlVisual,
  citation: CitationVisual,
  cluster: ClusterVisual,
  website: WebsiteVisual,
  authority: AuthorityVisual,
  pins: PinsVisual,
  products: ProductsVisual,
  dashboard: DashboardVisual,
  globe: GlobeVisual,
  ppc: PpcVisual,
  mentor: MentorVisual,
};

export function ServicesBento({
  eyebrow,
  title,
  titleId,
  description,
  featureCard,
  cards,
  labels,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  featureCard: FeatureCard;
  cards: readonly ServiceCard[];
  labels?: {
    coreModule: string;
    roadmap: string;
    businessOutcome: string;
    explore: string;
  };
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const L = labels ?? {
    coreModule: "Core module",
    roadmap: "Roadmap",
    businessOutcome: "Business outcome",
    explore: "Explore",
  };

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Feature card — SEO Strategy */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="sm:col-span-2 sm:row-span-2"
        >
          <Link
            href={featureCard.href}
            className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 hover:border-brand-teal/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-graphite">{featureCard.title}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {L.coreModule}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-secondary">
              {featureCard.outcome}
            </p>

            {/* Mini roadmap */}
            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                {L.roadmap}
              </p>
              <ol className="mt-2 flex flex-col gap-2">
                {featureCard.roadmap.map((step, i) => (
                  <li key={step.phase} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-graphite">{step.phase}</p>
                      <p className="text-[11px] text-secondary">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Capability chips */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {featureCard.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-surface-tint px-2 py-1 text-[11px] font-medium text-graphite"
                >
                  <CheckCircle2 className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                  {chip}
                </span>
              ))}
            </div>

            {/* Outcome preview */}
            <div className="mt-5 rounded-xl border border-brand-teal/20 bg-surface-tint/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                {L.businessOutcome}
              </p>
              <p className="mt-1 text-xs text-secondary">{featureCard.outcomePreview}</p>
            </div>

            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-teal">
              {L.explore}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>

        {/* Remaining service cards */}
        {cards.map((card, i) => {
          const Visual = visualMap[card.visual];
          const spanClass = {
            wide: "sm:col-span-2",
            tall: "sm:row-span-2",
            default: "",
          }[card.span];

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06 }}
              className={cn(spanClass)}
            >
              <Link
                href={card.href}
                className={cn(
                  "card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-5",
                  "hover:border-brand-teal/40"
                )}
              >
                {/* Micro-visual */}
                <div className="mb-3 rounded-xl border border-line-soft bg-surface-tint/50 p-3">
                  <Visual className="h-14 w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>

                <p className="text-sm font-semibold text-graphite">{card.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary">
                  {card.outcome}
                </p>

                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-brand-teal">
                  {L.explore}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}
