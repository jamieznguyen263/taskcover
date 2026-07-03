import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Network, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getCaseStudies, getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import { WorkStatusBadge } from "./work-status-badge";
import { CaseStudyIndex } from "./case-study-index";

export function CaseStudiesView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const page = content.pages["case-studies"];
  const cases = getCaseStudies(locale);
  const featured = cases.find((item) => item.featuredOnHomepage) ?? cases[0];
  const medium = cases.filter((item) => item.slug !== featured.slug).slice(0, 3);
  const compact = cases.filter((item) => item.slug !== featured.slug).slice(3);
  const indexCases = cases.map((item) => ({
    slug: item.slug,
    clientName: item.clientName,
    summary: item.summary,
    industry: item.industry,
    industrySlug: item.industrySlug,
    market: item.market,
    marketSlugs: item.marketSlugs,
    serviceSlugs: item.serviceSlugs,
    metrics: item.metrics.map((metric) => ({ id: metric.id, label: metric.label, value: metric.value })),
    visualGallery: item.visualGallery,
  }));
  const loc = (path: string) => localizePath(path, locale);

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
              <WorkStatusBadge label={`${cases.length} ${content.ui.publicRegistry}`} tone="sample" />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <div className="grid grid-cols-2 gap-3">
              {cases.slice(0, 4).map((item) => (
                <div key={item.slug} className="rounded-2xl border border-line-soft bg-surface-tint p-4">
                  <p className="text-xs font-semibold text-muted">{item.shortName}</p>
                  <p className="mt-3 text-2xl font-semibold text-brand-teal">{item.metrics[0]?.value}</p>
                  <p className="mt-1 text-xs text-secondary">{item.metrics[0]?.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="featured-case">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-soft">
            <Image
              src={featured.visualGallery[0].src}
              alt={featured.visualGallery[0].alt}
              width={featured.visualGallery[0].width}
              height={featured.visualGallery[0].height}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-5">
            <Eyebrow>{content.ui.verifiedCaseStudy}</Eyebrow>
            <h2 id="featured-case" className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
              {featured.clientName}
            </h2>
            <p className="text-base leading-relaxed text-secondary">{featured.heroSummary}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {featured.metrics.slice(0, 2).map((metric) => (
                <div key={metric.id} className="rounded-2xl border border-line bg-surface-tint p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-brand-teal">{metric.value}</p>
                </div>
              ))}
            </div>
            <CTAButton href={loc(`/work/case-studies/${featured.slug}`)}>
              {content.ui.readCase}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="case-dossiers">
        <Container className="grid gap-8">
          <SectionHeader
            align="left"
            titleId="case-dossiers"
            eyebrow={content.ui.publicRegistry}
            title={content.caseStudies.registryIntro}
            description={page.intro}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {medium.map((item) => (
              <Link key={item.slug} href={loc(`/work/case-studies/${item.slug}`)} className="group rounded-3xl border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-teal/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.industry}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-graphite group-hover:text-brand-teal">{item.clientName}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{item.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.metrics.slice(0, 2).map((metric) => (
                    <span key={metric.id} className="rounded-full bg-surface-tint px-3 py-1 text-xs font-semibold text-brand-teal">
                      {metric.value} {metric.label}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="grid gap-3">
            {compact.map((item) => (
              <Link key={item.slug} href={loc(`/work/case-studies/${item.slug}`)} className="grid gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-brand-teal/40 sm:grid-cols-[0.8fr_1.2fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-graphite">{item.clientName}</p>
                  <p className="mt-1 text-xs text-muted">{item.industry}</p>
                </div>
                <p className="text-sm text-secondary">{item.summary}</p>
                <ArrowRight className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="filterable-index">
        <Container className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <Eyebrow>{content.ui.allCases}</Eyebrow>
            <h2 id="filterable-index" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.publicRegistry}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-secondary">{content.caseStudies.registryIntro}</p>
          </div>
          <CaseStudyIndex
            cases={indexCases}
            locale={locale}
            labels={{
              allCases: content.ui.allCases,
              filterIndustry: content.ui.filterIndustry,
              filterMarket: content.ui.filterMarket,
              filterService: content.ui.filterService,
              readCase: content.ui.readCase,
            }}
          />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="outcome-spectrum">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-line bg-white p-6">
            <BarChart3 className="h-9 w-9 text-brand-teal" aria-hidden="true" />
            <h2 id="outcome-spectrum" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{content.ui.keyMetrics}</h2>
            <div className="mt-6 grid gap-3">
              {cases.slice(0, 6).map((item) => (
                <div key={item.slug} className="flex items-center justify-between gap-4 rounded-xl border border-line-soft bg-surface-tint p-3">
                  <span className="text-sm font-semibold text-graphite">{item.shortName}</span>
                  <span className="text-sm font-semibold text-brand-teal">{item.metrics[0]?.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <Network className="h-9 w-9 text-brand-teal" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{content.ui.relatedServices}</h2>
            <div className="mt-6 grid gap-3">
              {["technical-seo", "content-marketing", "local-seo", "international-seo", "ppc-management", "ecommerce-seo"].map((service) => (
                <div key={service} className="rounded-xl border border-line-soft bg-surface-tint p-3">
                  <p className="text-sm font-semibold text-graphite">{service}</p>
                  <p className="mt-1 text-xs text-secondary">
                    {cases.filter((item) => item.serviceSlugs.includes(service)).map((item) => item.shortName).join(" / ")}
                  </p>
                </div>
              ))}
            </div>
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
