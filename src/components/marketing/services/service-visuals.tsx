import * as React from "react";
import type { Service } from "@/data/services";

/**
 * Service-specific visual systems.
 *
 * Each service gets a distinct visual metaphor (Part C of the brief):
 *  - SEO Strategy:      search growth command roadmap
 *  - Technical SEO:     crawl / index / site-health diagnostic
 *  - AI Search:         entity graph + answer surface map
 *  - Content:           topic cluster + editorial pipeline
 *  - Digital PR:        authority signal network + mention pipeline
 *  - Local SEO:         local pack / map presence system
 *  - eCommerce SEO:     category / product architecture + buying-intent path
 *  - International SEO: market / language / regional expansion map
 *  - SEO Audit:         audit report preview + prioritized issue scoring
 *  - PPC:               paid search command center (Local / Global / tracking)
 *  - SEO Mentor:        advisory roadmap + training curriculum
 *
 * All visuals are illustrative UI only — no fabricated client metrics.
 * Bright-only palette, brand gradient accents, CSS motion via `flow-line`.
 */

type IconKey = Service["icon"];

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

const GRAD_ID = "svc-grad";
const SOFT_GRAD_ID = "svc-grad-soft";

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

/** Small labelled pill used inside several visuals. */
function Pill({
  x,
  y,
  label,
  fill = C.white,
  stroke = C.line,
  textFill = C.graphite,
  width = 64,
  opacity,
}: {
  x: number;
  y: number;
  label: string;
  fill?: string;
  stroke?: string;
  textFill?: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={width} height={18} rx={9} fill={fill} stroke={stroke} strokeWidth={1} opacity={opacity} />
      <text
        x={x + width / 2}
        y={y + 12.5}
        textAnchor="middle"
        style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.2 }}
        fill={textFill}
      >
        {label}
      </text>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero visuals (larger, right-column of service hero)                        */
/* -------------------------------------------------------------------------- */

/** SEO Strategy — search growth command roadmap. */
function StrategyHero({ className }: { className?: string }) {
  const milestones = [
    { x: 60, y: 230, label: "Audit" },
    { x: 150, y: 180, label: "Strategy" },
    { x: 245, y: 130, label: "AI Ready" },
    { x: 340, y: 80, label: "Revenue" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Search growth command roadmap">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      <rect x="0" y="0" width="400" height="42" rx={16} fill={C.tint} />
      <rect x="0" y="34" width="400" height="8" fill={C.tint} />
      <Pill x={16} y={13} label="GROWTH ROADMAP" width={108} fill={C.white} stroke={C.line} textFill={C.teal} />
      {/* ascending path */}
      <path
        d={`M ${milestones[0].x} ${milestones[0].y} L ${milestones[1].x} ${milestones[1].y} L ${milestones[2].x} ${milestones[2].y} L ${milestones[3].x} ${milestones[3].y}`}
        fill="none"
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* area under curve */}
      <path
        d={`M ${milestones[0].x} ${milestones[0].y} L ${milestones[1].x} ${milestones[1].y} L ${milestones[2].x} ${milestones[2].y} L ${milestones[3].x} ${milestones[3].y} L ${milestones[3].x} 250 L ${milestones[0].x} 250 Z`}
        fill={`url(#${SOFT_GRAD_ID})`}
      />
      {milestones.map((m) => (
        <g key={m.label}>
          <circle cx={m.x} cy={m.y} r={9} fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={2.5} />
          <circle cx={m.x} cy={m.y} r={3.5} fill={`url(#${GRAD_ID})`} />
          <text x={m.x} y={m.y + 26} textAnchor="middle" style={{ fontSize: 9, fontWeight: 600 }} fill={C.secondary}>
            {m.label}
          </text>
        </g>
      ))}
      {/* branch chips */}
      <Pill x={270} y={200} label="SEO · AI · PPC" width={108} fill={C.tint} stroke={C.lineSoft} textFill={C.secondary} />
      <line x1="300" y1="200" x2="300" y2="150" stroke={C.line} strokeDasharray="3 3" />
    </svg>
  );
}

