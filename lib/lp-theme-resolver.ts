/**
 * LP Theme Resolver — determines which theme a visitor sees.
 *
 * Priority:
 *  1. ?theme= URL param (admin preview)
 *  2. Active A/B test for this LP slug
 *  3. Admin-assigned theme (localStorage)
 *  4. Default theme for slug
 */

"use client";

import { useEffect, useState } from "react";
import {
  LP_THEMES,
  getDefaultThemeForSlug,
  type ThemeId,
} from "./lp-themes";
import { getThemeAssignment } from "./lp-theme-config";
import { getVariant, trackExperiment } from "./experiments";

export function useResolvedTheme(slug: string): ThemeId {
  const defaultTheme = getDefaultThemeForSlug(slug);
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);

  useEffect(() => {
    // 1. URL param for admin preview
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("theme") as ThemeId | null;
    if (preview && LP_THEMES[preview]) {
      setThemeId(preview);
      return;
    }

    // 2. Check admin assignment + A/B test
    const assignment = getThemeAssignment(slug);

    if (assignment?.abTest?.enabled) {
      const variant = getVariant(assignment.abTest.experimentKey);
      const mapped =
        assignment.abTest.variants[
          variant as keyof typeof assignment.abTest.variants
        ];
      if (mapped && LP_THEMES[mapped]) {
        trackExperiment(assignment.abTest.experimentKey, variant);
        setThemeId(mapped);
        return;
      }
    }

    // 3. Admin-assigned theme (no A/B)
    if (assignment?.themeId && LP_THEMES[assignment.themeId]) {
      setThemeId(assignment.themeId);
      return;
    }

    // 4. Default for this slug
    setThemeId(defaultTheme);
  }, [slug, defaultTheme]);

  return themeId;
}
