import * as React from "react";
import { Check, ArrowRight } from "lucide-react";
import {
  Activity,
  Bot,
  Compass,
  Gauge,
  MapPin,
  Network,
  Search,
  ShoppingCart,
  Globe2,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { BentoCard } from "@/components/marketing/shared/bento-card";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { ProcessTimeline } from "@/components/marketing/shared/process-timeline";
import { LogoCloud } from "@/components/marketing/shared/logo-cloud";
import {
  type Service,
  getRelatedServices,
} from "@/data/services";
import { brandExperienceStrip } from "@/data/home";

/** Icon map shared by hub + individual service pages. */
export const serviceIconMap: Record<
  Service["icon"],
  React.ComponentType<{ className?: string }>
> = {
  strategy: Compass,
  technical: Gauge,
  ai: Bot,
  content: Activity,
  pr: Network,
  local: MapPin,
  ecommerce: ShoppingCart,
  international: Globe2,
  audit: ClipboardCheck,
};

/* -------------------------------------------------------------------------- */
/* Breadcrumb (visual, not schema)                                            */
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
/* Service page hero                                                          */
/* -------------------------------------------------------------------------- */

export function ServicePageHero({ service }: { service: Service }) {
  const Icon = serviceIconMap[service.icon] ?? Search;
  return (
    <Section
      background="tint"
      className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
      <Container className="relative flex flex-col gap-6">
        <ServiceBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.shortLabel },
          ]}
        />
        <div className="inline-flex items-center gap-2 self-start">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <Eyebrow>{service.shortLabel}</Eyebrow>
        </div>
        <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem]">
          {service.h1}
        </h1>
        <p className="max-w-3xl text-base font-medium text-graphite sm:text-lg">
          {service.positioning}
        </p>
        <p className="max-w-2xl text-pretty text-secondary sm:text-lg">
          {service.subheadline}
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <CTAButton size="lg" href="/free-seo-audit">
            Get Free SEO Audit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
          <CTAButton variant="secondary" size="lg" href="/methodology">
            View Methodology
          </CTAButton>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Trust strip                                                                */
/* -------------------------------------------------------------------------- */

