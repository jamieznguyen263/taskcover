/**
 * Market detail page template — 11 distinct sections.
 *
 * Section rhythm (no two sections share the same layout):
 *  1. Hero — split layout + market-specific regional intelligence visual
 *  2. Search Landscape — radar/facet intelligence map (not cards)
 *  3. Buyer Behavior — horizontal demand-journey rail (not a grid)
 *  4. Market Challenges — friction scanner + leverage panel (paired)
 *  5. Taskcover Approach — connected operating model (not cards)
 *  6. Recommended Industries — ranked fit list + fit summary panel
 *  7. Recommended Services — growth stack bundle map (different from #6)
 *  8. Content + Authority — cluster pipeline + authority ladder (not cards)
 *  9. Outcomes — outcome ledger grid (no fake metrics)
 * 10. FAQ — compact accordion
 * 11. Final CTA — market-specific audit preview panel
 */

import * as React from "react";
import {
  ArrowRight,
  AlertTriangle,
  Search,
  Network,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  Gauge,
  Trophy,
  ArrowUpRight,
  GitBranch,
  Rocket,
  Globe2,
  Layers,
  MapPin,
  Users,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { MarketHeroVisual, MarketBadge } from "@/components/marketing/markets/market-visuals";
import type { Market } from "@/content/markets.types";
import type { MarketsContent } from "@/content/markets.types";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { getServiceBySlug, getIndustryBySlug, getMarketBySlug } from "@/lib/content";

export type MarketUI = MarketsContent["ui"];

/* -------------------------------------------------------------------------- */
/* Breadcrumb                                                                  */
/* -------------------------------------------------------------------------- */

function MarketBreadcrumb({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-muted transition-colors hover:text-brand-teal">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-secondary">
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. Hero — split layout + market-specific visual                              */
/* -------------------------------------------------------------------------- */

function MarketHero({
  market,
  ui,
  locale,
}: {
  market: Market;
  ui: MarketUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  const homeCrumb = locale === "en" ? "/" : `/${locale}`;
  return (
    <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-5">
          <MarketBreadcrumb
            items={[
              { label: ui.breadcrumbHome, href: homeCrumb },
              { label: ui.breadcrumbMarkets, href: loc("/markets") },
              { label: market.name },
            ]}
          />
          <Eyebrow>{market.eyebrow}</Eyebrow>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem]">
            {market.h1}
          </h1>
          <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
            {market.marketContext}
          </p>
          <p className="max-w-xl text-pretty text-secondary sm:text-lg">
            {market.heroDescription}
          </p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <CTAButton size="lg" href={loc("/free-seo-audit")}>
              {ui.heroCtaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
              {ui.heroCtaSecondary}
            </CTAButton>
          </div>
        </div>
        {/* market-specific regional intelligence visual */}
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
          <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-2 ring-brand-glow">
            <MarketHeroVisual icon={market.icon} className="h-auto w-full" />
            <figcaption className="px-3 pb-2 pt-1 text-center text-[11px] text-muted">
              {market.regionLabel} · {market.name}
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Search Landscape — radar/facet intelligence map                          */
/* -------------------------------------------------------------------------- */

function MarketSearchLandscape({ market, ui }: { market: Market; ui: MarketUI }) {
  const angleIcons = [Search, MapPin, Sparkles, Megaphone];
  return (
    <Section background="default" aria-labelledby={`landscape-${market.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          align="left"
          eyebrow={ui.searchLandscapeEyebrow}
          titleId={`landscape-${market.slug}`}
          title={market.searchLandscape.title}
          description={market.searchLandscape.description}
        />
        {/* Facet intelligence map — angled facets, not a grid */}
        <div className="flex flex-col gap-3">
          <div className="mb-1 flex items-center gap-2 rounded-xl border border-line bg-surface-tint px-4 py-2.5">
            <Gauge className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {ui.searchLandscapeRadar}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {market.searchLandscape.facets.map((facet, i) => {
              const Icon = angleIcons[i % angleIcons.length];
              return (
                <div
                  key={facet.label}
                  className={cn(
                    "card-lift flex flex-col gap-2 rounded-2xl border p-4",
                    i % 2 === 0 ? "border-line bg-white" : "border-brand-teal/20 bg-brand-teal/[0.03]"
                  )}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-graphite">{facet.label}</p>
                  <p className="text-xs leading-relaxed text-secondary">{facet.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Buyer Behavior — horizontal demand-journey rail                          */
/* -------------------------------------------------------------------------- */

function MarketBuyerBehavior({ market, ui }: { market: Market; ui: MarketUI }) {
  return (
    <Section background="soft" aria-labelledby={`behavior-${market.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Demand journey rail */}
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line bg-surface-tint px-5 py-2.5">
              <Users className="h-4 w-4 text-brand-teal" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {ui.buyerBehaviorIntentPath}
              </span>
            </div>
            <div className="flex flex-col gap-0">
              {market.buyerBehavior.stages.map((stage, i) => {
                const isLast = i === market.buyerBehavior.stages.length - 1;
                return (
                  <div key={stage.stage} className="flex items-stretch gap-3">
                    {/* left stage column */}
                    <div className="flex w-28 shrink-0 flex-col items-center sm:w-32">
                      <div
                        className={cn(
                          "flex h-12 w-full items-center justify-center rounded-xl text-center text-xs font-bold uppercase tracking-wide",
                          isLast
                            ? "bg-brand-gradient text-white"
                            : "border border-line bg-white text-brand-teal"
                        )}
                      >
                        {stage.stage}
                      </div>
                      {!isLast && (
                        <div className="flex w-px flex-1 bg-gradient-to-b from-brand-teal/40 to-brand-teal/10" aria-hidden="true" />
                      )}
                    </div>
                    {/* right content */}
                    <div className={cn("flex-1 rounded-2xl border p-4", isLast ? "border-brand-teal/40 bg-brand-teal/[0.03]" : "border-line bg-white")}>
                      <p className="text-sm font-semibold text-graphite">{stage.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-secondary sm:text-sm">{stage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Right: angles */}
        <div className="order-1 flex flex-col gap-5 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow={ui.buyerBehaviorEyebrow}
            titleId={`behavior-${market.slug}`}
            title={market.buyerBehavior.title}
            description={market.buyerBehavior.description}
          />
          <div className="grid gap-3">
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{ui.localSeoLabel}</p>
              <p className="mt-1 text-xs font-semibold text-graphite">{market.localSeoAngle.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-secondary">{market.localSeoAngle.description}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{ui.nationalSeoLabel}</p>
              <p className="mt-1 text-xs font-semibold text-graphite">{market.nationalSeoAngle.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-secondary">{market.nationalSeoAngle.description}</p>
            </div>
            {market.multilingualAngle && (
              <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">{ui.multilingualLabel}</p>
                <p className="mt-1 text-xs font-semibold text-graphite">{market.multilingualAngle.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-secondary">{market.multilingualAngle.description}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Market Challenges — friction scanner + leverage panel                    */
/* -------------------------------------------------------------------------- */

function MarketChallenges({ market, ui }: { market: Market; ui: MarketUI }) {
  const highCount = market.marketChallenges.items.filter((p) => p.severity === "high").length;
  return (
    <Section background="default" aria-labelledby={`challenges-${market.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Friction scanner */}
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div className="flex items-center justify-between border-b border-line bg-surface-tint px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {ui.challengesScanner}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {highCount} {ui.challengesRiskLevel}: HIGH
              </span>
            </div>
            <ul className="divide-y divide-line-soft">
              {market.marketChallenges.items.map((item, i) => (
                <li key={item.label} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-tint text-[10px] font-bold text-brand-teal">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-graphite">{item.label}</span>
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                          item.severity === "high"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-surface-tint text-muted"
                        )}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-secondary sm:text-sm">{item.detail}</p>
                  </div>
                  <span
                    className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", item.severity === "high" ? "bg-amber-500" : "bg-brand-teal")}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right: leverage panel */}
        <div className="order-1 flex flex-col gap-5 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow={ui.challengesEyebrow}
            titleId={`challenges-${market.slug}`}
            title={market.marketChallenges.title}
            description={market.marketChallenges.description}
          />
          {/* PPC + AI angles as leverage */}
          <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.03] p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {ui.aiSearchLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-graphite">{market.aiSearchOpportunity.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-secondary">{market.aiSearchOpportunity.description}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              <Megaphone className="h-3 w-3" aria-hidden="true" />
              {ui.ppcLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-graphite">{market.ppcOpportunity.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-secondary">{market.ppcOpportunity.description}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Taskcover Approach — connected operating model                           */
/* -------------------------------------------------------------------------- */

function MarketApproach({ market, ui }: { market: Market; ui: MarketUI }) {
  return (
    <Section background="soft" aria-labelledby={`approach-${market.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.approachEyebrow}
          titleId={`approach-${market.slug}`}
          title={market.taskcoverApproach.title}
          description={market.taskcoverApproach.description}
        />
        {/* Connected operating model — layers as connected nodes */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line bg-surface-tint px-5 py-2.5">
            <Network className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {ui.approachOperatingModel}
            </span>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {market.taskcoverApproach.layers.map((layer, i) => (
              <div
                key={layer.label}
                className={cn(
                  "flex flex-col gap-2 border-line-soft p-5",
                  i % 3 !== 2 && "sm:border-r",
                  i % 2 !== 1 && "sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0",
                  i < market.taskcoverApproach.layers.length - 3 && "border-b",
                  i % 3 !== 0 && "lg:border-l-0"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-graphite">{layer.label}</span>
                </div>
                <p className="text-xs leading-relaxed text-secondary">{layer.description}</p>
                {i < market.taskcoverApproach.layers.length - 1 && (
                  <ArrowRight className="hidden h-3 w-3 text-brand-teal/40 sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
        {market.trustSignals && (
          <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-soft p-4">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-secondary sm:text-sm">
              <span className="font-semibold text-graphite">{market.trustSignals}</span>
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Recommended Industries — ranked fit list + fit summary                   */
/* -------------------------------------------------------------------------- */

function MarketIndustries({
  market,
  ui,
  locale,
}: {
  market: Market;
  ui: MarketUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  return (
    <Section background="default" aria-labelledby={`industries-${market.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: intro + fit summary */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            align="left"
            eyebrow={ui.industriesEyebrow}
            titleId={`industries-${market.slug}`}
            title={ui.industriesTitle}
            description={ui.industriesDesc}
          />
          {/* Fit summary panel */}
          <div className="overflow-hidden rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                {ui.industriesFitSummary}
              </span>
            </div>
            <p className="mb-3 text-sm font-semibold text-graphite">{market.fitSummary.title}</p>
            <dl className="flex flex-col gap-2">
              {market.fitSummary.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-0.5 rounded-xl border border-line-soft bg-white/70 px-3 py-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  <dt className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-muted sm:w-40">
                    {row.label}
                  </dt>
                  <dd className="text-xs font-medium text-graphite sm:text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {/* Right: ranked fit list */}
        <div className="flex flex-col gap-3">
          {market.recommendedIndustries.map((row, i) => {
            const ind = getIndustryBySlug(row.slug, locale);
            if (!ind) return null;
            return (
              <Link
                key={row.slug}
                href={loc(`/industries/${row.slug}`)}
                className="card-lift group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 hover:border-brand-teal/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-graphite">{ind.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-teal">
                      {ui.industriesFitScale}
                      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span
                            key={j}
                            className={cn("h-1.5 w-1 rounded-full", j < row.fit ? "bg-brand-gradient" : "bg-line")}
                          />
                        ))}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-secondary">{row.reason}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-brand-teal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Recommended Services — growth stack bundle map                           */
/* -------------------------------------------------------------------------- */

function MarketServices({
  market,
  ui,
  locale,
}: {
  market: Market;
  ui: MarketUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  const services = market.recommendedServices
    .map((slug) => getServiceBySlug(slug, locale))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const serviceTitleBySlug = new Map(services.map((s) => [s.slug, s.title]));

  return (
    <Section background="soft" aria-labelledby={`services-${market.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.servicesEyebrow}
          titleId={`services-${market.slug}`}
          title={ui.servicesTitle}
          description={ui.servicesDesc}
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Service bundle map (grouped) */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-surface-tint text-brand-teal">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {ui.servicesGrowthStack}
              </span>
            </div>
            <p className="mb-3 text-sm font-semibold text-graphite">{market.growthSystem.title}</p>
            <p className="mb-4 text-xs leading-relaxed text-secondary">{market.growthSystem.description}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {market.growthSystem.groups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-xl border border-line-soft bg-surface-soft/60 p-3"
                >
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-teal">
                    {group.label}
                  </p>
                  {group.slugs.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {group.slugs.map((slug) => (
                        <li key={slug} className="flex items-center gap-1.5 text-xs text-secondary">
                          <span className="h-1 w-1 rounded-full bg-brand-teal" aria-hidden="true" />
                          {serviceTitleBySlug.get(slug) ?? slug}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] italic text-muted">—</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Vertical service rail */}
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={loc(`/services/${s.slug}`)}
                className="card-lift group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 hover:border-brand-teal/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-graphite">{s.title}</span>
                  <span className="text-xs text-secondary">{s.outcomePromise}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-brand-teal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Content + Authority — cluster pipeline + authority ladder                */
/* -------------------------------------------------------------------------- */

function MarketContentAuthority({ market, ui }: { market: Market; ui: MarketUI }) {
  return (
    <Section background="default" aria-labelledby={`content-${market.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.contentAuthorityEyebrow}
          titleId={`content-${market.slug}`}
          title={market.contentAuthorityPlan.title}
          description={market.contentAuthorityPlan.description}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Content clusters — pipeline */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <GitBranch className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-graphite">{ui.contentAuthorityClusters}</span>
            </div>
            <ol className="flex flex-col gap-2">
              {market.contentAuthorityPlan.clusters.map((cluster, i) => (
                <li key={cluster} className="flex items-start gap-3 rounded-xl border border-line-soft bg-surface-soft/40 p-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-gradient text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-secondary sm:text-sm">{cluster}</span>
                </li>
              ))}
            </ol>
          </div>
          {/* Authority tactics — ladder */}
          <div className="rounded-2xl border border-line bg-surface-tint p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <Trophy className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-graphite">{ui.contentAuthorityLadder}</span>
            </div>
            <div className="flex flex-col gap-0">
              {market.contentAuthorityPlan.authority.map((tactic, i) => {
                const isLast = i === market.contentAuthorityPlan.authority.length - 1;
                return (
                  <div key={tactic} className="flex items-stretch gap-3" style={{ paddingLeft: `${i * 0.5}rem` }}>
                    <div className="flex w-8 shrink-0 flex-col items-center">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold",
                          isLast
                            ? "bg-brand-gradient text-white shadow-[0_4px_12px_-4px_rgba(24,138,172,0.6)]"
                            : "bg-white text-brand-teal border border-line"
                        )}
                      >
                        {isLast ? <Shield className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                      </span>
                      {!isLast && <span className="mt-1 w-0.5 flex-1 bg-line" aria-hidden="true" />}
                    </div>
                    <div className="mb-2 flex-1 rounded-lg border border-line-soft bg-white p-3">
                      <p className="text-xs leading-relaxed text-secondary">{tactic}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. Outcomes — outcome ledger grid (no fake metrics)                         */
/* -------------------------------------------------------------------------- */

const outcomeIcons = [Target, TrendingUp, Shield, Network, Sparkles, Rocket];

function MarketOutcomes({ market, ui }: { market: Market; ui: MarketUI }) {
  return (
    <Section background="soft" aria-labelledby={`outcomes-${market.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.outcomesEyebrow}
          titleId={`outcomes-${market.slug}`}
          title={market.outcomes[0]?.label ?? ui.outcomesEyebrow}
          description={ui.outcomesDesc}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {market.outcomes.map((o, i) => {
            const Icon = outcomeIcons[i % outcomeIcons.length];
            const isLast = i === market.outcomes.length - 1;
            return (
              <div
                key={o.label}
                className={cn(
                  "card-lift flex flex-col gap-3 rounded-2xl border bg-white p-5",
                  isLast ? "border-brand-teal/40 ring-1 ring-brand-teal/10" : "border-line"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                    isLast ? "bg-brand-gradient text-white" : "bg-surface-tint text-brand-teal"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-graphite">{o.label}</p>
                <p className="text-xs leading-relaxed text-secondary">{o.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. FAQ — compact accordion                                                 */
/* -------------------------------------------------------------------------- */

function MarketFAQ({ market, ui }: { market: Market; ui: MarketUI }) {
  return (
    <Section background="default" aria-labelledby={`faq-${market.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
        <SectionHeader
          align="left"
          eyebrow={ui.faqEyebrow}
          titleId={`faq-${market.slug}`}
          title={ui.faqTitle.replace("{market}", market.name)}
        />
        <FAQAccordion items={market.faqs} />
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 11. Final CTA — market-specific audit preview panel                         */
/* -------------------------------------------------------------------------- */

const ctaAuditIcons = [Gauge, Search, Target, AlertTriangle, Sparkles, GitBranch];

function MarketCTA({
  market,
  ui,
  locale,
}: {
  market: Market;
  ui: MarketUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  return (
    <Section background="soft">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white depth-layered">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-gradient-soft opacity-50 blur-3xl" />
          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col items-start gap-5">
              <Eyebrow>{ui.ctaEyebrow}</Eyebrow>
              <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
                {market.finalCta.title}
              </h2>
              <p className="max-w-lg text-secondary">{market.finalCta.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href={loc("/free-seo-audit")}>
                  {ui.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                  {ui.heroCtaSecondary}
                </CTAButton>
              </div>
              <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <Globe2 className="h-3 w-3" aria-hidden="true" />
                {ui.trustFootnote}
              </p>
            </div>
            {/* Market-specific audit preview */}
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                  {market.finalCta.auditLabel}
                </span>
                <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold text-white">
                  90-day
                </span>
              </div>
              {market.finalCta.auditItems.map((item, i) => {
                const Icon = ctaAuditIcons[i % ctaAuditIcons.length];
                return (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white px-4 py-3">
                    <Icon className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                    <span className="flex-1 text-xs font-medium text-secondary">{item}</span>
                    <span className="h-1.5 w-16 rounded-full bg-surface-tint">
                      <span className="block h-full w-3/4 rounded-full bg-brand-gradient" />
                    </span>
                  </div>
                );
              })}
              <p className="text-center text-[10px] text-muted">{ui.ctaIllustrative}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Related markets rail                                                        */
/* -------------------------------------------------------------------------- */

function RelatedMarkets({
  market,
  ui,
  locale,
}: {
  market: Market;
  ui: MarketUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  const related = market.related
    .map((slug) => getMarketBySlug(slug, locale))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  if (related.length === 0) return null;

  return (
    <Section background="default" aria-labelledby={`related-${market.slug}`}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{ui.relatedEyebrow}</Eyebrow>
          <h2
            id={`related-${market.slug}`}
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl"
          >
            {ui.relatedTitle}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {related.map((rel) => (
            <Link
              key={rel.slug}
              href={loc(`/markets/${rel.slug}`)}
              className="card-lift group inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3 hover:border-brand-teal/40"
            >
              <MarketBadge icon={rel.icon} />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-graphite">{rel.name}</span>
                <span className="text-[11px] text-muted">{ui.exploreMarket}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-brand-teal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Full market page template                                                   */
/* -------------------------------------------------------------------------- */

export function MarketPageTemplate({
  market,
  ui,
  locale,
}: {
  market: Market;
  ui: MarketUI;
  locale: Locale;
}) {
  return (
    <>
      <MarketHero market={market} ui={ui} locale={locale} />
      <MarketSearchLandscape market={market} ui={ui} />
      <MarketBuyerBehavior market={market} ui={ui} />
      <MarketChallenges market={market} ui={ui} />
      <MarketApproach market={market} ui={ui} />
      <MarketIndustries market={market} ui={ui} locale={locale} />
      <MarketServices market={market} ui={ui} locale={locale} />
      <MarketContentAuthority market={market} ui={ui} />
      <MarketOutcomes market={market} ui={ui} />
      <RelatedMarkets market={market} ui={ui} locale={locale} />
      <MarketFAQ market={market} ui={ui} />
      <MarketCTA market={market} ui={ui} locale={locale} />
    </>
  );
}