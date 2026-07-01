import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Compass,
  Gauge,
  Bot,
  Activity,
  Network,
  MapPin,
  ShoppingCart,
  Globe2,
  ClipboardCheck,
  Megaphone,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { ServiceBreadcrumb } from "@/components/marketing/services/service-template";
import {
  ServiceConstellation,
  DecisionPathAccent,
} from "@/components/marketing/services/service-visuals";
import { services, servicesHub, type Service } from "@/data/services";

export const metadata: Metadata = buildMetadata({
  title: "SEO Services Built to Work Together | Taskcover Agency",
  description:
    "Search growth services that connect SEO, AI Search, PPC, Content, Digital PR, Local, eCommerce, International, Mentorship, and Audits into one system.",
  path: "/services",
});

/** Icon map for service micro-visuals on the hub. */
const serviceIconMap: Record<Service["icon"], LucideIcon> = {
  strategy: Compass,
  technical: Gauge,
  ai: Bot,
  content: Activity,
  pr: Network,
  local: MapPin,
  ecommerce: ShoppingCart,
  international: Globe2,
  audit: ClipboardCheck,
  ppc: Megaphone,
  mentor: GraduationCap,
};

/** Decision-guide scenarios — outcome-based, not a flat list. */
const decisionScenarios = [
  {
    variant: "visibility" as const,
    question: "Need visibility?",
    answer: "Start with SEO Strategy or Technical SEO to build a crawlable, visible foundation.",
    services: ["seo-agency", "technical-seo"],
  },
  {
    variant: "capture" as const,
    question: "Need demand capture?",
    answer: "PPC and Local SEO capture high-intent demand fast — locally and globally.",
    services: ["ppc-management", "local-seo"],
  },
  {
    variant: "authority" as const,
    question: "Need authority?",
    answer: "Content Marketing and Digital PR build the signals Google and AI surfaces cite.",
    services: ["content-marketing", "digital-pr-link-building"],
  },
  {
    variant: "capability" as const,
    question: "Need team capability?",
    answer: "SEO Mentor Service gives founders and in-house teams senior-level guidance.",
    services: ["seo-mentor-service"],
  },
];

export default function ServicesHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ])
          ),
        }}
      />

      {/* 1. Hero — split with floating constellation dashboard */}
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <ServiceBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Services" },
              ]}
            />
            <Eyebrow>{servicesHub.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {servicesHub.h1}
            </h1>
            <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
              {servicesHub.positioning}
            </p>
            <p className="max-w-xl text-pretty text-secondary sm:text-lg">
              {servicesHub.description}
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={servicesHub.primaryCta.href}>
                {servicesHub.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="/book-a-call">
                Book Strategy Call
              </CTAButton>
            </div>
          </div>
          {/* Floating constellation */}
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
            <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-4 ring-brand-glow">
              <ServiceConstellation className="h-auto w-full" />
              <figcaption className="mt-1 text-center text-[11px] text-muted">
                One connected Search Growth System — not a list of disconnected tasks.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* 2. Service map — how services connect (operating layers) */}
      <Section background="default" aria-labelledby="map-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={servicesHub.connectSection.eyebrow}
            titleId="map-title"
            title={servicesHub.connectSection.title}
            description={servicesHub.connectSection.description}
          />
          {/* Layered capability stack — not a grid of identical cards */}
          <div className="flex flex-col gap-3">
            {[
              {
                layer: "Foundation",
                tone: "tint",
                items: ["SEO Audit", "Technical SEO", "SEO Strategy"],
                desc: "Diagnose, prioritize, and engineer a crawlable, indexable base.",
              },
              {
                layer: "Demand",
                tone: "soft",
                items: ["Content Marketing", "Digital PR & Link Building", "AI Search Optimization"],
                desc: "Capture intent and build authority signals Google and AI cite.",
              },
              {
                layer: "Reach",
                tone: "tint",
                items: ["Local SEO", "eCommerce SEO", "International SEO"],
                desc: "Win demand by location, catalog, and market.",
              },
              {
                layer: "Acceleration",
                tone: "soft",
                items: ["PPC Management", "SEO Mentor Service"],
                desc: "Capture demand now and upskill your team for durable growth.",
              },
            ].map((row) => (
              <div
                key={row.layer}
                className="grid items-center gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[140px_1fr]"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-graphite">{row.layer}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    {row.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-medium text-graphite"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-secondary">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Service cards — bento with distinct micro-visuals */}
      <Section background="soft" aria-labelledby="services-grid-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow="All services"
            titleId="services-grid-title"
            title="Eleven connected services. One operating system."
            description="Engage one capability or the full system. Either way, work is measured against visibility, trust, leads, and revenue."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIconMap[service.icon];
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="card-lift group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-white p-6 hover:border-brand-teal/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Module
                    </span>
                  </div>
                  <p className="text-base font-semibold text-graphite">{service.title}</p>
                  <p className="text-sm leading-relaxed text-secondary">{service.summary}</p>
                  {/* outcome chip */}
                  <div className="mt-1 rounded-lg border border-brand-teal/20 bg-surface-tint/50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                      Outcome
                    </p>
                    <p className="mt-0.5 text-xs text-secondary">{service.outcomePromise}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal">
                    Explore service
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. Decision guide — scenario cards, not a static list */}
      <Section background="default" aria-labelledby="which-service-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={servicesHub.whichServiceSection.eyebrow}
            titleId="which-service-title"
            title={servicesHub.whichServiceSection.title}
            description={servicesHub.whichServiceSection.description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {decisionScenarios.map((scenario) => {
              const linked = scenario.services
                .map((slug) => services.find((s) => s.slug === slug))
                .filter((s): s is Service => Boolean(s));
              return (
                <div
                  key={scenario.question}
                  className="card-lift flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 hover:border-brand-teal/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-graphite">{scenario.question}</p>
                    <DecisionPathAccent variant={scenario.variant} className="h-8 w-28" />
                  </div>
                  <p className="text-sm leading-relaxed text-secondary">{scenario.answer}</p>
                  <div className="flex flex-wrap gap-2">
                    {linked.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-tint px-3 py-1.5 text-xs font-semibold text-graphite transition-colors hover:border-brand-teal/40 hover:text-brand-teal"
                      >
                        {s.shortLabel}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. CTA — audit report preview */}
      <Section background="tint">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col items-start gap-5">
                <Eyebrow>Start with a clear picture</Eyebrow>
                <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  Not sure which service to start with?
                </h2>
                <p className="max-w-lg text-secondary">
                  The free SEO Growth Audit identifies your biggest visibility, authority, and conversion gaps — and recommends where to focus first.
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
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  Audit includes
                </p>
                {[
                  "Technical SEO snapshot",
                  "Keyword opportunity map",
                  "Competitor visibility gap",
                  "Content authority gap",
                  "AI search readiness check",
                  "Prioritized 90-day roadmap",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-brand-gradient text-[10px] font-bold text-white">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}