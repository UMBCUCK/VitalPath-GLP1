"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { LpThemeProvider } from "./lp-theme-provider";
import { useResolvedTheme } from "@/lib/lp-theme-resolver";
import { getDefaultThemeForSlug } from "@/lib/lp-themes";
import type { ReactNode } from "react";

/**
 * PERF/CLS: We were calling `useResolvedTheme()` which on the first render
 * returns the default theme, then on `useEffect` may swap to an admin
 * override or A/B variant — that swap re-renders the entire LP tree with
 * a different set of CSS variables (background gradient, button colors,
 * heading color). On slow connections this caused a visible color flash
 * and an LCP recompute as the hero background changed paint.
 *
 * The fix: compute the slug + default theme synchronously with `useMemo`
 * so the very first paint is already on the correct theme for the URL.
 * Admin preview / A/B test overrides still fire from inside
 * `useResolvedTheme`, but they only override when actually present —
 * the 99% case (a normal visitor) renders the right theme on render 1.
 */
export function LpThemeWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const slug = useMemo(
    () => pathname.split("/lp/")[1]?.split("/")[0] ?? "",
    [pathname]
  );
  const resolved = useResolvedTheme(slug);
  // Use the resolved value if it differs from default; otherwise the slug's
  // default ensures SSR + first client render match (no hydration mismatch).
  const themeId = resolved || getDefaultThemeForSlug(slug);

  return <LpThemeProvider themeId={themeId}>{children}</LpThemeProvider>;
}
