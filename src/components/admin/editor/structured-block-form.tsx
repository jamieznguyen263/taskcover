"use client";

import type { InsightBlock } from "@/content/insights.types";
import { Field, SelectInput, SmallButton, StringListEditor, TextArea, TextInput } from "./controls";
import { Plus, X } from "lucide-react";

type BlockOf<T extends InsightBlock["type"]> = Extract<InsightBlock, { type: T }>;

/** Structured editing form for one block. Emits a full replacement block on every change. */
export function StructuredBlockDataForm({ value, onChange }: { value: InsightBlock; onChange: (value: InsightBlock) => void }) {
  switch (value.type) {
    case "direct-answer":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <Field label="Answer" hint="One to three sentences that answer the core question directly."><TextArea value={value.answer} onChange={(answer) => onChange({ ...value, answer })} /></Field>
        </div>
      );
    case "key-takeaways":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <Field label="Takeaways"><StringListEditor values={value.items} onChange={(items) => onChange({ ...value, items })} /></Field>
        </div>
      );
    case "definition":
      return (
        <div className="grid gap-3">
          <Field label="Term"><TextInput value={value.term} onChange={(term) => onChange({ ...value, term })} /></Field>
          <Field label="Definition"><TextArea value={value.definition} onChange={(definition) => onChange({ ...value, definition })} /></Field>
        </div>
      );
    case "callout":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <Field label="Body"><TextArea value={value.body} onChange={(body) => onChange({ ...value, body })} /></Field>
          <Field label="Tone">
            <SelectInput value={value.tone ?? "blue"} onChange={(tone) => onChange({ ...value, tone })} options={[{ value: "blue", label: "Blue (informational)" }, { value: "green", label: "Green (positive)" }, { value: "amber", label: "Amber (warning)" }] as const} />
          </Field>
        </div>
      );
    case "checklist":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <PairListEditor
            rows={value.items.map((item) => [item.label, item.detail] as [string, string])}
            labels={["Label", "Detail"]}
            onChange={(rows) => onChange({ ...value, items: rows.map(([label, detail]) => ({ label, detail })) })}
          />
        </div>
      );
    case "steps":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <PairListEditor
            rows={value.steps.map((step) => [step.title, step.body] as [string, string])}
            labels={["Step title", "Step body"]}
            multilineSecond
            onChange={(rows) => onChange({ ...value, steps: rows.map(([title, body]) => ({ title, body })) })}
          />
        </div>
      );
    case "faq":
      return (
        <PairListEditor
          rows={value.items.map((item) => [item.question, item.answer] as [string, string])}
          labels={["Question", "Answer"]}
          multilineSecond
          onChange={(rows) => onChange({ ...value, items: rows.map(([question, answer]) => ({ question, answer })) })}
        />
      );
    case "pros-cons":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Pros"><StringListEditor values={value.pros} onChange={(pros) => onChange({ ...value, pros })} /></Field>
            <Field label="Cons"><StringListEditor values={value.cons} onChange={(cons) => onChange({ ...value, cons })} /></Field>
          </div>
        </div>
      );
    case "comparison-table":
      return <ComparisonTableForm value={value} onChange={onChange} />;
    case "statistic":
      return (
        <div className="grid gap-3">
          <Field label="Value" hint="For example: 38%"><TextInput value={value.value} onChange={(next) => onChange({ ...value, value: next })} /></Field>
          <Field label="Label" hint="What the number measures."><TextInput value={value.label} onChange={(label) => onChange({ ...value, label })} /></Field>
          <Field label="Evidence source ID" hint="ID of a source in Content & Evidence that backs this number."><TextInput value={value.sourceId ?? ""} onChange={(sourceId) => onChange({ ...value, sourceId: sourceId || undefined })} /></Field>
          <Field label="Note"><TextInput value={value.note ?? ""} onChange={(note) => onChange({ ...value, note: note || undefined })} /></Field>
        </div>
      );
    case "expert-insight":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <Field label="Body" hint="Real practitioner experience only. Do not invent experts or quotes."><TextArea value={value.body} onChange={(body) => onChange({ ...value, body })} /></Field>
        </div>
      );
    case "cta":
      return (
        <div className="grid gap-3">
          <Field label="Title"><TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} /></Field>
          <Field label="Body"><TextArea value={value.body} onChange={(body) => onChange({ ...value, body })} /></Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Primary button label"><TextInput value={value.primary.label} onChange={(label) => onChange({ ...value, primary: { ...value.primary, label } })} /></Field>
            <Field label="Primary button link"><TextInput value={value.primary.href} onChange={(href) => onChange({ ...value, primary: { ...value.primary, href } })} /></Field>
            <Field label="Secondary button label"><TextInput value={value.secondary?.label ?? ""} onChange={(label) => onChange({ ...value, secondary: label ? { label, href: value.secondary?.href ?? "" } : undefined })} /></Field>
            <Field label="Secondary button link"><TextInput value={value.secondary?.href ?? ""} onChange={(href) => onChange({ ...value, secondary: value.secondary ? { ...value.secondary, href } : href ? { label: "", href } : undefined })} /></Field>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="grid gap-3">
          <Field label="Image URL"><TextInput value={value.src} onChange={(src) => onChange({ ...value, src })} placeholder="https://…" /></Field>
          <Field label="Alt text" hint="Required for accessibility and image search."><TextInput value={value.alt} onChange={(alt) => onChange({ ...value, alt })} /></Field>
          <Field label="Caption"><TextInput value={value.caption ?? ""} onChange={(caption) => onChange({ ...value, caption: caption || undefined })} /></Field>
          <Field label="Credit"><TextInput value={value.credit ?? ""} onChange={(credit) => onChange({ ...value, credit: credit || undefined })} /></Field>
        </div>
      );
    default:
      return <p className="text-sm text-muted">This block type has no structured form.</p>;
  }
}

