"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminRepository } from "./repository";
import { createAdminSession, requireAdminSession, clearAdminSession } from "./session";
import {
  checkLoginRateLimit,
  createOpaqueToken,
  hashPassword,
  hashSecurityIdentifier,
  normalizeEmail,
  resetLoginRateLimit,
  summarizeUserAgent,
  verifyPassword,
} from "./security";
import { assertPermission } from "./permissions";
import { resolveSafeRedirect } from "./safe-redirect";
import { revalidatePath } from "next/cache";

export type LoginState = { error?: string };
export type InviteState = { error?: string; inviteUrl?: string };

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const headerStore = await headers();
  const ipHash = hashSecurityIdentifier(headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip"));
  const rateLimitKey = `${normalizeEmail(email)}:${ipHash ?? "unknown"}`;
  const repo = new AdminRepository();

  if (!(await checkLoginRateLimit(rateLimitKey))) {
    await repo.audit({
      event: "login_failure",
      summary: "Login rate limit exceeded.",
      metadata: { category: "rate_limited", email: normalizeEmail(email) },
      ipHash,
      userAgentSummary: summarizeUserAgent(headerStore.get("user-agent")),
    });
    return { error: "Invalid email or password." };
  }

  const user = await repo.findUserByEmail(email);
  const ok = user?.status === "active" && (await verifyPassword(user.passwordHash, password));
  if (!user || !ok) {
    await repo.audit({
      event: "login_failure",
      actorId: user?.id,
      summary: "Invalid admin login attempt.",
      metadata: { category: user?.status === "disabled" ? "disabled" : "invalid_credentials", email: normalizeEmail(email) },
      ipHash,
      userAgentSummary: summarizeUserAgent(headerStore.get("user-agent")),
    });
    return { error: "Invalid email or password." };
  }

  resetLoginRateLimit(rateLimitKey);
  await createAdminSession(user.id);
  await repo.audit({
    event: "login_success",
    actorId: user.id,
    summary: "Admin login succeeded.",
    ipHash,
    userAgentSummary: summarizeUserAgent(headerStore.get("user-agent")),
  });
  // Return the user where they were headed (e.g. /flow), defaulting to the CMS. The value is
  // untrusted form input, so it is validated to same-origin paths only.
  redirect(resolveSafeRedirect(String(formData.get("next") ?? "")));
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createInviteAction(_state: InviteState, formData: FormData): Promise<InviteState> {
  const session = await requireAdminSession();
  assertPermission(session.role, "users:manage");

  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "editor") === "admin" ? "admin" : "editor";
  const token = createOpaqueToken();
  const repo = new AdminRepository();
  try {
    if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "A valid email address is required." };
    await repo.createInvite({ email, role, token, invitedBy: session.userId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    await repo.audit({ event: "user_invite", actorId: session.userId, targetType: "admin_user", targetId: normalizeEmail(email), summary: `Invitation created for ${normalizeEmail(email)}.`, metadata: { role } });
    revalidatePath("/admin/users");
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return { inviteUrl: `${appUrl}/admin/accept-invite?token=${encodeURIComponent(token)}` };
  } catch {
    return { error: "Invitation could not be created." };
  }
}

export async function revokeInviteAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.role, "users:manage");
  await new AdminRepository().revokeInvite({ inviteId: String(formData.get("inviteId") ?? ""), actorId: session.userId });
  revalidatePath("/admin/users");
}

export async function updateUserAccessAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.role, "users:manage");
  const roleValue = String(formData.get("role") ?? "");
  const statusValue = String(formData.get("status") ?? "");
  await new AdminRepository().updateUserAccess({
    targetUserId: String(formData.get("userId") ?? ""),
    actorId: session.userId,
    role: roleValue === "admin" || roleValue === "editor" ? roleValue : undefined,
    status: statusValue === "active" || statusValue === "disabled" ? statusValue : undefined,
  });
  revalidatePath("/admin/users");
}

export async function acceptInviteAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const token = String(formData.get("token") ?? "");
  const displayName = String(formData.get("displayName") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    const repo = new AdminRepository();
    const user = await repo.acceptInvite({ token, displayName, passwordHash: await hashPassword(password) });
    await repo.audit({
      event: "invite_accept",
      actorId: user.id,
      targetType: "admin_user",
      targetId: user.id,
      summary: "Admin invitation accepted.",
    });
    await createAdminSession(user.id);
  } catch {
    return { error: "Invitation could not be accepted." };
  }
  redirect("/admin");
}
