"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, Check, Share2, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export interface ReferralPromptProps {
  /** Pass the user's actual referral code. Falls back to a generic code. */
  referralCode?: string;
  /** Optional first-person detail used in the share message. */
  inviterName?: string;
}

const SHARE_COPY =
  "I just started Nature's Journey — provider-guided GLP-1 weight loss. Get $50 off your first month with my link:";

export function ReferralPrompt({
  referralCode,
  inviterName,
}: ReferralPromptProps = {}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [fetchedCode, setFetchedCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // Tier 9.8 — if the caller didn't pass a code, try to fetch the user's
  // real one from /api/referrals. Graceful: unauthenticated users fall
  // through to the generic VITALFRIEND placeholder.
  useEffect(() => {
    if (referralCode) return; // caller supplied it explicitly
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/referrals", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { code?: string };
        if (!cancelled && data.code) setFetchedCode(data.code);
      } catch {
        // Non-blocking — stay on the generic code
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [referralCode]);

  const effectiveCode = referralCode ?? fetchedCode ?? "VITALFRIEND";
  const referralUrl = `${origin}/qualify?ref=${effectiveCode}`;
  const shareText = inviterName
    ? `${inviterName} here — ${SHARE_COPY}`
    : SHARE_COPY;
  const fullMessage = `${shareText} ${referralUrl}`;

  function trackShare(channel: string) {
    track(ANALYTICS_EVENTS.REFERRAL_INVITE_SEND, {
      channel,
      referral_code: effectiveCode,
    });
  }

  function copyLink() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText(referralUrl)
      .then(() => {
        setCopied(true);
        trackShare("copy_link");
        track(ANALYTICS_EVENTS.REFERRAL_LINK_COPY, { referral_code: effectiveCode });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Fallback — some browsers block clipboard without user gesture
      });
  }

  function shareNative() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    navigator
      .share({
        title: "Nature's Journey — GLP-1 Weight Loss",
        text: shareText,
        url: referralUrl,
      })
      .then(() => trackShare("native_share"))
      .catch(() => {
        // User cancelled — no-op
      });
  }

  function shareSms() {
    trackShare("sms");
    const text = encodeURIComponent(fullMessage);
    window.open(`sms:?&body=${text}`, "_blank");
  }

  function shareWhatsapp() {
    trackShare("whatsapp");
    const text = encodeURIComponent(fullMessage);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
  }

  function shareEmail() {
    trackShare("email");
    const subject = encodeURIComponent("Thought you might want to check this out");
    const body = encodeURIComponent(`${shareText}\n\n${referralUrl}\n\n— Nature's Journey`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  return (
    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-navy">Give $50, Get $50</h3>
          <p className="text-sm text-graphite-500">Share with friends and both save</p>
        </div>
      </div>

      <p className="text-sm text-graphite-600 mb-5">
        Share your link with friends who could benefit. They get{" "}
        <span className="font-bold text-navy">$50 off</span> their first month, and you get{" "}
        <span className="font-bold text-teal">$50 credit</span> toward your next month.
      </p>

      {/* Referral link copy box */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy truncate">
          {referralUrl || "Loading your link…"}
        </div>
        <Button
          variant={copied ? "default" : "outline"}
          size="sm"
          onClick={copyLink}
          disabled={!origin}
          className="shrink-0 gap-1.5"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Share buttons — Tier 6.3: added WhatsApp + Email, made native share
          mobile-only (desktop doesn't typically support it), tracked per channel */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {canNativeShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={shareNative}
            className="gap-1.5"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={shareSms} className="gap-1.5">
          <MessageCircle className="h-4 w-4" />
          Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareWhatsapp}
          className="gap-1.5"
        >
          {/* Inline WhatsApp glyph to avoid adding a new icon dependency */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current text-emerald-600"
            aria-hidden
          >
            <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.2 2.9 1.1 2.9.7 3.4.7.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.8 14.6L2 22l5.6-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.3-1.2l-.3-.2-3.2.8.8-3.1-.2-.3A8 8 0 1 1 12 20z" />
          </svg>
          WhatsApp
        </Button>
        <Button variant="outline" size="sm" onClick={shareEmail} className="gap-1.5">
          <Mail className="h-4 w-4" />
          Email
        </Button>
      </div>

      {/* Social proof nudge */}
      <div className="mt-4 rounded-lg bg-navy-50/50 px-3 py-2 text-center">
        <p className="text-xs text-graphite-400">
          <span className="font-semibold text-navy">2,100+ referrals</span> sent this month.
          Top referrer earned $350 in credits.
        </p>
      </div>
    </div>
  );
}
