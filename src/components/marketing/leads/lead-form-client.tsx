"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Mail, RotateCw } from "lucide-react";
import type { LeadsContent, LeadOption } from "@/content/leads.types";
import type { LeadRequestType, LeadSubmissionResult } from "@/lib/leads/types";
import { trackLeadEvent } from "@/lib/leads/analytics";
import { cn } from "@/lib/utils";

type FormState = Record<string, string | string[] | boolean | undefined>;
type Errors = Record<string, string[]>;

type LeadFormProps = {
  content: LeadsContent;
  turnstileSiteKey?: string;
};

const inputClass =
  "min-h-11 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-graphite shadow-sm transition focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/25";
const labelClass = "text-sm font-semibold text-graphite";

function msg(content: LeadsContent, key: string) {
  return content.validation[key as keyof typeof content.validation] ?? key;
}

function mailto(content: LeadsContent, type: LeadRequestType) {
  const subject = encodeURIComponent(content.common.mailSubjects[type] ?? content.common.mailSubjects.other);
  return `mailto:${content.recipientEmail}?subject=${subject}`;
}

function ErrorList({ errors, content }: { errors: Errors; content: LeadsContent }) {
  const entries = Object.entries(errors).filter(([, value]) => value.length > 0);
  if (entries.length === 0) return null;
  return (
    <div
      id="lead-error-summary"
      tabIndex={-1}
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
    >
      <p className="font-semibold">{content.common.validationSummary}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {entries.slice(0, 5).map(([field, values]) => (
          <li key={field}>{msg(content, values[0] ?? "required")}</li>
        ))}
      </ul>
    </div>
  );
}

function FieldError({ field, errors, content }: { field: string; errors: Errors; content: LeadsContent }) {
  const first = errors[field]?.[0];
  if (!first) return null;
  return (
    <p id={`${field}-error`} className="text-sm font-medium text-red-700">
      {msg(content, first)}
    </p>
  );
}

function TextField({
  name,
  type = "text",
  required,
  content,
  state,
  setState,
  errors,
  autoComplete,
  inputMode,
}: {
  name: string;
  type?: string;
  required?: boolean;
  content: LeadsContent;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Errors;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const field = content.fields[name];
  const value = typeof state[name] === "string" ? state[name] : "";
  const errorId = errors[name]?.length ? `${name}-error` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass} htmlFor={name}>
        {field.label} {!required && <span className="font-normal text-muted">({content.common.optional})</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={field.placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(errors[name]?.length)}
        aria-describedby={errorId}
        className={cn(inputClass, errors[name]?.length && "border-red-300 bg-red-50")}
        onChange={(event) => setState((prev) => ({ ...prev, [name]: event.target.value }))}
      />
      <FieldError field={name} errors={errors} content={content} />
    </div>
  );
}

function TextAreaField({
  name,
  required,
  content,
  state,
  setState,
  errors,
}: {
  name: string;
  required?: boolean;
  content: LeadsContent;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Errors;
}) {
  const field = content.fields[name];
  const value = typeof state[name] === "string" ? state[name] : "";
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass} htmlFor={name}>
        {field.label} {!required && <span className="font-normal text-muted">({content.common.optional})</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={5}
        value={value}
        placeholder={field.placeholder}
        required={required}
        aria-invalid={Boolean(errors[name]?.length)}
        aria-describedby={errors[name]?.length ? `${name}-error` : undefined}
        className={cn(inputClass, "resize-y", errors[name]?.length && "border-red-300 bg-red-50")}
        onChange={(event) => setState((prev) => ({ ...prev, [name]: event.target.value }))}
      />
      <FieldError field={name} errors={errors} content={content} />
    </div>
  );
}

function SelectField({
  name,
  options,
  required,
  content,
  state,
  setState,
  errors,
}: {
  name: string;
  options: LeadOption[];
  required?: boolean;
  content: LeadsContent;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Errors;
}) {
  const value = typeof state[name] === "string" ? state[name] : "";
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass} htmlFor={name}>
        {content.fields[name].label} {!required && <span className="font-normal text-muted">({content.common.optional})</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        aria-invalid={Boolean(errors[name]?.length)}
        aria-describedby={errors[name]?.length ? `${name}-error` : undefined}
        className={cn(inputClass, errors[name]?.length && "border-red-300 bg-red-50")}
        onChange={(event) => setState((prev) => ({ ...prev, [name]: event.target.value }))}
      >
        <option value="">{content.fields[name].label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError field={name} errors={errors} content={content} />
    </div>
  );
}

