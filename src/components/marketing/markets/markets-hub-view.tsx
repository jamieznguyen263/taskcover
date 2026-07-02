/**
 * Shared markets hub view — renders from localized MarketsContent.
 *
 * Used by:
 *  - app/markets/page.tsx            (English, unprefixed)
 *  - app/[locale]/markets/page.tsx    (fr / es)
 *
 * Distinct sections (no two share the same layout):
 *  1. Hero — split with floating global market command dashboard
 *  2. Regional selector — interactive map-style panels + detail preview
 *  3. Comparison matrix — table-style market behavior grid
 *  4. Growth systems — stacked regional playbooks (not a card grid)
 *  5. CTA — premium conversion panel with audit preview
 */

"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles, Compass, Globe2 } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { GlobalMarketDashboard, MarketBadge } from "@/components/marketing/markets/market-visuals";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import {
  getMarketsContent,
  getMarkets,
  getServiceBySlug,
} from "@/lib/content";

/** Comparison matrix values per market (visual-only levels, not metrics). */
const comparisonData: Record<
  string,
  {
    competition: number;
    local: number;
    national: number;
    multilingual: number;
    ppc: number;
    trust: number;
    ai: number;
  }
> = {
  "usa-seo-agency": { competition: 5, local: 5, national: 5, multilingual: 3, ppc: 5, trust: 4, ai: 5 },
  "canada-seo-agency": { competition: 3, local: 4, national: 4, multilingual: 5, ppc: 3, trust: 5, ai: 4 },
  "australia-seo-agency": { competition: 4, local: 5, national: 4, multilingual: 1, ppc: 5, trust: 4, ai: 4 },
};

function LevelBars({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-1 rounded-full",
            i < level ? "bg-brand-gradient" : "bg-line"
          )}
        />
      ))}
    </span>
  );
}

