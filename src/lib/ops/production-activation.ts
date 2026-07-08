import crypto from "node:crypto";
import { isLeadSubmissionMode } from "@/lib/leads/mode";

export type ActivationStatus =
  | "configured"
  | "partially configured"
  | "missing"
  | "invalid format"
  | "not required in current mode"
  | "live test required"
  | "staging only"
  | "production only";

export type ActivationCheck = {
  category: string;
  status: ActivationStatus;
  context: {
    requiredWhen: string;
    environment: string;
    exposure: "secret" | "public" | "mixed" | "configuration";
  };
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
  rateLimitPlaceholderIds: string[];
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
const allowedActivationStatuses = new Set<ActivationStatus>([
  "configured",
  "missing",
  "partially configured",
  "invalid format",
  "not required in current mode",
  "live test required",
  "staging only",
  "production only",
]);

const activationContexts = {
  application: context("required now", "local, staging, production", "mixed"),
  cloudflare: context("required before staging deploy", "staging, production", "configuration"),
  neon: context("required before migrations/imports and staging lead acceptance", "local scripts, staging", "secret"),
  hyperdrive: context("required before Cloudflare preview/staging", "local preview, staging, production", "mixed"),
  auth: context("required before Admin or preview publishing", "local preview, staging, production", "secret"),
  admin: context("required before Admin QA", "local scripts, staging", "mixed"),
  insights: context("later unless database insights are enabled", "local, staging, production", "configuration"),
  resend: context("required before staging lead notification tests", "local preview, staging, production", "mixed"),
  hubspot: context("later; required before CRM sync", "staging, production", "mixed"),
  calcom: context("optional before booking CTA is shown", "local, staging, production", "public"),
  turnstile: context("required before staging public lead acceptance", "local preview, staging, production", "mixed"),
  cloudinary: context("required before Admin media uploads", "staging, production", "mixed"),
  rateLimit: context("required before public staging/production lead acceptance", "staging, production", "configuration"),
  durableObjects: context("required before durable rate-limit coordination", "staging, production", "configuration"),
  cron: context("required before scheduled publishing and outbox processing", "staging, production", "secret"),
  analytics: context("later; required before ads/analytics go live", "staging, production", "public"),
  consent: context("required now", "local, staging, production", "configuration"),
  leadOutbox: context("required before staging durable lead tests", "local preview, staging", "mixed"),
} as const;

function context(
  requiredWhen: string,
  environment: string,
  exposure: "secret" | "public" | "mixed" | "configuration"
) {
  return { requiredWhen, environment, exposure };
}

const setupLocations: Record<string, string> = {
  APP_URL: "set in .env.local/.dev.vars for local checks or wrangler vars for Workers",
  NEXT_PUBLIC_APP_URL: "set in .env.local/.dev.vars for local checks or wrangler vars for Workers",
  LEAD_SUBMISSION_MODE: "set in .env.local/.dev.vars; keep disabled until staging or production lead capture is approved",
  DATABASE_URL: "set only in local env files for scripts; use Hyperdrive for Cloudflare runtime",
  DATABASE_TARGET: "set to development or staging before migrations",
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: "set in .dev.vars with a disposable development/staging Neon connection string for local preview",
  AUTH_SESSION_SECRET: "set via .env.local/.dev.vars or wrangler secret put",
  PREVIEW_TOKEN_SECRET: "set via .env.local/.dev.vars or wrangler secret put",
  ADMIN_EMAIL: "pass to npm run admin:verify -- <email> or npm run admin:create -- <email>",
  RESEND_API_KEY: "set via wrangler secret put or local .dev.vars",
  RESEND_FROM_EMAIL: "set in environment variables or wrangler vars",
  RESEND_REPLY_TO_EMAIL: "set in environment variables or wrangler vars",
  LEAD_NOTIFICATION_EMAIL: "set in environment variables or wrangler vars",
  HUBSPOT_PRIVATE_APP_TOKEN: "set via wrangler secret put or local .dev.vars",
  HUBSPOT_PIPELINE_ID: "set from HubSpot dashboard pipeline settings",
  HUBSPOT_NEW_LEAD_STAGE_ID: "set from HubSpot dashboard pipeline stage settings",
  CALCOM_BOOKING_URL: "set in environment variables or wrangler vars",
  TURNSTILE_SITE_KEY: "set in environment variables or wrangler vars",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "optional alias for public Turnstile site key; prefer TURNSTILE_SITE_KEY in this repo",
  TURNSTILE_SECRET_KEY: "set via wrangler secret put or local .dev.vars",
  TURNSTILE_EXPECTED_HOSTNAME: "set to the active staging or production hostname",
  TURNSTILE_EXPECTED_ACTION: "set to lead-submit",
  CLOUDINARY_CLOUD_NAME: "set in environment variables or wrangler vars",
  CLOUDINARY_API_KEY: "set via wrangler secret put or local .dev.vars",
  CLOUDINARY_API_SECRET: "set via wrangler secret put or local .dev.vars",
  CLOUDINARY_UPLOAD_FOLDER: "set to a staging folder for staging, production folder only after go-live approval",
  PUBLISH_CRON_SECRET: "set via wrangler secret put or local .dev.vars",
  INSIGHTS_PROVIDER: "set to local by default; use database only after staging import verification",
  NEXT_PUBLIC_GTM_ID: "set after GTM container review",
  NEXT_PUBLIC_GTM_ENABLED: "set to true only after consent QA",
  NEXT_PUBLIC_GOOGLE_ADS_ID: "set after Google Ads conversion actions are ready",
  NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL: "set after Google Ads conversion action creation",
  NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL: "set after Google Ads conversion action creation",
  NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL: "set after Google Ads conversion action creation",
  LEAD_RATE_LIMITER: "configure Cloudflare Rate Limiting binding in wrangler.jsonc",
  ADMIN_RATE_LIMITER: "configure Cloudflare Rate Limiting binding in wrangler.jsonc",
  RATE_LIMIT_COORDINATOR: "configure Durable Object binding and migration in wrangler.jsonc",
  "wrangler.hyperdrive.id": "replace placeholder with the real staging Hyperdrive ID",
  "wrangler.ratelimits.namespace_id": "replace example namespace IDs with account-unique positive integer strings",
  "wrangler.triggers.crons": "configure Cloudflare Cron Triggers in wrangler.jsonc",
};

export function redactValue(name: string, value: string | undefined) {
  if (!value) return "";
  if (secretKeyPattern.test(name)) return "[configured]";
  if (value.length > 120) return `${value.slice(0, 40)}...`;
  return value;
}

export function valuePresent(value: string | undefined) {
  return Boolean(value && value.trim().length > 0 && !/^<.+>$/.test(value.trim()));
}

export function setupLocationFor(name: string) {
  return setupLocations[name] ?? "set in the relevant provider dashboard, local env file, or Cloudflare secret";
}

export function isActivationStatus(value: string): value is ActivationStatus {
  return allowedActivationStatuses.has(value as ActivationStatus);
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

function hostnameEquals(value: string | undefined, expected: string) {
  if (!valuePresent(value)) return false;
  try {
    return new URL(value as string).hostname.toLowerCase() === expected;
  } catch {
    return false;
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
  const topLevelHyperdrive = Array.isArray(config.hyperdrive) ? config.hyperdrive : [];
  const ratelimits = Array.isArray(config.ratelimits) ? config.ratelimits : [];
  const durableObjects = config.durable_objects && typeof config.durable_objects === "object" ? config.durable_objects : {};
  const doBindings = Array.isArray((durableObjects as { bindings?: unknown }).bindings)
    ? ((durableObjects as { bindings: Array<Record<string, unknown>> }).bindings)
    : [];
  const triggers = config.triggers && typeof config.triggers === "object" ? config.triggers : {};
  const envConfig = config.env && typeof config.env === "object" ? config.env : {};
  const staging = (envConfig as { staging?: { name?: string } }).staging;
  const envHyperdrive = Object.entries(envConfig as Record<string, Record<string, unknown>>).flatMap(([envName, item]) => {
    const hyperdrive = item && Array.isArray(item.hyperdrive) ? item.hyperdrive : [];
    return hyperdrive.map((entry) => ({ entry, envName }));
  });
  const hyperdrive = [
    ...topLevelHyperdrive.map((entry) => ({ entry, envName: "" })),
    ...envHyperdrive,
  ];

  return {
    workerName: String(config.name ?? ""),
    compatibilityDate: String(config.compatibility_date ?? ""),
    hyperdriveBindings: Array.from(
      new Set(hyperdrive.map(({ entry }) => String((entry as { binding?: unknown }).binding ?? "")).filter(Boolean))
    ),
    hyperdrivePlaceholderIds: hyperdrive
      .filter(({ entry }) => /^0+$/.test(String((entry as { id?: unknown }).id ?? "")))
      .map(({ entry, envName }) => {
        const binding = String((entry as { binding?: unknown }).binding ?? "");
        return envName ? `${envName}.${binding}` : binding;
      }),
    rateLimitBindings: ratelimits.map((item) => String((item as { name?: unknown }).name ?? "")).filter(Boolean),
    rateLimitPlaceholderIds: ratelimits
      .filter((item) => /^(1001|1002|0+|placeholder)$/i.test(String((item as { namespace_id?: unknown }).namespace_id ?? "")))
      .map((item) => String((item as { name?: unknown }).name ?? "")),
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
  const leadSubmissionMode = String(env.LEAD_SUBMISSION_MODE ?? "missing");
  const productionLeadMode = leadSubmissionMode === "production-durable";
  const gtmEnabled = String(env.NEXT_PUBLIC_GTM_ENABLED ?? "false").toLowerCase() === "true";
  const gtmConfigured = valuePresent(env.NEXT_PUBLIC_GTM_ID);
  const adsIdConfigured = valuePresent(env.NEXT_PUBLIC_GOOGLE_ADS_ID);
  const adsLabels = [
    "NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL",
    "NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL",
    "NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL",
  ];
  const missingAdsLabels = adsLabels.filter((name) => !valuePresent(env[name]));
  const appUrl = validateHttpUrl(env.APP_URL);
  const publicUrl = validateHttpUrl(env.NEXT_PUBLIC_APP_URL);
  const leadModeValid = isLeadSubmissionMode(env.LEAD_SUBMISSION_MODE);
  const calcom = validateHttpUrl(env.CALCOM_BOOKING_URL, { httpsOnly: true, expectedHosts: ["cal.com", "www.cal.com", "app.cal.com"] });

  return [
    checkRequired("Application", ["APP_URL", "NEXT_PUBLIC_APP_URL", "LEAD_SUBMISSION_MODE"], env, {
      context: activationContexts.application,
      invalid: appUrl === "invalid" || publicUrl === "invalid" || (valuePresent(env.LEAD_SUBMISSION_MODE) && !leadModeValid),
      nextAction: "Set APP_URL and NEXT_PUBLIC_APP_URL to the active environment origin. Use LEAD_SUBMISSION_MODE=disabled, test, staging-durable, or production-durable.",
    }),
    {
      category: "Cloudflare",
      status: audit.workerName && audit.stagingWorkerName && audit.compatibilityDate ? "partially configured" : "missing",
      context: activationContexts.cloudflare,
      detail: `Worker=${audit.workerName || "missing"}; staging=${audit.stagingWorkerName || "missing"}; compatibility=${audit.compatibilityDate || "missing"}. Hyperdrive IDs still require provider values when placeholders remain.`,
      required: ["wrangler.name", "wrangler.env.staging.name", "wrangler.compatibility_date", "wrangler.hyperdrive.id"],
      missing: audit.hyperdrivePlaceholderIds.length ? ["wrangler.hyperdrive.id"] : [],
      nextAction: "Replace placeholder Cloudflare IDs only with real staging IDs; do not bind the production domain during staging.",
    },
    checkRequired("Neon / DATABASE_URL", ["DATABASE_URL", "DATABASE_TARGET"], env, {
      context: activationContexts.neon,
      nextAction: "Set DATABASE_URL only for local scripts or use the Hyperdrive binding at runtime.",
    }),
    {
      category: "Hyperdrive",
      status: audit.hyperdriveBindings.length && valuePresent(env[hyperdriveLocalVar]) && audit.hyperdrivePlaceholderIds.length === 0
        ? "configured"
        : audit.hyperdriveBindings.length
          ? "partially configured"
          : "missing",
      context: activationContexts.hyperdrive,
      detail: audit.hyperdriveBindings.length
        ? `Wrangler binding ${hyperdriveBinding}; local preview variable ${hyperdriveLocalVar}. production:check loads .env.local and .dev.vars when present; Wrangler also loads .dev.vars during preview.`
        : "No Hyperdrive binding found in wrangler.jsonc.",
      required: [hyperdriveLocalVar, "wrangler.hyperdrive.id"],
      missing: [
        ...(valuePresent(env[hyperdriveLocalVar]) ? [] : [hyperdriveLocalVar]),
        ...(audit.hyperdrivePlaceholderIds.length ? ["wrangler.hyperdrive.id"] : []),
      ],
      nextAction: "Create Hyperdrive in Cloudflare and set the local preview connection string in .dev.vars.",
    },
    checkRequired("Auth secrets", ["AUTH_SESSION_SECRET", "PREVIEW_TOKEN_SECRET"], env, {
      context: activationContexts.auth,
      nextAction: "Generate long random secrets and store them through local env files or Cloudflare secrets.",
    }),
    {
      category: "Admin bootstrap readiness",
      status: valuePresent(env.DATABASE_URL) && valuePresent(env.AUTH_SESSION_SECRET) ? "live test required" : "missing",
      context: activationContexts.admin,
      detail: "First Admin verification requires a configured staging DB, auth secret, and explicit admin email argument.",
      required: ["DATABASE_URL", "AUTH_SESSION_SECRET", "ADMIN_EMAIL"],
      missing: [
        ...(valuePresent(env.DATABASE_URL) ? [] : ["DATABASE_URL"]),
        ...(valuePresent(env.AUTH_SESSION_SECRET) ? [] : ["AUTH_SESSION_SECRET"]),
        "ADMIN_EMAIL",
      ],
      nextAction: "Run npm run admin:create -- <admin-email> and npm run admin:verify -- <admin-email> only after staging DB is configured.",
    },
    {
      category: "Insights provider mode",
      status: insightsProvider === "database" && !valuePresent(env.DATABASE_URL) ? "partially configured" : "configured",
      context: activationContexts.insights,
      detail: `INSIGHTS_PROVIDER=${insightsProvider}. Production should remain local until DB import verification passes.`,
      required: ["INSIGHTS_PROVIDER"],
      missing: insightsProvider === "database" && !valuePresent(env.DATABASE_URL) ? ["DATABASE_URL"] : [],
      nextAction: "Switch only staging/preview to database first, compare routes, then separately approve production.",
    },
    checkRequired("Resend", ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_REPLY_TO_EMAIL", "LEAD_NOTIFICATION_EMAIL"], env, {
      context: activationContexts.resend,
      invalid:
        validateEmailAddress(env.RESEND_FROM_EMAIL) === "invalid" ||
        validateEmailAddress(env.RESEND_REPLY_TO_EMAIL) === "invalid" ||
        validateEmailAddress(env.LEAD_NOTIFICATION_EMAIL) === "invalid",
      nextAction: "Verify taskcover.com in Resend and configure sender, reply-to, and notification recipient.",
    }),
    checkRequired("HubSpot", ["HUBSPOT_PRIVATE_APP_TOKEN", "HUBSPOT_PIPELINE_ID", "HUBSPOT_NEW_LEAD_STAGE_ID"], env, {
      context: activationContexts.hubspot,
      nextAction: "Create a HubSpot Private App token and record the target pipeline and new-lead stage IDs.",
    }),
    checkRequired("Cal.com", ["CALCOM_BOOKING_URL"], env, {
      context: activationContexts.calcom,
      invalid: calcom === "invalid",
      nextAction: "Set an HTTPS Cal.com booking URL without visitor PII query parameters.",
    }),
    checkRequired("Turnstile", ["TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "TURNSTILE_EXPECTED_HOSTNAME", "TURNSTILE_EXPECTED_ACTION"], env, {
      context: activationContexts.turnstile,
      invalid:
        productionLeadMode &&
        (env.TURNSTILE_EXPECTED_HOSTNAME !== "taskcover.com" || env.TURNSTILE_EXPECTED_ACTION !== "lead-submit"),
      nextAction: "Use Cloudflare test keys locally and real keys for staging/production hostnames. Production lead capture requires TURNSTILE_EXPECTED_HOSTNAME=taskcover.com and TURNSTILE_EXPECTED_ACTION=lead-submit.",
    }),
    checkRequired("Cloudinary", ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "CLOUDINARY_UPLOAD_FOLDER"], env, {
      context: activationContexts.cloudinary,
      nextAction: "Configure signed upload credentials and use a staging folder outside production.",
    }),
    {
      category: "Rate Limiting binding",
      status:
        productionLeadMode &&
        (!audit.rateLimitBindings.includes("LEAD_RATE_LIMITER") ||
          !audit.rateLimitBindings.includes("ADMIN_RATE_LIMITER") ||
          audit.rateLimitPlaceholderIds.length > 0 ||
          env.RATE_LIMIT_PROVIDER !== "cloudflare")
          ? "invalid format"
          : audit.rateLimitBindings.includes("LEAD_RATE_LIMITER") && audit.rateLimitBindings.includes("ADMIN_RATE_LIMITER") && audit.rateLimitPlaceholderIds.length === 0
            ? "configured"
            : "partially configured",
      context: activationContexts.rateLimit,
      detail: `Provider=${env.RATE_LIMIT_PROVIDER ?? "memory"}; bindings=${audit.rateLimitBindings.join(", ") || "none"}; placeholder namespace IDs=${audit.rateLimitPlaceholderIds.join(", ") || "none"}.`,
      required: ["LEAD_RATE_LIMITER", "ADMIN_RATE_LIMITER", "RATE_LIMIT_PROVIDER", "wrangler.ratelimits.namespace_id"],
      missing: [
        ...["LEAD_RATE_LIMITER", "ADMIN_RATE_LIMITER"].filter((name) => !audit.rateLimitBindings.includes(name)),
        ...(env.RATE_LIMIT_PROVIDER === "cloudflare" ? [] : ["RATE_LIMIT_PROVIDER"]),
        ...(audit.rateLimitPlaceholderIds.length ? ["wrangler.ratelimits.namespace_id"] : []),
      ],
      nextAction: "Choose account-unique positive integer namespace IDs for LEAD_RATE_LIMITER and ADMIN_RATE_LIMITER in wrangler.jsonc; do not use the documentation examples 1001/1002 for production lead capture.",
    },
    {
      category: "Durable Objects",
      status: audit.durableObjectBindings.includes("RATE_LIMIT_COORDINATOR") ? "configured" : "missing",
      context: activationContexts.durableObjects,
      detail: `Bindings=${audit.durableObjectBindings.join(", ") || "none"}.`,
      required: ["RATE_LIMIT_COORDINATOR"],
      missing: audit.durableObjectBindings.includes("RATE_LIMIT_COORDINATOR") ? [] : ["RATE_LIMIT_COORDINATOR"],
      nextAction: "Keep the Durable Object migration in wrangler.jsonc and deploy only after review.",
    },
    {
      category: "Cron/scheduler",
      status: audit.cronSchedules.length && valuePresent(env.PUBLISH_CRON_SECRET) ? "configured" : audit.cronSchedules.length ? "partially configured" : "missing",
      context: activationContexts.cron,
      detail: `Cron=${audit.cronSchedules.join(", ") || "none"}; provider=${env.PUBLISH_SCHEDULER_PROVIDER ?? "disabled"}.`,
      required: ["wrangler.triggers.crons", "PUBLISH_CRON_SECRET"],
      missing: [...(audit.cronSchedules.length ? [] : ["wrangler.triggers.crons"]), ...(valuePresent(env.PUBLISH_CRON_SECRET) ? [] : ["PUBLISH_CRON_SECRET"])],
      nextAction: "Configure Cron only after staging validation; keep the secure HTTP publishing endpoint secret.",
    },
    {
      category: "GTM/GA4/Google Ads readiness",
      status: !gtmEnabled && !gtmConfigured && !adsIdConfigured
        ? "not required in current mode"
        : gtmEnabled && gtmConfigured && (!adsIdConfigured || missingAdsLabels.length === 0)
          ? adsIdConfigured
            ? "live test required"
            : "configured"
          : "partially configured",
      context: activationContexts.analytics,
      detail: `GTM enabled=${gtmEnabled}; GTM ID=${gtmConfigured ? "configured" : "missing"}; Google Ads ID=${adsIdConfigured ? "configured" : "missing"}.`,
      required: ["NEXT_PUBLIC_GTM_ID", "NEXT_PUBLIC_GTM_ENABLED", "NEXT_PUBLIC_GOOGLE_ADS_ID", ...adsLabels],
      missing: [
        ...(gtmEnabled && !gtmConfigured ? ["NEXT_PUBLIC_GTM_ID"] : []),
        ...(adsIdConfigured ? missingAdsLabels : []),
      ],
      nextAction: "Keep IDs unset until GTM/GA4/Google Ads containers and consent QA are ready; do not launch ads from code.",
    },
    {
      category: "Consent mode readiness",
      status: "configured",
      context: activationContexts.consent,
      detail: "Consent defaults deny analytics/marketing storage until the visitor grants consent; tracking exclusions are implemented for Admin/API/preview/internal routes.",
      required: ["consent helper", "route exclusions", "default denied mapping"],
      missing: [],
      nextAction: "Run consent QA with reject, analytics-only, marketing-only, and accept-all states before ads go live.",
    },
    {
      category: "Lead outbox readiness",
      status: productionLeadMode
        ? hostnameEquals(env.APP_URL, "taskcover.com") &&
          hostnameEquals(env.NEXT_PUBLIC_APP_URL, "taskcover.com") &&
          audit.hyperdriveBindings.includes("HYPERDRIVE") &&
          audit.hyperdrivePlaceholderIds.length === 0 &&
          valuePresent(env.RESEND_API_KEY) &&
          valuePresent(env.TURNSTILE_SECRET_KEY) &&
          valuePresent(env.CALCOM_BOOKING_URL) &&
          audit.rateLimitBindings.includes("LEAD_RATE_LIMITER") &&
          audit.rateLimitBindings.includes("ADMIN_RATE_LIMITER") &&
          audit.rateLimitPlaceholderIds.length === 0
          ? "live test required"
          : "invalid format"
        : valuePresent(env.DATABASE_URL)
          ? leadSubmissionMode === "disabled"
            ? "staging only"
            : leadModeValid
              ? "live test required"
              : "invalid format"
          : "missing",
      context: activationContexts.leadOutbox,
      detail: `LEAD_SUBMISSION_MODE=${leadSubmissionMode}; supported values are disabled, test, staging-durable, production-durable. Production durable acceptance requires production origin, Hyperdrive, Turnstile, Cloudflare rate limiting, Resend, and Cal.com readiness.`,
      required: productionLeadMode
        ? [
            "APP_URL",
            "NEXT_PUBLIC_APP_URL",
            "HYPERDRIVE",
            "RESEND_API_KEY",
            "TURNSTILE_SECRET_KEY",
            "CALCOM_BOOKING_URL",
            "LEAD_RATE_LIMITER",
            "ADMIN_RATE_LIMITER",
            "wrangler.ratelimits.namespace_id",
          ]
        : ["DATABASE_URL", "LEAD_SUBMISSION_MODE"],
      missing: [
        ...(productionLeadMode
          ? [
              ...(hostnameEquals(env.APP_URL, "taskcover.com") ? [] : ["APP_URL"]),
              ...(hostnameEquals(env.NEXT_PUBLIC_APP_URL, "taskcover.com") ? [] : ["NEXT_PUBLIC_APP_URL"]),
              ...(audit.hyperdriveBindings.includes("HYPERDRIVE") && audit.hyperdrivePlaceholderIds.length === 0 ? [] : ["HYPERDRIVE"]),
              ...(valuePresent(env.RESEND_API_KEY) ? [] : ["RESEND_API_KEY"]),
              ...(valuePresent(env.TURNSTILE_SECRET_KEY) ? [] : ["TURNSTILE_SECRET_KEY"]),
              ...(valuePresent(env.CALCOM_BOOKING_URL) ? [] : ["CALCOM_BOOKING_URL"]),
              ...(audit.rateLimitBindings.includes("LEAD_RATE_LIMITER") ? [] : ["LEAD_RATE_LIMITER"]),
              ...(audit.rateLimitBindings.includes("ADMIN_RATE_LIMITER") ? [] : ["ADMIN_RATE_LIMITER"]),
              ...(audit.rateLimitPlaceholderIds.length ? ["wrangler.ratelimits.namespace_id"] : []),
            ]
          : [...(valuePresent(env.DATABASE_URL) ? [] : ["DATABASE_URL"])]),
        ...(valuePresent(env.LEAD_SUBMISSION_MODE) ? [] : ["LEAD_SUBMISSION_MODE"]),
      ],
      nextAction: productionLeadMode
        ? "Keep production deploy blocked until real Cloudflare Rate Limiting namespace IDs replace placeholders, production Turnstile validates taskcover.com, and a local/preview lead smoke with test data passes."
        : "Keep default smoke tests in mock mode; enable durable staging lead acceptance only after database, Turnstile, and rate limits are configured.",
    },
  ];
}

function checkRequired(
  category: string,
  required: string[],
  env: EnvMap,
  options: { context: ActivationCheck["context"]; invalid?: boolean; nextAction: string }
): ActivationCheck {
  const missing = required.filter((name) => !valuePresent(env[name]));
  const status: ActivationStatus = options.invalid
    ? "invalid format"
    : missing.length === 0
      ? "configured"
      : missing.length === required.length
        ? "missing"
        : "partially configured";
  return {
    category,
    status,
    context: options.context,
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
