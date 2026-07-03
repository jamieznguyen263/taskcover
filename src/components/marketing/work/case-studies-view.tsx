import Link from "next/link";
import { ArrowRight, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getPublicCaseStudies, getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import { PriorityLedger, SignalMosaic } from "./work-visuals";
import { WorkStatusBadge } from "./work-status-badge";

export function CaseStudiesView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const page = content.pages["case-studies"];
  const records = getPublicCaseStudies();
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
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
            <ShieldCheck className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold tracking-tight text-graphite">{content.caseStudies.registryIntro}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <WorkStatusBadge label={content.ui.verifiedCaseStudy} tone="verified" />
              <WorkStatusBadge label={content.ui.evidenceRequired} tone="warning" />
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="case-study-registry">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            align="left"
            titleId="case-study-registry"
            eyebrow={content.ui.publicRegistry}
            title={content.ui.noPublicCaseStudiesTitle}
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
              <div className="grid gap-4 sm:grid-cols-2">
                {content.caseStudies.requiredEvidence.map((item) => (
                  <div key={item} className="rounded-2xl border border-line-soft bg-surface-tint p-4">
                    <FileCheck2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold text-graphite">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="case-verification">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            titleId="case-verification"
            eyebrow={content.ui.evidenceRequired}
            title={content.pages["case-studies"].h1}
            description={content.caseStudies.registryIntro}
          />
          <PriorityLedger rows={content.caseStudies.verification} statusLabel={content.ui.status} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="case-structure">
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <SignalMosaic items={content.caseStudies.structure} />
          <div className="flex flex-col justify-center gap-4">
            <ShieldCheck className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="case-structure" className="text-3xl font-semibold tracking-tight text-graphite">
              {content.caseStudies.structure[0].label}
            </h2>
            <p className="text-secondary">{content.caseStudies.structure.map((item) => item.label).join(" · ")}</p>
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="confidential-handling">
        <Container className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-3xl border border-line bg-white p-6">
            <LockKeyhole className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="confidential-handling" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.confidentialEngagement}
            </h2>
          </div>
          <SignalMosaic items={content.caseStudies.confidential} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="related-sample-deliverables">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            align="left"
            titleId="related-sample-deliverables"
            eyebrow={content.ui.relatedSamples}
            title={content.pages["sample-audits"].h1}
            description={content.pages["sample-audits"].intro}
          />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {content.sampleAuditLinks.map((item) => (
              <Link key={item.href} href={loc(item.href)} className="card-lift min-h-48 w-64 shrink-0 rounded-3xl border border-line bg-white p-5">
                <p className="text-sm font-semibold text-graphite">{item.label}</p>
                <p className="mt-3 text-xs leading-relaxed text-secondary">{item.description}</p>
                <ArrowRight className="mt-5 h-4 w-4 text-brand-teal" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-graphite">{content.caseStudies.cta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.caseStudies.cta.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <CTAButton href={loc("/free-seo-audit")}>{content.ui.getAudit}</CTAButton>
                <CTAButton variant="secondary" href={loc("/book-a-call")}>{content.ui.bookCall}</CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
