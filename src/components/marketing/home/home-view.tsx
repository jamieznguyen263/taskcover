/**
 * Shared homepage view — renders from localized HomeContent.
 *
 * Used by:
 *  - app/page.tsx               (English, unprefixed)
 *  - app/[locale]/page.tsx       (fr / es)
 *
 * Task 4B: all homepage sections are fully localized via the `home` prop,
 * including deep arrays (operating-system steps, growth plays, services
 * bento, industries, markets, methodology, technology, media, video proof,
 * comparison rows, brand strip) and component-level UI labels.
 */

import { ArrowRight, CheckCircle2, ClipboardCheck, FileSearch, Globe2, Sparkles } from "lucide-react";
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
import type { HomeContent } from "@/content/home.types";

export function HomeView({ home }: { home: HomeContent }) {
  return (
    <>
      {/* 1. Hero — split layout with floating layered dashboard */}
      <Section background="tint" className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{home.hero.eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {home.hero.headline}
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-secondary sm:text-lg">
              {home.hero.subheadline}
            </p>
            <p className="max-w-xl text-sm text-muted">{home.hero.proofLine}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={home.hero.primaryCta.href}>
                {home.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={home.hero.secondaryCta.href}>
                {home.hero.secondaryCta.label}
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
          caption={home.brandExperience.caption}
          rowBrands={[...home.brandExperience.rowBrands]}
          rowCapabilities={[...home.brandExperience.rowCapabilities]}
        />
      </Section>

      {/* 3. Search has changed — interactive ecosystem network map */}
      <Section background="soft" aria-labelledby="search-changed-title">
        <SearchEcosystemMap
          eyebrow={home.searchHasChanged.eyebrow}
          title={home.searchHasChanged.title}
          titleId="search-changed-title"
          description={home.searchHasChanged.description}
          message={home.searchHasChanged.message}
        />
      </Section>

      {/* 4. Operating system — connected horizontal pipeline */}
      <Section background="default" aria-labelledby="os-title">
        <OperatingSystemPipeline
          eyebrow={home.operatingSystem.eyebrow}
          title={home.operatingSystem.title}
          titleId="os-title"
          description={home.operatingSystem.description}
          steps={[...home.operatingSystem.steps]}
          labels={{
            stage: home.ui.osStageLabel,
            input: home.ui.osInputLabel,
            action: home.ui.osActionLabel,
            output: home.ui.osOutputLabel,
            loop: home.ui.osLoopLabel,
            compound: home.ui.osCompoundLabel,
          }}
        />
      </Section>

      {/* 5. Growth plays — playbook system (featured panel + rail selector) */}
      <Section background="soft" aria-labelledby="plays-title">
        <GrowthPlaybook
          eyebrow={home.growthPlays.eyebrow}
          title={home.growthPlays.title}
          titleId="plays-title"
          description={home.growthPlays.description}
          featured={home.growthPlays.featured}
          plays={[...home.growthPlays.plays]}
          labels={{
            featuredPlay: home.ui.featuredPlay,
            challenge: home.ui.challengeLabel,
            strategy: home.ui.strategyLabel,
            output: home.ui.outputLabel,
            connectedToSystem: home.ui.connectedToSystem,
          }}
        />
      </Section>

      {/* 6. Services — asymmetric bento with content-rich feature card */}
      <Section background="default" aria-labelledby="services-title">
        <ServicesBento
          eyebrow={home.servicesBento.eyebrow}
          title={home.servicesBento.title}
          titleId="services-title"
          description={home.servicesBento.description}
          featureCard={home.servicesBento.featureCard}
          cards={[...home.servicesBento.cards]}
          labels={{
            coreModule: home.ui.coreModule,
            roadmap: home.ui.roadmapLabel,
            businessOutcome: home.ui.businessOutcome,
            explore: home.ui.explore,
          }}
        />
      </Section>

      {/* 7. Industries — tabbed sector rail with detail preview */}
      <Section background="soft" aria-labelledby="industries-title">
        <IndustriesRail
          eyebrow={home.industries.eyebrow}
          title={home.industries.title}
          titleId="industries-title"
          description={home.industries.description}
          industries={[...home.industries.cards]}
          labels={{
            activeVertical: home.ui.activeVertical,
            painPoint: home.ui.painPoint,
            opportunity: home.ui.opportunityLabel,
            taskcoverSolution: home.ui.taskcoverSolution,
            intentPattern: home.ui.intentPattern,
            trustSignals: home.ui.trustSignals,
            recommendedServices: home.ui.recommendedServices,
            view: home.ui.viewIndustry,
          }}
        />
      </Section>

      {/* 8. Markets — regional panels with map-dot accent headers */}
      <Section background="default" aria-labelledby="markets-title">
        <MarketsPanels
          eyebrow={home.markets.eyebrow}
          title={home.markets.title}
          titleId="markets-title"
          description={home.markets.description}
          markets={[...home.markets.cards]}
        />
      </Section>

      {/* 9. Video proof — compact premium proof framework */}
      <Section background="soft" aria-labelledby="video-proof-title">
        <VideoProofFramework
          eyebrow={home.videoProof.eyebrow}
          title={home.videoProof.title}
          description={home.videoProof.description}
          slots={[...home.videoProof.slots]}
        />
      </Section>

      {/* 10. Media & expert commentary — editorial rows */}
      <Section background="default" aria-labelledby="media-title">
        <MediaCommentary
          eyebrow={home.mediaCommentary.eyebrow}
          title={home.mediaCommentary.title}
          description={home.mediaCommentary.description}
          categories={[...home.mediaCommentary.categories]}
        />
      </Section>

      {/* 11. Methodology — 30/60/90 phased timeline */}
      <Section background="soft" aria-labelledby="methodology-title">
        <MethodologyPhases
          eyebrow={home.methodology.eyebrow}
          title={home.methodology.title}
          description={home.methodology.description}
          phases={[...home.methodology.phases]}
        />
      </Section>

      {/* 12. Technology — Search Intelligence control-room (tabbed) */}
      <Section background="default" aria-labelledby="tech-title">
        <TechnologyControlRoom
          eyebrow={home.technology.eyebrow}
          title={home.technology.title}
          description={home.technology.description}
          modules={[...home.technology.modules]}
        />
      </Section>

      {/* 13. Comparison — premium two-column contrast */}
      <Section background="soft" aria-labelledby="comparison-title">
        <PremiumComparison
          eyebrow={home.comparison.eyebrow}
          title={home.comparison.title}
          description={home.comparison.description}
          rows={[...home.comparison.rows]}
          labels={{
            traditional: home.ui.traditionalLabel,
            taskcover: home.ui.taskcoverLabel,
          }}
        />
      </Section>

      {/* 14. Free audit CTA — audit report preview layout */}
      <Section background="default" aria-labelledby="audit-title">
        <Container>
          <GradientBorderCard className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              {/* Left: value proposition + checklist */}
              <div className="flex flex-col gap-4">
                <Eyebrow>{home.audit.eyebrow}</Eyebrow>
                <h2 id="audit-title" className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {home.audit.title}
                </h2>
                <p className="max-w-xl text-secondary">
                  {home.audit.description}
                </p>
                <ul className="grid grid-cols-1 gap-2 pt-2 text-sm text-secondary sm:grid-cols-2">
                  {home.audit.checklist.map((item) => (
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
                    {home.audit.eyebrow}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-muted">
                    <Sparkles className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                    {home.audit.eyebrow}
                  </span>
                </div>
                {/* Mini scorecards */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: home.ui.auditTechnical, icon: ClipboardCheck },
                    { label: home.ui.auditAiReady, icon: Sparkles },
                    { label: home.ui.auditContent, icon: FileSearch },
                    { label: home.ui.auditAuthority, icon: Globe2 },
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
                        <span className="text-sm font-semibold text-graphite">{home.ui.auditScored}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <CTAButton size="lg" href={home.audit.primaryCta.href} className="mt-1 w-full">
                  {home.audit.primaryCta.label}
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
            <Eyebrow>{home.faq.eyebrow}</Eyebrow>
            <h2 id="faq-title" className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {home.faq.title}
            </h2>
          </div>
          <FAQAccordion items={[...home.faq.items]} />
        </Container>
      </Section>

      {/* 16. Final CTA */}
      <Section background="default">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-tint p-8 sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative flex flex-col items-start gap-6">
              <Eyebrow>{home.finalCta.eyebrow}</Eyebrow>
              <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {home.finalCta.title}
              </h2>
              <p className="max-w-2xl text-secondary">{home.finalCta.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton size="lg" href={home.finalCta.primaryCta.href}>
                  {home.finalCta.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href={home.finalCta.secondaryCta.href}>
                  {home.finalCta.secondaryCta.label}
                </CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}