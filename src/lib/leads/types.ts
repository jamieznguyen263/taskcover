import type { Locale } from "@/lib/i18n";

export const leadRequestTypes = [
  "seo-audit",
  "strategy-call",
  "general-contact",
  "media-inquiry",
  "private-reference",
  "data-request",
  "partnership",
  "seo-mentor",
  "ppc-inquiry",
  "other",
] as const;

export type LeadRequestType = (typeof leadRequestTypes)[number];

export type DeliveryStatus =
  | "accepted"
  | "rejected"
  | "not-configured"
  | "temporary-error";

export type DeliveryResult = {
  status: DeliveryStatus;
  adapter: string;
  reason?: string;
};

export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

export type SpamSignals = {
  honeypotPresent: boolean;
  rateLimitKey?: string;
  turnstileConfigured: boolean;
  turnstileVerified: boolean;
};

export type NormalizedLead = {
  requestType: LeadRequestType;
  locale: Locale;
  name: string;
  workEmail: string;
  company?: string;
  role?: string;
  websiteUrl?: string;
  market?: string;
  industry?: string;
  serviceInterests?: string[];
  primaryChallenge?: string;
  goals?: string;
  timeline?: string;
  investmentRange?: string;
  currentTrafficRange?: string;
  paidSearchActivity?: string;
  preferredTimeZone?: string;
  preferredCallWindows?: string[];
  message?: string;
  consent: true;
  submittedAt: string;
  sourcePath: string;
  utm?: UtmParams;
  spamSignals: SpamSignals;
};

export type FieldErrors = Record<string, string[]>;

export type LeadSubmissionStatus =
  | "success"
  | "validation-error"
  | "not-configured"
  | "temporary-error"
  | "rejected"
  | "spam-rejected";

export type LeadSubmissionResult = {
  status: LeadSubmissionStatus;
  requestType?: LeadRequestType;
  leadReference?: string;
  redirectPath?: string;
  fieldErrors?: FieldErrors;
  messageKey?: string;
  delivery?: DeliveryResult[];
};

export interface LeadDeliveryAdapter {
  name: string;
  isConfigured(): boolean;
  deliver(lead: NormalizedLead): Promise<DeliveryResult>;
}

export interface NotificationAdapter extends LeadDeliveryAdapter {
  recipient: string;
}

export type CrmAdapter = LeadDeliveryAdapter;

export type LeadStorageAdapter = LeadDeliveryAdapter;

export interface CalendarAdapter {
  name: string;
  isConfigured(): boolean;
  requestBooking(lead: NormalizedLead): Promise<DeliveryResult>;
}
