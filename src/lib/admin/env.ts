export type AdminIntegrationStatus = {
  databaseConfigured: boolean;
  cloudinaryConfigured: boolean;
  schedulerConfigured: boolean;
  provider: "local" | "database";
  schedulerProvider: "disabled" | "vercel-cron" | "cloudflare-cron" | "github-actions" | "external";
  appUrl: string;
};

export function getAdminIntegrationStatus(): AdminIntegrationStatus {
  const schedulerProvider = (process.env.PUBLISH_SCHEDULER_PROVIDER ?? "disabled") as AdminIntegrationStatus["schedulerProvider"];

  return {
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    cloudinaryConfigured: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
    schedulerConfigured: Boolean(process.env.PUBLISH_CRON_SECRET && schedulerProvider !== "disabled"),
    provider: process.env.INSIGHTS_PROVIDER === "database" ? "database" : "local",
    schedulerProvider,
    appUrl: process.env.APP_URL ?? "http://localhost:3000",
  };
}

export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return url;
}
