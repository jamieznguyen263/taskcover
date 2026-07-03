import Link from "next/link";
import { ArrowRight, Gauge, GitBranch, Network, Route } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { getWorkContent } from "@/lib/content";
import { localizePath, type Locale } from "@/lib/i18n";
import { ArchitectureDiagram, ExecutionFlowVisual, PriorityLedger, SignalMosaic } from "./work-visuals";

export function SearchFrameworksView({ locale }: { locale: Locale }) {
  const content = getWorkContent(locale);
  const page = content.pages["search-growth-frameworks"];
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
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
          <ArchitectureDiagram title={page.eyebrow} items={content.frameworks.stages} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="discovery-context">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="discovery-context" eyebrow={content.frameworks.stages[0].label} title={content.frameworks.stages[0].detail} />
          <ExecutionFlowVisual steps={content.frameworks.stages} />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="search-intelligence">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <Network className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="search-intelligence" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.frameworks.stages[1].label}
            </h2>
            <p className="mt-3 text-secondary">{content.frameworks.stages[1].detail}</p>
          </div>
          <SignalMosaic items={content.frameworks.measurement} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="priority-model">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            align="left"
            titleId="priority-model"
            eyebrow={content.frameworks.stages[2].label}
            title={content.frameworks.prioritization[0].label}
            description={content.frameworks.prioritization[0].detail}
          />
          <PriorityLedger rows={content.frameworks.prioritization} statusLabel={content.ui.status} />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="execution-architecture">
        <Container className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <SignalMosaic items={content.frameworks.execution} />
          <div className="flex flex-col justify-center gap-4">
            <GitBranch className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="execution-architecture" className="text-3xl font-semibold tracking-tight text-graphite">
              {content.frameworks.stages[3].label}
            </h2>
            <p className="text-secondary">{content.frameworks.stages[3].detail}</p>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="measurement-learning">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <Gauge className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="measurement-learning" className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
              {content.frameworks.stages[4].label}
            </h2>
            <p className="mt-3 text-secondary">{content.frameworks.stages[5].detail}</p>
          </div>
          <SignalMosaic items={content.frameworks.governance} />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="framework-mapping">
        <Container className="grid gap-8 lg:grid-cols-2">
          <ArchitectureDiagram title={content.ui.relatedServices} items={content.frameworks.serviceMapping} />
          <ArchitectureDiagram title={content.ui.relatedIndustries} items={content.frameworks.industryMapping} />
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Route className="h-10 w-10 text-brand-teal" aria-hidden="true" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-graphite">{content.frameworks.cta.title}</h2>
                <p className="mt-3 max-w-2xl text-secondary">{content.frameworks.cta.description}</p>
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
