export const leadSubmissionModes = ["disabled", "test", "staging-durable", "production-durable"] as const;

export type LeadSubmissionMode = (typeof leadSubmissionModes)[number];
type LeadSubmissionModeEnv = {
  LEAD_SUBMISSION_MODE?: string;
};
type LeadOriginEnv = {
  APP_URL?: string;
  NEXT_PUBLIC_APP_URL?: string;
};

export function isLeadSubmissionMode(value: string | undefined): value is LeadSubmissionMode {
  return Boolean(value && (leadSubmissionModes as readonly string[]).includes(value));
}

export function getLeadSubmissionMode(env: LeadSubmissionModeEnv = process.env as LeadSubmissionModeEnv): LeadSubmissionMode {
  const value = env.LEAD_SUBMISSION_MODE;
  return isLeadSubmissionMode(value) ? value : "disabled";
}

export function isCanonicalProductionLeadOrigin(env: LeadOriginEnv = process.env as LeadOriginEnv) {
  return [env.APP_URL, env.NEXT_PUBLIC_APP_URL].every((value) => {
    if (!value) return false;
    try {
      return new URL(value).hostname.toLowerCase() === "taskcover.com";
    } catch {
      return false;
    }
  });
}

export function isProductionLeadOrigin(env: LeadOriginEnv = process.env as LeadOriginEnv) {
  return [env.APP_URL, env.NEXT_PUBLIC_APP_URL].some((value) => {
    if (!value) return false;
    try {
      const hostname = new URL(value).hostname.toLowerCase();
      return hostname === "taskcover.com" || hostname === "www.taskcover.com";
    } catch {
      return false;
    }
  });
}
