import type { InsightStatus } from "@/content/insights.types";

export type AdminRole = "admin" | "editor";

export type Permission =
  | "article:create"
  | "article:edit"
  | "article:submit-review"
  | "article:request-changes"
  | "article:approve"
  | "article:schedule"
  | "article:publish"
  | "article:archive"
  | "article:restore"
  | "article:comment"
  | "article:assign"
  | "media:upload"
  | "media:delete"
  | "users:manage"
  | "audit:view"
  | "scheduler:run";

const editorPermissions = new Set<Permission>([
  "article:create",
  "article:edit",
  "article:submit-review",
  "article:comment",
  "media:upload",
]);

const adminPermissions = new Set<Permission>([
  ...editorPermissions,
  "article:assign",
  "article:request-changes",
  "article:approve",
  "article:schedule",
  "article:publish",
  "article:archive",
  "article:restore",
  "media:delete",
  "users:manage",
  "audit:view",
  "scheduler:run",
]);

export function hasPermission(role: AdminRole, permission: Permission) {
  return (role === "admin" ? adminPermissions : editorPermissions).has(permission);
}

export function assertPermission(role: AdminRole, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: missing ${permission}`);
  }
}

export function canTransition(role: AdminRole, from: InsightStatus, to: InsightStatus) {
  if (from === "draft" && to === "in-review") return hasPermission(role, "article:submit-review");
  if (from === "in-review" && to === "draft") return hasPermission(role, "article:request-changes");
  if (from === "in-review" && to === "approved") return hasPermission(role, "article:approve");
  if (from === "approved" && to === "draft") return hasPermission(role, "article:request-changes");
  if (from === "approved" && to === "scheduled") return hasPermission(role, "article:schedule");
  if (from === "approved" && to === "published") return hasPermission(role, "article:publish");
  if (from === "scheduled" && to === "approved") return hasPermission(role, "article:schedule");
  if (from === "scheduled" && to === "published") return hasPermission(role, "scheduler:run");
  if (from === "published" && to === "draft") return hasPermission(role, "article:edit");
  if (from === "published" && to === "archived") return hasPermission(role, "article:archive");
  if (from === "archived" && (to === "draft" || to === "published")) return hasPermission(role, "article:restore");
  return false;
}

export function assertCanTransition(role: AdminRole, from: InsightStatus, to: InsightStatus) {
  if (!canTransition(role, from, to)) {
    throw new Error(`Forbidden workflow transition: ${from} -> ${to}`);
  }
}
