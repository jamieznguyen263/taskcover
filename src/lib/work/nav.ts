export type FlowNavItem = {
  href: string;
  label: string;
  enabled: boolean;
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

export function getFlowAdminNav(session: { role: "admin" | "editor" }): FlowNavItem[] {
  if (session.role !== "admin") return [];
  return [
    { href: "/flow/admin", label: "Administration", enabled: false },
    { href: "/admin", label: "Content CMS", enabled: true },
  ];
}
