import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  Gauge,
  Globe2,
  LineChart,
  MapPin,
  Network,
  Search,
  ShoppingCart,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { BentoCard } from "@/components/marketing/shared/bento-card";
import { ProofCard } from "@/components/marketing/shared/proof-card";
import { LogoCloud } from "@/components/marketing/shared/logo-cloud";
import { VideoCard } from "@/components/marketing/shared/video-card";
import { PressCard } from "@/components/marketing/shared/press-card";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { ProcessTimeline } from "@/components/marketing/shared/process-timeline";
import { ComparisonTable } from "@/components/marketing/shared/comparison-table";
import { SearchDashboardMockup } from "@/components/marketing/home/search-dashboard-mockup";
import {
  brandExperienceStrip,
  comparisonRows,
  faqs,
  finalCta,
  growthPlays,
  heroContent,
  industries,
  markets,
  methodologySteps,
  operatingSystem,
  searchHasChanged,
  servicesBento,
  technologyCapabilities,
} from "@/data/home";

export const metadata: Metadata = buildMetadata({
  title: "SEO Agency for Google, AI Search & Revenue Growth",
  description:
    "Taskcover Agency helps ambitious brands grow organic visibility, build authority, improve AI search readiness, and convert high-intent search demand into measurable business outcomes.",
  path: "/",
});

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  strategy: Compass,
  technical: Gauge,
  ai: Bot,
  content: Activity,
  pr: Network,
  local: MapPin,
  ecommerce: ShoppingCart,
  analytics: LineChart,
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Section background="tint" className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{heroContent.eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {heroContent.headline}
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-secondary sm:text-lg">
              {heroContent.subheadline}
            </p>
            <p className="max-w-xl text-sm text-muted">{heroContent.proofLine}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={heroContent.primaryCta.href}>
                {heroContent.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={heroContent.secondaryCta.href}>
                {heroContent.secondaryCta.label}
              </CTAButton>
            </div>
          </div>
          <div className="relative">
            <SearchDashboardMockup />
          </div>
        </Container>
      </Section>

      {/* 2. Brand experience / proof strip */}
      <Section background="default" className="py-14 sm:py-16">
        <Container>
          <LogoCloud
            caption={brandExperienceStrip.caption}
            items={[...brandExperienceStrip.items]}
          />
        </Container>
      </Section>

      {/* 3. Search has changed */}
      <Section background="soft" aria-labelledby="search-changed-title">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            align="left"
            eyebrow={searchHasChanged.eyebrow}
            titleId="search-changed-title"
            title={searchHasChanged.title}
            description={searchHasChanged.description}
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {searchHasChanged.surfaces.map((surface) => (
              <li
                key={surface.label}
                className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-4"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-graphite">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" aria-hidden="true" />
                  {surface.label}
                </span>
                <span className="text-xs text-muted">{surface.note}</span>
              </li>
            ))}
          </ul>
          <GradientBorderCard className="max-w-3xl">
            <p className="text-base font-medium text-graphite sm:text-lg">
              {searchHasChanged.message}
            </p>
          </GradientBorderCard>
        </Container>
      </Section>

      {/* 4. Taskcover Search Operating System */}
      <Section background="default" aria-labelledby="os-title">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow={operatingSystem.eyebrow}
            titleId="os-title"
            title={operatingSystem.title}
            description={operatingSystem.description}
          />
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {operatingSystem.steps.map((step, index) => (
              <li
                key={step.label}
                className="relative flex flex-col gap-2 rounded-2xl border border-line bg-white p-5"
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

      {/* 5. Results / growth plays */}
      <Section background="soft" aria-labelledby="plays-title">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow={growthPlays.eyebrow}
            titleId="plays-title"
            title={growthPlays.title}
            description={growthPlays.description}
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {growthPlays.cards.map((card) => (
              <ProofCard
                key={card.title}
                eyebrow="Growth play"
                footer={
                  <Link
                    href={card.cta.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal hover:underline"
                  >
                    {card.cta.label}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                }
              >
                <p className="text-base font-semibold text-graphite">{card.title}</p>
                <dl className="mt-3 flex flex-col gap-2 text-xs">
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-muted">Challenge</dt>
                    <dd className="text-secondary">{card.challenge}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-muted">Strategy</dt>
                    <dd className="text-secondary">{card.strategy}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-muted">Output</dt>
                    <dd className="text-secondary">{card.output}</dd>
                  </div>
                </dl>
              </ProofCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Services bento grid */}
      <Section background="default" aria-labelledby="services-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={servicesBento.eyebrow}
            titleId="services-title"
            title={servicesBento.title}
            description={servicesBento.description}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicesBento.cards.map((card) => {
              const Icon = serviceIconMap[card.icon] ?? Search;
              return (
                <BentoCard key={card.title} className="flex flex-col gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tint text-brand-teal">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-base font-semibold text-graphite">{card.title}</p>
                  <p className="text-sm text-secondary">{card.outcome}</p>
                  <Link
                    href={card.href}
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

      {/* 7. Industries */}
      <Section background="soft" aria-labelledby="industries-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={industries.eyebrow}
            titleId="industries-title"
            title={industries.title}
            description={industries.description}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industries.cards.map((card) => (
              <BentoCard key={card.title} className="flex flex-col gap-3">
                <p className="text-base font-semibold text-graphite">{card.title}</p>
                <dl className="flex flex-col gap-2 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Pain point</dt>
                    <dd className="text-secondary">{card.pain}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Opportunity</dt>
                    <dd className="text-secondary">{card.opportunity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Taskcover solution</dt>
                    <dd className="text-secondary">{card.solution}</dd>
                  </div>
                </dl>
                <Link
                  href={card.href}
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal hover:underline"
                >
                  View industry
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </BentoCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* 8. Markets */}
      <Section background="default" aria-labelledby="markets-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={markets.eyebrow}
            titleId="markets-title"
            title={markets.title}
            description={markets.description}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {markets.cards.map((card) => (
              <BentoCard key={card.title} tone="tint" className="flex flex-col gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-graphite">
                  <Globe2 className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                  {card.title}
                </span>
                <p className="text-sm text-secondary">{card.context}</p>
                <ul className="flex flex-col gap-1.5 pt-1 text-xs text-secondary">
                  {card.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={card.href}
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-teal hover:underline"
                >
                  View market
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </BentoCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* 9. Video trust */}
      <Section background="soft" aria-labelledby="video-trust-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Trust on record"
            titleId="video-trust-title"
            title="Real voices, real outcomes."
            description="Layout ready for spokesperson introduction videos and client video reviews. Placeholders are shown until real, permissioned video assets are provided."
          />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <VideoCard
              title="Spokesperson introduction"
              description="Who leads the work and why the system works."
            />
            <VideoCard
              title="Client video review"
              description="A client walks through what changed and why it mattered."
            />
            <ProofCard eyebrow="Written quote" footer="Placeholder · Coming soon">
              <p>
                Written client quote placeholder. Replace with a real,
                permissioned quote and verified attribution before publishing.
              </p>
            </ProofCard>
          </div>
        </Container>
      </Section>

      {/* 10. Press / featured on */}
      <Section background="default" aria-labelledby="press-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Press & features"
            titleId="press-title"
            title="Coverage placeholders, ready for real links."
            description="We do not invent press links. Each card renders as a neutral placeholder until a real, attributable article is confirmed."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PressCard
              publication="Publication"
              title="Article title placeholder"
              topic="Topic tag"
            />
            <PressCard
              publication="Publication"
              title="Article title placeholder"
              topic="Topic tag"
            />
            <PressCard
              publication="Publication"
              title="Article title placeholder"
              topic="Topic tag"
            />
          </div>
        </Container>
      </Section>

      {/* 11. Methodology */}
      <Section background="soft" aria-labelledby="methodology-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeader
            align="left"
            eyebrow="Methodology"
            titleId="methodology-title"
            title="The Taskcover 90-day SEO growth process."
            description="A repeatable rhythm that compounds visibility, authority, and conversion without becoming a black box."
          />
          <ProcessTimeline steps={[...methodologySteps]} />
        </Container>
      </Section>

      {/* 12. Technology / Search Intelligence Layer */}
      <Section background="default" aria-labelledby="tech-title">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeader
              align="left"
              eyebrow={technologyCapabilities.eyebrow}
              titleId="tech-title"
              title={technologyCapabilities.title}
              description={technologyCapabilities.description}
            />
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {technologyCapabilities.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm text-graphite"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient text-white">
                  <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {capability}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 13. Comparison */}
      <Section background="soft" aria-labelledby="comparison-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Why Taskcover"
            titleId="comparison-title"
            title="Traditional SEO vendor vs Taskcover Agency."
            description="Same budget, very different system. Here is where the approaches diverge."
          />
          <ComparisonTable rows={[...comparisonRows]} />
        </Container>
      </Section>

      {/* 14. Free SEO audit CTA */}
      <Section background="default" aria-labelledby="audit-title">
        <Container>
          <GradientBorderCard className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col gap-4">
                <Eyebrow>Free SEO Growth Audit</Eyebrow>
                <h2 id="audit-title" className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  See exactly where your search growth is leaking.
                </h2>
                <p className="max-w-xl text-secondary">
                  A clear, prioritized snapshot of your technical health, content
                  authority, AI readiness, and competitive gap — with a 90-day
                  roadmap outline.
                </p>
                <ul className="grid grid-cols-1 gap-2 pt-2 text-sm text-secondary sm:grid-cols-2">
                  {[
                    "Technical SEO snapshot",
                    "Keyword opportunity map",
                    "Competitor visibility gap",
                    "Content authority gap",
                    "AI search readiness check",
                    "90-day roadmap",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-teal" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center gap-3 rounded-xl bg-surface-tint p-6">
                <p className="text-sm font-semibold text-graphite">
                  Request your audit
                </p>
                <p className="text-xs text-muted">
                  V1 uses a CTA button. A real form will be wired up in a later
                  task.
                </p>
                <CTAButton size="lg" href="/free-seo-audit" className="mt-2 w-full">
                  Get Free SEO Audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
              </div>
            </div>
          </GradientBorderCard>
        </Container>
      </Section>

      {/* 15. FAQ */}
      <Section background="soft" aria-labelledby="faq-title">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
          <SectionHeader
            align="left"
            eyebrow="FAQ"
            titleId="faq-title"
            title="Questions, answered directly."
          />
          <FAQAccordion items={[...faqs]} />
        </Container>
      </Section>

      {/* 16. Final CTA */}
      <Section background="default">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-tint p-8 sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative flex flex-col items-start gap-6">
              <Eyebrow>{finalCta.eyebrow}</Eyebrow>
              <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {finalCta.title}
              </h2>
              <p className="max-w-2xl text-secondary">{finalCta.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href={finalCta.primaryCta.href}>
                  {finalCta.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href={finalCta.secondaryCta.href}>
                  {finalCta.secondaryCta.label}
                </CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}