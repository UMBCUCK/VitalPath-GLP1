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
          <span style="font-weight: 700; font-size: 18px; color: #0E223D;">Nature's Journey</span>
        </div>
      </div>
      ${content}
      <hr style="border: none; border-top: 1px solid #E8EDF4; margin: 32px 0;" />
      <p style="color: #97A5B0; font-size: 12px; text-align: center;">
        Nature's Journey Health | Clinically informed weight management<br/>
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
    subject: "Welcome to Nature's Journey — here's what happens next",
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
    subject: "Getting the most from your Nature's Journey membership",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Hey ${name}, a few tips to get the most out of your plan</h1>
      <p style="font-size: 16px; line-height: 1.6;">Members who engage with tracking and nutrition tools in their first week report higher satisfaction and better outcomes. Here are three things to try today:</p>
      <div style="background: #F7FAF8; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">1. Log your starting weight</p>
        <p style="margin: 0 0 12px; font-weight: 600; color: #0E223D;">2. Set your protein and hydration goals</p>
        <p style="margin: 0; font-weight: 600; color: #0E223D;">3. Browse this week's meal plan</p>
      </div>
      ${ctaButton("Start Tracking", `${APP_URL}/dashboard/progress`)}
      <div style="background: #F0FAF9; border: 1px solid #B2DBD7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #0E223D; font-size: 15px;">💰 Earn while you're on the program</p>
        <p style="margin: 0 0 12px; font-size: 14px; color: #677A8A; line-height: 1.6;">Know someone who's been curious about GLP-1 treatment? Share your referral link and earn <strong>$50 in credit</strong> toward your membership for every friend who signs up.</p>
        <p style="margin: 0; font-size: 12px; color: #97A5B0;">Find your link in the Referrals tab of your dashboard.</p>
      </div>
    `),
  }),

  day7: (name: string) => ({
    subject: "Your first week with Nature's Journey — how's it going?",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">One week in, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">You've been a Nature's Journey member for a week. Whether you've started treatment or are still in the evaluation process, we're here to support you.</p>
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
    <p style="font-size: 16px; line-height: 1.6;">You started a health assessment with Nature's Journey but didn't finish. No worries — your progress is saved, and you can pick up right where you left off.</p>
    <p style="font-size: 16px; line-height: 1.6;">The assessment takes about 2 minutes and helps us understand what kind of support may be right for you. There's no commitment required.</p>
    ${ctaButton("Continue Your Assessment", `${APP_URL}/quiz`)}
    <p style="font-size: 14px; color: #677A8A;">Not ready? That's okay. You can also explore our free health calculators or read more about how our program works.</p>
  `),
});

