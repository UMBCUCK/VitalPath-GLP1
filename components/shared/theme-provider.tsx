"use client";

import { useEffect } from "react";

/**
 * Reads the saved theme from localStorage and applies it to the <html> element.
 * Runs on EVERY page (marketing, dashboard, admin) after React hydration,
 * ensuring the cerulean/dark theme class persists across navigation.
 */
export function ThemeProvider() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("vp-admin-theme") || "";
      const html = document.documentElement;

      // Remove stale theme classes first
      html.classList.remove("dark", "theme-cerulean");

      if (theme === "dark") {
        html.classList.add("dark");
      } else if (theme === "cerulean") {
        html.classList.add("theme-cerulean");
      }
    } catch {
      // localStorage not available (SSR, incognito, etc.)
    }
  }, []);

  return null;
}
