/**
 * Landing Page Theme System — Color Psychology + Conversion Research
 *
 * ===== Core research principles baked in =====
 * 1. GREEN CTA = universal conversion winner in healthcare DTC.
 *    HubSpot, CXL, Unbounce meta-analyses all show emerald/green buttons
 *    outperform blue/orange/red in health, wellness, and telehealth.
 *    Exception: male-action audiences where ORANGE still wins (Hims, BlueChew,
 *    Keeps all use orange — the "decisive action" signal for male-oriented
 *    medical DTC). That's why `bold-vitality` keeps orange; everyone else
 *    gets emerald #059669.
 *
 * 2. BLUE primary = medical authority. 85%+ of hospital logos use blue.
 *    Blue lowers perceived risk and boosts "trustworthiness" scores in
 *    controlled psych studies (Mehta & Zhu 2009, Labrecque 2012).
 *
 * 3. CREAM + ROSE = nurturing warmth without infantilizing.
 *    Pure pink patronizes women's health; cream-background + dusty-rose
 *    accent signals care without "pink it and shrink it." Used in `warm-feminine`
 *    for postpartum and menopause where emotional warmth matters.
 *
 * 4. LAVENDER = PCOS community color. The #TealAndPurpleRibbon awareness
 *    scheme maps directly to the PCOS audience. Subtle lavender accent in
 *    `cerulean-pcos` creates in-group signaling without being overt.
 *
 * 5. Contrast ratios respect WCAG AA for body text. All price pills have
 *    white-or-navy text on their pill background (fixes the black-on-black
 *    bug the old cerulean-feminine had).
 */

// ─── Types ─────────────────────────────────────────────────

export type ThemeId =
  | "trust-medical"
  | "cerulean-feminine"
  | "cerulean-pcos"
  | "warm-feminine"
  | "bold-vitality"
  | "clean-clinical"
  | "earth-wellness"
  | "premium-dark";

export interface LpThemeColors {
  // Text
  heading: string;
  body: string;
  bodyMuted: string;

  // Surfaces
  pageBg: string;
  sectionAlt: string;
  cardBg: string;
  cardBorder: string;

  // Hero gradient
  heroFrom: string;
  heroVia: string;
  heroTo: string;

  // Accent gradient (text highlights)
  accentFrom: string;
  accentTo: string;

  // Badge
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;

  // CTA section background
  ctaFrom: string;
  ctaTo: string;

  // Primary button
  btnBg: string;
  btnText: string;
  btnHover: string;

  // Icon
  icon: string;
  iconBg: string;

  // Price badge
  priceBg: string;
  priceText: string;

  // Stat border
  statBorder: string;

  // Divider
  divider: string;

  // Logo gradient
  logoFrom: string;
  logoTo: string;
}

