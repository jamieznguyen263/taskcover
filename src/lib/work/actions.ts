"use server";

import { revalidatePath } from "next/cache";
import { createOpaqueToken } from "@/lib/admin/security";
import { reportActionFailure } from "./action-error";
import { hasCapability } from "./capabilities";
import { validateClientHealthUpdate } from "./client-health";
import { ClientsRepository } from "./clients-repository";
import type { ExternalMembershipKind } from "./external-access";
import { ProjectsRepository } from "./projects-repository";
import { requireWorkSession } from "./session";
import { WorkRepository } from "./repository";

export type TeamActionState = { error?: string };
export type ExternalInviteState = { error?: string; inviteUrl?: string };

export type QuickCreateOptions = {
  projects: { id: string; name: string }[];
  clients: { id: string; name: string }[];
  members: { userId: string; displayName: string }[];
  canManageProjects: boolean;
  canManageDocs: boolean;
};

/**
 * Options for the global Quick create panel, fetched on open rather than rendered into every
 * page's shell — the panel is used occasionally, so paying three queries on every Flow page
 * load would be the wrong trade. Capability flags travel with the data so the panel can hide
 * modes the viewer may not use; the actions themselves still re-check server-side.
 */
export async function loadQuickCreateOptionsAction(): Promise<QuickCreateOptions> {
  const session = await requireWorkSession("work:manage");
  const [projects, clients, members] = await Promise.all([
    new ProjectsRepository().listProjects(),
    new ClientsRepository().listClients(),
    new WorkRepository().listMembers(),
  ]);

  return {
    projects: projects.map((project) => ({ id: project.id, name: project.name })),
    clients: clients.map((client) => ({ id: client.id, name: client.name })),
    members: members
      .filter((member) => member.status === "active")
      .map((member) => ({ userId: member.userId, displayName: member.displayName })),
    canManageProjects: hasCapability(session.accessLevel, "projects:manage"),
    canManageDocs: hasCapability(session.accessLevel, "docs:manage"),
  };
}

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
  } catch (error) {
    reportActionFailure("createTeamAction", error);
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
  } catch (error) {
    reportActionFailure("addTeamMemberAction", error);
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
  } catch (error) {
    reportActionFailure("removeTeamMemberAction", error);
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
  } catch (error) {
    reportActionFailure("createExternalInviteAction", error);
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
  } catch (error) {
    reportActionFailure("revokeExternalMembershipAction", error);
    return { error: "Could not revoke this collaborator's access." };
  }
  revalidatePath("/flow/admin");
  return {};
}

// --- FLOW-004: clients ------------------------------------------------------------------

export async function createClientAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const session = await requireWorkSession("clients:manage");

  const name = String(formData.get("name") ?? "").trim();
  const accountManagerId = String(formData.get("accountManagerId") ?? "").trim() || null;
  if (!name) return { error: "Client name is required." };
  if (name.length > 120) return { error: "Client name must be at most 120 characters." };

  try {
    await new ClientsRepository().createClient({ name, accountManagerId, createdBy: session.userId });
  } catch (error) {
    reportActionFailure("createClientAction", error, { actorId: session.userId });
    return { error: "Could not create the client. A client with this name may already exist." };
  }
  revalidatePath("/flow/clients");
  return {};
}

export async function updateClientHealthAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("clients:manage");

  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) return { error: "Missing client." };
  const validated = validateClientHealthUpdate({
    state: String(formData.get("state") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  });
  if (!validated.ok) return { error: validated.error };

  try {
    await new ClientsRepository().updateClientHealth({ clientId, state: validated.state, reason: validated.reason });
  } catch (error) {
    reportActionFailure("updateClientHealthAction", error);
    return { error: "Could not update client health." };
  }
  revalidatePath(`/flow/clients/${clientId}`);
  revalidatePath("/flow/clients");
  return {};
}

export async function addClientContactAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("clients:manage");

  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  if (!clientId) return { error: "Missing client." };
  if (!name) return { error: "Contact name is required." };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: "Contact email must be valid (or left empty)." };

  try {
    await new ClientsRepository().addContact({ clientId, name, email, phone, roleTitle });
  } catch (error) {
    reportActionFailure("addClientContactAction", error);
    return { error: "Could not add the contact." };
  }
  revalidatePath(`/flow/clients/${clientId}`);
  return {};
}

export async function removeClientContactAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("clients:manage");

  const clientId = String(formData.get("clientId") ?? "");
  const contactId = String(formData.get("contactId") ?? "");
  if (!clientId || !contactId) return { error: "Missing contact." };

  try {
    await new ClientsRepository().removeContact({ clientId, contactId });
  } catch (error) {
    reportActionFailure("removeClientContactAction", error);
    return { error: "Could not remove the contact." };
  }
  revalidatePath(`/flow/clients/${clientId}`);
  return {};
}

// --- FLOW-005: projects -----------------------------------------------------------------

export async function createProjectAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const session = await requireWorkSession("projects:manage");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const kind = String(formData.get("kind") ?? "") === "internal" ? "internal" : "client";
  const clientId = String(formData.get("clientId") ?? "").trim() || null;
  if (!name) return { error: "Project name is required." };
  if (name.length > 160) return { error: "Project name must be at most 160 characters." };
  if (kind === "client" && !clientId) return { error: "Choose the client this project belongs to." };

  try {
    await new ProjectsRepository().createProject({ name, description, kind, clientId, createdBy: session.userId });
  } catch (error) {
    reportActionFailure("createProjectAction", error, { kind, clientId, actorId: session.userId });
    return { error: "Could not create the project." };
  }
  revalidatePath("/flow/projects");
  if (clientId) revalidatePath(`/flow/clients/${clientId}`);
  return {};
}

export async function addProjectMemberAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("projects:manage");

  const projectId = String(formData.get("projectId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!projectId || !userId) return { error: "Choose a member to add." };

  try {
    await new ProjectsRepository().addProjectMember({ projectId, userId });
  } catch (error) {
    reportActionFailure("addProjectMemberAction", error);
    return { error: "Could not add the member to the project." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}

export async function removeProjectMemberAction(_state: TeamActionState, formData: FormData): Promise<TeamActionState> {
  await requireWorkSession("projects:manage");

  const projectId = String(formData.get("projectId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!projectId || !userId) return { error: "Missing project or member." };

  try {
    await new ProjectsRepository().removeProjectMember({ projectId, userId });
  } catch (error) {
    reportActionFailure("removeProjectMemberAction", error);
    return { error: "Could not remove the member from the project." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}
