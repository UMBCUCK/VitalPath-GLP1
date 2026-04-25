/**
 * A/B Testing / Feature Flag system.
 * Uses PostHog when available, falls back to cookie-based random assignment.
 */

export interface Experiment {
  key: string;
  variants: string[];
  defaultVariant: string;
  description: string;
}

// ─── Active experiments ─────────────────────────────────────

export const EXPERIMENTS: Record<string, Experiment> = {
  hero_headline: {
    key: "hero_headline",
    variants: ["control", "variant_a", "variant_b", "belly_fat_seasonal"],
    defaultVariant: "control",
    description:
      "Test hero headline copy for conversion. 'belly_fat_seasonal' is the /home-v2 variant — seasonally rolling 'by [Month]' headline + 5-bullet benefit stack (previewable at /home-v2).",
  },
  pricing_layout: {
    key: "pricing_layout",
    variants: ["three_column", "two_column"],
    defaultVariant: "three_column",
    description: "Test pricing page layout (3-col vs 2-col with toggle)",
  },
  cta_color: {
    key: "cta_color",
    variants: ["teal", "gold"],
    defaultVariant: "teal",
    description: "Test primary CTA button color",
  },
  checkout_trust_badges: {
    key: "checkout_trust_badges",
    variants: ["hidden", "visible"],
    defaultVariant: "visible",
    description: "Test trust badge visibility on checkout",
  },
  exit_intent_offer: {
    key: "exit_intent_offer",
    variants: ["guide_only", "guide_plus_discount", "discount_only"],
    defaultVariant: "guide_plus_discount",
    description: "Exit intent modal offer type",
  },
  urgency_banner: {
    key: "urgency_banner",
    variants: ["show", "hide"],
    defaultVariant: "show",
    description: "Show/hide urgency countdown banner",
  },
  social_proof_style: {
    key: "social_proof_style",
    variants: ["toasts", "counter", "both"],
    defaultVariant: "both",
    description: "Social proof display type on marketing pages",
  },
  checkout_progress: {
    key: "checkout_progress",
    variants: ["show", "hide"],
    defaultVariant: "show",
    description: "Show/hide checkout progress bar",
  },
  money_back_position: {
    key: "money_back_position",
    variants: ["above_cta", "below_cta", "both"],
    defaultVariant: "above_cta",
    description: "Money-back guarantee badge placement in checkout",
  },
  persona_card: {
    key: "persona_card",
    variants: ["show", "hide"],
    defaultVariant: "show",
    description: "Show/hide persona result card in qualify flow",
  },
  // Tier 6.6 — Hero primary CTA button copy test
  hero_cta_copy: {
    key: "hero_cta_copy",
    variants: ["control", "start_free", "check_qualify", "begin_2min"],
    defaultVariant: "control",
    description:
      "Hero primary button copy. control='See If I Qualify', start_free='Start My Free Assessment', check_qualify='Check My Eligibility', begin_2min='Begin 2-Minute Assessment'.",
  },
  // Tier 8.6 — Qualify step 1 opening copy (heading + subheading)
  qualify_step1_copy: {
    key: "qualify_step1_copy",
    variants: ["control", "weight_first", "plan_first"],
    defaultVariant: "control",
    description:
      "Qualify step-1 heading copy. control='See if you qualify for GLP-1 treatment', weight_first='How much weight do you want to lose?', plan_first='Get your personalized weight-loss plan'.",
  },
  // Tier 10.7 — Show a "how much weight do you want to lose?" commitment
  // screen BEFORE step 1. 4 chip answers (10–25 / 26–50 / 51–75 / 76+).
  // Creates a psychological commitment before the heavier form.
  qualify_step0_gate: {
    key: "qualify_step0_gate",
    variants: ["off", "on"],
    defaultVariant: "off",
    description:
      "Show a pre-step commitment screen ('How much weight do you want to lose?') before qualify step 1. Off=control, on=shows the modal.",
  },
};

// Tier 6.6 — Hero CTA copy variants, used by HeroSection
export const HERO_CTA_COPY: Record<string, string> = {
  control: "See If I Qualify",
  start_free: "Start My Free Assessment",
  check_qualify: "Check My Eligibility",
  begin_2min: "Begin 2-Minute Assessment",
};

// Tier 8.6 — Qualify step 1 copy variants
export const QUALIFY_STEP1_COPY: Record<
  string,
  { heading: string; subheading: string }
> = {
  control: {
    heading: "See if you qualify for GLP-1 treatment",
    subheading: "Let's start with your basics",
  },
  weight_first: {
    heading: "How much weight do you want to lose?",
    subheading: "We'll tailor your plan in 90 seconds",
  },
  plan_first: {
    heading: "Get your personalized weight-loss plan",
    subheading: "Tell us a few things and we'll match you to the right treatment",
  },
};

// ─── Hero headline variants ─────────────────────────────────

export const HERO_HEADLINES: Record<string, { headline: string; subheadline: string }> = {
  control: {
    headline: "Weight management built for real-life consistency",
    subheadline: "Personalized treatment plans for eligible adults. Medication, if prescribed, plus tracking, nutrition, and structured support designed to help you build momentum.",
  },
  variant_a: {
    headline: "Clinically informed care that goes beyond the prescription",
    subheadline: "Provider-guided treatment with meal plans, progress tracking, and coaching check-ins designed to help you build habits that last.",
  },
  variant_b: {
    headline: "Your weight management program, built around your life",
    subheadline: "Licensed providers, personalized treatment, and practical daily tools — all in one platform designed for lasting results.",
  },
  // /home-v2 preview — seasonal deadline headline with 5-bullet benefit stack.
  // When this variant wins, promote its HeroSectionV2 treatment to the main home page.
  // Route preview: /home-v2 (noindex). Rolling month computed server-side (rolls on the 20th).
  belly_fat_seasonal: {
    headline: "Lose that stubborn belly fat by [Month]. Medicine that works up to 3x better than diet and exercise alone.",
    subheadline: "✓ 2-minute approval ✓ Real doctor-prescribed medicine — no hassle ✓ No insurance needed ✓ Fast shipping in 24–48 hours ✓ Many members see changes within weeks.",
  },
};

// ─── Assignment logic ───────────────────────────────────────

/**
 * Get experiment variant for a user.
 * In production, this would call PostHog's getFeatureFlag().
 * For now, uses deterministic assignment based on a session/user ID.
 */
export function getVariant(experimentKey: string, userId?: string): string {
  const experiment = EXPERIMENTS[experimentKey];
  if (!experiment) return "control";

  // If PostHog is available client-side, defer to it
  if (typeof window !== "undefined" && "posthog" in window) {
    const ph = (window as Record<string, unknown>).posthog as {
      getFeatureFlag?: (key: string) => string | undefined;
    };
    const flag = ph?.getFeatureFlag?.(experimentKey);
    if (flag && experiment.variants.includes(flag)) return flag;
  }

  // Deterministic fallback: hash the userId + experimentKey
  if (!userId) return experiment.defaultVariant;

  let hash = 0;
  const seed = `${userId}:${experimentKey}`;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % experiment.variants.length;
  return experiment.variants[index];
}

/**
 * Track experiment exposure event.
 */
export function trackExperiment(experimentKey: string, variant: string): void {
  if (typeof window !== "undefined" && "posthog" in window) {
    const ph = (window as Record<string, unknown>).posthog as {
      capture?: (event: string, props?: Record<string, unknown>) => void;
    };
    ph?.capture?.("$experiment_started", {
      $experiment_key: experimentKey,
      $experiment_variant: variant,
    });
  }
}
