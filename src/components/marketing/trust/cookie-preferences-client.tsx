"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Save } from "lucide-react";
import { defaultConsentPreferences, readConsentPreferences, resetConsentPreferences, saveConsentPreferences, type ConsentPreferences } from "@/lib/consent/preferences";
import { localizePath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    title: "Preference controls",
    saved: "Preferences saved.",
    reset: "Preferences reset.",
    save: "Save preferences",
    resetButton: "Reset preferences",
    policy: "Cookie Policy",
    privacy: "Privacy Policy",
    necessary: "Strictly necessary",
    necessaryBody: "Always on. Required for security, Admin sessions, preferences, anti-spam protection, and core functionality.",
    preferences: "Preferences",
    preferencesBody: "Stores choices such as this category state in your browser.",
    analytics: "Analytics",
    analyticsBody: "Allows consent-aware GA4/GTM measurement events only when configured.",
    marketing: "Marketing / advertising",
    marketingBody: "Allows configured ad conversion measurement only after accepted lead submissions.",
  },
  fr: {
    title: "Controles des preferences",
    saved: "Preferences enregistrees.",
    reset: "Preferences reinitialisees.",
    save: "Enregistrer les preferences",
    resetButton: "Reinitialiser",
    policy: "Politique cookies",
    privacy: "Politique de confidentialite",
    necessary: "Strictement necessaires",
    necessaryBody: "Toujours actifs. Requis pour la securite, les sessions Admin, les preferences, l'anti-spam et les fonctions de base.",
    preferences: "Preferences",
    preferencesBody: "Enregistre dans ce navigateur des choix comme l'etat des categories.",
    analytics: "Analytics",
    analyticsBody: "Autorise les evenements de mesure GA4/GTM avec consentement uniquement si la configuration existe.",
    marketing: "Marketing / publicite",
    marketingBody: "Autorise la mesure publicitaire configuree seulement apres acceptation durable d'un lead.",
  },
  es: {
    title: "Controles de preferencias",
    saved: "Preferencias guardadas.",
    reset: "Preferencias reiniciadas.",
    save: "Guardar preferencias",
    resetButton: "Reiniciar",
    policy: "Politica de cookies",
    privacy: "Politica de privacidad",
    necessary: "Estrictamente necesarias",
    necessaryBody: "Siempre activas. Requeridas para seguridad, sesiones Admin, preferencias, anti-spam y funcionalidad basica.",
    preferences: "Preferencias",
    preferencesBody: "Guarda en este navegador elecciones como el estado de categorias.",
    analytics: "Analytics",
    analyticsBody: "Permite eventos de medicion GA4/GTM con consentimiento solo si existe configuracion.",
    marketing: "Marketing / publicidad",
    marketingBody: "Permite medicion publicitaria configurada solo despues de leads aceptados.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function CookiePreferencesPanel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [state, setState] = React.useState<ConsentPreferences>(() => readConsentPreferences() ?? { ...defaultConsentPreferences, locale });
  const [notice, setNotice] = React.useState("");

  function update(key: "preferences" | "analytics" | "marketing", checked: boolean) {
    setState((current) => ({ ...current, [key]: checked }));
  }

  function save() {
    const saved = saveConsentPreferences({
      preferences: state.preferences,
      analytics: state.analytics,
      marketing: state.marketing,
      locale,
      source: "preferences_page",
    });
    setState(saved);
    setNotice(t.saved);
  }

  function reset() {
    resetConsentPreferences();
    setState({ ...defaultConsentPreferences, locale });
    setNotice(t.reset);
  }

  return (
    <section className="rounded-3xl border border-line bg-white p-5 depth-layered" aria-labelledby="cookie-preference-title">
      <h2 id="cookie-preference-title" className="text-2xl font-semibold text-graphite">{t.title}</h2>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link href={localizePath("/cookie-policy", locale)} className="font-semibold text-brand-teal hover:underline">{t.policy}</Link>
        <Link href={localizePath("/privacy-policy", locale)} className="font-semibold text-brand-teal hover:underline">{t.privacy}</Link>
      </div>
      <div className="mt-5 grid gap-4">
        <ToggleRow title={t.necessary} body={t.necessaryBody} checked disabled onChange={() => undefined} />
        <ToggleRow title={t.preferences} body={t.preferencesBody} checked={state.preferences} onChange={(checked) => update("preferences", checked)} />
        <ToggleRow title={t.analytics} body={t.analyticsBody} checked={state.analytics} onChange={(checked) => update("analytics", checked)} />
        <ToggleRow title={t.marketing} body={t.marketingBody} checked={state.marketing} onChange={(checked) => update("marketing", checked)} />
      </div>
      <p className="mt-4 min-h-6 text-sm font-medium text-brand-teal" aria-live="polite">{notice}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={save} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white">
          <Save className="h-4 w-4" aria-hidden="true" />
          {t.save}
        </button>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-graphite">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.resetButton}
        </button>
      </div>
    </section>
  );
}

function ToggleRow({
  title,
  body,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex min-h-16 items-start justify-between gap-4 rounded-2xl border border-line bg-surface-tint p-4">
      <span>
        <span className="block font-semibold text-graphite">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-secondary">{body}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-brand-teal"
      />
    </label>
  );
}
