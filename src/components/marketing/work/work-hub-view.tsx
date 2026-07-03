import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import {
  CommandCenterVisual,
  DossierStackVisual,
  EvidenceMatrixVisual,
  ExecutionFlowVisual,
  OperatingMapVisual,
} from "./work-visuals";
import { WorkStatusBadge } from "./work-status-badge";

function WorkBreadcrumb({ locale, home, work }: { locale: Locale; home: string; work: string }) {
  return (
    <nav aria-label={work} className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href={localizePath("/", locale)} className="hover:text-brand-teal">
            {home}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-secondary">
          {work}
        </li>
      </ol>
    </nav>
  );
}

export function WorkHubView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col gap-6">
            <WorkBreadcrumb locale={locale} home={content.ui.home} work={content.ui.work} />
            <Eyebrow>{content.hub.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.hub.h1}
            </h1>
            <p className="max-w-xl text-base font-medium leading-relaxed text-graphite sm:text-lg">
              {content.hub.intro}
            </p>
            <div className="flex flex-wrap gap-2">
              <WorkStatusBadge label={content.ui.illustrativeSample} tone="sample" />
              <WorkStatusBadge label={content.ui.verifiedCaseStudy} tone="verified" />
              <WorkStatusBadge label={content.ui.confidentialEngagement} tone="private" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={loc("/free-seo-audit")}>
                {content.ui.getAudit}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                {content.ui.bookCall}
              </CTAButton>
            </div>
          </div>
          <CommandCenterVisual steps={content.hub.command} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="work-system-map">
        <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <SectionHeader
            align="left"
            eyebrow={content.ui.work}
            titleId="work-system-map"
            title={content.hub.systemMap[0].connectsTo}
            description={content.hub.systemMap.map((item) => item.label).join(" · ")}
          />
          <OperatingMapVisual items={content.hub.systemMap} />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="sample-preview">
        <Container className="flex flex-col gap-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <Eyebrow>{content.pages["sample-audits"].eyebrow}</Eyebrow>
              <h2 id="sample-preview" className="mt-4 text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                {content.pages["sample-audits"].h1}
              </h2>
              <p className="mt-4 max-w-xl text-secondary">{content.pages["sample-audits"].intro}</p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {content.sampleAuditLinks.slice(0, 4).map((item, index) => (
                  <Link
                    key={item.href}
                    href={loc(item.href)}
                    className="group rounded-2xl border border-line-soft bg-surface-tint p-4 transition-colors hover:border-brand-teal/40"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-teal">
                      {index + 1}
                    </span>
                    <p className="mt-4 text-sm font-semibold text-graphite group-hover:text-brand-teal">
                      {item.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <DossierStackVisual items={content.sampleAuditLinks} ctaLabel={content.ui.viewSample} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="work-action-flow">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.pages["search-growth-frameworks"].eyebrow}
            titleId="work-action-flow"
            title={content.pages["search-growth-frameworks"].h1}
            description={content.pages["search-growth-frameworks"].intro}
          />
          <ExecutionFlowVisual steps={content.hub.actionFlow} />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="evidence-publication">
        <Container className="flex flex-col gap-10">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <Eyebrow>{content.ui.evidenceRequired}</Eyebrow>
              <h2 id="evidence-publication" className="mt-4 text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                {content.pages["client-results"].h1}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-secondary">
              {content.pages["client-results"].intro}
            </p>
          </div>
          <EvidenceMatrixVisual items={content.hub.evidenceMatrix} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="explore-work">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
              <div className="border-b border-line-soft bg-surface-tint p-7 lg:border-b-0 lg:border-r">
                <FileText className="h-10 w-10 text-brand-teal" aria-hidden="true" />
                <h2 id="explore-work" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
                  {content.ui.explore}
                </h2>
              </div>
              <div className="grid divide-line-soft md:grid-cols-2 md:divide-x">
                {content.channelLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={loc(item.href)}
                    className="group flex min-h-44 flex-col justify-between border-b border-line-soft p-6 transition-colors hover:bg-surface-tint md:[&:nth-child(n+3)]:border-b-0"
                  >
                    <div>
                      <p className="text-lg font-semibold text-graphite group-hover:text-brand-teal">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{item.description}</p>
                    </div>
                    <ArrowRight className="mt-5 h-5 w-5 text-brand-teal transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <Eyebrow>{content.ui.getAudit}</Eyebrow>
                <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {content.hub.cta.title}
                </h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.hub.cta.description}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <CTAButton href={loc("/free-seo-audit")}>
                    {content.ui.getAudit}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <CTAButton variant="secondary" href={loc("/book-a-call")}>
                    {content.ui.bookCall}
                  </CTAButton>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.hub.cta.preview.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-surface-tint p-4">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                    <span className="text-sm font-semibold text-graphite">{item}</span>
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
