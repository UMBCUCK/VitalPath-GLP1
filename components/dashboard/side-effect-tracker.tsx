"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SideEffectData {
  nausea: SeverityLevel;
  constipation: SeverityLevel;
  fatigue: SeverityLevel;
  headache: SeverityLevel;
  injectionSiteReaction: boolean;
  overallTolerance: number; // 1-5
}

type SeverityLevel = "none" | "mild" | "moderate" | "severe";

interface SideEffectTrackerProps {
  initialData?: SideEffectData | null;
  previousData?: SideEffectData | null;
  onSave?: (data: SideEffectData) => void;
}

const SEVERITY_OPTIONS: { value: SeverityLevel; label: string; emoji: string; color: string }[] = [
  { value: "none", label: "None", emoji: "\u2705", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "mild", label: "Mild", emoji: "\uD83D\uDE10", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "moderate", label: "Moderate", emoji: "\uD83D\uDE1F", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "severe", label: "Severe", emoji: "\uD83D\uDE23", color: "bg-red-50 text-red-700 border-red-200" },
];

const SIDE_EFFECTS: { key: keyof Pick<SideEffectData, "nausea" | "constipation" | "fatigue" | "headache">; label: string }[] = [
  { key: "nausea", label: "Nausea" },
  { key: "constipation", label: "Constipation" },
  { key: "fatigue", label: "Fatigue" },
  { key: "headache", label: "Headache" },
];

const DEFAULT_DATA: SideEffectData = {
  nausea: "none",
  constipation: "none",
  fatigue: "none",
  headache: "none",
  injectionSiteReaction: false,
  overallTolerance: 5,
};

export function SideEffectTracker({ initialData, previousData, onSave }: SideEffectTrackerProps) {
  const [data, setData] = useState<SideEffectData>(initialData || DEFAULT_DATA);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  function updateSeverity(key: keyof Pick<SideEffectData, "nausea" | "constipation" | "fatigue" | "headache">, value: SeverityLevel) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    onSave?.(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Compare trend with previous data
  function getTrend(key: keyof Pick<SideEffectData, "nausea" | "constipation" | "fatigue" | "headache">): "improved" | "same" | "worse" | null {
    if (!previousData) return null;
    const severityOrder: SeverityLevel[] = ["none", "mild", "moderate", "severe"];
    const prev = severityOrder.indexOf(previousData[key]);
    const curr = severityOrder.indexOf(data[key]);
    if (curr < prev) return "improved";
    if (curr > prev) return "worse";
    return "same";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal" /> How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {SIDE_EFFECTS.map((effect) => {
          const trend = getTrend(effect.key);
          return (
            <div key={effect.key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy">{effect.label}</span>
                {trend && (
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-medium",
                    trend === "improved" ? "text-emerald-600" : trend === "worse" ? "text-red-500" : "text-graphite-400"
                  )}>
                    {trend === "improved" ? (
                      <><TrendingDown className="h-3 w-3" /> Improved</>
                    ) : trend === "worse" ? (
                      <><TrendingUp className="h-3 w-3" /> Worse</>
                    ) : (
                      <><Minus className="h-3 w-3" /> Same</>
                    )}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SEVERITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateSeverity(effect.key, opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center transition-all",
                      data[effect.key] === opt.value
                        ? `${opt.color} border-current ring-1 ring-current/20`
                        : "border-gray-200 bg-white text-graphite-400 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-sm">{opt.emoji}</span>
                    <span className="text-[10px] font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Injection site reaction */}
        <div>
          <span className="text-sm font-medium text-navy">Injection site reaction</span>
          <div className="mt-2 flex gap-2">
            {[false, true].map((val) => (
              <button
                key={String(val)}
                onClick={() => { setData((prev) => ({ ...prev, injectionSiteReaction: val })); setSaved(false); }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-medium transition-all",
                  data.injectionSiteReaction === val
                    ? val ? "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200/50" : "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200/50"
                    : "border-gray-200 bg-white text-graphite-400 hover:bg-gray-50"
                )}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {/* Overall tolerance */}
        <div>
          <span className="text-sm font-medium text-navy">Overall tolerance</span>
          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => { setData((prev) => ({ ...prev, overallTolerance: star })); setSaved(false); }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-all",
                  star <= data.overallTolerance
                    ? "bg-gold-50 border-gold-200 text-gold-500"
                    : "border-gray-200 bg-white text-gray-200"
                )}
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} size="sm" className="w-full">
          {saved ? "Saved!" : "Save Side Effects"}
        </Button>
      </CardContent>
    </Card>
  );
}

/** Parse side effect data from a progress entry notes field */
export function parseSideEffectData(notes: string | null): SideEffectData | null {
  if (!notes) return null;
  try {
    const parsed = JSON.parse(notes);
    if (parsed && typeof parsed.nausea === "string") {
      return parsed as SideEffectData;
    }
  } catch {
    // Not JSON or not side effect data
  }
  return null;
}
