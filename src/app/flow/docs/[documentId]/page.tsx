import Link from "next/link";
import { notFound } from "next/navigation";
import { extractActions } from "@/lib/work/action-extraction";
import { hasCapability } from "@/lib/work/capabilities";
import { DocumentRepository } from "@/lib/work/document-repository";
import { htmlToText } from "@/lib/work/html-text";
import { ProjectsRepository } from "@/lib/work/projects-repository";
import { resolveWorkSession } from "@/lib/work/session";
import { ActionPreviewForm, EditDocumentForm } from "@/components/work/docs/document-forms";
import { RichTextView } from "@/components/work/docs/rich-text-editor";

const KIND_LABEL: Record<string, string> = {
  strategy: "Strategy",
  brief: "Brief",
  meeting_note: "Meeting note",
  sop: "SOP",
  report: "Report",
  proposal: "Proposal",
  research: "Research",
  decision: "Decision",
  general: "General",
};

export default async function FlowDocumentDetailPage({ params }: { params: Promise<{ documentId: string }> }) {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "docs:view")) {
    notFound();
  }
  const accessLevel = resolution.session.accessLevel;
  const canManage = hasCapability(accessLevel, "docs:manage");
  const canInternal = hasCapability(accessLevel, "internal-notes:view");
  const canManageWork = hasCapability(accessLevel, "work:manage");

  const { documentId } = await params;
  const doc = await new DocumentRepository().get({ documentId, includeInternal: canInternal });
  if (!doc) notFound();

  // Action extraction runs only for meeting notes and only for users who can create work.
  const actions = doc.kind === "meeting_note" && canManageWork ? extractActions(htmlToText(doc.body)) : [];
  const projectList = actions.length > 0 ? await new ProjectsRepository().listProjects() : [];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          <Link href="/flow/docs" className="hover:underline">
            Docs
          </Link>{" "}
          / {doc.title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">{doc.title}</h1>
        <p className="mt-2 text-sm text-secondary">
          {KIND_LABEL[doc.kind]} · v{doc.version} · {doc.visibility === "internal" ? "Internal" : "Shared"}
          {doc.clientName ? (
            <>
              {" · Client: "}
              <Link href={`/flow/clients/${doc.clientId}`} className="font-medium hover:text-brand-teal">
                {doc.clientName}
              </Link>
            </>
          ) : null}
          {doc.projectName ? (
            <>
              {" · Project: "}
              <Link href={`/flow/projects/${doc.projectId}`} className="font-medium hover:text-brand-teal">
                {doc.projectName}
              </Link>
            </>
          ) : null}
        </p>
      </div>

      {canManage ? (
        <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="edit-heading">
          <h2 id="edit-heading" className="text-lg font-semibold text-graphite">
            Edit
          </h2>
          <div className="mt-2">
            <EditDocumentForm
              documentId={doc.id}
              title={doc.title}
              kind={doc.kind}
              body={doc.body}
              isInternal={doc.visibility === "internal"}
              canInternal={canInternal}
            />
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-lg font-semibold text-graphite">Content</h2>
          <div className="mt-2">
            {htmlToText(doc.body) ? <RichTextView html={doc.body} /> : <p className="text-sm text-muted">Empty document.</p>}
          </div>
        </section>
      )}

      {doc.kind === "meeting_note" && canManageWork ? (
        <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="text-lg font-semibold text-graphite">
            Extract actions
          </h2>
          <p className="mt-1 text-sm text-muted">
            Deterministic — no AI guesswork. Detected from your note; you choose what becomes work.
          </p>
          <div className="mt-3">
            <ActionPreviewForm
              documentId={doc.id}
              actions={actions}
              projects={projectList.map((p) => ({ id: p.id, name: p.name }))}
              defaultProjectId={doc.projectId}
            />
          </div>
        </section>
      ) : null}

      {doc.linkedWork.length > 0 ? (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-lg font-semibold text-graphite">Related work</h2>
          <ul className="mt-2 grid gap-1">
            {doc.linkedWork.map((work) => (
              <li key={work.id}>
                <Link
                  href={`/flow/projects/${work.projectId}?work=${work.id}`}
                  className="text-sm font-medium text-graphite hover:text-brand-teal"
                >
                  {work.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="text-lg font-semibold text-graphite">Version history</h2>
        <ul className="mt-2 grid gap-1 text-sm">
          <li className="text-graphite">
            <span className="font-medium">v{doc.version}</span> (current) · {doc.updatedByName ?? "Unknown"} ·{" "}
            {doc.updatedAt.toLocaleString()}
          </li>
          {doc.versions.map((entry) => (
            <li key={entry.version} className="text-muted">
              v{entry.version} · {entry.authorName ?? "Unknown"} · {entry.createdAt.toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