/** Technical SEO — crawl / index / site-health diagnostic. */
function TechnicalHero({ className }: { className?: string }) {
  const pages = [
    { x: 40, y: 90, status: "ok" },
    { x: 100, y: 90, status: "ok" },
    { x: 160, y: 90, status: "warn" },
    { x: 220, y: 90, status: "ok" },
    { x: 280, y: 90, status: "excluded" },
    { x: 340, y: 90, status: "ok" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Crawl and index health diagnostic">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* crawler */}
      <g>
        <circle cx="200" cy="40" r="16" fill={`url(#${GRAD_ID})`} />
        <circle cx="200" cy="40" r="6" fill={C.white} />
        <text x="200" y="44" textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>GB</text>
      </g>
      {pages.map((p, i) => (
        <g key={i}>
          <line x1="200" y1="56" x2={p.x + 20} y2={p.y} stroke={C.line} strokeWidth={1} opacity={0.6} />
          <rect x={p.x} y={p.y} width={40} height={30} rx={5} fill={C.tint} stroke={C.line} />
          <rect x={p.x + 6} y={p.y + 6} width={28} height={5} rx={2.5} fill={C.teal} opacity={0.5} />
          <rect x={p.x + 6} y={p.y + 15} width={20} height={4} rx={2} fill={C.line} />
          {p.status === "ok" && (
            <circle cx={p.x + 34} cy={p.y + 26} r={5} fill={C.green} stroke={C.white} strokeWidth={1.5} />
          )}
          {p.status === "warn" && (
            <circle cx={p.x + 34} cy={p.y + 26} r={5} fill="#F59E0B" stroke={C.white} strokeWidth={1.5} />
          )}
          {p.status === "excluded" && (
            <circle cx={p.x + 34} cy={p.y + 26} r={5} fill={C.muted} stroke={C.white} strokeWidth={1.5} />
          )}
        </g>
      ))}
      {/* health bars */}
      <g>
        <text x="20" y="170" style={{ fontSize: 9, fontWeight: 600 }} fill={C.muted}>SITE HEALTH</text>
        {[
          { label: "Crawl", w: 150, c: C.green },
          { label: "Index", w: 120, c: C.emerald },
          { label: "Vitals", w: 170, c: C.teal },
          { label: "Schema", w: 100, c: C.blue },
        ].map((b, i) => (
          <g key={b.label}>
            <text x="20" y={195 + i * 20} style={{ fontSize: 9, fontWeight: 600 }} fill={C.secondary}>{b.label}</text>
            <rect x="80" y={187 + i * 20} width="200" height={8} rx={4} fill={C.tint} />
            <rect x="80" y={187 + i * 20} width={b.w} height={8} rx={4} fill={b.c} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** AI Search Optimization — entity graph + answer surface map. */
function AiHero({ className }: { className?: string }) {
  const entities = [
    { x: 90, y: 120, label: "Product" },
    { x: 90, y: 200, label: "Category" },
    { x: 310, y: 120, label: "Founder" },
    { x: 310, y: 200, label: "Reviews" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Entity graph and AI answer surface">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* answer card */}
      <rect x="120" y="20" width="160" height="64" rx={10} fill={C.tint} stroke={C.line} />
      <text x="132" y="38" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>AI OVERVIEW</text>
      <rect x="132" y="44" width="120" height={5} rx={2.5} fill={C.teal} />
      <rect x="132" y="54" width="136" height={3.5} rx={1.75} fill={C.line} />
      <rect x="132" y="62" width="100" height={3.5} rx={1.75} fill={C.line} />
      <Pill x={226} y={68} label="Cited source" width={70} fill={C.green} opacity={0.2} stroke={C.green} textFill={C.graphite} />
      {/* brand hub */}
      <circle cx="200" cy="160" r="26" fill={`url(#${SOFT_GRAD_ID})`} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
      <text x="200" y="164" textAnchor="middle" style={{ fontSize: 9, fontWeight: 700 }} fill={C.teal}>BRAND</text>
      {entities.map((e) => (
        <g key={e.label}>
          <line x1="200" y1="160" x2={e.x} y2={e.y} stroke={C.green} strokeWidth={1.5} className="flow-line" opacity={0.6} />
          <circle cx={e.x} cy={e.y} r="16" fill={C.white} stroke={C.teal} strokeWidth={1.5} />
          <text x={e.x} y={e.y + 3} textAnchor="middle" style={{ fontSize: 7, fontWeight: 600 }} fill={C.secondary}>{e.label}</text>
        </g>
      ))}
      <text x="20" y="260" style={{ fontSize: 9, fontWeight: 600 }} fill={C.muted}>ENTITY CLARITY · CITATION-WORTHY · STRUCTURED</text>
    </svg>
  );
}

/** Content Marketing — topic cluster + editorial pipeline. */
function ContentHero({ className }: { className?: string }) {
  const spokes = [
    { x: 110, y: 90 },
    { x: 200, y: 70 },
    { x: 290, y: 90 },
    { x: 110, y: 170 },
    { x: 290, y: 170 },
    { x: 150, y: 220 },
    { x: 250, y: 220 },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Topic cluster and editorial pipeline">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {spokes.map((s, i) => (
        <line key={i} x1="200" y1="150" x2={s.x} y2={s.y} stroke={C.line} strokeWidth={1} />
      ))}
      {spokes.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="12" fill={C.white} stroke={C.green} strokeWidth={1.5} />
      ))}
      <circle cx="200" cy="150" r="22" fill={`url(#${GRAD_ID})`} />
      <text x="200" y="154" textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }} fill={C.white}>PILLAR</text>
      {/* pipeline */}
      <g transform="translate(0,250)">
        {["Brief", "Draft", "Optimize", "Publish"].map((s, i) => (
          <g key={s}>
            <rect x={30 + i * 90} y={-14} width={70} height={18} rx={9} fill={C.tint} stroke={C.line} />
            <text x={65 + i * 90} y={-1} textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>{s}</text>
            {i < 3 && <path d={`M ${100 + i * 90} -5 L ${116 + i * 90} -5`} stroke={C.teal} strokeWidth={1.5} markerEnd="" />}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Digital PR — authority signal network + mention pipeline. */
function PrHero({ className }: { className?: string }) {
  const pubs = [
    { x: 70, y: 80, label: "Press" },
    { x: 200, y: 60, label: "Media" },
    { x: 330, y: 80, label: "Industry" },
    { x: 70, y: 200, label: "Partner" },
    { x: 330, y: 200, label: "Community" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Authority signal network and mention pipeline">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {pubs.map((p, i) => (
        <line key={i} x1="200" y1="150" x2={p.x} y2={p.y} stroke={C.green} strokeWidth={1.5} className="flow-line" opacity={0.5} />
      ))}
      {pubs.map((p) => (
        <g key={p.label}>
          <rect x={p.x - 26} y={p.y - 12} width={52} height={24} rx={6} fill={C.white} stroke={C.teal} strokeWidth={1.5} />
          <text x={p.x} y={p.y + 3} textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>{p.label}</text>
        </g>
      ))}
      <circle cx="200" cy="150" r="28" fill={`url(#${SOFT_GRAD_ID})`} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
      <text x="200" y="148" textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>YOUR</text>
      <text x="200" y="160" textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>BRAND</text>
      {/* authority meter */}
      <rect x="140" y="232" width="120" height="8" rx={4} fill={C.tint} />
      <rect x="140" y="232" width="92" height="8" rx={4} fill={`url(#${GRAD_ID})`} />
      <text x="200" y="256" textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>EARNED AUTHORITY SIGNALS</text>
    </svg>
  );
}

/** Local SEO — local pack / map presence system. */
function LocalHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Local pack and map presence">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* map surface */}
      <rect x="16" y="60" width="240" height="200" rx={10} fill={C.tint} />
      {[...Array(6)].map((_, i) => (
        <line key={`v${i}`} x1={16 + i * 40} y1={60} x2={16 + i * 40} y2={260} stroke={C.lineSoft} />
      ))}
      {[...Array(5)].map((_, i) => (
        <line key={`h${i}`} x1={16} y1={60 + i * 40} x2={256} y2={60 + i * 40} stroke={C.lineSoft} />
      ))}
      {[
        { x: 80, y: 120 },
        { x: 150, y: 100 },
        { x: 200, y: 170 },
      ].map((p, i) => (
        <g key={i}>
          <path
            d={`M ${p.x} ${p.y} C ${p.x - 8} ${p.y - 14}, ${p.x - 8} ${p.y - 24}, ${p.x} ${p.y - 24} C ${p.x + 8} ${p.y - 24}, ${p.x + 8} ${p.y - 14}, ${p.x} ${p.y}`}
            fill={`url(#${GRAD_ID})`}
            stroke={C.teal}
            strokeWidth={1}
          />
          <circle cx={p.x} cy={p.y - 17} r={3.5} fill={C.white} />
        </g>
      ))}
      {/* local pack card */}
      <rect x="276" y="60" width="108" height="200" rx={10} fill={C.white} stroke={C.line} />
      <text x="288" y="80" style={{ fontSize: 8, fontWeight: 700 }} fill={C.teal}>LOCAL PACK</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={288} y={92 + i * 56} width={84} height={46} rx={6} fill={C.tint} />
          <circle cx={300} cy={106 + i * 56} r={7} fill={`url(#${GRAD_ID})`} />
          <rect x={314} y={100 + i * 56} width={50} height={5} rx={2.5} fill={C.teal} />
          <rect x={314} y={110 + i * 56} width={40} height={3.5} rx={1.75} fill={C.line} />
          <rect x={314} y={120 + i * 56} width={30} height={3.5} rx={1.75} fill={C.line} />
        </g>
      ))}
    </svg>
  );
}

