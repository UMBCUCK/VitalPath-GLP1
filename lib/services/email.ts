/**
 * Email service abstraction layer.
 * Uses Resend by default, swappable to SendGrid, Postmark, etc.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: string[];
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ id: string }>;
  sendBatch(messages: EmailMessage[]): Promise<{ ids: string[] }>;
}

class ResendAdapter implements EmailProvider {
  private apiKey: string;
  private from: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || "";
    this.from = process.env.EMAIL_FROM || "care@naturesjourneyhealth.com";
  }

  async send(message: EmailMessage): Promise<{ id: string }> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: this.from,
        ...message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend send failed: ${response.status}`);
    }

    const result = await response.json();
    return { id: result.id };
  }

  async sendBatch(messages: EmailMessage[]): Promise<{ ids: string[] }> {
    const results = await Promise.all(messages.map((msg) => this.send(msg)));
    return { ids: results.map((r) => r.id) };
  }
}

class MockEmailAdapter implements EmailProvider {
  async send(message: EmailMessage): Promise<{ id: string }> {
    console.log("[MockEmail] Sending:", message.to, message.subject);
    return { id: `mock_email_${Date.now()}` };
  }

  async sendBatch(messages: EmailMessage[]): Promise<{ ids: string[] }> {
    console.log("[MockEmail] Sending batch:", messages.length);
    return { ids: messages.map((_, i) => `mock_email_${Date.now()}_${i}`) };
  }
}

export function createEmailService(): EmailProvider {
  if (process.env.RESEND_API_KEY) {
    return new ResendAdapter();
  }
  return new MockEmailAdapter();
}

// ─── Email templates ────────────────────────────────────────

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to Nature's Journey",
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0E223D; font-size: 28px; margin: 0;">Welcome to Nature's Journey</h1>
        </div>
        <p style="color: #2E3742; font-size: 16px; line-height: 1.6;">
          Hi ${name},
        </p>
        <p style="color: #2E3742; font-size: 16px; line-height: 1.6;">
          Thank you for starting your journey with us. Your intake is being reviewed by a licensed provider, and we'll be in touch within 24 hours with your next steps.
        </p>
        <p style="color: #2E3742; font-size: 16px; line-height: 1.6;">
          In the meantime, you can explore your dashboard to set up your profile, review meal planning options, and check out the tools available to support your program.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #1F6F78; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Visit Your Dashboard
          </a>
        </div>
        <p style="color: #677A8A; font-size: 14px; line-height: 1.5;">
          Questions? Reply to this email or message your care team from your dashboard.
        </p>
        <hr style="border: none; border-top: 1px solid #E8EDF4; margin: 32px 0;" />
        <p style="color: #97A5B0; font-size: 12px; text-align: center;">
          Nature's Journey Health | Clinically informed weight management
        </p>
      </div>
    `,
  }),

  refillReminder: (name: string, daysUntil: number) => ({
    subject: `Your refill ships in ${daysUntil} days`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #0E223D; font-size: 24px;">Refill Reminder</h1>
        <p style="color: #2E3742; font-size: 16px; line-height: 1.6;">
          Hi ${name}, your next refill is scheduled to ship in ${daysUntil} days. Make sure your shipping address and payment method are up to date.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/treatment" style="background-color: #1F6F78; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">
            Review Your Plan
          </a>
        </div>
      </div>
    `,
  }),

  referralConverted: (name: string, referredEmail: string, payoutCents: number, totalEarned: number) => ({
    subject: `🎉 You earned $${(payoutCents / 100).toFixed(2)} — referral converted!`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #0E223D 0%, #1F6F78 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
          <h1 style="color: white; font-size: 26px; margin: 0 0 8px;">You just earned $${(payoutCents / 100).toFixed(2)}!</h1>
          <p style="color: rgba(255,255,255,0.75); font-size: 15px; margin: 0;">Someone you referred has signed up for Nature's Journey.</p>
        </div>
        <p style="color: #2E3742; font-size: 16px; line-height: 1.6;">
          Hi ${name},
        </p>
        <p style="color: #2E3742; font-size: 16px; line-height: 1.6;">
          Great news — <strong>${referredEmail}</strong> just completed their checkout using your referral link. You've earned <strong>$${(payoutCents / 100).toFixed(2)}</strong> in referral credit.
        </p>
        <div style="background: #f0faf9; border: 1px solid #b2dbd7; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="color: #0E223D; font-size: 14px; margin: 0 0 8px; font-weight: 600;">Your Earnings Summary</p>
          <div style="display: flex; justify-content: space-between; color: #2E3742; font-size: 15px;">
            <span>This referral:</span>
            <strong>$${(payoutCents / 100).toFixed(2)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: #2E3742; font-size: 15px; margin-top: 6px;">
            <span>Total earned:</span>
            <strong>$${(totalEarned / 100).toFixed(2)}</strong>
          </div>
        </div>
        <p style="color: #2E3742; font-size: 15px; line-height: 1.6;">
          Keep sharing your link — the more you refer, the higher your tier and the more you earn per referral.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referrals" style="background-color: #1F6F78; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
            View Your Earnings
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #E8EDF4; margin: 32px 0;" />
        <p style="color: #97A5B0; font-size: 12px; text-align: center;">
          Nature's Journey Health | Referral Program
        </p>
      </div>
    `,
  }),
};
