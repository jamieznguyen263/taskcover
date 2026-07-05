import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Grid2X2, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getCaseStudies, getServiceBySlug, getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import { PriorityLedger, SignalMosaic } from "./work-visuals";
import { WorkStatusBadge } from "./work-status-badge";

function countLabel(template: string, count: number) {
  return template.replace("{count}", String(count));
}

function groupCounts(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

export function ClientResultsView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const page = content.pages["client-results"];
  const cases = getCaseStudies(locale);
  const loc = (path: string) => localizePath(path, locale);
  const serviceSlugs = Array.from(new Set(cases.flatMap((item) => item.serviceSlugs)));
  const serviceLabels = Object.fromEntries(
    serviceSlugs.map((slug) => [slug, getServiceBySlug(slug, locale)?.title ?? slug])
  );
  const publicMetrics = cases.flatMap((item) =>
    item.metrics
      .filter((metric) => metric.displayPublicly)
      .map((metric) => ({
        case: item,
        metric,
        serviceLabel: serviceLabels[item.serviceSlugs[0]] ?? item.serviceSlugs[0],
      }))
  );
  const highlights = publicMetrics.slice(0, 10);
  const serviceProof = serviceSlugs.map((slug) => ({
    slug,
    label: serviceLabels[slug],
    service: getServiceBySlug(slug, locale),
    cases: cases.filter((item) => item.serviceSlugs.includes(slug)),
  }));
  const industryDistribution = groupCounts(cases.map((item) => item.industry ?? item.industrySlug));
  const marketDistribution = groupCounts(cases.map((item) => item.market ?? item.marketSlugs[0]));

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
            <div className="flex flex-wrap gap-2">
              <WorkStatusBadge label={content.ui.verifiedClientResult} tone="verified" />
              <WorkStatusBadge label={content.ui.measurementContext} tone="warning" />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <BarChart3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold tracking-tight text-graphite">{content.clientResults.registryIntro}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-line bg-surface-tint p-4">
                <p className="text-3xl font-semibold text-brand-teal">{cases.length}</p>
                <p className="text-xs text-secondary">{content.ui.verifiedCaseStudy}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-tint p-4">
                <p className="text-3xl font-semibold text-brand-teal">{publicMetrics.length}</p>
                <p className="text-xs text-secondary">{content.ui.keyMetrics}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-tint p-4">
                <p className="text-3xl font-semibold text-brand-teal">{serviceSlugs.length}</p>
                <p className="text-xs text-secondary">{content.ui.relatedServices}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="result-highlights">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="result-highlights"
            eyebrow={content.ui.measurementContext}
            title={content.ui.resultHighlights}
            description={content.clientResults.registryIntro}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {highlights.map(({ case: item, metric, serviceLabel }) => (
              <Link
                key={`${item.slug}-${metric.id}`}
                href={loc(`/work/case-studies/${item.slug}`)}
                className="group overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-brand-teal/35"
              >
                <div className="relative bg-surface-tint p-3">
                  <div className="relative aspect-[9/5] overflow-hidden rounded-2xl border border-line-soft bg-white">
                    <Image
                      src={item.visualGallery[0].src}
                      alt={item.visualGallery[0].alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-brand-teal">{metric.value}</p>
                  <h2 className="mt-3 text-base font-semibold text-graphite">{item.clientName}</h2>
                  <p className="mt-1 text-xs font-semibold text-secondary">{serviceLabel}</p>
                  <p className="mt-3 text-sm leading-6 text-secondary">{metric.context}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
                    {content.ui.viewCaseStudy}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="case-result-matrix">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="case-result-matrix"
            eyebrow={content.ui.resultCategories}
            title={content.ui.caseToResultMatrix}
            description={page.intro}
          />
          <div className="overflow-x-auto rounded-3xl border border-line bg-white shadow-soft">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead className="bg-surface-tint text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-semibold">{content.ui.client}</th>
                  <th className="px-5 py-4 font-semibold">{content.ui.focus}</th>
                  <th className="px-5 py-4 font-semibold">{content.ui.keyMetrics}</th>
                  <th className="px-5 py-4 font-semibold">{content.ui.relatedServices}</th>
                  <th className="px-5 py-4 font-semibold">{content.ui.readCase}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {cases.map((item) => (
                  <tr key={item.slug}>
                    <td className="px-5 py-4 font-semibold text-graphite">{item.clientName}</td>
                    <td className="px-5 py-4 text-secondary">{item.industry} · {item.market}</td>
                    <td className="px-5 py-4 text-secondary">
                      {item.metrics.slice(0, 2).map((metric) => `${metric.label}: ${metric.value}`).join(" | ")}
                    </td>
                    <td className="px-5 py-4 text-secondary">
                      {item.serviceSlugs.slice(0, 2).map((slug) => serviceLabels[slug]).join(" | ")}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={loc(`/work/case-studies/${item.slug}`)} className="font-semibold text-brand-teal hover:text-graphite">
                        {content.ui.viewCaseStudy}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="service-results-map">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="service-results-map"
            eyebrow={content.ui.relatedProof}
            title={content.ui.serviceToProofMap}
            description={content.caseStudies.registryIntro}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {serviceProof.map(({ slug, label, service, cases: relatedCases }) => (
              <article key={slug} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
                <Network className="h-8 w-8 text-brand-teal" aria-hidden="true" />
                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-graphite">{label}</h3>
                    <p className="mt-2 text-sm leading-6 text-secondary">{service?.summary ?? service?.outcomePromise}</p>
                  </div>
                  <span className="rounded-full border border-brand-teal/20 bg-surface-tint px-3 py-1 text-xs font-semibold text-brand-teal">
                    {countLabel(content.ui.usedInCaseStudies, relatedCases.length)}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {relatedCases.slice(0, 3).map((item) => (
                    <Link
                      key={item.slug}
                      href={loc(`/work/case-studies/${item.slug}`)}
                      className="rounded-full border border-line bg-surface-tint px-3 py-1.5 text-xs font-semibold text-secondary transition hover:border-brand-teal hover:text-brand-teal"
                    >
                      {item.shortName}
                    </Link>
                  ))}
                </div>
                <CTAButton className="mt-5" href={loc(`/services/${slug}`)}>{content.ui.viewService}</CTAButton>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="distribution">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Grid2X2 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="distribution" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.industryMarketDistribution}
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary">{content.caseStudies.registryIntro}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[content.ui.relatedIndustries, content.ui.relatedMarkets].map((title, groupIndex) => {
              const rows = groupIndex === 0 ? industryDistribution : marketDistribution;
              return (
                <div key={title} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
                  <h3 className="text-lg font-semibold text-graphite">{title}</h3>
                  <div className="mt-4 grid gap-2">
                    {rows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl bg-surface-tint px-3 py-2">
                        <span className="text-sm font-medium text-secondary">{row.label}</span>
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-brand-teal">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="measurement-requirements">
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

      <Section background="soft" aria-labelledby="metric-context">
        <Container className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <SignalMosaic items={content.clientResults.metricContext} />
          <div className="flex flex-col justify-center gap-5">
            <ShieldCheck className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="metric-context" className="text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.metricContext}
            </h2>
            <p className="text-secondary">{content.clientResults.registryIntro}</p>
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

      <Section background="tint">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-graphite">{content.clientResults.cta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.clientResults.cta.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <CTAButton href={loc("/free-seo-audit")}>{content.ui.getAudit}</CTAButton>
                <CTAButton variant="secondary" href={loc("/work/case-studies")}>
                  {content.ui.caseStudyLibrary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton variant="secondary" href={loc("/contact?intent=private-reference")}>
                  {content.ui.privateReference}
                </CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
