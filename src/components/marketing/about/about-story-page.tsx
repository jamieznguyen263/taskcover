/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Compass,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getPublicClientLogoAssetByCaseStudySlug } from "@/content/client-logo-assets";
import type { AboutStoryCapability, AboutStoryLeader } from "@/content/about-story";
import type { CaseStudySlug } from "@/content/work.types";
import { getAboutStoryContent, getCaseStudyBySlug } from "@/lib/content";
import { companyAddressLine, companyDetails } from "@/lib/company";
import { localizePath, type Locale } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow } from "@/components/marketing/shared/section-header";

export function aboutStoryMetadata(locale: Locale): Metadata {
  const content = getAboutStoryContent(locale);
  return buildMetadata({
    title: content.meta.title,
    description: content.meta.description,
    path: "/about",
    locale,
  });
}

export function AboutStoryPage({ locale }: { locale: Locale }) {
  const content = getAboutStoryContent(locale);
  const breadcrumb = breadcrumbSchema(
    [
      { name: content.breadcrumb.home, path: "/" },
      { name: content.breadcrumb.current, path: "/about" },
    ],
    locale
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <AboutHero locale={locale} />
      <OriginStory locale={locale} />
      <CompanyTimeline locale={locale} />
      <MethodologyShaping locale={locale} />
      <Leadership locale={locale} />
      <OperatingModel locale={locale} />
      <CompanyDetails locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}

function AboutHero({ locale }: { locale: Locale }) {
  const { hero } = getAboutStoryContent(locale);

  return (
    <Section background="tint" className="relative overflow-hidden pb-16 pt-16 sm:pt-20 lg:pb-20">
      <div aria-hidden="true" className="absolute inset-0 bg-line-grid opacity-70" />
      <Container className="relative grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div className="flex min-w-0 flex-col gap-6">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="max-w-5xl break-words text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
            {hero.h1}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-secondary">{hero.intro}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CTAButton href={localizePath(hero.primaryCta.href, locale)}>
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton href={localizePath(hero.secondaryCta.href, locale)} variant="secondary">
              {hero.secondaryCta.label}
            </CTAButton>
          </div>
          <p className="max-w-3xl break-words rounded-2xl border border-brand-teal/20 bg-white/78 px-4 py-3 text-sm leading-relaxed text-secondary shadow-sm">
            {hero.proofLine}
          </p>
        </div>

        <aside className="min-w-0 rounded-[2rem] border border-line bg-white p-5 depth-layered" aria-label={hero.identityLabel}>
          <div className="rounded-3xl bg-brand-gradient-soft p-5">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_18px_38px_-20px_rgba(24,138,172,0.8)]">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{hero.identityLabel}</p>
                <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-graphite">{hero.identityTitle}</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {hero.identityItems.map((item) => (
                <div key={item} className="flex min-w-0 gap-3 rounded-2xl border border-white/80 bg-white/84 px-4 py-3 text-sm leading-relaxed text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                  <span className="min-w-0 break-words">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <ol className="mt-5 grid gap-3 sm:grid-cols-3" aria-label={hero.identityLabel}>
            {hero.timelinePreview.map((item, index) => (
              <li key={`${item.year}-${item.label}`} className="relative rounded-2xl border border-line-soft bg-surface-tint px-4 py-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-teal">{item.year}</span>
                <p className="mt-2 break-words text-sm font-semibold leading-snug text-graphite">{item.label}</p>
                {index < hero.timelinePreview.length - 1 ? (
                  <span aria-hidden="true" className="absolute right-[-0.7rem] top-1/2 hidden h-px w-5 bg-brand-teal/30 sm:block" />
                ) : null}
              </li>
            ))}
          </ol>
        </aside>
      </Container>
    </Section>
  );
}