// Inline cn to avoid extra import cycles in this client component.
function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function MarketsHubView({ locale }: { locale: Locale }) {
  const content = getMarketsContent(locale);
  const markets = getMarkets(locale);
  const loc = (p: string) => localizePath(p, locale);
  const reduceMotion = useReducedMotion();
  const [activeMarket, setActiveMarket] = React.useState(0);
  const current = markets[activeMarket];

  const homeCrumb = locale === "en" ? "/" : `/${locale}`;

  return (
    <>
      {/* 1. Hero — split with floating global market command dashboard */}
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li className="inline-flex items-center gap-1.5">
                  <Link href={homeCrumb} className="text-muted transition-colors hover:text-brand-teal">
                    {content.ui.breadcrumbHome}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li>
                  <span aria-current="page" className="text-secondary">
                    {content.ui.breadcrumbMarkets}
                  </span>
                </li>
              </ol>
            </nav>
            <Eyebrow>{content.hub.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.hub.h1}
            </h1>
            <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
              {content.hub.positioning}
            </p>
            <p className="max-w-xl text-pretty text-secondary sm:text-lg">
              {content.hub.description}
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={loc(content.hub.primaryCta.href)}>
                {content.hub.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                {content.hub.secondaryCta.label}
              </CTAButton>
            </div>
          </div>
          {/* Floating global market command dashboard */}
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
            <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-4 ring-brand-glow">
              <GlobalMarketDashboard className="h-auto w-full" />
              <figcaption className="mt-1 text-center text-[11px] text-muted">
                {content.hub.heroFigcaption}
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* 2. Regional selector — interactive map-style panels + detail preview */}
      <Section background="default" aria-labelledby="selector-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.selectorSection.eyebrow}
            titleId="selector-title"
            title={content.hub.selectorSection.title}
            description={content.hub.selectorSection.description}
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Market panels (map-style) */}
            <div className="flex flex-col gap-3" role="tablist" aria-label={content.hub.eyebrow}>
              {markets.map((m, i) => {
                const isActive = activeMarket === i;
                return (
                  <button
                    key={m.slug}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveMarket(i)}
                    onMouseEnter={() => setActiveMarket(i)}
                    onFocus={() => setActiveMarket(i)}
                    className={cn(
                      "group flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                      isActive
                        ? "border-brand-teal/40 bg-white shadow-[0_8px_24px_-16px_rgba(24,138,172,0.4)]"
                        : "border-line bg-surface-tint/40 hover:bg-white/70"
                    )}
                  >
                    <MarketBadge icon={m.icon} />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-sm font-semibold transition-colors", isActive ? "text-graphite" : "text-secondary")}>
                          {m.name} · {m.regionLabel}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                          {m.eyebrow}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-secondary">{m.marketContext}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail preview panel */}
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line bg-surface-tint p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMarket}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col gap-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                        {current.eyebrow}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-graphite">
                        {current.name}
                      </h3>
                    </div>
                    <MarketBadge icon={current.icon} />
                  </div>

                  {/* Search landscape preview */}
                  <div className="rounded-xl border border-line-soft bg-white p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {content.ui.searchLandscapeEyebrow}
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">
                      {current.searchLandscape.description}
                    </p>
                  </div>

                  {/* Angles preview */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-line-soft bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {content.ui.localSeoLabel}
                      </p>
                      <p className="mt-1.5 text-xs text-secondary">{current.localSeoAngle.title}</p>
                    </div>
                    <div className="rounded-xl border border-line-soft bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {content.ui.aiSearchLabel}
                      </p>
                      <p className="mt-1.5 text-xs text-secondary">{current.aiSearchOpportunity.title}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      href={loc(`/markets/${current.slug}`)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline"
                    >
                      {content.ui.selectorViewMarket} {current.name}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Comparison matrix — table-style market behavior grid */}
      <Section background="soft" aria-labelledby="comparison-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.comparisonSection.eyebrow}
            titleId="comparison-title"
            title={content.hub.comparisonSection.title}
            description={content.hub.comparisonSection.description}
          />
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-tint">
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                    {content.ui.comparisonMarket}
                  </th>
                  {content.hub.comparisonSection.dimensions.map((dim) => (
                    <th key={dim.key} scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                      {dim.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {markets.map((m, i) => {
                  const data = comparisonData[m.slug];
                  if (!data) return null;
                  return (
                    <tr
                      key={m.slug}
                      className={cn("border-b border-line-soft last:border-b-0", i % 2 === 1 && "bg-surface-soft/40")}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={loc(`/markets/${m.slug}`)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-graphite transition-colors hover:text-brand-teal"
                        >
                          {m.name}
                          <ArrowUpRight className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                        </Link>
                      </td>
                      <td className="px-4 py-3"><LevelBars level={data.competition} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.local} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.national} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.multilingual} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.ppc} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.trust} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.ai} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* 4. Growth systems — stacked regional playbooks */}
      <Section background="default" aria-labelledby="growth-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.growthSystemsSection.eyebrow}
            titleId="growth-title"
            title={content.hub.growthSystemsSection.title}
            description={content.hub.growthSystemsSection.description}
          />
          <div className="flex flex-col gap-4">
            {content.hub.growthSystemsSection.groups.map((group, gi) => {
              const linked = group.slugs
                .map((slug) => getServiceBySlug(slug, locale))
                .filter((s): s is NonNullable<typeof s> => Boolean(s));
              const market = markets.find((m) => m.slug === group.slug);
              return (
                <div
                  key={group.slug}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border border-line p-5 sm:p-6",
                    gi % 2 === 0 ? "bg-white" : "bg-surface-soft/40"
                  )}
                >
                  <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-gradient-soft opacity-40 blur-2xl" />
                  <div className="relative grid items-start gap-5 lg:grid-cols-[260px_1fr]">
                    {/* Left: group narrative */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        {market && <MarketBadge icon={market.icon} />}
                        <span className="text-sm font-semibold text-graphite">{group.label}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-secondary">{group.description}</p>
                      <Link
                        href={loc(`/markets/${group.slug}`)}
                        className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-teal hover:underline"
                      >
                        {content.ui.selectorViewMarket}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                    {/* Right: connected service rail */}
                    <div className="flex flex-col gap-2">
                      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                        <Compass className="h-3 w-3" aria-hidden="true" />
                        {content.ui.growthSystemsIncludes}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {linked.map((s) => (
                          <Link
                            key={s.slug}
                            href={loc(`/services/${s.slug}`)}
                            className="card-lift inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-medium text-graphite transition-colors hover:border-brand-teal/40 hover:text-brand-teal"
                          >
                            <Check className="h-3 w-3 text-brand-green" aria-hidden="true" />
                            {s.shortLabel}
                            <ArrowUpRight className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. CTA — premium conversion panel */}
      <Section background="tint">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-gradient-soft opacity-50 blur-3xl" />
            <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="flex flex-col items-start gap-5">
                <Eyebrow>{content.hub.ctaSection.eyebrow}</Eyebrow>
                <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {content.hub.ctaSection.title}
                </h2>
                <p className="max-w-lg text-secondary">
                  {content.hub.ctaSection.description}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <CTAButton size="lg" href={loc("/free-seo-audit")}>
                    {content.hub.primaryCta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                    {content.hub.secondaryCta.label}
                  </CTAButton>
                </div>
                <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                  <Globe2 className="h-3 w-3" aria-hidden="true" />
                  {content.ui.trustFootnote}
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {content.ui.ctaAuditPreview}
                </p>
                {content.hub.ctaSection.auditItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-brand-gradient text-[10px] font-bold text-white">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </div>
                ))}
                <p className="mt-auto text-center text-[10px] text-muted">
                  {content.ui.ctaIllustrative}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}