function ChoiceGroup({
  name,
  options,
  required,
  multiple = true,
  content,
  state,
  setState,
  errors,
}: {
  name: string;
  options: LeadOption[];
  required?: boolean;
  multiple?: boolean;
  content: LeadsContent;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Errors;
}) {
  const selected = Array.isArray(state[name])
    ? (state[name] as string[])
    : typeof state[name] === "string"
      ? [state[name] as string]
      : [];
  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={errors[name]?.length ? `${name}-error` : undefined}>
      <legend className={labelClass}>
        {content.fields[name].label} {!required && <span className="font-normal text-muted">({content.common.optional})</span>}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-3 text-sm font-medium text-secondary shadow-sm transition",
                active ? "border-brand-teal bg-surface-tint text-graphite" : "border-line hover:border-brand-teal/40"
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={active}
                className="h-4 w-4 accent-brand-teal"
                onChange={() => {
                  setState((prev) => {
                    if (!multiple) return { ...prev, [name]: option.value };
                    const current = Array.isArray(prev[name]) ? (prev[name] as string[]) : [];
                    return {
                      ...prev,
                      [name]: current.includes(option.value)
                        ? current.filter((item) => item !== option.value)
                        : [...current, option.value],
                    };
                  });
                }}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError field={name} errors={errors} content={content} />
    </fieldset>
  );
}

function Consent({ content, state, setState, errors }: {
  content: LeadsContent;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Errors;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface-tint p-4">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-secondary">
        <input
          name="consent"
          type="checkbox"
          checked={state.consent === true}
          className="mt-1 h-4 w-4 accent-brand-teal"
          aria-invalid={Boolean(errors.consent?.length)}
          onChange={(event) => setState((prev) => ({ ...prev, consent: event.target.checked }))}
        />
        <span>{content.common.consentText}</span>
      </label>
      <FieldError field="consent" errors={errors} content={content} />
    </div>
  );
}

function Honeypot({ content }: { content: LeadsContent }) {
  return (
    <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website">{content.common.honeypotLabel}</label>
      <input id="website" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function Turnstile({ siteKey, content }: { siteKey?: string; content: LeadsContent }) {
  if (!siteKey) return null;
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <p className="mb-3 text-sm font-semibold text-graphite">{content.common.turnstileLabel}</p>
      <div className="cf-turnstile" data-sitekey={siteKey} />
    </div>
  );
}

function makePayload(form: HTMLFormElement | null, state: FormState, requestType: LeadRequestType, locale: string, pathname: string) {
  const formData = form ? new FormData(form) : new FormData();
  const utm = Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].map((key) => [
      key.replace("utm_", ""),
      new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get(key) ?? "",
    ])
  );
  return {
    ...state,
    requestType,
    locale,
    sourcePath: pathname,
    website: String(formData.get("website") ?? ""),
    turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
    utm,
  };
}

