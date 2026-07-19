"use client";

import { useActionState } from "react";
import {
  createDocumentAction,
  createWorkFromActionsAction,
  saveDocumentAction,
  type DocumentActionState,
} from "@/lib/work/document-actions";
import type { DocumentKind } from "@/lib/work/document-repository";
import type { ExtractedAction } from "@/lib/work/action-extraction";
import { RichTextEditor } from "./rich-text-editor";

const INITIAL: DocumentActionState = {};

const KIND_OPTIONS: { value: DocumentKind; label: string }[] = [
  { value: "strategy", label: "Strategy" },
  { value: "brief", label: "Brief" },
  { value: "meeting_note", label: "Meeting note" },
  { value: "sop", label: "SOP" },
  { value: "report", label: "Report" },
  { value: "proposal", label: "Proposal" },
  { value: "research", label: "Research" },
  { value: "decision", label: "Decision" },
  { value: "general", label: "General document" },
];

function KindSelect({ name, defaultValue }: { name: string; defaultValue: DocumentKind }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
    >
      {KIND_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function VisibilityField({ canInternal, defaultInternal }: { canInternal: boolean; defaultInternal: boolean }) {
  if (!canInternal) return null;
  return (
    <label className="flex items-center gap-2 text-sm text-graphite">
      <input type="checkbox" name="visibility" value="internal" defaultChecked={defaultInternal} className="h-4 w-4 rounded border-line" />
      Internal (hidden from external collaborators)
    </label>
  );
}

export function CreateDocumentForm({
  canInternal,
  clients,
  projects,
}: {
  canInternal: boolean;
  clients: { id: string; name: string }[];
  projects: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(createDocumentAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Title
          <input
            name="title"
            type="text"
            required
            maxLength={200}
            className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Kind
          <KindSelect name="kind" defaultValue="general" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Client <span className="font-normal text-muted">(optional)</span>
          <select name="clientId" defaultValue="" className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite">
            <option value="">None</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Project <span className="font-normal text-muted">(optional)</span>
          <select name="projectId" defaultValue="" className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite">
            <option value="">None</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-1 text-sm font-medium text-graphite">
        Body
        <RichTextEditor name="body" defaultValue="" placeholder="Write the document…" />
      </div>
      <VisibilityField canInternal={canInternal} defaultInternal />
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create document"}
      </button>
    </form>
  );
}

export function EditDocumentForm({
  documentId,
  title,
  kind,
  body,
  isInternal,
  canInternal,
}: {
  documentId: string;
  title: string;
  kind: DocumentKind;
  body: string;
  isInternal: boolean;
  canInternal: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveDocumentAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="documentId" value={documentId} />
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Title
          <input
            name="title"
            type="text"
            defaultValue={title}
            required
            maxLength={200}
            className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Kind
          <KindSelect name="kind" defaultValue={kind} />
        </label>
      </div>
      <div className="grid gap-1 text-sm font-medium text-graphite">
        Body <span className="font-normal text-muted">(saving creates a new version)</span>
        <RichTextEditor name="body" defaultValue={body} placeholder="Write the document…" />
      </div>
      <VisibilityField canInternal={canInternal} defaultInternal={isInternal} />
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save new version"}
      </button>
    </form>
  );
}

export function ActionPreviewForm({
  documentId,
  actions,
  projects,
  defaultProjectId,
}: {
  documentId: string;
  actions: ExtractedAction[];
  projects: { id: string; name: string }[];
  defaultProjectId: string | null;
}) {
  const [state, formAction, pending] = useActionState(createWorkFromActionsAction, INITIAL);

  if (actions.length === 0) {
    return (
      <p className="text-sm text-muted">
        No action items detected. Use checklists (<code>- [ ] …</code>), <code>ACTION:</code>, or{" "}
        <code>@name to …</code> lines and they&apos;ll appear here to review.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="documentId" value={documentId} />
      <p className="text-sm text-secondary">
        Review the detected actions and choose which to turn into work. Nothing is created until
        you confirm.
      </p>
      <ul className="grid gap-1">
        {actions.map((action) => (
          <li key={`${action.sourceLine}-${action.title}`}>
            <label className="flex items-start gap-2 text-sm text-graphite">
              <input type="checkbox" name="action" value={action.title} defaultChecked className="mt-0.5 h-4 w-4 rounded border-line" />
              <span>{action.title}</span>
            </label>
          </li>
        ))}
      </ul>
      <label className="grid gap-1 text-sm font-medium text-graphite sm:max-w-sm">
        Create work in project
        <select
          name="projectId"
          required
          defaultValue={defaultProjectId ?? ""}
          className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
        >
          <option value="" disabled>
            Choose a project…
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create selected work"}
      </button>
    </form>
  );
}
