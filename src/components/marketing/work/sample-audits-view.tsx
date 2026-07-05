"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Columns3, FileSearch, Rows3 } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { IllustrativeDisclosure } from "./illustrative-disclosure";
import { PriorityLedger, SignalMosaic } from "./work-visuals";
import { WorkStatusBadge } from "./work-status-badge";

export function SampleAuditsView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const samples = Object.values(content.samples);
  const [activeSlug, setActiveSlug] = React.useState(samples[0].slug);
  const active = content.samples[activeSlug];
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            <nav aria-label={content.ui.breadcrumb} className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href={loc("/")} className="hover:text-brand-teal">{content.ui.home}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={loc("/work")} className="hover:text-brand-teal">{content.ui.work}</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-secondary">{content.pages["sample-audits"].h1}</li>
              </ol>
            </nav>
            <Eyebrow>{content.pages["sample-audits"].eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.pages["sample-audits"].h1}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
              {content.pages["sample-audits"].intro}
            </p>
            <IllustrativeDisclosure label={content.ui.disclosureLabel} text={content.sampleAudits.disclosureBody} />
          </div>
          <div className="min-w-0 overflow-hidden rounded-3xl border border-line bg-white p-4 depth-layered sm:p-5">
            <div className="flex max-w-full gap-3 overflow-x-auto scroll-px-2 pb-2" role="tablist" aria-label={content.pages["sample-audits"].h1}>
              {samples.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={active.slug === item.slug}
                  aria-controls="sample-audit-preview"
                  onClick={() => setActiveSlug(item.slug)}
                  className={cn(
                    "min-h-24 w-[9.5rem] shrink-0 rounded-2xl border p-4 text-left transition-colors sm:w-44",
                    active.slug === item.slug
                      ? "border-brand-teal bg-surface-tint text-graphite"
                      : "border-line bg-white text-secondary hover:border-brand-teal/40"
                  )}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-teal">
                    {index + 1}
                  </span>
                  <span className="mt-3 block text-sm font-semibold">{item.shortLabel}</span>
                </button>
              ))}
            </div>
            <div id="sample-audit-preview" role="tabpanel" className="mt-5 min-w-0 rounded-3xl border border-line-soft bg-surface-tint p-4 sm:p-5">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <WorkStatusBadge label={content.ui.illustrativeSample} tone="sample" />
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-graphite">{active.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{active.focus}</p>
                </div>
                <FileSearch className="h-10 w-10 shrink-0 text-brand-teal" aria-hidden="true" />
              </div>
              <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
                {active.answers.slice(0, 4).map((answer) => (
                  <div key={answer} className="min-w-0 rounded-2xl border border-line bg-white p-4 text-sm font-semibold leading-6 text-graphite">
                    {answer}
                  </div>
                ))}
              </div>
              <CTAButton className="mt-5" href={loc(`/work/sample-audits/${active.slug}`)}>
                {content.ui.viewSample}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="audit-type-comparison">
        <Container className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <SectionHeader
            align="left"
            eyebrow={content.ui.method}
            titleId="audit-type-comparison"
            title={content.sampleAudits.selectorIntro}
          />
          <div className="max-w-full overflow-x-auto rounded-3xl border border-line bg-white depth-layered">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-surface-tint text-xs uppercase text-muted">
                <tr>
                  <th className="px-5 py-4 font-semibold">{content.ui.work}</th>
                  <th className="px-5 py-4 font-semibold">{content.ui.method}</th>
                  <th className="px-5 py-4 font-semibold">{content.ui.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {content.sampleAudits.comparison.map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-4 font-semibold text-graphite">{row.label}</td>
                    <td className="px-5 py-4 text-sm text-secondary">{row.detail}</td>
                    <td className="px-5 py-4"><WorkStatusBadge label={row.status ?? ""} tone="warning" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="every-audit">
        <Container className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 rounded-3xl border border-line bg-white p-6 depth-layered">
            <Columns3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="every-audit" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.sampleAudits.everyAudit[0]}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.sampleAudits.everyAudit.map((item) => (
                <span key={item} className="rounded-full border border-line bg-surface-tint px-3 py-2 text-sm font-semibold text-secondary">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <PriorityLedger rows={content.sampleAudits.priorityFlow} statusLabel={content.ui.priority} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="findings-to-priority">
        <Container className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SignalMosaic items={active.priority} />
          <div className="flex flex-col justify-center gap-5">
            <Rows3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="findings-to-priority" className="text-3xl font-semibold tracking-tight text-graphite">
              {active.buyerQuestion}
            </h2>
            <p className="text-secondary">{active.focus}</p>
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="illustrative-disclosure">
        <Container className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <Eyebrow>{content.ui.disclosureLabel}</Eyebrow>
            <h2 id="illustrative-disclosure" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">
              {content.sampleAudits.disclosureTitle}
            </h2>
          </div>
          <IllustrativeDisclosure label={content.ui.disclosureLabel} text={content.sampleAudits.disclosureBody} />
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-graphite">{content.sampleAudits.cta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.sampleAudits.cta.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
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
