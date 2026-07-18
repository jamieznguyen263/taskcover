export type NotificationState = "unread" | "read" | "snoozed" | "done";

export type NotificationKind =
  | "assignment"
  | "mention"
  | "feedback"
  | "review_request"
  | "approval_request"
  | "deadline_warning"
  | "waiting_reminder"
  | "external_update"
  | "system_warning";

export const NOTIFICATION_KIND_LABEL: Record<NotificationKind, string> = {
  assignment: "Assigned to you",
  mention: "Mention",
  feedback: "Feedback",
  review_request: "Review request",
  approval_request: "Approval request",
  deadline_warning: "Deadline warning",
  waiting_reminder: "Waiting reminder",
  external_update: "Collaborator update",
  system_warning: "System warning",
};

/**
 * Inbox grouping: actionable requests (a teammate needs something from you) sort above
 * informational items. Deterministic, so the Inbox order is stable and unit-testable.
 */
export const NOTIFICATION_GROUP: Record<NotificationKind, "action_required" | "informational"> = {
  review_request: "action_required",
  approval_request: "action_required",
  assignment: "action_required",
  deadline_warning: "action_required",
  waiting_reminder: "action_required",
  feedback: "informational",
  mention: "informational",
  external_update: "informational",
  system_warning: "informational",
};

/**
 * A snoozed notification is effectively unread once its snooze time passes. Centralised so
 * the Inbox badge, the list filter, and any reminder logic agree on what "active" means.
 */
export function isActiveInInbox(input: {
  state: NotificationState;
  snoozedUntil: Date | null;
  now: Date;
}): boolean {
  if (input.state === "done") return false;
  if (input.state === "snoozed") {
    return input.snoozedUntil !== null && input.now >= input.snoozedUntil;
  }
  return true; // unread or read
}

export function countsAsUnread(input: {
  state: NotificationState;
  snoozedUntil: Date | null;
  now: Date;
}): boolean {
  if (input.state === "unread") return true;
  // A snooze that has elapsed re-surfaces as unread.
  if (input.state === "snoozed") return input.snoozedUntil !== null && input.now >= input.snoozedUntil;
  return false;
}

export const SNOOZE_PRESETS: readonly { id: string; label: string; hours: number }[] = [
  { id: "3h", label: "3 hours", hours: 3 },
  { id: "tomorrow", label: "Tomorrow", hours: 24 },
  { id: "week", label: "Next week", hours: 24 * 7 },
];

export function resolveSnoozeUntil(presetId: string, now: Date): Date | null {
  const preset = SNOOZE_PRESETS.find((candidate) => candidate.id === presetId);
  if (!preset) return null;
  return new Date(now.getTime() + preset.hours * 60 * 60 * 1000);
}
