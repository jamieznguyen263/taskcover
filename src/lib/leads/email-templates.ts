import type { Locale } from "@/lib/i18n";
import type { LeadDeliveryJobType } from "./acceptance";
import type { NormalizedLead } from "./types";

export type LeadEmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

const labels: Record<Locale, { received: string; next: string; book: string; contact: string }> = {
  en: {
    received: "Taskcover received your request",
    next: "We will review the details and reply from business@taskcover.com when there is a fit.",
    book: "Choose a strategy-call time",
    contact: "You can also write to business@taskcover.com.",
  },
  fr: {
    received: "Taskcover a recu votre demande",
    next: "Nous examinerons les informations et repondrons depuis business@taskcover.com si la demande correspond.",
    book: "Choisir un horaire d'appel strategique",
    contact: "Vous pouvez aussi ecrire a business@taskcover.com.",
  },
  es: {
    received: "Taskcover recibio tu solicitud",
    next: "Revisaremos los detalles y responderemos desde business@taskcover.com si hay encaje.",
    book: "Elegir un horario para la llamada estrategica",
    contact: "Tambien puedes escribir a business@taskcover.com.",
  },
};

export function renderInternalLeadEmail(lead: NormalizedLead, leadId: string): LeadEmailTemplate {
  const subject = `[Taskcover lead] ${lead.requestType} - ${lead.company ?? lead.workEmail}`;
  const rows = [
    ["Lead reference", leadId],
    ["Request type", lead.requestType],
    ["Locale", lead.locale],
    ["Name", lead.name],
    ["Email", lead.workEmail],
    ["Company", lead.company],
    ["Website", lead.websiteUrl],
    ["Market", lead.market],
    ["Industry", lead.industry],
    ["Services", lead.serviceInterests?.join(", ")],
    ["Timeline", lead.timeline],
    ["Investment", lead.investmentRange],
    ["Source path", lead.sourcePath],
    ["UTM source", lead.utm?.source],
    ["UTM medium", lead.utm?.medium],
    ["UTM campaign", lead.utm?.campaign],
    ["Message", lead.message],
  ].filter(([, value]) => value);

  const text = rows.map(([key, value]) => `${key}: ${value}`).join("\n");
  const html = `<h1>New Taskcover lead</h1><table>${rows
    .map(([key, value]) => `<tr><th align="left">${escapeHtml(key ?? "")}</th><td>${escapeHtml(value ?? "")}</td></tr>`)
    .join("")}</table>`;
  return { subject, html, text };
}

export function renderVisitorLeadEmail(
  lead: NormalizedLead,
  leadId: string,
  bookingUrl = process.env.CALCOM_BOOKING_URL
): LeadEmailTemplate {
  const copy = labels[lead.locale];
  const bookingLine = bookingUrl ? `\n${copy.book}: ${bookingUrl}` : "";
  const text = `${copy.received}\n\nRequest type: ${lead.requestType}\nLead reference: ${leadId}\n\n${copy.next}${bookingLine}\n\n${copy.contact}`;
  const html = `<h1>${escapeHtml(copy.received)}</h1><p>Request type: ${escapeHtml(lead.requestType)}</p><p>Lead reference: ${escapeHtml(
    leadId
  )}</p><p>${escapeHtml(copy.next)}</p>${bookingUrl ? `<p><a href="${escapeHtml(bookingUrl)}">${escapeHtml(copy.book)}</a></p>` : ""}<p>${escapeHtml(
    copy.contact
  )}</p>`;
  return { subject: copy.received, html, text };
}

export function resendIdempotencyKey(leadId: string, jobType: LeadDeliveryJobType, locale: Locale, recipient: string) {
  return `taskcover:${leadId}:${jobType}:${locale}:${recipient.toLowerCase()}`;
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
