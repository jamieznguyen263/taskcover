"use client";

import * as React from "react";
import Script from "next/script";
import { Check, Mail, RotateCw } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { companyDetails } from "@/lib/company";
import type { LeadSubmissionResult } from "@/lib/leads/types";

const copy = {
  en: {
    title: "Data request form",
    name: "Name",
    email: "Email",
    company: "Company",
    website: "Website",
    requestType: "Request type",
    message: "Message / context",
    consent: "I understand Taskcover may need to verify my identity before acting on this request.",
    submit: "Submit data request",
    submitting: "Submitting",
    required: "Please complete the required fields.",
    fallbackTitle: "Use direct email",
    fallback: `The provider is not available right now. Send your request to ${companyDetails.email}.`,
    temporary: "The request could not be submitted. Please try again or use direct email.",
    success: "Request accepted. Taskcover will review the details and use the provided email for follow-up if verification is needed.",
    turnstile: "Security check",
    directEmail: "Email Taskcover",
    options: ["Access my information", "Correct my information", "Delete my information", "Opt out of marketing", "Cookie/preferences question", "Other privacy request"],
  },
  fr: {
    title: "Formulaire de demande de données",
    name: "Nom",
    email: "Courriel",
    company: "Entreprise",
    website: "Site web",
    requestType: "Type de demande",
    message: "Message / contexte",
    consent: "Je comprends que Taskcover peut devoir vérifier mon identité avant d'agir sur cette demande.",
    submit: "Envoyer la demande",
    submitting: "Envoi",
    required: "Veuillez remplir les champs obligatoires.",
    fallbackTitle: "Utiliser le courriel direct",
    fallback: `Le prestataire n'est pas disponible maintenant. Envoyez votre demande à ${companyDetails.email}.`,
    temporary: "La demande n'a pas pu être envoyée. Réessayez ou utilisez le courriel direct.",
    success: "Demande acceptée. Taskcover examinera les détails et utilisera le courriel fourni pour le suivi si une vérification est nécessaire.",
    turnstile: "Vérification de sécurité",
    directEmail: "Écrire à Taskcover",
    options: ["Accéder à mes informations", "Corriger mes informations", "Supprimer mes informations", "Me désinscrire du marketing", "Question cookies/préférences", "Autre demande"],
  },
  es: {
    title: "Formulario de solicitud de datos",
    name: "Nombre",
    email: "Email",
    company: "Empresa",
    website: "Sitio web",
    requestType: "Tipo de solicitud",
    message: "Mensaje / contexto",
    consent: "Entiendo que Taskcover puede necesitar verificar mi identidad antes de actuar sobre esta solicitud.",
    submit: "Enviar solicitud",
    submitting: "Enviando",
    required: "Completa los campos requeridos.",
    fallbackTitle: "Usar email directo",
    fallback: `El proveedor no está disponible ahora. Envía tu solicitud a ${companyDetails.email}.`,
    temporary: "La solicitud no pudo enviarse. Inténtalo de nuevo o usa email directo.",
    success: "Solicitud aceptada. Taskcover revisará los detalles y usará el email proporcionado para seguimiento si se necesita verificación.",
    turnstile: "Verificación de seguridad",
    directEmail: "Enviar email a Taskcover",
    options: ["Acceder a mi información", "Corregir mi información", "Eliminar mi información", "Darme de baja de marketing", "Pregunta sobre cookies/preferencias", "Otra solicitud"],
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export function DataRequestForm({ locale, turnstileSiteKey }: { locale: Locale; turnstileSiteKey?: string }) {
  const t = copy[locale];
  const options = t.options as string[];
  const [pending, setPending] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [error, setError] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const required = ["name", "workEmail", "requestDetail", "message"];
    if (required.some((key) => !String(data.get(key) ?? "").trim()) || data.get("consent") !== "on") {
      setError(t.required as string);
      return;
    }
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          requestType: "data-request",
          locale,
          name: data.get("name"),
          workEmail: data.get("workEmail"),
          company: data.get("company"),
          websiteUrl: data.get("websiteUrl"),
          message: `Privacy/data request type: ${data.get("requestDetail")}\n\n${data.get("message")}`,
          consent: true,
          sourcePath: window.location.pathname,
          website: data.get("website"),
          turnstileToken: data.get("cf-turnstile-response"),
        }),
      });
      const result = (await response.json()) as LeadSubmissionResult;
      if (result.status === "success") {
        setNotice(t.success as string);
        form.reset();
        return;
      }
      if (result.status === "not-configured") setError(t.fallback as string);
      else setError(t.temporary as string);
    } catch {
      setError(t.temporary as string);
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="relative rounded-3xl border border-line bg-white p-5 depth-layered" aria-labelledby="data-request-title">
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="privacy-website">Website</label>
        <input id="privacy-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <h2 id="data-request-title" className="text-2xl font-semibold text-graphite">{t.title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field name="name" label={t.name as string} required autoComplete="name" />
        <Field name="workEmail" label={t.email as string} type="email" required autoComplete="email" />
        <Field name="company" label={t.company as string} autoComplete="organization" />
        <Field name="websiteUrl" label={t.website as string} type="url" />
      </div>
      <label className="mt-4 block text-sm font-semibold text-graphite" htmlFor="requestDetail">{t.requestType}</label>
      <select id="requestDetail" name="requestDetail" required className={inputClass}>
        <option value="">{t.requestType}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <label className="mt-4 block text-sm font-semibold text-graphite" htmlFor="message">{t.message}</label>
      <textarea id="message" name="message" required rows={6} className={`${inputClass} resize-y`} />
      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-surface-tint p-4 text-sm text-secondary">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-brand-teal" />
        <span>{t.consent}</span>
      </label>
      {turnstileSiteKey ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <p className="mb-3 text-sm font-semibold text-graphite">{t.turnstile}</p>
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-action="lead-submit" />
        </div>
      ) : null}
      <p className="mt-4 min-h-6 text-sm font-medium text-red-700" aria-live="polite">{error}</p>
      <p className="min-h-6 text-sm font-medium text-brand-teal" aria-live="polite">{notice}</p>
      {error ? (
        <a href={`mailto:${companyDetails.email}?subject=${encodeURIComponent("Taskcover data request")}`} className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-graphite">
          <Mail className="h-4 w-4" aria-hidden="true" />
          {t.directEmail}
        </a>
      ) : null}
      <button type="submit" disabled={pending} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto">
        {pending ? <RotateCw className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}

const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-graphite shadow-sm focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/25";

function Field({ name, label, type = "text", required, autoComplete }: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-graphite" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required={required} autoComplete={autoComplete} className={inputClass} />
    </div>
  );
}