function clientValidate(content: LeadsContent, state: FormState, fields: string[]): Errors {
  const errors: Errors = {};
  for (const field of fields) {
    const value = state[field];
    const empty = Array.isArray(value) ? value.length === 0 : value === undefined || value === "";
    if (empty) errors[field] = ["required"];
  }
  if (fields.includes("workEmail")) {
    const email = String(state.workEmail ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.workEmail = ["email"];
  }
  if (fields.includes("websiteUrl")) {
    const raw = String(state.websiteUrl ?? "");
    if (raw) {
      try {
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
        if (!url.hostname.includes(".")) errors.websiteUrl = ["url"];
      } catch {
        errors.websiteUrl = ["url"];
      }
    }
  }
  if (fields.includes("preferredCallWindows")) {
    const windows = Array.isArray(state.preferredCallWindows) ? state.preferredCallWindows : [];
    if (windows.length < 2 || windows.length > 3) errors.preferredCallWindows = ["callWindows"];
  }
  if (fields.includes("consent") && state.consent !== true) errors.consent = ["consent"];
  return errors;
}

function focusFirstError(errors: Errors) {
  window.requestAnimationFrame(() => {
    const first = Object.keys(errors)[0];
    const target = first ? document.querySelector<HTMLElement>(`[name="${first}"], #lead-error-summary`) : null;
    target?.focus();
  });
}

function useSubmitLead(content: LeadsContent, requestType: LeadRequestType, requiredFields: string[]) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const formRef = React.useRef<HTMLFormElement>(null);
  const statusRef = React.useRef<HTMLDivElement>(null);
  const [errors, setErrors] = React.useState<Errors>({});
  const [notice, setNotice] = React.useState<string>("");
  const [pending, setPending] = React.useState(false);

  async function submit(state: FormState) {
    const localErrors = clientValidate(content, state, requiredFields);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      trackLeadEvent("lead_form_validation_error", { formType: requestType, locale: content.locale, category: "client" });
      focusFirstError(localErrors);
      return;
    }

    setPending(true);
    setNotice("");
    setErrors({});
    trackLeadEvent("lead_form_submit_attempt", { formType: requestType, locale: content.locale });
    if (requestType === "strategy-call") trackLeadEvent("strategy_call_request", { formType: requestType, locale: content.locale });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(makePayload(formRef.current, state, requestType, content.locale, pathname)),
      });
      const result = (await response.json()) as LeadSubmissionResult;
      if (result.status === "success" && result.redirectPath) {
        trackLeadEvent("lead_form_success", { formType: requestType, locale: content.locale, category: "accepted" });
        router.push(result.redirectPath);
        return;
      }
      if (result.status === "validation-error" && result.fieldErrors) {
        setErrors(result.fieldErrors);
        trackLeadEvent("lead_form_validation_error", { formType: requestType, locale: content.locale, category: "server" });
        focusFirstError(result.fieldErrors);
        return;
      }
      if (result.status === "not-configured") {
        setNotice(content.common.unavailableBody);
        trackLeadEvent("lead_form_delivery_unavailable", { formType: requestType, locale: content.locale, category: "not-configured" });
      } else if (result.status === "spam-rejected") {
        setNotice(content.common.spamError);
        trackLeadEvent("lead_form_error", { formType: requestType, locale: content.locale, category: "spam" });
      } else {
        setNotice(content.common.temporaryError);
        trackLeadEvent("lead_form_error", { formType: requestType, locale: content.locale, category: "temporary" });
      }
      statusRef.current?.focus();
    } catch {
      setNotice(content.common.temporaryError);
      trackLeadEvent("lead_form_error", { formType: requestType, locale: content.locale, category: "network" });
      statusRef.current?.focus();
    } finally {
      setPending(false);
    }
  }

  return { formRef, statusRef, errors, setErrors, notice, pending, submit };
}

function FallbackNotice({ notice, content, requestType, statusRef }: {
  notice: string;
  content: LeadsContent;
  requestType: LeadRequestType;
  statusRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!notice) return null;
  return (
    <div
      ref={statusRef}
      tabIndex={-1}
      aria-live="polite"
      className="rounded-2xl border border-brand-teal/25 bg-surface-tint p-5 text-sm text-secondary"
    >
      <p className="font-semibold text-graphite">{content.common.unavailableTitle}</p>
      <p className="mt-2">{notice}</p>
      <a
        href={mailto(content, requestType)}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        {content.common.directEmail}
      </a>
    </div>
  );
}

