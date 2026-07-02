/**
 * Industry-specific visual systems.
 *
 * Each industry gets a distinct visual metaphor (Part C of the brief):
 *  - Travel:      destination SERP + booking funnel map
 *  - Education:   program research + decision cycle loop
 *  - Healthcare:  trust + local provider map
 *  - Legal:       high-trust intake funnel
 *  - SaaS:        category + comparison matrix
 *  - eCommerce:   category architecture + product grid
 *  - Franchise:   multi-location pack grid
 *
 * Plus hub visuals: sector signal dashboard + comparison matrix accents.
 *
 * All visuals are illustrative UI only — no fabricated client metrics.
 * Bright-only palette, brand gradient accents, CSS motion via `flow-line`.
 */

import * as React from "react";
import type { IndustryIcon } from "@/content/industries.types";

/* -------------------------------------------------------------------------- */
/* Shared palette + primitives                                                */
/* -------------------------------------------------------------------------- */

const C = {
  green: "#10E66A",
  emerald: "#12C679",
  teal: "#188AAC",
  blue: "#197DB4",
  graphite: "#0F172A",
  secondary: "#475569",
  muted: "#64748B",
  tint: "#F4F8FB",
  soft: "#F8FAFC",
  line: "#DDEAF0",
  lineSoft: "#E5EEF3",
  white: "#FFFFFF",
} as const;

const GRAD_ID = "ind-grad";
const SOFT_GRAD_ID = "ind-grad-soft";

function Defs() {
  return (
    <defs>
      <linearGradient id={GRAD_ID} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={C.green} />
        <stop offset="30%" stopColor={C.emerald} />
        <stop offset="70%" stopColor={C.teal} />
        <stop offset="100%" stopColor={C.blue} />
      </linearGradient>
      <linearGradient id={SOFT_GRAD_ID} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={C.green} stopOpacity="0.14" />
        <stop offset="100%" stopColor={C.blue} stopOpacity="0.14" />
      </linearGradient>
    </defs>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero visuals (larger, right-column of industry hero)                       */
/* -------------------------------------------------------------------------- */

/** Travel — destination SERP + booking funnel map. */
function TravelHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Travel destination SERP and booking funnel">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* SERP panel */}
      <rect x="16" y="20" width="180" height="240" rx={10} fill={C.tint} stroke={C.line} />
      <text x="28" y="36" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>DESTINATION SERP</text>
      {[
        { y: 48, label: "OTA", w: 140, c: C.muted },
        { y: 78, label: "Aggregator", w: 130, c: C.muted },
        { y: 108, label: "Your brand", w: 120, c: C.teal },
        { y: 138, label: "Review site", w: 110, c: C.muted },
      ].map((r) => (
        <g key={r.label}>
          <rect x="28" y={r.y} width={r.w} height={22} rx={5} fill={r.c === C.teal ? `url(#${GRAD_ID})` : C.white} stroke={r.c === C.teal ? C.teal : C.line} />
          <text x="36" y={r.y + 14} style={{ fontSize: 8, fontWeight: 600 }} fill={r.c === C.teal ? C.white : C.secondary}>{r.label}</text>
        </g>
      ))}
      {/* booking funnel */}
      <rect x="210" y="20" width="174" height="240" rx={10} fill={C.white} stroke={C.line} />
      <text x="222" y="36" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>BOOKING FUNNEL</text>
      {[
        { y: 50, label: "Inspiration", w: 150 },
        { y: 90, label: "Research", w: 130 },
        { y: 130, label: "Validation", w: 110 },
        { y: 170, label: "Booking", w: 90 },
        { y: 210, label: "AI answers", w: 120 },
      ].map((s, i) => (
        <g key={s.label}>
          <rect x="222" y={s.y} width={s.w} height={26} rx={6} fill={i === 3 ? `url(#${SOFT_GRAD_ID})` : C.tint} stroke={i === 3 ? C.teal : C.lineSoft} />
          <text x="232" y={s.y + 16} style={{ fontSize: 8, fontWeight: 600 }} fill={i === 3 ? C.teal : C.secondary}>{s.label}</text>
          {i < 4 && <line x1="297" y1={s.y + 26} x2="297" y2={s.y + 34} stroke={C.green} strokeWidth={1.5} className="flow-line" />}
        </g>
      ))}
    </svg>
  );
}

