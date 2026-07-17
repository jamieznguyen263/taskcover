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
        eyebrow="Taskcover Flow · Foundation phase"
        title="Your work application is being built here"
        description="Taskcover Flow is the internal system that will bring client context, projects, work, and documents into one place. This first slice (FLOW-001) ships the application shell — navigation, header, command menu, and the detail-drawer primitive future screens will reuse. No client, project, or work data exists yet."
        items={[
          { label: "Home", note: "Role-aware focus and Needs Attention views arrive in FLOW-008." },
          { label: "Inbox", note: "Actionable notifications and Waiting reminders arrive in FLOW-009." },
          { label: "Clients", note: "Client workspace and explainable health arrive in FLOW-004." },
          { label: "Projects", note: "Projects, templates, and Work items arrive in FLOW-005 and FLOW-006." },
          { label: "Docs", note: "Documents with TipTap editing arrive in FLOW-010." },
        ]}
      />
      <DetailDrawerDemo />
    </div>
  );
}