export function FreeSeoAuditForm({ content, turnstileSiteKey }: LeadFormProps) {
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<FormState>({ consent: false, serviceInterests: [] });
  const requiredByStep = [
    ["name", "workEmail", "company", "websiteUrl"],
    ["market", "industry", "serviceInterests"],
    ["primaryChallenge", "goals", "timeline", "consent"],
  ];
  const allRequired = requiredByStep.flat();
  const { formRef, statusRef, errors, setErrors, notice, pending, submit } = useSubmitLead(content, "seo-audit", allRequired);

  React.useEffect(() => {
    trackLeadEvent("lead_form_view", { formType: "seo-audit", locale: content.locale, step: step + 1 });
  }, [content.locale, step]);

  function next() {
    const localErrors = clientValidate(content, state, requiredByStep[step]);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      trackLeadEvent("lead_form_validation_error", { formType: "seo-audit", locale: content.locale, step: step + 1 });
      focusFirstError(localErrors);
      return;
    }
    trackLeadEvent("lead_form_step_complete", { formType: "seo-audit", locale: content.locale, step: step + 1 });
    setErrors({});
    setStep((current) => Math.min(2, current + 1));
  }

  return (
    <form ref={formRef} className="relative flex flex-col gap-6" onSubmit={(event) => { event.preventDefault(); void submit(state); }}>
      <Honeypot content={content} />
      <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
        <div className="mb-5">
          <p className="text-sm font-semibold text-brand-teal">
            {content.freeAudit.steps[step].title} - {step + 1}/3
          </p>
          <div className="mt-3 h-2 rounded-full bg-surface-tint">
            <div className="h-2 rounded-full bg-brand-gradient transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-secondary">{content.freeAudit.steps[step].description}</p>
        </div>
        <ErrorList errors={errors} content={content} />
        <div className="mt-5 grid gap-4">
          {step === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="name" required content={content} state={state} setState={setState} errors={errors} autoComplete="name" />
                <TextField name="workEmail" type="email" required content={content} state={state} setState={setState} errors={errors} autoComplete="email" inputMode="email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="company" required content={content} state={state} setState={setState} errors={errors} autoComplete="organization" />
                <TextField name="role" content={content} state={state} setState={setState} errors={errors} autoComplete="organization-title" />
              </div>
              <TextField name="websiteUrl" type="url" required content={content} state={state} setState={setState} errors={errors} inputMode="url" />
            </>
          )}
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="market" required options={content.options.markets} content={content} state={state} setState={setState} errors={errors} />
                <SelectField name="industry" required options={content.options.industries} content={content} state={state} setState={setState} errors={errors} />
              </div>
              <ChoiceGroup name="serviceInterests" required options={content.options.services} content={content} state={state} setState={setState} errors={errors} />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="currentTrafficRange" options={content.options.traffic} content={content} state={state} setState={setState} errors={errors} />
                <SelectField name="paidSearchActivity" options={content.options.paidSearch} content={content} state={state} setState={setState} errors={errors} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <TextAreaField name="primaryChallenge" required content={content} state={state} setState={setState} errors={errors} />
              <TextAreaField name="goals" required content={content} state={state} setState={setState} errors={errors} />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="timeline" required options={content.options.timelines} content={content} state={state} setState={setState} errors={errors} />
                <SelectField name="investmentRange" options={content.options.investments} content={content} state={state} setState={setState} errors={errors} />
              </div>
              <TextAreaField name="message" content={content} state={state} setState={setState} errors={errors} />
              <Consent content={content} state={state} setState={setState} errors={errors} />
              <Turnstile siteKey={turnstileSiteKey} content={content} />
            </>
          )}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0 || pending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-graphite disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {content.common.back}
          </button>
          {step < 2 ? (
            <button type="button" onClick={next} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white">
              {content.common.continue}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {pending ? <RotateCw className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
              {pending ? content.common.submitting : content.common.submit}
            </button>
          )}
        </div>
      </div>
      <FallbackNotice notice={notice} content={content} requestType="seo-audit" statusRef={statusRef} />
    </form>
  );
}

export function StrategyCallForm({ content, turnstileSiteKey }: LeadFormProps) {
  const [state, setState] = React.useState<FormState>({ consent: false, serviceInterests: [], preferredCallWindows: [] });
  const required = ["name", "workEmail", "company", "websiteUrl", "market", "serviceInterests", "preferredTimeZone", "preferredCallWindows", "consent"];
  const { formRef, statusRef, errors, notice, pending, submit } = useSubmitLead(content, "strategy-call", required);
  React.useEffect(() => trackLeadEvent("lead_form_view", { formType: "strategy-call", locale: content.locale }), [content.locale]);
  return (
    <form ref={formRef} className="relative flex flex-col gap-5" onSubmit={(event) => { event.preventDefault(); void submit(state); }}>
      <Honeypot content={content} />
      <ErrorList errors={errors} content={content} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" required content={content} state={state} setState={setState} errors={errors} autoComplete="name" />
        <TextField name="workEmail" type="email" required content={content} state={state} setState={setState} errors={errors} autoComplete="email" inputMode="email" />
        <TextField name="company" required content={content} state={state} setState={setState} errors={errors} autoComplete="organization" />
        <TextField name="role" content={content} state={state} setState={setState} errors={errors} autoComplete="organization-title" />
      </div>
      <TextField name="websiteUrl" type="url" required content={content} state={state} setState={setState} errors={errors} inputMode="url" />
      <SelectField name="market" required options={content.options.markets} content={content} state={state} setState={setState} errors={errors} />
      <ChoiceGroup name="serviceInterests" required options={content.options.services} content={content} state={state} setState={setState} errors={errors} />
      <div className="rounded-3xl border border-line bg-surface-tint p-4">
        <SelectField name="preferredTimeZone" required options={content.options.timeZones} content={content} state={state} setState={setState} errors={errors} />
        <div className="mt-4">
          <ChoiceGroup name="preferredCallWindows" required options={content.options.callWindows} content={content} state={state} setState={setState} errors={errors} />
        </div>
      </div>
      <TextAreaField name="message" content={content} state={state} setState={setState} errors={errors} />
      <Consent content={content} state={state} setState={setState} errors={errors} />
      <Turnstile siteKey={turnstileSiteKey} content={content} />
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? <RotateCw className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
        {pending ? content.common.submitting : content.common.submit}
      </button>
      <FallbackNotice notice={notice} content={content} requestType="strategy-call" statusRef={statusRef} />
    </form>
  );
}

