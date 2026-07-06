/**
 * Language switcher — premium dropdown for desktop + list for mobile.
 *
 * Behavior:
 *  - Derives the active locale from the current pathname (route prefix = truth).
 *  - Switching language preserves the equivalent page path:
 *      /services/technical-seo -> /fr/services/technical-seo
 *  - English links to the unprefixed path; fr/es get prefixes.
 *  - Never sets cookies that override the route. (Preference may be remembered
 *    for neutral navigation only — see docs/I18N_STRATEGY.md.)
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Globe, ChevronDown } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { locales, localeLabels, switchLocale, type Locale } from "@/lib/i18n";
import { isPricingTabId } from "@/content/pricing.types";
import { useLocalePathname } from "./use-locale";

/**
 * Build the equivalent href for a target locale from the current pathname.
 * Falls back to the localized homepage if something is off.
 */
function safeQuery(search: string): string {
  const params = new URLSearchParams(search);
  const next = new URLSearchParams();
  const intent = params.get("intent");
  const type = params.get("type");
  const tab = params.get("tab");
  const safeIntents = new Set(["media", "private-reference", "partnership"]);
  const safeTypes = new Set(["seo-audit", "strategy-call", "contact", "media-inquiry", "private-reference", "data-request"]);
  if (intent && safeIntents.has(intent)) next.set("intent", intent);
  if (type && safeTypes.has(type)) next.set("type", type);
  if (tab && isPricingTabId(tab)) next.set("tab", tab);
  const value = next.toString();
  return value ? `?${value}` : "";
}

function buildLocaleHref(currentPathname: string, target: Locale, search = ""): string {
  try {
    return `${switchLocale(currentPathname, target)}${safeQuery(search)}`;
  } catch {
    return `${target === "en" ? "/" : `/${target}`}${safeQuery(search)}`;
  }
}

/** Compact dropdown used in the desktop header. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, pathname, search } = useLocalePathname();
  const content = getSiteContent(locale);
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={content.ui.languageLabel}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-tint hover:text-graphite"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={content.ui.languageLabel}
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-white p-1 shadow-lg"
        >
          {locales.map((l) => {
            const href = buildLocaleHref(pathname, l, search);
            const active = l === locale;
            return (
              <Link
                key={l}
                href={href}
                role="option"
                aria-selected={active}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-surface-tint font-semibold text-graphite"
                    : "text-secondary hover:bg-surface-tint hover:text-graphite"
                )}
              >
                <span>{localeLabels[l]}</span>
                {active && <Check className="h-4 w-4 text-brand-teal" aria-hidden="true" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Stacked list used in the mobile menu. */
export function LanguageSwitcherList() {
  const { locale, pathname, search } = useLocalePathname();
  const content = getSiteContent(locale);
  return (
    <div className="flex flex-col gap-1" role="listbox" aria-label={content.ui.languageLabel}>
      <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
        {content.ui.languageLabel}
      </p>
      {locales.map((l) => {
        const href = buildLocaleHref(pathname, l, search);
        const active = l === locale;
        return (
          <Link
            key={l}
            href={href}
            role="option"
            aria-selected={active}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2.5 text-base",
              active
                ? "bg-surface-tint font-semibold text-graphite"
                : "text-secondary hover:bg-surface-tint hover:text-graphite"
            )}
          >
            <span>{localeLabels[l]}</span>
            {active && <Check className="h-4 w-4 text-brand-teal" aria-hidden="true" />}
          </Link>
        );
      })}
    </div>
  );
}
