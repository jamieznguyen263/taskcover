import { hasCapability, type WorkAccessLevel } from "./capabilities";

export type FlowCommand =
  | { id: string; label: string; kind: "navigate"; href: string }
  | { id: string; label: string; kind: "sign-out" };

export type FlowCommandContext = {
  accessLevel: WorkAccessLevel;
  legacyRole: "admin" | "editor";
};

/**
 * Static, safe commands only — no database search yet (that arrives with FLOW-011's
 * permission-aware search). Administration is capability-gated; Content CMS follows the
 * legacy CMS role, mirroring getFlowAdminNav.
 */
export function getFlowCommands(context: FlowCommandContext): FlowCommand[] {
  const commands: FlowCommand[] = [
    { id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" },
    { id: "go-inbox", label: "Go to Inbox", kind: "navigate", href: "/flow/inbox" },
  ];
  if (hasCapability(context.accessLevel, "clients:view")) {
    commands.push({ id: "go-clients", label: "Go to Clients", kind: "navigate", href: "/flow/clients" });
  }
  if (hasCapability(context.accessLevel, "projects:view")) {
    commands.push({ id: "go-projects", label: "Go to Projects", kind: "navigate", href: "/flow/projects" });
  }
  if (hasCapability(context.accessLevel, "administration:view")) {
    commands.push({ id: "go-admin", label: "Go to Administration", kind: "navigate", href: "/flow/admin" });
  }
  if (context.legacyRole === "admin") {
    commands.push({ id: "go-cms", label: "Go to Content CMS", kind: "navigate", href: "/admin" });
  }
  commands.push({ id: "sign-out", label: "Sign out", kind: "sign-out" });
  return commands;
}
