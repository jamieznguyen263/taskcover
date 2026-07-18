export type ClientHealthState = "good" | "watch" | "at_risk" | "unknown";

export const CLIENT_HEALTH_LABEL: Record<ClientHealthState, string> = {
  good: "Good",
  watch: "Watch",
  at_risk: "At risk",
  unknown: "Not assessed",
};

export const CLIENT_HEALTH_STATES: readonly ClientHealthState[] = ["good", "watch", "at_risk", "unknown"];

/**
 * "Explainable client health" (blueprint FLOW-004): health is a human-set state plus a
 * human-written reason, never an opaque score. Concerning states (watch/at_risk) require a
 * reason; "unknown" always clears it.
 */
export function validateClientHealthUpdate(input: {
  state: string;
  reason: string;
}): { ok: true; state: ClientHealthState; reason: string } | { ok: false; error: string } {
  const state = CLIENT_HEALTH_STATES.find((candidate) => candidate === input.state);
  if (!state) return { ok: false, error: "Choose a valid health state." };

  const reason = input.reason.trim();
  if (reason.length > 500) return { ok: false, error: "Health reason must be at most 500 characters." };
  if ((state === "watch" || state === "at_risk") && !reason) {
    return { ok: false, error: "Explain why the client is on watch or at risk — health must be explainable." };
  }
  return { ok: true, state, reason: state === "unknown" ? "" : reason };
}
