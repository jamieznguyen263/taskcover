export type WorkAccessLevel = "owner" | "admin" | "manager" | "member";

export type WorkCapability =
  | "flow:access"
  | "teams:view"
  | "members:view"
  | "teams:manage"
  | "administration:view";

/**
 * Deny-by-default capability model. Code is the single source of truth for what each
 * access level may do — the role_presets table mirrors these sets for display and future
 * custom presets (seeded in migration 0005), but authorization decisions never read the
 * database. Levels are strictly cumulative: member ⊂ manager ⊂ admin = owner.
 */
const MEMBER_CAPABILITIES: readonly WorkCapability[] = ["flow:access", "teams:view"];
const MANAGER_CAPABILITIES: readonly WorkCapability[] = [...MEMBER_CAPABILITIES, "members:view"];
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
