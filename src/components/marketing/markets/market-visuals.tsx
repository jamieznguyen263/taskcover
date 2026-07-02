/**
 * Market-specific visual systems.
 *
 * Each market gets a distinct regional search-intelligence visual (Part C):
 *  - USA:       national SERP saturation + local pack grid + AI overview band
 *  - Canada:    bilingual EN/FR demand split + provincial radar
 *  - Australia: high-value commercial SERP + local metro demand
 *
 * Hub visual: global market command dashboard — three regions around a
 * central "Search Demand" core with demand/trust/AI signal lanes.
 *
 * All visuals are illustrative UI only — no fabricated client metrics.
 * Bright-only palette, brand gradient accents, CSS motion via `flow-line`.
 */

import * as React from "react";
import type { MarketIcon } from "@/content/markets.types";

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
  amber: "#F59E0B",
} as const;

const GRAD_ID = "mkt-grad";
const SOFT_GRAD_ID = "mkt-grad-soft";

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
/* Hero visuals (larger, right-column of market hero)                         */
/* -------------------------------------------------------------------------- */

/** USA — national SERP saturation + local pack grid + AI overview band. */
function UsaHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="USA search landscape: national SERPs, local pack grid, and AI overview band">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* National SERP panel */}
      <rect x="16" y="16" width="232" height="148" rx={10} fill={C.tint} stroke={C.line} />
      <text x="28" y="32" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>NATIONAL SERPs</text>
      {[
        { y: 42, label: "Publisher", w: 200, c: C.muted },
        { y: 66, label: "Marketplace", w: 190, c: C.muted },
        { y: 90, label: "Big-budget brand", w: 180, c: C.muted },
        { y: 114, label: "Your brand", w: 170, c: C.teal },
      ].map((r) => (
        <g key={r.label}>
          <rect x="28" y={r.y} width={r.w} height={18} rx={5} fill={r.c === C.teal ? `url(#${GRAD_ID})` : C.white} stroke={r.c === C.teal ? C.teal : C.line} />
          <text x="36" y={r.y + 12} style={{ fontSize: 7, fontWeight: 600 }} fill={r.c === C.teal ? C.white : C.secondary}>{r.label}</text>
        </g>
      ))}
      {/* AI overview band */}
      <rect x="16" y="172" width="232" height="40" rx={8} fill={`url(#${SOFT_GRAD_ID})`} stroke={C.teal} />
      <text x="28" y="186" style={{ fontSize: 7, fontWeight: 700 }} fill={C.teal}>AI OVERVIEW</text>
      <rect x="28" y="192" width={200} height={5} rx={2.5} fill={C.teal} opacity={0.6} />
      <rect x="28" y="201" width={150} height={4} rx={2} fill={C.line} />
      {/* Local pack grid */}
      <rect x="260" y="16" width="124" height="196" rx={10} fill={C.white} stroke={C.line} />
      <text x="272" y="32" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>LOCAL PACK</text>
      {[0, 1, 2].map((col) =>
        [0, 1, 2].map((row) => (
          <g key={`${col}-${row}`}>
            <rect x={272 + col * 36} y={42 + row * 52} width={30} height={44} rx={6} fill={C.tint} stroke={C.lineSoft} />
            <circle cx={287 + col * 36} cy={58 + row * 52} r="6" fill={`url(#${GRAD_ID})`} />
            <rect x={277 + col * 36} y={70 + row * 52} width={20} height={3} rx={1.5} fill={C.teal} />
            <rect x={277 + col * 36} y={77 + row * 52} width={14} height={2.5} rx={1.25} fill={C.line} />
          </g>
        ))
      )}
      {/* Footer lane */}
      <text x="20" y="252" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>SATURATED NATIONAL · LOCAL-PACK REVENUE · AI DISPLACEMENT</text>
      <rect x="20" y="258" width="360" height="3" rx="1.5" fill={`url(#${GRAD_ID})`} opacity={0.5} className="flow-line" />
    </svg>
  );
}

