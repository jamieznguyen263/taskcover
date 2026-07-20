import Link from "next/link";
import { notFound } from "next/navigation";
import { hasCapability } from "@/lib/work/capabilities";
import { CLIENT_HEALTH_LABEL } from "@/lib/work/client-health";
import { ClientsRepository } from "@/lib/work/clients-repository";
import { WorkRepository } from "@/lib/work/repository";
import { resolveWorkSession } from "@/lib/work/session";
import { CreateClientForm } from "@/components/work/clients/client-forms";

const HEALTH_BADGE_CLASS = {
  good: "bg-surface-tint text-brand-teal",
  watch: "bg-amber-50 text-amber-700",
  at_risk: "bg-red-50 text-red-700",
  unknown: "bg-surface-soft text-muted",
} as const;

export default async function FlowClientsPage() {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "clients:view")) {
    notFound();
  }
  const canManage = hasCapability(resolution.session.accessLevel, "clients:manage");

  const clientsRepo = new ClientsRepository();
  const [clientList, members] = await Promise.all([
    clientsRepo.listClients(),
    canManage ? new WorkRepository().listMembers() : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Clients</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">Client context</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">
          Every client carries explainable health — a state plus a written reason, never an
          opaque score. Open a client to see its projects, work, documents, and activity in one place.
        </p>
      </div>

      <section className="rounded-xl border border-line bg-white p-4">
        {clientList.length === 0 ? (
          <p className="text-sm text-muted">No clients yet{canManage ? " — create the first one below." : "."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="py-2">Client</th>
                  <th>Health</th>
                  <th>Account Manager</th>
                  <th>Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {clientList.map((client) => (
                  <tr key={client.id}>
                    <td className="py-3 font-medium text-graphite">
                      <Link href={`/flow/clients/${client.id}`} className="hover:text-brand-teal">
                        {client.name}
                      </Link>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${HEALTH_BADGE_CLASS[client.healthState]}`}
                      >
                        {CLIENT_HEALTH_LABEL[client.healthState]}
                      </span>
                      {client.healthReason ? (
                        <p className="mt-1 max-w-xs text-xs text-muted">{client.healthReason}</p>
                      ) : null}
                    </td>
                    <td className="py-3 text-secondary">{client.accountManagerName ?? "—"}</td>
                    <td className="py-3 text-secondary">{client.projectCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {canManage ? (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-graphite">Add a client</h2>
          <div className="mt-2">
            <CreateClientForm
              managers={members
                .filter((member) => member.status === "active")
                .map((member) => ({ userId: member.userId, displayName: member.displayName }))}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