function OriginStory({ locale }: { locale: Locale }) {
  const { origin } = getAboutStoryContent(locale);

  return (
    <Section background="default" className="py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <Eyebrow>{origin.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
            {origin.title}
          </h2>
        </div>
        <div className="grid gap-5">
          <article className="rounded-[2rem] border border-line bg-surface-tint p-6 depth-layered sm:p-8">
            <div className="grid gap-5 text-base leading-8 text-secondary">
              {origin.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
          <aside className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-graphite">{origin.signalsTitle}</h3>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {origin.signals.map((signal) => (
                <li key={signal} className="rounded-2xl border border-line-soft bg-surface-tint px-4 py-3 text-sm leading-relaxed text-secondary">
                  {signal}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function CompanyTimeline({ locale }: { locale: Locale }) {
  const { timeline } = getAboutStoryContent(locale);

  return (
    <Section background="soft" className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
          <div>
            <Eyebrow>{timeline.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
              {timeline.title}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-7 text-secondary lg:justify-self-end">{timeline.intro}</p>
        </div>

        <ol className="relative mt-10 grid gap-4" aria-label={timeline.title}>
          {timeline.entries.map((entry, index) => (
            <li key={entry.year} className="relative grid gap-4 rounded-[1.75rem] border border-line bg-white p-5 depth-layered md:grid-cols-[9rem_1fr] md:p-6">
              <div className="flex items-center gap-3 md:block">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-bold text-white md:h-14 md:w-14">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xl font-semibold tracking-tight text-brand-teal md:mt-4 md:block">{entry.year}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-graphite">{entry.title}</h3>
                <p className="mt-2 max-w-4xl text-sm leading-7 text-secondary sm:text-base">{entry.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function MethodologyShaping({ locale }: { locale: Locale }) {
  const { methodology } = getAboutStoryContent(locale);

  return (
    <Section background="default" className="py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr]">
        <div className="rounded-[2rem] border border-line bg-brand-gradient-soft p-6 depth-layered lg:sticky lg:top-24 lg:h-fit">
          <Eyebrow>{methodology.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">{methodology.title}</h2>
          <p className="mt-4 text-base leading-7 text-secondary">{methodology.intro}</p>
          <div className="mt-6 grid gap-3">
            {[Search, ShieldCheck, Sparkles].map((Icon, index) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/84 px-4 py-3 text-sm font-semibold text-graphite">
                <Icon className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                <span>{methodology.capabilities[index]?.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {methodology.capabilities.map((capability, index) => (
            <CapabilityRow key={capability.id} capability={capability} index={index} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CapabilityRow({
  capability,
  index,
  locale,
}: {
  capability: AboutStoryCapability;
  index: number;
  locale: Locale;
}) {
  const content = getAboutStoryContent(locale);

  return (
    <article className="grid gap-4 rounded-[1.75rem] border border-line bg-white p-5 shadow-sm transition hover:border-brand-teal/30 md:grid-cols-[3.75rem_1fr] md:p-6">
      <div className="flex items-center gap-3 md:block">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-tint text-sm font-bold text-brand-teal">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-graphite">{capability.title}</h3>
        <p className="mt-2 text-sm leading-7 text-secondary sm:text-base">{capability.body}</p>
        <div className="mt-4 flex flex-wrap gap-2" aria-label={content.methodology.relatedLabel}>
          {capability.caseStudySlugs.map((slug) => (
            <CaseStudyChip key={slug} slug={slug} locale={locale} />
          ))}
        </div>
      </div>
    </article>
  );
}

function CaseStudyChip({ slug, locale }: { slug: CaseStudySlug; locale: Locale }) {
  const caseStudy = getCaseStudyBySlug(slug, locale);
  const logo = getPublicClientLogoAssetByCaseStudySlug(slug);
  const label = caseStudy?.shortName ?? caseStudy?.clientName ?? slug;

  return (
    <Link
      href={localizePath(`/work/case-studies/${slug}`, locale)}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-tint px-3 py-1.5 text-xs font-semibold text-graphite transition hover:border-brand-teal/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
    >
      {logo ? (
        <span className="inline-flex h-7 w-12 items-center justify-center overflow-hidden rounded-full bg-graphite px-1.5">
          <img src={logo.logoPath} alt="" width={logo.width} height={logo.height} className="max-h-5 w-auto object-contain" />
        </span>
      ) : null}
      <span>{label}</span>
    </Link>
  );
}

function Leadership({ locale }: { locale: Locale }) {
  const { leadership } = getAboutStoryContent(locale);

  return (
    <Section background="tint" className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{leadership.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">{leadership.title}</h2>
          <p className="mt-4 text-base leading-7 text-secondary">{leadership.intro}</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {leadership.leaders.map((leader) => (
            <LeaderCard key={leader.name} leader={leader} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function LeaderCard({ leader, locale }: { leader: AboutStoryLeader; locale: Locale }) {
  const { leadership } = getAboutStoryContent(locale);

  return (
    <article className="grid gap-5 rounded-[2rem] border border-line bg-white p-5 depth-layered sm:grid-cols-[12rem_1fr] sm:p-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-brand-teal/20 bg-brand-gradient-soft p-3">
        <div className="aspect-[4/5] overflow-hidden rounded-[1.15rem] border border-white/80 bg-surface-tint">
          <Image
            src={leader.imagePath}
            alt={leader.alt}
            width={leader.imageWidth}
            height={leader.imageHeight}
            sizes="(min-width: 1024px) 12rem, (min-width: 640px) 12rem, calc(100vw - 4rem)"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand-teal/20 bg-surface-tint px-3 py-1 text-xs font-semibold text-brand-teal">
            {leader.title}
          </span>
          <BadgeCheck className="h-5 w-5 text-brand-teal" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-graphite">{leader.name}</h3>
        <p className="mt-3 text-sm leading-7 text-secondary">{leader.summary}</p>
        <p className="mt-3 text-sm leading-7 text-secondary">{leader.longDescription}</p>

        <h4 className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{leadership.focusLabel}</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {leader.focusAreas.map((area) => (
            <li key={area} className="rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-semibold text-secondary">
              {area}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function OperatingModel({ locale }: { locale: Locale }) {
  const { operatingModel } = getAboutStoryContent(locale);

  return (
    <Section background="default" className="py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <Eyebrow>{operatingModel.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">{operatingModel.title}</h2>
          <p className="mt-4 text-base leading-7 text-secondary">{operatingModel.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {operatingModel.links.map((link) => (
              <Link
                key={link.href}
                href={localizePath(link.href, locale)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-graphite shadow-sm transition hover:border-brand-teal/40 hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 text-brand-teal" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <ol className="grid gap-4">
          {operatingModel.principles.map((principle, index) => (
            <li key={principle.title} className="grid gap-4 rounded-[1.75rem] border border-line bg-surface-tint p-5 sm:grid-cols-[3.25rem_1fr]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-brand-teal shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-graphite">{principle.title}</h3>
                <p className="mt-2 text-sm leading-7 text-secondary">{principle.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function CompanyDetails({ locale }: { locale: Locale }) {
  const { company } = getAboutStoryContent(locale);
  const details = [
    { label: company.labels.brand, value: companyDetails.brandName, icon: Building2 },
    { label: company.labels.formal, value: companyDetails.formalName, icon: ShieldCheck },
    { label: company.labels.operator, value: companyDetails.legalOperator, icon: BadgeCheck },
    { label: company.labels.address, value: companyAddressLine(), icon: MapPin },
    { label: company.labels.email, value: companyDetails.email, icon: Mail, href: `mailto:${companyDetails.email}` },
    { label: company.labels.phone, value: companyDetails.phone, icon: Phone, href: `tel:${companyDetails.phone.replace(/[^\d+]/g, "")}` },
  ];

  return (
    <Section background="soft" className="py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <Eyebrow>{company.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">{company.title}</h2>
          <p className="mt-4 text-base leading-7 text-secondary">{company.intro}</p>
        </div>

        <dl className="grid gap-3 rounded-[2rem] border border-line bg-white p-5 depth-layered sm:p-6">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="grid gap-3 rounded-2xl border border-line-soft bg-surface-tint p-4 sm:grid-cols-[13rem_1fr] sm:items-center">
                <dt className="flex items-center gap-3 text-sm font-semibold text-graphite">
                  <Icon className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                  {item.label}
                </dt>
                <dd className="min-w-0 text-sm leading-6 text-secondary">
                  {item.href ? (
                    <a className="break-words font-medium text-brand-teal hover:underline" href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    <span className={cn("break-words", item.value === companyDetails.formalName && "font-semibold text-graphite")}>{item.value}</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </Section>
  );
}

function FinalCta({ locale }: { locale: Locale }) {
  const { finalCta } = getAboutStoryContent(locale);

  return (
    <Section background="default" className="py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-brand-gradient p-px depth-layered">
          <div className="grid gap-6 rounded-[calc(2rem-1px)] bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {finalCta.eyebrow}
              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                {finalCta.title}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-secondary">{finalCta.intro}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <CTAButton href={localizePath(finalCta.primaryCta.href, locale)}>
                {finalCta.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton href={localizePath(finalCta.secondaryCta.href, locale)} variant="secondary">
                {finalCta.secondaryCta.label}
              </CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
