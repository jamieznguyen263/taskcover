import "server-only";

/**
 * Taskcover Flow reuses the existing Admin session system rather than creating a second
 * identity/login. This module is the seam FLOW-002 will extend with organization-level
 * membership without every caller needing to change its import. See
 * planning/FLOW_DECISIONS.md.
 */
export { getAdminSession as getWorkSession, requireAdminSession as requireWorkSession } from "@/lib/admin/session";
export type { AdminUserSession as WorkSession } from "@/lib/admin/repository";
