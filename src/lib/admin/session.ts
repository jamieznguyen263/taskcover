import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminRepository } from "./repository";
import {
  ADMIN_SESSION_COOKIE,
  createOpaqueToken,
  hashSecurityIdentifier,
  summarizeUserAgent,
} from "./security";
import { adminSessionCookieOptions } from "./session-cookie";

export async function createAdminSession(userId: string) {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12);
  const headerStore = await headers();
  const repo = new AdminRepository();
  await repo.createSession({
    userId,
    token,
    expiresAt,
    userAgentSummary: summarizeUserAgent(headerStore.get("user-agent")),
    ipHash: hashSecurityIdentifier(headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip")),
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions(expiresAt));
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await new AdminRepository().resolveSession(token);
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function clearAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    const session = await new AdminRepository().resolveSession(token);
    if (session) await new AdminRepository().revokeSession(session.sessionId);
  }
  (await cookies()).delete({ name: ADMIN_SESSION_COOKIE, path: "/" });
}