export function ServiceTrustStrip() {
  return (
    <Section background="default" className="py-12 sm:py-14">
      <Container>
        <LogoCloud
          caption={brandExperienceStrip.caption}
          items={[...brandExperienceStrip.items]}
        />
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Problem section                                                            */
/* -------------------------------------------------------------------------- */

export function ServiceProblemSection({ service }: { service: Service }) {
  return (
    <Section background="soft" aria-labelledby={`problem-${service.slug}`}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeader
          align="left"
          eyebrow="The problem"
          titleId={`problem-${service.slug}`}
          title={service.problem.title}
        />
        <div className="flex flex-col gap-5">
          {service.problem.paragraphs.map((p, i) => (
            <p key={i} className="text-pretty text-secondary sm:text-lg">
              {p}
            </p>
          ))}
          <ul className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
            {service.problem.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm text-secondary"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Approach section                                                           */
/* -------------------------------------------------------------------------- */

export function ServiceApproachSection({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`approach-${service.slug}`}>
      <Container className="flex flex-col gap-12">
        <SectionHeader
          align="left"
          eyebrow="The Taskcover approach"
          titleId={`approach-${service.slug}`}
          title={service.approach.title}
          description={service.approach.paragraphs[0]}
        />
        {service.approach.paragraphs.length > 1 ? (
          <div className="mx-auto w-full max-w-3xl">
            <p className="text-pretty text-secondary sm:text-lg">
              {service.approach.paragraphs[1]}
            </p>
          </div>
        ) : null}
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.approach.stages.map((stage, index) => (
            <li
              key={stage.label}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-5"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-graphite">{stage.label}</p>
              <p className="text-xs leading-relaxed text-secondary">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Deliverables section                                                       */
/* -------------------------------------------------------------------------- */

export function ServiceDeliverables({ service }: { service: Service }) {
  return (
    <Section background="soft" aria-labelledby={`deliverables-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow="Deliverables"
          titleId={`deliverables-${service.slug}`}
          title="What you get."
          description="Concrete, service-specific outputs — not vague promises."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.deliverables.map((d) => (
            <BentoCard key={d.title} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-graphite">{d.title}</p>
              <p className="text-sm text-secondary">{d.description}</p>
            </BentoCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Use cases section                                                          */
/* -------------------------------------------------------------------------- */

export function ServiceUseCases({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`usecases-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="left"
          eyebrow="Who this is for"
          titleId={`usecases-${service.slug}`}
          title="Built for the teams that feel this pain most."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {service.useCases.map((u) => (
            <BentoCard key={u.audience} tone="tint" className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-graphite">{u.audience}</p>
              <p className="text-sm text-secondary">{u.detail}</p>
            </BentoCard>
          ))}
        </div>
        <p className="max-w-2xl text-sm text-muted">
          Engagements are tailored to USA, Canada, and Australia market context
          where relevant.
        </p>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Process section                                                            */
/* -------------------------------------------------------------------------- */

export function ServiceProcess({ service }: { service: Service }) {
  return (
    <Section background="soft" aria-labelledby={`process-${service.slug}`}>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeader
          align="left"
          eyebrow="Process"
          titleId={`process-${service.slug}`}
          title="A clear path from audit to impact."
          description="Phased, prioritized, and validated — so each step compounds."
        />
        <ProcessTimeline steps={service.process} />
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Outcomes section                                                           */
/* -------------------------------------------------------------------------- */

export function ServiceOutcomes({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`outcomes-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Business outcomes"
          titleId={`outcomes-${service.slug}`}
          title={service.outcomePromise}
          description="Outcome language only — no fabricated metrics. Verified results are added when we have attributable data."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.outcomes.map((o) => (
            <div
              key={o.label}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-tint text-brand-teal">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-graphite">{o.label}</p>
              <p className="text-xs leading-relaxed text-secondary">
                {o.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Related services                                                           */
/* -------------------------------------------------------------------------- */

export function RelatedServices({ service }: { service: Service }) {
  const related = getRelatedServices(service);
  if (related.length === 0) return null;

  return (
    <Section background="soft" aria-labelledby={`related-${service.slug}`}>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Related services"
          titleId={`related-${service.slug}`}
          title="Connect this to the rest of the system."
          description="Every service plugs into the same search growth operating system."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((s) => {
            const Icon = serviceIconMap[s.icon] ?? Search;
            return (
              <BentoCard key={s.slug} className="flex flex-col gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tint text-brand-teal">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-graphite">{s.title}</p>
                <p className="text-xs text-secondary">{s.summary}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal hover:underline"
                >
                  Explore
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </BentoCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ + CTA                                                                  */
/* -------------------------------------------------------------------------- */

export function ServiceFAQ({ service }: { service: Service }) {
  return (
    <Section background="default" aria-labelledby={`faq-${service.slug}`}>
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

export function ServiceCTA() {
  return (
    <Section background="default">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-tint p-8 sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-gradient-soft blur-3xl" />
          <div className="relative flex flex-col items-start gap-6">
            <Eyebrow>Start your search growth system</Eyebrow>
            <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Build a search system your competitors cannot easily copy.
            </h2>
            <p className="max-w-2xl text-secondary">
              Get a clear, prioritized picture of where your visibility,
              authority, and conversion gaps are — and a 90-day plan to close
              them.
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
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Full service page template                                                 */
/* -------------------------------------------------------------------------- */

export function ServicePageTemplate({ service }: { service: Service }) {
  return (
    <>
      <ServicePageHero service={service} />
      <ServiceTrustStrip />
      <ServiceProblemSection service={service} />
      <ServiceApproachSection service={service} />
      <ServiceDeliverables service={service} />
      <ServiceUseCases service={service} />
      <ServiceProcess service={service} />
      <ServiceOutcomes service={service} />
      <RelatedServices service={service} />
      <ServiceFAQ service={service} />
      <ServiceCTA />
    </>
  );
}