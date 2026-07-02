/**
 * Industry detail page template — 9 distinct sections.
 *
 * Section rhythm (no two sections share the same layout):
 *  1. Hero — split layout + industry-specific visual
 *  2. Search Behavior — horizontal intent funnel flow (not a grid)
 *  3. Pain Points — diagnostic scanner panel with severity radar
 *  4. Solution — connected hexagonal operating model (not cards)
 *  5. Recommended Services — vertical module stack rail
 *  6. Content & Authority — dual pipeline + ladder (not cards)
 *  7. Outcomes — outcome ledger grid with category icons (no fake metrics)
 *  8. FAQ — compact accordion
 *  9. Final CTA — industry-specific audit preview panel
 */

import * as React from "react";
import {
  ArrowRight,
  AlertTriangle,
  Search,
  Network,
  Layers,
  Target,
  TrendingUp,
  Shield,
  Check,
  Sparkles,
  Gauge,
  Trophy,
  ArrowUpRight,
  GitBranch,
  Rocket,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { IndustryHeroVisual } from "@/components/marketing/industries/industry-visuals";
import type { Industry } from "@/content/industries.types";
import type { IndustriesContent } from "@/content/industries.types";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { getServiceBySlug, getIndustryBySlug } from "@/lib/content";

export type IndustryUI = IndustriesContent["ui"];

/* -------------------------------------------------------------------------- */
/* Breadcrumb                                                                  */
/* -------------------------------------------------------------------------- */

function IndustryBreadcrumb({
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
/* 1. Hero — split layout + industry-specific visual                           */
/* -------------------------------------------------------------------------- */

function IndustryHero({
  industry,
  ui,
  locale,
}: {
  industry: Industry;
  ui: IndustryUI;
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
          <IndustryBreadcrumb
            items={[
              { label: ui.breadcrumbHome, href: homeCrumb },
              { label: ui.breadcrumbIndustries, href: loc("/industries") },
              { label: industry.name },
            ]}
          />
          <Eyebrow>{industry.eyebrow}</Eyebrow>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem]">
            {industry.h1}
          </h1>
          <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
            {industry.marketContext}
          </p>
          <p className="max-w-xl text-pretty text-secondary sm:text-lg">
            {industry.heroDescription}
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
        {/* industry-specific visual */}
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
          <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-2 ring-brand-glow">
            <IndustryHeroVisual icon={industry.icon} className="h-auto w-full" />
            <figcaption className="px-3 pb-2 pt-1 text-center text-[11px] text-muted">
              {ui.heroFigcaption}
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Search Behavior — horizontal intent funnel flow (not a grid)             */
/* -------------------------------------------------------------------------- */

function IndustrySearchBehavior({ industry, ui }: { industry: Industry; ui: IndustryUI }) {
  return (
    <Section background="default" aria-labelledby={`search-${industry.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          align="left"
          eyebrow={ui.searchBehaviorEyebrow}
          titleId={`search-${industry.slug}`}
          title={industry.searchWorkflow.title}
          description={industry.searchWorkflow.description}
        />
        {/* Horizontal funnel flow — stages connected by arrows */}
        <div className="flex flex-col gap-3">
          <div className="mb-1 flex items-center gap-2 rounded-xl border border-line bg-surface-tint px-4 py-2.5">
            <Search className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {ui.searchBehaviorIntentMap}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-secondary sm:text-base">
            {industry.buyerSearchBehavior}
          </p>
          {/* Funnel stages */}
          <div className="flex flex-col gap-0">
            {industry.searchWorkflow.steps.map((step, i) => {
              const isLast = i === industry.searchWorkflow.steps.length - 1;
              return (
                <div key={step.stage} className="flex items-stretch gap-3">
                  {/* left stage label column */}
                  <div className="flex w-28 shrink-0 flex-col items-center sm:w-32">
                    <div
                      className={cn(
                        "flex h-12 w-full items-center justify-center rounded-xl text-center text-xs font-bold uppercase tracking-wide",
                        isLast
                          ? "bg-brand-gradient text-white"
                          : "border border-line bg-white text-brand-teal"
                      )}
                    >
                      {step.stage}
                    </div>
                    {!isLast && (
                      <div className="flex w-px flex-1 bg-gradient-to-b from-brand-teal/40 to-brand-teal/10" aria-hidden="true" />
                    )}
                  </div>
                  {/* right content */}
                  <div className={cn("flex-1 rounded-2xl border p-4", isLast ? "border-brand-teal/40 bg-brand-teal/[0.03]" : "border-line bg-white")}>
                    <p className="text-sm font-semibold text-graphite">{step.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-secondary sm:text-sm">{step.description}</p>
                  </div>
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
/* 3. Pain Points — diagnostic scanner panel with severity radar               */
/* -------------------------------------------------------------------------- */

function IndustryPainPoints({ industry, ui }: { industry: Industry; ui: IndustryUI }) {
  const highCount = industry.painPoints.items.filter((p) => p.severity === "high").length;
  return (
    <Section background="soft" aria-labelledby={`pain-${industry.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Diagnostic scanner */}
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div className="flex items-center justify-between border-b border-line bg-surface-tint px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {ui.painPointsScanner}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {highCount} {ui.painPointsRiskLevel}: HIGH
              </span>
            </div>
            <ul className="divide-y divide-line-soft">
              {industry.painPoints.items.map((item, i) => (
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
        {/* Right: opportunities */}
        <div className="order-1 flex flex-col gap-5 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow={ui.painPointsEyebrow}
            titleId={`pain-${industry.slug}`}
            title={industry.painPoints.title}
            description={industry.painPoints.description}
          />
          <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.03] p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {industry.seoOpportunities.title}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {industry.seoOpportunities.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-secondary sm:text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Solution — connected hexagonal operating model (not cards)              */
/* -------------------------------------------------------------------------- */

function IndustrySolution({ industry, ui }: { industry: Industry; ui: IndustryUI }) {
  return (
    <Section background="default" aria-labelledby={`solution-${industry.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.solutionEyebrow}
          titleId={`solution-${industry.slug}`}
          title={industry.taskcoverSolution.title}
          description={industry.taskcoverSolution.description}
        />
        {/* Connected hexagonal layout — layers as hexagonal nodes connected by lines */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line bg-surface-tint px-5 py-2.5">
            <Network className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {ui.solutionModel}
            </span>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {industry.taskcoverSolution.layers.map((layer, i) => (
              <div
                key={layer.label}
                className={cn(
                  "flex flex-col gap-2 border-line-soft p-5",
                  i % 3 !== 2 && "sm:border-r",
                  i % 2 !== 1 && "sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0",
                  i < industry.taskcoverSolution.layers.length - 3 && "border-b",
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
                {i < industry.taskcoverSolution.layers.length - 1 && (
                  <ArrowRight className="hidden h-3 w-3 text-brand-teal/40 sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
        {industry.localInternationalAngle && (
          <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface-soft p-5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-graphite">{industry.localInternationalAngle.title}</p>
              <p className="text-xs leading-relaxed text-secondary sm:text-sm">{industry.localInternationalAngle.description}</p>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Recommended Services — vertical module stack rail                        */
/* -------------------------------------------------------------------------- */

function IndustryServices({
  industry,
  ui,
  locale,
}: {
  industry: Industry;
  ui: IndustryUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  const services = industry.recommendedServices
    .map((slug) => getServiceBySlug(slug, locale))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <Section background="soft" aria-labelledby={`services-${industry.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          align="left"
          eyebrow={ui.servicesEyebrow}
          titleId={`services-${industry.slug}`}
          title={ui.servicesTitle}
          description={ui.servicesDesc}
        />
        {/* Vertical module stack rail */}
        <div className="flex flex-col gap-3">
          <div className="mb-1 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5">
            <Layers className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {ui.servicesModule}
            </span>
          </div>
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
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Content & Authority — dual pipeline + ladder                            */
/* -------------------------------------------------------------------------- */

function IndustryContentAuthority({ industry, ui }: { industry: Industry; ui: IndustryUI }) {
  return (
    <Section background="default" aria-labelledby={`content-${industry.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.contentAuthorityEyebrow}
          titleId={`content-${industry.slug}`}
          title={industry.contentStrategy.title}
          description={industry.contentStrategy.description}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Content pillars — pipeline */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <GitBranch className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-graphite">{industry.contentStrategy.title}</span>
            </div>
            <ol className="flex flex-col gap-2">
              {industry.contentStrategy.pillars.map((pillar, i) => (
                <li key={pillar} className="flex items-start gap-3 rounded-xl border border-line-soft bg-surface-soft/40 p-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-gradient text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-secondary sm:text-sm">{pillar}</span>
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
              <span className="text-sm font-semibold text-graphite">{industry.authorityStrategy.title}</span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-secondary sm:text-sm">
              {industry.authorityStrategy.description}
            </p>
            {/* Authority ladder */}
            <div className="flex flex-col gap-0">
              {industry.authorityStrategy.tactics.map((tactic, i) => {
                const isLast = i === industry.authorityStrategy.tactics.length - 1;
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
        {industry.trustSignals && (
          <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-soft p-4">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-secondary sm:text-sm">
              <span className="font-semibold text-graphite">{industry.trustSignals}</span>
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Outcomes — outcome ledger grid (no fake metrics)                        */
/* -------------------------------------------------------------------------- */

const outcomeIcons = [Target, TrendingUp, Shield, Network, Sparkles, Rocket];

function IndustryOutcomes({ industry, ui }: { industry: Industry; ui: IndustryUI }) {
  return (
    <Section background="soft" aria-labelledby={`outcomes-${industry.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.outcomesEyebrow}
          titleId={`outcomes-${industry.slug}`}
          title={industry.outcomes[0]?.label ?? ui.outcomesEyebrow}
          description={ui.outcomesDesc}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industry.outcomes.map((o, i) => {
            const Icon = outcomeIcons[i % outcomeIcons.length];
            const isLast = i === industry.outcomes.length - 1;
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
/* 8. FAQ — compact accordion                                                  */
/* -------------------------------------------------------------------------- */

function IndustryFAQ({ industry, ui }: { industry: Industry; ui: IndustryUI }) {
  return (
    <Section background="default" aria-labelledby={`faq-${industry.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
        <SectionHeader
          align="left"
          eyebrow={ui.faqEyebrow}
          titleId={`faq-${industry.slug}`}
          title={ui.faqTitle.replace("{industry}", industry.name)}
        />
        <FAQAccordion items={industry.faqs} />
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. Final CTA — industry-specific audit preview panel                        */
/* -------------------------------------------------------------------------- */

const ctaAuditIcons = [Gauge, Search, Target, AlertTriangle, Sparkles, GitBranch];

function IndustryCTA({
  industry,
  ui,
  locale,
}: {
  industry: Industry;
  ui: IndustryUI;
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
                {industry.finalCta.title}
              </h2>
              <p className="max-w-lg text-secondary">{industry.finalCta.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href={loc("/free-seo-audit")}>
                  {ui.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                  {ui.heroCtaSecondary}
                </CTAButton>
              </div>
            </div>
            {/* Industry-specific audit preview */}
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                  {industry.finalCta.auditLabel}
                </span>
                <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold text-white">
                  90-day
                </span>
              </div>
              {industry.finalCta.auditItems.map((item, i) => {
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
/* Related industries rail                                                     */
/* -------------------------------------------------------------------------- */

function RelatedIndustries({
  industry,
  ui,
  locale,
}: {
  industry: Industry;
  ui: IndustryUI;
  locale: Locale;
}) {
  const loc = (p: string) => localizePath(p, locale);
  const related = industry.related
    .map((slug) => getIndustryBySlug(slug, locale))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
  if (related.length === 0) return null;

  return (
    <Section background="default" aria-labelledby={`related-${industry.slug}`}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{ui.relatedEyebrow}</Eyebrow>
          <h2
            id={`related-${industry.slug}`}
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl"
          >
            {ui.relatedTitle}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {related.map((rel) => (
            <Link
              key={rel.slug}
              href={loc(`/industries/${rel.slug}`)}
              className="card-lift group inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3 hover:border-brand-teal/40"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-graphite">{rel.name}</span>
                <span className="text-[11px] text-muted">{ui.exploreIndustry}</span>
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
/* Full industry page template                                                 */
/* -------------------------------------------------------------------------- */

export function IndustryPageTemplate({
  industry,
  ui,
  locale,
}: {
  industry: Industry;
  ui: IndustryUI;
  locale: Locale;
}) {
  return (
    <>
      <IndustryHero industry={industry} ui={ui} locale={locale} />
      <IndustrySearchBehavior industry={industry} ui={ui} />
      <IndustryPainPoints industry={industry} ui={ui} />
      <IndustrySolution industry={industry} ui={ui} />
      <IndustryServices industry={industry} ui={ui} locale={locale} />
      <IndustryContentAuthority industry={industry} ui={ui} />
      <IndustryOutcomes industry={industry} ui={ui} />
      <RelatedIndustries industry={industry} ui={ui} locale={locale} />
      <IndustryFAQ industry={industry} ui={ui} />
      <IndustryCTA industry={industry} ui={ui} locale={locale} />
    </>
  );
}