/** eCommerce SEO — category / product architecture + buying-intent path. */
function EcommerceHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Category and product architecture">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* category root */}
      <rect x="160" y="30" width="80" height="26" rx={8} fill={`url(#${GRAD_ID})`} />
      <text x="200" y="47" textAnchor="middle" style={{ fontSize: 9, fontWeight: 700 }} fill={C.white}>CATEGORY</text>
      {[
        { x: 70, y: 110 },
        { x: 200, y: 110 },
        { x: 330, y: 110 },
      ].map((c, i) => (
        <g key={i}>
          <line x1="200" y1="56" x2={c.x} y2={c.y - 12} stroke={C.line} strokeWidth={1.5} />
          <rect x={c.x - 40} y={c.y - 12} width={80} height={24} rx={8} fill={C.tint} stroke={C.teal} />
          <text x={c.x} y={c.y + 3} textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>Sub-cat</text>
        </g>
      ))}
      {/* product grid */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <rect x={40 + col * 84} y={150 + row * 48} width={72} height={38} rx={6} fill={C.white} stroke={C.line} />
            <rect x={48 + col * 84} y={158 + row * 48} width={56} height={14} rx={3} fill={C.tint} />
            <rect x={48 + col * 84} y={176 + row * 48} width={36} height={4} rx={2} fill={C.green} opacity={0.6} />
          </g>
        ))
      )}
      <text x="20" y="270" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>BUYING-INTENT PATH · STRUCTURED PRODUCT DATA</text>
    </svg>
  );
}

