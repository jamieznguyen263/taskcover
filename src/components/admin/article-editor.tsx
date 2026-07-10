"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import {
  Braces,
  Calendar,
  FileText,
  Globe2,
  Landmark,
  Link2,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
} from "lucide-react";
import type { InsightArticle, InsightStatus } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import type { AdminRole } from "@/lib/admin/permissions";
import type { PublishQaResult, PublishQaSection } from "@/lib/insights/publish-qa";
import type { ArticleAssignment, ContentComment, WorkflowEventEntry } from "@/lib/admin/repository";
import { InsightBlockRenderer } from "@/components/marketing/insights/insight-block-renderer";
import { normalizeTiptapToInsightBlocks } from "@/lib/admin/normalization";
import { BlockEditorSurface, buildEditorExtensions, DocumentOutline } from "./editor/block-editor";
import { CollaborationPanel } from "./editor/collaboration-panel";
import { Field, TextArea, TextInput } from "./editor/controls";
import { EvidenceManager } from "./editor/evidence-manager";
import { GeoPanel } from "./editor/geo-panel";
import { InternalLinkingPanel } from "./editor/internal-linking-panel";
import { LocalizationPanel, type SiblingLocalization } from "./editor/localization-panel";
import { MetadataSocialForm } from "./editor/metadata-social-form";
import { PublishQaPanel } from "./editor/publish-qa-panel";
import { RawJsonPanel } from "./editor/raw-json-panel";
import { SchemaBuilder } from "./editor/schema-builder";
import { SearchStrategyForm } from "./editor/search-strategy-form";

type SectionId = "document" | "strategy" | "evidence" | "linking" | "metadata" | "schema" | "geo" | "localization" | "qa" | "json";
type SaveState = "Saved" | "Unsaved changes" | "Saving" | "Save failed" | "Conflict detected";

const sections: { id: SectionId; label: string; icon: typeof FileText; adminOnly?: boolean }[] = [
  { id: "document", label: "Document", icon: FileText },
  { id: "strategy", label: "Search Strategy", icon: Search },
  { id: "evidence", label: "Content & Evidence", icon: Landmark },
  { id: "linking", label: "Internal Linking", icon: Link2 },
  { id: "metadata", label: "Metadata & Social", icon: Tags },
  { id: "schema", label: "Schema", icon: Braces },
  { id: "geo", label: "GEO", icon: Sparkles },
  { id: "localization", label: "Localization", icon: Globe2 },
  { id: "qa", label: "Publish QA", icon: ShieldCheck },
  { id: "json", label: "Developer JSON", icon: Braces, adminOnly: true },
];

