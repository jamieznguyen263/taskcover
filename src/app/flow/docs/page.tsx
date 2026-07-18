import Link from "next/link";
import { notFound } from "next/navigation";
import { hasCapability } from "@/lib/work/capabilities";
import { ClientsRepository } from "@/lib/work/clients-repository";
import { DocumentRepository } from "@/lib/work/document-repository";
import { ProjectsRepository } from "@/lib/work/projects-repository";
import { resolveWorkSession } from "@/lib/work/session";
import { CreateDocumentForm } from "@/components/work/docs/document-forms";

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

export default async function FlowDocsPage() {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "docs:view")) {
    notFound();
  }
  const accessLevel = resolution.session.accessLevel;
  const canManage = hasCapability(accessLevel, "docs:manage");
  const canInternal = hasCapability(accessLevel, "internal-notes:view");

  const [docs, clientList, projectList] = await Promise.all([
    new DocumentRepository().list({ includeInternal: canInternal }),
    canManage ? new ClientsRepository().listClients() : Promise.resolve([]),
    canManage ? new ProjectsRepository().listProjects() : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Docs</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">Documents</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">
          Strategies, briefs, meeting notes, SOPs, and more — versioned, linked to clients and
          projects, and (for meeting notes) able to turn action items into work.
        </p>
      </div>

      <section className="rounded-xl border border-line bg-white p-4">
        {docs.length === 0 ? (
          <p className="text-sm text-muted">No documents yet{canManage ? " — create one below." : "."}</p>
        ) : (
          <ul className="grid gap-2">
            {docs.map((doc) => (
              <li key={doc.id} className="rounded-lg border border-line-soft bg-surface-soft p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/flow/docs/${doc.id}`} className="text-sm font-medium text-graphite hover:text-brand-teal">
                    {doc.title}
                  </Link>
                  <span className="text-xs text-muted">
                    {KIND_LABEL[doc.kind]}
                    {doc.visibility === "internal" ? " · Internal" : " · Shared"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {[doc.clientName, doc.projectName].filter(Boolean).join(" · ") || "Unlinked"} · updated{" "}
                  {doc.updatedAt.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canManage ? (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-graphite">New document</h2>
          <div className="mt-2">
            <CreateDocumentForm
              canInternal={canInternal}
              clients={clientList.map((c) => ({ id: c.id, name: c.name }))}
              projects={projectList.map((p) => ({ id: p.id, name: p.name }))}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