/** International SEO — market / language / regional expansion map. */
function InternationalHero({ className }: { className?: string }) {
  const markets = [
    { x: 90, y: 90, code: "US" },
    { x: 200, y: 70, code: "CA" },
    { x: 310, y: 100, code: "AU" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="International market and language map">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* globe */}
      <circle cx="200" cy="140" r="80" fill="none" stroke={C.teal} strokeWidth={1.5} />
      <ellipse cx="200" cy="140" rx="80" ry="34" fill="none" stroke={C.teal} strokeWidth={1} opacity={0.4} />
      <ellipse cx="200" cy="140" rx="34" ry="80" fill="none" stroke={C.teal} strokeWidth={1} opacity={0.4} />
      <line x1="120" y1="140" x2="280" y2="140" stroke={C.teal} strokeWidth={1} opacity={0.4} />
      <line x1="200" y1="60" x2="200" y2="220" stroke={C.teal} strokeWidth={1} opacity={0.4} />
      {markets.map((m) => (
        <g key={m.code}>
          <circle cx={m.x} cy={m.y} r="14" fill={`url(#${GRAD_ID})`} />
          <text x={m.x} y={m.y + 4} textAnchor="middle" style={{ fontSize: 9, fontWeight: 700 }} fill={C.white}>{m.code}</text>
          <line x1="200" y1="140" x2={m.x} y2={m.y} stroke={C.green} strokeWidth={1} className="flow-line" opacity={0.5} />
        </g>
      ))}
      {/* hreflang chips */}
      {["en-US", "en-CA", "fr-CA", "en-AU"].map((h, i) => (
        <g key={h}>
          <rect x={40 + i * 86} y={244} width={76} height={20} rx={10} fill={C.tint} stroke={C.lineSoft} />
          <text x={78 + i * 86} y={258} textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>{h}</text>
        </g>
      ))}
    </svg>
  );
}

