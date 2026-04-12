"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Assessment", shortLabel: "Quiz" },
  { label: "Medical Intake", shortLabel: "Intake" },
  { label: "Choose Plan", shortLabel: "Plan" },
  { label: "Payment", shortLabel: "Pay" },
];

export function CheckoutProgress({ currentStep = 3 }: { currentStep?: number }) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                    isCompleted && "bg-teal text-white",
                    isCurrent && "bg-navy text-white ring-4 ring-navy/20",
                    !isCompleted && !isCurrent && "bg-navy-100 text-graphite-400"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[10px] font-medium",
                    isCurrent ? "text-navy" : isCompleted ? "text-teal" : "text-graphite-300"
                  )}
                >
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.shortLabel}</span>
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 h-0.5 flex-1">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      isCompleted ? "bg-teal" : "bg-navy-100"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
