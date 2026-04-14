"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import {
  LP_THEMES,
  DEFAULT_THEME_ID,
  type ThemeId,
  type LpTheme,
  type LpThemeColors,
} from "@/lib/lp-themes";

interface LpThemeContextValue {
  theme: LpTheme;
  themeId: ThemeId;
}

const LpThemeContext = createContext<LpThemeContextValue>({
  theme: LP_THEMES[DEFAULT_THEME_ID],
  themeId: DEFAULT_THEME_ID,
});

export function useLpTheme() {
  return useContext(LpThemeContext);
}

/** Convert hex (#RRGGBB) to "H S% L%" for CSS variable override */
function hexToHsl(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return "0 0% 0%";
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${Math.round(l * 100)}%`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue = 0;
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) hue = ((b - r) / d + 2) / 6;
  else hue = ((r - g) / d + 4) / 6;
  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Maps theme color object to CSS custom properties */
function buildCssVars(colors: LpThemeColors): CSSProperties {
  return {
    // Override shadcn primary so all Button/Badge/etc auto-theme
    "--primary": hexToHsl(colors.btnBg),
    "--primary-foreground": hexToHsl(colors.btnText),
    "--ring": hexToHsl(colors.btnBg),
    // LP-specific tokens
    "--lp-heading": colors.heading,
    "--lp-body": colors.body,
    "--lp-body-muted": colors.bodyMuted,
    "--lp-page-bg": colors.pageBg,
    "--lp-section-alt": colors.sectionAlt,
    "--lp-card-bg": colors.cardBg,
    "--lp-card-border": colors.cardBorder,
    "--lp-hero-from": colors.heroFrom,
    "--lp-hero-via": colors.heroVia,
    "--lp-hero-to": colors.heroTo,
    "--lp-accent-from": colors.accentFrom,
    "--lp-accent-to": colors.accentTo,
    "--lp-badge-bg": colors.badgeBg,
    "--lp-badge-text": colors.badgeText,
    "--lp-badge-border": colors.badgeBorder,
    "--lp-cta-from": colors.ctaFrom,
    "--lp-cta-to": colors.ctaTo,
    "--lp-btn-bg": colors.btnBg,
    "--lp-btn-text": colors.btnText,
    "--lp-btn-hover": colors.btnHover,
    "--lp-icon": colors.icon,
    "--lp-icon-bg": colors.iconBg,
    "--lp-price-bg": colors.priceBg,
    "--lp-price-text": colors.priceText,
    "--lp-stat-border": colors.statBorder,
    "--lp-divider": colors.divider,
    "--lp-logo-from": colors.logoFrom,
    "--lp-logo-to": colors.logoTo,
  } as CSSProperties;
}

interface LpThemeProviderProps {
  themeId: ThemeId;
  children: ReactNode;
}

export function LpThemeProvider({ themeId, children }: LpThemeProviderProps) {
  const theme = LP_THEMES[themeId] ?? LP_THEMES[DEFAULT_THEME_ID];
  const cssVars = buildCssVars(theme.colors);

  return (
    <LpThemeContext.Provider value={{ theme, themeId }}>
      <div
        data-lp-theme={themeId}
        style={{ ...cssVars, backgroundColor: theme.colors.pageBg }}
      >
        {children}
      </div>
    </LpThemeContext.Provider>
  );
}