/** SEO Audit — audit report preview + prioritized issue scoring. */
function AuditHero({ className }: { className?: string }) {
  const rows = [
    { label: "Technical", level: 78, c: C.green },
    { label: "Content", level: 62, c: C.emerald },
    { label: "Authority", level: 48, c: C.teal },
    { label: "AI Ready", level: 70, c: C.blue },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Audit report preview with prioritized scoring">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      <rect x="0" y="0" width="400" height="44" rx={16} fill={C.tint} />
      <rect x="0" y="36" width="400" height="8" fill={C.tint} />
      <text x="20" y="28" style={{ fontSize: 10, fontWeight: 700 }} fill={C.teal}>SEO GROWTH AUDIT</text>
      <Pill x={300} y={13} label="90-DAY PLAN" width={84} fill={`url(#${GRAD_ID})`} stroke={C.teal} textFill={C.white} />
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x="24" y={84 + i * 40} style={{ fontSize: 10, fontWeight: 600 }} fill={C.secondary}>{r.label}</text>
          <rect x="120" y={74 + i * 40} width="220" height={10} rx={5} fill={C.tint} />
          <rect x="120" y={74 + i * 40} width={r.level * 2.2} height={10} rx={5} fill={r.c} />
          <text x="350" y={83 + i * 40} style={{ fontSize: 9, fontWeight: 700 }} fill={C.graphite}>{r.level}</text>
        </g>
      ))}
      {/* priority chip */}
      <rect x="24" y="244" width="352" height="24" rx={8} fill={C.tint} stroke={C.lineSoft} />
      <circle cx="40" cy="256" r="5" fill={C.green} />
      <text x="54" y="260" style={{ fontSize: 9, fontWeight: 600 }} fill={C.secondary}>Prioritized by impact & effort — illustrated preview</text>
    </svg>
  );
}

/** PPC Management — paid search command center. */
function PpcHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Paid search command center with local and global PPC">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      {/* ad block */}
      <rect x="16" y="20" width="180" height="80" rx={10} fill={C.tint} stroke={C.line} />
      <text x="28" y="36" style={{ fontSize: 7, fontWeight: 700 }} fill={C.muted}>AD</text>
      <rect x="28" y="44" width="120" height="6" rx={3} fill={C.teal} />
      <rect x="28" y="56" width="90" height="4" rx={2} fill={C.line} />
      <rect x="28" y="66" width="70" height="4" rx={2} fill={C.line} />
      <rect x="28" y="80" width="40" height="14" rx={7} fill={`url(#${GRAD_ID})`} />
      <text x="48" y="90" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.white}>CTA</text>
      {/* local / global toggles */}
      <Pill x={210} y={24} label="LOCAL PPC" width={80} fill={C.white} stroke={C.teal} textFill={C.teal} />
      <Pill x={300} y={24} label="GLOBAL PPC" width={86} fill={C.tint} stroke={C.line} textFill={C.secondary} />
      {/* conversion graph */}
      <rect x="210" y="56" width="174" height="100" rx={10} fill={C.white} stroke={C.line} />
      <text x="222" y="74" style={{ fontSize: 8, fontWeight: 700 }} fill={C.muted}>CONVERSION TRACKING</text>
      <polyline points="226,140 250,128 274,132 298,112 322,116 346,96 366,84" fill="none" stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
      {[226, 250, 274, 298, 322, 346, 366].map((x, i) => (
        <circle key={i} cx={x} cy={[140, 128, 132, 112, 116, 96, 84][i]} r={2.5} fill={C.teal} />
      ))}
      {/* intent map */}
      <rect x="16" y="116" width="180" height="144" rx={10} fill={C.white} stroke={C.line} />
      <text x="28" y="134" style={{ fontSize: 8, fontWeight: 700 }} fill={C.muted}>PAID + ORGANIC INTENT</text>
      <rect x="28" y="146" width="156" height="10" rx={5} fill={C.tint} />
      <rect x="28" y="146" width="110" height="10" rx={5} fill={C.green} opacity={0.5} />
      <text x="28" y="174" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>Organic</text>
      <rect x="28" y="184" width="156" height="10" rx={5} fill={C.tint} />
      <rect x="28" y="184" width="70" height="10" rx={5} fill={C.teal} />
      <text x="28" y="212" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>Paid</text>
      <text x="28" y="244" style={{ fontSize: 8, fontWeight: 600 }} fill={C.muted}>One shared intent map</text>
    </svg>
  );
}

