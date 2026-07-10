"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-graphite">
      <span>
        {label}
        {hint ? <span className="ml-2 text-xs font-normal text-muted">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export function TextInput({ value, onChange, disabled, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; disabled?: boolean; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-normal disabled:bg-surface-soft"
    />
  );
}

export function TextArea({ value, onChange, disabled, placeholder, rows = 3 }: { value: string; onChange: (value: string) => void; disabled?: boolean; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-line bg-white p-3 text-sm font-normal leading-6 disabled:bg-surface-soft"
    />
  );
}

export function SelectInput<T extends string>({ value, onChange, options, disabled }: { value: T; onChange: (value: T) => void; options: readonly { value: T; label: string }[]; disabled?: boolean }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as T)}
      className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-normal disabled:bg-surface-soft"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function SmallButton({ onClick, disabled, children, tone = "default", ariaLabel }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; tone?: "default" | "primary" | "danger"; ariaLabel?: string }) {
  const toneClass =
    tone === "primary"
      ? "bg-brand-teal text-white border-brand-teal"
      : tone === "danger"
        ? "border-line text-red-700 hover:border-red-300"
        : "border-line text-secondary hover:text-brand-teal";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold disabled:opacity-50 ${toneClass}`}
    >
      {children}
    </button>
  );
}

/** Enter-to-add chip input for keyword/entity style string lists. */
export function ChipListInput({ values, onChange, disabled, placeholder, addLabel = "Add" }: { values: string[]; onChange: (values: string[]) => void; disabled?: boolean; placeholder?: string; addLabel?: string }) {
  const [draft, setDraft] = useState("");
  const id = useId();

  const add = () => {
    const value = draft.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft("");
  };

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1 rounded-full bg-surface-tint px-2.5 py-1 text-xs font-medium text-brand-teal">
            {value}
            {!disabled ? (
              <button type="button" aria-label={`Remove ${value}`} onClick={() => onChange(values.filter((item) => item !== value))} className="text-brand-teal/70 hover:text-brand-teal">
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ) : null}
          </span>
        ))}
        {values.length === 0 ? <span className="text-xs font-normal text-muted">Nothing added yet.</span> : null}
      </div>
      {!disabled ? (
        <div className="flex gap-2">
          <input
            id={id}
            value={draft}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            className="min-h-9 flex-1 rounded-lg border border-line bg-white px-3 text-sm font-normal"
          />
          <SmallButton onClick={add}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {addLabel}
          </SmallButton>
        </div>
      ) : null}
    </div>
  );
}

/** Editable ordered list of strings with reorder controls. */
export function StringListEditor({ values, onChange, disabled, placeholder }: { values: string[]; onChange: (values: string[]) => void; disabled?: boolean; placeholder?: string }) {
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="grid gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(event) => onChange(values.map((item, i) => (i === index ? event.target.value : item)))}
            className="min-h-9 flex-1 rounded-lg border border-line bg-white px-3 text-sm font-normal disabled:bg-surface-soft"
          />
          {!disabled ? (
            <div className="flex gap-1">
              <SmallButton ariaLabel="Move up" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
              <SmallButton ariaLabel="Move down" onClick={() => move(index, 1)} disabled={index === values.length - 1}><ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
              <SmallButton ariaLabel="Remove item" tone="danger" onClick={() => onChange(values.filter((_, i) => i !== index))}><X className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
            </div>
          ) : null}
        </div>
      ))}
      {!disabled ? (
        <SmallButton onClick={() => onChange([...values, ""])}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add item
        </SmallButton>
      ) : null}
    </div>
  );
}

export type GuidanceStatus = "blocking" | "recommended" | "optional" | "passed";

const statusStyles: Record<GuidanceStatus, string> = {
  blocking: "bg-red-50 text-red-700 border-red-200",
  recommended: "bg-amber-50 text-amber-800 border-amber-200",
  optional: "bg-surface-soft text-secondary border-line",
  passed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const statusLabels: Record<GuidanceStatus, string> = {
  blocking: "Blocking",
  recommended: "Recommended",
  optional: "Optional",
  passed: "Passed",
};

export function StatusChip({ status, children }: { status: GuidanceStatus; children?: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
      {children}
    </span>
  );
}
