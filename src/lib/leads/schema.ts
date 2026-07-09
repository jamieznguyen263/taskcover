import { isLocale, type Locale } from "@/lib/i18n";
import {
  leadRequestTypes,
  type FieldErrors,
  type LeadRequestType,
  type NormalizedLead,
  type SpamSignals,
  type UtmParams,
} from "./types";

export const marketValues = ["usa", "canada", "australia", "multiple", "other"] as const;
export const industryValues = [
  "travel-hospitality",
  "education",
  "healthcare-wellness",
  "legal-immigration",
  "saas-technology",
  "ecommerce",
  "franchise-multilocation",
  "other",
] as const;
export const serviceValues = [
  "seo-agency",
  "technical-seo",
  "ai-search-optimization",
  "content-marketing",
  "website-development",
  "digital-pr-link-building",
  "local-seo",
  "ecommerce-seo",
  "international-seo",
  "seo-audit",
  "ppc-management",
  "seo-mentor-service",
] as const;
export const trafficValues = ["unknown", "under-1000", "1000-10000", "10000-50000", "50000-plus"] as const;
export const paidSearchValues = ["yes", "no", "planned", "not-sure"] as const;
export const timelineValues = ["urgent", "30-60-days", "quarter", "6-months", "exploring"] as const;
export const investmentValues = [
  "not-sure",
  "under-2500",
  "2500-5000",
  "5000-10000",
  "10000-plus",
  "project-based",
] as const;
export const timeZoneValues = [
  "america-eastern",
  "america-central",
  "america-mountain",
  "america-pacific",
  "canada-eastern",
  "australia-eastern",
  "europe",
  "asia",
  "other",
] as const;
export const callWindowValues = [
  "weekday-morning",
  "weekday-midday",
  "weekday-afternoon",
  "weekday-evening",
  "flexible",
] as const;

const allowedKeys = new Set([
  "requestType",
  "locale",
  "name",
  "workEmail",
  "company",
  "role",
  "websiteUrl",
  "market",
  "industry",
  "serviceInterests",
  "primaryChallenge",
  "goals",
  "timeline",
  "investmentRange",
  "currentTrafficRange",
  "paidSearchActivity",
  "preferredTimeZone",
  "preferredCallWindows",
  "message",
  "consent",
  "sourcePath",
  "utm",
  "turnstileToken",
  "website",
  "engagementType",
  "publication",
  "topic",
  "deadline",
  "requestedFormat",
  "requestDetail",
]);

const maxLengths: Record<string, number> = {
  name: 100,
  workEmail: 160,
  company: 120,
  role: 120,
  websiteUrl: 240,
  primaryChallenge: 800,
  goals: 800,
  message: 1400,
  sourcePath: 240,
  engagementType: 80,
  publication: 140,
  topic: 180,
  deadline: 80,
  requestedFormat: 80,
  requestDetail: 120,
};

export type LeadRawPayload = Record<string, unknown>;

type ParseInput = {
  payload: unknown;
  submittedAt: string;
  spamSignals: SpamSignals;
};

type ParseResult =
  | { success: true; lead: NormalizedLead; turnstileToken?: string; honeypotValue: string }
  | { success: false; fieldErrors: FieldErrors; honeypotValue: string; turnstileToken?: string };

function addError(errors: FieldErrors, field: string, message: string) {
  errors[field] = [...(errors[field] ?? []), message];
}

function asRecord(value: unknown): LeadRawPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as LeadRawPayload;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown, field: string, errors: FieldErrors): string | undefined {
  const valueText = text(value);
  if (!valueText) return undefined;
  const max = maxLengths[field] ?? 500;
  if (valueText.length > max) addError(errors, field, "length");
  return valueText;
}

function requiredText(payload: LeadRawPayload, field: string, errors: FieldErrors): string {
  const value = optionalText(payload[field], field, errors);
  if (!value) addError(errors, field, "required");
  return value ?? "";
}

function normalizeEmail(value: string, errors: FieldErrors): string {
  const normalized = value.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) addError(errors, "workEmail", "email");
  return normalized;
}

