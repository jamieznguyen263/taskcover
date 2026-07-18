import Link from "next/link";
import { notFound } from "next/navigation";
import { hasCapability } from "@/lib/work/capabilities";
import { ProjectsRepository } from "@/lib/work/projects-repository";
import { WorkRepository } from "@/lib/work/repository";
import { resolveWorkSession } from "@/lib/work/session";
import { AddProjectMemberForm, RemoveProjectMemberButton } from "@/components/work/projects/project-forms";

export default async function FlowProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "projects:view")) {
    notFound();
  }
  const canManage = hasCapability(resolution.session.accessLevel, "projects:manage");

  const { projectId } = await params;
  const [project, members] = await Promise.all([
    new ProjectsRepository().getProject(projectId),
    canManage ? new WorkRepository().listMembers() : Promise.resolve([]),
  ]);
  if (!project) notFound();

  const memberIds = new Set(project.members.map((member) => member.userId));
  const candidates = members
    .filter((member) => member.status === "active" && !memberIds.has(member.userId))
    .map((member) => ({ userId: member.userId, displayName: member.displayName }));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          <Link href="/flow/projects" className="hover:underline">
            Projects
          </Link>{" "}
          / {project.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">{project.name}</h1>
        <p className="mt-2 text-sm text-secondary">
          {project.kind === "client" ? (
            project.clientId ? (
              <>
                Client:{" "}
                <Link href={`/flow/clients/${project.clientId}`} className="font-medium hover:text-brand-teal">
                  {project.clientName}
                </Link>
              </>
            ) : (
              "Client project (client detached)"
            )
          ) : (
            "Internal initiative"
          )}
          {project.description ? ` · ${project.description}` : ""}
        </p>
      </div>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="project-members-heading">
        <h2 id="project-members-heading" className="text-lg font-semibold text-graphite">
          Project members
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-xs text-secondary"
            >
              {member.displayName}
              {canManage ? (
                <RemoveProjectMemberButton
                  projectId={project.id}
                  userId={member.userId}
                  displayName={member.displayName}
                />
              ) : null}
            </li>
          ))}
          {project.members.length === 0 ? <li className="text-xs text-muted">No members yet.</li> : null}
        </ul>
        {canManage ? (
          <div className="mt-3">
            <AddProjectMemberForm projectId={project.id} candidates={candidates} />
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="text-lg font-semibold text-graphite">Work</h2>
        <p className="mt-2 text-sm text-muted">
          Work items with the five canonical statuses, one accountable Owner, and List / Board /
          Calendar views arrive with FLOW-006 and will live here.
        </p>
      </section>
    </div>
  );
}
