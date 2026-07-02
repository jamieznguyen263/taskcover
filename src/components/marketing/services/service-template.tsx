"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  Target,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  ListChecks,
  Gauge,
  Check,
  Zap,
  GitBranch,
  Trophy,
  CircleDot,
  Search,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import {
  type Service,
  type ServiceDeliverable,
  getRelatedServices,
} from "@/data/services";
import {
  ServiceHeroVisual,
  ServiceDeliverableVisual,
} from "@/components/marketing/services/service-visuals";
import type { ServicesContent } from "@/content/services.types";

/** UI labels passed from the route to all service template sub-components. */
export type ServiceUI = ServicesContent["ui"];

/** React context so sub-components can access UI labels without prop drilling. */
const ServiceUIContext = React.createContext<ServiceUI | null>(null);

function useUI(): ServiceUI {
  const ctx = React.useContext(ServiceUIContext);
  if (!ctx) {
    throw new Error("Service template sub-components must be rendered inside ServicePageTemplate");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Breadcrumb (visual, not schema — schema is emitted by the page route)       */
/* -------------------------------------------------------------------------- */

export function ServiceBreadcrumb({
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
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-brand-teal"
                >
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
/* 1. Hero — split layout + floating service-specific dashboard                */
/* -------------------------------------------------------------------------- */

export function ServicePageHero({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section
      background="tint"
      className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div className="flex flex-col gap-5">
          <ServiceBreadcrumb
            items={[
              { label: ui.breadcrumbHome, href: "/" },
              { label: ui.breadcrumbServices, href: "/services" },
              { label: service.shortLabel },
            ]}
          />
          <Eyebrow>{service.shortLabel}</Eyebrow>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem]">
            {service.h1}
          </h1>
          <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
            {service.positioning}
          </p>
          <p className="max-w-xl text-pretty text-secondary sm:text-lg">
            {service.subheadline}
          </p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <CTAButton size="lg" href="/free-seo-audit">
              {ui.heroCtaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/book-a-call">
              {ui.heroCtaSecondary}
            </CTAButton>
          </div>
        </div>
        {/* Right: floating premium visual */}
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
          <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-2 ring-brand-glow">
            <ServiceHeroVisual
              icon={service.icon}
              className="h-auto w-full"
            />
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
/* 2. Problem — diagnostic scanner panel with severity radar                  */
/* -------------------------------------------------------------------------- */

export function ServiceProblemSection({ service }: { service: Service }) {
  const ui = useUI();
  const hasLeverage = service.problem.leveragePoints?.length > 0;
  return (
    <Section background="default" aria-labelledby={`problem-${service.slug}`}>
      {/*
        Three-zone grid: left column = header + leverage panel;
        right column = issue scanner spanning both rows.
        Mobile order: header → scanner → leverage.
      */}
      <Container
        className={cn(
          "grid gap-8 lg:grid-cols-[0.9fr_1.1fr]",
          hasLeverage ? "lg:grid-rows-[auto_1fr]" : "lg:grid-rows-1"
        )}
      >
        {/* 1. Header — first on all viewports */}
        <div
          className={cn(
            "flex flex-col gap-5",
            hasLeverage ? "lg:row-start-1 lg:col-start-1" : "lg:col-span-1"
          )}
        >
          <SectionHeader
            align="left"
            eyebrow={ui.problemEyebrow}
            titleId={`problem-${service.slug}`}
            title={service.problem.title}
          />
          {/* Leverage panel — under the header on desktop, last on mobile */}
          {hasLeverage && (
            <div className="order-last lg:order-none overflow-hidden rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.04] p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                  {ui.problemLeverage}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {service.problem.leveragePoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-secondary sm:text-sm"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" aria-hidden="true" />
                    {point.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 2. Diagnostic scanner — second on mobile, right column (spans rows) on desktop */}
        <div
          className={cn(
            "overflow-hidden rounded-3xl border border-line bg-white depth-layered",
            hasLeverage ? "lg:row-span-2 lg:col-start-2" : "lg:col-start-2"
          )}
        >
          {/* scanner header */}
          <div className="flex items-center justify-between border-b border-line bg-surface-tint px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {ui.problemScanner}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {service.problem.bullets.length} {ui.problemGapCount}
            </span>
          </div>
          {/* paragraphs */}
          <div className="flex flex-col gap-3 border-b border-line-soft px-5 py-4">
            {service.problem.paragraphs.map((p, i) => (
              <p key={i} className="text-pretty text-sm leading-relaxed text-secondary sm:text-base">
                {p}
              </p>
            ))}
          </div>
          {/* issue rows */}
          <ul className="divide-y divide-line-soft">
            {service.problem.bullets.map((b, i) => (
              <li key={b} className="flex items-center gap-3 px-5 py-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-[10px] font-bold text-amber-600">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-secondary">{b}</span>
                <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Approach — layered operating model (vertical stack, not cards)          */
/* -------------------------------------------------------------------------- */

export function ServiceApproachSection({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section background="soft" aria-labelledby={`approach-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.approachEyebrow}
          titleId={`approach-${service.slug}`}
          title={service.approach.title}
          description={service.approach.paragraphs[0]}
        />
        {service.approach.paragraphs.length > 1 ? (
          <p className="max-w-3xl text-pretty text-secondary sm:text-lg">
            {service.approach.paragraphs[1]}
          </p>
        ) : null}

        {/* Layered vertical stack — each layer is a horizontal band, not a card */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white depth-layered">
          {/* stack header */}
          <div className="flex items-center gap-2 border-b border-line bg-surface-tint px-5 py-2.5">
            <GitBranch className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {ui.approachModel}
            </span>
          </div>
          <ol className="flex flex-col">
            {service.approach.stages.map((stage, index) => (
              <li
                key={stage.label}
                className={cn(
                  "flex items-stretch gap-0 border-b border-line-soft last:border-b-0",
                  index % 2 === 0 ? "bg-white" : "bg-surface-soft/60"
                )}
              >
                {/* left number rail */}
                <div className="relative flex w-14 shrink-0 items-center justify-center bg-brand-gradient">
                  <span className="text-sm font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                  {index < service.approach.stages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 translate-y-1/2 bg-white/40"
                    />
                  )}
                </div>
                {/* content */}
                <div className="flex flex-1 flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2 sm:w-56 sm:shrink-0">
                    {index === service.approach.stages.length - 1 && (
                      <Sparkles className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                    )}
                    <span className="text-sm font-semibold text-graphite">{stage.label}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-secondary">{stage.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-sm text-muted">
          {ui.approachConnect.replace("{service}", service.shortLabel)}
        </p>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Deliverables — implementation ledger with priority chips                */
/* -------------------------------------------------------------------------- */

const deliverableTagStyles: Record<NonNullable<ServiceDeliverable["tag"]>, string> = {
  Core: "bg-brand-teal/10 text-brand-teal border-brand-teal/20",
  Priority: "bg-amber-50 text-amber-700 border-amber-200/60",
  Foundation: "bg-surface-tint text-secondary border-line",
  Ongoing: "bg-brand-green/10 text-brand-emerald border-brand-green/20",
  Strategy: "bg-brand-teal/10 text-brand-teal border-brand-teal/20",
  Technical: "bg-blue-50 text-blue-700 border-blue-200/60",
  Content: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Authority: "bg-violet-50 text-violet-700 border-violet-200/60",
  Local: "bg-amber-50 text-amber-700 border-amber-200/60",
  Analytics: "bg-surface-tint text-secondary border-line",
  Conversion: "bg-brand-green/10 text-brand-emerald border-brand-green/20",
  Advisory: "bg-brand-teal/10 text-brand-teal border-brand-teal/20",
  "AI Search": "bg-blue-50 text-blue-700 border-blue-200/60",
  Execution: "bg-brand-green/10 text-brand-emerald border-brand-green/20",
};

function DeliverableTag({ tag }: { tag: NonNullable<ServiceDeliverable["tag"]> }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        deliverableTagStyles[tag]
      )}
    >
      {tag}
    </span>
  );
}

export function ServiceDeliverables({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section background="default" aria-labelledby={`deliverables-${service.slug}`}>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          align="left"
          eyebrow={ui.deliverablesEyebrow}
          titleId={`deliverables-${service.slug}`}
          title={ui.deliverablesTitle}
          description={ui.deliverablesDesc}
        />

        {/* Implementation ledger — table-like board with alternating rows */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {/* ledger header */}
          <div className="hidden grid-cols-[3rem_1fr_2fr_auto] items-center gap-4 border-b border-line bg-surface-tint px-4 py-2.5 sm:grid">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{ui.deliverablesNumber}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{ui.deliverablesDeliverable}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{ui.deliverablesScope}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{ui.deliverablesTier}</span>
          </div>
          <ol>
            {service.deliverables.map((d, i) => (
              <li
                key={d.title}
                className={cn(
                  "grid grid-cols-1 gap-2 border-b border-line-soft px-4 py-3.5 last:border-b-0 sm:grid-cols-[3rem_1fr_2fr_auto] sm:items-center sm:gap-4",
                  i % 2 === 1 && "bg-surface-soft/40"
                )}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-surface-tint text-[10px] font-bold text-brand-teal sm:h-7 sm:w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-brand-green" aria-hidden="true" />
                  <span className="text-sm font-semibold text-graphite">{d.title}</span>
                </div>
                <p className="text-sm leading-relaxed text-secondary">{d.description}</p>
                <div className="flex sm:justify-end">
                  {d.tag ? <DeliverableTag tag={d.tag} /> : (
                    <span className="text-[10px] text-muted">—</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* mini visual preview strip */}
        <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-tint px-4 py-3">
          <div className="h-12 w-24 shrink-0">
            <ServiceDeliverableVisual
              icon={service.icon}
              className="h-full w-full"
            />
          </div>
          <p className="text-xs text-muted">
            {ui.deliverablesPreview.replace("{service}", service.shortLabel)}
          </p>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Use Cases — decision paths (trigger → fit), not identical cards        */
/* -------------------------------------------------------------------------- */

export function ServiceUseCases({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section background="soft" aria-labelledby={`usecases-${service.slug}`}>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          align="left"
          eyebrow={ui.useCasesEyebrow}
          titleId={`usecases-${service.slug}`}
          title={ui.useCasesTitle}
          description={ui.useCasesDesc}
        />

        {/* Decision paths — stacked rows with trigger → fit flow */}
        <div className="flex flex-col gap-3">
          {service.useCases.map((u) => (
            <div
              key={u.audience}
              className="card-lift group flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40 sm:flex-row sm:items-center"
            >
              {/* trigger signal */}
              {u.signal ? (
                <div className="flex items-start gap-3 sm:w-2/5 sm:shrink-0">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Target className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      {ui.useCasesTrigger}
                    </span>
                    <p className="text-sm leading-snug text-secondary">{u.signal}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:w-2/5 sm:shrink-0">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Target className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-graphite">{u.audience}</span>
                </div>
              )}

              {/* arrow connector */}
              <div className="flex items-center justify-center sm:px-2">
                <ArrowRight className="h-5 w-5 rotate-90 text-brand-teal sm:rotate-0" aria-hidden="true" />
              </div>

              {/* fit / detail */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-graphite">{u.audience}</span>
                </div>
                <p className="text-sm leading-relaxed text-secondary">{u.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="max-w-2xl text-sm text-muted">
          {ui.useCasesNote}
        </p>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Process — vertical timeline with rail connector                         */
/* -------------------------------------------------------------------------- */

export function ServiceProcess({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section background="default" aria-labelledby={`process-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.processEyebrow}
          titleId={`process-${service.slug}`}
          title={ui.processTitle}
          description={ui.processDesc}
        />

        {/* Vertical timeline with left rail */}
        <ol className="relative flex flex-col gap-0">
          {/* vertical rail */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-gradient-to-b from-brand-teal/40 via-brand-teal/30 to-brand-teal/10 sm:left-[23px]"
          />
          {service.process.map((phase, i) => (
            <li
              key={phase.title}
              className="relative flex gap-5 pb-6 last:pb-0 sm:gap-6"
            >
              {/* node on the rail */}
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-brand-gradient text-xs font-bold text-white shadow-[0_4px_12px_-4px_rgba(24,138,172,0.6)] sm:h-12 sm:w-12 sm:text-sm">
                  {i + 1}
                </span>
              </div>
              {/* content card */}
              <div className="flex-1 rounded-2xl border border-line bg-surface-soft p-4 sm:p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-semibold text-graphite sm:text-base">{phase.title}</h3>
                  {phase.timing && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      <CircleDot className="h-3 w-3" aria-hidden="true" />
                      {phase.timing}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">{phase.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Outcomes — ascending staircase steps (distinct from timeline)           */
/* -------------------------------------------------------------------------- */

export function ServiceOutcomes({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section background="soft" aria-labelledby={`outcomes-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow={ui.outcomesEyebrow}
          titleId={`outcomes-${service.slug}`}
          title={service.outcomePromise}
          description={ui.outcomesDesc}
        />

        {/* Ascending staircase — each step is wider/higher than the last */}
        <div className="flex flex-col gap-0">
          {service.outcomes.map((o, i) => {
            const isLast = i === service.outcomes.length - 1;
            return (
              <div
                key={o.label}
                className="relative flex items-stretch gap-4"
                style={{ paddingLeft: `${i * 1.5}rem` }}
              >
                {/* step indicator */}
                <div className="flex w-10 shrink-0 flex-col items-center">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-colors",
                      isLast
                        ? "bg-brand-gradient text-white shadow-[0_4px_12px_-4px_rgba(24,138,172,0.6)]"
                        : "bg-white text-brand-teal border border-line"
                    )}
                  >
                    {isLast ? <Trophy className="h-4 w-4" aria-hidden="true" /> : i + 1}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="mt-1 h-full w-0.5 flex-1 bg-line"
                    />
                  )}
                </div>
                {/* step content */}
                <div
                  className={cn(
                    "card-lift mb-3 flex flex-1 items-center gap-4 rounded-2xl border bg-white p-4",
                    isLast ? "border-brand-teal/40 ring-1 ring-brand-teal/10" : "border-line"
                  )}
                >
                  <TrendingUp
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isLast ? "text-brand-teal" : "text-muted"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-graphite">{o.label}</p>
                    <p className="text-xs leading-relaxed text-secondary sm:text-sm">{o.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Related services — "next best modules" rail (chips, not cards)         */
/* -------------------------------------------------------------------------- */

export function RelatedServices({ service }: { service: Service }) {
  const ui = useUI();
  const related = getRelatedServices(service);
  if (related.length === 0) return null;

  return (
    <Section background="default" aria-labelledby={`related-${service.slug}`}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{ui.relatedEyebrow}</Eyebrow>
          <h2
            id={`related-${service.slug}`}
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl"
          >
            {ui.relatedTitle.replace("{service}", service.shortLabel)}
          </h2>
        </div>
        {/* horizontal rail of module chips — not cards */}
        <div className="flex flex-wrap gap-3">
          {related.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="card-lift group inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3 hover:border-brand-teal/40"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-graphite">{s.title}</span>
                <span className="text-[11px] text-muted">{ui.relatedModule}</span>
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
/* 9. FAQ — clean compact accordion                                            */
/* -------------------------------------------------------------------------- */

export function ServiceFAQ({ service }: { service: Service }) {
  const ui = useUI();
  return (
    <Section background="soft" aria-labelledby={`faq-${service.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
        <SectionHeader
          align="left"
          eyebrow={ui.faqEyebrow}
          titleId={`faq-${service.slug}`}
          title={ui.faqTitle.replace("{service}", service.shortLabel)}
        />
        <FAQAccordion items={service.faqs} />
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. Final CTA — service-specific audit preview panel                        */
/* -------------------------------------------------------------------------- */

/**
 * Service-specific audit preview icon sets — keyed by service slug.
 *
 * Icons are visual (locale-independent), so they stay here. The localized
 * text labels live in the ServicesContent ui.ctaPreviewLabels /
 * ui.ctaPreviewDefault strings and are zipped together with these icons
 * by index at render time.
 */
const ctaPreviewIconsBySlug: Partial<Record<string, React.ElementType[]>> = {
  "seo-agency": [GitBranch, ListChecks, Gauge, Target, Zap],
  "technical-seo": [Search, Gauge, ListChecks, AlertTriangle, GitBranch],
  "ai-search-optimization": [Sparkles, Search, Target, ListChecks, GitBranch],
  "content-marketing": [ListChecks, Check, GitBranch, Target, Zap],
  "digital-pr-link-building": [Gauge, Target, Sparkles, AlertTriangle, GitBranch],
  "local-seo": [ListChecks, Search, Target, Check, GitBranch],
  "ecommerce-seo": [GitBranch, Search, AlertTriangle, Target, ListChecks],
  "international-seo": [GitBranch, Check, Search, Target, Zap],
  "seo-audit": [ListChecks, Target, Search, Gauge, Sparkles, GitBranch],
  "ppc-management": [GitBranch, Search, Target, Check, Zap],
  "seo-mentor-service": [ListChecks, GitBranch, Sparkles, Target, Gauge],
};

const ctaPreviewIconsDefault: React.ElementType[] = [ListChecks, Target, Sparkles];

export function ServiceCTA({ service }: { service: Service }) {
  const ui = useUI();
  const labels = ui.ctaPreviewLabels[service.slug] ?? ui.ctaPreviewDefault;
  const icons = ctaPreviewIconsBySlug[service.slug] ?? ctaPreviewIconsDefault;
  const previewRows = labels.map((label, i) => ({
    label,
    icon: icons[i % icons.length] ?? ListChecks,
  }));

  return (
    <Section background="default">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white depth-layered">
          {/* gradient halo */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-gradient-soft opacity-50 blur-3xl" />
          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* left: copy + CTA */}
            <div className="flex flex-col items-start gap-5">
              <Eyebrow>{ui.ctaEyebrow}</Eyebrow>
              <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
                {ui.ctaTitle.replace("{service}", service.shortLabel.toLowerCase())}
              </h2>
              <p className="max-w-lg text-secondary">
                {ui.ctaDesc}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href="/free-seo-audit">
                  {ui.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href="/book-a-call">
                  {ui.heroCtaSecondary}
                </CTAButton>
              </div>
            </div>
            {/* right: service-specific audit report preview */}
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                  {ui.ctaAuditPreview}
                </span>
                <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold text-white">
                  {ui.ninetyDayPlan}
                </span>
              </div>
              {previewRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white px-4 py-3">
                  <row.icon className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                  <span className="flex-1 text-xs font-medium text-secondary">{row.label}</span>
                  <span className="h-1.5 w-16 rounded-full bg-surface-tint">
                    <span className="block h-full w-3/4 rounded-full bg-brand-gradient" />
                  </span>
                </div>
              ))}
              <p className="text-center text-[10px] text-muted">
                {ui.ctaIllustrative}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Full service page template                                                  */
/* -------------------------------------------------------------------------- */

export function ServicePageTemplate({ service, ui }: { service: Service; ui: ServiceUI }) {
  return (
    <ServiceUIContext.Provider value={ui}>
      <ServicePageHero service={service} />
      <ServiceProblemSection service={service} />
      <ServiceApproachSection service={service} />
      <ServiceDeliverables service={service} />
      <ServiceUseCases service={service} />
      <ServiceProcess service={service} />
      <ServiceOutcomes service={service} />
      <RelatedServices service={service} />
      <ServiceFAQ service={service} />
      <ServiceCTA service={service} />
    </ServiceUIContext.Provider>
  );
}