// ─── Qualify Resume (magic link — fired after qualify abandon) ─
//
// Called from /api/lead/resume (POST) when we want to ping a lead back
// into a partially-completed /qualify flow. The resumeUrl is a signed
// 14-day JWT magic link that deep-links into /qualify?resume=<token>.
export const qualifyResumeEmail = (name: string | undefined, resumeUrl: string) => ({
  subject: name
    ? `${name}, pick up where you left off — 1 click`
    : "Pick up where you left off — 1 click",
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `Hi ${name}, your` : "Your"} assessment is saved</h1>
    <p style="font-size: 16px; line-height: 1.6;">You're already most of the way through. Click below and we'll drop you right back in — your answers are pre-filled, no re-typing.</p>
    <div style="background: #F0FAF9; border: 1px solid #B2DBD7; border-radius: 12px; padding: 18px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #0E223D;"><strong>It takes about 60 seconds to finish.</strong></p>
      <p style="margin: 8px 0 0; font-size: 13px; color: #677A8A;">A licensed provider reviews your profile and determines eligibility — usually within 1 business day.</p>
    </div>
    ${ctaButton("Resume My Assessment", resumeUrl)}
    <p style="font-size: 13px; color: #97A5B0; margin-top: 16px;">This link is unique to you and expires in 14 days. Don't share it.</p>
  `),
});

// ─── Checkout Abandonment (1hr and 24hr after checkout start) ─

export const checkoutAbandonment = {
  hour1: (name?: string) => ({
    subject: "Your plan is ready — complete your membership",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `${name}, your` : "Your"} plan is waiting</h1>
      <p style="font-size: 16px; line-height: 1.6;">You were in the middle of setting up your Nature's Journey membership. Your selected plan and preferences are saved.</p>
      <p style="font-size: 16px; line-height: 1.6;">Complete your subscription now and your provider evaluation can begin today.</p>
      ${ctaButton("Complete Your Membership", `${APP_URL}/pricing`)}
    `),
  }),

  hour24: (name?: string) => ({
    subject: "Questions about Nature's Journey? We're here to help",
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Have questions?</h1>
      <p style="font-size: 16px; line-height: 1.6;">${name ? `Hi ${name}, we` : "We"} noticed you started but didn't complete your Nature's Journey membership. If you have questions about how our program works, pricing, or eligibility, we'd love to help.</p>
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
    <p style="font-size: 14px; color: #677A8A; text-align: center;">Know someone who could benefit from Nature's Journey? Share your referral link and earn credit toward your membership.</p>
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

// ─── Tier 13.8 — OpenLoop magic-link sign-in ─────────────────
//
// Fires from /api/auth/magic-link. The link is a 15-minute signed JWT;
// users are matched against either the local User table OR OpenLoop's
// patient registry via the telehealth adapter. Either way, this email
// is the only outbound surface — keep it tight and recognizable.
export const magicLinkSignInEmail = (
  firstName: string | undefined,
  signInUrl: string,
) => ({
  subject: firstName
    ? `${firstName}, your sign-in link`
    : "Your Nature's Journey sign-in link",
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${firstName ? `Hi ${firstName}, ` : ""}sign in with one click</h1>
    <p style="font-size: 16px; line-height: 1.6;">Click the button below to sign in to your Nature's Journey member dashboard. The link expires in 15 minutes for your security.</p>

    ${ctaButton("Sign in to my dashboard", signInUrl)}

    <p style="font-size: 13px; color: #677A8A; line-height: 1.6;">If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="font-size: 12px; color: #1F6F78; word-break: break-all; line-height: 1.5;">${signInUrl}</p>

    <hr style="border: none; border-top: 1px solid #E8EDF4; margin: 24px 0;" />

    <p style="font-size: 12px; color: #97A5B0; line-height: 1.6;">
      Didn't request this? Ignore this email — your account stays secure.
      Sign-in links can only be used once and can't be reused after they expire.
    </p>
  `),
});

// ─── Tier 11.7 — Cancellation win-back drip ─────────────────
//
// 3-touch win-back sequence for users who fully cancel (not paused).
// Day 3 = empathy + door-open ("we kept your data"); Day 14 = social
// proof of returning members + 25% off welcome-back; Day 30 = last
// chance with a longer credit window. Each fires once per user per
// touch (Notification-tag idempotency in the cron).
export const cancellationWinBack = {
  day3: (name?: string) => ({
    subject: `${name ? `${name}, ` : ""}we kept your data — come back anytime`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `${name}, your` : "Your"} progress is safe with us</h1>
      <p style="font-size: 16px; line-height: 1.6;">No pressure — we just wanted to say thanks for trying Nature's Journey, and let you know your full history (weights, photos, messages, prescription record) is preserved if you ever decide to come back.</p>
      <p style="font-size: 16px; line-height: 1.6;">Reactivating is one click and pulls everything back exactly as you left it.</p>
      ${ctaButton("Reactivate My Plan", `${APP_URL}/dashboard/settings?reactivate=1`)}
      <p style="font-size: 14px; color: #677A8A;">Need something else, or want to talk to a human about what didn&apos;t work? Reply to this email anytime.</p>
    `),
  }),

  day14: (name?: string) => ({
    subject: `${name ? `${name}, ` : ""}25% off if you come back this month`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `${name},` : ""} a one-time welcome-back offer</h1>
      <p style="font-size: 16px; line-height: 1.6;">A lot of members come back within 4–6 weeks after canceling — life gets in the way, then they&apos;re ready again. If that&apos;s you, here&apos;s a real reason to make the move now.</p>
      <div style="background: #FFF8E1; border: 1px solid #F0D88E; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-weight: 700; color: #0E223D; font-size: 16px;">25% off your next 3 months</p>
        <p style="margin: 0 0 12px; font-size: 14px; color: #677A8A;">Code <strong>WELCOMEBACK25</strong> applied automatically when you reactivate. Same provider, same plan, same ongoing care.</p>
        <p style="margin: 0; font-size: 12px; color: #97A5B0;">Code expires 30 days from your cancellation date.</p>
      </div>
      ${ctaButton("Reactivate with 25% off", `${APP_URL}/dashboard/settings?reactivate=1&promo=WELCOMEBACK25`)}
    `),
  }),

  day30: (name?: string) => ({
    subject: `${name ? `${name}, ` : ""}last call: 25% off welcome-back expires soon`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name ? `${name}, your` : "Your"} reactivation discount expires this week</h1>
      <p style="font-size: 16px; line-height: 1.6;">Quick heads-up: the 25%-off welcome-back code we shared 2 weeks ago is on its way out. After it expires, you&apos;ll be back to standard pricing.</p>
      <p style="font-size: 16px; line-height: 1.6;">If you&apos;re still on the fence, the most common reason members come back is dose continuity — picking up where they left off without re-doing the full intake.</p>
      ${ctaButton("Reactivate before code expires", `${APP_URL}/dashboard/settings?reactivate=1&promo=WELCOMEBACK25`)}
      <p style="font-size: 13px; color: #97A5B0;">After 30 days from cancellation, this code stops working. After 60 days, your data archives but stays restorable on request.</p>
    `),
  }),
};