export type EditorSibling = SiblingLocalization & { editorDocument: unknown };

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
  siblings: EditorSibling[];
  publishedSlug: string | null;
  publishedArticles: { slug: string; category: string; h1: string; focusKeyword: string }[];
  assignment: ArticleAssignment;
  assignableUsers: { id: string; displayName: string; role: AdminRole }[];
  comments: ContentComment[];
  workflowEvents: WorkflowEventEntry[];
  storedQa: PublishQaResult[];
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionId>("document");
  const [article, setArticle] = useState(props.article);
  const [lockVersion, setLockVersion] = useState(props.lockVersion);
  const [status, setStatus] = useState(props.status);
  const [saveState, setSaveState] = useState<SaveState>("Saved");
  const [message, setMessage] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [qa, setQa] = useState<PublishQaResult[]>(props.storedQa);
  const [jsonError, setJsonError] = useState("");
  const [transitionPending, setTransitionPending] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const articleRef = useRef(article);
  const versionRef = useRef(lockVersion);
  const dirtyRevision = useRef(0);
  const saveInFlight = useRef(false);
  const transitionInFlight = useRef(false);
  const initialDocument = useMemo(() => props.editorDocument, [props.editorDocument]);
  const editable = status === "draft";

  const editor = useEditor({
    extensions: buildEditorExtensions(),
    content: initialDocument as never,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-body min-h-[520px] rounded-lg border border-line bg-white px-5 py-4 text-sm leading-7 outline-none",
        "aria-label": "Article body",
      },
    },
    onUpdate: ({ editor: current }) => {
      const next = { ...articleRef.current, blocks: normalizeTiptapToInsightBlocks(current.getJSON()) };
      articleRef.current = next;
      setArticle(next);
      dirtyRevision.current += 1;
      setSaveState("Unsaved changes");
    },
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

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

  const copyBodyFromSource = useCallback(
    (sourceLocale: Locale) => {
      const source = props.siblings.find((sibling) => sibling.locale === sourceLocale);
      if (!source || !editor) return;
      editor.commands.setContent(source.editorDocument as never, { emitUpdate: true });
      updateArticle({ localization: { ...articleRef.current.localization, syncedFromSourceVersion: source.draftVersion } });
      setActiveSection("document");
    },
    [editor, props.siblings, updateArticle]
  );

  const siblingArticles = useMemo(() => {
    const others = props.siblings.filter((sibling) => sibling.locale !== article.locale).map((sibling) => sibling.article);
    return [article, ...others];
  }, [article, props.siblings]);

  const changeRequests = props.comments.filter((comment) => comment.kind === "change-request" && !comment.resolvedAt).length;

  const visibleSections = sections.filter((section) => !section.adminOnly || props.role === "admin");

  return (
    <div className={focusMode ? "fixed inset-0 z-40 overflow-y-auto bg-surface-soft p-4" : "grid gap-4"}>
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-tint px-3 py-1 text-xs font-semibold text-brand-teal">{status}</span>
          {props.availableLocales.map((locale) => (
            <Link
              key={locale}
              href={`/admin/insights/${props.articleId}?locale=${locale}`}
              className={`rounded-full border px-3 py-1 text-xs ${locale === article.locale ? "border-brand-teal text-brand-teal" : "border-line text-secondary"}`}
            >
              {locale.toUpperCase()}
            </Link>
          ))}
          <Link href={`/admin/insights/${props.articleId}/preview?locale=${article.locale}`} className="rounded-full border border-line px-3 py-1 text-xs text-secondary">
            Full preview
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span aria-live="polite" className={`text-xs ${saveState === "Save failed" || saveState === "Conflict detected" ? "font-semibold text-red-700" : "text-secondary"}`}>
            {saveState} · v{lockVersion}
          </span>
          <button type="button" disabled={!editable || saveState === "Saving" || Boolean(jsonError)} onClick={() => void save()} className="rounded-lg border border-line px-3 py-2 text-xs font-semibold disabled:opacity-50">
            Save now
          </button>
          {saveState === "Conflict detected" ? (
            <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-brand-teal px-3 py-2 text-xs font-semibold text-white">
              Reload latest
            </button>
          ) : null}
          <button type="button" aria-label={focusMode ? "Exit focus mode" : "Focus mode"} onClick={() => setFocusMode((value) => !value)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-secondary hover:text-brand-teal">
            {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          {!focusMode ? (
            <>
              <button type="button" aria-label={leftOpen ? "Hide left panel" : "Show left panel"} onClick={() => setLeftOpen((value) => !value)} className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-secondary hover:text-brand-teal lg:inline-flex">
                {leftOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </button>
              <button type="button" aria-label={rightOpen ? "Hide right panel" : "Show right panel"} onClick={() => setRightOpen((value) => !value)} className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-secondary hover:text-brand-teal lg:inline-flex">
                {rightOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {message ? <p role="status" className="rounded-lg border border-line bg-white p-3 text-sm text-secondary">{message}</p> : null}
      {!editable ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Content is read-only while the article is {status}. Use an allowed workflow action to return it to draft.
        </p>
      ) : null}
      {jsonError ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{jsonError}</p> : null}

      {/* Main 3-pane layout */}
      <div
        className={`grid gap-4 ${focusMode ? "" : leftOpen && rightOpen ? "lg:grid-cols-[14rem_minmax(0,1fr)_20rem]" : leftOpen ? "lg:grid-cols-[14rem_minmax(0,1fr)]" : rightOpen ? "lg:grid-cols-[minmax(0,1fr)_20rem]" : ""}`}
      >
        {/* Left rail */}
        {!focusMode && leftOpen ? (
          <aside className="grid content-start gap-4">
            <nav aria-label="Editor sections" className="grid gap-0.5 rounded-xl border border-line bg-white p-2">
              {visibleSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    type="button"
                    aria-current={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-left text-sm font-medium ${activeSection === section.id ? "bg-surface-tint text-brand-teal" : "text-secondary hover:text-brand-teal"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {section.label}
                    {section.id === "qa" && qa.some((item) => item.severity === "error") ? <span className="ml-auto h-2 w-2 rounded-full bg-red-500" aria-label="Blocking errors" /> : null}
                  </button>
                );
              })}
            </nav>
            {activeSection === "document" ? (
              <div className="rounded-xl border border-line bg-white p-3">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Outline</h2>
                <DocumentOutline editor={editor} />
              </div>
            ) : null}
            <div className="rounded-xl border border-line bg-white p-3">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Locales</h2>
              <div className="grid gap-1">
                {props.siblings.map((sibling) => (
                  <div key={sibling.locale} className="flex items-center justify-between text-xs">
                    <span className={sibling.locale === article.locale ? "font-semibold text-brand-teal" : "text-secondary"}>{sibling.locale.toUpperCase()}</span>
                    <span className={sibling.article.localization.translationStatus === "complete" ? "text-emerald-700" : "text-amber-700"}>
                      {sibling.article.localization.translationStatus === "complete" ? "Complete" : "Needs review"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-xs text-secondary">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Workflow</h2>
              <p>State: <span className="font-semibold text-graphite">{status}</span></p>
              {props.assignment.dueDate ? (
                <p className="mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" aria-hidden="true" /> Due {new Date(props.assignment.dueDate).toLocaleDateString()}</p>
              ) : null}
              {changeRequests > 0 ? <p className="mt-1 font-semibold text-amber-700">{changeRequests} open change request(s)</p> : null}
            </div>
          </aside>
        ) : null}

        {/* Center */}
        <section className="min-w-0 rounded-xl border border-line bg-white p-4">
          {activeSection === "document" ? (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Public H1"><TextInput value={article.h1} disabled={!editable} onChange={(h1) => updateArticle({ h1 })} /></Field>
                <Field label="Internal title"><TextInput value={article.internalTitle} disabled={!editable} onChange={(internalTitle) => updateArticle({ internalTitle })} /></Field>
              </div>
              <Field label="Excerpt"><TextArea value={article.excerpt} disabled={!editable} rows={2} onChange={(excerpt) => updateArticle({ excerpt })} /></Field>
              <details className="rounded-lg border border-line-soft bg-surface-soft p-3">
                <summary className="cursor-pointer text-sm font-medium text-graphite">Cover image</summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Field label="Cover image URL"><TextInput value={article.coverImage} disabled={!editable} onChange={(coverImage) => updateArticle({ coverImage })} /></Field>
                  <Field label="Cover image alt" hint="Required for publishing."><TextInput value={article.coverImageAlt} disabled={!editable} onChange={(coverImageAlt) => updateArticle({ coverImageAlt })} /></Field>
                  <div className="md:col-span-2">
                    <Field label="Cover image caption"><TextInput value={article.coverImageCaption} disabled={!editable} onChange={(coverImageCaption) => updateArticle({ coverImageCaption })} /></Field>
                  </div>
                </div>
              </details>
              <BlockEditorSurface editor={editor} disabled={!editable} />
              <button type="button" onClick={() => setShowPreview((value) => !value)} className="justify-self-start rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-secondary hover:text-brand-teal">
                {showPreview ? "Hide rendered preview" : "Show rendered preview"}
              </button>
              {showPreview ? (
                <div className="rounded-xl border border-line bg-surface-soft p-4">
                  <InsightBlockRenderer article={{ ...article, status }} locale={article.locale} />
                </div>
              ) : null}
            </div>
          ) : activeSection === "strategy" ? (
            <SearchStrategyForm article={article} editable={editable} update={updateArticle} />
          ) : activeSection === "evidence" ? (
            <EvidenceManager article={article} editable={editable} update={updateArticle} />
          ) : activeSection === "linking" ? (
            <InternalLinkingPanel article={article} editable={editable} update={updateArticle} publishedArticles={props.publishedArticles} />
          ) : activeSection === "metadata" ? (
            <MetadataSocialForm article={article} editable={editable} update={updateArticle} publishedSlug={props.publishedSlug} />
          ) : activeSection === "schema" ? (
            <SchemaBuilder article={article} editable={editable} update={updateArticle} />
          ) : activeSection === "geo" ? (
            <GeoPanel article={article} editable={editable} update={updateArticle} />
          ) : activeSection === "localization" ? (
            <LocalizationPanel article={article} editable={editable} update={updateArticle} siblings={props.siblings} onCopyBodyFromSource={copyBodyFromSource} />
          ) : activeSection === "qa" ? (
            <PublishQaPanel article={article} siblings={siblingArticles} storedResults={qa} onNavigate={(section) => setActiveSection(sectionForQa(section))} />
          ) : (
            <RawJsonPanel article={article} editable={editable} update={updateArticle} setError={setJsonError} />
          )}
        </section>

        {/* Right rail */}
        {!focusMode && rightOpen ? (
          <aside className="grid content-start gap-4">
            <div className="rounded-xl border border-line bg-white p-4">
              <WorkflowControls
                status={status}
                role={props.role}
                schedulerConfigured={props.schedulerConfigured}
                reviewNote={reviewNote}
                setReviewNote={setReviewNote}
                scheduledAt={scheduledAt}
                setScheduledAt={setScheduledAt}
                restoreRevisionId={props.restoreRevisionId}
                transition={transition}
                pending={transitionPending}
              />
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <CollaborationPanel
                articleGroupId={props.articleId}
                role={props.role}
                assignment={props.assignment}
                users={props.assignableUsers}
                comments={props.comments}
                events={props.workflowEvents}
              />
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function sectionForQa(section: PublishQaSection): SectionId {
  switch (section) {
    case "document":
      return "document";
    case "strategy":
      return "strategy";
    case "evidence":
      return "evidence";
    case "linking":
      return "linking";
    case "metadata":
      return "metadata";
    case "schema":
      return "schema";
    case "localization":
      return "localization";
    case "geo":
      return "geo";
  }
}

function WorkflowControls(props: {
  status: InsightStatus;
  role: AdminRole;
  schedulerConfigured: boolean;
  reviewNote: string;
  setReviewNote: (value: string) => void;
  scheduledAt: string;
  setScheduledAt: (value: string) => void;
  restoreRevisionId?: string;
  transition: (to: InsightStatus, revisionId?: string) => Promise<void>;
  pending: boolean;
}) {
  const disabled = props.pending;
  const primary = "rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50";
  const secondary = "rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50";
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Workflow</h2>
      {props.role === "admin" ? (
        <textarea value={props.reviewNote} onChange={(event) => props.setReviewNote(event.target.value)} placeholder="Review / approval note" className="mt-3 min-h-16 w-full rounded-lg border border-line p-3 text-sm" />
      ) : null}
      <div className="mt-3 grid gap-2">
        {props.status === "draft" ? <button disabled={disabled} onClick={() => void props.transition("in-review")} className={primary}>Submit for review</button> : null}
        {props.role === "admin" && props.status === "in-review" ? (
          <>
            <button disabled={disabled} onClick={() => void props.transition("approved")} className={primary}>Approve</button>
            <button disabled={disabled} onClick={() => void props.transition("draft")} className={secondary}>Request changes</button>
          </>
        ) : null}
        {props.role === "admin" && props.status === "approved" ? (
          <>
            <button disabled={disabled} onClick={() => void props.transition("published")} className={primary}>Publish now</button>
            <button disabled={disabled} onClick={() => void props.transition("draft")} className={secondary}>Reopen draft</button>
            <input type="datetime-local" disabled={!props.schedulerConfigured || disabled} value={props.scheduledAt} onChange={(event) => props.setScheduledAt(event.target.value)} className="rounded-lg border border-line px-3 py-2 text-sm disabled:bg-surface-soft" />
            <button disabled={disabled || !props.schedulerConfigured || !props.scheduledAt} onClick={() => void props.transition("scheduled")} className={secondary}>Schedule</button>
          </>
        ) : null}
        {props.role === "admin" && props.status === "scheduled" ? <button disabled={disabled} onClick={() => void props.transition("approved")} className={secondary}>Cancel schedule</button> : null}
        {props.status === "published" ? <button disabled={disabled} onClick={() => void props.transition("draft")} className={secondary}>Start new revision</button> : null}
        {props.role === "admin" && props.status === "published" ? <button disabled={disabled} onClick={() => void props.transition("archived")} className={secondary}>Archive</button> : null}
        {props.role === "admin" && props.status === "archived" && props.restoreRevisionId ? (
          <button disabled={disabled} onClick={() => void props.transition("draft", props.restoreRevisionId)} className={primary}>Restore latest published revision to draft</button>
        ) : null}
      </div>
      {!props.schedulerConfigured && props.status === "approved" ? <p className="mt-3 text-xs text-secondary">Scheduling is disabled. Manual Admin publishing remains available.</p> : null}
    </section>
  );
}