/** Education — program research + decision cycle loop. */
function EducationHero({ className }: { className?: string }) {
  const nodes = [
    { x: 200, y: 50, label: "Discover" },
    { x: 320, y: 120, label: "Compare" },
    { x: 280, y: 220, label: "Validate" },
    { x: 120, y: 220, label: "Decide" },
    { x: 80, y: 120, label: "Apply" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Education program research and decision cycle">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* cycle path */}
      <path
        d={`M ${nodes[0].x} ${nodes[0].y} ${nodes.slice(1).map((n) => `L ${n.x} ${n.y}`).join(" ")} Z`}
        fill="none"
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={2}
        strokeDasharray="5 4"
        opacity={0.5}
      />
      {/* center trust badge */}
      <circle cx="200" cy="140" r="30" fill={`url(#${SOFT_GRAD_ID})`} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
      <text x="200" y="136" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.teal}>TRUST</text>
      <text x="200" y="148" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.teal}>CYCLE</text>
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="16" fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
          <text x={n.x} y={n.y + 3} textAnchor="middle" style={{ fontSize: 7, fontWeight: 600 }} fill={C.secondary}>{n.label}</text>
        </g>
      ))}
      {/* time indicator */}
      <text x="20" y="268" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>WEEKS → MONTHS DECISION CYCLE</text>
    </svg>
  );
}

/** Healthcare — trust + local provider map. */
function HealthcareHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Healthcare trust and local provider map">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* map surface */}
      <rect x="16" y="16" width="240" height="248" rx={10} fill={C.tint} />
      {[...Array(6)].map((_, i) => (
        <line key={`v${i}`} x1={16 + i * 40} y1={16} x2={16 + i * 40} y2={264} stroke={C.lineSoft} />
      ))}
      {[...Array(6)].map((_, i) => (
        <line key={`h${i}`} x1={16} y1={16 + i * 40} x2={256} y2={16 + i * 40} stroke={C.lineSoft} />
      ))}
      {/* provider pins */}
      {[
        { x: 80, y: 80 },
        { x: 160, y: 120 },
        { x: 120, y: 200 },
      ].map((p, i) => (
        <g key={i}>
          <path
            d={`M ${p.x} ${p.y} C ${p.x - 8} ${p.y - 14}, ${p.x - 8} ${p.y - 24}, ${p.x} ${p.y - 24} C ${p.x + 8} ${p.y - 24}, ${p.x + 8} ${p.y - 14}, ${p.x} ${p.y}`}
            fill={`url(#${GRAD_ID})`}
          />
          <circle cx={p.x} cy={p.y - 17} r={3.5} fill={C.white} />
        </g>
      ))}
      {/* trust panel */}
      <rect x="276" y="16" width="108" height="248" rx={10} fill={C.white} stroke={C.line} />
      <text x="288" y="34" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>TRUST SIGNALS</text>
      {["E-E-A-T", "Credentials", "Reviews", "Expert review", "Compliance"].map((s, i) => (
        <g key={s}>
          <rect x="288" y={46 + i * 38} width={84} height={30} rx={6} fill={C.tint} stroke={C.lineSoft} />
          <circle cx="298" cy={61 + i * 38} r="6" fill={i === 0 ? `url(#${GRAD_ID})` : C.green} />
          <text x="312" y={56 + i * 38} style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>{s}</text>
          <rect x="312" y={64 + i * 38} width={48} height={3} rx={1.5} fill={C.line} />
        </g>
      ))}
    </svg>
  );
}

/** Legal — high-trust intake funnel. */
function LegalHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Legal high-trust intake funnel">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* funnel stages */}
      {[
        { y: 40, w: 320, label: "Case-type questions", x: 40 },
        { y: 85, w: 280, label: "Firm comparison", x: 60 },
        { y: 130, w: 230, label: "Jurisdiction search", x: 85 },
        { y: 175, w: 180, label: "Credential checks", x: 110 },
        { y: 220, w: 130, label: "Consultation intake", x: 135 },
      ].map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width={s.w} height={32} rx={8} fill={i === 4 ? `url(#${GRAD_ID})` : i % 2 === 0 ? C.tint : `url(#${SOFT_GRAD_ID})`} stroke={i === 4 ? C.teal : C.lineSoft} />
          <text x={200} y={s.y + 20} textAnchor="middle" style={{ fontSize: 9, fontWeight: 600 }} fill={i === 4 ? C.white : C.secondary}>{s.label}</text>
        </g>
      ))}
      <text x="20" y="270" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>HIGH-TRUST · CONSULTATIVE · LOCAL INTAKE</text>
    </svg>
  );
}

