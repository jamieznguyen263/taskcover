import Link from "next/link";
import { notFound } from "next/navigation";
import { hasCapability } from "@/lib/work/capabilities";
import { ClientsRepository } from "@/lib/work/clients-repository";
import { ProjectsRepository } from "@/lib/work/projects-repository";
import { resolveWorkSession } from "@/lib/work/session";
import { CreateProjectForm } from "@/components/work/projects/project-forms";

export default async function FlowProjectsPage() {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "projects:view")) {
    notFound();
  }
  const canManage = hasCapability(resolution.session.accessLevel, "projects:manage");

  const [projectList, clientList] = await Promise.all([
    new ProjectsRepository().listProjects(),
    canManage ? new ClientsRepository().listClients() : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Projects</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
          Goals and delivery cycles
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">
          A project is a specific goal, delivery cycle, or internal initiative. Open one to plan
          its work in List or Board view.
        </p>
      </div>

      <section className="rounded-xl border border-line bg-white p-4">
        {projectList.length === 0 ? (
          <p className="text-sm text-muted">No projects yet{canManage ? " — create the first one below." : "."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="py-2">Project</th>
                  <th>Kind</th>
                  <th>Client</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {projectList.map((project) => (
                  <tr key={project.id}>
                    <td className="py-3 font-medium text-graphite">
                      <Link href={`/flow/projects/${project.id}`} className="hover:text-brand-teal">
                        {project.name}
                      </Link>
                    </td>
                    <td className="py-3 text-secondary">{project.kind === "client" ? "Client" : "Internal"}</td>
                    <td className="py-3 text-secondary">
                      {project.clientName ?? (project.kind === "internal" ? "Taskcover" : "—")}
                    </td>
                    <td className="py-3 text-secondary">{project.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {canManage ? (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-graphite">Create a project</h2>
          <div className="mt-2">
            <CreateProjectForm clients={clientList.map((client) => ({ id: client.id, name: client.name }))} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
