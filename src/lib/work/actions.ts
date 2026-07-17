"use server";

import { revalidatePath } from "next/cache";
import { requireWorkSession } from "./session";
import { WorkRepository } from "./repository";

export type TeamActionState = { error?: string };

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
