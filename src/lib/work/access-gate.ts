export type FlowAccessDecision =
  | { kind: "disabled" }
  | { kind: "database-unavailable" }
  | { kind: "requires-session" }
  | { kind: "membership-disabled" }
  | { kind: "allow" };

/**
 * Pure decision table for who may reach /flow, kept separate from layout.tsx so the
 * flag/db/session/membership ordering is unit-testable without a Next.js request context.
 * Order matters: the flag is checked first (cheapest, no I/O), then database availability
 * (fail safe, mirrors the existing /admin pattern), then session presence, then the
 * FLOW-002 organization-membership status (deny-by-default: a disabled membership blocks
 * Flow even while the CMS session remains valid).
 */
export function evaluateFlowAccess(input: {
  workAppEnabled: boolean;
  databaseConfigured: boolean;
  hasSession: boolean;
  membershipStatus?: "active" | "disabled";
}): FlowAccessDecision {
  if (!input.workAppEnabled) return { kind: "disabled" };
  if (!input.databaseConfigured) return { kind: "database-unavailable" };
  if (!input.hasSession) return { kind: "requires-session" };
  if (input.membershipStatus === "disabled") return { kind: "membership-disabled" };
  return { kind: "allow" };
}
