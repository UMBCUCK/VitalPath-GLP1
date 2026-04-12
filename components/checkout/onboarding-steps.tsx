"use client";

import { ClipboardCheck, FileText, Truck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Provider reviews your profile",
    description: "A licensed provider evaluates your health history and determines the right treatment approach for you.",
    timeline: "Within 24 hours (business days)",
    timelineColor: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    icon: FileText,
    title: "Treatment plan created",
    description: "Your personalized treatment plan is developed, including medication type, dosing schedule, and care milestones.",
    timeline: "1-2 business days",
    timelineColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    icon: Truck,
    title: "Medication ships",
    description: "If prescribed, your medication ships from a state-licensed pharmacy with discreet, temperature-controlled packaging.",
    timeline: "2-3 business days",
    timelineColor: "bg-gold-50 text-gold-700 border-gold-200",
  },
  {
    icon: Sparkles,
    title: "Start your journey",
    description: "You'll receive detailed first-dose instructions and your care team will be available for questions from day one.",
    timeline: "Dose instructions included",
    timelineColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export function OnboardingSteps() {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.title} className="relative flex gap-4">
          {/* Vertical connector line */}
          {index < steps.length - 1 && (
            <div className="absolute left-[19px] top-10 bottom-0 w-px bg-navy-100/60" />
          )}

          {/* Step icon */}
          <div className={cn(
            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-teal-50 to-sage"
          )}>
            <step.icon className="h-5 w-5 text-teal" />
          </div>

          {/* Step content */}
          <div className="flex-1 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-navy">{step.title}</h4>
              <Badge
                variant="outline"
                className={cn("text-[10px] font-semibold border", step.timelineColor)}
              >
                {step.timeline}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-graphite-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