function PairListEditor({ rows, labels, onChange, multilineSecond }: { rows: [string, string][]; labels: [string, string]; onChange: (rows: [string, string][]) => void; multilineSecond?: boolean }) {
  const setCell = (index: number, cell: 0 | 1, next: string) => {
    onChange(rows.map((row, i) => (i === index ? ((cell === 0 ? [next, row[1]] : [row[0], next]) as [string, string]) : row)));
  };
  return (
    <div className="grid gap-3">
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 rounded-lg border border-line-soft bg-surface-soft p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">#{index + 1}</span>
            <SmallButton tone="danger" ariaLabel={`Remove item ${index + 1}`} onClick={() => onChange(rows.filter((_, i) => i !== index))}><X className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
          </div>
          <Field label={labels[0]}><TextInput value={row[0]} onChange={(next) => setCell(index, 0, next)} /></Field>
          <Field label={labels[1]}>
            {multilineSecond ? <TextArea value={row[1]} onChange={(next) => setCell(index, 1, next)} /> : <TextInput value={row[1]} onChange={(next) => setCell(index, 1, next)} />}
          </Field>
        </div>
      ))}
      <SmallButton onClick={() => onChange([...rows, ["", ""]])}>
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add item
      </SmallButton>
    </div>
  );
}

function ComparisonTableForm({ value, onChange }: { value: BlockOf<"comparison-table">; onChange: (value: InsightBlock) => void }) {
  const setColumn = (index: number, next: string) => onChange({ ...value, columns: value.columns.map((column, i) => (i === index ? next : column)) });
  const setCell = (rowIndex: number, cellIndex: number, next: string) =>
    onChange({ ...value, rows: value.rows.map((row, r) => (r === rowIndex ? row.map((cell, c) => (c === cellIndex ? next : cell)) : row)) });

  return (
    <div className="grid gap-3">
      <Field label="Caption"><TextInput value={value.caption} onChange={(caption) => onChange({ ...value, caption })} /></Field>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr>
              {value.columns.map((column, index) => (
                <th key={index} className="p-1">
                  <TextInput value={column} onChange={(next) => setColumn(index, next)} placeholder={`Column ${index + 1}`} />
                </th>
              ))}
              <th className="w-10 p-1" />
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {value.columns.map((_, cellIndex) => (
                  <td key={cellIndex} className="p-1">
                    <TextInput value={row[cellIndex] ?? ""} onChange={(next) => setCell(rowIndex, cellIndex, next)} />
                  </td>
                ))}
                <td className="p-1">
                  <SmallButton tone="danger" ariaLabel={`Remove row ${rowIndex + 1}`} onClick={() => onChange({ ...value, rows: value.rows.filter((_, i) => i !== rowIndex) })}><X className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <SmallButton onClick={() => onChange({ ...value, rows: [...value.rows, value.columns.map(() => "")] })}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add row
        </SmallButton>
        <SmallButton onClick={() => onChange({ ...value, columns: [...value.columns, ""], rows: value.rows.map((row) => [...row, ""]) })}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add column
        </SmallButton>
        <SmallButton
          tone="danger"
          disabled={value.columns.length <= 1}
          onClick={() => onChange({ ...value, columns: value.columns.slice(0, -1), rows: value.rows.map((row) => row.slice(0, value.columns.length - 1)) })}
        >
          Remove last column
        </SmallButton>
      </div>
    </div>
  );
}
