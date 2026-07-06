import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, Mail, Network, Radar, SearchCheck, ShieldCheck } from "lucide-react";
import type { LeadsContent } from "@/content/leads.types";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { companyAddressLine, companyDetails } from "@/lib/company";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { ThankYouAnalytics } from "@/components/marketing/analytics/thank-you-analytics";
import { FreeSeoAuditForm, StrategyCallForm, ContactForm } from "./lead-form-client";

type PageProps = {
  content: LeadsContent;
  locale: Locale;
  turnstileSiteKey?: string;
};

function localized(locale: Locale, path: string) {
  return localizePath(path, locale);
}

function dataRequestLabel(locale: Locale) {
  if (locale === "fr") return "Demande de donnees / confidentialite";
  if (locale === "es") return "Solicitud de datos / privacidad";
  return "Data request / privacy request";
}

export function FreeSeoAuditPageView({ content, turnstileSiteKey }: PageProps) {
  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20">
        <div aria-hidden="true" className="absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-6">
            <Eyebrow>{content.freeAudit.eyebrow}</Eyebrow>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl">
              {content.freeAudit.h1}
            </h1>
            <p className="max-w-2xl text-lg text-secondary">{content.freeAudit.intro}</p>
            <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                  <Radar className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-graphite">{content.freeAudit.previewTitle}</p>
                  <p className="text-sm text-secondary">{content.freeAudit.previewIntro}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {content.freeAudit.previewItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl bg-surface-tint px-3 py-2 text-sm text-secondary">
                    <SearchCheck className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <p className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-secondary">{content.freeAudit.proof}</p>
          </div>
          <FreeSeoAuditForm content={content} turnstileSiteKey={turnstileSiteKey} />
        </Container>
      </Section>
      <Section background="default">
        <Container className="grid gap-4 md:grid-cols-3">
          {content.freeAudit.steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-line bg-white p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-surface-tint text-sm font-bold text-brand-teal">
                {index + 1}
              </span>
              <h2 className="mt-4 text-lg font-semibold text-graphite">{step.title}</h2>
              <p className="mt-2 text-sm text-secondary">{step.description}</p>
            </div>
          ))}
        </Container>
      </Section>
      <Section background="soft">
        <Container>
          <div className="grid gap-4 rounded-3xl border border-line bg-white p-6 md:grid-cols-[auto_1fr]">
            <ShieldCheck className="h-10 w-10 text-brand-teal" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-graphite">{content.freeAudit.privacyTitle}</h2>
              <p className="mt-2 text-secondary">{content.freeAudit.privacyBody}</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function BookCallPageView({ content, turnstileSiteKey }: PageProps) {
  return (
    <Section background="tint" className="pt-16 sm:pt-20">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <Eyebrow>{content.bookCall.eyebrow}</Eyebrow>
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] text-graphite sm:text-5xl">
            {content.bookCall.h1}
          </h1>
          <p className="text-lg text-secondary">{content.bookCall.intro}</p>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-8 w-8 text-brand-teal" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-graphite">{content.bookCall.agendaTitle}</h2>
              </div>
              <ol className="mt-4 grid gap-3">
                {content.bookCall.agenda.map((item, index) => (
                  <li key={item} className="flex items-center gap-3 rounded-xl bg-surface-tint px-3 py-2 text-sm text-secondary">
                    <span className="font-bold text-brand-teal">{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-graphite">{content.bookCall.prepareTitle}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {content.bookCall.prepare.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-surface-tint px-3 py-1.5 text-sm text-secondary">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <p className="rounded-2xl border border-brand-teal/20 bg-white p-4 text-sm text-secondary">
              {content.bookCall.boundary}
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
          <StrategyCallForm content={content} turnstileSiteKey={turnstileSiteKey} />
        </div>
      </Container>
    </Section>
  );
}

export function ContactPageView({
  content,
  locale,
  initialIntent,
  turnstileSiteKey,
}: PageProps & { initialIntent: string }) {
  return (
    <>
      <Section background="default" className="pt-16 sm:pt-20">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-6">
            <Eyebrow>{content.contact.eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] text-graphite sm:text-5xl">
              {content.contact.h1}
            </h1>
            <p className="text-lg text-secondary">{content.contact.intro}</p>
            <div className="rounded-3xl border border-line bg-white p-5 text-sm leading-relaxed text-secondary">
              <p className="font-semibold text-graphite">{companyDetails.formalName}</p>
              <p>{companyDetails.legalOperator}</p>
              <p>{companyAddressLine()}</p>
              <p>
                <a className="hover:text-brand-teal" href={`mailto:${companyDetails.email}`}>{companyDetails.email}</a>
                {" | "}
                <a className="hover:text-brand-teal" href={`tel:${companyDetails.phone.replace(/[^\d+]/g, "")}`}>{companyDetails.phone}</a>
              </p>
              <Link href={localizePath("/data-request", locale)} className="mt-3 inline-flex font-semibold text-brand-teal">
                {dataRequestLabel(locale)}
              </Link>
            </div>
            <div className="rounded-3xl border border-line bg-surface-tint p-5">
              <div className="flex items-center gap-3">
                <Network className="h-8 w-8 text-brand-teal" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-graphite">{content.contact.deskTitle}</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {content.contact.deskItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-secondary">
                    <ArrowRight className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">{content.contact.intentHelp}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
            <ContactForm content={content} initialIntent={initialIntent} turnstileSiteKey={turnstileSiteKey} />
          </div>
        </Container>
      </Section>
    </>
  );
}

export function ThankYouPageView({
  content,
  locale,
  type,
  bookingUrl,
}: {
  content: LeadsContent;
  locale: Locale;
  type: keyof LeadsContent["thankYou"]["states"];
  bookingUrl?: string;
}) {
  const state = content.thankYou.states[type] ?? content.thankYou.states.contact;
  const showCall = Boolean(bookingUrl) || type !== "strategy-call";
  return (
    <Section background="tint" className="pt-16 sm:pt-20">
      <ThankYouAnalytics locale={locale} requestType={type} />
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-gradient text-white depth-layered">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <Eyebrow>{content.thankYou.meta.title}</Eyebrow>
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] text-graphite sm:text-5xl">{state.title}</h1>
          <p className="text-lg text-secondary">{state.message}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {showCall && (
              <CTAButton href={bookingUrl ?? localized(locale, "/book-a-call")}>
                {state.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
            )}
            <CTAButton variant="secondary" href={localized(locale, "/work")}>
              {state.secondaryCta}
            </CTAButton>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-graphite">
              <ClipboardCheck className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              {content.thankYou.nextLabel}
            </h2>
            <div className="mt-4 grid gap-3">
              {state.next.map((item) => (
                <p key={item} className="rounded-xl bg-surface-tint px-3 py-2 text-sm text-secondary">{item}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-graphite">{content.thankYou.studiesLabel}</h2>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                {state.studies.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href={localized(locale, "/work/case-studies")} className="mt-4 inline-flex text-sm font-semibold text-brand-teal">
                {content.thankYou.viewStudies}
              </Link>
            </div>
            <div className="rounded-3xl border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-graphite">{content.thankYou.samplesLabel}</h2>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                {state.samples.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href={localized(locale, "/work/sample-audits")} className="mt-4 inline-flex text-sm font-semibold text-brand-teal">
                {content.thankYou.viewSamples}
              </Link>
            </div>
          </div>
          <div
            data-conversion-hook="thank-you-view"
            data-request-type={type}
            className="rounded-2xl border border-brand-teal/20 bg-white p-4 text-sm text-muted"
          >
            <Mail className="mr-2 inline h-4 w-4 text-brand-teal" aria-hidden="true" />
            {content.thankYou.analyticsHook}
          </div>
        </div>
      </Container>
    </Section>
  );
}
