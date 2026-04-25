"use client";

/**
 * StreakTierUpModal
 * ─────────────────────────────────────────────────────────────
 * Tier 7.4 — Celebratory modal fired when a user crosses a streak
 * milestone (7 / 14 / 30 / 60 / 90 / 180 days). Drives retention
 * psychology ("loss aversion" on streaks) and gives us a natural
 * moment to promote referrals — members who just hit a milestone
 * refer at ~3× the rate of members who haven't.
 *
 * Gating:
 *   - Fires once per milestone per user — stored in localStorage
 *   - Triggers on the first dashboard load after the streak crosses
 *     the threshold
 *   - Auto-dismisses if user closes it; won't re-fire for that tier
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Flame, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/analytics";

export interface StreakTierUpModalProps {
  streak: number;
  userEmail?: string;
}

// Tiers tuned to match the fire-emoji lore of other habit apps:
// weekly, biweekly, monthly, then every 30 days thereafter.
const TIERS = [7, 14, 30, 60, 90, 180, 365] as const;

function findTier(streak: number): number | null {
  // Return the highest tier the user has reached (so we don't spam if
  // they come back after a long break and the last-seen was lower)
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (streak >= TIERS[i]) return TIERS[i];
  }
  return null;
}

function tierCopy(tier: number): { headline: string; sub: string; badge: string } {
  switch (tier) {
    case 7:
      return {
        headline: "1 week strong 🔥",
        sub: "Seven days of consistent logging. You've officially built the habit — keep stacking.",
        badge: "Week One Warrior",
      };
    case 14:
      return {
        headline: "Two weeks in — you're in the 12%",
        sub: "Only 12% of members make it to day 14. Your body is adapting, and your consistency is rare.",
        badge: "Fortnight Force",
      };
    case 30:
      return {
        headline: "30 days — you changed your baseline",
        sub: "Research shows 30 days of consistent tracking rewires default behavior. You're past the hard part.",
        badge: "Month One Member",
      };
    case 60:
      return {
        headline: "60 days — this is who you are now",
        sub: "Two months of consistent consistency. Most members at this stage see their biggest biomarker improvements.",
        badge: "Two-Month Titan",
      };
    case 90:
      return {
        headline: "90 days — the transformation tier",
        sub: "You've lapped 95% of the fitness-app world. Now it gets automatic — this is the payoff phase.",
        badge: "Quarter-Year Champion",
      };
    case 180:
      return {
        headline: "Half a year. Seriously.",
        sub: "180 days of showing up. Your future self just got a massive head-start.",
        badge: "Half-Year Hero",
      };
    case 365:
      return {
        headline: "365 days. A full year.",
        sub: "One year of daily consistency. You're in a cohort of less than 0.5% of users. Nominate a friend to join you.",
        badge: "Year-One Legend",
      };
    default:
      return {
        headline: `${tier} days strong`,
        sub: "Keep going — consistency compounds.",
        badge: `${tier}-Day Streak`,
      };
  }
}

export function StreakTierUpModal({ streak, userEmail }: StreakTierUpModalProps) {
  const [show, setShow] = useState(false);
  const [tier, setTier] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentTier = findTier(streak);
    if (!currentTier) return;

    const key = `nj-streak-tier-${userEmail ?? "anon"}`;
    const lastSeen = Number(localStorage.getItem(key) || "0");
    if (currentTier <= lastSeen) return;

    // New tier! Celebrate it.
    localStorage.setItem(key, String(currentTier));
    setTier(currentTier);
    setShow(true);
    track("streak_tier_up", { tier: currentTier, streak, previous_tier: lastSeen });
  }, [streak, userEmail]);

  function handleClose() {
    setShow(false);
    track("streak_tier_up_dismiss", { tier });
  }

  function handleShare() {
    track("streak_tier_up_share", { tier });
    // Navigate to the dashboard referrals hub where the full sharing UX lives
    window.location.href = "/dashboard/referrals";
  }

  if (!show || !tier) return null;
  const copy = tierCopy(tier);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-premium-xl animate-fade-in-up">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebratory header */}
        <div className="relative bg-gradient-to-br from-gold via-gold-600 to-amber-600 px-6 py-8 text-center text-white">
          {/* Confetti-ish flames */}
          <div className="absolute top-4 left-6 text-2xl opacity-60">🔥</div>
          <div className="absolute top-8 right-10 text-xl opacity-60">✨</div>
          <div className="absolute bottom-3 left-10 text-lg opacity-60">🎉</div>

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-80">
              New milestone unlocked
            </p>
            <h2 className="mt-1 text-3xl font-bold">{copy.headline}</h2>
            <Badge className="mt-3 bg-white/20 text-white border-white/30 backdrop-blur">
              {copy.badge}
            </Badge>
          </div>
        </div>

        <div className="p-6 sm:p-7 text-center">
          <p className="text-sm text-graphite-600 leading-relaxed">{copy.sub}</p>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-gold-50 border border-gold-100 p-3">
              <p className="text-2xl font-bold text-navy">{streak}</p>
              <p className="text-[10px] text-graphite-400 mt-0.5">Day streak</p>
            </div>
            <div className="rounded-xl bg-navy-50/40 p-3">
              <p className="text-2xl font-bold text-navy">{tier}</p>
              <p className="text-[10px] text-graphite-400 mt-0.5">Tier hit</p>
            </div>
            <div className="rounded-xl bg-teal-50 border border-teal-100 p-3">
              <p className="text-2xl font-bold text-teal">
                {TIERS.find((t) => t > tier) ?? "∞"}
              </p>
              <p className="text-[10px] text-graphite-400 mt-0.5">Next tier</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {tier >= 14 && (
              <Button
                variant="gold"
                size="lg"
                className="w-full gap-2 rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share to unlock $50 credit
              </Button>
            )}
            <Link href="/dashboard/progress" onClick={handleClose} className="block">
              <Button variant="outline" size="lg" className="w-full gap-2 rounded-full">
                Log today's progress
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-[11px] text-graphite-400">
            Keep your streak alive — log any metric tomorrow to climb to{" "}
            {TIERS.find((t) => t > tier) ?? "the next tier"}.
          </p>
        </div>
      </div>
    </div>
  );
}
