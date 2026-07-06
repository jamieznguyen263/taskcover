import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getTrustContent, getTrustPageContent, trustPagePaths, type TrustPageSlug } from "@/content/trust";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { companyAddressLine, companyDetails } from "@/lib/company";
import { localizePath, type Locale } from "@/lib/i18n";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { CookiePreferencesPanel } from "./cookie-preferences-client";
import { DataRequestForm } from "./data-request-form-client";

export function trustMetadata(slug: TrustPageSlug, locale: Locale): Metadata {
  const page = getTrustPageContent(slug, locale);
  return buildMetadata({
    title: page.meta.title,
    description: page.meta.description,
    path: trustPagePaths[slug],
    locale,
  });
}

export function TrustPage({ slug, locale }: { slug: TrustPageSlug; locale: Locale }) {
  const content = getTrustContent(locale);
  const page = getTrustPageContent(slug, locale);
  const isLegal = ["privacy-policy", "cookie-policy", "terms", "accessibility"].includes(slug);
  const isDataRequest = slug === "data-request";
  const isCookiePreferences = slug === "cookie-preferences";

  const breadcrumb = breadcrumbSchema(
    [
      { name: content.common.home, path: "/" },
      { name: page.breadcrumb, path: trustPagePaths[slug] },
    ],
    locale
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <TrustHero slug={slug} locale={locale} />
      {isCookiePreferences ? (
        <Section background="default" className="pt-8">
          <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <TrustRail slug={slug} locale={locale} />
            <CookiePreferencesPanel locale={locale} />
          </Container>
        </Section>
      ) : isDataRequest ? (
        <Section background="default" className="pt-8">
          <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <TrustRail slug={slug} locale={locale} />
            <DataRequestForm locale={locale} turnstileSiteKey={process.env.TURNSTILE_SITE_KEY} />
          </Container>
        </Section>
      ) : isLegal ? (
        <LegalDocument slug={slug} locale={locale} />
      ) : (
        <EditorialSections slug={slug} locale={locale} />
      )}
      <ContactBand locale={locale} />
    </>
  );
}