export interface LpTheme {
  id: ThemeId;
  name: string;
  description: string;
  psychology: string;
  bestFor: string[];
  colors: LpThemeColors;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Shared emerald green CTA — the conversion-proven button color for
// healthcare DTC. Used by every theme except bold-vitality.
const EMERALD_CTA = {
  btnBg: "#059669",      // emerald-600
  btnText: "#FFFFFF",
  btnHover: "#047857",   // emerald-700
};

// ─── Theme Presets ─────────────────────────────────────────

const trustMedical: LpTheme = {
  id: "trust-medical",
  name: "Trust Medical",
  description: "Cerulean + dark teal + emerald CTA — balanced clinical trust",
  psychology:
    "Cerulean signals modern healthcare authority. Dark teal conveys depth and experience. Emerald green CTA is the universally conversion-proven call-to-action color for health DTC.",
  bestFor: ["General", "Default", "GLP-1 Overview", "Over 40", "Over 50", "Telehealth", "Medical Weight Management"],
  colors: {
    heading: "#0B2A33",
    body: "#2A4A58",
    bodyMuted: "#4A6A75",
    pageBg: "#FFFFFF",
    sectionAlt: "#F6FAFC",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(0,80,102,0.08)",
    heroFrom: "#F0FAFF",
    heroVia: "#F6FAFC",
    heroTo: "#FFFFFF",
    accentFrom: "#00BAEE",
    accentTo: "#005066",
    badgeBg: "#E0F7FF",
    badgeText: "#005066",
    badgeBorder: "#BAE6FD",
    ctaFrom: "#E0F7FF",
    ctaTo: "#F0FAFF",
    ...EMERALD_CTA,
    icon: "#00BAEE",
    iconBg: "#E0F7FF",
    priceBg: "#F0FAFF",
    priceText: "#0B2A33",
    statBorder: "#BAE6FD",
    divider: "#00BAEE",
    logoFrom: "#00BAEE",
    logoTo: "#005066",
  },
  preview: {
    primary: "#0B2A33",
    secondary: "#00BAEE",
    accent: "#059669",
  },
};

const ceruleanFeminine: LpTheme = {
  id: "cerulean-feminine",
  name: "Cerulean Feminine (Modern)",
  description: "Cerulean + navy (softened from pure black) + emerald CTA",
  psychology:
    "Cerulean signals trust + modernity. Deep navy (not pure black) keeps authority without feeling corporate/harsh. Emerald CTA drives action. Used for general women's audiences where the framing is empowerment, not patronizing.",
  bestFor: ["Women (general)", "Women's Weight Loss (Every Phase)"],
  colors: {
    heading: "#0B2A33",   // Softened from pure black for warmth
    body: "#2A4A58",
    bodyMuted: "#526A74",
    pageBg: "#FFFFFF",
    sectionAlt: "#F0FAFF",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(0,186,238,0.12)",
    heroFrom: "#E6F7FF",
    heroVia: "#F0FAFF",
    heroTo: "#FFFFFF",
    accentFrom: "#00BAEE",
    accentTo: "#005066",
    badgeBg: "#E0F4FE",
    badgeText: "#005066",
    badgeBorder: "#B8E6FC",
    ctaFrom: "#E0F4FE",
    ctaTo: "#F0FAFF",
    ...EMERALD_CTA,
    icon: "#00BAEE",
    iconBg: "#E0F4FE",
    priceBg: "#F0FAFF",
    priceText: "#0B2A33",
    statBorder: "#B8E6FC",
    divider: "#00BAEE",
    logoFrom: "#00BAEE",
    logoTo: "#005066",
  },
  preview: {
    primary: "#0B2A33",
    secondary: "#00BAEE",
    accent: "#059669",
  },
};

const ceruleanPcos: LpTheme = {
  id: "cerulean-pcos",
  name: "Cerulean PCOS (Community)",
  description: "Cerulean + lavender accent + emerald CTA — PCOS community signaling",
  psychology:
    "The teal-and-purple ribbon is the PCOS awareness color scheme. Subtle lavender accent creates in-group recognition for PCOS visitors without being overt. Cerulean primary keeps medical authority; emerald CTA drives conversion.",
  bestFor: ["PCOS"],
  colors: {
    heading: "#0B2A33",
    body: "#2A4A58",
    bodyMuted: "#526A74",
    pageBg: "#FFFFFF",
    sectionAlt: "#F7F3FC",      // subtle lavender tint
    cardBg: "#FFFFFF",
    cardBorder: "rgba(155,121,209,0.14)",
    heroFrom: "#F1EBF9",         // lavender blush at hero top
    heroVia: "#F0FAFF",
    heroTo: "#FFFFFF",
    accentFrom: "#B59BD4",       // Lavender accent (PCOS ribbon)
    accentTo: "#00BAEE",         // Cerulean
    badgeBg: "#F1EBF9",
    badgeText: "#6E4A9C",        // Deeper lavender for badge readability
    badgeBorder: "#D8C5EC",
    ctaFrom: "#F1EBF9",
    ctaTo: "#E0F4FE",
    ...EMERALD_CTA,
    icon: "#8B63B8",             // Readable lavender for icons
    iconBg: "#F1EBF9",
    priceBg: "#F1EBF9",
    priceText: "#0B2A33",
    statBorder: "#D8C5EC",
    divider: "#B59BD4",
    logoFrom: "#B59BD4",
    logoTo: "#00BAEE",
  },
  preview: {
    primary: "#0B2A33",
    secondary: "#B59BD4",
    accent: "#059669",
  },
};

const warmFeminine: LpTheme = {
  id: "warm-feminine",
  name: "Warm Feminine (Nurturing)",
  description: "Soft teal + warm cream + dusty rose + emerald CTA — emotional warmth",
  psychology:
    "Life-transition audiences (postpartum, menopause) respond to warmth and respect, not corporate blue or stereotyped pink. Warm cream backgrounds reduce cognitive load; dusty-rose accents signal nurturing without infantilizing; soft teal keeps medical credibility. Emerald CTA drives conversion while preserving the warmth elsewhere.",
  bestFor: ["Postpartum", "Menopause"],
  colors: {
    heading: "#1F2F33",          // Deep teal-charcoal — grown-up, grounded
    body: "#455B61",
    bodyMuted: "#6B8087",
    pageBg: "#FFFDF9",           // Warm cream page bg (not clinical white)
    sectionAlt: "#FAF5EE",       // Warmer cream for alternating sections
    cardBg: "#FFFFFF",
    cardBorder: "rgba(91,163,154,0.14)",
    heroFrom: "#FDEEE7",         // Peach-blush at hero top
    heroVia: "#FAF5EE",
    heroTo: "#FFFDF9",
    accentFrom: "#E8A598",       // Dusty rose (nurturing, not pink)
    accentTo: "#5BA39A",         // Soft teal
    badgeBg: "#FDEEE7",
    badgeText: "#8B4A3D",        // Warm terracotta for badge text
    badgeBorder: "#F5C6BB",
    ctaFrom: "#FDEEE7",
    ctaTo: "#FAF5EE",
    ...EMERALD_CTA,
    icon: "#5BA39A",             // Soft teal for icons
    iconBg: "#E9F3F1",
    priceBg: "#FFFDF9",
    priceText: "#1F2F33",
    statBorder: "#F5C6BB",
    divider: "#5BA39A",
    logoFrom: "#5BA39A",
    logoTo: "#E8A598",
  },
  preview: {
    primary: "#1F2F33",
    secondary: "#E8A598",
    accent: "#059669",
  },
};

const boldVitality: LpTheme = {
  id: "bold-vitality",
  name: "Bold Vitality (Male-Action)",
  description: "Deep navy + orange CTA — masculine decisive action",
  psychology:
    "Orange CTAs consistently outperform green for male-action healthcare DTC (Hims, BlueChew, Keeps all use orange). Deep navy primary carries trust + seriousness; orange signals 'take action now.' Kept on this theme specifically because the male-audience data is strong and established.",
  bestFor: ["Men", "Belly Fat", "High-Intent Male-Coded Action"],
  colors: {
    heading: "#1A365D",
    body: "#475569",
    bodyMuted: "#64748B",
    pageBg: "#FFFFFF",
    sectionAlt: "#F8FAFC",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(26,54,93,0.10)",
    heroFrom: "#EFF6FF",
    heroVia: "#F8FAFC",
    heroTo: "#FFFFFF",
    accentFrom: "#E77C40",
    accentTo: "#F0A830",
    badgeBg: "#FFF3E8",
    badgeText: "#C2610A",
    badgeBorder: "#FED7AA",
    ctaFrom: "#FFF3E8",
    ctaTo: "#FFFBEB",
    btnBg: "#E77C40",           // ORANGE CTA (kept — research-proven for men)
    btnText: "#FFFFFF",
    btnHover: "#D06A30",
    icon: "#E77C40",
    iconBg: "#FFF3E8",
    priceBg: "#FFF3E8",          // Warm peach pill (was orange — fixes contrast)
    priceText: "#1A365D",        // Navy text (high contrast on peach)
    statBorder: "#FED7AA",
    divider: "#E77C40",
    logoFrom: "#1A365D",
    logoTo: "#E77C40",
  },
  preview: {
    primary: "#1A365D",
    secondary: "#E77C40",
    accent: "#F0A830",
  },
};

const cleanClinical: LpTheme = {
  id: "clean-clinical",
  name: "Clean Clinical",
  description: "Cool gray + cerulean + emerald CTA — precision + conversion",
  psychology:
    "Cyan + teal signals modern healthcare tech (appeals to analytical buyers who want clinical evidence). White space conveys precision. Emerald CTA boosts conversion over the previous cyan button — research shows green + teal-primary combo maximizes medical-DTC CTR.",
  bestFor: ["Semaglutide", "Tirzepatide", "Ozempic Alternative", "Wegovy Alternative", "Mounjaro Alternative", "Zepbound Alternative"],
  colors: {
    heading: "#111827",
    body: "#4B5563",
    bodyMuted: "#6B7280",
    pageBg: "#FFFFFF",
    sectionAlt: "#F9FAFB",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(0,0,0,0.06)",
    heroFrom: "#F0F9FF",
    heroVia: "#F9FAFB",
    heroTo: "#FFFFFF",
    accentFrom: "#0891B2",
    accentTo: "#0E7490",
    badgeBg: "#ECFEFF",
    badgeText: "#0E7490",
    badgeBorder: "#A5F3FC",
    ctaFrom: "#ECFEFF",
    ctaTo: "#F0F9FF",
    ...EMERALD_CTA,
    icon: "#0891B2",
    iconBg: "#ECFEFF",
    priceBg: "#ECFEFF",
    priceText: "#111827",
    statBorder: "#A5F3FC",
    divider: "#0891B2",
    logoFrom: "#0891B2",
    logoTo: "#0E7490",
  },
  preview: {
    primary: "#111827",
    secondary: "#0891B2",
    accent: "#059669",
  },
};

const earthWellness: LpTheme = {
  id: "earth-wellness",
  name: "Earth Wellness",
  description: "Olive + sage + cream + emerald CTA — natural, non-corporate",
  psychology:
    "Sage + olive signals 'natural/holistic' — reduces the 'corporate pharmaceutical' resistance budget-conscious and surgery-averse audiences carry. Cream page reinforces approachability. Switched CTA from terracotta (brown-orange) to emerald — green fits the wellness palette naturally AND is conversion-proven.",
  bestFor: ["Affordable", "No Surgery", "Natural Wellness"],
  colors: {
    heading: "#3C4A20",
    body: "#57603F",
    bodyMuted: "#78826B",
    pageBg: "#FFFDF9",
    sectionAlt: "#FAF7F2",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(95,107,47,0.10)",
    heroFrom: "#F5F0E5",
    heroVia: "#FAF7F2",
    heroTo: "#FFFDF9",
    accentFrom: "#5F6B2F",
    accentTo: "#87A878",
    badgeBg: "#F0F5E8",
    badgeText: "#5F6B2F",
    badgeBorder: "#D8E4C8",
    ctaFrom: "#F0F5E8",
    ctaTo: "#FBF0EA",
    ...EMERALD_CTA,
    icon: "#5F6B2F",
    iconBg: "#F0F5E8",
    priceBg: "#FAF7F2",          // Cream pill (was terracotta)
    priceText: "#3C4A20",        // Deep olive text (high contrast)
    statBorder: "#D8E4C8",
    divider: "#87A878",
    logoFrom: "#5F6B2F",
    logoTo: "#87A878",
  },
  preview: {
    primary: "#3C4A20",
    secondary: "#87A878",
    accent: "#059669",
  },
};

const premiumDark: LpTheme = {
  id: "premium-dark",
  name: "Premium Dark",
  description: "Dark navy + gold — luxury positioning (reserved)",
  psychology:
    "Dark backgrounds + gold signal luxury/exclusivity. Perceived value increases 15-25% with dark luxury aesthetics in A/B tests. Currently unused — held in reserve for future premium-tier variants.",
  bestFor: ["Premium Tier", "Luxury", "Complete Plan"],
  colors: {
    heading: "#F8F6F0",
    body: "#C4C0B8",
    bodyMuted: "#9A958C",
    pageBg: "#0B1929",
    sectionAlt: "#111F32",
    cardBg: "#15243A",
    cardBorder: "rgba(201,168,76,0.15)",
    heroFrom: "#0B1929",
    heroVia: "#111F32",
    heroTo: "#0B1929",
    accentFrom: "#C9A84C",
    accentTo: "#E0C56E",
    badgeBg: "rgba(201,168,76,0.12)",
    badgeText: "#C9A84C",
    badgeBorder: "rgba(201,168,76,0.25)",
    ctaFrom: "#111F32",
    ctaTo: "#15243A",
    btnBg: "#C9A84C",            // Gold CTA — premium positioning
    btnText: "#0B1929",
    btnHover: "#D4B65E",
    icon: "#C9A84C",
    iconBg: "rgba(201,168,76,0.12)",
    priceBg: "rgba(201,168,76,0.18)",
    priceText: "#F8F6F0",
    statBorder: "rgba(201,168,76,0.20)",
    divider: "#C9A84C",
    logoFrom: "#C9A84C",
    logoTo: "#E0C56E",
  },
  preview: {
    primary: "#0B1929",
    secondary: "#C9A84C",
    accent: "#E0C56E",
  },
};

// ─── Exports ───────────────────────────────────────────────

export const LP_THEMES: Record<ThemeId, LpTheme> = {
  "trust-medical": trustMedical,
  "cerulean-feminine": ceruleanFeminine,
  "cerulean-pcos": ceruleanPcos,
  "warm-feminine": warmFeminine,
  "bold-vitality": boldVitality,
  "clean-clinical": cleanClinical,
  "earth-wellness": earthWellness,
  "premium-dark": premiumDark,
};

export const THEME_IDS = Object.keys(LP_THEMES) as ThemeId[];

export const DEFAULT_THEME_ID: ThemeId = "trust-medical";

/**
 * Per-slug theme assignment, tuned for conversion psychology.
 *
 *   — Postpartum + Menopause → warm-feminine (nurturing cream + rose + green CTA)
 *   — PCOS                   → cerulean-pcos (community lavender accent)
 *   — Women (general)        → cerulean-feminine (softened, green CTA)
 *   — Men + Belly Fat        → bold-vitality (orange CTA, research-proven for males)
 *   — Medication-focused     → clean-clinical (cyan authority + green CTA)
 *   — Price/alt angles       → earth-wellness (natural palette + green CTA)
 *   — Everything else        → trust-medical (cerulean + green CTA)
 */
export function getDefaultThemeForSlug(slug: string): ThemeId {
  const mapping: Record<string, ThemeId> = {
    // Warm-feminine: life-transition audiences
    postpartum: "warm-feminine",
    menopause: "warm-feminine",

    // PCOS-specific — lavender community accent
    pcos: "cerulean-pcos",

    // General women
    women: "cerulean-feminine",
    "women-weight-loss": "cerulean-feminine",

    // Bold-vitality (keep orange CTA — conversion-proven for male-action)
    men: "bold-vitality",
    "belly-fat": "bold-vitality",

    // Medication-focused
    semaglutide: "clean-clinical",
    tirzepatide: "clean-clinical",
    "ozempic-alternative": "clean-clinical",
    "wegovy-alternative": "clean-clinical",
    "mounjaro-alternative": "clean-clinical",
    "zepbound-alternative": "clean-clinical",

    // Price / alternative angles
    affordable: "earth-wellness",
    "no-surgery": "earth-wellness",

    // Life-event triggered (Tier 2 LPs — high emotional motivation, underserved markets)
    "after-breakup": "cerulean-feminine",   // Empowerment energy — modern + action
    "after-divorce": "warm-feminine",       // Nurturing reinvention — life transition
    "before-wedding": "warm-feminine",      // Warmth for the big day
    "pre-diabetes": "trust-medical",        // Pure clinical authority

    // General + clinical
    telehealth: "trust-medical",
    over40: "trust-medical",
    over50: "trust-medical",
    glp1: "trust-medical",
    "medical-weight-management": "trust-medical",
  };
  return mapping[slug] ?? DEFAULT_THEME_ID;
}