/** SaaS — category + comparison matrix. */
function SaasHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="SaaS category and comparison matrix">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* category column */}
      <rect x="16" y="20" width="120" height="240" rx={10} fill={C.tint} stroke={C.line} />
      <text x="28" y="36" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>CATEGORY</text>
      {["Best CRM", "Alternatives", "Comparison", "Integrations"].map((c, i) => (
        <g key={c}>
          <rect x="28" y={48 + i * 50} width={96} height={40} rx={6} fill={i === 0 ? `url(#${SOFT_GRAD_ID})` : C.white} stroke={i === 0 ? C.teal : C.lineSoft} />
          <text x="36" y={64 + i * 50} style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>{c}</text>
          <rect x="36" y={72 + i * 50} width={60} height={4} rx={2} fill={i === 0 ? C.teal : C.line} />
        </g>
      ))}
      {/* comparison matrix */}
      <rect x="148" y="20" width="236" height="240" rx={10} fill={C.white} stroke={C.line} />
      <text x="160" y="36" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>COMPARISON MATRIX</text>
      {/* header row */}
      <rect x="160" y="44" width={212} height={18} rx={4} fill={C.tint} />
      {["Tool", "A", "B", "C"].map((h, i) => (
        <text key={h} x={180 + i * 64} y={56} textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.muted}>{h}</text>
      ))}
      {/* rows */}
      {[0, 1, 2, 3, 4].map((row) => (
        <g key={row}>
          <rect x="160" y={68 + row * 36} width={212} height={28} rx={4} fill={row % 2 === 0 ? C.soft : C.tint} />
          {[0, 1, 2].map((col) => (
            <g key={col}>
              <rect x={188 + col * 64} y={76 + row * 36} width={32} height={12} rx={3} fill={row === col ? `url(#${GRAD_ID})` : C.lineSoft} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/** eCommerce — category architecture + product grid. */
function EcommerceHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="eCommerce category architecture and product grid">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* category tree */}
      <rect x="160" y="20" width="80" height="26" rx={8} fill={`url(#${GRAD_ID})`} />
      <text x="200" y="37" textAnchor="middle" style={{ fontSize: 9, fontWeight: 700 }} fill={C.white}>ROOT</text>
      {[
        { x: 70, y: 90 },
        { x: 200, y: 90 },
        { x: 330, y: 90 },
      ].map((c, i) => (
        <g key={i}>
          <line x1="200" y1="46" x2={c.x} y2={c.y - 12} stroke={C.line} strokeWidth={1.5} />
          <rect x={c.x - 40} y={c.y - 12} width={80} height={24} rx={8} fill={C.tint} stroke={C.teal} />
          <text x={c.x} y={c.y + 3} textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>Cat {i + 1}</text>
        </g>
      ))}
      {/* product grid */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <rect x={40 + col * 84} y={130 + row * 48} width={72} height={38} rx={6} fill={C.white} stroke={C.line} />
            <rect x={48 + col * 84} y={138 + row * 48} width={56} height={14} rx={3} fill={C.tint} />
            <rect x={48 + col * 84} y={156 + row * 48} width={36} height={4} rx={2} fill={C.green} opacity={0.6} />
          </g>
        ))
      )}
      {/* facet chips */}
      <text x="20" y="240" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>FACETED NAV</text>
      {["Size", "Color", "Price", "Brand"].map((f, i) => (
        <g key={f}>
          <rect x={20 + i * 70} y={248} width={60} height={18} rx={9} fill={C.tint} stroke={C.lineSoft} />
          <text x={50 + i * 70} y={260} textAnchor="middle" style={{ fontSize: 7, fontWeight: 600 }} fill={C.secondary}>{f}</text>
        </g>
      ))}
    </svg>
  );
}