function normalizeUrl(value: string | undefined, field: string, errors: FieldErrors): string | undefined {
  if (!value) return undefined;
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
      addError(errors, field, "url");
      return value;
    }
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    addError(errors, field, "url");
    return value;
  }
}

function enumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  field: string,
  errors: FieldErrors,
  required = false
): T[number] | undefined {
  const valueText = text(value);
  if (!valueText) {
    if (required) addError(errors, field, "selectRequired");
    return undefined;
  }
  if (!(allowed as readonly string[]).includes(valueText)) {
    addError(errors, field, "malformed");
    return undefined;
  }
  return valueText as T[number];
}

function enumArray<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  field: string,
  errors: FieldErrors,
  required = false
): T[number][] | undefined {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  const clean = raw.map(text).filter(Boolean);
  if (required && clean.length === 0) addError(errors, field, "selectRequired");
  const invalid = clean.some((item) => !(allowed as readonly string[]).includes(item));
  if (invalid) addError(errors, field, "malformed");
  return clean.length > 0 && !invalid ? Array.from(new Set(clean)) as T[number][] : undefined;
}

function normalizeUtm(value: unknown): UtmParams | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const utm: UtmParams = {
    source: optionalUtm(record.source),
    medium: optionalUtm(record.medium),
    campaign: optionalUtm(record.campaign),
    term: optionalUtm(record.term),
    content: optionalUtm(record.content),
  };
  return Object.values(utm).some(Boolean) ? utm : undefined;
}

function optionalUtm(value: unknown): string | undefined {
  const clean = text(value);
  return clean ? clean.slice(0, 120) : undefined;
}

export function safeContactIntent(value: unknown): string {
  const intent = text(value);
  const allowed = [
    "seo-services",
    "ppc",
    "seo-mentor",
    "media",
    "private-reference",
    "partnership",
    "general",
    "other",
  ];
  return allowed.includes(intent) ? intent : "general";
}

export function safeThankYouType(value: unknown): LeadRequestType | "contact" {
  const type = text(value);
  if (type === "contact") return "contact";
  return (leadRequestTypes as readonly string[]).includes(type) ? (type as LeadRequestType) : "general-contact";
}

export function thankYouPathFor(locale: Locale, requestType: LeadRequestType): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const type = ["general-contact", "partnership", "seo-mentor", "ppc-inquiry", "other"].includes(requestType)
    ? "contact"
    : requestType;
  return `${prefix}/thank-you?type=${encodeURIComponent(type)}`;
}

