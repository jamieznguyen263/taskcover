import Link from "next/link";
import { notFound } from "next/navigation";
import { hasCapability } from "@/lib/work/capabilities";
import { DiscussionRepository } from "@/lib/work/discussion-repository";
import { ProjectsRepository } from "@/lib/work/projects-repository";
import { WorkRepository } from "@/lib/work/repository";
import { WorkItemRepository } from "@/lib/work/work-repository";
import { resolveWorkSession } from "@/lib/work/session";
import { AddProjectMemberForm, RemoveProjectMemberButton } from "@/components/work/projects/project-forms";
import { CreateWorkForm } from "@/components/work/work/create-work-form";
import { WorkDetailDrawer } from "@/components/work/work/work-detail-drawer";
import { WorkViews } from "@/components/work/work/work-views";

export default async function FlowProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ work?: string }>;
}) {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "projects:view")) {
    notFound();
  }
  const accessLevel = resolution.session.accessLevel;
  const canManageProject = hasCapability(accessLevel, "projects:manage");
  const canViewWork = hasCapability(accessLevel, "work:view");
  const canManageWork = hasCapability(accessLevel, "work:manage");
  const canViewInternal = hasCapability(accessLevel, "internal-notes:view");

  const { projectId } = await params;
  const { work: openWorkId } = await searchParams;

  const workRepo = new WorkItemRepository();
  const [project, allMembers, workItems] = await Promise.all([
    new ProjectsRepository().getProject(projectId),
    new WorkRepository().listMembers(),
    canViewWork ? workRepo.listByProject(projectId) : Promise.resolve([]),
  ]);
  if (!project) notFound();

  const activeMembers = allMembers
    .filter((member) => member.status === "active")
    .map((member) => ({ userId: member.userId, displayName: member.displayName }));
  const memberIds = new Set(project.members.map((member) => member.userId));
  const candidates = activeMembers.filter((member) => !memberIds.has(member.userId));

  // Detail drawer: only load when a valid work id for THIS project is requested.
  const openItem = openWorkId ? await workRepo.getById(openWorkId) : null;
  const drawerItem = openItem && openItem.projectId === projectId ? openItem : null;
  const [drawerComments, drawerActivity] = drawerItem
    ? await Promise.all([
        new DiscussionRepository().listComments({ workItemId: drawerItem.id, includeInternal: canViewInternal }),
        new DiscussionRepository().listActivity({ workItemId: drawerItem.id, includeInternal: canViewInternal }),
      ])
    : [[], []];

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

      {canViewWork ? (
        <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="work-heading">
          <h2 id="work-heading" className="text-lg font-semibold text-graphite">
            Work
          </h2>
          <div className="mt-3">
            <WorkViews projectId={projectId} items={workItems} canManage={canManageWork} />
          </div>
          {canManageWork ? (
            <div className="mt-4 border-t border-line-soft pt-4">
              <h3 className="text-sm font-semibold text-graphite">Add work</h3>
              <div className="mt-2">
                <CreateWorkForm projectId={projectId} members={activeMembers} />
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

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
              {canManageProject ? (
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
        {canManageProject ? (
          <div className="mt-3">
            <AddProjectMemberForm projectId={project.id} candidates={candidates} />
          </div>
        ) : null}
      </section>

      {drawerItem ? (
        <WorkDetailDrawer
          projectId={projectId}
          item={drawerItem}
          comments={drawerComments}
          activity={drawerActivity}
          members={activeMembers}
          canManage={canManageWork}
          canPostInternal={canViewInternal}
        />
      ) : null}
    </div>
  );
}
