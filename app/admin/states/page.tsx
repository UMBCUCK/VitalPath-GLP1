"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, X, ToggleLeft, ToggleRight } from "lucide-react";

interface StateItem {
  code: string;
  name: string;
  available: boolean;
}

const initialStates: StateItem[] = [
  { code: "AL", name: "Alabama", available: true }, { code: "AK", name: "Alaska", available: false },
  { code: "AZ", name: "Arizona", available: true }, { code: "AR", name: "Arkansas", available: false },
  { code: "CA", name: "California", available: true }, { code: "CO", name: "Colorado", available: true },
  { code: "CT", name: "Connecticut", available: true }, { code: "DE", name: "Delaware", available: false },
  { code: "FL", name: "Florida", available: true }, { code: "GA", name: "Georgia", available: true },
  { code: "HI", name: "Hawaii", available: false }, { code: "ID", name: "Idaho", available: false },
  { code: "IL", name: "Illinois", available: true }, { code: "IN", name: "Indiana", available: true },
  { code: "IA", name: "Iowa", available: false }, { code: "KS", name: "Kansas", available: false },
  { code: "KY", name: "Kentucky", available: false }, { code: "LA", name: "Louisiana", available: false },
  { code: "ME", name: "Maine", available: false }, { code: "MD", name: "Maryland", available: true },
  { code: "MA", name: "Massachusetts", available: true }, { code: "MI", name: "Michigan", available: true },
  { code: "MN", name: "Minnesota", available: true }, { code: "MS", name: "Mississippi", available: false },
  { code: "MO", name: "Missouri", available: false }, { code: "MT", name: "Montana", available: false },
  { code: "NE", name: "Nebraska", available: false }, { code: "NV", name: "Nevada", available: true },
  { code: "NH", name: "New Hampshire", available: false }, { code: "NJ", name: "New Jersey", available: true },
  { code: "NM", name: "New Mexico", available: false }, { code: "NY", name: "New York", available: true },
  { code: "NC", name: "North Carolina", available: true }, { code: "ND", name: "North Dakota", available: false },
  { code: "OH", name: "Ohio", available: true }, { code: "OK", name: "Oklahoma", available: false },
  { code: "OR", name: "Oregon", available: true }, { code: "PA", name: "Pennsylvania", available: true },
  { code: "RI", name: "Rhode Island", available: false }, { code: "SC", name: "South Carolina", available: false },
  { code: "SD", name: "South Dakota", available: false }, { code: "TN", name: "Tennessee", available: true },
  { code: "TX", name: "Texas", available: true }, { code: "UT", name: "Utah", available: false },
  { code: "VT", name: "Vermont", available: false }, { code: "VA", name: "Virginia", available: true },
  { code: "WA", name: "Washington", available: true }, { code: "WV", name: "West Virginia", available: false },
  { code: "WI", name: "Wisconsin", available: false }, { code: "WY", name: "Wyoming", available: false },
];

export default function AdminStatesPage() {
  const [states, setStates] = useState<StateItem[]>(initialStates);

  function toggleState(code: string) {
    setStates((prev) => prev.map((s) => s.code === code ? { ...s, available: !s.available } : s));
  }

  const availableCount = states.filter((s) => s.available).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">State Availability</h2>
        <p className="text-sm text-graphite-400">Toggle which states offer VitalPath telehealth services</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><MapPin className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Available States</p><p className="text-xl font-bold text-teal">{availableCount}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><X className="h-5 w-5 text-graphite-300" /><div><p className="text-xs text-graphite-400">Unavailable</p><p className="text-xl font-bold text-navy">{50 - availableCount}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Check className="h-5 w-5 text-emerald-500" /><div><p className="text-xs text-graphite-400">Coverage</p><p className="text-xl font-bold text-navy">{Math.round((availableCount / 50) * 100)}%</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All States</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {states.map((state) => (
              <button
                key={state.code}
                onClick={() => toggleState(state.code)}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  state.available
                    ? "border-teal/30 bg-teal-50/30 hover:bg-teal-50/60"
                    : "border-navy-100/40 bg-white hover:bg-navy-50/30"
                }`}
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-navy">{state.code}</p>
                  <p className="text-[10px] text-graphite-400 truncate">{state.name}</p>
                </div>
                {state.available ? (
                  <ToggleRight className="h-5 w-5 text-teal shrink-0" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-graphite-300 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
