import Link from "next/link";
import { ArrowRight, ClipboardList, FileCheck2, GitBranch, HelpCircle, Layers3, Route } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getSampleAuditBySlug, getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import type { SampleAuditSlug } from "@/content/work.types";
import { IllustrativeDisclosure } from "./illustrative-disclosure";
import { ArchitectureDiagram, PriorityLedger, SignalMosaic } from "./work-visuals";
import { WorkStatusBadge } from "./work-status-badge";

export function SampleAuditTemplate({
  slug,
  locale,
}: {
  slug: SampleAuditSlug;
  locale: Locale;
}) {
  const content = getWorkContent(locale);
  const sample = getSampleAuditBySlug(slug, locale);
  if (!sample) return null;
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col gap-5">
            <nav aria-label={content.ui.breadcrumb} className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href={loc("/")} className="hover:text-brand-teal">{content.ui.home}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={loc("/work")} className="hover:text-brand-teal">{content.ui.work}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={loc("/work/sample-audits")} className="hover:text-brand-teal">{content.pages["sample-audits"].h1}</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-secondary">{sample.title}</li>
              </ol>
            </nav>
            <Eyebrow>{sample.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-[3.3rem]">
              {sample.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
              {sample.focus}
            </p>
            <IllustrativeDisclosure label={content.ui.disclosureLabel} text={sample.disclosureText ?? content.sampleAudits.disclosureBody} />
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <WorkStatusBadge label={content.ui.illustrativeSample} tone="sample" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-graphite">{sample.visualStyle}</h2>
            <div className="mt-6 grid gap-3">
              {sample.method.map((step, index) => (
                <div key={step.label} className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl border border-line-soft bg-surface-tint p-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-brand-teal">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-graphite">{step.label}</p>
                    <p className="text-xs text-secondary">{step.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="deliverable-answers">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <HelpCircle className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="deliverable-answers" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {sample.buyerQuestion}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sample.answers.map((answer) => (
              <div key={answer} className="rounded-2xl border border-line bg-white p-5 text-sm font-semibold text-graphite shadow-sm">
                {answer}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="data-inputs">
        <Container className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ArchitectureDiagram title={content.ui.input} items={sample.inputs} />
          <SectionHeader
            align="left"
            titleId="data-inputs"
            eyebrow={content.ui.input}
            title={sample.visualStyle}
            description={sample.focus}
          />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="analysis-method">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            titleId="analysis-method"
            eyebrow={content.ui.method}
            title={content.ui.method}
          />
          <div className="grid gap-3 md:grid-cols-4">
            {sample.method.map((step, index) => (
              <div key={step.label} className="rounded-2xl border border-line bg-white p-5">
                <GitBranch className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                <p className="mt-5 text-sm font-semibold text-graphite">{step.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-secondary">{step.detail}</p>
                <p className="mt-4 text-xs font-semibold text-brand-teal">{index + 1}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="findings-structure">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <ClipboardList className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="findings-structure" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.status}
            </h2>
          </div>
          <PriorityLedger rows={sample.findings} statusLabel={content.ui.status} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="prioritization-system">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <SignalMosaic items={sample.priority} />
          <div className="flex flex-col justify-center gap-4">
            <Layers3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="prioritization-system" className="text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.priority}
            </h2>
            <p className="text-secondary">{sample.priority[0]?.detail}</p>
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="output-preview">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            align="left"
            titleId="output-preview"
            eyebrow={content.ui.output}
            title={content.ui.output}
            description={sample.disclosureText}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {sample.outputPreview.map((item) => (
              <div key={item.label} className="rounded-3xl border border-line bg-white p-5 depth-layered">
                <FileCheck2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold text-graphite">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-secondary">{item.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="roadmap-translation">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ArchitectureDiagram title={content.pages["search-growth-frameworks"].h1} items={sample.roadmap} />
          <div className="flex flex-col justify-center gap-5">
            <Route className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="roadmap-translation" className="text-3xl font-semibold tracking-tight text-graphite">
              {content.pages["search-growth-frameworks"].h1}
            </h2>
            <p className="text-secondary">{content.pages["search-growth-frameworks"].intro}</p>
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="related-context">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 id="related-context" className="text-2xl font-semibold tracking-tight text-graphite">{content.ui.relatedServices}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {sample.relatedServices.map((item) => (
                <span key={item} className="rounded-full border border-line bg-surface-tint px-3 py-2 text-sm font-semibold text-secondary">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-graphite">{content.ui.relatedIndustries}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {sample.relatedIndustries.map((item) => (
                <span key={item} className="rounded-full border border-line bg-surface-tint px-3 py-2 text-sm font-semibold text-secondary">{item}</span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="sample-faq">
        <Container className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <HelpCircle className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="sample-faq" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {sample.faq[0]?.q}
            </h2>
          </div>
          <div className="grid gap-3">
            {sample.faq.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-semibold text-graphite">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-graphite">{content.sampleAudits.cta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.sampleAudits.cta.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <CTAButton href={loc("/free-seo-audit")}>
                  {content.ui.getAudit}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" href={loc("/book-a-call")}>{content.ui.bookCall}</CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