// ─── Tier 9.3 — Post-pause re-engagement ─────────────────────
//
// Fires 2 days before a paused subscription auto-resumes. Gives the
// member a heads-up about incoming billing + a quick toggle to extend
// the pause if life is still busy. Prevents involuntary churn from
// "oh no, I forgot I was paused" reactions when the first post-pause
// invoice lands.
export const postPauseReengagement = (name: string, resumeDate: Date) => {
  const resumeStr = resumeDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return {
    subject: `${name}, your plan resumes ${resumeDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ready?`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">${name}, your plan resumes ${resumeStr}</h1>
      <p style="font-size: 16px; line-height: 1.6;">We're giving you a heads up a couple days early. Your membership will automatically resume on ${resumeStr}, and billing will pick back up on your existing payment method.</p>

      <div style="background: #F0FAF9; border: 1px solid #B2DBD7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 10px; font-weight: 700; color: #0E223D; font-size: 15px;">Not ready yet? Two easy options:</p>
        <p style="margin: 0 0 8px; font-size: 14px; color: #2E3742;"><strong>1.</strong> Extend the pause up to 3 months total — no charge until you&apos;re back.</p>
        <p style="margin: 0; font-size: 14px; color: #2E3742;"><strong>2.</strong> Downgrade to Essential ($179/mo) while you figure it out.</p>
      </div>

      ${ctaButton("Manage My Plan", `${APP_URL}/dashboard/settings`)}

      <p style="font-size: 14px; color: #677A8A; line-height: 1.6; margin-top: 20px;">If the timing works and you want to resume as-is, no action needed — we'll see you ${resumeStr}. Welcome back.</p>

      <p style="font-size: 12px; color: #97A5B0; margin-top: 16px;">Questions? Reply to this email and our care team will respond within 24 hours.</p>
    `),
  };
};

// ─── Tier 9.7 — First-month drip (days 14 and 21) ───────────
//
// Extends the existing welcomeSequence (day 0/3/7) with two more emails
// during the critical adherence window. Day 14 is the "results forming"
// moment; day 21 is the "habit is locked in" moment where tracking
// compliance starts to predict long-term retention.
export const firstMonthDrip = {
  day14: (name: string) => ({
    subject: `${name}, two weeks in — here's what your body is doing`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Two weeks in, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">By day 14 on GLP-1 therapy, most members notice real changes: food noise quiets down, portions naturally shrink, and the first pounds start to shift. If you're not feeling it yet — that's normal too. Titration is individualized.</p>

      <div style="background: #F7FAF8; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 12px; font-weight: 700; color: #0E223D;">Things working members are doing at day 14:</p>
        <ul style="font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0; color: #2E3742;">
          <li><strong>Protein first</strong> — hitting 100g+/day preserves lean mass</li>
          <li><strong>Hydration</strong> — 80+ oz keeps side effects at bay</li>
          <li><strong>Walking 20 min/day</strong> — amplifies medication outcomes</li>
          <li><strong>Weekly weigh-in</strong> — daily fluctuations are meaningless; weekly trend matters</li>
        </ul>
      </div>

      ${ctaButton("Log today's progress", `${APP_URL}/dashboard/progress`)}

      <p style="font-size: 14px; color: #677A8A;">Any side effects nagging you? Message your care team from the dashboard — dose timing adjustments fix 80% of issues.</p>
    `),
  }),

  day21: (name: string) => ({
    subject: `${name}, three weeks — you're building the habit that sticks`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Three weeks strong, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">Day 21 is the tipping point where behavior starts feeling automatic. You&apos;re past the "new and novel" phase. What you're doing now is who you're becoming.</p>

      <p style="font-size: 16px; line-height: 1.6;">Two things most successful members do at this stage:</p>

      <div style="background: #F7FAF8; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-weight: 700; color: #0E223D;">1. Share your progress</p>
        <p style="margin: 0 0 16px; font-size: 14px; color: #677A8A;">Members who refer a friend in month 1 have 40% higher adherence at month 6. Social accountability is real. Plus, you earn $50 per successful referral.</p>
        <p style="margin: 0 0 8px; font-weight: 700; color: #0E223D;">2. Pre-plan your month-2 dose review</p>
        <p style="margin: 0; font-size: 14px; color: #677A8A;">Your first dose adjustment comes up around day 28. Message your care team now if you've noticed any side-effect patterns so they can optimize before titrating.</p>
      </div>

      ${ctaButton("Invite a friend, earn $50", `${APP_URL}/dashboard/referrals`)}

      <p style="font-size: 14px; color: #677A8A;">Keep stacking days. The next 3 weeks are where the compounding really kicks in.</p>
    `),
  }),
};

// ─── Tier 3.7 — Peptide Intro (day 30 after activation) ─────
//
// Fires for active members who have been on their GLP-1 treatment for 30+
// days and don't yet have any HEALTHY_AGING add-on. The top peptide offer
// is typically selected by evaluateUpsells() from lib/upsell-engine.ts and
// passed in as `recommendation` for personalization.
export const peptideIntroEmail = (
  name: string,
  recommendation?: { productName: string; headline: string; description: string; priceMonthly?: number },
) => {
  const recName = recommendation?.productName ?? "BPC-157 Recovery";
  const recHeadline = recommendation?.headline ?? "Add provider-supervised recovery support";
  const recDesc =
    recommendation?.description ??
    "BPC-157 is a body-protective compound that many GLP-1 members add at month 1 for digestive comfort and soft-tissue recovery.";
  const recPrice = recommendation?.priceMonthly ? Math.round(recommendation.priceMonthly / 100) : 129;

  return {
    subject: `${name}, a month in — ready to layer in recovery support?`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">You've hit the 30-day mark, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">Your body has adapted to GLP-1 therapy. Many members at this stage add a peptide protocol to support recovery, energy, or anti-aging — prescribed by the same provider, shipped from the same pharmacy.</p>

      <div style="background: #F0FAF9; border: 1px solid #B2DBD7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 6px; font-weight: 700; color: #0E223D; font-size: 16px;">${recHeadline}</p>
        <p style="margin: 0 0 12px; font-size: 14px; color: #677A8A; line-height: 1.6;">${recDesc}</p>
        <p style="margin: 0; font-size: 14px; color: #0E223D;"><strong>${recName}</strong> — from <strong>$${recPrice}/mo</strong></p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #677A8A;">Other popular options at this stage:</p>
      <ul style="font-size: 14px; line-height: 1.8; padding-left: 20px; color: #2E3742;">
        <li><strong>NAD+ Injection</strong> — cellular energy & mental clarity ($149/mo)</li>
        <li><strong>Glow Stack</strong> — skin, hair, and nail support on rapid weight loss ($89/mo)</li>
        <li><strong>Sermorelin</strong> — sleep quality and overnight recovery ($199/mo)</li>
      </ul>

      ${ctaButton("Browse Peptide Therapy →", `${APP_URL}/dashboard/shop`)}

      <p style="font-size: 12px; color: #97A5B0; line-height: 1.5; margin-top: 20px;">
        Eligibility, protocol, and dosing determined by your licensed provider based on your individual health profile. Compounded peptides are not FDA-approved products — they are prepared by state-licensed compounding pharmacies under individual prescription. You can add, pause, or cancel any add-on anytime from your dashboard.
      </p>
    `),
  };
};

