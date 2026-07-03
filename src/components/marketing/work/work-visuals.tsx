import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Radar,
  Route,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkStep } from "@/content/work.types";
import { WorkStatusBadge } from "./work-status-badge";

export function CommandCenterVisual({ steps }: { steps: WorkStep[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-5 depth-layered">
      <div aria-hidden="true" className="absolute inset-0 bg-line-grid opacity-60" />
      <div className="relative grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={cn(
              "rounded-2xl border bg-white/90 p-4 shadow-sm",
              index === 0 || index === 3
                ? "border-brand-teal/25"
                : "border-line-soft"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tint text-brand-teal">
                {[Radar, FileSearch, GitBranch, Route, ShieldCheck, Network][index] &&
                  (() => {
                    const Icon = [Radar, FileSearch, GitBranch, Route, ShieldCheck, Network][index];
                    return <Icon className="h-4 w-4" aria-hidden="true" />;
                  })()}
              </span>
              {step.status ? <WorkStatusBadge label={step.status} tone="sample" /> : null}
            </div>
            <p className="mt-4 text-sm font-semibold text-graphite">{step.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-secondary">{step.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OperatingMapVisual({
  items,
}: {
  items: { label: string; detail: string; connectsTo: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
      <div className="grid gap-px bg-line-soft md:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.label} className="bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                {index + 1}
              </span>
              <ArrowRight className="mt-2 h-4 w-4 text-brand-teal" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-graphite">{item.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">{item.detail}</p>
            <p className="mt-4 rounded-xl border border-line-soft bg-surface-tint px-3 py-2 text-xs font-semibold text-muted">
              {item.connectsTo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DossierStackVisual({
  items,
  ctaLabel,
}: {
  items: { label: string; description: string }[];
  ctaLabel: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
        <FileSearch className="h-10 w-10 text-brand-teal" aria-hidden="true" />
        <p className="mt-4 text-2xl font-semibold tracking-tight text-graphite">
          {ctaLabel}
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "min-h-64 w-64 shrink-0 rounded-3xl border bg-white p-5 shadow-sm",
              index % 3 === 0
                ? "border-brand-teal/25"
                : index % 3 === 1
                  ? "border-brand-green/25"
                  : "border-brand-blue/25"
            )}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-tint text-sm font-bold text-brand-teal">
              {index + 1}
            </span>
            <h3 className="mt-8 text-lg font-semibold text-graphite">{item.label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExecutionFlowVisual({ steps }: { steps: WorkStep[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-6">
      {steps.map((step, index) => (
        <li key={step.label} className="relative rounded-2xl border border-line bg-white p-4">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 text-sm font-semibold text-graphite">{step.label}</h3>
          <p className="mt-2 text-xs leading-relaxed text-secondary">{step.detail}</p>
          {index < steps.length - 1 ? (
            <ArrowRight
              className="absolute -right-3 top-8 hidden h-5 w-5 rounded-full bg-white text-brand-teal md:block"
              aria-hidden="true"
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function EvidenceMatrixVisual({ items }: { items: WorkStep[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
      <div className="grid divide-line-soft md:grid-cols-5 md:divide-x">
        {items.map((item, index) => (
          <div key={item.label} className="p-5">
            <span
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                index < 3 ? "bg-brand-gradient text-white" : "bg-surface-tint text-brand-teal"
              )}
            >
              {index < 3 ? (
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              ) : (
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <h3 className="mt-4 text-sm font-semibold text-graphite">{item.label}</h3>
            <p className="mt-2 text-xs leading-relaxed text-secondary">{item.detail}</p>
            {item.status ? (
              <p className="mt-4 text-xs font-semibold text-brand-teal">{item.status}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PriorityLedger({
  rows,
  statusLabel,
}: {
  rows: WorkStep[];
  statusLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
      <div className="grid grid-cols-[1.1fr_0.8fr] border-b border-line-soft bg-surface-tint px-5 py-3 text-xs font-semibold uppercase text-muted">
        <span>{statusLabel}</span>
        <span>{rows[0]?.status ?? ""}</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="grid gap-3 border-b border-line-soft px-5 py-4 last:border-b-0 sm:grid-cols-[1.1fr_0.8fr]">
          <div>
            <p className="font-semibold text-graphite">{row.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-secondary">{row.detail}</p>
          </div>
          <div className="flex items-center sm:justify-end">
            {row.status ? <WorkStatusBadge label={row.status} tone="warning" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SignalMosaic({
  items,
}: {
  items: WorkStep[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "rounded-2xl border bg-white p-4",
            index % 4 === 0 ? "border-brand-teal/30" : "border-line"
          )}
        >
          <CheckCircle2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-graphite">{item.label}</p>
          <p className="mt-2 text-xs leading-relaxed text-secondary">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function ArchitectureDiagram({
  title,
  items,
}: {
  title: string;
  items: WorkStep[];
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5 depth-layered">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <Layers3 className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-lg font-semibold text-graphite">{title}</p>
      </div>
      <div className="mt-6 grid gap-3">
        {items.map((item, index) => (
          <div key={item.label} className="grid grid-cols-[40px_1fr] gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-tint text-sm font-bold text-brand-teal">
              {index + 1}
            </span>
            <div className="rounded-2xl border border-line-soft bg-surface-soft p-4">
              <p className="text-sm font-semibold text-graphite">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-secondary">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
