"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Pill, User, Activity, Heart, AlertTriangle, Shield,
  Phone, Calendar, MapPin, FileText, Check, X, Printer, ClipboardList,
  Scale, Target, Stethoscope,
} from "lucide-react";

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
  medicationInterest: string | null;
  medicationInterestLabel: string | null;
  status: string;
  eligibilityResult: string | null;
  consentGiven: boolean;
  hipaaConsent: boolean;
  telehealthConsentGiven: boolean;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  hasThyroidCancer?: boolean;
  hasMEN2?: boolean;
  isPregnant?: boolean;
  hasPancreatitis?: boolean;
  hasGastroparesis?: boolean;
  hasDiabeticRetinopathy?: boolean;
  hasGallbladderDisease?: boolean;
  hasKidneyDisease?: boolean;
  hasEatingDisorder?: boolean;
  hasSuicidalIdeation?: boolean;
  createdAt: string;
  user: { id: string; firstName: string | null; lastName: string | null; email: string; createdAt: string };
}

interface ConsentRecord {
  id: string;
  consentType: string;
  consentVersion: string;
  ipAddress: string | null;
  createdAt: string;
}

interface Props {
  intake: Intake;
  consents: ConsentRecord[];
  providerId: string;
}

function bmi(weightLbs: number, heightFeet: number, heightInches: number) {
  const totalInches = heightFeet * 12 + heightInches;
  return Math.round((weightLbs / (totalInches * totalInches)) * 703 * 10) / 10;
}

function bmiCategory(b: number) {
  if (b < 18.5) return { label: "Underweight", color: "text-blue-600" };
  if (b < 25) return { label: "Normal weight", color: "text-emerald-600" };
  if (b < 27) return { label: "Overweight (may qualify)", color: "text-amber-600" };
  if (b < 30) return { label: "Overweight — likely qualifies", color: "text-teal-600" };
  return { label: "Obese — qualifies", color: "text-teal-700" };
}

const contraindications = [
  { key: "hasThyroidCancer", label: "Medullary thyroid carcinoma (MTC) / family history" },
  { key: "hasMEN2", label: "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)" },
  { key: "isPregnant", label: "Pregnant, planning pregnancy, or breastfeeding" },
  { key: "hasPancreatitis", label: "History of pancreatitis" },
  { key: "hasGastroparesis", label: "Gastroparesis" },
  { key: "hasDiabeticRetinopathy", label: "Diabetic retinopathy" },
  { key: "hasGallbladderDisease", label: "Gallbladder disease" },
  { key: "hasKidneyDisease", label: "Chronic kidney disease" },
  { key: "hasEatingDisorder", label: "Active eating disorder" },
  { key: "hasSuicidalIdeation", label: "History of suicidal ideation / self-harm" },
];