// ─── Referral Invite Reminder (48hr after invite, not yet converted) ─

export const referralInviteReminder = (inviterName: string, referralLink: string) => ({
  subject: `${inviterName} thinks you'd love Nature's Journey`,
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">A personal invite from ${inviterName}</h1>
    <p style="font-size: 16px; line-height: 1.6;">
      ${inviterName} is on Nature's Journey — a medically supervised GLP-1 weight loss program — and wanted to share it with you.
    </p>
    <div style="background: #F0FAF9; border: 1px solid #B2DBD7; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #0E223D;">What is Nature's Journey?</p>
      <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0;">
        <li>Medically supervised GLP-1 treatment (semaglutide)</li>
        <li>Licensed provider assigned within 24 hours</li>
        <li>Medication shipped discreetly to your door</li>
        <li>Progress tracking, meal planning, and care team support</li>
      </ul>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: #677A8A;">
      Start with a free eligibility check — no commitment required.
    </p>
    ${ctaButton("Check Your Eligibility →", referralLink)}
    <p style="font-size: 12px; color: #97A5B0; text-align: center;">
      You received this because ${inviterName} invited you. If you'd prefer not to receive referral invites, simply ignore this email.
    </p>
  `),
});

// ─── Weekly Progress Summary ───────────────────────────────

export interface WeeklyProgressData {
  name: string;
  streak: number;
  logsThisWeek: number;
  weightChange: number | null;
  totalLost: number;
  percentToGoal: number;
  nextMilestone: number;
  tipOfWeek: string;
}

export const weeklyProgressEmail = (data: WeeklyProgressData) => ({
  subject: `Your week in review${data.weightChange && data.weightChange < 0 ? ` — down ${Math.abs(data.weightChange).toFixed(1)} lbs!` : ""}`,
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">
      Your weekly summary, ${data.name}
    </h1>

    <div style="background: linear-gradient(135deg, #F0FAF9 0%, #E8F4F8 100%); border-radius: 12px; padding: 24px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="text-align: center; padding: 8px;">
            <p style="font-size: 28px; font-weight: 700; color: #0E223D; margin: 0;">${data.streak}</p>
            <p style="font-size: 12px; color: #677A8A; margin: 4px 0 0;">Day streak</p>
          </td>
          <td style="text-align: center; padding: 8px;">
            <p style="font-size: 28px; font-weight: 700; color: #1F6F78; margin: 0;">${data.logsThisWeek}/7</p>
            <p style="font-size: 12px; color: #677A8A; margin: 4px 0 0;">Days logged</p>
          </td>
          <td style="text-align: center; padding: 8px;">
            <p style="font-size: 28px; font-weight: 700; color: ${data.weightChange && data.weightChange <= 0 ? "#059669" : "#0E223D"}; margin: 0;">
              ${data.weightChange !== null ? (data.weightChange <= 0 ? `−${Math.abs(data.weightChange).toFixed(1)}` : `+${data.weightChange.toFixed(1)}`) : "—"}
            </p>
            <p style="font-size: 12px; color: #677A8A; margin: 4px 0 0;">Lbs this week</p>
          </td>
        </tr>
      </table>
    </div>

    ${data.totalLost > 0 ? `
    <div style="margin: 20px 0;">
      <p style="font-size: 14px; color: #677A8A; margin: 0 0 8px;">Progress to goal</p>
      <div style="background: #E5E7EB; border-radius: 8px; height: 12px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #1F6F78, #163A63); height: 100%; width: ${Math.min(data.percentToGoal, 100)}%; border-radius: 8px;"></div>
      </div>
      <p style="font-size: 12px; color: #677A8A; margin: 6px 0 0;">
        ${data.totalLost.toFixed(1)} lbs lost total &middot; ${data.nextMilestone > 0 ? `${data.nextMilestone} lbs to next milestone` : "Goal reached!"}
      </p>
    </div>
    ` : ""}

    <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="font-weight: 600; color: #0E223D; margin: 0 0 4px; font-size: 14px;">💡 Tip of the week</p>
      <p style="font-size: 14px; color: #677A8A; margin: 0; line-height: 1.5;">${data.tipOfWeek}</p>
    </div>

    ${ctaButton("View Full Dashboard", `${APP_URL}/dashboard`)}

    <p style="font-size: 12px; color: #97A5B0; text-align: center;">
      Keep it up! Consistency beats perfection every time.
    </p>
  `),
});

