"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Redo2, Save, Undo2 } from "lucide-react";
import type { InsightArticle, InsightStatus } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import type { AdminRole } from "@/lib/admin/permissions";
import type { PublishQaResult } from "@/lib/insights/publish-qa";
import { InsightBlockRenderer } from "@/components/marketing/insights/insight-block-renderer";
import { normalizeTiptapToInsightBlocks } from "@/lib/admin/normalization";

const tabs = ["Document", "Search Strategy", "Content & Evidence", "Internal Linking", "Metadata & Social", "Schema", "Localization", "Publish QA"] as const;
type Tab = (typeof tabs)[number];
type SaveState = "Saved" | "Unsaved changes" | "Saving" | "Save failed" | "Conflict detected";

export function ArticleEditor(props: {
  articleId: string;
  article: InsightArticle;
  editorDocument: unknown;
  lockVersion: number;
  status: InsightStatus;
  role: AdminRole;
  schedulerConfigured: boolean;
  availableLocales: Locale[];
  restoreRevisionId?: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Document");
  const [article, setArticle] = useState(props.article);
  const [lockVersion, setLockVersion] = useState(props.lockVersion);
  const [status, setStatus] = useState(props.status);
  const [saveState, setSaveState] = useState<SaveState>("Saved");
  const [message, setMessage] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [qa, setQa] = useState<PublishQaResult[]>([]);
  const [jsonError, setJsonError] = useState("");
  const [transitionPending, setTransitionPending] = useState(false);
  const articleRef = useRef(article);
  const versionRef = useRef(lockVersion);
  const dirtyRevision = useRef(0);
  const saveInFlight = useRef(false);
  const transitionInFlight = useRef(false);
  const initialDocument = useMemo(() => props.editorDocument, [props.editorDocument]);

  const editor = useEditor({
    extensions: [StarterKit, LinkExtension.configure({ openOnClick: false }), Placeholder.configure({ placeholder: "Write the draft body." }), Table.configure({ resizable: true }), TableRow, TableHeader, TableCell],
    content: initialDocument as never,
    editorProps: { attributes: { class: "min-h-[520px] rounded-lg border border-line bg-white px-4 py-3 text-sm leading-7 outline-none" } },
    onUpdate: ({ editor: current }) => {
      const next = { ...articleRef.current, blocks: normalizeTiptapToInsightBlocks(current.getJSON()) };
      articleRef.current = next;
      setArticle(next);
      dirtyRevision.current += 1;
      setSaveState("Unsaved changes");
    },
  });

  const updateArticle = useCallback((update: Partial<InsightArticle>) => {
    const next = { ...articleRef.current, ...update };
    articleRef.current = next;
    setArticle(next);
    dirtyRevision.current += 1;
    setSaveState("Unsaved changes");
  }, []);

  const save = useCallback(async () => {
    if (!editor || saveInFlight.current || jsonError || saveState === "Conflict detected") return;
    saveInFlight.current = true;
    const revisionAtStart = dirtyRevision.current;
    const document = editor.getJSON();
    const articleAtStart = { ...articleRef.current, blocks: normalizeTiptapToInsightBlocks(document) };
    setSaveState("Saving");
    try {
      const response = await fetch("/api/admin/insights/autosave", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ articleId: props.articleId, locale: articleAtStart.locale, expectedVersion: versionRef.current, editorDocument: document, article: articleAtStart }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; lockVersion?: number };
      if (response.status === 409) {
        setSaveState("Conflict detected");
        setMessage(result.error || "A newer version exists. Reload before editing further.");
        return;
      }
      if (!response.ok || !result.lockVersion) throw new Error(result.error || "Save failed.");
      versionRef.current = result.lockVersion;
      setLockVersion(result.lockVersion);
      if (dirtyRevision.current === revisionAtStart) setSaveState("Saved");
      else setSaveState("Unsaved changes");
      setMessage("");
    } catch (error) {
      setSaveState("Save failed");
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      saveInFlight.current = false;
    }
  }, [editor, jsonError, props.articleId, saveState]);

  useEffect(() => {
    if (saveState !== "Unsaved changes" || jsonError) return;
    const timer = window.setTimeout(() => void save(), 1200);
    return () => window.clearTimeout(timer);
  }, [jsonError, save, saveState]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (saveState !== "Saved") event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  async function transition(to: InsightStatus, revisionId?: string) {
    if (transitionInFlight.current) return;
    if (saveState !== "Saved") {
      setMessage("Save all changes before changing workflow state.");
      return;
    }
    transitionInFlight.current = true;
    setTransitionPending(true);
    setMessage("Working…");
    try {
      const response = await fetch("/api/admin/insights/transition", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ articleId: props.articleId, expectedVersion: versionRef.current, to, note: reviewNote || undefined, scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined, revisionId }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; status?: InsightStatus; lockVersion?: number; qa?: Record<string, PublishQaResult[]> };
      if (!response.ok || !result.status || !result.lockVersion) {
        setMessage(result.error || "Workflow action failed.");
        if (response.status === 409) setSaveState("Conflict detected");
        return;
      }
      setStatus(result.status);
      versionRef.current = result.lockVersion;
      setLockVersion(result.lockVersion);
      setQa(result.qa?.[article.locale] ?? []);
      setMessage(`Workflow updated to ${result.status}.`);
      setReviewNote("");
      router.refresh();
    } finally {
      transitionInFlight.current = false;
      setTransitionPending(false);
    }
  }

  const previewArticle = { ...article, status, blocks: editor ? normalizeTiptapToInsightBlocks(editor.getJSON()) : article.blocks };
  const editable = status === "draft";

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-surface-tint px-3 py-1 text-xs font-semibold text-brand-teal">{status}</span>
          {props.availableLocales.map((locale) => <Link key={locale} href={`/admin/insights/${props.articleId}?locale=${locale}`} className={`rounded-full border px-3 py-1 text-xs ${locale === article.locale ? "border-brand-teal text-brand-teal" : "border-line text-secondary"}`}>{locale.toUpperCase()}</Link>)}
          <Link href={`/admin/insights/${props.articleId}/preview?locale=${article.locale}`} className="rounded-full border border-line px-3 py-1 text-xs text-secondary">Full preview</Link>
        </div>
        <div className="flex items-center gap-2">
          <span aria-live="polite" className="text-xs text-secondary">{saveState} · v{lockVersion}</span>
          <button type="button" disabled={!editable || saveState === "Saving" || Boolean(jsonError)} onClick={() => void save()} className="rounded-lg border border-line px-3 py-2 text-xs font-semibold disabled:opacity-50">Save now</button>
          {saveState === "Conflict detected" ? <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-brand-teal px-3 py-2 text-xs font-semibold text-white">Reload latest</button> : null}
        </div>
      </div>

      {message ? <p role="status" className="rounded-lg border border-line bg-white p-3 text-sm text-secondary">{message}</p> : null}
      {!editable ? <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Content is read-only while the article is {status}. Use an allowed workflow action to return it to draft.</p> : null}

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-2" role="tablist" aria-label="Editor tabs">
        {tabs.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className="min-h-10 shrink-0 rounded-lg px-3 text-sm font-medium aria-selected:bg-surface-tint aria-selected:text-brand-teal">{tab}</button>)}
      </div>

      <section className="rounded-xl border border-line bg-white p-4">
        {activeTab === "Document" ? <DocumentPanel article={article} editable={editable} editor={editor} update={updateArticle} /> :
          activeTab === "Publish QA" ? <QaPanel results={qa} article={article} /> :
          <JsonPanel tab={activeTab} article={article} editable={editable} update={updateArticle} setError={setJsonError} />}
        {jsonError ? <p role="alert" className="mt-3 text-sm text-red-700">{jsonError}</p> : null}
      </section>

      <aside className="rounded-xl border border-line bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-graphite">Draft preview</h2>
        <InsightBlockRenderer article={previewArticle} locale={article.locale} />
      </aside>

      <WorkflowControls status={status} role={props.role} schedulerConfigured={props.schedulerConfigured} reviewNote={reviewNote} setReviewNote={setReviewNote} scheduledAt={scheduledAt} setScheduledAt={setScheduledAt} restoreRevisionId={props.restoreRevisionId} transition={transition} pending={transitionPending} />
    </div>
  );
}

