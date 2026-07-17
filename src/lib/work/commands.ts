export type FlowCommand =
  | { id: string; label: string; kind: "navigate"; href: string }
  | { id: string; label: string; kind: "sign-out" };

/**
 * FLOW-001 keeps the command menu to safe, static commands only — no database search yet.
 */
export function getFlowCommands(role: "admin" | "editor"): FlowCommand[] {
  const commands: FlowCommand[] = [{ id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" }];
  if (role === "admin") {
    commands.push({ id: "go-cms", label: "Go to Content CMS", kind: "navigate", href: "/admin" });
  }
  commands.push({ id: "sign-out", label: "Sign out", kind: "sign-out" });
  return commands;
}