// ─── Win-Back Discount Ladder (30/60/90 day escalation) ────

export const winBackLadder = {
  day30: (name: string) => ({
    subject: `${name}, we saved your spot — 20% off to come back`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">We miss you, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">It&rsquo;s been a month since we last saw you. Your progress data and care team are still here, ready when you are.</p>
      <div style="background: linear-gradient(135deg, #F0FAF9, #E8F4F8); border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
        <p style="font-size: 14px; color: #677A8A; margin: 0 0 8px;">Welcome-back offer</p>
        <p style="font-size: 36px; font-weight: 700; color: #0E223D; margin: 0;">20% off</p>
        <p style="font-size: 14px; color: #677A8A; margin: 8px 0 0;">your first month back</p>
        <p style="font-size: 16px; font-weight: 600; color: #0E223D; margin: 12px 0 0;">Use code <span style="background: #E8EDF4; padding: 4px 12px; border-radius: 6px;">WELCOME20</span></p>
      </div>
      ${ctaButton("Reactivate My Plan", `${APP_URL}/pricing`)}
      <p style="font-size: 12px; color: #97A5B0; text-align: center;">Offer expires in 7 days.</p>
    `),
  }),

  day60: (name: string) => ({
    subject: `${name}, your best offer yet — 30% off to restart`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">It&rsquo;s not too late, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">Two months ago, you were building something real. Your weight loss journey doesn&rsquo;t have to start over &mdash; pick up right where you left off.</p>
      <div style="background: linear-gradient(135deg, #0E223D, #163A63); border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center; color: white;">
        <p style="font-size: 14px; opacity: 0.7; margin: 0 0 8px;">Exclusive comeback offer</p>
        <p style="font-size: 42px; font-weight: 700; margin: 0;">30% off</p>
        <p style="font-size: 14px; opacity: 0.7; margin: 8px 0 0;">your first month back</p>
        <p style="font-size: 16px; font-weight: 600; margin: 12px 0 0;">Code: <span style="background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 6px;">COMEBACK30</span></p>
      </div>
      ${ctaButton("Claim 30% Off", `${APP_URL}/pricing`)}
      <p style="font-size: 12px; color: #97A5B0; text-align: center;">Limited time &mdash; this is our best offer for returning members.</p>
    `),
  }),

  day90: (name: string, totalLost: number) => ({
    subject: `${name}, last chance: 40% off + we preserved your ${totalLost}lb progress`,
    html: baseTemplate(`
      <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">Your progress is still here, ${name}</h1>
      <p style="font-size: 16px; line-height: 1.6;">Three months ago, you${totalLost > 0 ? ` had already lost ${totalLost} lbs` : " started your journey"}. All of that data, all of those insights &mdash; they&rsquo;re waiting for you.</p>
      <p style="font-size: 16px; line-height: 1.6;">This is our final and best offer for returning members:</p>
      <div style="background: linear-gradient(135deg, #D4A853, #B8913D); border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center; color: white;">
        <p style="font-size: 14px; opacity: 0.8; margin: 0 0 8px;">Final comeback offer</p>
        <p style="font-size: 48px; font-weight: 700; margin: 0;">40% off</p>
        <p style="font-size: 14px; opacity: 0.8; margin: 8px 0 0;">your first month back</p>
        <p style="font-size: 16px; font-weight: 600; margin: 12px 0 0;">Code: <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 6px;">LASTCHANCE40</span></p>
      </div>
      ${ctaButton("Reclaim My Spot — 40% Off", `${APP_URL}/pricing`)}
      <p style="font-size: 12px; color: #97A5B0; text-align: center;">After this, we&rsquo;ll stop reaching out. Your data will be preserved for 12 months.</p>
    `),
  }),
};

