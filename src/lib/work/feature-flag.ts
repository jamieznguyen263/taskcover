/**
 * WORK_APP_ENABLED gates the entire /flow route (Taskcover Flow). It defaults to enabled:
 * /flow is fully gated behind the existing admin session and carries no business data in
 * FLOW-001, so there is no production risk in leaving it on. Set WORK_APP_ENABLED=false to
 * dark-launch the route (renders 404) without affecting /admin or the public site. See
 * planning/FLOW_DECISIONS.md for the full rationale.
 */
export function isWorkAppEnabled(rawValue: string | undefined = process.env.WORK_APP_ENABLED): boolean {
  return rawValue?.trim().toLowerCase() !== "false";
}
