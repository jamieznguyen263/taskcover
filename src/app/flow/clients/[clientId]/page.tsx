import Link from "next/link";
import { notFound } from "next/navigation";
import { hasCapability } from "@/lib/work/capabilities";
import { CLIENT_HEALTH_LABEL } from "@/lib/work/client-health";
import { ClientsRepository } from "@/lib/work/clients-repository";
import { DOCUMENT_KIND_LABEL } from "@/lib/work/document-repository";
import { resolveWorkSession } from "@/lib/work/session";
import { WORK_STATUS_LABEL, WORK_TYPE_LABEL } from "@/lib/work/work-domain";
import {
  AddContactForm,
  RemoveContactButton,
  UpdateClientHealthForm,
} from "@/components/work/clients/client-forms";

export default async function FlowClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "clients:view")) {
    notFound();
  }
  const canManage = hasCapability(resolution.session.accessLevel, "clients:manage");

  const { clientId } = await params;
  const client = await new ClientsRepository().getClient(clientId);
  if (!client) notFound();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          <Link href="/flow/clients" className="hover:underline">
            Clients
          </Link>{" "}
          / {client.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">{client.name}</h1>
        <p className="mt-2 text-sm text-secondary">
          Account Manager: {client.accountManagerName ?? "Unassigned"} · Health:{" "}
          {CLIENT_HEALTH_LABEL[client.healthState]}
          {client.healthReason ? ` — ${client.healthReason}` : ""}
        </p>
      </div>

      {canManage ? (
        <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="health-heading">
          <h2 id="health-heading" className="text-lg font-semibold text-graphite">
            Client health
          </h2>
          <div className="mt-2">
            <UpdateClientHealthForm
              clientId={client.id}
              currentState={client.healthState}
              currentReason={client.healthReason}
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="contacts-heading">
        <h2 id="contacts-heading" className="text-lg font-semibold text-graphite">
          Contacts
        </h2>
        {client.contacts.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No contacts yet.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {client.contacts.map((contact) => (
              <li
                key={contact.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line-soft bg-surface-soft p-3"
              >
                <div>
                  <p className="text-sm font-medium text-graphite">
                    {contact.name}
                    {contact.roleTitle ? <span className="ml-2 text-xs font-normal text-muted">{contact.roleTitle}</span> : null}
                  </p>
                  <p className="text-xs text-muted">
                    {[contact.email, contact.phone].filter(Boolean).join(" · ") || "No contact details"}
                  </p>
                </div>
                {canManage ? (
                  <RemoveContactButton clientId={client.id} contactId={contact.id} contactName={contact.name} />
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {canManage ? (
          <div className="mt-4 border-t border-line-soft pt-4">
            <h3 className="text-sm font-semibold text-graphite">Add a contact</h3>
            <div className="mt-2">
              <AddContactForm clientId={client.id} />
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="text-lg font-semibold text-graphite">
          Projects
        </h2>
        {client.projects.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No projects for this client yet — create one from the Projects page.
          </p>
        ) : (
          <ul className="mt-3 grid gap-1">
            {client.projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/flow/projects/${project.id}`}
                  className="text-sm font-medium text-graphite hover:text-brand-teal"
                >
                  {project.name}
                </Link>
                {project.archivedAt ? <span className="ml-2 text-xs text-muted">Archived</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="work-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="work-heading" className="text-lg font-semibold text-graphite">
            Open work
          </h2>
          <p className="text-xs text-muted">
            {client.openWork.length} open · {client.doneWorkCount} done
          </p>
        </div>
        {client.openWork.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            {client.projects.length === 0
              ? "No projects for this client yet, so there is no work to show."
              : "Nothing open for this client — every work item is done."}
          </p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {client.openWork.map((item) => (
              <li key={item.id} className="rounded-lg border border-line-soft bg-surface-soft p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/flow/projects/${item.projectId}?work=${item.id}`}
                    className="text-sm font-medium text-graphite hover:text-brand-teal"
                  >
                    {item.title}
                  </Link>
                  <span className="text-xs text-muted">{WORK_STATUS_LABEL[item.status]}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {WORK_TYPE_LABEL[item.type]} · {item.projectName} · {item.ownerName ?? "Unassigned"}
                  {item.dueAt ? ` · due ${item.dueAt.toLocaleDateString()}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="documents-heading">
        <h2 id="documents-heading" className="text-lg font-semibold text-graphite">
          Documents
        </h2>
        {client.documents.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No documents linked to this client yet — create one from the Docs page.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {client.documents.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  href={`/flow/docs/${doc.id}`}
                  className="text-sm font-medium text-graphite hover:text-brand-teal"
                >
                  {doc.title}
                </Link>
                <span className="text-xs text-muted">
                  {DOCUMENT_KIND_LABEL[doc.kind]} · updated {doc.updatedAt.toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-lg font-semibold text-graphite">
          Recent activity
        </h2>
        {client.activity.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nothing has happened for this client yet.</p>
        ) : (
          <ol className="mt-3 grid gap-2">
            {client.activity.map((entry) => (
              <li key={entry.id} className="border-l-2 border-line-soft pl-3 text-sm text-secondary">
                <span className="font-medium text-graphite">{entry.actorName ?? "Someone"}</span>{" "}
                {entry.summary}
                <span className="ml-2 text-xs text-muted">{entry.createdAt.toLocaleDateString()}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
