"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * Services — asymmetric bento grid with unique micro-visuals.
 *
 * Each service card uses a different layout slot (wide/tall/feature) and a
 * distinct inline SVG micro-visual so no two cards feel the same:
 *  - Strategy: roadmap with milestones
 *  - Technical SEO: crawl/index node map
 *  - AI Search: answer + citation visual
 *  - Content: topic cluster map
 *  - Digital PR: authority/mention graph
 *  - Local SEO: map pin stack
 *  - eCommerce: product grid
 *  - Analytics: dashboard/report visual
 *
 * This replaces the uniform 4-column icon+title+paragraph card grid.
 */

type ServiceCard = {
  title: string;
  outcome: string;
  href: string;
  span: "feature" | "wide" | "tall" | "default";
  visual:
    | "roadmap"
    | "crawl"
    | "citation"
    | "cluster"
    | "authority"
    | "pins"
    | "products"
    | "dashboard";
};

/* --- Micro-visuals (inline SVG, illustrative only) --- */

function RoadmapVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Strategy roadmap">
      <line x1="10" y1="40" x2="190" y2="40" stroke="#DDEAF0" strokeWidth="2" />
      <line x1="10" y1="40" x2="130" y2="40" stroke="#188AAC" strokeWidth="2.5" className="flow-line" />
      {[10, 50, 90, 130, 170].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="40" r={i === 2 ? 6 : 4} fill={i <= 2 ? "#10E66A" : "#FFFFFF"} stroke="#188AAC" strokeWidth="1.5" />
          <text x={x} y="64" textAnchor="middle" className="fill-muted" style={{ fontSize: "8px" }}>
            {["Q1", "Q2", "Q3", "Q4", "Q5"][i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CrawlVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} role="img" aria-label="Crawl and index map">
      {/* Central site node */}
      <circle cx="100" cy="40" r="14" fill="url(#crawlGrad)" stroke="#188AAC" strokeWidth="1.5" />
      {/* Connected pages */}
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
      {/* AI answer box */}
      <rect x="10" y="10" width="120" height="60" rx="8" fill="#F4F8FB" stroke="#DDEAF0" strokeWidth="1" />
      <rect x="20" y="20" width="80" height="4" rx="2" fill="#188AAC" />
      <rect x="20" y="30" width="100" height="3" rx="1.5" fill="#DDEAF0" />
      <rect x="20" y="38" width="70" height="3" rx="1.5" fill="#DDEAF0" />
      {/* Citation chips */}
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
      {/* Pillar */}
      <circle cx="100" cy="40" r="12" fill="#188AAC" />
      <text x="100" y="43" textAnchor="middle" className="fill-white" style={{ fontSize: "7px", fontWeight: "700" }}>Hub</text>
      {/* Cluster nodes */}
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
      {/* Bars */}
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
      {/* Trend line */}
      <polyline
        points="28,44 56,38 84,42 112,30 140,34 168,20"
        fill="none"
        stroke="#188AAC"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const visualMap = {
  roadmap: RoadmapVisual,
  crawl: CrawlVisual,
  citation: CitationVisual,
  cluster: ClusterVisual,
  authority: AuthorityVisual,
  pins: PinsVisual,
  products: ProductsVisual,
  dashboard: DashboardVisual,
};

export function ServicesBento({
  eyebrow,
  title,
  titleId,
  description,
  cards,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  description: React.ReactNode;
  cards: readonly ServiceCard[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

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

      <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Visual = visualMap[card.visual];
          const spanClass = {
            feature: "sm:col-span-2 sm:row-span-2",
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
                <div className="mb-4 rounded-xl border border-line-soft bg-surface-tint/50 p-3">
                  <Visual className="h-16 w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>

                <p className="text-base font-semibold text-graphite">{card.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                  {card.outcome}
                </p>

                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand-teal">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}