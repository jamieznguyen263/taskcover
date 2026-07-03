import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Compass, FileCheck2, Layers3, LineChart, ShieldCheck, Target } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getCaseStudyBySlug, getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import type { CaseStudySlug } from "@/content/work.types";

function CompactRail({ title, items, hrefBase, locale }: { title: string; items: string[]; hrefBase: string; locale: Locale }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item}
            href={localizePath(`${hrefBase}/${item}`, locale)}
            className="min-h-10 rounded-full border border-line-soft bg-surface-tint px-3 py-2 text-xs font-semibold text-graphite transition hover:border-brand-teal hover:text-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyTemplate({ slug, locale }: { slug: CaseStudySlug; locale: Locale }) {
  const content = getWorkContent(locale);
  const item = getCaseStudyBySlug(slug, locale);
  if (!item) return null;
  const loc = (path: string) => localizePath(path, locale);
  const heroImage = item.visualGallery[0];

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="grid gap-5">
            <nav aria-label={content.ui.breadcrumb} className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href={loc("/")} className="hover:text-brand-teal">{content.ui.home}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={loc("/work")} className="hover:text-brand-teal">{content.ui.work}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={loc("/work/case-studies")} className="hover:text-brand-teal">{content.pages["case-studies"].h1}</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-secondary">{item.clientName}</li>
              </ol>
            </nav>
            <Eyebrow>{item.eyebrow}</Eyebrow>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {item.h1}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">{item.heroSummary}</p>
            <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-3">
              {[item.clientName, item.industry ?? item.industrySlug, item.engagementPeriod].map((value, index) => (
                <div key={`${value}-${index}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{index === 0 ? content.ui.client : index === 1 ? content.ui.focus : content.ui.period}</p>
                  <p className="mt-1 text-sm font-semibold text-graphite">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-soft">
            <Image src={heroImage.src} alt={heroImage.alt} width={heroImage.width} height={heroImage.height} priority className="aspect-[4/3] w-full rounded-2xl object-cover" />
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="case-overview">
        <Container className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-3xl border border-line bg-surface-tint p-6">
            <FileCheck2 className="h-9 w-9 text-brand-teal" aria-hidden="true" />
            <h2 id="case-overview" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{content.ui.overview}</h2>
            <p className="mt-4 text-sm leading-relaxed text-secondary">{item.overview}</p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-graphite">{content.ui.clientBackground}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{item.clientBackground}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-graphite">{content.ui.startingPoint}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{item.startingPoint}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="case-challenge">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <Compass className="h-8 w-8 text-brand-teal" aria-hidden="true" />
              <h2 id="case-challenge" className="text-3xl font-semibold tracking-tight text-graphite">{content.ui.challenge}</h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-secondary">{item.challenge}</p>
          </div>
          <div className="grid content-start gap-3">
            {item.objectives.map((objective, index) => (
              <div key={objective} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">{index + 1}</span>
                <p className="text-sm font-semibold leading-relaxed text-graphite">{objective}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="case-strategy">
        <Container className="grid gap-8">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <Eyebrow>{content.ui.strategy}</Eyebrow>
              <h2 id="case-strategy" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">{content.ui.strategy}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {item.strategy.map((strategy) => (
                <div key={strategy} className="rounded-2xl border border-line bg-surface-tint p-4">
                  <Target className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                  <p className="mt-3 text-sm leading-relaxed text-secondary">{strategy}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="case-execution">
        <Container className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <h2 id="case-execution" className="text-3xl font-semibold tracking-tight text-graphite">{content.ui.execution}</h2>
            <div className="mt-6 grid gap-4">
              {item.execution.map((step, index) => (
                <div key={step.label} className="grid gap-3 border-l-2 border-brand-teal/30 pl-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{content.ui.workstream} {index + 1}</p>
                  <h3 className="text-lg font-semibold text-graphite">{step.label}</h3>
                  <p className="text-sm leading-relaxed text-secondary">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <Layers3 className="h-9 w-9 text-brand-teal" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-graphite">{content.ui.servicesDelivered}</h2>
            <dl className="mt-5 grid gap-4">
              {item.servicesDelivered.map((service) => (
                <div key={service.label} className="rounded-xl border border-line-soft bg-surface-tint p-4">
                  <dt className="text-sm font-semibold text-graphite">{service.label}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-secondary">{service.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="case-results">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>{content.ui.results}</Eyebrow>
            <h2 id="case-results" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">{content.ui.results}</h2>
            <ul className="mt-6 grid gap-3">
              {item.results.map((result) => (
                <li key={result} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-secondary">{result}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-surface-tint p-5">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-brand-teal" aria-hidden="true" />
              <h2 className="text-2xl font-semibold tracking-tight text-graphite">{content.ui.keyMetrics}</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {item.metrics.map((metric) => (
                <div key={metric.id} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-sm font-semibold text-graphite">{metric.label}</h3>
                    <p className="text-2xl font-semibold text-brand-teal">{metric.value}</p>
                  </div>
                  {(metric.baseline || metric.endValue) && (
                    <p className="mt-2 text-xs font-semibold text-muted">
                      {metric.baseline ? `${metric.baseline}` : ""}{metric.endValue ? ` -> ${metric.endValue}` : ""}
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-secondary">{metric.context}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="case-gallery">
        <Container className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <Eyebrow>{content.ui.visualGallery}</Eyebrow>
            <h2 id="case-gallery" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">{content.ui.visualGallery}</h2>
            <p className="mt-4 text-sm leading-relaxed text-secondary">{content.ui.verifiedCaseStudy}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {item.visualGallery.map((visual) => (
              <figure key={visual.src} className="overflow-hidden rounded-3xl border border-line bg-white p-3">
                <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                <figcaption className="px-2 py-3 text-xs text-muted">{visual.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="case-learning">
        <Container className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-line bg-white p-7 depth-layered">
            <LineChart className="h-9 w-9 text-brand-teal" aria-hidden="true" />
            <h2 id="case-learning" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{content.ui.keyLearning}</h2>
            <p className="mt-4 text-base leading-relaxed text-secondary">{item.keyLearning}</p>
          </div>
          <div className="grid gap-4">
            <CompactRail title={content.ui.relatedServices} items={item.relatedServices} hrefBase="/services" locale={locale} />
            <CompactRail title={content.ui.relatedIndustries} items={item.relatedIndustries} hrefBase="/industries" locale={locale} />
            <CompactRail title={content.ui.relatedMarkets} items={item.relatedMarkets} hrefBase="/markets" locale={locale} />
          </div>
        </Container>
      </Section>

      <Section background="tint">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 shadow-soft sm:p-10">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div>
                <ShieldCheck className="h-9 w-9 text-brand-teal" aria-hidden="true" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{item.finalCta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{item.finalCta.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <CTAButton href={loc(item.finalCta.href)}>
                  {item.finalCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" href={loc("/work/case-studies")}>
                  {content.pages["case-studies"].h1}
                </CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