function DocumentPanel({ article, editable, editor, update }: { article: InsightArticle; editable: boolean; editor: ReturnType<typeof useEditor>; update: (value: Partial<InsightArticle>) => void }) {
  return <div className="grid gap-4">
    <div className="grid gap-3 md:grid-cols-2">
      <TextField label="Slug" value={article.slug} disabled={!editable} onChange={(slug) => update({ slug })} />
      <TextField label="Internal title" value={article.internalTitle} disabled={!editable} onChange={(internalTitle) => update({ internalTitle })} />
      <TextField label="Public H1" value={article.h1} disabled={!editable} onChange={(h1) => update({ h1 })} />
      <TextField label="Author" value={article.author} disabled={!editable} onChange={(author) => update({ author })} />
      <TextField label="Cover image URL" value={article.coverImage} disabled={!editable} onChange={(coverImage) => update({ coverImage })} />
      <TextField label="Cover image alt" value={article.coverImageAlt} disabled={!editable} onChange={(coverImageAlt) => update({ coverImageAlt })} />
    </div>
    <label className="grid gap-1 text-sm font-medium">Excerpt<textarea disabled={!editable} value={article.excerpt} onChange={(event) => update({ excerpt: event.target.value })} className="min-h-24 rounded-lg border border-line p-3 disabled:bg-surface-soft" /></label>
    <Toolbar editor={editor} disabled={!editable} />
    <EditorContent editor={editor} />
  </div>;
}

