import { DetailDrawerDemo } from "@/components/work/detail-drawer-demo";
import { EmptyState } from "@/components/work/empty-state";
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <EmptyState
        eyebrow="Taskcover Flow"
        title="Client context, projects, and work in one place"
        description="Clients, Projects, and Work are live: track client health, organize delivery cycles as projects, and run work with five statuses, one accountable owner, checklists, dependencies, and discussion attached to each item. Inbox and Docs arrive in the next slices."
        items={[
          { label: "Clients", note: "Live — client list, explainable health, contacts, and projects." },
          { label: "Projects", note: "Live — client and internal projects with members and work." },
          { label: "Work", note: "Live — five statuses, List/Board views, checklists, dependencies, discussion." },
          { label: "Inbox", note: "Actionable notifications and Waiting reminders arrive in FLOW-009." },
          { label: "Docs", note: "Documents with TipTap editing arrive in FLOW-010." },
        ]}
      />
      <DetailDrawerDemo />
    </div>
  );
}
