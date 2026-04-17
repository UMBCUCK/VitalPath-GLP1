/**
 * Landing Page Theme System
 * 6 conversion-optimized theme presets with complete color token sets.
 * Each theme follows color psychology principles for maximum conversion.
 */

// ─── Types ─────────────────────────────────────────────────

export type ThemeId =
  | "trust-medical"
  | "cerulean-feminine"
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

// ─── Theme Presets ─────────────────────────────────────────

const trustMedical: LpTheme = {
  id: "trust-medical",
  name: "Trust Medical",
  description: "Cerulean and dark teal — modern clinical trust",
  psychology:
    "Cerulean signals modern healthcare. Dark teal conveys depth and authority. Clean whites keep it professional.",
  bestFor: ["General", "Default", "GLP-1"],
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
    btnBg: "#0098D4",
    btnText: "#FFFFFF",
    btnHover: "#0077A8",
    icon: "#00BAEE",
    iconBg: "#E0F7FF",
    priceBg: "#005066",
    priceText: "#FFFFFF",
    statBorder: "#BAE6FD",
    divider: "#00BAEE",
    logoFrom: "#00BAEE",
    logoTo: "#005066",
  },
  preview: {
    primary: "#0B2A33",
    secondary: "#00BAEE",
    accent: "#0098D4",
  },
};

const ceruleanFeminine: LpTheme = {
  id: "cerulean-feminine",
  name: "Cerulean Feminine",
  description: "Bright cerulean with black accents — modern, empowering, bold",
  psychology:
    "Cerulean signals trust and modernity. Black adds sophistication and authority. The contrast drives attention to CTAs.",
  bestFor: ["Women", "PCOS", "Menopause", "Postpartum"],
  colors: {
    heading: "#111111",
    body: "#333333",
    bodyMuted: "#666666",
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
    btnBg: "#00BAEE",
    btnText: "#FFFFFF",
    btnHover: "#009DD0",
    icon: "#00BAEE",
    iconBg: "#E0F4FE",
    priceBg: "#111111",
    priceText: "#FFFFFF",
    statBorder: "#B8E6FC",
    divider: "#00BAEE",
    logoFrom: "#00BAEE",
    logoTo: "#005066",
  },
  preview: {
    primary: "#111111",
    secondary: "#00BAEE",
    accent: "#005066",
  },
};

const boldVitality: LpTheme = {
  id: "bold-vitality",
  name: "Bold Vitality",
  description: "Deep blue with orange — energy, confidence, action",
  psychology:
    "Deep blue provides trust. Orange is the highest-converting CTA color across A/B test meta-analyses. Amber adds urgency.",
  bestFor: ["Men", "Belly Fat", "High-Intent"],
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
    btnBg: "#E77C40",
    btnText: "#FFFFFF",
    btnHover: "#D06A30",
    icon: "#E77C40",
    iconBg: "#FFF3E8",
    priceBg: "#E77C40",
    priceText: "#FFFFFF",
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
  description: "Cool gray with cerulean — precision, modern healthcare",
  psychology:
    "Cerulean signals modern healthcare tech. Clean white conveys precision. Appeals to analytical buyers seeking clinical evidence.",
  bestFor: ["Semaglutide", "Tirzepatide", "Medications"],
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
    btnBg: "#0891B2",
    btnText: "#FFFFFF",
    btnHover: "#0E7490",
    icon: "#0891B2",
    iconBg: "#ECFEFF",
    priceBg: "#0891B2",
    priceText: "#FFFFFF",
    statBorder: "#A5F3FC",
    divider: "#0891B2",
    logoFrom: "#0891B2",
    logoTo: "#0E7490",
  },
  preview: {
    primary: "#111827",
    secondary: "#0891B2",
    accent: "#0E7490",
  },
};

const earthWellness: LpTheme = {
  id: "earth-wellness",
  name: "Earth Wellness",
  description: "Olive and sage with terracotta — natural, holistic, grounded",
  psychology:
    "Green tones signal natural/holistic treatment. Terracotta drives warmth and trust. Appeals to wellness-oriented audiences.",
  bestFor: ["Natural Wellness", "Holistic", "Affordable"],
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
    btnBg: "#C67B5C",
    btnText: "#FFFFFF",
    btnHover: "#B3694C",
    icon: "#5F6B2F",
    iconBg: "#F0F5E8",
    priceBg: "#C67B5C",
    priceText: "#FFFFFF",
    statBorder: "#D8E4C8",
    divider: "#87A878",
    logoFrom: "#5F6B2F",
    logoTo: "#87A878",
  },
  preview: {
    primary: "#3C4A20",
    secondary: "#87A878",
    accent: "#C67B5C",
  },
};

const premiumDark: LpTheme = {
  id: "premium-dark",
  name: "Premium Dark",
  description: "Dark navy with gold — luxury, exclusivity, premium",
  psychology:
    "Dark backgrounds with gold signal luxury and exclusivity. Perceived value increases 15-25% with dark luxury aesthetics.",
  bestFor: ["Premium", "Luxury", "Complete Plan"],
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
    btnBg: "#C9A84C",
    btnText: "#0B1929",
    btnHover: "#D4B65E",
    icon: "#C9A84C",
    iconBg: "rgba(201,168,76,0.12)",
    priceBg: "#C9A84C",
    priceText: "#0B1929",
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
  "bold-vitality": boldVitality,
  "clean-clinical": cleanClinical,
  "earth-wellness": earthWellness,
  "premium-dark": premiumDark,
};

export const THEME_IDS = Object.keys(LP_THEMES) as ThemeId[];

export const DEFAULT_THEME_ID: ThemeId = "trust-medical";

/** Returns the recommended default theme for a given LP slug */
export function getDefaultThemeForSlug(slug: string): ThemeId {
  const mapping: Record<string, ThemeId> = {
    women: "cerulean-feminine",
    "women-weight-loss": "cerulean-feminine",
    pcos: "cerulean-feminine",
    menopause: "cerulean-feminine",
    postpartum: "cerulean-feminine",
    men: "bold-vitality",
    "belly-fat": "bold-vitality",
    semaglutide: "clean-clinical",
    tirzepatide: "clean-clinical",
    "ozempic-alternative": "clean-clinical",
    "wegovy-alternative": "clean-clinical",
    "mounjaro-alternative": "clean-clinical",
    "zepbound-alternative": "clean-clinical",
    telehealth: "trust-medical",
    affordable: "earth-wellness",
    "no-surgery": "earth-wellness",
  };
  return mapping[slug] ?? DEFAULT_THEME_ID;
}
