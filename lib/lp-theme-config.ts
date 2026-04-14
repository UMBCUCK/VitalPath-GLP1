/**
 * LP Theme Configuration — localStorage persistence layer.
 * Stores per-LP theme assignments and A/B test configurations.
 * Structured for trivial migration to database later.
 */

import type { ThemeId } from "./lp-themes";

// ─── Types ─────────────────────────────────────────────────

export interface LpAbTestConfig {
  enabled: boolean;
  experimentKey: string;
  variants: {
    control: ThemeId;
    variant_a: ThemeId;
  };
}

export interface LpThemeAssignment {
  slug: string;
  themeId: ThemeId;
  abTest?: LpAbTestConfig;
}

export interface LpThemeConfigStore {
  assignments: Record<string, LpThemeAssignment>;
  updatedAt: string;
}

// ─── Storage ───────────────────────────────────────────────

const STORAGE_KEY = "lp_theme_config";

function emptyStore(): LpThemeConfigStore {
  return { assignments: {}, updatedAt: new Date().toISOString() };
}

export function getLpThemeConfig(): LpThemeConfigStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as LpThemeConfigStore;
  } catch {
    return emptyStore();
  }
}

export function setLpThemeConfig(config: LpThemeConfigStore): void {
  if (typeof window === "undefined") return;
  config.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getThemeAssignment(slug: string): LpThemeAssignment | null {
  const config = getLpThemeConfig();
  return config.assignments[slug] ?? null;
}

export function setThemeAssignment(
  slug: string,
  assignment: LpThemeAssignment
): void {
  const config = getLpThemeConfig();
  config.assignments[slug] = assignment;
  setLpThemeConfig(config);
}

export function removeThemeAssignment(slug: string): void {
  const config = getLpThemeConfig();
  delete config.assignments[slug];
  setLpThemeConfig(config);
}