function TextField({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return <label className="grid gap-1 text-sm font-medium">{label}<input disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-lg border border-line px-3 disabled:bg-surface-soft" /></label>;
}

function JsonPanel({ tab, article, editable, update, setError }: { tab: Exclude<Tab, "Document" | "Publish QA">; article: InsightArticle; editable: boolean; update: (value: Partial<InsightArticle>) => void; setError: (value: string) => void }) {
  const mapping = {
    "Search Strategy": ["searchStrategy", article.searchStrategy],
    "Content & Evidence": ["contentEvidence", article.contentEvidence],
    "Internal Linking": ["internalLinking", article.internalLinking],
    "Metadata & Social": ["metadata", article.metadata],
    Schema: ["schema", article.schema],
    Localization: ["localization", article.localization],
  } as const;
  const [key, value] = mapping[tab];
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  return <label className="grid gap-2 text-sm font-medium">{tab} JSON
    <textarea disabled={!editable} value={text} onChange={(event) => {
      const next = event.target.value;
      setText(next);
      try {
        const parsed = JSON.parse(next);
        update({ [key]: parsed });
        setError("");
      } catch {
        setError(`${tab} contains invalid JSON and cannot be saved.`);
      }
    }} className="min-h-[28rem] rounded-lg border border-line bg-surface-soft p-3 font-mono text-xs disabled:opacity-70" />
  </label>;
}

function QaPanel({ results, article }: { results: PublishQaResult[]; article: InsightArticle }) {
  const shown = results.length ? results : [{ severity: "warning", code: "not-run", message: article.publishQa.summary } as PublishQaResult];
  return <div className="grid gap-2">{shown.map((item) => <div key={`${item.code}-${item.message}`} className="rounded-lg border border-line p-3"><strong className="text-sm">{item.severity.toUpperCase()} · {item.code}</strong><p className="mt-1 text-sm text-secondary">{item.message}</p></div>)}</div>;
}

function WorkflowControls(props: { status: InsightStatus; role: AdminRole; schedulerConfigured: boolean; reviewNote: string; setReviewNote: (value: string) => void; scheduledAt: string; setScheduledAt: (value: string) => void; restoreRevisionId?: string; transition: (to: InsightStatus, revisionId?: string) => Promise<void>; pending: boolean }) {
  const disabled = props.pending;
  return <section className="rounded-xl border border-line bg-white p-4">
    <h2 className="text-lg font-semibold">Workflow</h2>
    {props.role === "admin" ? <textarea value={props.reviewNote} onChange={(event) => props.setReviewNote(event.target.value)} placeholder="Review note" className="mt-3 min-h-20 w-full rounded-lg border border-line p-3 text-sm" /> : null}
    <div className="mt-3 flex flex-wrap gap-2">
      {props.status === "draft" ? <button disabled={disabled} onClick={() => void props.transition("in-review")} className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Submit for review</button> : null}
      {props.role === "admin" && props.status === "in-review" ? <><button disabled={disabled} onClick={() => void props.transition("draft")} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50">Request changes</button><button disabled={disabled} onClick={() => void props.transition("approved")} className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button></> : null}
      {props.role === "admin" && props.status === "approved" ? <><button disabled={disabled} onClick={() => void props.transition("draft")} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50">Reopen draft</button><button disabled={disabled} onClick={() => void props.transition("published")} className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Publish now</button><input type="datetime-local" disabled={!props.schedulerConfigured || disabled} value={props.scheduledAt} onChange={(event) => props.setScheduledAt(event.target.value)} className="rounded-lg border border-line px-3 text-sm disabled:bg-surface-soft" /><button disabled={disabled || !props.schedulerConfigured || !props.scheduledAt} onClick={() => void props.transition("scheduled")} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50">Schedule</button></> : null}
      {props.role === "admin" && props.status === "scheduled" ? <button disabled={disabled} onClick={() => void props.transition("approved")} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50">Cancel schedule</button> : null}
      {props.status === "published" ? <button disabled={disabled} onClick={() => void props.transition("draft")} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50">Start new revision</button> : null}
      {props.role === "admin" && props.status === "published" ? <button disabled={disabled} onClick={() => void props.transition("archived")} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50">Archive</button> : null}
      {props.role === "admin" && props.status === "archived" && props.restoreRevisionId ? <button disabled={disabled} onClick={() => void props.transition("draft", props.restoreRevisionId)} className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Restore latest published revision to draft</button> : null}
    </div>
    {!props.schedulerConfigured && props.status === "approved" ? <p className="mt-3 text-sm text-secondary">Scheduling is disabled. Manual Admin publishing remains available.</p> : null}
  </section>;
}

function Toolbar({ editor, disabled }: { editor: ReturnType<typeof useEditor>; disabled: boolean }) {
  if (!editor) return null;
  const buttons = [
    ["Bold", Bold, () => editor.chain().focus().toggleBold().run()], ["Italic", Italic, () => editor.chain().focus().toggleItalic().run()],
    ["Heading", Heading2, () => editor.chain().focus().toggleHeading({ level: 2 }).run()], ["Bullets", List, () => editor.chain().focus().toggleBulletList().run()],
    ["Numbers", ListOrdered, () => editor.chain().focus().toggleOrderedList().run()], ["Quote", Quote, () => editor.chain().focus().toggleBlockquote().run()],
    ["Undo", Undo2, () => editor.chain().focus().undo().run()], ["Redo", Redo2, () => editor.chain().focus().redo().run()], ["Save", Save, () => editor.commands.focus()],
  ] as const;
  return <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Document formatting">{buttons.map(([label, Icon, action]) => <button key={label} type="button" disabled={disabled} aria-label={label} onClick={action} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line disabled:opacity-40"><Icon className="h-4 w-4" /></button>)}</div>;
}