/** SEO Mentor — advisory roadmap + training curriculum. */
function MentorHero({ className }: { className?: string }) {
  const sessions = [
    { x: 60, y: 120, label: "S1" },
    { x: 130, y: 100, label: "S2" },
    { x: 200, y: 130, label: "S3" },
    { x: 270, y: 90, label: "S4" },
    { x: 340, y: 110, label: "S5" },
  ];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Advisory roadmap and training curriculum">
      <Defs />
      <rect x="0" y="0" width="400" height="280" rx={16} fill={C.white} stroke={C.line} />
      <text x="20" y="28" style={{ fontSize: 9, fontWeight: 700 }} fill={C.teal}>ADVISORY ROADMAP</text>
      {/* roadmap line */}
      <path
        d={`M ${sessions[0].x} ${sessions[0].y} ${sessions.slice(1).map((s) => `L ${s.x} ${s.y}`).join(" ")}`}
        fill="none"
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {sessions.map((s) => (
        <g key={s.label}>
          <circle cx={s.x} cy={s.y} r="12" fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={2} />
          <text x={s.x} y={s.y + 3} textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.teal}>{s.label}</text>
        </g>
      ))}
      {/* curriculum modules */}
      <text x="20" y="172" style={{ fontSize: 9, fontWeight: 700 }} fill={C.muted}>CURRICULUM</text>
      {["Strategy", "Technical", "Content", "AI Search", "Reporting"].map((m, i) => (
        <g key={m}>
          <rect x={20 + i * 74} y={184} width={66} height={26} rx={8} fill={C.tint} stroke={C.lineSoft} />
          <text x={53 + i * 74} y="201" textAnchor="middle" style={{ fontSize: 8, fontWeight: 600 }} fill={C.secondary}>{m}</text>
        </g>
      ))}
      {/* office hours */}
      <rect x="20" y="226" width="360" height="36" rx={8} fill={`url(#${SOFT_GRAD_ID})`} stroke={C.lineSoft} />
      <circle cx="40" cy="244" r="6" fill={C.green} className="pulse-dot" />
      <text x="56" y="248" style={{ fontSize: 9, fontWeight: 600 }} fill={C.secondary}>Monthly office hours · async support · accountability reviews</text>
    </svg>
  );
}

const heroVisuals: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  strategy: StrategyHero,
  technical: TechnicalHero,
  ai: AiHero,
  content: ContentHero,
  pr: PrHero,
  local: LocalHero,
  ecommerce: EcommerceHero,
  international: InternationalHero,
  audit: AuditHero,
  ppc: PpcHero,
  mentor: MentorHero,
};

/** Render the service-specific hero visual. */
export function ServiceHeroVisual({
  icon,
  className,
}: {
  icon: IconKey;
  className?: string;
}) {
  const Visual = heroVisuals[icon];
  return <Visual className={className} />;
}

/* -------------------------------------------------------------------------- */
/* Deliverable micro-visuals (compact, used inside the deliverables panel)     */
/* -------------------------------------------------------------------------- */

function MiniChecklist({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Checklist deliverable">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="10" y={10 + i * 16} width={10} height={10} rx={2} fill={C.green} opacity={0.85} />
          <path d={`M ${12} ${15 + i * 16} l 2 2 l 4 -4`} stroke={C.white} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={26} y={12 + i * 16} width={i === 1 ? 60 : 80} height={6} rx={3} fill={C.line} />
        </g>
      ))}
    </svg>
  );
}

function MiniCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Topic cluster deliverable">
      <circle cx="60" cy="40" r="12" fill={`url(#${GRAD_ID})`} />
      {[
        { x: 20, y: 20 },
        { x: 100, y: 20 },
        { x: 20, y: 60 },
        { x: 100, y: 60 },
        { x: 60, y: 12 },
        { x: 60, y: 68 },
      ].map((p, i) => (
        <g key={i}>
          <line x1="60" y1="40" x2={p.x} y2={p.y} stroke={C.line} strokeWidth={1} />
          <circle cx={p.x} cy={p.y} r="5" fill={C.white} stroke={C.green} strokeWidth={1.5} />
        </g>
      ))}
    </svg>
  );
}