/** Canada — bilingual EN/FR demand split + provincial radar. */
function CanadaHero({ className }: { className?: string }) {
  const radarPoints = [
    { x: 200, y: 70, label: "EN" },
    { x: 300, y: 120, label: "FR" },
    { x: 270, y: 210, label: "QC" },
    { x: 130, y: 210, label: "ON" },
    { x: 100, y: 120, label: "BC" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Canada search landscape: bilingual EN/FR demand split and provincial radar">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* radar polygon */}
      <path
        d={`M ${radarPoints[0].x} ${radarPoints[0].y} ${radarPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")} Z`}
        fill={`url(#${SOFT_GRAD_ID})`}
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={2}
      />
      {/* center */}
      <circle cx="200" cy="140" r="26" fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
      <text x="200" y="137" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.teal}>BILINGUAL</text>
      <text x="200" y="148" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.teal}>DEMAND</text>
      {/* nodes */}
      {radarPoints.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="15" fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
          <text x={p.x} y={p.y + 3} textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }} fill={C.secondary}>{p.label}</text>
        </g>
      ))}
      {/* hreflang lane */}
      <rect x="16" y="240" width="368" height="28" rx={8} fill={C.tint} stroke={C.line} />
      <text x="28" y="258" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>HREFLANG · LOCALE ARCHITECTURE · NO CANNIBALIZATION</text>
      <rect x="300" y="250" width="70" height="8" rx={4} fill={`url(#${GRAD_ID})`} opacity={0.6} className="flow-line" />
    </svg>
  );
}

/** Australia — high-value commercial SERP + local metro demand. */
function AustraliaHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Australia search landscape: high-value commercial SERPs and local metro demand">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* Commercial SERP */}
      <rect x="16" y="16" width="220" height="160" rx={10} fill={C.tint} stroke={C.line} />
      <text x="28" y="32" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>COMMERCIAL SERPs</text>
      {[
        { y: 44, label: "Competitor A", w: 190, v: 80 },
        { y: 72, label: "Competitor B", w: 180, v: 70 },
        { y: 100, label: "Your brand", w: 170, v: 55 },
        { y: 128, label: "Aggregator", w: 160, v: 65 },
      ].map((r) => (
        <g key={r.label}>
          <rect x="28" y={r.y} width={r.w} height={20} rx={5} fill={C.white} stroke={C.line} />
          <text x="36" y={r.y + 13} style={{ fontSize: 7, fontWeight: 600 }} fill={C.secondary}>{r.label}</text>
          {/* value bar */}
          <rect x={28 + r.w - 50} y={r.y + 7} width={40} height={6} rx={3} fill={C.line} />
          <rect x={28 + r.w - 50} y={r.y + 7} width={40 * r.v / 100} height={6} rx={3} fill={`url(#${GRAD_ID})`} />
        </g>
      ))}
      {/* Local metro demand */}
      <rect x="248" y="16" width="136" height="160" rx={10} fill={C.white} stroke={C.line} />
      <text x="260" y="32" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>LOCAL METRO</text>
      {[
        { y: 46, label: "Sydney", v: 90 },
        { y: 74, label: "Melbourne", v: 85 },
        { y: 102, label: "Brisbane", v: 75 },
        { y: 130, label: "Perth", v: 65 },
      ].map((r) => (
        <g key={r.label}>
          <rect x="260" y={r.y} width={112} height={22} rx={6} fill={C.tint} stroke={C.lineSoft} />
          <text x="268" y={r.y + 14} style={{ fontSize: 7, fontWeight: 600 }} fill={C.secondary}>{r.label}</text>
          <rect x={260 + 56} y={r.y + 8} width={48} height={6} rx={3} fill={C.line} />
          <rect x={260 + 56} y={r.y + 8} width={48 * r.v / 100} height={6} rx={3} fill={C.teal} />
        </g>
      ))}
      {/* PPC capture lane */}
      <rect x="16" y="188" width="368" height="32" rx={8} fill={`url(#${SOFT_GRAD_ID})`} stroke={C.teal} />
      <text x="28" y="208" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>PPC CAPTURE · HIGH-VALUE COMMERCIAL DEMAND</text>
      <rect x="280" y="200" width="90" height="8" rx={4} fill={`url(#${GRAD_ID})`} opacity={0.7} className="flow-line" />
      {/* footer */}
      <text x="20" y="244" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>HIGH-VALUE NICHES · LOCAL + NATIONAL · AI GROWING</text>
      <rect x="20" y="250" width="360" height="3" rx="1.5" fill={`url(#${GRAD_ID})`} opacity={0.5} />
    </svg>
  );
}

const heroVisuals: Record<MarketIcon, React.ComponentType<{ className?: string }>> = {
  usa: UsaHero,
  canada: CanadaHero,
  australia: AustraliaHero,
};

/** Render the market-specific hero visual. */
export function MarketHeroVisual({
  icon,
  className,
}: {
  icon: MarketIcon;
  className?: string;
}) {
  const Visual = heroVisuals[icon];
  return <Visual className={className} />;
}

