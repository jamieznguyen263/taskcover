import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileCheck2,
  Film,
  Gauge,
  Globe2,
  Layers3,
  LockKeyhole,
  Megaphone,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n";
import {
  getProofContent,
  getProofPageBySlug,
  getVerifiedPublicProofItemsByType,
  type ProofPageSlug,
} from "@/lib/content";
import type { ProofContent, ProofLink } from "@/content/proof.types";
import { EvidenceLedger } from "./evidence-ledger";
import { ExperienceNameplates, PrivateReferenceFlow, VerificationPipeline } from "./proof-visuals";
import { ProofStatusBadge } from "./proof-status-badge";

function DetailHero({
  content,
  slug,
  locale,
}: {
  content: ProofContent;
  slug: ProofPageSlug;
  locale: Locale;
}) {
  const page = content.pages[slug];
  const loc = (path: string) => localizePath(path, locale);
  return (
    <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col gap-5">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={loc("/")} className="hover:text-brand-teal">
                  {content.ui.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={loc("/proof")} className="hover:text-brand-teal">
                  {content.ui.proof}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-secondary">
                {page.label}
              </li>
            </ol>
          </nav>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem]">
            {page.h1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
            {page.intro}
          </p>
          <div className="flex flex-wrap gap-2">
            <ProofStatusBadge label={content.ui.verifiedPublic} tone="verified" />
            <ProofStatusBadge label={content.ui.permissioned} tone="permission" />
            <ProofStatusBadge label={content.ui.disclosure} tone="source" />
          </div>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-70 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 depth-layered">
            <div className="grid gap-3">
              {[content.ui.publicEvidence, content.ui.privateReference, content.ui.verificationStatus].map((label, index) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-line bg-surface-tint px-4 py-3">
                  <span className="text-sm font-semibold text-graphite">{label}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-teal">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function RelatedProofChannels({
  links,
  currentSlug,
  locale,
  title,
}: {
  links: ProofLink[];
  currentSlug: ProofPageSlug;
  locale: Locale;
  title: string;
}) {
  const currentHref = `/proof/${currentSlug}`;
  return (
    <Section background="default" aria-labelledby={`related-${currentSlug}`}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{title}</Eyebrow>
          <h2 id={`related-${currentSlug}`} className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
            {title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {links
            .filter((link) => link.href !== currentHref)
            .map((link) => (
              <Link
                key={link.href}
                href={localizePath(link.href, locale)}
                className="card-lift group inline-flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3 hover:border-brand-teal/40"
              >
                <span className="text-sm font-semibold text-graphite">{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-brand-teal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            ))}
        </div>
      </Container>
    </Section>
  );
}

function ProofCta({ content, locale, media = false }: { content: ProofContent; locale: Locale; media?: boolean }) {
  const loc = (path: string) => localizePath(path, locale);
  return (
    <Section background="soft">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 depth-layered sm:p-10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>{content.hub.cta.eyebrow}</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                {content.hub.cta.title}
              </h2>
              <p className="mt-3 max-w-2xl text-secondary">{content.hub.cta.description}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <CTAButton href={loc("/book-a-call")}>
                {content.ui.bookStrategyCall}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" href={loc(media ? "/contact?intent=media" : "/contact?intent=private-reference")}>
                {media ? content.ui.mediaInquiry : content.ui.requestReference}
              </CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function BrandExperiencePage({ content, locale }: { content: ProofContent; locale: Locale }) {
  const data = content.brandExperience;
  return (
    <>
      <DetailHero content={content} slug="brand-experience" locale={locale} />

      <Section background="default" aria-labelledby="brand-nameplates">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center gap-4">
            <Eyebrow>{content.ui.approvedExperienceContext}</Eyebrow>
            <h2 id="brand-nameplates" className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
              {data.nameplatesTitle}
            </h2>
            <p className="text-secondary">{data.nameplatesDisclosure}</p>
          </div>
          <ExperienceNameplates brands={content.hub.experience.brands} disclosure={content.hub.experience.disclosure} />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="sector-map">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="sector-map" title={data.sectorMapTitle} description={data.sectorMapDescription} />
          <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div className="grid divide-line-soft md:grid-cols-3 md:divide-x">
              {data.sectors.map((sector, index) => (
                <div key={sector.sector} className="p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-graphite">{sector.sector}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sector.signals.map((signal) => (
                      <span key={signal} className="rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-semibold text-secondary">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="contributions">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <div className="grid gap-3 sm:grid-cols-2">
              {data.contributions.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-surface-soft p-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-teal">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-graphite">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <SectionHeader align="left" titleId="contributions" title={data.contributionTitle} description={data.contributionDescription} />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="search-challenges">
        <Container className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-brand-teal/25 bg-white p-6 md:col-span-1">
            <Search className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id="search-challenges" className="mt-4 text-2xl font-semibold tracking-tight text-graphite">
              {data.challengesTitle}
            </h2>
          </div>
          <div className="grid gap-4 md:col-span-3 md:grid-cols-2">
            {data.challenges.map((challenge) => (
              <div key={challenge.label} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-semibold text-graphite">{challenge.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{challenge.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="methodology-transfer">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="methodology-transfer" title={data.methodologyTitle} description={data.methodologyDescription} />
          <div className="grid gap-4 lg:grid-cols-3">
            {data.methodology.map((row) => (
              <div key={row.from} className="rounded-3xl border border-line bg-white p-5 depth-layered">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-semibold text-muted">{row.from}</span>
                  <ArrowRight className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                  <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">{row.to}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-secondary">{row.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <PolicyBand title={data.policyTitle} items={data.policy} />
      <RelatedProofChannels links={content.channelLinks} currentSlug="brand-experience" locale={locale} title={content.ui.relatedProofChannels} />
      <ProofCta content={content} locale={locale} />
    </>
  );
}

function MediaFeaturesPage({ content, locale }: { content: ProofContent; locale: Locale }) {
  const data = content.mediaFeatures;
  const records = getVerifiedPublicProofItemsByType("media-feature");
  return (
    <>
      <DetailHero content={content} slug="media-features" locale={locale} />
      <RegistrySection title={data.registryTitle} records={records} content={content} emptyBody={data.registryEmpty} />

      <Section background="soft" aria-labelledby="topic-map">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader align="left" titleId="topic-map" title={data.topicMapTitle} description={data.topicMapDescription} />
          <div className="grid gap-3 sm:grid-cols-3">
            {data.topics.map((topic, index) => (
              <div key={topic} className={cn("rounded-2xl border p-4", index % 3 === 0 ? "border-brand-teal/30 bg-brand-teal/[0.04]" : "border-line bg-white")}>
                <Megaphone className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-graphite">{topic}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="editorial-workflow">
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <ol className="rounded-3xl border border-line bg-white p-5 depth-layered">
            {data.workflow.map((step, index) => (
              <li key={step} className="grid grid-cols-[36px_1fr] gap-3 border-b border-line-soft py-3 last:border-b-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-tint text-xs font-bold text-brand-teal">{index + 1}</span>
                <span className="text-sm font-semibold text-graphite">{step}</span>
              </li>
            ))}
          </ol>
          <SectionHeader align="left" titleId="editorial-workflow" title={data.workflowTitle} />
        </Container>
      </Section>

      <PolicyBand title={data.standardsTitle} items={data.standards} />
      <MediaInquiryPanel title={data.ctaTitle} description={data.ctaDescription} content={content} locale={locale} />
    </>
  );
}

function ClientReviewsPage({ content, locale }: { content: ProofContent; locale: Locale }) {
  const data = content.clientReviews;
  const records = getVerifiedPublicProofItemsByType("client-review");
  return (
    <>
      <DetailHero content={content} slug="client-reviews" locale={locale} />
      <RegistrySection title={data.registryTitle} records={records} content={content} emptyBody={data.registryEmpty} />

      <Section background="soft" aria-labelledby="feedback-dimensions">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="feedback-dimensions" title={data.dimensionsTitle} />
          <div className="grid gap-4 md:grid-cols-7">
            {data.dimensions.map((dimension, index) => (
              <div key={dimension.label} className={cn("rounded-2xl border bg-white p-4", index < 2 ? "md:col-span-2" : "md:col-span-1", index === 0 && "border-brand-teal/30")}>
                <MessageSquareQuote className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-graphite">{dimension.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-secondary">{dimension.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="review-method">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeader align="left" titleId="review-method" title={data.methodTitle} />
          <VerificationPipeline steps={data.method} label={content.ui.reviewStandard} />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="private-client-path">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="private-client-path" title={data.privatePathTitle} />
          <PrivateReferenceFlow steps={data.privatePath} label={content.ui.confidentialEngagement} />
        </Container>
      </Section>

      <ChecklistMosaic title={data.evaluationTitle} items={data.evaluation} />
      <ProofCta content={content} locale={locale} />
    </>
  );
}

function VideoReviewsPage({ content, locale }: { content: ProofContent; locale: Locale }) {
  const data = content.videoReviews;
  const records = getVerifiedPublicProofItemsByType("video-review");
  return (
    <>
      <DetailHero content={content} slug="video-reviews" locale={locale} />
      <RegistrySection title={data.libraryTitle} records={records} content={content} emptyBody={data.libraryEmpty} />

      <Section background="soft" aria-labelledby="useful-video">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-line bg-surface-tint">
              <Film className="h-16 w-16 text-brand-teal" aria-hidden="true" />
            </div>
            <ul className="mt-5 grid gap-3">
              {data.usefulVideo.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <SectionHeader align="left" titleId="useful-video" title={data.usefulVideoTitle} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="video-workflow">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="video-workflow" title={data.workflowTitle} />
          <div className="grid gap-3 md:grid-cols-5">
            {data.workflow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-line bg-white p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">{index + 1}</span>
                <p className="mt-4 text-sm font-semibold text-graphite">{step}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="private-video">
        <Container>
          <div className="grid gap-6 rounded-3xl border border-line bg-white p-6 depth-layered lg:grid-cols-[auto_1fr]">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-tint text-brand-teal">
              <LockKeyhole className="h-8 w-8" aria-hidden="true" />
            </span>
            <div>
              <h2 id="private-video" className="text-2xl font-semibold tracking-tight text-graphite">
                {data.privateAvailabilityTitle}
              </h2>
              <p className="mt-2 text-secondary">{data.privateAvailability}</p>
            </div>
          </div>
        </Container>
      </Section>

      <ProofCta content={content} locale={locale} />
    </>
  );
}

function SpokespersonPage({ content, locale }: { content: ProofContent; locale: Locale }) {
  const data = content.spokesperson;
  return (
    <>
      <DetailHero content={content} slug="spokesperson" locale={locale} />

      <Section background="default" aria-labelledby="commentary-areas">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader align="left" titleId="commentary-areas" title={data.areasTitle} />
          <div className="grid gap-3 sm:grid-cols-3">
            {data.areas.map((area, index) => (
              <div key={area} className={cn("rounded-2xl border p-4", index % 2 === 0 ? "border-line bg-white" : "border-brand-teal/25 bg-brand-teal/[0.04]")}>
                <Sparkles className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-graphite">{area}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="formats">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="left" titleId="formats" title={data.formatsTitle} />
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {data.formats.map((format, index) => (
                <div key={format} className="flex w-52 shrink-0 flex-col justify-between rounded-2xl border border-line bg-white p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">{index + 1}</span>
                  <p className="mt-8 text-sm font-semibold text-graphite">{format}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="response-process">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            {data.process.map((step, index) => (
              <div key={step} className="grid grid-cols-[42px_1fr] gap-3 border-b border-line-soft py-4 last:border-b-0">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-tint text-sm font-bold text-brand-teal">{index + 1}</span>
                <p className="text-sm font-semibold text-graphite">{step}</p>
              </div>
            ))}
          </div>
          <SectionHeader align="left" titleId="response-process" title={data.processTitle} />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="profile-area">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-line bg-white p-6 depth-layered">
            <UserRoundCheck className="h-12 w-12 text-brand-teal" aria-hidden="true" />
            <h2 id="profile-area" className="mt-5 text-2xl font-semibold tracking-tight text-graphite">
              {data.profileTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">{data.profileEmpty}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {data.profileFields.map((field) => (
              <div key={field} className="rounded-2xl border border-line bg-white p-4">
                <Gauge className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-graphite">{field}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <MediaInquiryPanel title={data.ctaTitle} description={data.ctaDescription} content={content} locale={locale} />
    </>
  );
}

function RegistrySection({
  title,
  records,
  content,
  emptyBody,
}: {
  title: string;
  records: ReturnType<typeof getVerifiedPublicProofItemsByType>;
  content: ProofContent;
  emptyBody: string;
}) {
  return (
    <Section background="default" aria-labelledby={`registry-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{content.ui.publicEvidence}</Eyebrow>
          <h2 id={`registry-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
            {title}
          </h2>
        </div>
        <EvidenceLedger records={records} ui={content.ui} emptyBody={emptyBody} />
      </Container>
    </Section>
  );
}

function PolicyBand({ title, items }: { title: string; items: string[] }) {
  return (
    <Section background="soft" aria-labelledby={`policy-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <Container>
        <div className="grid gap-6 rounded-3xl border border-line bg-white p-6 depth-layered lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <ShieldCheck className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <h2 id={`policy-${title.replace(/\s+/g, "-").toLowerCase()}`} className="mt-4 text-2xl font-semibold tracking-tight text-graphite">
              {title}
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-2xl border border-line bg-surface-soft p-4 text-sm text-secondary">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

function ChecklistMosaic({ title, items }: { title: string; items: string[] }) {
  return (
    <Section background="default" aria-labelledby={`checklist-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Layers3 className="h-10 w-10 text-brand-teal" aria-hidden="true" />
          <h2 id={`checklist-${title.replace(/\s+/g, "-").toLowerCase()}`} className="mt-4 text-3xl font-semibold tracking-tight text-graphite">
            {title}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={item} className={cn("rounded-2xl border bg-white p-4", index === 0 ? "border-brand-teal/30" : "border-line")}>
              <CheckCircle2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-graphite">{item}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function MediaInquiryPanel({
  title,
  description,
  content,
  locale,
}: {
  title: string;
  description: string;
  content: ProofContent;
  locale: Locale;
}) {
  const loc = (path: string) => localizePath(path, locale);
  return (
    <Section background="soft">
      <Container>
        <div className="grid gap-6 rounded-3xl border border-line bg-white p-8 depth-layered lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white">
            <Globe2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-graphite">{title}</h2>
            <p className="mt-2 max-w-2xl text-secondary">{description}</p>
          </div>
          <CTAButton href={loc("/contact?intent=media")}>
            {content.ui.mediaInquiry}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </Container>
    </Section>
  );
}

export function ProofPageTemplate({
  slug,
  locale,
}: {
  slug: ProofPageSlug;
  locale: Locale;
}) {
  const content = getProofContent(locale);
  const page = getProofPageBySlug(slug, locale);
  if (!page) return null;

  if (slug === "brand-experience") return <BrandExperiencePage content={content} locale={locale} />;
  if (slug === "media-features") return <MediaFeaturesPage content={content} locale={locale} />;
  if (slug === "client-reviews") return <ClientReviewsPage content={content} locale={locale} />;
  if (slug === "video-reviews") return <VideoReviewsPage content={content} locale={locale} />;
  return <SpokespersonPage content={content} locale={locale} />;
}
