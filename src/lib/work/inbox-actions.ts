"use server";

import { revalidatePath } from "next/cache";
import { resolveSnoozeUntil } from "./notification-domain";
import { NotificationRepository } from "./notification-repository";
import { requireWorkSession } from "./session";

export type InboxActionState = { error?: string };

/**
 * All Inbox mutations are scoped to the caller: requireWorkSession identifies the recipient,
 * and NotificationRepository.setState only touches rows owned by that recipient, so one user
 * can never mutate another's Inbox.
 */
export async function markNotificationReadAction(formData: FormData): Promise<void> {
  const session = await requireWorkSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await new NotificationRepository().setState({ id, recipientId: session.userId, state: "read" });
  revalidatePath("/flow/inbox");
}

export async function markNotificationDoneAction(formData: FormData): Promise<void> {
  const session = await requireWorkSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await new NotificationRepository().setState({ id, recipientId: session.userId, state: "done" });
  revalidatePath("/flow/inbox");
}

export async function snoozeNotificationAction(formData: FormData): Promise<void> {
  const session = await requireWorkSession();
  const id = String(formData.get("id") ?? "");
  const preset = String(formData.get("preset") ?? "");
  if (!id) return;
  const snoozedUntil = resolveSnoozeUntil(preset, new Date());
  if (!snoozedUntil) return;
  await new NotificationRepository().setState({
    id,
    recipientId: session.userId,
    state: "snoozed",
    snoozedUntil,
  });
  revalidatePath("/flow/inbox");
}

export async function markAllReadAction(): Promise<InboxActionState> {
  const session = await requireWorkSession();
  await new NotificationRepository().markAllRead(session.userId);
  revalidatePath("/flow/inbox");
  return {};
}
