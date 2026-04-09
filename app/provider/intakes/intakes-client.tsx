"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface Intake {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  state: string;
  heightFeet: number;
  heightInches: number;
  weightLbs: number;
  goalWeightLbs: number | null;
  medications: string | null;
  allergies: string | null;
  medicalHistory: string;
  conditions: unknown;
  status: string;
  eligibilityResult: string | null;
  consentGiven: boolean;
  hipaaConsent: boolean;
  telehealthConsentGiven: boolean;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: Date;
  user: { id: string; firstName: string | null; lastName: string | null; email: string };
}

export function IntakeReviewClient({ intakes, providerId }: { intakes: Intake[]; providerId: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string[]>([]);

  // Prescription form
  const [rxForm, setRxForm] = useState({ medicationName: "Compounded Semaglutide", dose: "0.25mg", frequency: "Weekly injection" });
  const [clinicalRationale, setClinicalRationale] = useState("");
  const [denyReason, setDenyReason] = useState("");

  async function approveIntake(intake: Intake) {
    await fetch("/api/admin/intakes/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intakeId: intake.id,
        userId: intake.userId,
        providerId,
        medication: rxForm,
        clinicalRationale,
      }),
    });
    setProcessed((p) => [...p, intake.id]);
    setClinicalRationale("");
  }

  async function denyIntake(intakeId: string) {
    await fetch("/api/admin/intakes/deny", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intakeId, reason: denyReason }),
    });
    setProcessed((p) => [...p, intakeId]);
    setDenyReason("");
  }

  const pending = intakes.filter((i) => !processed.includes(i.id));
  const bmi = (i: Intake) => Math.round((i.weightLbs / ((i.heightFeet * 12 + i.heightInches) ** 2)) * 703 * 10) / 10;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Intake Reviews</h2>
        <p className="text-sm text-graphite-400">{pending.length} pending evaluations</p>
      </div>

      {pending.length === 0 ? (
        <Card className="py-12 text-center"><CardContent><Check className="mx-auto h-10 w-10 text-teal" /><p className="mt-3 text-sm text-graphite-400">All intakes reviewed</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {pending.map((intake) => {
            const expanded = expandedId === intake.id;
            const conditions = Array.isArray(intake.conditions) ? intake.conditions as string[] : [];

            return (
              <Card key={intake.id}>
                <button onClick={() => setExpandedId(expanded ? null : intake.id)} className="flex w-full items-center justify-between p-5 text-left">
                  <div>
                    <p className="text-base font-bold text-navy">{intake.firstName} {intake.lastName}</p>
                    <p className="text-xs text-graphite-400">{intake.state} &middot; BMI {bmi(intake)} &middot; {intake.weightLbs} lbs &middot; Submitted {intake.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Pending Review</Badge>
                    {expanded ? <ChevronUp className="h-4 w-4 text-graphite-400" /> : <ChevronDown className="h-4 w-4 text-graphite-400" />}
                  </div>
                </button>

                {expanded && (
                  <CardContent className="border-t border-navy-100/40 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-3">
                        <div><p className="text-xs font-semibold text-navy">Personal</p><p className="text-sm text-graphite-500">{intake.email} &middot; {intake.phone}</p><p className="text-sm text-graphite-500">DOB: {intake.dateOfBirth} &middot; {intake.heightFeet}&apos;{intake.heightInches}&quot;</p></div>
                        <div><p className="text-xs font-semibold text-navy">Medications</p><p className="text-sm text-graphite-500">{intake.medications || "None reported"}</p></div>
                        <div><p className="text-xs font-semibold text-navy">Allergies</p><p className="text-sm text-graphite-500">{intake.allergies || "None reported"}</p></div>
                      </div>
                      <div className="space-y-3">
                        <div><p className="text-xs font-semibold text-navy">Medical History</p><p className="text-sm text-graphite-500 leading-relaxed">{intake.medicalHistory}</p></div>
                        {conditions.length > 0 && (
                          <div><p className="text-xs font-semibold text-navy">Conditions</p><div className="flex flex-wrap gap-1 mt-1">{conditions.map((c, i) => <Badge key={i} variant="secondary" className="text-[9px]">{c}</Badge>)}</div></div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={intake.consentGiven ? "success" : "destructive"}>Treatment: {intake.consentGiven ? "Yes" : "No"}</Badge>
                          <Badge variant={intake.hipaaConsent ? "success" : "destructive"}>HIPAA: {intake.hipaaConsent ? "Yes" : "No"}</Badge>
                          <Badge variant={intake.telehealthConsentGiven ? "success" : "destructive"}>Telehealth: {intake.telehealthConsentGiven ? "Yes" : "No"}</Badge>
                        </div>
                      </div>
                    </div>

                    {intake.eligibilityResult === "ALTERNATIVE_PATH" && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <p className="text-sm text-amber-700 font-medium">Contraindication flagged — review carefully</p>
                      </div>
                    )}

                    {/* Prescription form */}
                    <div className="mt-4 rounded-xl border border-teal/20 bg-teal-50/20 p-4">
                      <p className="text-sm font-bold text-navy mb-3">Prescribe (if approving)</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div><label className="text-xs font-medium text-navy">Medication</label><Input value={rxForm.medicationName} onChange={(e) => setRxForm((f) => ({ ...f, medicationName: e.target.value }))} /></div>
                        <div><label className="text-xs font-medium text-navy">Starting Dose</label><Input value={rxForm.dose} onChange={(e) => setRxForm((f) => ({ ...f, dose: e.target.value }))} /></div>
                        <div><label className="text-xs font-medium text-navy">Frequency</label><Input value={rxForm.frequency} onChange={(e) => setRxForm((f) => ({ ...f, frequency: e.target.value }))} /></div>
                      </div>
                      <div className="mt-3">
                        <label className="text-xs font-medium text-navy">Clinical Rationale (required for audit compliance)</label>
                        <textarea
                          value={clinicalRationale}
                          onChange={(e) => setClinicalRationale(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:ring-1 focus:ring-teal min-h-[60px] resize-y"
                          placeholder="Document clinical reasoning for this prescribing decision..."
                        />
                      </div>
                    </div>

                    {/* Denial reason */}
                    <div className="mt-3">
                      <label className="text-xs font-medium text-navy">Reason for denial (if denying)</label>
                      <textarea
                        value={denyReason}
                        onChange={(e) => setDenyReason(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:ring-1 focus:ring-teal min-h-[40px] resize-y"
                        placeholder="Document reason for denial..."
                      />
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button className="gap-1" onClick={() => approveIntake(intake)} disabled={!clinicalRationale.trim()}><Check className="h-4 w-4" /> Approve & Prescribe</Button>
                      <Button variant="destructive" className="gap-1" onClick={() => denyIntake(intake.id)}><X className="h-4 w-4" /> Deny</Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