export function HealthReportClient({ intake, consents, providerId }: Props) {
  const router = useRouter();
  const [rxForm, setRxForm] = useState({
    medicationName: intake.medicationInterest && intake.medicationInterest !== "provider_recommendation"
      ? (intake.medicationInterestLabel ?? "Compounded Semaglutide")
      : "Compounded Semaglutide",
    dose: "0.25mg",
    frequency: "Weekly injection",
  });
  const [clinicalRationale, setClinicalRationale] = useState("");
  const [denyReason, setDenyReason] = useState("");
  const [action, setAction] = useState<"approve" | "deny" | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const bmiVal = bmi(intake.weightLbs, intake.heightFeet, intake.heightInches);
  const bmiCat = bmiCategory(bmiVal);
  const conditions = Array.isArray(intake.conditions) ? intake.conditions as string[] : [];
  const flaggedContraindications = contraindications.filter(
    (c) => intake[c.key as keyof typeof intake] === true
  );

  const medicationDisplay =
    intake.medicationInterest === "provider_recommendation"
      ? "No preference — provider recommendation requested"
      : intake.medicationInterest === "something-else"
      ? "Something else / Not sure"
      : intake.medicationInterestLabel ?? intake.medicationInterest ?? "Not specified";

  async function handleApprove() {
    setLoading(true);
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
    setLoading(false);
    setDone(true);
  }

  async function handleDeny() {
    setLoading(true);
    await fetch("/api/admin/intakes/deny", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intakeId: intake.id, reason: denyReason }),
    });
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
          <Check className="h-8 w-8 text-teal" />
        </div>
        <h2 className="text-xl font-bold text-navy">Decision recorded</h2>
        <p className="text-sm text-graphite-400">The patient has been notified.</p>
        <Button onClick={() => router.push("/provider/intakes")}>Back to queue</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 print:p-0">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to queue
        </Button>
        <Button variant="ghost" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print Report
        </Button>
      </div>

      {/* Report Header */}
      <div className="rounded-2xl border-2 border-teal/30 bg-gradient-to-br from-teal-50/50 to-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-5 w-5 text-teal" />
              <span className="text-xs font-semibold uppercase tracking-wider text-teal">Patient Health Report</span>
            </div>
            <h1 className="text-2xl font-bold text-navy">
              {intake.firstName} {intake.lastName}
            </h1>
            <p className="text-sm text-graphite-400 mt-0.5">
              Submitted {new Date(intake.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <Badge variant={
              intake.eligibilityResult === "ALTERNATIVE_PATH" ? "destructive" :
              intake.eligibilityResult === "PENDING_REVIEW" ? "warning" : "success"
            } className="text-sm px-3 py-1">
              {intake.eligibilityResult === "ALTERNATIVE_PATH" ? "⚠ Contraindication Flagged" :
               intake.eligibilityResult === "PENDING_REVIEW" ? "Pending Review" : intake.eligibilityResult ?? intake.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Patient Demographics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <User className="h-4 w-4 text-teal" /> Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Date of Birth</p>
                <p className="font-medium text-navy">{intake.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">State</p>
                <p className="font-medium text-navy flex items-center gap-1"><MapPin className="h-3 w-3 text-graphite-400" />{intake.state}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Phone</p>
                <p className="font-medium text-navy flex items-center gap-1"><Phone className="h-3 w-3 text-graphite-400" />{intake.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Email</p>
                <p className="font-medium text-navy truncate">{intake.email}</p>
              </div>
            </div>

            {(intake.emergencyContactName || intake.emergencyContactPhone) && (
              <div className="mt-3 rounded-lg bg-navy-50/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400 mb-1">Emergency Contact</p>
                <p className="text-sm font-medium text-navy">{intake.emergencyContactName} ({intake.emergencyContactRelation})</p>
                <p className="text-sm text-graphite-500">{intake.emergencyContactPhone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vitals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Scale className="h-4 w-4 text-teal" /> Vitals & Biometrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-navy-50/50 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Height</p>
                <p className="text-lg font-bold text-navy">{intake.heightFeet}&apos;{intake.heightInches}&quot;</p>
              </div>
              <div className="rounded-xl bg-navy-50/50 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Weight</p>
                <p className="text-lg font-bold text-navy">{intake.weightLbs} lbs</p>
              </div>
              <div className="rounded-xl bg-navy-50/50 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Goal</p>
                <p className="text-lg font-bold text-navy">{intake.goalWeightLbs ? `${intake.goalWeightLbs} lbs` : "—"}</p>
              </div>
            </div>

            {/* BMI highlight */}
            <div className="rounded-xl border-2 border-teal/20 bg-teal-50/30 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400">BMI</p>
                <p className="text-3xl font-bold text-navy">{bmiVal}</p>
                <p className={`text-xs font-semibold mt-0.5 ${bmiCat.color}`}>{bmiCat.label}</p>
              </div>
              <Activity className="h-10 w-10 text-teal opacity-40" />
            </div>

            {intake.goalWeightLbs && (
              <div className="flex items-center gap-2 rounded-lg bg-navy-50/50 px-3 py-2">
                <Target className="h-4 w-4 text-teal shrink-0" />
                <p className="text-xs text-graphite-500">
                  Goal: lose <strong className="text-navy">{Math.round(intake.weightLbs - intake.goalWeightLbs)} lbs</strong> to reach {intake.goalWeightLbs} lbs
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medication Preference — prominent highlight */}
        <Card className="border-2 border-teal/40 md:col-span-2">
          <CardHeader className="pb-3 bg-gradient-to-r from-teal-50/60 to-white rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Pill className="h-4 w-4 text-teal" /> Patient Medication Preference
              <Badge variant="default" className="ml-auto">Provider Review Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {intake.medicationInterest ? (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <Pill className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy">{medicationDisplay}</p>
                  {intake.medicationInterest !== "provider_recommendation" && (
                    <p className="text-sm text-graphite-500 mt-0.5">
                      Patient expressed interest in this medication. Review their health profile before prescribing.
                      Your clinical judgement is the final determining factor.
                    </p>
                  )}
                  {intake.medicationInterest === "provider_recommendation" && (
                    <p className="text-sm text-graphite-500 mt-0.5">
                      Patient deferred to provider recommendation. No medication preference specified.
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700">
                      This is the patient&apos;s preference only — not a prescription. Final prescribing decision rests with the treating provider.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-graphite-400 italic">No medication preference recorded (older intake format)</p>
            )}
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <FileText className="h-4 w-4 text-teal" /> Medical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400 mb-1">Patient-Reported History</p>
              <p className="text-graphite-700 leading-relaxed rounded-lg bg-navy-50/40 p-3">{intake.medicalHistory}</p>
            </div>
            {intake.medications && intake.medications !== "None" && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400 mb-1">Current Medications</p>
                <p className="text-graphite-700 leading-relaxed rounded-lg bg-navy-50/40 p-3">{intake.medications}</p>
              </div>
            )}
            {intake.allergies && intake.allergies !== "None" && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400 mb-1">Allergies</p>
                <p className="text-red-700 font-medium rounded-lg bg-red-50 border border-red-100 p-3">{intake.allergies}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Heart className="h-4 w-4 text-teal" /> Reported Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conditions.length === 0 ? (
              <p className="text-sm text-graphite-400 italic">None reported</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety Screening */}
        <Card className={`md:col-span-2 ${flaggedContraindications.length > 0 ? "border-2 border-red-300" : ""}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Shield className={`h-4 w-4 ${flaggedContraindications.length > 0 ? "text-red-500" : "text-teal"}`} />
              FDA Safety Screening
              {flaggedContraindications.length > 0 ? (
                <Badge variant="destructive" className="ml-2">{flaggedContraindications.length} Flag{flaggedContraindications.length > 1 ? "s" : ""}</Badge>
              ) : (
                <Badge variant="success" className="ml-2">All Clear</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flaggedContraindications.length > 0 && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-bold text-red-800 mb-2">⚠ Contraindications Flagged</p>
                <ul className="space-y-1">
                  {flaggedContraindications.map((c) => (
                    <li key={c.key} className="flex items-center gap-2 text-sm text-red-700">
                      <X className="h-4 w-4 text-red-500 shrink-0" />
                      {c.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-red-600">
                  GLP-1 medication may not be appropriate. Review carefully and consider alternative treatment paths.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {contraindications.map((c) => {
                const flagged = intake[c.key as keyof typeof intake] === true;
                return (
                  <div
                    key={c.key}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                      flagged ? "bg-red-50 text-red-700" : "bg-emerald-50/50 text-emerald-700"
                    }`}
                  >
                    {flagged ? (
                      <X className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    )}
                    {c.label}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Consent Records */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Stethoscope className="h-4 w-4 text-teal" /> Consent Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { type: "TREATMENT", label: "Treatment Consent", flag: intake.consentGiven },
              { type: "HIPAA", label: "HIPAA Authorization", flag: intake.hipaaConsent },
              { type: "TELEHEALTH", label: "Telehealth Consent", flag: intake.telehealthConsentGiven },
              { type: "MEDICATION_RISKS", label: "Medication Risk Acknowledgment", flag: true },
            ].map((c) => {
              const record = consents.find((r) => r.consentType === c.type);
              return (
                <div key={c.type} className="flex items-center justify-between rounded-lg bg-navy-50/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-teal" />
                    <span className="text-xs font-medium text-navy">{c.label}</span>
                  </div>
                  <div className="text-right">
                    {record ? (
                      <>
                        <p className="text-[10px] text-graphite-400">v{record.consentVersion}</p>
                        <p className="text-[10px] text-graphite-400">{new Date(record.createdAt).toLocaleDateString()}</p>
                      </>
                    ) : (
                      <p className="text-[10px] text-graphite-400">Recorded</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* HIPAA Notice */}
        <Card className="border-teal/20 bg-teal-50/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Shield className="h-4 w-4 text-teal" /> HIPAA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-graphite-500 space-y-2 leading-relaxed">
            <p>This health report contains Protected Health Information (PHI) as defined by HIPAA (45 CFR §164). Access is restricted to authorized clinical personnel only.</p>
            <p>All data is encrypted at rest and in transit. Audit logs are maintained for all access events. Do not print, copy, or share this report outside of secure clinical systems.</p>
            <div className="mt-3 rounded-lg bg-teal-50 border border-teal-100 px-3 py-2">
              <p className="font-semibold text-teal-800">Viewing provider: {providerId}</p>
              <p className="text-graphite-400">Access logged at {new Date().toISOString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Decision Panel */}
      {intake.status !== "APPROVED" && intake.status !== "DENIED" && (
        <Card className="border-2 border-navy-200 print:hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Stethoscope className="h-4 w-4 text-teal" /> Provider Decision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant={action === "approve" ? "default" : "outline"}
                onClick={() => setAction("approve")}
                className="flex-1 gap-2"
              >
                <Check className="h-4 w-4" /> Approve &amp; Prescribe
              </Button>
              <Button
                variant={action === "deny" ? "destructive" : "outline"}
                onClick={() => setAction("deny")}
                className="flex-1 gap-2"
              >
                <X className="h-4 w-4" /> Deny
              </Button>
            </div>

            {action === "approve" && (
              <div className="space-y-3 rounded-xl border border-teal/30 bg-teal-50/20 p-4">
                <p className="text-xs font-semibold text-navy mb-3">Prescription Details</p>

                {/* Pre-fill from patient preference */}
                {intake.medicationInterest && intake.medicationInterest !== "provider_recommendation" && intake.medicationInterest !== "something-else" && (
                  <div className="flex items-center gap-2 rounded-lg bg-teal-50 border border-teal/30 px-3 py-2 mb-3">
                    <Pill className="h-4 w-4 text-teal shrink-0" />
                    <p className="text-xs text-teal-700">
                      Patient requested: <strong>{intake.medicationInterestLabel}</strong> — pre-filled below
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Medication Name</label>
                    <Input
                      value={rxForm.medicationName}
                      onChange={(e) => setRxForm((f) => ({ ...f, medicationName: e.target.value }))}
                      placeholder="e.g. Compounded Semaglutide"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Dose</label>
                    <Input
                      value={rxForm.dose}
                      onChange={(e) => setRxForm((f) => ({ ...f, dose: e.target.value }))}
                      placeholder="e.g. 0.25mg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Frequency</label>
                    <Input
                      value={rxForm.frequency}
                      onChange={(e) => setRxForm((f) => ({ ...f, frequency: e.target.value }))}
                      placeholder="e.g. Weekly injection"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Clinical Rationale *</label>
                  <textarea
                    value={clinicalRationale}
                    onChange={(e) => setClinicalRationale(e.target.value)}
                    className="calculator-input min-h-[80px] resize-y w-full text-sm"
                    placeholder="Document your clinical reasoning for prescribing this medication (required for compliance)"
                  />
                </div>
                <Button
                  onClick={handleApprove}
                  disabled={loading || !clinicalRationale.trim()}
                  className="w-full gap-2"
                >
                  {loading ? "Processing..." : "Confirm Approval & Send Prescription"}
                </Button>
              </div>
            )}

            {action === "deny" && (
              <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/20 p-4">
                <p className="text-xs font-semibold text-navy mb-2">Denial Reason</p>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  className="calculator-input min-h-[80px] resize-y w-full text-sm"
                  placeholder="Provide clinical reasoning for denial (will be shared with patient in a general form)"
                />
                <Button
                  variant="destructive"
                  onClick={handleDeny}
                  disabled={loading || !denyReason.trim()}
                  className="w-full gap-2"
                >
                  {loading ? "Processing..." : "Confirm Denial"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(intake.status === "APPROVED" || intake.status === "DENIED") && (
        <Card className="border-2 border-navy-200">
          <CardContent className="p-5 flex items-center gap-3">
            {intake.status === "APPROVED" ? (
              <><Check className="h-5 w-5 text-teal" /><p className="text-sm font-semibold text-teal-700">This intake has been approved and a treatment plan created.</p></>
            ) : (
              <><X className="h-5 w-5 text-red-500" /><p className="text-sm font-semibold text-red-700">This intake has been denied.</p></>
            )}
          </CardContent>
        </Card>
      )}

      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
