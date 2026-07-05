import type { Locale } from "@/lib/i18n";
import type { LeadRequestType } from "@/lib/leads/types";

export type LeadOption = {
  value: string;
  label: string;
  description?: string;
};

export type LeadFieldContent = {
  label: string;
  placeholder?: string;
  help?: string;
};

export type LeadValidationContent = {
  required: string;
  email: string;
  url: string;
  consent: string;
  selectRequired: string;
  length: string;
  malformed: string;
  callWindows: string;
};

export type LeadPageMeta = {
  title: string;
  description: string;
};

export type ThankYouContent = {
  title: string;
  message: string;
  next: string[];
  studies: string[];
  samples: string[];
  primaryCta: string;
  secondaryCta: string;
};

export type LeadsContent = {
  locale: Locale;
  recipientEmail: string;
  common: {
    back: string;
    continue: string;
    submit: string;
    submitting: string;
    retry: string;
    directEmail: string;
    requiredNote: string;
    optional: string;
    consentText: string;
    honeypotLabel: string;
    unavailableTitle: string;
    unavailableBody: string;
    temporaryError: string;
    spamError: string;
    validationSummary: string;
    mailSubjects: Record<LeadRequestType, string>;
    turnstileLabel: string;
  };
  fields: Record<string, LeadFieldContent>;
  validation: LeadValidationContent;
  options: {
    markets: LeadOption[];
    industries: LeadOption[];
    services: LeadOption[];
    traffic: LeadOption[];
    paidSearch: LeadOption[];
    timelines: LeadOption[];
    investments: LeadOption[];
    timeZones: LeadOption[];
    callWindows: LeadOption[];
    contactIntents: LeadOption[];
    engagementTypes: LeadOption[];
    requestedFormats: LeadOption[];
  };
  freeAudit: {
    meta: LeadPageMeta;
    eyebrow: string;
    h1: string;
    intro: string;
    proof: string;
    steps: { title: string; description: string }[];
    previewTitle: string;
    previewIntro: string;
    previewItems: string[];
    privacyTitle: string;
    privacyBody: string;
  };
  bookCall: {
    meta: LeadPageMeta;
    eyebrow: string;
    h1: string;
    intro: string;
    agendaTitle: string;
    agenda: string[];
    prepareTitle: string;
    prepare: string[];
    boundary: string;
  };
  contact: {
    meta: LeadPageMeta;
    eyebrow: string;
    h1: string;
    intro: string;
    deskTitle: string;
    deskItems: string[];
    intentHelp: string;
  };
  thankYou: {
    meta: LeadPageMeta;
    fallbackTitle: string;
    fallbackMessage: string;
    nextLabel: string;
    studiesLabel: string;
    samplesLabel: string;
    viewStudies: string;
    viewSamples: string;
    analyticsHook: string;
    states: Record<LeadRequestType | "contact", ThankYouContent>;
  };
};
