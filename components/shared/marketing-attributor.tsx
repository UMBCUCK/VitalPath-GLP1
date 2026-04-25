"use client";

/**
 * MarketingAttributor
 * ─────────────────────────────────────────────────────────────
 * Tier 8.8 — Thin client wrapper mounted inside MarketingShell so every
 * marketing page (homepage, pricing, compare, calculators, medications,
 * peptides) gets first-touch LP attribution without manual per-page wiring.
 *
 * LP-specific routes (/lp/*) are ALSO handled by LpConversionWidgets — that's
 * fine, LpAttributionTracker is idempotent (first-touch only; re-calls no-op).
 */
import { usePathname } from "next/navigation";
import { LpAttributionTracker } from "./lp-attribution-tracker";

function themeFromPath(path: string | null): string {
  if (!path) return "unknown";
  const parts = path.replace(/^\/+/, "").split("/");
  if (parts[0] === "") return "home";
  if (parts[0] === "lp") return parts[1] ?? "lp-root";
  if (parts[0] === "medications" && parts[1]) return `medication-${parts[1]}`;
  if (parts[0] === "peptides" && parts[1] === "stacks" && parts[2]) return `peptide-stack-${parts[2]}`;
  if (parts[0] === "peptides" && parts[1]) return `peptide-${parts[1]}`;
  if (parts[0] === "peptides") return "peptides-hub";
  if (parts[0] === "compare") return "compare";
  if (parts[0] === "pricing") return "pricing";
  if (parts[0] === "calculators") return `calc-${parts[1] ?? "hub"}`;
  return parts[0] || "home";
}

export function MarketingAttributor() {
  const pathname = usePathname();
  return <LpAttributionTracker theme={themeFromPath(pathname)} path={pathname ?? "/"} />;
}
