"use client";

import { useState } from "react";
import { Gift, Copy, Check, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ReferralPrompt() {
  const [copied, setCopied] = useState(false);
  const referralCode = "VITALFRIEND";
  const referralUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/quiz?ref=${referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: "Nature's Journey — GLP-1 Weight Loss",
        text: "I just started Nature's Journey and you can save $50 on your first month with my referral link:",
        url: referralUrl,
      });
    }
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
        Share your referral link with friends who could benefit from Nature's Journey.
        They get <span className="font-bold text-navy">$50 off</span> their first month,
        and you get <span className="font-bold text-teal">$50 credit</span> toward your next month.
      </p>

      {/* Referral link copy box */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy truncate">
          {referralUrl}
        </div>
        <Button
          variant={copied ? "default" : "outline"}
          size="sm"
          onClick={copyLink}
          className="shrink-0 gap-1.5"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareNative}
          className="flex-1 gap-1.5"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const text = encodeURIComponent(`I just started Nature's Journey for GLP-1 weight loss. Get $50 off your first month: ${referralUrl}`);
            window.open(`sms:?body=${text}`, "_blank");
          }}
          className="flex-1 gap-1.5"
        >
          <MessageCircle className="h-4 w-4" />
          Text a Friend
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