function TrustHero({ slug, locale }: { slug: TrustPageSlug; locale: Locale }) {
  const page = getTrustPageContent(slug, locale);
  return (
    <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20">
      <div aria-hidden="true" className="absolute inset-0 bg-line-grid opacity-70" />
      <Container className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
            {page.h1}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-secondary">{page.intro}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {page.primaryCta ? (
              <CTAButton href={localizePath(page.primaryCta.href, locale)}>
                {page.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
            ) : null}
            {page.secondaryCta ? (
              <CTAButton href={localizePath(page.secondaryCta.href, locale)} variant="secondary">
                {page.secondaryCta.label}
              </CTAButton>
            ) : null}
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
              {slug === "about" ? <Building2 className="h-6 w-6" aria-hidden="true" /> : <ShieldCheck className="h-6 w-6" aria-hidden="true" />}
            </span>
            <div>
              <p className="font-semibold text-graphite">{companyDetails.formalName}</p>
              <p className="text-sm text-secondary">{companyDetails.legalOperator}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {page.heroNotes.map((note) => (
              <p key={note} className="rounded-2xl border border-line-soft bg-surface-tint px-4 py-3 text-sm leading-relaxed text-secondary">
                {note}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function EditorialSections({ slug, locale }: { slug: TrustPageSlug; locale: Locale }) {
  const page = getTrustPageContent(slug, locale);
  return (
    <Section background="default">
      <Container className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <TrustRail slug={slug} locale={locale} />
        <div className="grid gap-5">
          {page.sections.map((section, index) => (
            <article key={section.title} className="rounded-3xl border border-line bg-white p-6 depth-layered">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-tint text-sm font-bold text-brand-teal">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-graphite">{section.title}</h2>
                  {section.body ? <p className="mt-3 leading-relaxed text-secondary">{section.body}</p> : null}
                  {section.items ? <SectionList items={section.items} /> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function LegalDocument({ slug, locale }: { slug: TrustPageSlug; locale: Locale }) {
  const content = getTrustContent(locale);
  const page = getTrustPageContent(slug, locale);
  return (
    <Section background="default">
      <Container className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="h-fit rounded-3xl border border-line bg-surface-tint p-5 lg:sticky lg:top-24">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-teal">{content.common.lastUpdated}</p>
          <p className="mt-3 text-sm leading-relaxed text-secondary">{content.common.legalReview}</p>
          <nav aria-label={`${page.breadcrumb} sections`} className="mt-5 grid gap-2">
            {page.sections.map((section) => (
              <a key={section.title} href={`#${idFor(section.title)}`} className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-secondary hover:text-brand-teal">
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
        <article className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            {page.sections.map((section) => (
              <section key={section.title} id={idFor(section.title)} className="scroll-mt-24 border-b border-line-soft py-7 first:pt-0 last:border-b-0">
                <h2 className="text-2xl font-semibold tracking-tight text-graphite">{section.title}</h2>
                {section.body ? <p className="mt-3 leading-7 text-secondary">{section.body}</p> : null}
                {section.items ? <SectionList items={section.items} /> : null}
              </section>
            ))}
          </div>
        </article>
      </Container>
    </Section>
  );
}

function TrustRail({ slug, locale }: { slug: TrustPageSlug; locale: Locale }) {
  const page = getTrustPageContent(slug, locale);
  return (
    <aside className="h-fit rounded-3xl border border-line bg-surface-tint p-5 depth-layered lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-brand-teal" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-graphite">{page.railTitle ?? page.breadcrumb}</h2>
      </div>
      {page.railItems ? <SectionList items={page.railItems} compact /> : null}
    </aside>
  );
}

function SectionList({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <ul className={compact ? "mt-4 grid gap-2" : "mt-4 grid gap-3"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-2xl bg-surface-tint px-4 py-3 text-sm leading-relaxed text-secondary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactBand({ locale }: { locale: Locale }) {
  const content = getTrustContent(locale);
  return (
    <Section background="soft" className="py-14">
      <Container>
        <div className="grid gap-4 rounded-3xl border border-line bg-white p-5 depth-layered md:grid-cols-3">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 shrink-0 text-brand-teal" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-graphite">{content.common.email}</p>
              <a className="text-sm text-secondary hover:text-brand-teal" href={`mailto:${companyDetails.email}`}>{companyDetails.email}</a>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="h-5 w-5 shrink-0 text-brand-teal" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-graphite">{content.common.phone}</p>
              <a className="text-sm text-secondary hover:text-brand-teal" href={`tel:${companyDetails.phone.replace(/[^\d+]/g, "")}`}>{companyDetails.phone}</a>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-brand-teal" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-graphite">{content.common.address}</p>
              <p className="text-sm text-secondary">{companyAddressLine()}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function NotFoundPage({ locale }: { locale: Locale }) {
  const content = getTrustContent(locale).notFound;
  return (
    <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20">
      <div aria-hidden="true" className="absolute inset-0 bg-line-grid opacity-70" />
      <Container className="relative grid min-w-0 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex min-w-0 flex-col gap-5">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="break-words text-balance text-4xl font-semibold leading-tight text-graphite sm:text-5xl">{content.h1}</h1>
          <p className="break-words text-lg leading-relaxed text-secondary">{content.intro}</p>
        </div>
        <nav aria-label={content.eyebrow} className="grid min-w-0 gap-3 sm:grid-cols-2">
          {content.links.map((link) => (
            <Link key={link.href} href={localizePath(link.href, locale)} className="card-lift flex min-h-16 min-w-0 items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4 text-sm font-semibold text-graphite">
              <span className="min-w-0 break-words">{link.label}</span>
              <ArrowRight className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </Container>
    </Section>
  );
}

export function UnavailableState({ locale }: { locale: Locale }) {
  const content = getTrustContent(locale).unavailable;
  return (
    <div className="rounded-3xl border border-line bg-surface-tint p-5">
      <div className="flex items-center gap-3">
        <LifeBuoy className="h-5 w-5 text-brand-teal" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-graphite">{content.title}</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-secondary">{content.body}</p>
    </div>
  );
}

export function GlobalErrorView({ locale, onRetry }: { locale: Locale; onRetry: () => void }) {
  const content = getTrustContent(locale).error;
  return (
    <main className="min-h-screen bg-surface-tint px-5 py-16 text-graphite">
      <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 depth-layered">
        <FileText className="h-10 w-10 text-brand-teal" aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">{content.h1}</h1>
        <p className="mt-3 text-secondary">{content.intro}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onRetry} className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white">
            {content.retry}
          </button>
          <Link href={localizePath("/", locale)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-graphite">
            {content.home}
          </Link>
          <Link href={localizePath("/contact", locale)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-graphite">
            {content.contact}
          </Link>
        </div>
      </div>
    </main>
  );
}

function idFor(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
