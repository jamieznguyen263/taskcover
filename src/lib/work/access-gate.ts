export type FlowAccessDecision =
  | { kind: "disabled" }
  | { kind: "database-unavailable" }
  | { kind: "requires-session" }
  | { kind: "allow" };

/**
 * Pure decision table for who may reach /flow, kept separate from layout.tsx so the
 * auth/feature-flag/db-availability ordering is unit-testable without a Next.js request
 * context. Order matters: the flag is checked first (cheapest, no I/O), then database
 * availability (fail safe, mirrors the existing /admin pattern), then session presence.
 */
export function evaluateFlowAccess(input: {
  workAppEnabled: boolean;
  databaseConfigured: boolean;
  hasSession: boolean;
}): FlowAccessDecision {
  if (!input.workAppEnabled) return { kind: "disabled" };
  if (!input.databaseConfigured) return { kind: "database-unavailable" };
  if (!input.hasSession) return { kind: "requires-session" };
  return { kind: "allow" };
}
