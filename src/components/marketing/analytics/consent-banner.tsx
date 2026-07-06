"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Save, Settings2, ShieldCheck } from "lucide-react";
import {
  saveConsentPreferences,
  type ConsentPreferences,
  type OptionalConsentCategory,
} from "@/lib/consent/preferences";
import { getLocaleFromPathname, localizePath, type Locale } from "@/lib/i18n";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import { isTrackingExcludedPath } from "@/lib/analytics/routes";
import { useConsentPreferences } from "./use-consent-preferences";

type BannerState = Pick<ConsentPreferences, "preferences" | "analytics" | "marketing">;

export const consentBannerCopy = {
  en: {
    title: "Cookie and measurement choices",
    body: "Taskcover uses necessary storage for security and forms. You can choose whether we use preferences, analytics, and marketing measurement.",
    accept: "Accept all",
    reject: "Reject non-essential",
    customize: "Customize",
    save: "Save choices",
    back: "Back",
    policy: "Cookie Policy",
    preferencesPage: "Cookie Preferences",
    necessary: "Strictly necessary",
    necessaryBody: "Always on for security, forms, consent choices, Admin sessions, and basic site functionality.",
    preferences: "Preferences",
    preferencesBody: "Stores non-essential interface choices in this browser.",
    analytics: "Analytics",
    analyticsBody: "Allows consent-aware measurement events such as safe page views, pricing tab views, and form progress.",
    marketing: "Marketing",
    marketingBody: "Allows configured ad conversion measurement after accepted lead submissions. Remarketing stays off unless configured later.",
    locked: "Always enabled",
  },
  fr: {
    title: "Choix cookies et mesure",
    body: "Taskcover utilise le stockage necessaire pour la securite et les formulaires. Vous choisissez les preferences, analytics et mesure marketing.",
    accept: "Tout accepter",
    reject: "Refuser non essentiels",
    customize: "Personnaliser",
    save: "Enregistrer",
    back: "Retour",
    policy: "Politique cookies",
    preferencesPage: "Preferences cookies",
    necessary: "Strictement necessaires",
    necessaryBody: "Toujours actifs pour la securite, les formulaires, les choix de consentement, les sessions Admin et les fonctions de base.",
    preferences: "Preferences",
    preferencesBody: "Enregistre les choix d'interface non essentiels dans ce navigateur.",
    analytics: "Analytics",
    analyticsBody: "Autorise des evenements de mesure avec consentement, comme pages vues sures, onglets prix et progression formulaire.",
    marketing: "Marketing",
    marketingBody: "Autorise la mesure de conversion publicitaire configuree apres acceptation d'un lead. Le remarketing reste inactif sauf configuration future.",
    locked: "Toujours actif",
  },
  es: {
    title: "Opciones de cookies y medicion",
    body: "Taskcover usa almacenamiento necesario para seguridad y formularios. Puedes elegir preferencias, analytics y medicion de marketing.",
    accept: "Aceptar todo",
    reject: "Rechazar no esenciales",
    customize: "Personalizar",
    save: "Guardar",
    back: "Volver",
    policy: "Politica de cookies",
    preferencesPage: "Preferencias de cookies",
    necessary: "Estrictamente necesarias",
    necessaryBody: "Siempre activas para seguridad, formularios, opciones de consentimiento, sesiones Admin y funcionalidad basica.",
    preferences: "Preferencias",
    preferencesBody: "Guarda opciones no esenciales de interfaz en este navegador.",
    analytics: "Analytics",
    analyticsBody: "Permite eventos de medicion con consentimiento, como paginas vistas seguras, pestanas de precios y progreso de formularios.",
    marketing: "Marketing",
    marketingBody: "Permite medicion publicitaria configurada despues de leads aceptados. Remarketing sigue inactivo salvo configuracion futura.",
    locked: "Siempre activo",
  },
} satisfies Record<Locale, Record<string, string>>;

const defaultChoices: BannerState = { preferences: false, analytics: false, marketing: false };

