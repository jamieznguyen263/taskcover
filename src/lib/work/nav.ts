import { hasCapability, type WorkAccessLevel } from "./capabilities";

export type FlowNavItem = {
  href: string;
  label: string;
  enabled: boolean;
  badge?: number;
};

/** Returns a copy of the nav with the Inbox item's unread badge set (0 hides it). */
export function withInboxBadge(items: FlowNavItem[], unread: number): FlowNavItem[] {
  return items.map((item) => (item.href === "/flow/inbox" ? { ...item, badge: unread } : item));
}

export type FlowNavContext = {
  accessLevel: WorkAccessLevel;
  legacyRole: "admin" | "editor";
};

const PRIMARY_NAV: FlowNavItem[] = [
  { href: "/flow", label: "Home", enabled: true },
  { href: "/flow/inbox", label: "Inbox", enabled: true },
  { href: "/flow/clients", label: "Clients", enabled: true },
  { href: "/flow/projects", label: "Projects", enabled: true },
  { href: "/flow/docs", label: "Docs", enabled: false },
];

export function getFlowPrimaryNav(): FlowNavItem[] {
  return PRIMARY_NAV;
}

/**
 * External collaborators (FLOW-003) get their own navigation per the blueprint: Home,
 * Inbox, My Work, Shared Projects, Shared Files. Only Home is live until shared projects
 * and work exist (FLOW-005/006). Internal-only destinations never appear here.
 */
const EXTERNAL_NAV: FlowNavItem[] = [
  { href: "/flow", label: "Home", enabled: true },
  { href: "/flow/inbox", label: "Inbox", enabled: true },
  { href: "/flow/my-work", label: "My Work", enabled: false },
  { href: "/flow/shared-projects", label: "Shared Projects", enabled: false },
  { href: "/flow/shared-files", label: "Shared Files", enabled: false },
];

export function getExternalNav(): FlowNavItem[] {
  return EXTERNAL_NAV;
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
