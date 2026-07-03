import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n";
import type { ProofContent, ProofLink } from "@/content/proof.types";
import { ProofStatusBadge } from "./proof-status-badge";

export function EvidenceCommandCenter({
  modules,
}: {
  modules: ProofContent["hub"]["commandModules"];
}) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-70 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-5 depth-layered">
        <div aria-hidden="true" className="absolute inset-0 bg-line-grid opacity-50" />
        <div className="relative grid gap-3">
          {modules.map((module, index) => (
            <div
              key={module.label}
              className={cn(
                "grid gap-3 rounded-2xl border p-4 sm:grid-cols-[140px_1fr]",
                index === 0
                  ? "border-brand-teal/30 bg-brand-teal/[0.04]"
                  : "border-line bg-white/90"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  {index + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-brand-teal">
                  {module.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-graphite">{module.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary">{module.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthorityStack({
  layers,
}: {
  layers: ProofContent["hub"]["authority"]["layers"];
}) {
  const icons: LucideIcon[] = [Layers3, ShieldCheck, LockKeyhole, FileCheck2, CheckCircle2, GitBranch, Network];
  return (
    <div className="rounded-3xl border border-line bg-white p-4 depth-layered">
      <ol className="grid gap-0">
        {layers.map((layer, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li key={layer.label} className="grid grid-cols-[44px_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl border",
                    index === 0
                      ? "border-brand-teal/30 bg-brand-gradient text-white"
                      : "border-line bg-surface-tint text-brand-teal"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {index < layers.length - 1 ? (
                  <span className="my-1 h-10 w-px bg-gradient-to-b from-brand-teal/40 to-line" aria-hidden="true" />
                ) : null}
              </div>
              <div className="pb-4">
                <div className="rounded-2xl border border-line-soft bg-surface-soft/60 p-4">
                  <p className="text-sm font-semibold text-graphite">{layer.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-secondary">{layer.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function VerificationPipeline({
  steps,
  label,
}: {
  steps: string[];
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
      <div className="flex items-center gap-2 border-b border-line bg-surface-tint px-5 py-3">
        <FileCheck2 className="h-4 w-4 text-brand-teal" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
      </div>
      <ol className="grid gap-0 md:grid-cols-6">
        {steps.map((step, index) => (
          <li
            key={step}
            className="relative flex min-h-28 flex-col justify-between gap-4 border-b border-line-soft p-5 md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
              {index + 1}
            </span>
            <p className="text-sm font-semibold text-graphite">{step}</p>
            {index < steps.length - 1 ? (
              <ArrowRight className="absolute right-3 top-6 hidden h-4 w-4 text-brand-teal md:block" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ExperienceNameplates({
  brands,
  disclosure,
}: {
  brands: string[];
  disclosure: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 depth-layered">
      <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-70" />
      <div className="relative grid gap-4 sm:grid-cols-2">
        {brands.map((brand, index) => (
          <div
            key={brand}
            className={cn(
              "rounded-2xl border bg-white/90 p-5",
              index % 2 === 0 ? "border-brand-teal/25" : "border-line"
            )}
          >
            <p className="text-lg font-semibold tracking-tight text-graphite">{brand}</p>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-brand-gradient" aria-hidden="true" />
          </div>
        ))}
      </div>
      <p className="relative mt-5 rounded-2xl border border-line bg-surface-tint p-4 text-sm leading-relaxed text-secondary">
        {disclosure}
      </p>
    </div>
  );
}

export function ProofChannelMap({
  links,
  locale,
}: {
  links: ProofLink[];
  locale: Locale;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
      <div className="grid gap-px bg-line-soft md:grid-cols-5">
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={localizePath(link.href, locale)}
            className="group flex min-h-48 flex-col justify-between bg-white p-5 transition-colors hover:bg-surface-tint"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                {index + 1}
              </span>
              <ArrowRight className="h-4 w-4 text-brand-teal transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-semibold text-graphite">{link.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-secondary">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PrivateReferenceFlow({
  steps,
  label,
}: {
  steps: string[];
  label: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-3xl border border-brand-teal/25 bg-brand-teal/[0.04] p-6">
        <ProofStatusBadge label={label} tone="private" />
        <div className="mt-6 flex h-44 items-center justify-center rounded-2xl border border-line bg-white">
          <LockKeyhole className="h-16 w-16 text-brand-teal" aria-hidden="true" />
        </div>
      </div>
      <ol className="grid gap-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-tint text-sm font-bold text-brand-teal">
              {index + 1}
            </span>
            <span className="text-sm font-semibold text-graphite">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