function MiniNetwork({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Authority network deliverable">
      <rect x="48" y="30" width="24" height="20" rx="4" fill={`url(#${GRAD_ID})`} />
      {[
        { x: 16, y: 16 },
        { x: 104, y: 16 },
        { x: 16, y: 64 },
        { x: 104, y: 64 },
      ].map((p, i) => (
        <g key={i}>
          <line x1="60" y1="40" x2={p.x} y2={p.y} stroke={C.green} strokeWidth={1} className="flow-line" opacity={0.6} />
          <rect x={p.x - 8} y={p.y - 6} width={16} height={12} rx={3} fill={C.white} stroke={C.teal} strokeWidth={1} />
        </g>
      ))}
    </svg>
  );
}

function MiniMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Local map deliverable">
      <rect x="6" y="10" width="108" height="60" rx={6} fill={C.tint} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={6 + i * 22} y1={10} x2={6 + i * 22} y2={70} stroke={C.lineSoft} />
      ))}
      {[
        { x: 36, y: 34 },
        { x: 70, y: 28 },
        { x: 88, y: 52 },
      ].map((p, i) => (
        <g key={i}>
          <path d={`M ${p.x} ${p.y} C ${p.x - 5} ${p.y - 9}, ${p.x - 5} ${p.y - 15}, ${p.x} ${p.y - 15} C ${p.x + 5} ${p.y - 15}, ${p.x + 5} ${p.y - 9}, ${p.x} ${p.y}`} fill={C.green} />
          <circle cx={p.x} cy={p.y - 10} r={2} fill={C.white} />
        </g>
      ))}
    </svg>
  );
}

function MiniCatalog({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Product catalog deliverable">
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <rect x={10 + col * 36} y={12 + row * 30} width={30} height={24} rx={4} fill={C.white} stroke={C.line} />
            <rect x={14 + col * 36} y={16 + row * 30} width={22} height={10} rx={2} fill={C.tint} />
            <rect x={14 + col * 36} y={30 + row * 30} width={14} height={3} rx={1.5} fill={C.green} opacity={0.6} />
          </g>
        ))
      )}
    </svg>
  );
}

function MiniGlobe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="International markets deliverable">
      <circle cx="60" cy="40" r="24" fill="none" stroke={C.teal} strokeWidth={1.5} />
      <ellipse cx="60" cy="40" rx="24" ry="10" fill="none" stroke={C.teal} strokeWidth={1} opacity={0.4} />
      <ellipse cx="60" cy="40" rx="10" ry="24" fill="none" stroke={C.teal} strokeWidth={1} opacity={0.4} />
      {[
        { x: 44, y: 30 },
        { x: 78, y: 50 },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={C.green} />
      ))}
    </svg>
  );
}

function MiniReport({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Audit report deliverable">
      <rect x="20" y="12" width="80" height="56" rx={6} fill={C.white} stroke={C.line} />
      <rect x="28" y="20" width="50" height="5" rx={2.5} fill={C.teal} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="28" y={32 + i * 10} width={i === 1 ? 48 : 60} height={4} rx={2} fill={C.line} />
      ))}
      <rect x="28" y="62" width="24" height="8" rx={4} fill={`url(#${GRAD_ID})`} />
    </svg>
  );
}

function MiniControlPanel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="PPC control panel deliverable">
      <rect x="8" y="12" width="104" height="56" rx={6} fill={C.white} stroke={C.line} />
      <text x="16" y="24" style={{ fontSize: 6, fontWeight: 700 }} fill={C.muted}>PPC CONTROL</text>
      {[20, 36, 52].map((y, i) => (
        <rect key={i} x="16" y={y} width={70 - i * 10} height={4} rx={2} fill={i === 0 ? C.teal : C.line} />
      ))}
      <rect x="92" y="28" width="14" height="14" rx="3" fill={C.green} opacity={0.7} />
      <rect x="92" y="46" width="14" height="14" rx="3" fill={C.teal} opacity={0.6} />
    </svg>
  );
}

function MiniCurriculum({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Mentorship curriculum deliverable">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={10 + i * 27} y={20 + (i % 2) * 8} width={22} height={36} rx={4} fill={i === 1 ? `url(#${GRAD_ID})` : C.tint} stroke={C.lineSoft} />
      ))}
      <line x1="10" y1="68" x2="110" y2="68" stroke={C.line} />
    </svg>
  );
}

