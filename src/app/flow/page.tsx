import { EmptyState } from "@/components/work/empty-state";
import { HomeWorkList } from "@/components/work/home/home-work-list";
import { hasCapability } from "@/lib/work/capabilities";
import { HomeRepository } from "@/lib/work/home-repository";
import { resolveWorkSession } from "@/lib/work/session";

export default async function FlowHomePage() {
  const resolution = await resolveWorkSession();

  // External collaborators (FLOW-003) get their own Home; the layout has already blocked
  // anyone without active access.
  if (resolution.kind === "external") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <EmptyState
          eyebrow="Taskcover Flow · Shared workspace"
          title={`Welcome, ${resolution.session.displayName}`}
          description="This is your shared Taskcover workspace. When projects and work are shared with you, they will appear here — you only ever see what has been explicitly shared with you."
          items={[
            { label: "Inbox", note: "Feedback and review requests will arrive here." },
            { label: "My Work", note: "Work assigned to you, with deadlines and status." },
            { label: "Shared Projects", note: "Projects your collaboration covers." },
            { label: "Shared Files", note: "Files shared with you, within your access window." },
          ]}
        />
      </div>
    );
  }

  if (resolution.kind !== "active") {
    return null; // layout has already handled disabled/blocked states
  }

  const session = resolution.session;
  const now = new Date();
  const isManager = hasCapability(session.accessLevel, "members:view");
  const homeRepo = new HomeRepository();
  const [home, workload] = await Promise.all([
    homeRepo.getForUser(session.userId, now),
    isManager ? homeRepo.workloadByOwner() : Promise.resolve([]),
  ]);

  const hasAnything =
    home.myWork.length > 0 || home.reviewQueue.length > 0 || home.overdue.length > 0;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Home</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
          Good to see you, {session.displayName}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Your focus for today, everything you own, and what needs attention.
        </p>
      </div>

      {!hasAnything ? (
        <EmptyState
          eyebrow="All clear"
          title="Nothing needs you right now"
          description="You don't own any open work yet. Create work from any project, and it will show up here with its deadlines and status."
        />
      ) : (
        <>
          <HomeWorkList
            title="My focus"
            rows={home.myFocus}
            empty="Nothing due in the next few days."
            now={now}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <HomeWorkList
              title="Overdue"
              rows={home.overdue}
              empty="Nothing overdue — nice."
              highlight
              now={now}
            />
            <HomeWorkList
              title="Needs attention"
              rows={home.needsAttention}
              empty="Nothing waiting or in review."
              now={now}
            />
          </div>
          {isManager ? (
            <HomeWorkList
              title="Review queue"
              rows={home.reviewQueue}
              empty="No work is waiting on your review."
              now={now}
            />
          ) : null}
          <HomeWorkList title="My work" rows={home.myWork} empty="You don't own any open work." now={now} />
        </>
      )}

      {isManager && workload.length > 0 ? (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-sm font-semibold text-graphite">Workload signal</h2>
          <p className="mt-1 text-xs text-muted">Open work items per owner across all projects.</p>
          <ul className="mt-3 grid gap-1">
            {workload.map((entry) => (
              <li key={entry.ownerId} className="flex items-center justify-between text-sm">
                <span className="text-graphite">{entry.ownerName ?? "Unknown"}</span>
                <span className="text-secondary">{entry.openCount} open</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