export function ConsentBanner() {
  const pathname = useSafePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = consentBannerCopy[locale];
  const savedPreferences = useConsentPreferences();
  const [dismissed, setDismissed] = React.useState(false);
  const [customizing, setCustomizing] = React.useState(false);
  const [choices, setChoices] = React.useState<BannerState>(defaultChoices);
  const dialogTitleRef = React.useRef<HTMLHeadingElement>(null);
  const visible = !dismissed && !isTrackingExcludedPath(pathname) && savedPreferences === null;

  React.useEffect(() => {
    if (visible) pushDataLayerEvent("cookie_banner_view", { locale, page_path: pathname });
  }, [locale, pathname, visible]);

  React.useEffect(() => {
    if (customizing) dialogTitleRef.current?.focus();
  }, [customizing]);

  React.useEffect(() => {
    if (!customizing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCustomizing(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [customizing]);

  if (!visible) return null;

  function persist(next: BannerState) {
    saveConsentPreferences({ ...next, locale, source: "banner" });
    pushDataLayerEvent("cookie_preferences_update", { locale, page_path: pathname, success_category: "saved" });
    setDismissed(true);
    setCustomizing(false);
  }

  function setChoice(key: OptionalConsentCategory, checked: boolean) {
    setChoices((current) => ({ ...current, [key]: checked }));
  }

  return (
    <>
      <section
        aria-labelledby="consent-banner-title"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-4 py-4 shadow-[0_-16px_40px_-28px_rgba(15,23,42,0.5)] backdrop-blur sm:px-6"
      >
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex min-w-0 gap-3">
            <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-tint text-brand-teal">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="consent-banner-title" className="text-base font-semibold text-graphite">{t.title}</h2>
              <p className="mt-1 text-sm leading-6 text-secondary">{t.body}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link href={localizePath("/cookie-policy", locale)} className="font-semibold text-brand-teal hover:underline">{t.policy}</Link>
                <Link href={localizePath("/cookie-preferences", locale)} className="font-semibold text-brand-teal hover:underline">{t.preferencesPage}</Link>
              </div>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[540px]">
            <button type="button" onClick={() => persist({ preferences: true, analytics: true, marketing: true })} className="min-h-11 rounded-full border border-brand-teal bg-white px-4 text-sm font-semibold text-graphite">
              {t.accept}
            </button>
            <button type="button" onClick={() => persist(defaultChoices)} className="min-h-11 rounded-full border border-brand-teal bg-white px-4 text-sm font-semibold text-graphite">
              {t.reject}
            </button>
            <button type="button" onClick={() => setCustomizing(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 text-sm font-semibold text-white">
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              {t.customize}
            </button>
          </div>
        </div>
      </section>

      {customizing ? (
        <div className="fixed inset-0 z-[60] grid place-items-end bg-graphite/35 px-4 py-4 sm:place-items-center" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-customize-title"
            className="max-h-[min(88vh,760px)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-2xl"
          >
            <h2 id="consent-customize-title" ref={dialogTitleRef} tabIndex={-1} className="text-2xl font-semibold text-graphite">
              {t.customize}
            </h2>
            <p className="mt-2 text-sm leading-6 text-secondary">{t.body}</p>
            <div className="mt-5 grid gap-3">
              <ConsentToggle title={t.necessary} body={t.necessaryBody} checked disabled lockedLabel={t.locked} onChange={() => undefined} />
              <ConsentToggle title={t.preferences} body={t.preferencesBody} checked={choices.preferences} onChange={(checked) => setChoice("preferences", checked)} />
              <ConsentToggle title={t.analytics} body={t.analyticsBody} checked={choices.analytics} onChange={(checked) => setChoice("analytics", checked)} />
              <ConsentToggle title={t.marketing} body={t.marketingBody} checked={choices.marketing} onChange={(checked) => setChoice("marketing", checked)} />
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setCustomizing(false)} className="min-h-11 rounded-full border border-line bg-white px-5 text-sm font-semibold text-graphite">
                {t.back}
              </button>
              <button type="button" onClick={() => persist(choices)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white">
                <Save className="h-4 w-4" aria-hidden="true" />
                {t.save}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function ConsentToggle({
  title,
  body,
  checked,
  disabled,
  lockedLabel,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  lockedLabel?: string;
  onChange: (checked: boolean) => void;
}) {
  const id = React.useId();
  const bodyId = `${id}-body`;
  return (
    <label htmlFor={id} className="grid gap-3 rounded-2xl border border-line bg-surface-tint p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <span>
        <span className="block text-sm font-semibold text-graphite">{title}</span>
        <span id={bodyId} className="mt-1 block text-sm leading-6 text-secondary">{body}</span>
        {lockedLabel ? <span className="mt-1 block text-xs font-semibold text-brand-teal">{lockedLabel}</span> : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-describedby={bodyId}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-brand-teal"
      />
    </label>
  );
}

function useSafePathname() {
  const pathname = usePathname();
  return pathname ?? "/";
}
