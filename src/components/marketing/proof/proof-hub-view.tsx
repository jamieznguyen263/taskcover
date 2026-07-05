import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { localizePath, type Locale } from "@/lib/i18n";
import { getProofContent } from "@/lib/content";
import {
  AuthorityStack,
  EvidenceCommandCenter,
  ExperienceNameplates,
  PrivateReferenceFlow,
  ProofChannelMap,
  VerificationPipeline,
} from "./proof-visuals";
import { ProofStatusBadge } from "./proof-status-badge";

function ProofBreadcrumb({
  locale,
  home,
  current,
}: {
  locale: Locale;
  home: string;
  current: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href={localizePath("/", locale)} className="hover:text-brand-teal">
            {home}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-secondary">
          {current}
        </li>
      </ol>
    </nav>
  );
}

export function ProofHubView({ locale }: { locale: Locale }) {
  const content = getProofContent(locale);
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col gap-6">
            <ProofBreadcrumb locale={locale} home={content.ui.home} current={content.ui.proof} />
            <Eyebrow>{content.hub.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.hub.h1}
            </h1>
            <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
              {content.hub.intro}
            </p>
            <div className="flex flex-wrap gap-2">
              <ProofStatusBadge label={content.ui.verifiedPublic} tone="verified" />
              <ProofStatusBadge label={content.ui.privateReference} tone="private" />
              <ProofStatusBadge label={content.ui.sourceLinked} tone="source" />
              <ProofStatusBadge label={content.ui.permissioned} tone="permission" />
            </div>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={loc("/book-a-call")}>
                {content.ui.bookStrategyCall}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={loc("/contact?intent=private-reference")}>
                {content.ui.requestReference}
              </CTAButton>
            </div>
          </div>
          <EvidenceCommandCenter modules={content.hub.commandModules} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="authority-framework">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            align="left"
            eyebrow={content.hub.authority.eyebrow}
            titleId="authority-framework"
            title={content.hub.authority.title}
            description={content.hub.authority.description}
          />
          <AuthorityStack layers={content.hub.authority.layers} />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="selected-experience">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <ExperienceNameplates
            brands={content.hub.experience.brands}
            disclosure={content.hub.experience.disclosure}
          />
          <div className="flex flex-col justify-center gap-5">
            <Eyebrow>{content.hub.experience.eyebrow}</Eyebrow>
            <h2
              id="selected-experience"
              className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl"
            >
              {content.hub.experience.title}
            </h2>
            <p className="text-base leading-relaxed text-secondary">
              {content.hub.experience.description}
            </p>
            <div className="rounded-2xl border border-brand-teal/20 bg-white p-5">
              <p className="flex items-start gap-2 text-sm font-semibold text-graphite">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                {content.ui.approvedExperienceContext}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="proof-standards">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.standards.eyebrow}
            titleId="proof-standards"
            title={content.hub.standards.title}
            description={content.hub.standards.description}
          />
          <VerificationPipeline
            steps={content.hub.standards.steps}
            label={content.ui.verificationWorkflow}
          />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="proof-channels">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.channels.eyebrow}
            titleId="proof-channels"
            title={content.hub.channels.title}
            description={content.hub.channels.description}
          />
          <ProofChannelMap links={content.channelLinks} locale={locale} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="private-reference-path">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.privatePath.eyebrow}
            titleId="private-reference-path"
            title={content.hub.privatePath.title}
            description={content.hub.privatePath.description}
          />
          <PrivateReferenceFlow
            steps={content.hub.privatePath.steps}
            label={content.ui.confidentialEngagement}
          />
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col items-start gap-5">
                <Eyebrow>{content.hub.cta.eyebrow}</Eyebrow>
                <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {content.hub.cta.title}
                </h2>
                <p className="max-w-lg text-secondary">{content.hub.cta.description}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <CTAButton size="lg" href={loc("/book-a-call")}>
                    {content.ui.bookStrategyCall}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <CTAButton variant="secondary" size="lg" href={loc("/contact?intent=private-reference")}>
                    {content.ui.requestReference}
                  </CTAButton>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
                {[content.ui.verifiedPublic, content.ui.privateReference, content.ui.sourceLinked, content.ui.permissioned].map((label) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white px-4 py-3">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                    <span className="text-sm font-semibold text-graphite">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
