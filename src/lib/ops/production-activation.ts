import crypto from "node:crypto";

export type ActivationStatus =
  | "configured"
  | "partially configured"
  | "unavailable"
  | "invalid format"
  | "not required in current mode";

export type ActivationCheck = {
  category: string;
  status: ActivationStatus;
  detail: string;
  required: string[];
  missing: string[];
  nextAction: string;
};

export type WranglerAudit = {
  workerName: string;
  compatibilityDate: string;
  hyperdriveBindings: string[];
  hyperdrivePlaceholderIds: string[];
  rateLimitBindings: string[];
  durableObjectBindings: string[];
  cronSchedules: string[];
  stagingWorkerName?: string;
};

export type SmokeCheck = {
  name: string;
  url: string;
  expectedStatus?: number;
  allowRedirect?: boolean;
};

type EnvMap = Record<string, string | undefined>;

const secretKeyPattern = /(secret|token|password|key|database_url|connection|string|authorization|cookie)/i;

export function redactValue(name: string, value: string | undefined) {
  if (!value) return "";
  if (secretKeyPattern.test(name)) return "[configured]";
  if (value.length > 120) return `${value.slice(0, 40)}...`;
  return value;
}

export function valuePresent(value: string | undefined) {
  return Boolean(value && value.trim().length > 0 && !/^<.+>$/.test(value.trim()));
}

export function validateHttpUrl(value: string | undefined, options: { httpsOnly?: boolean; expectedHosts?: string[] } = {}) {
  if (!valuePresent(value)) return "missing" as const;
  try {
    const url = new URL(value as string);
    if (options.httpsOnly && url.protocol !== "https:") return "invalid" as const;
    if (options.expectedHosts?.length && !options.expectedHosts.includes(url.hostname)) return "invalid" as const;
    return "valid" as const;
  } catch {
    return "invalid" as const;
  }
}

export function validateEmailAddress(value: string | undefined) {
  if (!valuePresent(value)) return "missing" as const;
  const address = (value as string).match(/<([^>]+)>/)?.[1] ?? (value as string);
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address) ? ("valid" as const) : ("invalid" as const);
}

