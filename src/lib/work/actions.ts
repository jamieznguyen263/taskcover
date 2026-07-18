"use server";

import { revalidatePath } from "next/cache";
import { createOpaqueToken } from "@/lib/admin/security";
import type { ExternalMembershipKind } from "./external-access";
import { requireWorkSession } from "./session";
import { WorkRepository } from "./repository";

export type TeamActionState = { error?: string };
export type ExternalInviteState = { error?: string; inviteUrl?: string };

const TEAM_NAME_MAX = 80;
const TEAM_DESCRIPTION_MAX = 280;

export async function createTeamAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const session = await requireWorkSession("teams:manage");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "Team name is required." };
  if (name.length > TEAM_NAME_MAX) return { error: `Team name must be at most ${TEAM_NAME_MAX} characters.` };
  if (description.length > TEAM_DESCRIPTION_MAX) {
    return { error: `Description must be at most ${TEAM_DESCRIPTION_MAX} characters.` };
  }

  try {
    await new WorkRepository().createTeam({ name, description, createdBy: session.userId });
  } catch {
    return { error: "Could not create the team. A team with this name may already exist." };
  }
  revalidatePath("/flow/admin");
  return {};
}

export async function addTeamMemberAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("teams:manage");

  const teamId = String(formData.get("teamId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!teamId || !userId) return { error: "Choose a member to add." };

  try {
    await new WorkRepository().addTeamMember({ teamId, userId });
  } catch {
    return { error: "Could not add the member to the team." };
  }
  revalidatePath("/flow/admin");
  return {};
}

export async function removeTeamMemberAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("teams:manage");

  const teamId = String(formData.get("teamId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!teamId || !userId) return { error: "Missing team or member." };

  try {
    await new WorkRepository().removeTeamMember({ teamId, userId });
  } catch {
    return { error: "Could not remove the member from the team." };
  }
  revalidatePath("/flow/admin");
  return {};
}

// --- FLOW-003: external collaborators ---------------------------------------------------

const EXTERNAL_KINDS: readonly ExternalMembershipKind[] = [
  "freelancer",
  "partner_manager",
  "partner_member",
  "read_only_guest",
];

export async function createExternalInviteAction(
  _state: ExternalInviteState,
  formData: FormData
): Promise<ExternalInviteState> {
  const session = await requireWorkSession("administration:view");

  const email = String(formData.get("email") ?? "").trim();
  const kindRaw = String(formData.get("kind") ?? "");
  const organizationName = String(formData.get("organizationName") ?? "").trim() || null;
  const accessExpiryRaw = String(formData.get("accessExpiryAt") ?? "").trim();
  const canDownload = formData.get("canDownload") === "on";
  const canUpload = formData.get("canUpload") === "on";

  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "A valid email address is required." };
  const kind = EXTERNAL_KINDS.find((candidate) => candidate === kindRaw);
  if (!kind) return { error: "Choose a collaborator type." };

  let accessExpiryAt: Date | null = null;
  if (accessExpiryRaw) {
    const parsed = new Date(`${accessExpiryRaw}T23:59:59`);
    if (Number.isNaN(parsed.getTime())) return { error: "Access expiry must be a valid date." };
    if (parsed <= new Date()) return { error: "Access expiry must be in the future." };
    accessExpiryAt = parsed;
  }

  const token = createOpaqueToken();
  try {
    await new WorkRepository().createExternalInvite({
      email,
      kind,
      organizationName,
      organizationKind: kind === "freelancer" ? "freelancer" : "partner",
      accessExpiryAt,
      canDownload,
      canUpload,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      invitedBy: session.userId,
    });
  } catch {
    return { error: "The invitation could not be created." };
  }
  revalidatePath("/flow/admin");
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return { inviteUrl: `${appUrl}/admin/accept-invite?token=${encodeURIComponent(token)}` };
}

export async function revokeExternalMembershipAction(
  _state: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  const session = await requireWorkSession("administration:view");

  const membershipId = String(formData.get("membershipId") ?? "");
  if (!membershipId) return { error: "Missing membership." };

  try {
    await new WorkRepository().revokeExternalMembership({ membershipId, revokedBy: session.userId });
  } catch {
    return { error: "Could not revoke this collaborator's access." };
  }
  revalidatePath("/flow/admin");
  return {};
}
