export type WorkAccessLevel = "owner" | "admin" | "manager" | "member";

export type WorkCapability =
  | "flow:access"
  | "teams:view"
  | "members:view"
  | "teams:manage"
  | "administration:view"
  | "clients:view"
  | "clients:manage"
  | "projects:view"
  | "projects:manage"
  | "work:view"
  | "work:manage"
  | "internal-notes:view"
  | "docs:view"
  | "docs:manage";

/**
 * Deny-by-default capability model. Code is the single source of truth for what each
 * access level may do — the role_presets table mirrors these sets for display and future
 * custom presets (seeded in migration 0005, updated by later migrations), but
 * authorization decisions never read the database. Levels are strictly cumulative:
 * member ⊂ manager ⊂ admin = owner. Client/project *visibility* is company-wide for
 * internal staff (client context is the point of the product); *managing* them is
 * manager+. External collaborators never hold any of these capabilities.
 */
const MEMBER_CAPABILITIES: readonly WorkCapability[] = [
  "flow:access",
  "teams:view",
  "clients:view",
  "projects:view",
  // Internal staff can see and act on work company-wide; `internal-notes:view` marks the
  // boundary that external collaborators (FLOW-003) never cross — internal comments are
  // invisible to them (enforced in the FLOW-007 repository, not by UI).
  "work:view",
  "work:manage",
  "internal-notes:view",
  // Documents (FLOW-010) are company-wide for internal staff, like work: view + author.
  "docs:view",
  "docs:manage",
];
const MANAGER_CAPABILITIES: readonly WorkCapability[] = [
  ...MEMBER_CAPABILITIES,
  "members:view",
  "clients:manage",
  "projects:manage",
];
const ADMIN_CAPABILITIES: readonly WorkCapability[] = [
  ...MANAGER_CAPABILITIES,
  "teams:manage",
  "administration:view",
];

export const CAPABILITIES_BY_ACCESS_LEVEL: Record<WorkAccessLevel, readonly WorkCapability[]> = {
  member: MEMBER_CAPABILITIES,
  manager: MANAGER_CAPABILITIES,
  admin: ADMIN_CAPABILITIES,
  owner: ADMIN_CAPABILITIES,
};

export const SYSTEM_ROLE_PRESETS: readonly {
  key: WorkAccessLevel;
  name: string;
  description: string;
}[] = [
  { key: "owner", name: "Owner", description: "Full control of Taskcover Flow, including administration." },
  { key: "admin", name: "Admin", description: "Administration, teams, and member management." },
  { key: "manager", name: "Manager", description: "Member visibility on top of everyday member access." },
  { key: "member", name: "Member", description: "Everyday access to Taskcover Flow." },
];

export function hasCapability(accessLevel: WorkAccessLevel, capability: WorkCapability): boolean {
  return CAPABILITIES_BY_ACCESS_LEVEL[accessLevel].includes(capability);
}

export class WorkAuthorizationError extends Error {
  constructor(capability: WorkCapability) {
    super(`Forbidden: missing ${capability}`);
    this.name = "WorkAuthorizationError";
  }
}

export function assertCapability(accessLevel: WorkAccessLevel, capability: WorkCapability) {
  if (!hasCapability(accessLevel, capability)) throw new WorkAuthorizationError(capability);
}