/* -------------------------------------------------------------------------- */
/* Compact market badge (used in selector / comparison)                       */
/* -------------------------------------------------------------------------- */

/** Small circular region badge for the hub selector. */
export function MarketBadge({
  icon,
  className,
}: {
  icon: MarketIcon;
  className?: string;
}) {
  const label = icon === "usa" ? "US" : icon === "canada" ? "CA" : "AU";
  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2rem",
        height: "2rem",
        borderRadius: "0.625rem",
        background: "var(--brand-gradient, linear-gradient(135deg,#10E66A,#197DB4))",
        color: "#fff",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Hub visual — global market command dashboard                               */
/* -------------------------------------------------------------------------- */

/**
 * Global market command dashboard — three regions (USA, Canada, Australia)
 * arranged around a central "Search Demand" core, with demand/trust/AI
 * signal lanes. Used on the `/markets` hub hero.
 */
export function GlobalMarketDashboard({ className }: { className?: string }) {
  const regions = [
    { x: 90, y: 70, label: "USA", sub: "N. America", icon: "US", priority: true },
    { x: 310, y: 70, label: "Canada", sub: "N. America", icon: "CA", priority: false },
    { x: 200, y: 230, label: "Australia", sub: "Asia-Pacific", icon: "AU", priority: false },
  ];
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Global search market command dashboard across USA, Canada, and Australia">
      <Defs />
      {/* connection lines to core */}
      {regions.map((r) => (
        <line
          key={`line-${r.label}`}
          x1="200"
          y1="150"
          x2={r.x}
          y2={r.y}
          stroke={r.priority ? C.teal : C.green}
          strokeWidth={r.priority ? 2 : 1.5}
          className="flow-line"
          opacity={r.priority ? 0.7 : 0.45}
        />
      ))}
      {/* core */}
      <circle cx="200" cy="150" r="38" fill={`url(#${SOFT_GRAD_ID})`} />
      <circle cx="200" cy="150" r="26" fill={`url(#${GRAD_ID})`} opacity={0.18} />
      <circle cx="200" cy="150" r="16" fill={`url(#${GRAD_ID})`} />
      <text x="200" y="147" textAnchor="middle" style={{ fontSize: 6, fontWeight: 700 }} fill={C.white}>SEARCH</text>
      <text x="200" y="156" textAnchor="middle" style={{ fontSize: 6, fontWeight: 700 }} fill={C.white}>DEMAND</text>
      {/* region nodes */}
      {regions.map((r) => (
        <g key={r.label}>
          <circle cx={r.x} cy={r.y} r={r.priority ? 22 : 18} fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={r.priority ? 2.5 : 1.5} />
          <text x={r.x} y={r.y - 1} textAnchor="middle" style={{ fontSize: 9, fontWeight: 700 }} fill={C.teal}>{r.icon}</text>
          <text x={r.x} y={r.y + 9} textAnchor="middle" style={{ fontSize: 5, fontWeight: 600 }} fill={C.muted}>{r.sub}</text>
          <text x={r.x} y={r.y + (r.priority ? 38 : 34)} textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }} fill={r.priority ? C.graphite : C.secondary}>{r.label}</text>
          {r.priority && (
            <circle cx={r.x + 16} cy={r.y - 14} r="4" fill={C.green} className="pulse-dot" />
          )}
        </g>
      ))}
      {/* signal lanes legend */}
      <g>
        <rect x="16" y="276" width="120" height="14" rx={7} fill={C.tint} stroke={C.lineSoft} />
        <circle cx="26" cy="283" r="3" fill={C.green} />
        <text x="34" y="286" style={{ fontSize: 6, fontWeight: 600 }} fill={C.muted}>DEMAND</text>
        <circle cx="74" cy="283" r="3" fill={C.teal} />
        <text x="82" y="286" style={{ fontSize: 6, fontWeight: 600 }} fill={C.muted}>TRUST</text>
        <rect x="264" y="276" width="120" height="14" rx={7} fill={C.tint} stroke={C.lineSoft} />
        <circle cx="274" cy="283" r="3" fill={C.blue} />
        <text x="282" y="286" style={{ fontSize: 6, fontWeight: 600 }} fill={C.muted}>AI SEARCH</text>
        <circle cx="330" cy="283" r="3" fill={C.amber} />
        <text x="338" y="286" style={{ fontSize: 6, fontWeight: 600 }} fill={C.muted}>PPC</text>
      </g>
    </svg>
  );
}