export function summarizeUrl(value: string | undefined) {
  if (!valuePresent(value)) return { host: "", database: "" };
  try {
    const url = new URL(value as string);
    const database = url.pathname.replace(/^\//, "");
    return { host: url.hostname, database };
  } catch {
    return { host: "invalid-url", database: "" };
  }
}

export function migrationGuard(env: EnvMap) {
  const target = env.DATABASE_TARGET;
  if (!["development", "staging", "production"].includes(String(target))) {
    return {
      ok: false,
      message: "Set DATABASE_TARGET to development, staging, or production before running migrations.",
    };
  }
  if (target === "production" && env.CONFIRM_PRODUCTION_MIGRATION !== "YES") {
    return {
      ok: false,
      message: "Production migration requires CONFIRM_PRODUCTION_MIGRATION=YES.",
    };
  }
  return { ok: true, message: `Migration target confirmed: ${target}.` };
}

export function buildWranglerAudit(config: Record<string, unknown>): WranglerAudit {
  const hyperdrive = Array.isArray(config.hyperdrive) ? config.hyperdrive : [];
  const ratelimits = Array.isArray(config.ratelimits) ? config.ratelimits : [];
  const durableObjects = config.durable_objects && typeof config.durable_objects === "object" ? config.durable_objects : {};
  const doBindings = Array.isArray((durableObjects as { bindings?: unknown }).bindings)
    ? ((durableObjects as { bindings: Array<Record<string, unknown>> }).bindings)
    : [];
  const triggers = config.triggers && typeof config.triggers === "object" ? config.triggers : {};
  const envConfig = config.env && typeof config.env === "object" ? config.env : {};
  const staging = (envConfig as { staging?: { name?: string } }).staging;

  return {
    workerName: String(config.name ?? ""),
    compatibilityDate: String(config.compatibility_date ?? ""),
    hyperdriveBindings: hyperdrive.map((item) => String((item as { binding?: unknown }).binding ?? "")).filter(Boolean),
    hyperdrivePlaceholderIds: hyperdrive
      .filter((item) => /^0+$/.test(String((item as { id?: unknown }).id ?? "")))
      .map((item) => String((item as { binding?: unknown }).binding ?? "")),
    rateLimitBindings: ratelimits.map((item) => String((item as { name?: unknown }).name ?? "")).filter(Boolean),
    durableObjectBindings: doBindings.map((item) => String(item.name ?? "")).filter(Boolean),
    cronSchedules: Array.isArray((triggers as { crons?: unknown }).crons)
      ? ((triggers as { crons: string[] }).crons)
      : [],
    stagingWorkerName: staging?.name,
  };
}

export function localHyperdriveVariableFor(binding: string) {
  return `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_${binding}`;
}

export function buildProductionChecks(env: EnvMap, audit: WranglerAudit): ActivationCheck[] {
  const hyperdriveBinding = audit.hyperdriveBindings[0] ?? "HYPERDRIVE";
  const hyperdriveLocalVar = localHyperdriveVariableFor(hyperdriveBinding);
  const insightsProvider = String(env.INSIGHTS_PROVIDER ?? "local");
  const appUrl = validateHttpUrl(env.APP_URL);
  const publicUrl = validateHttpUrl(env.NEXT_PUBLIC_APP_URL);
  const calcom = validateHttpUrl(env.CALCOM_BOOKING_URL, { httpsOnly: true, expectedHosts: ["cal.com", "www.cal.com", "app.cal.com"] });

  return [
    checkRequired("Application", ["APP_URL", "NEXT_PUBLIC_APP_URL", "LEAD_SUBMISSION_MODE"], env, {
      invalid: appUrl === "invalid" || publicUrl === "invalid",
      nextAction: "Set APP_URL and NEXT_PUBLIC_APP_URL to the active environment origin.",
    }),
    checkRequired("Database", ["DATABASE_URL"], env, {
      nextAction: "Set DATABASE_URL only for local scripts or use the Hyperdrive binding at runtime.",
    }),
    {
      category: "Hyperdrive",
      status: audit.hyperdriveBindings.length && valuePresent(env[hyperdriveLocalVar]) ? "configured" : audit.hyperdriveBindings.length ? "partially configured" : "unavailable",
      detail: audit.hyperdriveBindings.length
        ? `Wrangler binding ${hyperdriveBinding}; local preview variable ${hyperdriveLocalVar}.`
        : "No Hyperdrive binding found in wrangler.jsonc.",
      required: [hyperdriveLocalVar, "wrangler.hyperdrive.id"],
      missing: [
        ...(valuePresent(env[hyperdriveLocalVar]) ? [] : [hyperdriveLocalVar]),
        ...(audit.hyperdrivePlaceholderIds.length ? ["real Hyperdrive binding id"] : []),
      ],
      nextAction: "Create Hyperdrive in Cloudflare and set the local preview connection string in .dev.vars.",
    },
    checkRequired("Authentication", ["AUTH_SESSION_SECRET", "PREVIEW_TOKEN_SECRET"], env, {
      nextAction: "Generate long random secrets and store them through local env files or Cloudflare secrets.",
    }),
    checkRequired("Resend", ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_REPLY_TO_EMAIL", "LEAD_NOTIFICATION_EMAIL"], env, {
      invalid:
        validateEmailAddress(env.RESEND_FROM_EMAIL) === "invalid" ||
        validateEmailAddress(env.RESEND_REPLY_TO_EMAIL) === "invalid" ||
        validateEmailAddress(env.LEAD_NOTIFICATION_EMAIL) === "invalid",
      nextAction: "Verify taskcover.com in Resend and configure sender, reply-to, and notification recipient.",
    }),
    checkRequired("HubSpot", ["HUBSPOT_PRIVATE_APP_TOKEN", "HUBSPOT_PIPELINE_ID", "HUBSPOT_NEW_LEAD_STAGE_ID"], env, {
      nextAction: "Create a HubSpot Private App token and record the target pipeline and new-lead stage IDs.",
    }),
    checkRequired("Cal.com", ["CALCOM_BOOKING_URL"], env, {
      invalid: calcom === "invalid",
      nextAction: "Set an HTTPS Cal.com booking URL without visitor PII query parameters.",
    }),
    checkRequired("Turnstile", ["TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "TURNSTILE_EXPECTED_HOSTNAME", "TURNSTILE_EXPECTED_ACTION"], env, {
      nextAction: "Use Cloudflare test keys locally and real keys for staging/production hostnames.",
    }),
    checkRequired("Cloudinary", ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "CLOUDINARY_UPLOAD_FOLDER"], env, {
      nextAction: "Configure signed upload credentials and use a staging folder outside production.",
    }),
    {
      category: "Rate Limiting",
      status: audit.rateLimitBindings.includes("LEAD_RATE_LIMITER") && audit.rateLimitBindings.includes("ADMIN_RATE_LIMITER") ? "configured" : "partially configured",
      detail: `Provider=${env.RATE_LIMIT_PROVIDER ?? "memory"}; bindings=${audit.rateLimitBindings.join(", ") || "none"}.`,
      required: ["LEAD_RATE_LIMITER", "ADMIN_RATE_LIMITER", "RATE_LIMIT_PROVIDER"],
      missing: ["LEAD_RATE_LIMITER", "ADMIN_RATE_LIMITER"].filter((name) => !audit.rateLimitBindings.includes(name)),
      nextAction: "Create Cloudflare Rate Limiting bindings before production deploy.",
    },
    {
      category: "Durable Objects",
      status: audit.durableObjectBindings.includes("RATE_LIMIT_COORDINATOR") ? "configured" : "unavailable",
      detail: `Bindings=${audit.durableObjectBindings.join(", ") || "none"}.`,
      required: ["RATE_LIMIT_COORDINATOR"],
      missing: audit.durableObjectBindings.includes("RATE_LIMIT_COORDINATOR") ? [] : ["RATE_LIMIT_COORDINATOR"],
      nextAction: "Keep the Durable Object migration in wrangler.jsonc and deploy only after review.",
    },
    {
      category: "Scheduler",
      status: audit.cronSchedules.length && valuePresent(env.PUBLISH_CRON_SECRET) ? "configured" : audit.cronSchedules.length ? "partially configured" : "unavailable",
      detail: `Cron=${audit.cronSchedules.join(", ") || "none"}; provider=${env.PUBLISH_SCHEDULER_PROVIDER ?? "disabled"}.`,
      required: ["wrangler.triggers.crons", "PUBLISH_CRON_SECRET"],
      missing: [...(audit.cronSchedules.length ? [] : ["wrangler.triggers.crons"]), ...(valuePresent(env.PUBLISH_CRON_SECRET) ? [] : ["PUBLISH_CRON_SECRET"])],
      nextAction: "Configure Cron only after staging validation; keep the secure HTTP publishing endpoint secret.",
    },
    {
      category: "Insights provider",
      status: insightsProvider === "database" && !valuePresent(env.DATABASE_URL) ? "partially configured" : "configured",
      detail: `INSIGHTS_PROVIDER=${insightsProvider}. Production should remain local until DB import verification passes.`,
      required: ["INSIGHTS_PROVIDER"],
      missing: insightsProvider === "database" && !valuePresent(env.DATABASE_URL) ? ["DATABASE_URL or Hyperdrive runtime binding"] : [],
      nextAction: "Switch only staging/preview to database first, compare routes, then separately approve production.",
    },
  ];
}

