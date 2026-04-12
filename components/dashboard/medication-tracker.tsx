"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Check, X, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicationEntry {
  date: string;
  taken: boolean | null;
}

interface TreatmentInfo {
  medicationName: string | null;
  medicationDose: string | null;
  medicationFreq: string | null;
  nextRefillDate: Date | string | null;
}

interface MedicationTrackerProps {
  treatment: TreatmentInfo | null;
  todayTaken: boolean | null;
  last30Days: MedicationEntry[];
  onToggle?: (taken: boolean) => void;
}

export function MedicationTracker({ treatment, todayTaken, last30Days, onToggle }: MedicationTrackerProps) {
  // Adherence calculation (last 14 days)
  const last14 = last30Days.slice(0, 14);
  const takenCount = last14.filter((d) => d.taken === true).length;
  const expectedDoses = last14.length;
  const adherenceRate = expectedDoses > 0 ? Math.round((takenCount / expectedDoses) * 100) : 0;

  // Refill countdown
  const refillDate = treatment?.nextRefillDate ? new Date(treatment.nextRefillDate) : null;
  const daysToRefill = refillDate
    ? Math.max(0, Math.ceil((refillDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null;

  // Build 30-day calendar
  const calendarDays = buildCalendar(last30Days);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Pill className="h-4 w-4 text-teal" /> Medication Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current medication info */}
        {treatment?.medicationName && (
          <div className="rounded-xl bg-navy-50/50 p-3">
            <p className="text-sm font-bold text-navy">{treatment.medicationName}</p>
            <p className="text-xs text-graphite-400">
              {treatment.medicationDose && `${treatment.medicationDose} `}
              {treatment.medicationFreq && `\u00b7 ${treatment.medicationFreq}`}
            </p>
          </div>
        )}

        {/* Today's toggle */}
        <div className="flex items-center justify-between rounded-xl border border-navy-100/40 p-4">
          <div>
            <p className="text-sm font-medium text-navy">Did you take your medication today?</p>
            <p className="text-[10px] text-graphite-400">Tracking helps your care team optimize your plan</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={todayTaken === true ? "default" : "outline"}
              className={cn("gap-1", todayTaken === true && "bg-teal hover:bg-teal-600")}
              onClick={() => onToggle?.(true)}
            >
              <Check className="h-3.5 w-3.5" /> Yes
            </Button>
            <Button
              size="sm"
              variant={todayTaken === false ? "default" : "outline"}
              className={cn("gap-1", todayTaken === false && "bg-red-500 hover:bg-red-600")}
              onClick={() => onToggle?.(false)}
            >
              <X className="h-3.5 w-3.5" /> No
            </Button>
          </div>
        </div>

        {/* Adherence stats */}
        <div className="flex items-center gap-4">
          <div className="flex-1 rounded-xl bg-gradient-to-br from-teal-50 to-sage p-3 text-center">
            <p className="text-2xl font-bold text-navy">{adherenceRate}%</p>
            <p className="text-[10px] text-graphite-400">Adherence (14 days)</p>
          </div>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-gold-50 to-linen p-3 text-center">
            <p className="text-2xl font-bold text-navy">{takenCount}/{expectedDoses}</p>
            <p className="text-[10px] text-graphite-400">Doses taken</p>
          </div>
          {daysToRefill !== null && (
            <div className="flex-1 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-3 text-center">
              <CalendarDays className="mx-auto h-4 w-4 text-blue-500 mb-0.5" />
              <p className="text-2xl font-bold text-navy">{daysToRefill}</p>
              <p className="text-[10px] text-graphite-400">Days to refill</p>
            </div>
          )}
        </div>

        {/* 30-day heatmap calendar */}
        <div>
          <p className="text-xs font-medium text-navy mb-2">Last 30 Days</p>
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-center text-[9px] text-graphite-300 font-medium pb-1">{day}</div>
            ))}
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center text-[9px] font-medium",
                  day.empty
                    ? "bg-transparent"
                    : day.taken === true
                    ? "bg-teal/80 text-white"
                    : day.taken === false
                    ? "bg-red-100 text-red-400"
                    : "bg-gray-100 text-gray-300"
                )}
                title={day.empty ? "" : `${day.label}: ${day.taken === true ? "Taken" : day.taken === false ? "Missed" : "No data"}`}
              >
                {day.empty ? "" : day.dayNum}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-graphite-400">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-teal/80" /> Taken</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-100" /> Missed</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-gray-100" /> No data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CalendarDay {
  date: Date;
  dayNum: number;
  label: string;
  taken: boolean | null;
  empty: boolean;
}

function buildCalendar(entries: MedicationEntry[]): CalendarDay[] {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Map entries by date string
  const entryMap = new Map<string, boolean | null>();
  for (const entry of entries) {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    entryMap.set(key, entry.taken);
  }

  const result: CalendarDay[] = [];

  // Add empty cells for alignment to start of week
  const startDow = thirtyDaysAgo.getDay();
  for (let i = 0; i < startDow; i++) {
    result.push({ date: new Date(), dayNum: 0, label: "", taken: null, empty: true });
  }

  // Fill in 30 days
  for (let d = 0; d < 30; d++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + d);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    result.push({
      date,
      dayNum: date.getDate(),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      taken: entryMap.get(key) ?? null,
      empty: false,
    });
  }

  return result;
}
