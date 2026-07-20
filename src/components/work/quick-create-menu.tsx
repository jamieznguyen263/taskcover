"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  createProjectAction,
  loadQuickCreateOptionsAction,
  type QuickCreateOptions,
  type TeamActionState,
} from "@/lib/work/actions";
import { createDocumentAction, type DocumentActionState } from "@/lib/work/document-actions";
import { createWorkItemAction, type WorkActionState } from "@/lib/work/work-actions";
import { WORK_TYPE_LABEL, WORK_TYPES } from "@/lib/work/work-domain";
import { DetailDrawer } from "./detail-drawer";

type Mode = "work" | "project" | "document";

const MODE_LABEL: Record<Mode, string> = {
  work: "Work",
  project: "Project",
  document: "Document",
};

const FIELD_CLASS = "min-h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-graphite";
const LABEL_CLASS = "grid gap-1 text-sm font-medium text-graphite";

/**
 * Global create surface. Every mode posts to the same server action the corresponding page
 * uses, so validation and authorization stay in one place; the panel only supplies the
 * context (which project, which client) that a page would otherwise supply implicitly.
 */
export function QuickCreateMenu() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("work");
  const [options, setOptions] = useState<QuickCreateOptions | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || options) return;
    let cancelled = false;
    loadQuickCreateOptionsAction()
      .then((result) => {
        if (!cancelled) setOptions(result);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load your projects and people. Close and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, options]);

  function close() {
    setOpen(false);
  }

  const availableModes: Mode[] = options
    ? (["work", options.canManageProjects ? "project" : null, options.canManageDocs ? "document" : null].filter(
        Boolean
      ) as Mode[])
    : ["work"];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Quick create
      </button>

      <DetailDrawer
        open={open}
        onClose={close}
        title="Quick create"
        description="Create work, a project, or a document without leaving this page."
      >
        {loadError ? <p className="text-sm text-red-600">{loadError}</p> : null}

        {!options && !loadError ? <p className="text-sm text-muted">Loading…</p> : null}

        {options ? (
          <div className="grid gap-4">
            <div role="tablist" aria-label="What to create" className="flex gap-1 rounded-lg border border-line p-1">
              {availableModes.map((candidate) => (
                <button
                  key={candidate}
                  type="button"
                  role="tab"
                  aria-selected={mode === candidate}
                  onClick={() => setMode(candidate)}
                  className={`min-h-9 flex-1 rounded-md px-3 text-sm font-medium ${
                    mode === candidate ? "bg-brand-teal/10 text-brand-teal" : "text-secondary hover:text-graphite"
                  }`}
                >
                  {MODE_LABEL[candidate]}
                </button>
              ))}
            </div>

            {mode === "work" ? <QuickWorkForm options={options} onDone={close} /> : null}
            {mode === "project" && options.canManageProjects ? (
              <QuickProjectForm options={options} onDone={close} />
            ) : null}
            {mode === "document" && options.canManageDocs ? (
              <QuickDocumentForm options={options} onDone={close} />
            ) : null}
          </div>
        ) : null}
      </DetailDrawer>
    </>
  );
}

/**
 * Runs a Flow create action and, on success, refreshes server data and closes the panel.
 * Written as an explicit transition rather than `useActionState` + an effect: the close is a
 * consequence of the submission, not of a state change, so there is nothing to synchronise.
 */
function useQuickCreateForm<State extends { error?: string }>(
  action: (state: State, formData: FormData) => Promise<State>,
  onDone: () => void
) {
  const router = useRouter();
  const [state, setState] = useState<{ error?: string }>({});
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await action({} as State, formData);
      if (result.error) {
        setState({ error: result.error });
        return;
      }
      setState({});
      router.refresh();
      onDone();
    });
  }

  return { state, submit, pending };
}

function SubmitRow({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
    >
      {pending ? "Creating…" : label}
    </button>
  );
}

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-sm text-red-600">
      {error}
    </p>
  );
}

