export type WorkStatus = "to_do" | "in_progress" | "waiting" | "review" | "done";
export type WorkType = "task" | "deliverable" | "request" | "approval" | "milestone";
export type WaitingTarget = "client" | "manager" | "teammate" | "freelancer" | "partner" | "external_party";

export const WORK_STATUSES: readonly WorkStatus[] = ["to_do", "in_progress", "waiting", "review", "done"];
export const WORK_TYPES: readonly WorkType[] = ["task", "deliverable", "request", "approval", "milestone"];
export const WAITING_TARGETS: readonly WaitingTarget[] = [
  "client",
  "manager",
  "teammate",
  "freelancer",
  "partner",
  "external_party",
];

export const WORK_STATUS_LABEL: Record<WorkStatus, string> = {
  to_do: "To do",
  in_progress: "In progress",
  waiting: "Waiting",
  review: "Review",
  done: "Done",
};

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  task: "Task",
  deliverable: "Deliverable",
  request: "Request",
  approval: "Approval",
  milestone: "Milestone",
};

export const WAITING_TARGET_LABEL: Record<WaitingTarget, string> = {
  client: "Client",
  manager: "Manager",
  teammate: "Teammate",
  freelancer: "Freelancer",
  partner: "Partner",
  external_party: "External party",
};

export function isWorkStatus(value: string): value is WorkStatus {
  return (WORK_STATUSES as readonly string[]).includes(value);
}

export function isWorkType(value: string): value is WorkType {
  return (WORK_TYPES as readonly string[]).includes(value);
}

export function isWaitingTarget(value: string): value is WaitingTarget {
  return (WAITING_TARGETS as readonly string[]).includes(value);
}

/**
 * The five statuses are a free flow (any → any) by design — the product deliberately avoids
 * a rigid state machine so non-technical staff aren't blocked. The only invariant is data
 * integrity around `waiting`: entering Waiting requires a target ("waiting for whom?"), and
 * leaving Waiting clears it. Everything else is a valid move.
 */
export type WorkStatusChange =
  | { ok: true; status: WorkStatus; waitingTarget: WaitingTarget | null }
  | { ok: false; error: string };

export function resolveStatusChange(input: {
  nextStatus: string;
  waitingTarget: string | null;
}): WorkStatusChange {
  if (!isWorkStatus(input.nextStatus)) return { ok: false, error: "Choose a valid status." };

  if (input.nextStatus === "waiting") {
    if (!input.waitingTarget || !isWaitingTarget(input.waitingTarget)) {
      return { ok: false, error: "Waiting needs a target — who or what are you waiting on?" };
    }
    return { ok: true, status: "waiting", waitingTarget: input.waitingTarget };
  }
  // Any non-waiting status clears the waiting target.
  return { ok: true, status: input.nextStatus, waitingTarget: null };
}