// ─── Annual Plan Push (sent to monthly subscribers at month 3) ─

export const annualPlanPush = (name: string, currentMonthly: number, annualMonthly: number, totalSavings: number) => ({
  subject: `${name}, lock in your rate and save $${totalSavings}`,
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">You&rsquo;re seeing results, ${name}. Lock them in.</h1>
    <p style="font-size: 16px; line-height: 1.6;">You&rsquo;ve been a Nature&rsquo;s Journey member for 3 months. Members who commit to annual billing save an average of 20% and are 40% more likely to reach their goal weight.</p>

    <div style="display: flex; gap: 16px; margin: 24px 0;">
      <div style="flex: 1; background: #F8F9FA; border-radius: 12px; padding: 20px; text-align: center;">
        <p style="font-size: 12px; color: #677A8A; margin: 0;">Current (monthly)</p>
        <p style="font-size: 24px; font-weight: 700; color: #97A5B0; margin: 8px 0 0; text-decoration: line-through;">$${currentMonthly}/mo</p>
      </div>
      <div style="flex: 1; background: #F0FAF9; border: 2px solid #1F6F78; border-radius: 12px; padding: 20px; text-align: center;">
        <p style="font-size: 12px; color: #1F6F78; margin: 0;">Annual (save 20%)</p>
        <p style="font-size: 24px; font-weight: 700; color: #1F6F78; margin: 8px 0 0;">$${annualMonthly}/mo</p>
      </div>
    </div>

    <div style="background: #F7FAF8; border-radius: 12px; padding: 16px; margin: 16px 0; text-align: center;">
      <p style="font-size: 14px; color: #677A8A; margin: 0;">That&rsquo;s</p>
      <p style="font-size: 32px; font-weight: 700; color: #0E223D; margin: 4px 0;">$${totalSavings} saved</p>
      <p style="font-size: 14px; color: #677A8A; margin: 0;">over the next 12 months</p>
    </div>

    ${ctaButton("Switch to Annual & Save", `${APP_URL}/dashboard/settings`)}
    <p style="font-size: 12px; color: #97A5B0; text-align: center;">You can switch from your dashboard anytime. Pro-rated billing applies.</p>
  `),
});

// ─── Smart Upsell (Day 3-5 for active users without meal plans) ─

export const smartMealPlanUpsell = (name: string, logsThisWeek: number) => ({
  subject: `${name}, members who add meal plans lose 2x more — here's 25% off`,
  html: baseTemplate(`
    <h1 style="color: #0E223D; font-size: 24px; margin-bottom: 16px;">You're off to a great start, ${name}</h1>
    <p style="font-size: 16px; line-height: 1.6;">
      You've logged ${logsThisWeek} day${logsThisWeek !== 1 ? "s" : ""} this week already.
      Members who add meal plans at this stage see <strong>2x better adherence</strong> to their treatment.
    </p>
    <p style="font-size: 16px; line-height: 1.6;">
      Our GLP-1-optimized meal plans are designed to work with your changing appetite — high-protein,
      easy to prepare, with grocery lists that save you time.
    </p>
    <div style="background: linear-gradient(135deg, #FFF8EB, #FFF1D6); border: 2px solid #D4A853; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="font-size: 14px; color: #8B6914; margin: 0 0 8px;">Limited-time member offer</p>
      <p style="font-size: 32px; font-weight: 700; color: #0E223D; margin: 0;">25% off meal plans</p>
      <p style="font-size: 14px; color: #677A8A; margin: 8px 0 0;">Your first 3 months at $14.25/mo instead of $19/mo</p>
    </div>
    ${ctaButton("Add Meal Plans — 25% Off", `${APP_URL}/dashboard/meals`)}
    <p style="font-size: 12px; color: #97A5B0; text-align: center;">Offer valid for 48 hours. Regular price $19/mo after promotional period.</p>
  `),
});