function QuickWorkForm({ options, onDone }: { options: QuickCreateOptions; onDone: () => void }) {
  const { state, submit, pending } = useQuickCreateForm<WorkActionState>(createWorkItemAction, onDone);

  if (options.projects.length === 0) {
    return (
      <p className="text-sm text-muted">
        Work lives inside a project, and there are no projects yet. Create a project first.
      </p>
    );
  }

  return (
    <form action={submit} className="grid gap-3">
      <label className={LABEL_CLASS}>
        Title
        <input name="title" type="text" required maxLength={200} autoFocus className={FIELD_CLASS} />
      </label>
      <label className={LABEL_CLASS}>
        Project
        <select name="projectId" required defaultValue="" className={FIELD_CLASS}>
          <option value="" disabled>
            Choose a project…
          </option>
          {options.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Type
        <select name="type" defaultValue="task" className={FIELD_CLASS}>
          {WORK_TYPES.map((type) => (
            <option key={type} value={type}>
              {WORK_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Owner
        <select name="ownerId" required defaultValue="" className={FIELD_CLASS}>
          <option value="" disabled>
            Choose an owner…
          </option>
          {options.members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.displayName}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Due date <span className="font-normal text-muted">(optional)</span>
        <input name="dueAt" type="date" className={FIELD_CLASS} />
      </label>
      <ErrorText error={state.error} />
      <SubmitRow pending={pending} label="Create work" />
    </form>
  );
}

function QuickProjectForm({ options, onDone }: { options: QuickCreateOptions; onDone: () => void }) {
  const { state, submit, pending } = useQuickCreateForm<TeamActionState>(createProjectAction, onDone);
  const [kind, setKind] = useState<"client" | "internal">("client");

  return (
    <form action={submit} className="grid gap-3">
      <label className={LABEL_CLASS}>
        Project name
        <input name="name" type="text" required maxLength={160} autoFocus className={FIELD_CLASS} />
      </label>
      <fieldset className="grid gap-1">
        <legend className="text-sm font-medium text-graphite">Kind</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="radio"
              name="kind"
              value="client"
              checked={kind === "client"}
              onChange={() => setKind("client")}
            />
            Client project
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="radio"
              name="kind"
              value="internal"
              checked={kind === "internal"}
              onChange={() => setKind("internal")}
            />
            Internal initiative
          </label>
        </div>
      </fieldset>
      {kind === "client" ? (
        <label className={LABEL_CLASS}>
          Client
          <select name="clientId" required defaultValue="" className={FIELD_CLASS}>
            <option value="" disabled>
              Choose a client…
            </option>
            {options.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className={LABEL_CLASS}>
        Description <span className="font-normal text-muted">(optional)</span>
        <input name="description" type="text" maxLength={280} className={FIELD_CLASS} />
      </label>
      <ErrorText error={state.error} />
      <SubmitRow pending={pending} label="Create project" />
    </form>
  );
}

function QuickDocumentForm({ options, onDone }: { options: QuickCreateOptions; onDone: () => void }) {
  const { state, submit, pending } = useQuickCreateForm<DocumentActionState>(createDocumentAction, onDone);

  return (
    <form action={submit} className="grid gap-3">
      <label className={LABEL_CLASS}>
        Title
        <input name="title" type="text" required maxLength={200} autoFocus className={FIELD_CLASS} />
      </label>
      <label className={LABEL_CLASS}>
        Client <span className="font-normal text-muted">(optional)</span>
        <select name="clientId" defaultValue="" className={FIELD_CLASS}>
          <option value="">No client</option>
          {options.clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL_CLASS}>
        Project <span className="font-normal text-muted">(optional)</span>
        <select name="projectId" defaultValue="" className={FIELD_CLASS}>
          <option value="">No project</option>
          {options.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <ErrorText error={state.error} />
      <SubmitRow pending={pending} label="Create document" />
    </form>
  );
}