export function parseLeadPayload({ payload, submittedAt, spamSignals }: ParseInput): ParseResult {
  const errors: FieldErrors = {};
  const record = asRecord(payload);
  if (!record) {
    return { success: false, fieldErrors: { form: ["malformed"] }, honeypotValue: "" };
  }

  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) addError(errors, "form", "malformed");
  }

  const requestTypeRaw = text(record.requestType);
  const requestType = (leadRequestTypes as readonly string[]).includes(requestTypeRaw)
    ? (requestTypeRaw as LeadRequestType)
    : undefined;
  if (!requestType) addError(errors, "requestType", "selectRequired");

  const locale = isLocale(record.locale) ? record.locale : undefined;
  if (!locale) addError(errors, "locale", "malformed");

  const name = requiredText(record, "name", errors);
  const email = normalizeEmail(requiredText(record, "workEmail", errors), errors);
  const sourcePath = optionalText(record.sourcePath, "sourcePath", errors) ?? "/";
  const consent = record.consent === true || record.consent === "true" || record.consent === "on";
  if (!consent) addError(errors, "consent", "consent");

  const websiteUrl = normalizeUrl(optionalText(record.websiteUrl, "websiteUrl", errors), "websiteUrl", errors);
  const baseMessage = optionalText(record.message, "message", errors);

  let market: string | undefined;
  let industry: string | undefined;
  let serviceInterests: string[] | undefined;
  let primaryChallenge: string | undefined;
  let goals: string | undefined;
  let timeline: string | undefined;
  let currentTrafficRange: string | undefined;
  let paidSearchActivity: string | undefined;
  let preferredTimeZone: string | undefined;
  let preferredCallWindows: string[] | undefined;
  let message = baseMessage;

  if (requestType === "seo-audit") {
    if (!websiteUrl) addError(errors, "websiteUrl", "required");
    market = enumValue(record.market, marketValues, "market", errors, true);
    industry = enumValue(record.industry, industryValues, "industry", errors, true);
    serviceInterests = enumArray(record.serviceInterests, serviceValues, "serviceInterests", errors, true);
    currentTrafficRange = enumValue(record.currentTrafficRange, trafficValues, "currentTrafficRange", errors);
    paidSearchActivity = enumValue(record.paidSearchActivity, paidSearchValues, "paidSearchActivity", errors);
    primaryChallenge = requiredText(record, "primaryChallenge", errors);
    goals = requiredText(record, "goals", errors);
    timeline = enumValue(record.timeline, timelineValues, "timeline", errors, true);
    enumValue(record.investmentRange, investmentValues, "investmentRange", errors);
  }

  if (requestType === "strategy-call") {
    if (!websiteUrl) addError(errors, "websiteUrl", "required");
    market = enumValue(record.market, marketValues, "market", errors, true);
    serviceInterests = enumArray(record.serviceInterests, serviceValues, "serviceInterests", errors, true);
    preferredTimeZone = enumValue(record.preferredTimeZone, timeZoneValues, "preferredTimeZone", errors, true);
    preferredCallWindows = enumArray(record.preferredCallWindows, callWindowValues, "preferredCallWindows", errors, true);
    if (!preferredCallWindows || preferredCallWindows.length < 2 || preferredCallWindows.length > 3) {
      addError(errors, "preferredCallWindows", "callWindows");
    }
  }

  if (
    requestType &&
    !["seo-audit", "strategy-call"].includes(requestType)
  ) {
    serviceInterests = enumArray(record.serviceInterests, serviceValues, "serviceInterests", errors);
    const base = requiredText(record, "message", errors);
    const context = [
      optionalText(record.engagementType, "engagementType", errors) && `Engagement: ${optionalText(record.engagementType, "engagementType", errors)}`,
      optionalText(record.publication, "publication", errors) && `Publication/platform: ${optionalText(record.publication, "publication", errors)}`,
      optionalText(record.topic, "topic", errors) && `Topic: ${optionalText(record.topic, "topic", errors)}`,
      optionalText(record.deadline, "deadline", errors) && `Deadline: ${optionalText(record.deadline, "deadline", errors)}`,
      optionalText(record.requestedFormat, "requestedFormat", errors) && `Requested format: ${optionalText(record.requestedFormat, "requestedFormat", errors)}`,
    ].filter(Boolean);
    message = context.length > 0 ? `${base}\n\nRouting context:\n${context.join("\n")}` : base;
  }

  const investmentRange = enumValue(record.investmentRange, investmentValues, "investmentRange", errors);
  const turnstileToken = optionalText(record.turnstileToken, "turnstileToken", errors);
  const honeypotValue = text(record.website);

  if (Object.keys(errors).length > 0 || !requestType || !locale) {
    return { success: false, fieldErrors: errors, honeypotValue, turnstileToken };
  }

  const lead: NormalizedLead = {
    requestType,
    locale,
    name,
    workEmail: email,
    company: optionalText(record.company, "company", errors),
    role: optionalText(record.role, "role", errors),
    websiteUrl,
    market,
    industry,
    serviceInterests,
    primaryChallenge,
    goals,
    timeline,
    investmentRange,
    currentTrafficRange,
    paidSearchActivity,
    preferredTimeZone,
    preferredCallWindows,
    message,
    consent: true,
    submittedAt,
    sourcePath,
    utm: normalizeUtm(record.utm),
    spamSignals,
  };

  const cleanLead = Object.fromEntries(
    Object.entries(lead).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== "";
    })
  ) as NormalizedLead;

  return { success: true, lead: cleanLead, turnstileToken, honeypotValue };
}
