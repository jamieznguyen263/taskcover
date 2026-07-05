import Link from "next/link";
import { ArrowRight, BarChart3, Network, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { ClientLogoMark } from "@/components/marketing/shared/client-logo-tile";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { buildClientLogoProofAsset, publicClientLogoAssets } from "@/content/home-proof-assets";
import { getCaseStudies, getServiceBySlug, getWorkContent } from "@/lib/content";
import { getLocalePrefix, localizePath, type Locale } from "@/lib/i18n";
import { WorkStatusBadge } from "./work-status-badge";
import { CaseStudyIndex } from "./case-study-index";

function countLabel(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export function CaseStudiesView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const page = content.pages["case-studies"];
  const cases = getCaseStudies(locale);
  const featured = cases.find((item) => item.featuredOnHomepage) ?? cases[0];
  const loc = (path: string) => localizePath(path, locale);
  const logoBySlug = new Map(
    publicClientLogoAssets.map((asset) => [
      asset.caseStudySlug,
      buildClientLogoProofAsset({
        asset,
        hrefPrefix: getLocalePrefix(locale),
        alt: (clientName) => `${clientName} logo`,
      }),
    ])
  );
  const featuredLogo = logoBySlug.get(featured.slug);
  const serviceSlugs = Array.from(new Set(cases.flatMap((item) => item.serviceSlugs)));
  const serviceLabels = Object.fromEntries(
    serviceSlugs.map((slug) => [slug, getServiceBySlug(slug, locale)?.title ?? slug])
  );
  const indexCases = cases.flatMap((item) => {
    const logo = logoBySlug.get(item.slug);
    if (!logo) return [];
    return [
      {
        slug: item.slug,
        clientName: item.clientName,
        summary: item.summary,
        industry: item.industry,
        industrySlug: item.industrySlug,
        market: item.market,
        marketSlugs: item.marketSlugs,
        serviceSlugs: item.serviceSlugs,
        metrics: item.metrics
          .filter((metric) => metric.displayPublicly)
          .map((metric) => ({
            id: metric.id,
            label: metric.label,
            value: metric.value,
            context: metric.context,
            category: metric.category,
          })),
        logo,
      },
    ];
  });
  const outcomeCards = cases
    .flatMap((item) =>
      item.metrics
        .filter((metric) => metric.displayPublicly)
        .slice(0, 2)
        .map((metric) => ({
          caseSlug: item.slug,
          clientName: item.clientName,
          serviceLabel: serviceLabels[item.serviceSlugs[0]] ?? item.serviceSlugs[0],
          metric,
        }))
    )
    .slice(0, 8);
  const serviceProof = serviceSlugs.map((slug) => {
    const service = getServiceBySlug(slug, locale);
    const relatedCases = cases.filter((item) => item.serviceSlugs.includes(slug));
    return { slug, service, relatedCases };
  });

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
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
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {page.h1}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">{page.intro}</p>
            <div className="flex flex-wrap gap-2">
              <WorkStatusBadge label={content.ui.verifiedCaseStudy} tone="verified" />
              <WorkStatusBadge label={countLabel(content.ui.resultCount, cases.length)} tone="sample" />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <div className="grid grid-cols-2 gap-3">
              {cases.slice(0, 4).map((item) => (
                <Link
                  key={item.slug}
                  href={loc(`/work/case-studies/${item.slug}`)}
                  className="rounded-2xl border border-line-soft bg-surface-tint p-4 transition hover:border-brand-teal/35"
                >
                  <p className="text-xs font-semibold text-muted">{item.shortName}</p>
                  <p className="mt-3 text-2xl font-semibold text-brand-teal">{item.metrics[0]?.value}</p>
                  <p className="mt-1 text-xs leading-5 text-secondary">{item.metrics[0]?.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="featured-case">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-tint p-3 shadow-soft">
            {featuredLogo ? (
              <ClientLogoMark
                logo={featuredLogo}
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="rounded-2xl"
              />
            ) : (
              <div className="flex aspect-[9/5] items-center justify-center rounded-2xl border border-line-soft bg-white p-8 text-center text-xl font-semibold text-graphite">
                {featured.clientName}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-5">
            <Eyebrow>{content.ui.featuredCaseStudy}</Eyebrow>
            <h2 id="featured-case" className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
              {featured.clientName}
            </h2>
            <p className="text-base leading-relaxed text-secondary">{featured.heroSummary}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {featured.metrics.slice(0, 2).map((metric) => (
                <div key={metric.id} className="rounded-2xl border border-line bg-surface-tint p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-brand-teal">{metric.value}</p>
                  <p className="mt-2 text-xs leading-5 text-secondary">{metric.context}</p>
                </div>
              ))}
            </div>
            <CTAButton href={loc(`/work/case-studies/${featured.slug}`)}>
              {content.ui.viewCaseStudy}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="filterable-index">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="filterable-index"
            eyebrow={content.ui.caseStudyLibrary}
            title={content.ui.caseStudyLibrary}
            description={content.caseStudies.registryIntro}
          />
          <CaseStudyIndex
            cases={indexCases}
            locale={locale}
            serviceLabels={serviceLabels}
            labels={{
              allCases: content.ui.allCases,
              filterIndustry: content.ui.filterIndustry,
              filterMarket: content.ui.filterMarket,
              filterService: content.ui.filterService,
              readCase: content.ui.readCase,
              viewCaseStudy: content.ui.viewCaseStudy,
              clearFilters: content.ui.clearFilters,
              resultCount: content.ui.resultCount,
              relatedServices: content.ui.relatedServices,
            }}
          />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="outcomes-by-lever">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="outcomes-by-lever"
            eyebrow={content.ui.measurementContext}
            title={content.ui.verifiedOutcomesByGrowthLever}
            description={content.clientResults.registryIntro}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {outcomeCards.map(({ caseSlug, clientName, serviceLabel, metric }) => (
              <Link
                key={`${caseSlug}-${metric.id}`}
                href={loc(`/work/case-studies/${caseSlug}`)}
                className="group rounded-3xl border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-teal/35"
              >
                <BarChart3 className="h-7 w-7 text-brand-teal" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-brand-teal">{metric.value}</p>
                <h3 className="mt-3 text-base font-semibold text-graphite">{clientName}</h3>
                <p className="mt-1 text-xs font-semibold text-secondary">{content.ui.growthLever}: {serviceLabel}</p>
                <p className="mt-3 text-sm leading-6 text-secondary">{metric.context}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
                  {content.ui.viewCaseStudy}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="service-proof-map">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="service-proof-map"
            eyebrow={content.ui.relatedProof}
            title={content.ui.serviceToProofMap}
            description={content.caseStudies.registryIntro}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {serviceProof.map(({ slug, service, relatedCases }) => (
              <article key={slug} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
                <Network className="h-8 w-8 text-brand-teal" aria-hidden="true" />
                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-graphite">{service?.title ?? serviceLabels[slug]}</h3>
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
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <CTAButton href={loc(`/services/${slug}`)}>{content.ui.viewService}</CTAButton>
                  <CTAButton variant="secondary" href={loc("/work/case-studies")}>{content.ui.viewRelatedCases}</CTAButton>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 shadow-soft sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <ShieldCheck className="h-9 w-9 text-brand-teal" aria-hidden="true" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{content.caseStudies.cta.title}</h2>
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
