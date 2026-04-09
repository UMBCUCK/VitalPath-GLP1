"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StateData {
  id: string;
  stateCode: string;
  stateName: string;
  isAvailable: boolean;
  requiresPhysicalExam: boolean;
  requiresPreexistingRelationship: boolean;
  informedConsentRequirement: string | null;
  cpomRestrictions: string | null;
}

export function StatesClient({ states: initialStates }: { states: StateData[] }) {
  const [states, setStates] = useState<StateData[]>(initialStates);
  const [togglingCode, setTogglingCode] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const availableCount = states.filter((s) => s.isAvailable).length;
  const totalCount = states.length;
  const complianceFlags = states.filter(
    (s) => s.requiresPhysicalExam || s.requiresPreexistingRelationship
  ).length;

  async function toggleState(stateCode: string) {
    const current = states.find((s) => s.stateCode === stateCode);
    if (!current) return;

    setTogglingCode(stateCode);
    try {
      const res = await fetch("/api/admin/states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateCode,
          isAvailable: !current.isAvailable,
        }),
      });

      if (res.ok) {
        setStates((prev) =>
          prev.map((s) =>
            s.stateCode === stateCode
              ? { ...s, isAvailable: !s.isAvailable }
              : s
          )
        );
      }
    } catch {
      // silently fail, state stays the same
    } finally {
      setTogglingCode(null);
    }
  }

  function toggleExpand(stateCode: string) {
    setExpandedCode((prev) => (prev === stateCode ? null : stateCode));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">State Availability</h2>
        <p className="text-sm text-graphite-400">
          Toggle which states offer VitalPath telehealth services
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <MapPin className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Available States</p>
              <p className="text-xl font-bold text-teal">{availableCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <X className="h-5 w-5 text-graphite-300" />
            <div>
              <p className="text-xs text-graphite-400">Unavailable</p>
              <p className="text-xl font-bold text-navy">
                {totalCount - availableCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-graphite-400">Compliance Flags</p>
              <p className="text-xl font-bold text-navy">{complianceFlags}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All States ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {states.map((state) => {
              const hasCompliance =
                state.requiresPhysicalExam ||
                state.requiresPreexistingRelationship ||
                state.informedConsentRequirement ||
                state.cpomRestrictions;
              const isExpanded = expandedCode === state.stateCode;

              return (
                <div
                  key={state.stateCode}
                  className={`rounded-xl border transition-all ${
                    state.isAvailable
                      ? "border-teal/30 bg-teal-50/30"
                      : "border-navy-100/40 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {hasCompliance && (
                        <button
                          onClick={() => toggleExpand(state.stateCode)}
                          className="shrink-0 rounded p-0.5 hover:bg-navy-50/50"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-graphite-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-graphite-400" />
                          )}
                        </button>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-navy">
                            {state.stateCode}
                          </p>
                          {hasCompliance && (
                            <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-graphite-400 truncate">
                          {state.stateName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleState(state.stateCode)}
                      disabled={togglingCode === state.stateCode}
                      className={`shrink-0 transition-opacity ${
                        togglingCode === state.stateCode ? "opacity-50" : ""
                      }`}
                    >
                      {state.isAvailable ? (
                        <ToggleRight className="h-5 w-5 text-teal" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-graphite-300" />
                      )}
                    </button>
                  </div>

                  {isExpanded && hasCompliance && (
                    <div className="border-t border-navy-100/30 px-3 py-2 space-y-1.5">
                      {state.requiresPhysicalExam && (
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-red-400 shrink-0" />
                          <span className="text-[10px] text-graphite-500">
                            Requires physical exam
                          </span>
                        </div>
                      )}
                      {state.requiresPreexistingRelationship && (
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-red-400 shrink-0" />
                          <span className="text-[10px] text-graphite-500">
                            Requires preexisting relationship
                          </span>
                        </div>
                      )}
                      {state.informedConsentRequirement && (
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="text-[10px] text-graphite-500">
                            Consent: {state.informedConsentRequirement}
                          </span>
                        </div>
                      )}
                      {state.cpomRestrictions && (
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="text-[10px] text-graphite-500 line-clamp-2">
                            CPOM: {state.cpomRestrictions}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
