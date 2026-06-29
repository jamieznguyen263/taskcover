import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Globe2,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { ProofCard } from "@/components/marketing/shared/proof-card";
import { LogoCloud } from "@/components/marketing/shared/logo-cloud";
import { VideoCard } from "@/components/marketing/shared/video-card";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { ProcessTimeline } from "@/components/marketing/shared/process-timeline";
import { ComparisonTable } from "@/components/marketing/shared/comparison-table";
import { DashboardCard } from "@/components/marketing/shared/dashboard-card";
import { SearchDashboardMockup } from "@/components/marketing/home/search-dashboard-mockup";
import { SearchEcosystemMap } from "@/components/marketing/home/search-ecosystem-map";
import { OperatingSystemPipeline } from "@/components/marketing/home/operating-system-pipeline";
import { ServicesBento } from "@/components/marketing/home/services-bento";
import { IndustriesRail } from "@/components/marketing/home/industries-rail";
import { MarketsPanels } from "@/components/marketing/home/markets-panels";
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

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — split layout with floating layered dashboard */}
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

      {/* 2. Brand experience — text-only pill strip (distinct from card grids) */}
      <Section background="default" className="py-14 sm:py-16">
        <Container>
          <LogoCloud
            caption={brandExperienceStrip.caption}
            items={[...brandExperienceStrip.items]}
          />
        </Container>
      </Section>

      {/* 3. Search has changed — interactive ecosystem network map */}
      <Section background="soft" aria-labelledby="search-changed-title">
        <SearchEcosystemMap
          eyebrow={searchHasChanged.eyebrow}
          title={searchHasChanged.title}
          titleId="search-changed-title"
          description={searchHasChanged.description}
          message={searchHasChanged.message}
        />
      </Section>

      {/* 4. Operating system — connected horizontal pipeline */}
      <Section background="default" aria-labelledby="os-title">
        <OperatingSystemPipeline
          eyebrow={operatingSystem.eyebrow}
          title={operatingSystem.title}
          titleId="os-title"
          description={operatingSystem.description}
          steps={[...operatingSystem.steps]}
        />
      </Section>

      {/* 5. Growth plays — challenge/strategy/output editorial cards */}
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

      {/* 6. Services — asymmetric bento with unique micro-visuals per card */}
      <Section background="default" aria-labelledby="services-title">
        <ServicesBento
          eyebrow={servicesBento.eyebrow}
          title={servicesBento.title}
          titleId="services-title"
          description={servicesBento.description}
          cards={[...servicesBento.cards]}
        />
      </Section>

      {/* 7. Industries — tabbed sector rail with detail preview */}
      <Section background="soft" aria-labelledby="industries-title">
        <IndustriesRail
          eyebrow={industries.eyebrow}
          title={industries.title}
          titleId="industries-title"
          description={industries.description}
          industries={[...industries.cards]}
        />
      </Section>

      {/* 8. Markets — regional panels with map-dot accent headers */}
      <Section background="default" aria-labelledby="markets-title">
        <MarketsPanels
          eyebrow={markets.eyebrow}
          title={markets.title}
          titleId="markets-title"
          description={markets.description}
          markets={[...markets.cards]}
        />
      </Section>

      {/* 9. Video trust — video-first featured layout */}
      <Section background="soft" aria-labelledby="video-trust-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Trust on record"
            titleId="video-trust-title"
            title="Real voices, real outcomes."
            description="Layout ready for spokesperson introduction videos and client video reviews. Placeholders are shown until real, permissioned video assets are provided."
          />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VideoCard
                title="Spokesperson introduction"
                description="Who leads the work and why the system works."
              />
            </div>
            <div className="flex flex-col gap-5">
              <VideoCard
                title="Client video review"
                description="A client walks through what changed and why it mattered."
              />
              <ProofCard eyebrow="Written quote" footer="Placeholder · Coming soon">
                <p className="text-sm">
                  Written client quote placeholder. Replace with a real,
                  permissioned quote and verified attribution before publishing.
                </p>
              </ProofCard>
            </div>
          </div>
        </Container>
      </Section>

      {/* 10. Press — editorial list style (not another card grid) */}
      <Section background="default" aria-labelledby="press-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Press & features"
            titleId="press-title"
            title="Coverage placeholders, ready for real links."
            description="We do not invent press links. Each item renders as a neutral placeholder until a real, attributable article is confirmed."
          />
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <ul className="divide-y divide-line-soft">
              {[
                { pub: "Publication", topic: "Search Intelligence", date: "Coming soon" },
                { pub: "Publication", topic: "AI Search", date: "Coming soon" },
                { pub: "Publication", topic: "SEO Strategy", date: "Coming soon" },
                { pub: "Publication", topic: "Digital PR", date: "Coming soon" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-tint"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-tint text-brand-teal">
                    <Newspaper className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-graphite">
                        {item.pub} — Article title placeholder
                      </p>
                      <p className="text-xs text-muted">{item.topic}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-line bg-surface-tint px-2.5 py-1 text-[11px] font-medium text-muted">
                      {item.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 11. Methodology — vertical timeline */}
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

      {/* 12. Technology — dashboard module grid (search intelligence layer) */}
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {technologyCapabilities.capabilities.map((capability, i) => (
              <DashboardCard
                key={capability}
                className="card-lift"
                title={capability}
                action={
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient text-[10px] font-semibold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                }
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-emerald" />
                  Active in every engagement
                </div>
              </DashboardCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* 13. Comparison — contrast table */}
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

      {/* 14. Free audit CTA — audit report preview layout */}
      <Section background="default" aria-labelledby="audit-title">
        <Container>
          <GradientBorderCard className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              {/* Left: value proposition + checklist */}
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
              {/* Right: report preview panel */}
              <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface-tint p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-graphite">
                    <FileSearch className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                    Audit preview
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-muted">
                    <Sparkles className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                    Sample
                  </span>
                </div>
                {/* Mini scorecards */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Technical", icon: ClipboardCheck },
                    { label: "AI Ready", icon: Sparkles },
                    { label: "Content", icon: FileSearch },
                    { label: "Authority", icon: Globe2 },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-2 rounded-lg border border-line bg-white p-3"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-gradient text-white">
                        <s.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wide text-muted">{s.label}</span>
                        <span className="text-sm font-semibold text-graphite">—</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted">
                  V1 uses a CTA button. A real form will be wired up in a later task.
                </p>
                <CTAButton size="lg" href="/free-seo-audit" className="mt-1 w-full">
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