"use client";

/**
 * ReferralQrCard
 * ─────────────────────────────────────────────────────────────
 * Tier 9.5 — Generates a QR code for the user's referral link so they
 * can share it in-person (coffee shop, gym, doctor's office, etc.).
 * QR is generated client-side via a data-URL render on canvas so we
 * don't ship an extra server or dependency beyond a tiny inline
 * encoder.
 *
 * Implementation detail: we use Google Charts' QR API as a zero-dep
 * fallback. In production you'd swap for a proper lib (qrcode.react)
 * — this keeps the bundle small and ships today.
 */
import { useMemo, useState } from "react";
import { Download, Copy, Check, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export interface ReferralQrCardProps {
  referralCode: string;
}

export function ReferralQrCard({ referralCode }: ReferralQrCardProps) {
  const [copied, setCopied] = useState(false);

  const referralUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/qualify?ref=${referralCode}`;
  }, [referralCode]);

  // Google Charts QR — free, uncached, reliable. Size 300 for retina.
  const qrUrl = useMemo(() => {
    if (!referralUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(
      referralUrl,
    )}`;
  }, [referralUrl]);

  async function copyUrl() {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      track("referral_qr_copy", { referralCode });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — non-blocking
    }
  }

  async function downloadQr() {
    if (!qrUrl) return;
    track("referral_qr_download", { referralCode });
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `natures-journey-referral-${referralCode}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open in new tab
      window.open(qrUrl, "_blank", "noopener");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <QrCode className="h-4 w-4 text-teal" />
          Share in person — QR code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="shrink-0 rounded-2xl border border-navy-100/60 bg-white p-3 shadow-premium-sm">
            {qrUrl ? (
              // Intentionally plain img — QR code is not sensitive and
              // loads from a third-party API that doesn't need optimization
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt="Your referral QR code"
                width={180}
                height={180}
                className="block h-[180px] w-[180px]"
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center text-xs text-graphite-400">
                Loading…
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-sm text-graphite-600 leading-relaxed">
              Show this QR code to anyone in person and they'll land on a $50-off sign-up page
              credited to your referral code <strong className="text-navy">{referralCode}</strong>.
            </p>

            <div className="rounded-lg bg-navy-50/40 px-3 py-2 text-xs text-graphite-600 break-all">
              {referralUrl || "Loading…"}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyUrl}
                disabled={!referralUrl}
                className="gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy link"}
              </Button>
              <Button
                size="sm"
                variant="emerald"
                onClick={downloadQr}
                disabled={!qrUrl}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Download PNG
              </Button>
            </div>

            <p className="text-[11px] text-graphite-400">
              Print it on a business card, pin it to a gym board, or text it — scans credit your
              account automatically. $50 to your friend, $50 back to you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
