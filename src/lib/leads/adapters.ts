import type {
  CalendarAdapter,
  CrmAdapter,
  DeliveryResult,
  LeadDeliveryAdapter,
  LeadStorageAdapter,
  NotificationAdapter,
  NormalizedLead,
} from "./types";

function jsonHeaders() {
  return { "content-type": "application/json" };
}

export class WebhookLeadDeliveryAdapter implements LeadDeliveryAdapter {
  name = "lead-webhook";

  constructor(private readonly url: string | undefined) {}

  isConfigured(): boolean {
    return Boolean(this.url);
  }

  async deliver(lead: NormalizedLead): Promise<DeliveryResult> {
    if (!this.url) return { status: "not-configured", adapter: this.name };
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ type: "taskcover.lead", lead }),
      });
      if (response.ok) return { status: "accepted", adapter: this.name };
      if (response.status >= 500 || response.status === 429) {
        return { status: "temporary-error", adapter: this.name };
      }
      return { status: "rejected", adapter: this.name };
    } catch {
      return { status: "temporary-error", adapter: this.name };
    }
  }
}

export class CrmWebhookAdapter implements CrmAdapter {
  name = "crm-webhook";

  constructor(private readonly url: string | undefined) {}

  isConfigured(): boolean {
    return Boolean(this.url);
  }

  async deliver(lead: NormalizedLead): Promise<DeliveryResult> {
    if (!this.url) return { status: "not-configured", adapter: this.name };
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ type: "taskcover.crm_lead", lead }),
      });
      if (response.ok) return { status: "accepted", adapter: this.name };
      return response.status >= 500
        ? { status: "temporary-error", adapter: this.name }
        : { status: "rejected", adapter: this.name };
    } catch {
      return { status: "temporary-error", adapter: this.name };
    }
  }
}

export class TestLeadDeliveryAdapter implements LeadDeliveryAdapter {
  name = "safe-test-adapter";

  isConfigured(): boolean {
    return process.env.LEAD_SUBMISSION_MODE === "test";
  }

  async deliver(): Promise<DeliveryResult> {
    return this.isConfigured()
      ? { status: "accepted", adapter: this.name }
      : { status: "not-configured", adapter: this.name };
  }
}

export class FutureNotificationAdapter implements NotificationAdapter {
  name = "future-notification";
  recipient: string;

  constructor(recipient = process.env.LEAD_NOTIFICATION_EMAIL || "business@taskcover.com") {
    this.recipient = recipient;
  }

  isConfigured(): boolean {
    return false;
  }

  async deliver(): Promise<DeliveryResult> {
    return { status: "not-configured", adapter: this.name };
  }
}

export class FutureStorageAdapter implements LeadStorageAdapter {
  name = "future-storage";
  isConfigured() {
    return false;
  }
  async deliver(): Promise<DeliveryResult> {
    return { status: "not-configured", adapter: this.name };
  }
}

export class FutureCalendarAdapter implements CalendarAdapter {
  name = "future-calendar";
  isConfigured() {
    return Boolean(process.env.CALENDAR_PROVIDER && process.env.CALENDAR_PROVIDER !== "disabled");
  }
  async requestBooking(): Promise<DeliveryResult> {
    return { status: "not-configured", adapter: this.name };
  }
}

export function getLeadDeliveryAdapters(): LeadDeliveryAdapter[] {
  return [
    new TestLeadDeliveryAdapter(),
    new WebhookLeadDeliveryAdapter(process.env.LEAD_WEBHOOK_URL),
    new CrmWebhookAdapter(process.env.CRM_WEBHOOK_URL),
  ];
}
