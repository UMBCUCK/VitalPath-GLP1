"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, User, FileText, Target, Scale, Utensils, ArrowRight } from "lucide-react";
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
}

export function OnboardingChecklist({ hasProfile, hasIntake, hasGoalWeight, hasFirstWeight, hasViewedMeals }: OnboardingChecklistProps) {
  const items: OnboardingItem[] = [
    { id: "profile", label: "Complete your profile", description: "Add your health details and preferences", href: "/dashboard/settings", icon: User, completed: hasProfile },
    { id: "intake", label: "Complete medical intake", description: "Required for provider evaluation", href: "/intake", icon: FileText, completed: hasIntake },
    { id: "goal", label: "Set your weight goal", description: "Define where you want to be", href: "/dashboard/progress", icon: Target, completed: hasGoalWeight },
    { id: "weight", label: "Log your first weight", description: "Start tracking your progress", href: "/dashboard/progress", icon: Scale, completed: hasFirstWeight },
    { id: "meals", label: "Explore meal plans", description: "Browse recipes and nutrition tools", href: "/dashboard/meals", icon: Utensils, completed: hasViewedMeals },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  if (completedCount === items.length) return null;

  return (
    <Card className="border-teal/20 bg-gradient-to-r from-teal-50/30 to-sage/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Getting Started</CardTitle>
          <span className="text-xs font-semibold text-teal">{completedCount}/{items.length} complete</span>
        </div>
        <Progress value={progress} className="mt-2 h-1.5" />
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.completed ? "#" : item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              item.completed ? "opacity-60" : "hover:bg-white/60"
            )}
          >
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
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
              <p className="text-[10px] text-graphite-400">{item.description}</p>
            </div>
            {!item.completed && <ArrowRight className="h-3.5 w-3.5 text-graphite-300" />}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
