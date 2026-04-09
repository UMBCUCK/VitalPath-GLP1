/**
 * Email lifecycle system.
 * Defines all automated email flows with templates and trigger logic.
 */

import { createEmailService } from "./email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

// ─── Template helpers ───────────────────────────────────────

function baseTemplate(content: string) {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #2E3742;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #1F6F78, #163A63); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: 700; font-size: 12px;">VP</span>
          </div>
          <span style="font-weight: 700; font-size: 18px; color: #0E223D;">VitalPath</span>
        </div>
      </div>
      ${content}
      <hr style="border: none; border-top: 1px solid #E8EDF4; margin: 32px 0;" />
      <p style="color: #97A5B0; font-size: 12px; text-align: center;">
        VitalPath Health | Clinically informed weight management<br/>
        <a href="${APP_URL}/legal/privacy" style="color: #97A5B0;">Privacy Policy</a> &middot;
        <a href="${APP_URL}/dashboard/settings" style="color: #97A5B0;">Manage Preferences</a>
      </p>
    </div>
  `;
}

function ctaButton(text: string, href: string) {
  return `<div style="text-align: center; margin: 24px 0;">
    <a href="${href}" style="background-color: #1F6F78; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">${text}</a>
  </div>`;
}

// ─── Welcome Sequence (3 emails over 7 days) ────────────────

export const welcomeSequence = {
  day0: (name: string) => ({
    subject: "Welcome to VitalPath — here's what happens next",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Welcome, ${name}!</h1>
      <p style="font-size: 16px; line-height: 1.6;">Thank you for starting your journey with us. Your intake is being reviewed by a licensed provider, and we'll be in touch within 24 hours with your next steps.</p>
      <p style="font-size: 16px; line-height: 1.6;">In the meantime, here's what you can do:</p>
      <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
        <li>Set up your profile and goals in your dashboard</li>
        <li>Explore the meal planning and recipe tools</li>
        <li>Try our health calculators (BMI, TDEE, protein, hydration)</li>
        <li>Read about what to expect in your first week</li>
      </ul>
      ${ctaButton("Visit Your Dashboard", `${APP_URL}/dashboard`)}
      <p style="font-size: 14px; color: #677A8A;">Questions? Simply reply to this email or message your care team from your dashboard.</p>
    `),
  }),

  day3: (name: string) => ({
    subject: "Getting the most from your VitalPath membership",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Hey ${name}, a few tips to get the most out of your plan</h1>
      <p style="font-size: 16px; line-height: 1.6;">Members who engage with tracking and nutrition tools in their first week report higher satisfaction and better outcomes. Here are three things to try today:</p>
      <div style="background: #F7FAF8; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">1. Log your starting weight</p>
        <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">2. Set your protein and hydration goals</p>
        <p style="margin: 0; font-weight: 600; color: #0E223D;">3. Browse this week's meal plan</p>
      </div>
      ${ctaButton("Start Tracking", `${APP_URL}/dashboard/progress`)}
    `),
  }),

  day7: (name: string) => ({
    subject: "Your first week with VitalPath — how's it going?",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">One week in, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">You've been a VitalPath member for a week. Whether you've started treatment or are still in the evaluation process, we're here to support you.</p>
      <p style="font-size: 16px; line-height: 1.6;">Remember: consistency matters more than perfection. Even small daily actions — logging your water intake, tracking protein, checking in — compound into real results over time.</p>
      <p style="font-size: 16px; line-height: 1.6;">If you have questions about your treatment plan, your care team is always available through secure messaging.</p>
      ${ctaButton("Message Your Care Team", `${APP_URL}/dashboard/messages`)}
    `),
  }),
};

// ─── Quiz Abandonment (24hr after quiz start, no completion) ─

