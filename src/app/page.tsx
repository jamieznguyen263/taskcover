import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ClipboardCheck, FileSearch, Globe2, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { SearchDashboardMockup } from "@/components/marketing/home/search-dashboard-mockup";
import { BrandMarquee } from "@/components/marketing/home/brand-marquee";
import { SearchEcosystemMap } from "@/components/marketing/home/search-ecosystem-map";
import { OperatingSystemPipeline } from "@/components/marketing/home/operating-system-pipeline";
import { GrowthPlaybook } from "@/components/marketing/home/growth-playbook";
import { ServicesBento } from "@/components/marketing/home/services-bento";
import { IndustriesRail } from "@/components/marketing/home/industries-rail";
import { MarketsPanels } from "@/components/marketing/home/markets-panels";
import { VideoProofFramework } from "@/components/marketing/home/video-proof-framework";
import { MediaCommentary } from "@/components/marketing/home/media-commentary";
import { MethodologyPhases } from "@/components/marketing/home/methodology-phases";
import { TechnologyControlRoom } from "@/components/marketing/home/technology-control-room";
import { PremiumComparison } from "@/components/marketing/home/premium-comparison";
import {
  brandExperienceStrip,
  comparisonRows,
  faqs,
  finalCta,
  growthPlays,
  heroContent,
  industries,
  markets,
  mediaCommentary,
  methodologyPhases,
  operatingSystem,
  searchHasChanged,
  servicesBento,
  technologyCapabilities,
  videoProofFramework,
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

      {/* 2. Brand experience — moving brand/partner marquee */}
      <Section background="default" className="py-14 sm:py-16">
        <BrandMarquee
          caption={brandExperienceStrip.caption}
          rowBrands={[...brandExperienceStrip.rowBrands]}
          rowCapabilities={[...brandExperienceStrip.rowCapabilities]}
        />
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

      {/* 5. Growth plays — playbook system (featured panel + rail selector) */}
      <Section background="soft" aria-labelledby="plays-title">
        <GrowthPlaybook
          eyebrow={growthPlays.eyebrow}
          title={growthPlays.title}
          titleId="plays-title"
          description={growthPlays.description}
          featured={growthPlays.featured}
          plays={[...growthPlays.plays]}
        />
      </Section>

      {/* 6. Services — asymmetric bento with content-rich feature card */}
      <Section background="default" aria-labelledby="services-title">
        <ServicesBento
          eyebrow={servicesBento.eyebrow}
          title={servicesBento.title}
          titleId="services-title"
          description={servicesBento.description}
          featureCard={servicesBento.featureCard}
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

      {/* 9. Video proof — compact premium proof framework */}
      <Section background="soft" aria-labelledby="video-proof-title">
        <VideoProofFramework
          eyebrow={videoProofFramework.eyebrow}
          title={videoProofFramework.title}
          description={videoProofFramework.description}
          slots={[...videoProofFramework.slots]}
        />
      </Section>

      {/* 10. Media & expert commentary — editorial rows */}
      <Section background="default" aria-labelledby="media-title">
        <MediaCommentary
          eyebrow={mediaCommentary.eyebrow}
          title={mediaCommentary.title}
          description={mediaCommentary.description}
          categories={[...mediaCommentary.categories]}
        />
      </Section>

      {/* 11. Methodology — 30/60/90 phased timeline */}
      <Section background="soft" aria-labelledby="methodology-title">
        <MethodologyPhases
          eyebrow={methodologyPhases.eyebrow}
          title={methodologyPhases.title}
          description={methodologyPhases.description}
          phases={[...methodologyPhases.phases]}
        />
      </Section>

      {/* 12. Technology — Search Intelligence control-room (tabbed) */}
      <Section background="default" aria-labelledby="tech-title">
        <TechnologyControlRoom
          eyebrow={technologyCapabilities.eyebrow}
          title={technologyCapabilities.title}
          description={technologyCapabilities.description}
          modules={[...technologyCapabilities.modules]}
        />
      </Section>

      {/* 13. Comparison — premium two-column contrast */}
      <Section background="soft" aria-labelledby="comparison-title">
        <PremiumComparison
          eyebrow="Why Taskcover"
          title="Traditional SEO vendor vs Taskcover Agency."
          description="Same budget, very different system. Here is where the approaches diverge."
          rows={[...comparisonRows]}
        />
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
                    Report format
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
                        <span className="text-sm font-semibold text-graphite">Scored</span>
                      </div>
                    </div>
                  ))}
                </div>
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
          <div className="flex flex-col gap-4">
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Questions, answered directly.
            </h2>
          </div>
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