const deliverableVisuals: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  strategy: MiniChecklist,
  technical: MiniChecklist,
  ai: MiniCluster,
  content: MiniCluster,
  pr: MiniNetwork,
  local: MiniMap,
  ecommerce: MiniCatalog,
  international: MiniGlobe,
  audit: MiniReport,
  ppc: MiniControlPanel,
  mentor: MiniCurriculum,
};

/** Render a service-specific compact deliverable visual. */
export function ServiceDeliverableVisual({
  icon,
  className,
}: {
  icon: IconKey;
  className?: string;
}) {
  const Visual = deliverableVisuals[icon];
  return <Visual className={className} />;
}

/* -------------------------------------------------------------------------- */
/* Hub visuals — service constellation map + decision guide accents            */
/* -------------------------------------------------------------------------- */

/**
 * Service constellation — services as nodes orbiting a central
 * "Search Growth System" core, connected by flowing lines.
 * Used on the `/services` hub. Unique system visual (not a grid).
 */
export function ServiceConstellation({ className }: { className?: string }) {
  const nodes = [
    { x: 80, y: 90, label: "Strategy", angle: 200 },
    { x: 60, y: 170, label: "Technical", angle: 160 },
    { x: 120, y: 230, label: "Local", angle: 120 },
    { x: 280, y: 230, label: "eCommerce", angle: 60 },
    { x: 340, y: 170, label: "International", angle: 20 },
    { x: 320, y: 90, label: "AI Search", angle: 340 },
    { x: 200, y: 50, label: "Content", angle: 270 },
    { x: 200, y: 250, label: "PPC", angle: 90 },
    { x: 140, y: 140, label: "PR", angle: 225 },
    { x: 260, y: 140, label: "Mentor", angle: 315 },
    { x: 200, y: 150, label: "Audit", angle: 0 },
  ];
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Search growth service constellation">
      <Defs />
      {/* connections to core */}
      {nodes.map((n) => (
        <line
          key={`line-${n.label}`}
          x1="200"
          y1="150"
          x2={n.x}
          y2={n.y}
          stroke={C.green}
          strokeWidth={1}
          className="flow-line"
          opacity={0.35}
        />
      ))}
      {/* core */}
      <circle cx="200" cy="150" r="30" fill={`url(#${SOFT_GRAD_ID})`} />
      <circle cx="200" cy="150" r="20" fill={`url(#${GRAD_ID})`} opacity={0.15} />
      <circle cx="200" cy="150" r="12" fill={`url(#${GRAD_ID})`} />
      <text x="200" y="146" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.white}>SEARCH</text>
      <text x="200" y="155" textAnchor="middle" style={{ fontSize: 7, fontWeight: 700 }} fill={C.white}>SYSTEM</text>
      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="14" fill={C.white} stroke={`url(#${GRAD_ID})`} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 3} textAnchor="middle" style={{ fontSize: 6, fontWeight: 600 }} fill={C.secondary}>
            {n.label.length > 8 ? n.label.slice(0, 7) + "…" : n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/**
 * Decision-guide accent — a small "path" visual for the
 * "which service is right for you" scenario cards.
 */
export function DecisionPathAccent({
  variant,
  className,
}: {
  variant: "visibility" | "capture" | "authority" | "capability";
  className?: string;
}) {
  const variants = {
    visibility: { from: "Blind spots", to: "Visible", c: C.green },
    capture: { from: "Leaking demand", to: "Captured", c: C.teal },
    authority: { from: "Unknown", to: "Cited", c: C.blue },
    capability: { from: "Guesswork", to: "Confident", c: C.emerald },
  } as const;
  const v = variants[variant];
  return (
    <svg viewBox="0 0 120 40" className={className} role="img" aria-label={`${v.from} to ${v.to}`}>
      <Defs />
      <Pill x={4} y={11} label={v.from} width={48} fill={C.tint} stroke={C.line} textFill={C.muted} />
      <path d="M 56 20 L 70 20" stroke={v.c} strokeWidth={1.5} markerEnd="" />
      <path d="M 66 16 L 70 20 L 66 24" fill="none" stroke={v.c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Pill x={72} y={11} label={v.to} width={44} fill={v.c} stroke={v.c} textFill={C.white} />
    </svg>
  );
}