function checkRequired(
  category: string,
  required: string[],
  env: EnvMap,
  options: { invalid?: boolean; nextAction: string }
): ActivationCheck {
  const missing = required.filter((name) => !valuePresent(env[name]));
  const status: ActivationStatus = options.invalid
    ? "invalid format"
    : missing.length === 0
      ? "configured"
      : missing.length === required.length
        ? "unavailable"
        : "partially configured";
  return {
    category,
    status,
    detail: required.map((name) => `${name}=${valuePresent(env[name]) ? redactValue(name, env[name]) : "missing"}`).join("; "),
    required,
    missing,
    nextAction: options.nextAction,
  };
}

export function deploymentSmokePlan(baseUrl: string) {
  const base = normalizeBaseUrl(baseUrl);
  const checks: SmokeCheck[] = [
    { name: "homepage", url: `${base}/`, expectedStatus: 200 },
    { name: "french localized route", url: `${base}/fr`, expectedStatus: 200 },
    { name: "spanish localized route", url: `${base}/es`, expectedStatus: 200 },
    { name: "insights hub", url: `${base}/insights`, expectedStatus: 200 },
    { name: "free seo audit", url: `${base}/free-seo-audit`, expectedStatus: 200 },
    { name: "contact", url: `${base}/contact`, expectedStatus: 200 },
    { name: "book a call", url: `${base}/book-a-call`, expectedStatus: 200 },
    { name: "admin login", url: `${base}/admin/login`, expectedStatus: 200 },
    { name: "robots", url: `${base}/robots.txt`, expectedStatus: 200 },
    { name: "sitemap", url: `${base}/sitemap.xml`, expectedStatus: 200 },
  ];
  if (new URL(base).hostname === "taskcover.com") {
    checks.push({ name: "www redirect", url: "https://www.taskcover.com/", allowRedirect: true });
  }
  return checks;
}

export function normalizeBaseUrl(value: string) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function noPiiLogLine(value: string) {
  return !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value) && !/\b(?:\d[ -]*?){13,16}\b/.test(value);
}

export function hashForLog(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
