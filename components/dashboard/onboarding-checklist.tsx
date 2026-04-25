"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, User, FileText, Target, Scale, Utensils, MessageCircle, ArrowRight, X, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: typeof User;
  completed: boolean;
}

interface OnboardingChecklistProps {
  hasProfile: boolean;
  hasIntake: boolean;
  hasGoalWeight: boolean;
  hasFirstWeight: boolean;
  hasViewedMeals: boolean;
  progressEntryCount?: number;
  accountAgeDays?: number;
}

const DISMISS_KEY = "vp-onboarding-dismissed";

export function OnboardingChecklist({
  hasProfile,
  hasIntake,
  hasGoalWeight,
  hasFirstWeight,
  hasViewedMeals,
  progressEntryCount = 0,
  accountAgeDays = 0,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
    }
  }, []);

  const items: OnboardingItem[] = [
    { id: "profile", label: "Complete your profile", description: "Add your height, weight, and goal", href: "/dashboard/settings", icon: User, completed: hasProfile },
    { id: "weight", label: "Log your first weight", description: "Start tracking your progress", href: "/dashboard/progress", icon: Scale, completed: hasFirstWeight },
    { id: "protein", label: "Set your protein target", description: "Aim for ~1g per pound of lean body mass", href: "/dashboard/progress", icon: Target, completed: hasGoalWeight },
    { id: "meals", label: "Explore your meal plan", description: "Browse recipes built for your goals", href: "/dashboard/meals", icon: Utensils, completed: hasViewedMeals },
    { id: "messages", label: "Message your care team", description: "Introduce yourself to your provider", href: "/dashboard/messages", icon: MessageCircle, completed: hasIntake },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const progress = (completedCount / items.length) * 100;
  const allComplete = completedCount === items.length;

  // Show confetti when all complete
  useEffect(() => {
    if (allComplete && !dismissed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [allComplete, dismissed]);

  // Hide for users who have been around a while with enough entries, or who dismissed
  if (dismissed) return null;
  if (!allComplete && accountAgeDays > 7 && progressEntryCount >= 3) return null;

  function handleDismiss() {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "true");
    }
  }

  // All complete celebration
  if (allComplete) {
    return (
      <Card className="relative overflow-hidden border-teal/30 bg-gradient-to-r from-teal-50/50 to-sage/30">
        {showConfetti && <ConfettiOverlay />}
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-white">
              <PartyPopper className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-navy">You&apos;re all set!</p>
              <p className="text-sm text-graphite-500">All onboarding steps complete. You&apos;re on your way.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tier 10.5 — dynamic motivation sub-text tied to progress %.
  // Small psychological nudge that reframes the bar from "5 chores to do"
  // into "you're already Y% of the way there."
  const motivation =
    progress >= 80
      ? "Almost there — 1 step from fully activated"
      : progress >= 60
        ? "You're on a roll — more than halfway"
        : progress >= 40
          ? "Momentum is building — keep stacking"
          : progress >= 20
            ? "Great start — next step unlocks tracking"
            : "First step is the biggest — let's go";

  return (
    <Card className="border-teal/20 bg-gradient-to-r from-teal-50/30 to-sage/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Getting Started</CardTitle>
            <p className="mt-0.5 text-[11px] text-graphite-500">{motivation}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal">
              {Math.round(progress)}% &middot; {completedCount}/{items.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0 text-graphite-300 hover:text-graphite-500" title="Dismiss">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="mt-2 h-1.5" />
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.completed ? "#" : item.href}
            aria-disabled={item.completed}
            tabIndex={item.completed ? -1 : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors active:bg-white/80",
              item.completed ? "opacity-60 pointer-events-none" : "hover:bg-white/60"
            )}
          >
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              item.completed ? "bg-teal" : "bg-white border border-navy-200"
            )}>
              {item.completed ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <item.icon className="h-4 w-4 text-graphite-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", item.completed ? "text-graphite-400 line-through" : "text-navy")}>{item.label}</p>
              <p className="text-xs text-graphite-500">{item.description}</p>
            </div>
            {!item.completed && <ArrowRight className="h-4 w-4 text-graphite-300" aria-hidden="true" />}
          </Link>
        ))}

        <div className="pt-1">
          <button
            onClick={handleDismiss}
            className="text-xs text-graphite-400 hover:text-graphite-600 transition-colors"
          >
            I&apos;ve got this — dismiss
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/** Simple CSS confetti overlay */
function ConfettiOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-sm opacity-90"
          style={{
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            backgroundColor: ["#0D9488", "#D4A853", "#1E3A5F", "#22D3EE", "#F59E0B", "#10B981"][i % 6],
            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.8}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { top: -10%; opacity: 1; }
          100% { top: 110%; opacity: 0; transform: rotate(720deg); }
        }
      `}</style>
    </div>
  );
}
