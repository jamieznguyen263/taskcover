import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { BentoCard } from "@/components/marketing/shared/bento-card";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { LogoCloud } from "@/components/marketing/shared/logo-cloud";
import { serviceIconMap, ServiceBreadcrumb } from "@/components/marketing/services/service-template";
import { services, servicesHub } from "@/data/services";
import { brandExperienceStrip } from "@/data/home";

export const metadata: Metadata = buildMetadata({
  title: "SEO Services Built to Work Together | Taskcover Agency",
  description:
    "Search growth services that connect SEO, content, authority, AI search, and conversion into one system. SEO Strategy, Technical SEO, AI Search Optimization, Content, Digital PR, Local, eCommerce, International, and Audits.",
  path: "/services",
});

export default function ServicesHubPage() {
  const operatingSteps = [
    { label: "Audit", description: "Technical, content, authority, and AI readiness baseline." },
    { label: "Strategy", description: "Priorities mapped to revenue and pipeline." },
    { label: "Technical", description: "Crawl, architecture, schema, and performance." },
    { label: "Content", description: "Expert-led clusters tied to buyer intent." },
    { label: "Authority", description: "Earned mentions, links, and trust signals." },
    { label: "AI Search Readiness", description: "Structured, citation-worthy content." },
    { label: "CRO", description: "Convert high-intent demand into pipeline." },
    { label: "Reporting", description: "Business-impact dashboards." },
  ];

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

      {/* Hero */}
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative flex flex-col gap-6">
          <ServiceBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Services" },
            ]}
          />
          <Eyebrow>{servicesHub.eyebrow}</Eyebrow>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
            {servicesHub.h1}
          </h1>
          <p className="max-w-3xl text-base font-medium text-graphite sm:text-lg">
            {servicesHub.positioning}
          </p>
          <p className="max-w-2xl text-pretty text-secondary sm:text-lg">
            {servicesHub.description}
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <CTAButton size="lg" href={servicesHub.primaryCta.href}>
              {servicesHub.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href={servicesHub.secondaryCta.href}>
              {servicesHub.secondaryCta.label}
            </CTAButton>
          </div>
        </Container>
      </Section>

      {/* Services bento */}
      <Section background="default" aria-labelledby="services-grid-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow="All services"
            titleId="services-grid-title"
            title="One system. Nine connected services."
            description="Engage one capability or the full system. Either way, work is measured against visibility, trust, leads, and revenue."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIconMap[service.icon];
              return (
                <BentoCard key={service.slug} className="flex flex-col gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-base font-semibold text-graphite">{service.title}</p>
                  <p className="text-sm text-secondary">{service.summary}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal hover:underline"
                  >
                    Explore service
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </BentoCard>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* How services connect */}
      <Section background="soft" aria-labelledby="connect-title">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow={servicesHub.connectSection.eyebrow}
            titleId="connect-title"
            title={servicesHub.connectSection.title}
            description={servicesHub.connectSection.description}
          />
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {operatingSteps.map((step, index) => (
              <li
                key={step.label}
                className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-5"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-graphite">{step.label}</p>
                <p className="text-xs leading-relaxed text-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Which service is right for you */}
      <Section background="default" aria-labelledby="which-service-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={servicesHub.whichServiceSection.eyebrow}
            titleId="which-service-title"
            title={servicesHub.whichServiceSection.title}
            description={servicesHub.whichServiceSection.description}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
              >
                <p className="text-sm font-semibold text-graphite">{service.title}</p>
                <p className="text-sm text-secondary">{service.outcomePromise}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal hover:underline"
                >
                  See if it fits
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Proof strip */}
      <Section background="soft" className="py-14 sm:py-16">
        <Container>
          <LogoCloud
            caption={brandExperienceStrip.caption}
            items={[...brandExperienceStrip.items]}
          />
        </Container>
      </Section>

      {/* CTA */}
      <Section background="default">
        <Container>
          <GradientBorderCard className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-4">
              <Eyebrow>Start with a clear picture</Eyebrow>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                Not sure which service to start with?
              </h2>
              <p className="max-w-2xl text-secondary">
                The free SEO Growth Audit identifies your biggest visibility,
                authority, and conversion gaps — and recommends where to focus
                first.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href="/free-seo-audit">
                  Get Free SEO Audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href="/book-a-call">
                  Book Strategy Call
                </CTAButton>
              </div>
            </div>
          </GradientBorderCard>
        </Container>
      </Section>
    </>
  );
}