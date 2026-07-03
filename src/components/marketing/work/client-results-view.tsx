import Link from "next/link";
import { ArrowRight, BarChart3, LockKeyhole, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getVerifiedPublicResults, getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import { ArchitectureDiagram, PriorityLedger, SignalMosaic } from "./work-visuals";
import { WorkStatusBadge } from "./work-status-badge";

export function ClientResultsView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const page = content.pages["client-results"];
  const records = getVerifiedPublicResults();
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="flex flex-col gap-5">
            <nav aria-label={content.ui.breadcrumb} className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href={loc("/")} className="hover:text-brand-teal">{content.ui.home}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={loc("/work")} className="hover:text-brand-teal">{content.ui.work}</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-secondary">{page.h1}</li>
              </ol>
            </nav>
            <Eyebrow>{page.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {page.h1}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">{page.intro}</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <BarChart3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold tracking-tight text-graphite">{content.clientResults.registryIntro}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <WorkStatusBadge label={content.ui.verifiedClientResult} tone="verified" />
              <WorkStatusBadge label={content.ui.measurementContext} tone="warning" />
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="results-registry">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            align="left"
            titleId="results-registry"
            eyebrow={content.ui.publicRegistry}
            title={content.ui.noPublicResultsTitle}
            description={content.ui.noPublicRegistryBody}
          />
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            {records.length > 0 ? (
              <div className="grid gap-4">
                {records.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-line bg-surface-tint p-5">
                    <h2 className="text-xl font-semibold text-graphite">{record.title}</h2>
                    <p className="mt-2 text-sm text-secondary">{record.summary}</p>
                  </article>
                ))}
              </div>
            ) : (
              <SignalMosaic items={content.clientResults.requirements} />
            )}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="measurement-requirements">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            align="left"
            titleId="measurement-requirements"
            eyebrow={content.ui.measurementContext}
            title={content.clientResults.requirements[0].label}
            description={content.clientResults.registryIntro}
          />
          <PriorityLedger rows={content.clientResults.requirements} statusLabel={content.ui.status} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="metric-context">
        <Container className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <SignalMosaic items={content.clientResults.metricContext} />
          <div className="flex flex-col justify-center gap-5">
            <ShieldCheck className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="metric-context" className="text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.measurementContext}
            </h2>
            <p className="text-secondary">{content.clientResults.registryIntro}</p>
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="attribution-limitations">
        <Container className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <BarChart3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="attribution-limitations" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.clientResults.requirements[3].label}
            </h2>
          </div>
          <div className="grid gap-3">
            {content.clientResults.attribution.map((item) => (
              <p key={item} className="rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-secondary">
                {item}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="confidential-results">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <LockKeyhole className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="confidential-results" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.confidentialEngagement}
            </h2>
          </div>
          <SignalMosaic items={content.clientResults.confidential} />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="results-methodology">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ArchitectureDiagram title={content.pages["search-growth-frameworks"].h1} items={content.clientResults.methodology} />
          <SectionHeader
            align="left"
            titleId="results-methodology"
            eyebrow={content.ui.method}
            title={content.clientResults.methodology[0].label}
            description={content.pages["search-growth-frameworks"].intro}
          />
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-graphite">{content.clientResults.cta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.clientResults.cta.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <CTAButton href={loc("/free-seo-audit")}>{content.ui.getAudit}</CTAButton>
                <CTAButton variant="secondary" href={loc("/book-a-call")}>
                  {content.ui.bookCall}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