// ─── Churn Risk Alert (internal, sent to care team) ─────────

export const churnRiskAlert = (patientName: string, patientEmail: string, riskScore: number, reasons: string[]) => ({
  subject: `[Churn Alert] ${patientName} — Risk Score ${riskScore}/100`,
  html: baseTemplate(`
    <div style="background: ${riskScore >= 80 ? "#FEF2F2" : riskScore >= 60 ? "#FFFBEB" : "#F0FDF4"}; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <p style="font-size: 14px; font-weight: 600; color: ${riskScore >= 80 ? "#DC2626" : riskScore >= 60 ? "#D97706" : "#059669"}; margin: 0;">
        ${riskScore >= 80 ? "HIGH RISK" : riskScore >= 60 ? "MEDIUM RISK" : "LOW RISK"} — Score: ${riskScore}/100
      </p>
    </div>
    <h1 style="color: #0E223D; font-size: 20px; margin-bottom: 12px;">Churn Risk: ${patientName}</h1>
    <p style="font-size: 14px; color: #677A8A;">Email: ${patientEmail}</p>
    <h3 style="color: #0E223D; font-size: 16px; margin: 20px 0 8px;">Risk Factors:</h3>
    <ul style="font-size: 14px; line-height: 1.8; padding-left: 20px; color: #2E3742;">
      ${reasons.map((r) => `<li>${r}</li>`).join("")}
    </ul>
    <h3 style="color: #0E223D; font-size: 16px; margin: 20px 0 8px;">Recommended Actions:</h3>
    <ul style="font-size: 14px; line-height: 1.8; padding-left: 20px; color: #2E3742;">
      ${riskScore >= 80 ? `
        <li>Send personal outreach from care team within 24 hours</li>
        <li>Offer complimentary coaching session</li>
        <li>Review medication dosage — may need adjustment</li>
      ` : riskScore >= 60 ? `
        <li>Trigger automated check-in notification</li>
        <li>Send engagement nudge with progress summary</li>
        <li>Highlight upcoming milestone to re-motivate</li>
      ` : `
        <li>Continue standard engagement cadence</li>
        <li>Monitor for changes in next weekly cycle</li>
      `}
    </ul>
    ${ctaButton("View Patient Profile", `${APP_URL}/admin/customers`)}
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

// ─── Tier 3.7 trigger — fires peptide intro email for one user ─
//
// Intended to be called from a day-30 cron or a webhook handler that
// receives "30 days since activation" events. Uses the upsell engine
// to personalize the recommended peptide based on the user's state,
// then renders peptideIntroEmail and sends via the configured provider.
//
// Safe to call for any user — if they aren't eligible for a peptide
// (e.g. already have one, not yet 30 days in), the engine returns no
// peptide suggestions and we skip sending.
export async function sendPeptideIntro(userId: string): Promise<{ sent: boolean; reason?: string }> {
  // Lazy-imported to avoid pulling prisma into cold-start paths that don't need it
  const [{ evaluateUpsells }, { db }] = await Promise.all([
    import("@/lib/upsell-engine"),
    import("@/lib/db"),
  ]);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, firstName: true },
  });
  if (!user?.email) return { sent: false, reason: "no_user_email" };

  const suggestions = await evaluateUpsells(userId);
  // Only peptide rules — see lib/upsell-engine.ts
  const peptideSlugs = ["bpc-157", "nad-plus", "sermorelin", "ipamorelin-cjc", "glow-stack", "thymosin-beta-4"];
  const peptideSuggestion = suggestions.find((s) => peptideSlugs.includes(s.productSlug));
  if (!peptideSuggestion) return { sent: false, reason: "no_peptide_suggestion" };

  // Enrich with current price from the product catalog
  const product = await db.product.findUnique({
    where: { slug: peptideSuggestion.productSlug },
    select: { priceMonthly: true },
  });

  const template = peptideIntroEmail(user.firstName || "there", {
    productName: peptideSuggestion.productName,
    headline: peptideSuggestion.headline,
    description: peptideSuggestion.description,
    priceMonthly: product?.priceMonthly,
  });

  await sendLifecycleEmail(user.email, template, ["peptide-intro-day30"]);
  return { sent: true };
}
