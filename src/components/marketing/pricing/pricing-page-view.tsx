import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  Layers3,
  Sparkles,
  X,
} from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { PricingTabs } from "./pricing-tabs";
import { PricingDecisionGuide } from "./pricing-decision-guide";
import { getPricingContent, getCaseStudies } from "@/lib/content";
import { getPublicClientLogoAssetByCaseStudySlug } from "@/content/client-logo-assets";
import { localizePath, type Locale } from "@/lib/i18n";
import type { CaseStudySlug } from "@/content/work.types";

export function PricingPageView({ locale }: { locale: Locale }) {
  const content = getPricingContent(locale);
  const caseStudies = getCaseStudies(locale);
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-80" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li className="inline-flex items-center gap-1.5">
                  <Link href={loc("/")} className="transition-colors hover:text-brand-teal">
                    {content.breadcrumbs.home}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li>
                  <span aria-current="page" className="text-secondary">
                    {content.breadcrumbs.pricing}
                  </span>
                </li>
              </ol>
            </nav>
            <Eyebrow>{content.hero.eyebrow}</Eyebrow>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.hero.h1}
            </h1>
            <p className="max-w-2xl text-pretty text-base font-medium text-graphite sm:text-lg">
              {content.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.hero.signalChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-brand-teal/20 bg-white px-3 py-1 text-xs font-semibold text-brand-teal"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={loc(content.hero.primaryCta.href)}>
                {content.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={loc(content.hero.secondaryCta.href)}>
                {content.hero.secondaryCta.label}
              </CTAButton>
            </div>
            <p className="max-w-2xl rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-relaxed text-secondary shadow-sm">
              {content.recurringNote}
            </p>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft blur-2xl" />
            <aside className="relative overflow-hidden rounded-3xl border border-line bg-white p-5 depth-layered">
              <div className="flex items-center justify-between gap-4 border-b border-line-soft pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                    {content.hero.commandPanel.title}
                  </p>
                  <p className="mt-1 text-sm text-secondary">{content.hero.commandPanel.note}</p>
                </div>
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                  <CircleDollarSign className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="grid gap-3 py-5">
                {content.hero.commandPanel.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[0.82fr_1.18fr] gap-3 rounded-2xl border border-line-soft bg-surface-tint/60 px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {row.label}
                    </span>
                    <span className="text-sm font-semibold text-graphite">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Local", "National", "Global"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-line bg-white p-3 text-center">
                    <div className="mx-auto h-2 rounded-full bg-brand-gradient" style={{ width: `${56 + index * 14}%` }} />
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="pricing-factors-title">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            align="left"
            eyebrow={content.factors.eyebrow}
            titleId="pricing-factors-title"
            title={content.factors.title}
            description={content.factors.description}
          />
          <div className="grid gap-3">
            {content.factors.items.map((factor, index) => (
              <div
                key={factor.label}
                className="grid gap-3 rounded-2xl border border-line bg-surface-tint/50 p-4 sm:grid-cols-[44px_1fr]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-graphite">{factor.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-secondary">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="pricing-tabs-title">
        <PricingTabs content={content} locale={locale} />
      </Section>

      <Section background="default" aria-labelledby="compare-all-plans">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.comparison.eyebrow}
            titleId="compare-all-plans"
            title={content.comparison.title}
            description={content.comparison.description}
          />
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[980px] border-collapse">
              <caption className="sr-only">{content.comparison.title}</caption>
              <thead>
                <tr className="border-b border-line bg-surface-tint">
                  <th scope="col" className="sticky left-0 z-10 bg-surface-tint px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                    {content.ui.compareRowHeader}
                  </th>
                  {content.comparison.columns.map((column) => (
                    <th key={column.id} scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparison.rows.map((row, index) => (
                  <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-surface-soft/50"}>
                    <th scope="row" className="sticky left-0 z-10 border-t border-line-soft bg-inherit px-4 py-3 text-left text-sm font-semibold text-graphite">
                      {row.label}
                    </th>
                    {content.comparison.columns.map((column) => (
                      <td key={column.id} className="border-t border-line-soft px-4 py-3 text-sm leading-relaxed text-secondary">
                        {row.values[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-brand-teal/20 bg-surface-tint px-5 py-4 text-sm font-medium leading-relaxed text-graphite">
            {content.comparison.exactPricingNote}
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="decision-guide-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.decisionGuide.eyebrow}
            titleId="decision-guide-title"
            title={content.decisionGuide.title}
            description={content.decisionGuide.description}
          />
          <PricingDecisionGuide content={content} locale={locale} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="pricing-drivers-title">
        <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            align="left"
            eyebrow={content.drivers.eyebrow}
            titleId="pricing-drivers-title"
            title={content.drivers.title}
            description={content.drivers.description}
          />
          <div className="grid gap-3">
            {content.drivers.items.map((driver, index) => (
              <details key={driver.label} className="group rounded-2xl border border-line bg-white p-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-graphite">
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-surface-tint text-xs font-bold text-brand-teal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {driver.label}
                  </span>
                  <ChevronDown className="h-4 w-4 text-brand-teal transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pl-11 pt-2 text-sm leading-relaxed text-secondary">{driver.description}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="included-excluded-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.includedExcluded.eyebrow}
            titleId="included-excluded-title"
            title={content.includedExcluded.title}
            description={content.includedExcluded.description}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-brand-teal/20 bg-white p-6 depth-layered">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                <Check className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-graphite">{content.includedExcluded.includedTitle}</h3>
              <ul className="mt-5 grid gap-2">
                {content.includedExcluded.included.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-tint text-muted">
                <X className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-graphite">{content.includedExcluded.excludedTitle}</h3>
              <ul className="mt-5 grid gap-2">
                {content.includedExcluded.excluded.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-secondary">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="custom-pricing-title">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 depth-layered sm:p-8 lg:p-10">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col gap-5">
                <Eyebrow>{content.customScope.eyebrow}</Eyebrow>
                <h2 id="custom-pricing-title" className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {content.customScope.title}
                </h2>
                <p className="text-sm leading-relaxed text-secondary sm:text-base">{content.customScope.description}</p>
                <p className="rounded-2xl border border-brand-teal/20 bg-surface-tint px-4 py-3 text-sm font-medium text-graphite">
                  {content.customScope.note}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <CTAButton href={loc(content.customScope.primaryCta.href)} size="lg">
                    {content.customScope.primaryCta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <CTAButton href={loc(content.customScope.secondaryCta.href)} variant="secondary" size="lg">
                    {content.customScope.secondaryCta.label}
                  </CTAButton>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.customScope.useCases.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-surface-tint/50 p-4 text-sm font-semibold text-graphite">
                    <Layers3 className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="pricing-proof-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.proof.eyebrow}
            titleId="pricing-proof-title"
            title={content.proof.title}
            description={content.proof.description}
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {content.proof.groups.flatMap((group) =>
              group.caseStudySlugs.map((slug) => {
                const caseStudy = caseStudies.find((item) => item.slug === slug);
                if (!caseStudy) return null;
                const logo = getPublicClientLogoAssetByCaseStudySlug(slug as CaseStudySlug);
                return (
                  <Link
                    key={`${group.label}-${slug}`}
                    href={loc(`/work/case-studies/${caseStudy.slug}`)}
                    className="card-lift flex min-w-[280px] max-w-[320px] flex-col gap-4 rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40 sm:min-w-[320px]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-brand-teal/20 bg-surface-tint px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                        {group.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                    </div>
                    {logo ? (
                      <div className="flex h-20 items-center justify-center overflow-hidden rounded-2xl border border-line-soft bg-surface-soft p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.logoPath} alt={logo.alt} className="max-h-full w-auto object-contain" />
                      </div>
                    ) : null}
                    <div>
                      <h3 className="text-base font-semibold text-graphite">{caseStudy.shortName}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">
                        {caseStudy.summary}
                      </p>
                    </div>
                    <div className="mt-auto grid gap-1.5">
                      {caseStudy.metrics.slice(0, 2).map((metric) => (
                        <p key={metric.id} className="text-xs text-secondary">
                          <span className="font-semibold text-graphite">{metric.label}:</span> {metric.value}
                        </p>
                      ))}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          <CTAButton href={loc(content.proof.cta.href)} variant="secondary" size="md" className="w-fit">
            {content.proof.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="pricing-faq-title">
        <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            align="left"
            eyebrow={content.faq.eyebrow}
            titleId="pricing-faq-title"
            title={content.faq.title}
          />
          <FAQAccordion items={content.faq.items.map((item) => ({ q: item.q, a: item.a }))} />
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 text-center depth-layered sm:p-12">
            <div aria-hidden="true" className="absolute inset-x-10 -top-24 h-56 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5">
              <Eyebrow>{content.finalCta.eyebrow}</Eyebrow>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                {content.finalCta.title}
              </h2>
              <p className="text-pretty text-base leading-relaxed text-secondary sm:text-lg">
                {content.finalCta.description}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton href={loc(content.finalCta.primaryCta.href)} size="lg">
                  {content.finalCta.primaryCta.label}
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton href={loc(content.finalCta.secondaryCta.href)} variant="secondary" size="lg">
                  {content.finalCta.secondaryCta.label}
                </CTAButton>
              </div>
              <p className="inline-flex items-center gap-2 text-xs text-muted">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                {content.recurringNote}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
