import { getCloudflareContext } from "@opennextjs/cloudflare";

type RuntimeEnv = {
  HYPERDRIVE?: { connectionString?: string };
  LEAD_RATE_LIMITER?: unknown;
  ADMIN_RATE_LIMITER?: unknown;
  RATE_LIMIT_COORDINATOR?: unknown;
};

export type AdminIntegrationStatus = {
  databaseConfigured: boolean;
  hyperdriveConfigured: boolean;
  resendConfigured: boolean;
  hubspotConfigured: boolean;
  calcomConfigured: boolean;
  turnstileConfigured: boolean;
  cloudinaryConfigured: boolean;
  rateLimitingConfigured: boolean;
  durableObjectConfigured: boolean;
  schedulerConfigured: boolean;
  provider: "local" | "database";
  schedulerProvider: "disabled" | "vercel-cron" | "cloudflare-cron" | "github-actions" | "external";
  appUrl: string;
};

export function getAdminIntegrationStatus(): AdminIntegrationStatus {
  const schedulerProvider = String(process.env.PUBLISH_SCHEDULER_PROVIDER ?? "disabled") as AdminIntegrationStatus["schedulerProvider"];
  const insightsProvider = String(process.env.INSIGHTS_PROVIDER ?? "local");
  const rateLimitProvider = String(process.env.RATE_LIMIT_PROVIDER ?? "memory");
  const authRateLimitProvider = String(process.env.AUTH_RATE_LIMIT_PROVIDER ?? "memory");
  const runtimeEnv = getRuntimeEnv();

  return {
    databaseConfigured: Boolean(process.env.DATABASE_URL || runtimeEnv?.HYPERDRIVE?.connectionString),
    hyperdriveConfigured: Boolean(runtimeEnv?.HYPERDRIVE?.connectionString),
    resendConfigured: Boolean(
      process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL &&
        process.env.RESEND_REPLY_TO_EMAIL &&
        process.env.LEAD_NOTIFICATION_EMAIL
    ),
    hubspotConfigured: Boolean(
      process.env.HUBSPOT_PRIVATE_APP_TOKEN &&
        process.env.HUBSPOT_PIPELINE_ID &&
        process.env.HUBSPOT_NEW_LEAD_STAGE_ID
    ),
    calcomConfigured: Boolean(process.env.CALCOM_BOOKING_URL),
    turnstileConfigured: Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY),
    cloudinaryConfigured: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
    rateLimitingConfigured:
      (Boolean(runtimeEnv?.LEAD_RATE_LIMITER) || ["durable-object", "memory"].includes(rateLimitProvider)) &&
      (Boolean(runtimeEnv?.ADMIN_RATE_LIMITER) || ["durable-object", "memory"].includes(authRateLimitProvider)),
    durableObjectConfigured: Boolean(runtimeEnv?.RATE_LIMIT_COORDINATOR),
    schedulerConfigured: Boolean(process.env.PUBLISH_CRON_SECRET && schedulerProvider !== "disabled"),
    provider: insightsProvider === "database" ? "database" : "local",
    schedulerProvider,
    appUrl: process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}

export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return url;
}

function getRuntimeEnv(): RuntimeEnv | undefined {
  try {
    return getCloudflareContext().env as RuntimeEnv;
  } catch {
    return undefined;
  }
}
