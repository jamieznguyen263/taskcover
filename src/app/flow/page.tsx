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
        description="Clients and Projects are live: create clients with explainable health, attach contacts, and organize delivery cycles as projects with their own members. Work items, Inbox, and Docs arrive in the next slices."
        items={[
          { label: "Clients", note: "Live — client list, explainable health, contacts, and projects." },
          { label: "Projects", note: "Live — client and internal projects with memberships." },
          { label: "Work", note: "Five-status work items with List/Board/Calendar views arrive in FLOW-006." },
          { label: "Inbox", note: "Actionable notifications and Waiting reminders arrive in FLOW-009." },
          { label: "Docs", note: "Documents with TipTap editing arrive in FLOW-010." },
        ]}
      />
      <DetailDrawerDemo />
    </div>
  );
}
