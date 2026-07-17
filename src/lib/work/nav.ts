import { hasCapability, type WorkAccessLevel } from "./capabilities";

export type FlowNavItem = {
  href: string;
  label: string;
  enabled: boolean;
};

export type FlowNavContext = {
  accessLevel: WorkAccessLevel;
  legacyRole: "admin" | "editor";
};

const PRIMARY_NAV: FlowNavItem[] = [
  { href: "/flow", label: "Home", enabled: true },
  { href: "/flow/inbox", label: "Inbox", enabled: false },
  { href: "/flow/clients", label: "Clients", enabled: false },
  { href: "/flow/projects", label: "Projects", enabled: false },
  { href: "/flow/docs", label: "Docs", enabled: false },
];

export function getFlowPrimaryNav(): FlowNavItem[] {
  return PRIMARY_NAV;
}

/**
 * Administration is gated by the Flow capability model (FLOW-002); the Content CMS link is
 * gated by the legacy CMS role because /admin itself still authorizes on that role. With
 * today's backfill mapping the two coincide, but they are deliberately decoupled here.
 */
export function getFlowAdminNav(context: FlowNavContext): FlowNavItem[] {
  const items: FlowNavItem[] = [];
  if (hasCapability(context.accessLevel, "administration:view")) {
    items.push({ href: "/flow/admin", label: "Administration", enabled: true });
  }
  if (context.legacyRole === "admin") {
    items.push({ href: "/admin", label: "Content CMS", enabled: true });
  }
  return items;
}
