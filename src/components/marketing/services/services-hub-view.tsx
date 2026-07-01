/**
 * Shared services hub view — renders from localized ServicesContent.
 *
 * Used by:
 *  - app/services/page.tsx               (English, unprefixed)
 *  - app/[locale]/services/page.tsx       (fr / es)
 *
 * Localization policy (Task 4A):
 *  - Hub hero, connect section, "which service" section, card summaries, and
 *    decision scenarios are localized.
 *  - The capability layer rows are derived from localized service titles.
 */

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
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { ServiceBreadcrumb } from "@/components/marketing/services/service-template";
import {
  ServiceConstellation,
  DecisionPathAccent,
} from "@/components/marketing/services/service-visuals";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { getServicesContent, getServices } from "@/lib/content";
import type { Service } from "@/data/services";

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

export function ServicesHubView({ locale }: { locale: Locale }) {
  const content = getServicesContent(locale);
  const services = getServices(locale);
  const loc = (p: string) => localizePath(p, locale);

  const homeCrumb = locale === "en" ? "/" : `/${locale}`;

  /** Capability layers using localized service titles. */
  const layers: { layer: string; tone: "tint" | "soft"; slugs: string[]; desc: string }[] = [
    {
      layer: content.services["seo-audit"].shortLabel,
      tone: "tint",
      slugs: ["seo-audit", "technical-seo", "seo-agency"],
      desc: "",
    },
    {
      layer: content.services["content-marketing"].shortLabel,
      tone: "soft",
      slugs: ["content-marketing", "digital-pr-link-building", "ai-search-optimization"],
      desc: "",
    },
    {
      layer: content.services["local-seo"].shortLabel,
      tone: "tint",
      slugs: ["local-seo", "ecommerce-seo", "international-seo"],
      desc: "",
    },
    {
      layer: content.services["ppc-management"].shortLabel,
      tone: "soft",
      slugs: ["ppc-management", "seo-mentor-service"],
      desc: "",
    },
  ];

  const decisionScenarios = [
    {
      variant: "visibility" as const,
      question: content.ui.decisionVisibilityQ,
      answer: content.ui.decisionVisibilityA,
      slugs: ["seo-agency", "technical-seo"],
    },
    {
      variant: "capture" as const,
      question: content.ui.decisionCaptureQ,
      answer: content.ui.decisionCaptureA,
      slugs: ["ppc-management", "local-seo"],
    },
    {
      variant: "authority" as const,
      question: content.ui.decisionAuthorityQ,
      answer: content.ui.decisionAuthorityA,
      slugs: ["content-marketing", "digital-pr-link-building"],
    },
    {
      variant: "capability" as const,
      question: content.ui.decisionCapabilityQ,
      answer: content.ui.decisionCapabilityA,
      slugs: ["seo-mentor-service"],
    },
  ];

  return (
    <>
      {/* 1. Hero — split with floating constellation dashboard */}
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <ServiceBreadcrumb
              items={[
                { label: content.hub.eyebrow === "Services" ? "Home" : "", href: homeCrumb },
                { label: content.hub.eyebrow },
              ].filter((i) => i.label)}
            />
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
          {/* Floating constellation */}
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
            <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-4 ring-brand-glow">
              <ServiceConstellation className="h-auto w-full" />
              <figcaption className="mt-1 text-center text-[11px] text-muted">
                {content.hub.connectSection.description}
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
            eyebrow={content.hub.connectSection.eyebrow}
            titleId="map-title"
            title={content.hub.connectSection.title}
            description={content.hub.connectSection.description}
          />
          <div className="flex flex-col gap-3">
            {layers.map((row) => {
              const layerServices = row.slugs
                .map((slug) => services.find((s) => s.slug === slug))
                .filter((s): s is Service => Boolean(s));
              return (
                <div
                  key={row.layer}
                  className="grid items-center gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[180px_1fr]"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-graphite">{row.layer}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {layerServices.map((item) => (
                        <span
                          key={item.slug}
                          className="inline-flex items-center rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-medium text-graphite"
                        >
                          {item.shortLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. Service cards — bento with distinct micro-visuals */}
      <Section background="soft" aria-labelledby="services-grid-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.ui.allServices}
            titleId="services-grid-title"
            title={content.ui.allServicesTitle}
            description={content.ui.allServicesDesc}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIconMap[service.icon];
              return (
                <Link
                  key={service.slug}
                  href={loc(`/services/${service.slug}`)}
                  className="card-lift group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-white p-6 hover:border-brand-teal/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {content.ui.module}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-graphite">{service.title}</p>
                  <p className="text-sm leading-relaxed text-secondary">{service.summary}</p>
                  {/* outcome chip */}
                  <div className="mt-1 rounded-lg border border-brand-teal/20 bg-surface-tint/50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                      {content.ui.outcome}
                    </p>
                    <p className="mt-0.5 text-xs text-secondary">{service.outcomePromise}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal">
                    {content.ui.exploreService}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. Decision guide — scenario cards */}
      <Section background="default" aria-labelledby="which-service-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.whichServiceSection.eyebrow}
            titleId="which-service-title"
            title={content.hub.whichServiceSection.title}
            description={content.hub.whichServiceSection.description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {decisionScenarios.map((scenario) => {
              const linked = scenario.slugs
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
                        href={loc(`/services/${s.slug}`)}
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
                <Eyebrow>{content.ui.notSureEyebrow}</Eyebrow>
                <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {content.ui.notSureTitle}
                </h2>
                <p className="max-w-lg text-secondary">
                  {content.ui.notSureDesc}
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
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  {content.ui.auditPreview}
                </p>
                {[
                  content.services["seo-audit"].title,
                  content.services["technical-seo"].title,
                  content.services["ai-search-optimization"].title,
                  content.ui.ninetyDayPlan,
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