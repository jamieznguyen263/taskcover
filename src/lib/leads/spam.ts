export type TurnstileResult = {
  configured: boolean;
  verified: boolean;
};

export function hasHoneypotSignal(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<TurnstileResult> {
  if (!isTurnstileConfigured()) return { configured: false, verified: true };
  if (!token) return { configured: true, verified: false };

  const form = new FormData();
  form.set("secret", process.env.TURNSTILE_SECRET_KEY as string);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    if (!response.ok) return { configured: true, verified: false };
    const data = (await response.json()) as { success?: boolean };
    return { configured: true, verified: data.success === true };
  } catch {
    return { configured: true, verified: false };
  }
}
