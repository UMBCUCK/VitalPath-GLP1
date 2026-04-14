/**
 * Analytics event architecture.
 * Unified tracking layer that fans out to PostHog, GA4, and Meta CAPI.
 */
import { safeLog } from "@/lib/logger";

type EventProperties = Record<string, string | number | boolean | null | undefined>;

// ─── Event definitions ──────────────────────────────────────

export const ANALYTICS_EVENTS = {
  // Landing & Navigation
  PAGE_VIEW: "page_view",
  CTA_CLICK: "cta_click",
  NAV_CLICK: "nav_click",

  // Quiz & Funnel
  QUIZ_START: "quiz_start",
  QUIZ_STEP_COMPLETE: "quiz_step_complete",
  QUIZ_COMPLETE: "quiz_complete",
  QUIZ_ABANDON: "quiz_abandon",
  INTAKE_START: "intake_start",
  INTAKE_STEP_COMPLETE: "intake_step_complete",
  INTAKE_COMPLETE: "intake_complete",
  INTAKE_ABANDON: "intake_abandon",

  // Checkout
  CHECKOUT_START: "checkout_start",
  PLAN_SELECTED: "plan_selected",
  ADDON_ADDED: "addon_added",
  ADDON_REMOVED: "addon_removed",
  CHECKOUT_COMPLETE: "checkout_complete",
  CHECKOUT_ABANDON: "checkout_abandon",

  // Upsells
  UPSELL_VIEW: "upsell_view",
  UPSELL_ACCEPT: "upsell_accept",
  UPSELL_DISMISS: "upsell_dismiss",

  // Referrals
  REFERRAL_LINK_COPY: "referral_link_copy",
  REFERRAL_INVITE_SEND: "referral_invite_send",
  REFERRAL_SIGNUP: "referral_signup",
  REFERRAL_CONVERSION: "referral_conversion",

  // Retention
  DASHBOARD_VIEW: "dashboard_view",
  PROGRESS_LOGGED: "progress_logged",
  PHOTO_UPLOADED: "photo_uploaded",
  MEAL_PLAN_VIEW: "meal_plan_view",
  RECIPE_VIEW: "recipe_view",
  CHECK_IN_COMPLETE: "check_in_complete",
  MESSAGE_SENT: "message_sent",

  // Calculators
  CALCULATOR_VIEW: "calculator_view",
  CALCULATOR_COMPLETE: "calculator_complete",

  // Content
  BLOG_VIEW: "blog_view",
  FAQ_EXPAND: "faq_expand",
  RESULTS_GALLERY_VIEW: "results_gallery_view",

  // Cancellation
  CANCEL_INITIATE: "cancel_initiate",
  CANCEL_REASON_SELECT: "cancel_reason_select",
  SAVE_OFFER_VIEW: "save_offer_view",
  SAVE_OFFER_ACCEPT: "save_offer_accept",
  CANCEL_COMPLETE: "cancel_complete",
  REACTIVATION: "reactivation",

  // Lead capture
  LEAD_CAPTURE: "lead_capture",
  EMAIL_SUBSCRIBE: "email_subscribe",

  // Conversion optimization events
  URGENCY_BANNER_VIEW: "urgency_banner_view",
  URGENCY_BANNER_CLICK: "urgency_banner_click",
  CHAT_WIDGET_OPEN: "chat_widget_open",
  CHAT_WIDGET_QUESTION: "chat_widget_question",
  OBJECTION_VIEWED: "objection_viewed",
  MONEY_BACK_GUARANTEE_VIEW: "money_back_guarantee_view",
  PROMO_CODE_COPIED: "promo_code_copied",
  MOBILE_SUMMARY_EXPAND: "mobile_summary_expand",

  // Unified Qualify flow
  QUALIFY_START: "qualify_start",
  QUALIFY_STEP_COMPLETE: "qualify_step_complete",
  QUALIFY_BMI_CALCULATED: "qualify_bmi_calculated",
  QUALIFY_PROJECTION_VIEWED: "qualify_projection_viewed",
  QUALIFY_CONTRAINDICATION_FLAG: "qualify_contraindication_flag",
  QUALIFY_COMPLETE: "qualify_complete",
  QUALIFY_ABANDON: "qualify_abandon",

  // LP Theme tracking
  LP_THEME_VIEW: "lp_theme_view",
} as const;

// ─── Track function ─────────────────────────────────────────

export function track(eventName: string, properties?: EventProperties): void {
  // PostHog
  if (typeof window !== "undefined" && "posthog" in window) {
    (window as Record<string, unknown>).posthog &&
      (
        (window as Record<string, unknown>).posthog as {
          capture: (event: string, props?: EventProperties) => void;
        }
      ).capture(eventName, properties);
  }

  // GA4
  if (typeof window !== "undefined" && "gtag" in window) {
    (
      window as unknown as {
        gtag: (command: string, event: string, params?: EventProperties) => void;
      }
    ).gtag("event", eventName, properties);
  }

  // Server-side: log for Meta CAPI / data pipeline (PII stripped in production)
  if (typeof window === "undefined") {
    safeLog("[Analytics:Server]", eventName, properties as Record<string, unknown> | undefined);
  }
}

// ─── Identify ───────────────────────────────────────────────

export function identify(userId: string, traits?: EventProperties): void {
  if (typeof window !== "undefined" && "posthog" in window) {
    (
      (window as Record<string, unknown>).posthog as {
        identify: (id: string, props?: EventProperties) => void;
      }
    )?.identify(userId, traits);
  }
}

// ─── Server-side Meta CAPI helper ───────────────────────────

export async function trackServerEvent(
  eventName: string,
  userData: { email?: string; phone?: string; ip?: string; userAgent?: string },
  customData?: EventProperties
): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !token) return;

  try {
    await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              em: userData.email ? hashForMeta(userData.email) : undefined,
              ph: userData.phone ? hashForMeta(userData.phone) : undefined,
              client_ip_address: userData.ip,
              client_user_agent: userData.userAgent,
            },
            custom_data: customData,
            action_source: "website",
          },
        ],
        access_token: token,
      }),
    });
  } catch {
    safeLog("[Meta CAPI]", `Failed to send event: ${eventName}`);
  }
}

async function hashForMeta(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
