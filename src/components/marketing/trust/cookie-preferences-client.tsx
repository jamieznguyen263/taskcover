"use client";

import * as React from "react";
import { RotateCcw, Save } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import {
  readConsentPreferences,
  resetConsentPreferences,
  saveConsentPreferences,
  type ConsentPreferences,
} from "@/lib/consent/preferences";

const copy = {
  en: {
    title: "Preference controls",
    saved: "Preferences saved.",
    reset: "Preferences reset.",
    save: "Save preferences",
    resetButton: "Reset preferences",
    necessary: "Strictly necessary",
    necessaryBody: "Always on. Required for security, Admin sessions, preferences, anti-spam protection, and core functionality.",
    preferences: "Preferences",
    preferencesBody: "Stores choices such as this category state in your browser.",
    analytics: "Analytics",
    analyticsBody: "Reserved for future measurement tools. No analytics tags are loaded in this task.",
    marketing: "Marketing / advertising",
    marketingBody: "Reserved for future advertising tags. No marketing tags are loaded in this task.",
  },
  fr: {
    title: "Contrôles des préférences",
    saved: "Préférences enregistrées.",
    reset: "Préférences réinitialisées.",
    save: "Enregistrer les préférences",
    resetButton: "Réinitialiser",
    necessary: "Strictement nécessaires",
    necessaryBody: "Toujours actifs. Requis pour la sécurité, les sessions Admin, les préférences, l'anti-spam et les fonctions de base.",
    preferences: "Préférences",
    preferencesBody: "Enregistre dans ce navigateur des choix comme l'état des catégories.",
    analytics: "Analytics",
    analyticsBody: "Réservé aux futurs outils de mesure. Aucune balise analytics n'est chargée dans cette tâche.",
    marketing: "Marketing / publicité",
    marketingBody: "Réservé aux futures balises publicitaires. Aucune balise marketing n'est chargée dans cette tâche.",
  },
  es: {
    title: "Controles de preferencias",
    saved: "Preferencias guardadas.",
    reset: "Preferencias reiniciadas.",
    save: "Guardar preferencias",
    resetButton: "Reiniciar",
    necessary: "Estrictamente necesarias",
    necessaryBody: "Siempre activas. Requeridas para seguridad, sesiones Admin, preferencias, anti-spam y funcionalidad básica.",
    preferences: "Preferencias",
    preferencesBody: "Guarda en este navegador elecciones como el estado de categorías.",
    analytics: "Analytics",
    analyticsBody: "Reservado para futuras herramientas de medición. No se cargan etiquetas analytics en esta tarea.",
    marketing: "Marketing / publicidad",
    marketingBody: "Reservado para futuras etiquetas publicitarias. No se cargan etiquetas de marketing en esta tarea.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function CookiePreferencesPanel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [state, setState] = React.useState<ConsentPreferences>(() => readConsentPreferences() ?? {
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
    version: "2026-07-05",
    updatedAt: "",
  });
  const [notice, setNotice] = React.useState("");

  function update(key: "preferences" | "analytics" | "marketing", checked: boolean) {
    setState((current) => ({ ...current, [key]: checked }));
  }

  function save() {
    const saved = saveConsentPreferences({
      preferences: state.preferences,
      analytics: state.analytics,
      marketing: state.marketing,
    });
    setState(saved);
    setNotice(t.saved);
  }

  function reset() {
    resetConsentPreferences();
    setState({ necessary: true, preferences: false, analytics: false, marketing: false, version: "2026-07-05", updatedAt: "" });
    setNotice(t.reset);
  }

  return (
    <section className="rounded-3xl border border-line bg-white p-5 depth-layered" aria-labelledby="cookie-preference-title">
      <h2 id="cookie-preference-title" className="text-2xl font-semibold text-graphite">{t.title}</h2>
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