export const quizAbandonment = (name?: string) => ({
  subject: "Still thinking about it? Your assessment is saved",
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `Hi ${name}` : "Hi there"}, your assessment is waiting</h1>
    <p style="font-size: 16px; line-height: 1.6;">You started a health assessment with VitalPath but didn't finish. No worries — your progress is saved, and you can pick up right where you left off.</p>
    <p style="font-size: 16px; line-height: 1.6;">The assessment takes about 2 minutes and helps us understand what kind of support may be right for you. There's no commitment required.</p>
    ${ctaButton("Continue Your Assessment", `${APP_URL}/quiz`)}
    <p style="font-size: 14px; color: #677A8A;">Not ready? That's okay. You can also explore our free health calculators or read more about how our program works.</p>
  `),
});

// ─── Checkout Abandonment (1hr and 24hr after checkout start) ─

export const checkoutAbandonment = {
  hour1: (name?: string) => ({
    subject: "Your plan is ready — complete your membership",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `${name}, your` : "Your"} plan is waiting</h1>
      <p style="font-size: 16px; line-height: 1.6;">You were in the middle of setting up your VitalPath membership. Your selected plan and preferences are saved.</p>
      <p style="font-size: 16px; line-height: 1.6;">Complete your subscription now and your provider evaluation can begin today.</p>
      ${ctaButton("Complete Your Membership", `${APP_URL}/pricing`)}
    `),
  }),

  hour24: (name?: string) => ({
    subject: "Questions about VitalPath? We're here to help",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Have questions?</h1>
      <p style="font-size: 16px; line-height: 1.6;">${name ? `Hi ${name}, we` : "We"} noticed you started but didn't complete your VitalPath membership. If you have questions about how our program works, pricing, or eligibility, we'd love to help.</p>
      <p style="font-size: 16px; line-height: 1.6;">Common questions members had before joining:</p>
      <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
        <li>What if I'm not eligible for medication?</li>
        <li>How quickly does medication ship?</li>
        <li>Can I cancel anytime?</li>
      </ul>
      ${ctaButton("Read Our FAQ", `${APP_URL}/faq`)}
      <p style="font-size: 14px; color: #677A8A;">Reply to this email anytime and our team will get back to you within 24 hours.</p>
    `),
  }),
};

// ─── Refill Reminder (7 days before next refill) ────────────

export const refillReminder = (name: string, daysUntil: number) => ({
  subject: `Your refill ships in ${daysUntil} days`,
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Refill reminder</h1>
    <p style="font-size: 16px; line-height: 1.6;">Hi ${name}, your next medication refill is scheduled to ship in ${daysUntil} days.</p>
    <div style="background: #F7FAF8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #677A8A;">Quick checklist before your refill:</p>
      <ul style="font-size: 14px; line-height: 1.8; padding-left: 20px; margin-top: 8px;">
        <li>Shipping address is up to date</li>
        <li>Payment method is current</li>
        <li>No dose change requests pending</li>
      </ul>
    </div>
    ${ctaButton("Review Your Plan", `${APP_URL}/dashboard/treatment`)}
    <p style="font-size: 14px; color: #677A8A;">Need to make changes? Message your care team from your dashboard before your refill ships.</p>
  `),
});

// ─── Milestone Congratulations ──────────────────────────────

export const milestoneCongrats = (name: string, milestone: string) => ({
  subject: `${name}, you've reached a milestone!`,
  html: baseTemplate(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 48px;">🎉</div>
    </div>
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px; text-align: center;">Congratulations, ${name}!</h1>
    <p style="font-size: 16px; line-height: 1.6; text-align: center;">${milestone}</p>
    <p style="font-size: 16px; line-height: 1.6; text-align: center;">Every milestone matters. This is real progress, built on your consistency and the structured support around you. Keep building momentum.</p>
    ${ctaButton("View Your Progress", `${APP_URL}/dashboard/progress`)}
    <p style="font-size: 14px; color: #677A8A; text-align: center;">Know someone who could benefit from VitalPath? Share your referral link and earn credit toward your membership.</p>
  `),
});

// ─── Cancellation Save Offer ────────────────────────────────

export const cancellationSaveOffer = (name: string) => ({
  subject: `${name}, we'd love to keep you`,
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">We noticed you're thinking about leaving</h1>
    <p style="font-size: 16px; line-height: 1.6;">Hi ${name}, we understand that circumstances change. Before you go, we wanted to make sure you know about a few options:</p>
    <div style="background: #F7FAF8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">Pause your plan</p>
      <p style="margin: 0 0 16px; font-size: 14px; color: #677A8A;">Take a break for up to 3 months. Your data and progress stay saved.</p>
      <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">Downgrade your plan</p>
      <p style="margin: 0 0 16px; font-size: 14px; color: #677A8A;">Switch to a lower tier while keeping the features you use most.</p>
      <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">Talk to us</p>
      <p style="margin: 0; font-size: 14px; color: #677A8A;">If something isn't working, let us know. We'd rather fix it than lose you.</p>
    </div>
    ${ctaButton("Explore Your Options", `${APP_URL}/dashboard/settings`)}
    <p style="font-size: 14px; color: #677A8A;">Reply to this email anytime and our support team will help you find the best path forward.</p>
  `),
});

// ─── Send function ──────────────────────────────────────────

export async function sendLifecycleEmail(
  to: string,
  template: { subject: string; html: string },
  tags?: string[]
) {
  const emailService = createEmailService();
  return emailService.send({
    to,
    subject: template.subject,
    html: template.html,
    tags,
  });
}
