"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { LpAttributionTracker } from "@/components/shared/lp-attribution-tracker";

const ExitIntentModal = dynamic(
  () => import("@/components/marketing/exit-intent-modal").then((m) => m.ExitIntentModal),
  { loading: () => null }
);

const SocialProofToasts = dynamic(
  () => import("@/components/marketing/social-proof-toasts").then((m) => m.SocialProofToasts),
  { loading: () => null }
);

/**
 * Derive a stable "theme" label from the LP pathname. Used by Tier 8.8's
 * attribution tracker so we can compare the revenue produced by each LP.
 * Keep the labels short and lowercase-kebab for easy dashboard filtering.
 */
function themeFromPath(path: string | null): string {
  if (!path) return "unknown";
  // Strip leading / and split
  const parts = path.replace(/^\/+/, "").split("/");
  if (parts[0] === "lp") return parts[1] ?? "lp-root";
  // Other landing-ish routes: medications/[slug], peptides, peptides/[slug], compare, etc.
  if (parts[0] === "medications" && parts[1]) return `medication-${parts[1]}`;
  if (parts[0] === "peptides" && parts[1] === "stacks" && parts[2]) return `peptide-stack-${parts[2]}`;
  if (parts[0] === "peptides" && parts[1]) return `peptide-${parts[1]}`;
  if (parts[0] === "peptides") return "peptides-hub";
  if (parts[0] === "compare") return "compare";
  return parts[0] || "home";
}

export function LpConversionWidgets() {
  const pathname = usePathname();
  const theme = themeFromPath(pathname);
  return (
    <>
      {/* Tier 8.8 — first-touch LP attribution for revenue attribution */}
      <LpAttributionTracker theme={theme} path={pathname ?? ""} />
      <MobileStickyCta />
      <ExitIntentModal />
      <SocialProofToasts />
    </>
  );
}
