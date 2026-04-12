"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTheme = "default" | "cerulean" | "dark";

export function applyAdminTheme(theme: AdminTheme) {
  const html = document.documentElement;
  // Smooth transition on the root element only — avoids fighting animation keyframes
  html.style.transition = "background-color 0.25s ease, color 0.2s ease";
  html.classList.remove("dark", "theme-cerulean");
  if (theme === "dark") html.classList.add("dark");
  else if (theme === "cerulean") html.classList.add("theme-cerulean");
  // Clean up inline style once transition completes
  const cleanup = () => { html.style.transition = ""; };
  html.addEventListener("transitionend", cleanup, { once: true });
  // Safety fallback in case transitionend never fires
  setTimeout(cleanup, 400);
}

export function getStoredTheme(): AdminTheme {
  try {
    // Migrate legacy "vp-admin-dark" key
    const legacyDark = localStorage.getItem("vp-admin-dark");
    if (legacyDark === "true") {
      localStorage.setItem("vp-admin-theme", "dark");
      localStorage.removeItem("vp-admin-dark");
      return "dark";
    }
    return (localStorage.getItem("vp-admin-theme") as AdminTheme) || "default";
  } catch {
    return "default";
  }
}

const THEME_ORDER: AdminTheme[] = ["default", "cerulean", "dark"];

const THEME_META: Record<AdminTheme, { icon: React.ReactNode; label: string; next: string }> = {
  default: {
    icon: <Sun className="h-4 w-4" />,
    label: "Default (Warm)",
    next: "Switch to Cerulean",
  },
  cerulean: {
    icon: <Droplets className="h-4 w-4" />,
    label: "Cerulean (Light)",
    next: "Switch to Dark",
  },
  dark: {
    icon: <Moon className="h-4 w-4" />,
    label: "Dark",
    next: "Switch to Default",
  },
};

export function DarkModeToggle() {
  const [theme, setThemeState] = useState<AdminTheme>("default");

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyAdminTheme(stored);
  }, []);

  const cycle = () => {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
    setThemeState(next);
    try { localStorage.setItem("vp-admin-theme", next); } catch { /* */ }
    applyAdminTheme(next);
  };

  const meta = THEME_META[theme];

  return (
    <button
      onClick={cycle}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-lg px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        theme === "cerulean" && "text-primary",
        theme === "dark" && "text-primary"
      )}
      title={meta.next}
      aria-label={meta.next}
    >
      {meta.icon}
      <span className="hidden text-[10px] font-semibold uppercase tracking-wide xl:block">
        {meta.label}
      </span>
    </button>
  );
}

/** Hook — use anywhere inside admin to read/set the current theme */
export function useAdminTheme() {
  const [theme, setThemeState] = useState<AdminTheme>("default");

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  function setTheme(next: AdminTheme) {
    setThemeState(next);
    try { localStorage.setItem("vp-admin-theme", next); } catch { /* */ }
    applyAdminTheme(next);
  }

  return { theme, setTheme };
}
