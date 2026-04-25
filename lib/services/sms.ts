/**
 * SMS service abstraction layer.
 * ─────────────────────────────────────────────────────────────
 * Tier 9.1 — Matches the email.ts adapter pattern. Twilio in prod,
 * mock in dev. Used by the SMS intake-reminder cron and future
 * SMS lifecycle flows (shipping updates, refill reminders, save
 * offers to churn-risk members).
 *
 * Opt-in: every SMS call should only be made for leads/users who
 * previously consented. The consumer (not this adapter) is
 * responsible for checking consent — this keeps the adapter
 * focused on delivery mechanics.
 */

export interface SmsMessage {
  to: string; // E.164 format (+15555551234) or 10-digit US
  body: string;
}

export interface SmsProvider {
  send(message: SmsMessage): Promise<{ id: string }>;
}

class TwilioAdapter implements SmsProvider {
  private sid: string;
  private token: string;
  private from: string;

  constructor() {
    this.sid = process.env.TWILIO_ACCOUNT_SID || "";
    this.token = process.env.TWILIO_AUTH_TOKEN || "";
    this.from = process.env.TWILIO_FROM_NUMBER || "";
  }

  async send(message: SmsMessage): Promise<{ id: string }> {
    if (!this.sid || !this.token || !this.from) {
      throw new Error("Twilio not configured — set TWILIO_* env vars");
    }
    const to = message.to.startsWith("+")
      ? message.to
      : `+1${message.to.replace(/\D/g, "")}`;

    const auth = Buffer.from(`${this.sid}:${this.token}`).toString("base64");
    const body = new URLSearchParams({
      From: this.from,
      To: to,
      Body: message.body,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );
    if (!res.ok) {
      throw new Error(`Twilio send failed: ${res.status}`);
    }
    const data = (await res.json()) as { sid: string };
    return { id: data.sid };
  }
}

class MockSmsAdapter implements SmsProvider {
  async send(message: SmsMessage): Promise<{ id: string }> {
    // eslint-disable-next-line no-console
    console.log(`[MockSMS] → ${message.to}: ${message.body.slice(0, 80)}…`);
    return { id: `mock_sms_${Date.now()}` };
  }
}

export function createSmsService(): SmsProvider {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    return new TwilioAdapter();
  }
  return new MockSmsAdapter();
}

// ─── Templates ──────────────────────────────────────────────

export const smsTemplates = {
  qualifyIntakeReminder: (name?: string) =>
    `${name ? `Hi ${name}, ` : ""}your Nature's Journey assessment is 60 seconds from a provider review — pick up where you left off: ${process.env.NEXT_PUBLIC_APP_URL || ""}/qualify — Reply STOP to opt out.`,

  shipmentTracking: (name: string, trackingUrl: string) =>
    `${name}, your Nature's Journey medication shipped. Track: ${trackingUrl} — Reply STOP to opt out.`,

  refillReminder: (name: string, daysUntil: number) =>
    `${name}, your refill ships in ${daysUntil} days. Make sure your address and payment are current: ${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard/settings — Reply STOP to opt out.`,

  saveOfferChurnRisk: (name: string) =>
    `${name}, we noticed you haven't logged in lately. Need a hand? Reply HELP for a free coaching check-in or see your plan here: ${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard — Reply STOP to opt out.`,
};
