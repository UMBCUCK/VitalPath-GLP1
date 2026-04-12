"use client";

import { useState, useEffect } from "react";
import { Trophy, Users, Flame, Target, Droplets, ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  metric: string;
  target: number;
  unit: string;
  durationDays: number;
  reward: string;
  participants: number;
}

const ACTIVE_CHALLENGES: Challenge[] = [
  {
    id: "protein-week",
    name: "Protein Power Week",
    description: "Hit your daily protein target 5 out of 7 days this week",
    icon: Target,
    color: "from-gold-400 to-orange-500",
    metric: "protein_days",
    target: 5,
    unit: "days",
    durationDays: 7,
    reward: "Protein Master badge + 10% off supplements",
    participants: 847,
  },
  {
    id: "hydration-challenge",
    name: "Hydration Hero",
    description: "Drink your full water target every day for 5 days",
    icon: Droplets,
    color: "from-blue-400 to-cyan-500",
    metric: "water_days",
    target: 5,
    unit: "days",
    durationDays: 7,
    reward: "Hydration Hero badge + custom water schedule",
    participants: 623,
  },
  {
    id: "streak-builder",
    name: "21-Day Streak Builder",
    description: "Log your progress for 21 consecutive days",
    icon: Flame,
    color: "from-orange-400 to-red-500",
    metric: "streak",
    target: 21,
    unit: "days",
    durationDays: 30,
    reward: "Streak Champion badge + 1 month free meal plans",
    participants: 412,
  },
];

const STORAGE_KEY = "vp-challenge-progress";

interface ChallengeProgress {
  challengeId: string;
  enrolled: boolean;
  enrolledAt: string;
  current: number;
  completed: boolean;
}

export function CohortChallenge() {
  const [progress, setProgress] = useState<Record<string, ChallengeProgress>>({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch { /* */ }
  }, []);

  function saveProgress(next: Record<string, ChallengeProgress>) {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* */ }
  }

  function enroll(challengeId: string) {
    const next = {
      ...progress,
      [challengeId]: {
        challengeId,
        enrolled: true,
        enrolledAt: new Date().toISOString(),
        current: 0,
        completed: false,
      },
    };
    saveProgress(next);
    track("challenge_enrolled", { challenge: challengeId });
  }

  function incrementProgress(challengeId: string) {
    const challenge = ACTIVE_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) return;
    const current = progress[challengeId];
    if (!current || current.completed) return;

    const newCurrent = Math.min(current.current + 1, challenge.target);
    const next = {
      ...progress,
      [challengeId]: {
        ...current,
        current: newCurrent,
        completed: newCurrent >= challenge.target,
      },
    };
    saveProgress(next);
    if (newCurrent >= challenge.target) {
      track("challenge_completed", { challenge: challengeId });
    }
  }

  const displayed = showAll ? ACTIVE_CHALLENGES : ACTIVE_CHALLENGES.slice(0, 2);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-bold text-navy">Monthly Challenges</h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            <Users className="h-2.5 w-2.5 mr-1" />
            {ACTIVE_CHALLENGES.reduce((s, c) => s + c.participants, 0).toLocaleString()} participating
          </Badge>
        </div>

        <div className="space-y-3">
          {displayed.map((challenge) => {
            const prog = progress[challenge.id];
            const enrolled = prog?.enrolled;
            const completed = prog?.completed;
            const current = prog?.current || 0;
            const pct = (current / challenge.target) * 100;

            return (
              <div
                key={challenge.id}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  completed
                    ? "border-emerald-200 bg-emerald-50/50"
                    : enrolled
                      ? "border-teal-200 bg-teal-50/30"
                      : "border-navy-100/60 bg-white hover:border-navy-200"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", challenge.color)}>
                    <challenge.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy">{challenge.name}</h4>
                      {completed && <Badge className="bg-emerald-500 text-[9px]">Complete!</Badge>}
                    </div>
                    <p className="text-xs text-graphite-500 mt-0.5">{challenge.description}</p>

                    {enrolled && !completed && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-graphite-400">{current}/{challenge.target} {challenge.unit}</span>
                          <span className="text-teal font-medium">{Math.round(pct)}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                        <button
                          onClick={() => incrementProgress(challenge.id)}
                          className="mt-2 text-xs font-medium text-teal hover:underline flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" /> Log today&apos;s progress
                        </button>
                      </div>
                    )}

                    {!enrolled && (
                      <div className="mt-2 flex items-center gap-3">
                        <Button size="sm" variant="outline" className="text-xs gap-1 h-7" onClick={() => enroll(challenge.id)}>
                          Join Challenge <ArrowRight className="h-3 w-3" />
                        </Button>
                        <span className="text-[10px] text-graphite-400">
                          <Users className="inline h-2.5 w-2.5 mr-0.5" />{challenge.participants} joined
                        </span>
                      </div>
                    )}

                    {completed && (
                      <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Reward: {challenge.reward}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showAll && ACTIVE_CHALLENGES.length > 2 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 w-full text-center text-xs font-medium text-teal hover:underline"
          >
            View all {ACTIVE_CHALLENGES.length} challenges
          </button>
        )}
      </CardContent>
    </Card>
  );
}