/** Franchise — multi-location pack grid. */
function FranchiseHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Franchise multi-location pack grid">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* location cards grid */}
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <rect x={20 + col * 124} y={20 + row * 124} width={112} height={112} rx={10} fill={C.tint} stroke={C.line} />
            {/* map mini */}
            <rect x={28 + col * 124} y={28 + row * 124} width={96} height={48} rx={6} fill={C.soft} stroke={C.lineSoft} />
            <path
              d={`M ${62 + col * 124} ${60 + row * 124} C ${54 + col * 124} ${46 + row * 124}, ${54 + col * 124} ${36 + row * 124}, ${62 + col * 124} ${36 + row * 124} C ${70 + col * 124} ${36 + row * 124}, ${70 + col * 124} ${46 + row * 124}, ${62 + col * 124} ${60 + row * 124}`}
              fill={`url(#${GRAD_ID})`}
            />
            {/* pack position */}
            <rect x={28 + col * 124} y={84 + row * 124} width={96} height={36} rx={6} fill={C.white} stroke={C.lineSoft} />
            <circle cx={38 + col * 124} cy={94 + row * 124} r="7" fill={`url(#${GRAD_ID})`} />
            <rect x={52 + col * 124} y={90 + row * 124} width={60} height={5} rx={2.5} fill={C.teal} />
            <rect x={52 + col * 124} y={100 + row * 124} width={40} height={3.5} rx={1.75} fill={C.line} />
            <rect x={52 + col * 124} y={108 + row * 124} width={50} height={3.5} rx={1.75} fill={C.line} />
          </g>
        ))
      )}
    </svg>
  );
}

const heroVisuals: Record<IndustryIcon, React.ComponentType<{ className?: string }>> = {
  travel: TravelHero,
  education: EducationHero,
  healthcare: HealthcareHero,
  legal: LegalHero,
  saas: SaasHero,
  ecommerce: EcommerceHero,
  franchise: FranchiseHero,
};

/** Render the industry-specific hero visual. */
export function IndustryHeroVisual({
  icon,
  className,
}: {
  icon: IndustryIcon;
  className?: string;
}) {
  const Visual = heroVisuals[icon];
  return <Visual className={className} />;
}

/* -------------------------------------------------------------------------- */
/* Hub visuals — sector signal dashboard                                       */
/* -------------------------------------------------------------------------- */

/**
 * Sector signal dashboard — industries as signal nodes around a central
 * "Search Intent" core. Used on the `/industries` hub.
 */
export function SectorSignalDashboard({ className }: { className?: string }) {
  const nodes = [
    { x: 200, y: 40, label: "Travel", icon: "✈", priority: true },
    { x: 80, y: 90, label: "Education", icon: "🎓", priority: true },
    { x: 320, y: 90, label: "Healthcare", icon: "✚", priority: false },
    { x: 60, y: 200, label: "Legal", icon: "§", priority: false },
    { x: 340, y: 200, label: "SaaS", icon: "⚙", priority: false },
    { x: 140, y: 250, label: "eCommerce", icon: "🛒", priority: false },
    { x: 260, y: 250, label: "Franchise", icon: "📍", priority: false },
  ];
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Industry sector signal dashboard">
      <Defs />
      {/* connections to core */}
      {nodes.map((n) => (
        <line
          key={`line-${n.label}`}
          x1="200"
          y1="150"
          x2={n.x}
          y2={n.y}
          stroke={n.priority ? C.teal : C.green}
          strokeWidth={n.priority ? 1.5 : 1}
          className="flow-line"
          opacity={n.priority ? 0.6 : 0.3}
        />
      ))}
      {/* core */}
      <circle cx="200" cy="150" r="32" fill={`url(#${SOFT_GRAD_ID})`} />
      <circle cx="200" cy="150" r="22" fill={`url(#${GRAD_ID})`} opacity={0.15} />
      <circle cx="200" cy="150" r="14" fill={`url(#${GRAD_ID})`} />
      <text x="200" y="146" textAnchor="middle" style={{ fontSize: 6, fontWeight: 700 }} fill={C.white}>SEARCH</text>
      <text x="200" y="155" textAnchor="middle" style={{ fontSize: 6, fontWeight: 700 }} fill={C.white}>INTENT</text>
      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={n.priority ? 18 : 14} fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={n.priority ? 2.5 : 1.5} />
          <text x={n.x} y={n.y + 1} textAnchor="middle" style={{ fontSize: 9 }} fill={C.teal}>{n.icon}</text>
          <text x={n.x} y={n.y + (n.priority ? 32 : 28)} textAnchor="middle" style={{ fontSize: 7, fontWeight: n.priority ? 700 : 600 }} fill={n.priority ? C.graphite : C.secondary}>
            {n.label}
          </text>
          {n.priority && (
            <circle cx={n.x + 14} cy={n.y - 12} r="4" fill={C.green} className="pulse-dot" />
          )}
        </g>
      ))}
    </svg>
  );
}