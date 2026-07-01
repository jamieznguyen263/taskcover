import * as React from "react";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  Target,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  ListChecks,
  Gauge,
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
  getRelatedServices,
} from "@/data/services";
import {
  ServiceHeroVisual,
  ServiceDeliverableVisual,
} from "@/components/marketing/services/service-visuals";

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
/* 1. Service Hero — split layout + floating service-specific dashboard       */
/* -------------------------------------------------------------------------- */

export function ServicePageHero({ service }: { service: Service }) {
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
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
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
              Get Free SEO Audit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/book-a-call">
              Book Strategy Call
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
              Illustrative preview — verified client data is added only with permission.
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Problem — diagnostic scanner panel (not a card grid)                    */
/* -------------------------------------------------------------------------- */

export function ServiceProblemSection({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`problem-${service.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeader
          align="left"
          eyebrow="Why it matters"
          titleId={`problem-${service.slug}`}
          title={service.problem.title}
        />
        {/* Diagnostic panel */}
        <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
          {/* scanner header */}
          <div className="flex items-center justify-between border-b border-line bg-surface-tint px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Issue scanner
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {service.problem.bullets.length} common gaps
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
/* 3. Approach — connected node system (operating-system stages)              */
/* -------------------------------------------------------------------------- */

export function ServiceApproachSection({ service }: { service: Service }) {
  return (
    <Section background="soft" aria-labelledby={`approach-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow="The Taskcover approach"
          titleId={`approach-${service.slug}`}
          title={service.approach.title}
          description={service.approach.paragraphs[0]}
        />
        {service.approach.paragraphs.length > 1 ? (
          <p className="max-w-3xl text-pretty text-secondary sm:text-lg">
            {service.approach.paragraphs[1]}
          </p>
        ) : null}

        {/* Connected node system — horizontal on desktop, vertical on mobile */}
        <div className="overflow-x-auto pb-2">
          <ol className="flex min-w-[640px] flex-row items-stretch gap-0 lg:min-w-0">
            {service.approach.stages.map((stage, index) => (
              <li
                key={stage.label}
                className="relative flex flex-1 flex-col gap-2 rounded-2xl border border-line bg-white p-5 shadow-sm"
                style={{ marginLeft: index === 0 ? 0 : undefined }}
              >
                {/* connector */}
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-brand-teal/40 to-brand-teal lg:block"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(24,138,172,0.6)]">
                    {index + 1}
                  </span>
                  {index === service.approach.stages.length - 1 && (
                    <Sparkles className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                  )}
                </div>
                <p className="text-sm font-semibold text-graphite">{stage.label}</p>
                <p className="text-xs leading-relaxed text-secondary">
                  {stage.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-sm text-muted">
          Every {service.shortLabel} engagement connects to the same search growth operating system — visibility, authority, and revenue measured together.
        </p>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Deliverables — split list + mini-visual panel (varied, not uniform)     */
/* -------------------------------------------------------------------------- */

export function ServiceDeliverables({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`deliverables-${service.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-5">
          <SectionHeader
            align="left"
            eyebrow="Deliverables"
            titleId={`deliverables-${service.slug}`}
            title="What you actually get."
            description="Concrete, service-specific outputs — prioritized by impact, not activity."
          />
          {/* mini visual preview */}
          <div className="rounded-2xl border border-line bg-surface-tint p-4">
            <ServiceDeliverableVisual
              icon={service.icon}
              className="h-20 w-full"
            />
            <p className="mt-2 text-center text-[11px] text-muted">
              {service.shortLabel} delivery preview
            </p>
          </div>
        </div>
        {/* numbered deliverable list with accent bars */}
        <ol className="flex flex-col gap-3">
          {service.deliverables.map((d, i) => (
            <li
              key={d.title}
              className="card-lift group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-tint text-sm font-bold text-brand-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-graphite">{d.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-secondary">{d.description}</p>
              </div>
              <Check className="h-4 w-4 shrink-0 text-brand-green opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Use cases — scenario decision paths (business-focused)                  */
/* -------------------------------------------------------------------------- */

export function ServiceUseCases({ service }: { service: Service }) {
  return (
    <Section background="soft" aria-labelledby={`usecases-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Who this is for"
          titleId={`usecases-${service.slug}`}
          title="Built for the teams that feel this gap most."
          description="Scenario-based fit — find the situation that matches yours."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {service.useCases.map((u, i) => (
            <div
              key={u.audience}
              className={cn(
                "card-lift relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-white p-6",
                i === 1 && "md:-translate-y-2"
              )}
            >
              {/* accent corner */}
              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-16 w-16 rounded-bl-[2rem] bg-brand-gradient-soft opacity-50"
              />
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Target className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="relative text-sm font-semibold text-graphite">{u.audience}</p>
              <p className="relative text-sm leading-relaxed text-secondary">{u.detail}</p>
            </div>
          ))}
        </div>
        <p className="max-w-2xl text-sm text-muted">
          Engagements are tailored to USA, Canada, and Australia market context where relevant.
        </p>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Process — sprint board (distinct from homepage methodology phases)      */
/* -------------------------------------------------------------------------- */

export function ServiceProcess({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`process-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow="How we work"
          titleId={`process-${service.slug}`}
          title="Phased, prioritized, and validated."
          description="Each sprint compounds — no busywork, no black boxes."
        />
        {/* sprint board — columns with cards, not a vertical timeline */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((phase, i) => (
            <div
              key={phase.title}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-surface-tint p-5"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Sprint {i + 1}
                </span>
                <span className="text-lg font-semibold text-brand-gradient">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-graphite">{phase.title}</h3>
              <p className="text-xs leading-relaxed text-secondary">{phase.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Outcomes — score ladder / outcome tiles (distinct from deliverables)    */
/* -------------------------------------------------------------------------- */

export function ServiceOutcomes({ service }: { service: Service }) {
  return (
    <Section background="soft" aria-labelledby={`outcomes-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Business outcomes"
          titleId={`outcomes-${service.slug}`}
          title={service.outcomePromise}
          description="Outcome categories — no fabricated metrics. Verified results are added only with attributable data."
        />
        {/* outcome ladder — ascending tiles */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.outcomes.map((o, i) => (
            <div
              key={o.label}
              className="card-lift relative flex flex-col gap-2 rounded-2xl border border-line bg-white p-5"
              style={{ transform: `translateY(${i * 6}px)` }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-tint text-brand-teal">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-brand-gradient">
                  Level {i + 1}
                </span>
              </div>
              <p className="text-sm font-semibold text-graphite">{o.label}</p>
              <p className="text-xs leading-relaxed text-secondary">{o.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Related services — "next best modules" rail (distinct from deliverables)*/
/* -------------------------------------------------------------------------- */

export function RelatedServices({ service }: { service: Service }) {
  const related = getRelatedServices(service);
  if (related.length === 0) return null;

  return (
    <Section background="default" aria-labelledby={`related-${service.slug}`}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Next best modules</Eyebrow>
          <h2
            id={`related-${service.slug}`}
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl"
          >
            Connect {service.shortLabel} to the rest of the system.
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
                <span className="text-[11px] text-muted">Related module</span>
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
  return (
    <Section background="soft" aria-labelledby={`faq-${service.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
        <SectionHeader
          align="left"
          eyebrow="FAQ"
          titleId={`faq-${service.slug}`}
          title={`${service.shortLabel} questions, answered.`}
        />
        <FAQAccordion items={service.faqs} />
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. Final CTA — audit report preview panel                                  */
/* -------------------------------------------------------------------------- */

export function ServiceCTA({ service }: { service: Service }) {
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
              <Eyebrow>Start your search growth system</Eyebrow>
              <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
                See exactly where {service.shortLabel.toLowerCase()} can move your numbers.
              </h2>
              <p className="max-w-lg text-secondary">
                Get a free SEO Growth Audit with a prioritized 90-day roadmap across technical, content, authority, and AI search readiness.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href="/free-seo-audit">
                  Get Free SEO Audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href="/book-a-call">
                  Book Strategy Call
                </CTAButton>
              </div>
            </div>
            {/* right: mini audit report preview */}
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                  Audit preview
                </span>
                <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold text-white">
                  90-day plan
                </span>
              </div>
              {[
                { label: "Technical health", icon: ListChecks },
                { label: "Keyword opportunity", icon: Target },
                { label: "AI search readiness", icon: Sparkles },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white px-4 py-3">
                  <row.icon className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                  <span className="flex-1 text-xs font-medium text-secondary">{row.label}</span>
                  <span className="h-1.5 w-16 rounded-full bg-surface-tint">
                    <span className="block h-full w-3/4 rounded-full bg-brand-gradient" />
                  </span>
                </div>
              ))}
              <p className="text-center text-[10px] text-muted">
                Illustrative — each audit is scoped to your market and goals.
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

export function ServicePageTemplate({ service }: { service: Service }) {
  return (
    <>
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
    </>
  );
}