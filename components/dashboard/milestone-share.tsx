"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Check } from "lucide-react";
import { track } from "@/lib/analytics";

interface MilestoneShareProps {
  weightLost: number;
  daysOnProgram: number;
  streakDays: number;
}

export function MilestoneShare({ weightLost, daysOnProgram, streakDays }: MilestoneShareProps) {
  const [copied, setCopied] = useState(false);

  const milestones = [5, 10, 15, 20, 25, 30, 40, 50];
  const currentMilestone = milestones.reduce((best, m) => weightLost >= m ? m : best, 0);

  if (currentMilestone < 5) return null;

  const shareText = `I just reached a ${currentMilestone}-pound milestone on my health journey! ${daysOnProgram} days of consistency and structured support are paying off.`;
  const shareUrl = process.env.NEXT_PUBLIC_APP_URL || "https://naturesjourneyhealth.com";

  function copyLink() {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}/referrals`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track("milestone_share", { method: "copy", milestone: currentMilestone });
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
    track("milestone_share", { method: "twitter", milestone: currentMilestone });
  }

  return (
    <Card className="bg-gradient-to-r from-teal-50/50 to-sage/30 border-teal/20">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white text-lg">
            🎉
          </div>
          <div>
            <p className="text-base font-bold text-navy">{currentMilestone} lbs lost!</p>
            <p className="text-xs text-graphite-400">{daysOnProgram} days · {streakDays}-day streak</p>
          </div>
          <Badge variant="default" className="ml-auto">Milestone</Badge>
        </div>

        {/* Achievement card preview */}
        <div className="rounded-xl bg-gradient-to-br from-navy to-atlantic p-4 text-white text-center mb-3">
          <p className="text-3xl font-bold">{currentMilestone} lbs</p>
          <p className="text-sm text-navy-300 mt-1">milestone reached</p>
          <div className="mt-2 flex justify-center gap-4 text-xs text-navy-400">
            <span>{daysOnProgram} days</span>
            <span>·</span>
            <span>{streakDays}-day streak</span>
          </div>
          <p className="mt-2 text-[10px] text-navy-500">Nature's Journey Health</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={copyLink}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={shareTwitter}>
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>

        <p className="mt-2 text-[10px] text-graphite-300">No personal health data is shared. Only your milestone number.</p>
      </CardContent>
    </Card>
  );
}