function intentToRequestType(intent: string): LeadRequestType {
  if (intent === "media") return "media-inquiry";
  if (intent === "private-reference") return "private-reference";
  if (intent === "partnership") return "partnership";
  if (intent === "seo-mentor") return "seo-mentor";
  if (intent === "ppc") return "ppc-inquiry";
  if (intent === "other") return "other";
  return "general-contact";
}

export function ContactForm({ content, initialIntent, turnstileSiteKey }: LeadFormProps & { initialIntent: string }) {
  const [intent, setIntent] = React.useState(initialIntent);
  const [state, setState] = React.useState<FormState>({ consent: false, requestType: initialIntent });
  const requestType = intentToRequestType(intent);
  const required = ["name", "workEmail", "message", "consent"];
  const { formRef, statusRef, errors, notice, pending, submit } = useSubmitLead(content, requestType, required);

  React.useEffect(() => {
    trackLeadEvent("lead_form_view", { formType: "contact", locale: content.locale, intent });
  }, [content.locale, intent]);

  return (
    <form ref={formRef} className="relative flex flex-col gap-5" onSubmit={(event) => { event.preventDefault(); void submit({ ...state, requestType }); }}>
      <Honeypot content={content} />
      <ErrorList errors={errors} content={content} />
      <fieldset className="rounded-3xl border border-line bg-white p-4">
        <legend className="px-1 text-sm font-semibold text-graphite">{content.fields.serviceInterests.label}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {content.options.contactIntents.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition",
                intent === option.value ? "border-brand-teal bg-surface-tint text-graphite" : "border-line bg-white text-secondary"
              )}
              onClick={() => {
                setIntent(option.value);
                setState((prev) => ({ ...prev, requestType: intentToRequestType(option.value) }));
                trackLeadEvent("contact_intent_selected", { formType: "contact", locale: content.locale, intent: option.value });
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" required content={content} state={state} setState={setState} errors={errors} autoComplete="name" />
        <TextField name="workEmail" type="email" required content={content} state={state} setState={setState} errors={errors} autoComplete="email" inputMode="email" />
        <TextField name="company" content={content} state={state} setState={setState} errors={errors} autoComplete="organization" />
        <TextField name="websiteUrl" type="url" content={content} state={state} setState={setState} errors={errors} inputMode="url" />
      </div>
      {intent === "private-reference" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField name="engagementType" options={content.options.engagementTypes} content={content} state={state} setState={setState} errors={errors} />
          <SelectField name="serviceInterests" options={content.options.services} content={content} state={state} setState={setState} errors={errors} />
        </div>
      )}
      {intent === "media" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="publication" content={content} state={state} setState={setState} errors={errors} />
          <TextField name="topic" content={content} state={state} setState={setState} errors={errors} />
          <TextField name="deadline" content={content} state={state} setState={setState} errors={errors} />
          <SelectField name="requestedFormat" options={content.options.requestedFormats} content={content} state={state} setState={setState} errors={errors} />
        </div>
      )}
      <TextAreaField name="message" required content={content} state={state} setState={setState} errors={errors} />
      <Consent content={content} state={state} setState={setState} errors={errors} />
      <Turnstile siteKey={turnstileSiteKey} content={content} />
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? <RotateCw className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
        {pending ? content.common.submitting : content.common.submit}
      </button>
      <FallbackNotice notice={notice} content={content} requestType={requestType} statusRef={statusRef} />
    </form>
  );
}
