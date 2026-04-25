/**
 * WalletTrustRow
 * ─────────────────────────────────────────────────────────────
 * Tier 10.8 — Compact row of wallet / payment-method trust badges for
 * marketing pages (pricing, LPs). Signals to mobile users that
 * Apple Pay + Google Pay are one-tap — key for conversion on the
 * branded-payment expectations set by the checkout page.
 *
 * Server-renderable (no "use client") — plain text/glyph badges keep
 * this lightweight and avoid shipping a payment-method image asset.
 */
import { Lock } from "lucide-react";

export function WalletTrustRow({
  align = "center",
}: {
  align?: "center" | "left";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-[11px] text-graphite-500 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <span className="flex items-center gap-1">
        <Lock className="h-3 w-3 text-graphite-400" />
        <span>256-bit secure</span>
      </span>
      <span className="text-graphite-300">·</span>
      <span className="text-graphite-400">One-tap:</span>
      {[
        { label: " Pay", aria: "Apple Pay" },
        { label: "G Pay", aria: "Google Pay" },
        { label: "Link", aria: "Stripe Link" },
        { label: "Cash", aria: "Cash App Pay" },
      ].map((w) => (
        <span
          key={w.aria}
          aria-label={w.aria}
          className="inline-flex items-center rounded border border-navy-200/60 bg-white px-1.5 py-0.5 text-[10px] font-bold text-navy"
        >
          {w.label}
        </span>
      ))}
      <span className="text-graphite-300">·</span>
      <span>Visa / MC / Amex</span>
    </div>
  );
}
