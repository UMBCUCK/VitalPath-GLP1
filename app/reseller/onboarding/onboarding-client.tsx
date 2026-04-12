"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield, BookOpen, FileSignature, UserCheck, FileText,
  Palette, CheckCircle, Loader2, ChevronRight, Clock,
  AlertTriangle, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_STEPS,
  TRAINING_SECTIONS,
  RESELLER_AGREEMENT,
  ATTESTATION_TEXT,
  MARKETING_GUIDELINES,
} from "@/lib/reseller-compliance";

// ─── Types ─────────────────────────────────────────────────

interface Props {
  resellerId: string;
  displayName: string;
  email: string;
  currentStep: number;
}

const STEP_ICONS = [BookOpen, Shield, FileSignature, UserCheck, FileText, Palette, CheckCircle];

// ─── Forced Read Hook ──────────────────────────────────────

function useScrolledToBottom(ref: React.RefObject<HTMLDivElement | null>) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 20) setScrolled(true);
    };
    el.addEventListener("scroll", handler);
    // Check immediately for short content
    handler();
    return () => el.removeEventListener("scroll", handler);
  }, [ref]);
  return scrolled;
}

function useMinTimer(seconds: number) {
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(seconds === 0);
  useEffect(() => {
    if (seconds === 0) { setReady(true); return; }
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= seconds) { setReady(true); clearInterval(interval); }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);
  return { elapsed, ready, remaining: Math.max(0, seconds - elapsed) };
}

// ─── Main Onboarding Component ─────────────────────────────

export function OnboardingClient({ resellerId, displayName, email, currentStep }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(currentStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function advanceStep(stepKey: string, data?: Record<string, unknown>) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/reseller/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stepKey, data }),
      });
      const result = await res.json();
      if (!res.ok) { setError(result.error || "Failed to save progress"); return; }
      if (result.complete) { router.push("/reseller"); return; }
      setStep(result.nextStep);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-linen via-white to-teal-50/20">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-navy">Reseller Compliance Onboarding</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Welcome, {displayName}. Complete all steps before you can begin marketing.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 flex items-center gap-2">
          {ONBOARDING_STEPS.slice(0, -1).map((s, i) => {
            const Icon = STEP_ICONS[i];
            const isComplete = step > i;
            const isCurrent = step === i;
            return (
              <div key={s.key} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 shrink-0 transition-colors",
                    isComplete
                      ? "border-teal bg-teal text-white"
                      : isCurrent
                      ? "border-teal bg-teal-50 text-teal"
                      : "border-navy-100 bg-white text-graphite-300"
                  )}
                >
                  {isComplete ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                {i < ONBOARDING_STEPS.length - 2 && (
                  <div className={cn("h-0.5 flex-1 rounded-full", isComplete ? "bg-teal" : "bg-navy-100")} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step label */}
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-graphite-400">
          Step {step + 1} of {ONBOARDING_STEPS.length - 1}: {ONBOARDING_STEPS[step]?.title}
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            {error}
          </div>
        )}

        {/* Step content */}
        {step === 0 && <WelcomeStep onAdvance={() => advanceStep("welcome")} loading={loading} />}
        {step === 1 && <TrainingStep onAdvance={() => advanceStep("training")} loading={loading} />}
        {step === 2 && <AgreementStep onAdvance={(data) => advanceStep("agreement", data)} loading={loading} />}
        {step === 3 && <AttestationStep onAdvance={(data) => advanceStep("attestation", data)} loading={loading} />}
        {step === 4 && <W9Step onAdvance={(data) => advanceStep("w9", data)} loading={loading} />}
        {step === 5 && <MarketingStep onAdvance={() => advanceStep("marketing")} loading={loading} />}
        {step === 6 && <CompleteStep />}
      </div>
    </div>
  );
}

// ─── Step 0: Welcome ───────────────────────────────────────

function WelcomeStep({ onAdvance, loading }: { onAdvance: () => void; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledToBottom(scrollRef);
  const { ready, remaining } = useMinTimer(120);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-teal" /> Program Overview
        </CardTitle>
        <p className="text-xs text-graphite-400">Read the complete program overview before continuing</p>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="max-h-[400px] overflow-y-auto rounded-xl border border-navy-100/40 bg-linen/30 p-6 text-sm text-graphite-600 leading-relaxed space-y-4">
          <h3 className="font-bold text-navy text-base">Welcome to the VitalPath Reseller Program</h3>
          <p>Thank you for your interest in becoming a VitalPath reseller. Before you can begin marketing our platform, you must complete this mandatory compliance onboarding process.</p>

          <h4 className="font-semibold text-navy">What is VitalPath?</h4>
          <p>VitalPath is a telehealth subscription platform for weight management. Members subscribe to a monthly membership that includes access to licensed healthcare providers, personalized treatment plans, meal planning tools, and progress tracking. Prescriptions, when clinically appropriate, are issued by independent licensed providers — not by VitalPath, and not by you.</p>

          <h4 className="font-semibold text-navy">What You Are Selling</h4>
          <p>You are marketing a <strong>subscription membership</strong>. You are NOT referring patients to doctors, selling medications, or providing medical advice. This distinction is critical for legal compliance and must be reflected in all your marketing.</p>

          <h4 className="font-semibold text-navy">Why Compliance Matters in Healthcare</h4>
          <p>The healthcare industry is one of the most heavily regulated sectors. Multiple federal and state laws govern how healthcare services can be marketed and how referral payments can be structured. Violations carry severe penalties — up to $100,000 per violation in federal fines and up to 10 years imprisonment under the Anti-Kickback Statute.</p>

          <h4 className="font-semibold text-navy">What You'll Complete Today</h4>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Compliance training (mandatory reading covering FDA, FTC, HIPAA, and state laws)</li>
            <li>Reseller agreement (legally binding contract with all terms and conditions)</li>
            <li>Healthcare provider attestation (confirming you are not a licensed provider)</li>
            <li>Tax information (IRS W-9 form — required before any commission is paid)</li>
            <li>Marketing guidelines review (what you can and cannot say)</li>
          </ol>

          <h4 className="font-semibold text-navy">Commission Structure</h4>
          <p>Commissions are paid on <strong>subscription membership sales only</strong> — never on prescriptions, medications, or healthcare services. Your commission rate depends on your tier level and is documented in the reseller agreement. All payments require a valid W-9 on file and are subject to IRS 1099-NEC reporting for annual earnings of $600 or more.</p>

          <h4 className="font-semibold text-navy">Important: No Override Commissions</h4>
          <p>To comply with federal healthcare regulations, VitalPath does not pay override commissions on other resellers' sales. You earn commission only on your own direct sales. If you introduce another reseller to the program, you may receive a one-time flat introduction bonus — but no ongoing percentage of their sales.</p>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mt-4">
            <p className="text-amber-800 font-semibold text-xs">PLEASE READ CAREFULLY</p>
            <p className="text-amber-700 text-xs mt-1">Each step in this onboarding process is legally required. You must scroll through and read each section completely. Time-based minimums ensure you have adequate time to review the material. Rushing through without reading may result in compliance violations that carry personal liability.</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            {!ready && (
              <>
                <Clock className="h-3.5 w-3.5" />
                <span>Please read for {Math.ceil(remaining / 60)} more min{remaining > 60 ? "s" : ""}</span>
              </>
            )}
            {!scrolled && ready && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Scroll to the bottom to continue</span>
              </>
            )}
            {scrolled && ready && (
              <span className="text-teal flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Ready to continue
              </span>
            )}
          </div>
          <Button onClick={onAdvance} disabled={!scrolled || !ready || loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue to Training
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 1: Compliance Training ───────────────────────────

function TrainingStep({ onAdvance, loading }: { onAdvance: () => void; loading: boolean }) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledToBottom(scrollRef);
  const { ready, remaining } = useMinTimer(50); // 50 seconds per section

  const section = TRAINING_SECTIONS[activeSection];
  const allComplete = completedSections.size === TRAINING_SECTIONS.length;

  function completeSection() {
    setCompletedSections((prev) => new Set(prev).add(section.id));
    if (activeSection < TRAINING_SECTIONS.length - 1) {
      setActiveSection(activeSection + 1);
    }
  }

  // Reset scroll + timer when section changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeSection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-teal" /> Compliance Training
        </CardTitle>
        <p className="text-xs text-graphite-400">
          Complete all {TRAINING_SECTIONS.length} sections · {completedSections.size} of {TRAINING_SECTIONS.length} done
        </p>
      </CardHeader>
      <CardContent>
        {/* Section tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TRAINING_SECTIONS.map((s, i) => {
            const done = completedSections.has(s.id);
            const active = activeSection === i;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(i)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "bg-navy text-white" : done ? "bg-teal-50 text-teal" : "bg-navy-50 text-graphite-400"
                )}
              >
                {done ? <CheckCircle className="h-3 w-3" /> : <span className="font-mono">{i + 1}</span>}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Section content */}
        <div className="mb-3">
          <h3 className="font-bold text-navy">{section.title}</h3>
          <p className="text-xs text-graphite-400">{section.subtitle}</p>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[350px] overflow-y-auto rounded-xl border border-navy-100/40 bg-linen/30 p-6 text-sm text-graphite-600 leading-relaxed whitespace-pre-line"
        >
          {section.content}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            {!completedSections.has(section.id) && !ready && (
              <><Clock className="h-3.5 w-3.5" /><span>Read for {remaining}s more</span></>
            )}
            {!completedSections.has(section.id) && !scrolled && ready && (
              <><ChevronRight className="h-3.5 w-3.5" /><span>Scroll to the bottom</span></>
            )}
            {completedSections.has(section.id) && (
              <span className="text-teal flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Section complete</span>
            )}
          </div>

          <div className="flex gap-2">
            {!completedSections.has(section.id) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={completeSection}
                disabled={!scrolled || !ready}
              >
                Mark Complete
              </Button>
            )}
            {allComplete && (
              <Button onClick={onAdvance} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue to Agreement
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 2: Agreement Signing ─────────────────────────────

function AgreementStep({ onAdvance, loading }: { onAdvance: (data: Record<string, unknown>) => void; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledToBottom(scrollRef);
  const [checks, setChecks] = useState<boolean[]>(new Array(RESELLER_AGREEMENT.acknowledgmentCheckboxes.length).fill(false));
  const [legalName, setLegalName] = useState("");

  const allChecked = checks.every(Boolean);
  const canSign = scrolled && allChecked && legalName.trim().length >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSignature className="h-5 w-5 text-teal" /> {RESELLER_AGREEMENT.title}
        </CardTitle>
        <p className="text-xs text-graphite-400">Version {RESELLER_AGREEMENT.version} · Effective {RESELLER_AGREEMENT.effectiveDate}</p>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="max-h-[350px] overflow-y-auto rounded-xl border border-navy-100/40 bg-white p-6 text-sm text-graphite-600 leading-relaxed space-y-6">
          {RESELLER_AGREEMENT.sections.map((s) => (
            <div key={s.id}>
              <h4 className="font-bold text-navy mb-2">{s.title}</h4>
              <p className="whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        {!scrolled && (
          <p className="mt-3 text-xs text-graphite-400 flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" /> Scroll to read the entire agreement
          </p>
        )}

        {scrolled && (
          <div className="mt-4 space-y-4">
            {/* Acknowledgment checkboxes */}
            <div className="rounded-xl border border-navy-100/40 bg-linen/30 p-4 space-y-3">
              <p className="text-xs font-semibold text-navy uppercase tracking-wider">Acknowledgments</p>
              {RESELLER_AGREEMENT.acknowledgmentCheckboxes.map((label, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => setChecks((prev) => prev.map((c, j) => j === i ? !c : c))}
                    className="mt-0.5 h-4 w-4 rounded accent-teal shrink-0"
                  />
                  <span className="text-xs text-graphite-600">{label}</span>
                </label>
              ))}
            </div>

            {/* Digital signature */}
            <div className="rounded-xl border border-teal/30 bg-teal-50/20 p-4">
              <p className="text-xs font-semibold text-navy mb-2">Electronic Signature</p>
              <p className="text-xs text-graphite-400 mb-3">
                By typing your full legal name below, you are electronically signing this agreement with the same legal effect as a handwritten signature.
              </p>
              <Input
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Type your full legal name"
                className="font-serif text-lg"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => onAdvance({ fullLegalName: legalName.trim(), acknowledgments: checks })}
                disabled={!canSign || loading}
                className="gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />}
                Sign Agreement
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Step 3: Healthcare Provider Attestation ───────────────

function AttestationStep({ onAdvance, loading }: { onAdvance: (data: Record<string, unknown>) => void; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledToBottom(scrollRef);
  const [legalName, setLegalName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCheck className="h-5 w-5 text-teal" /> Healthcare Provider Attestation
        </CardTitle>
        <p className="text-xs text-graphite-400">Required by the Stark Law (42 U.S.C. 1395nn) and Anti-Kickback Statute</p>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="max-h-[300px] overflow-y-auto rounded-xl border border-red-100 bg-red-50/20 p-6 text-sm text-graphite-600 leading-relaxed whitespace-pre-line">
          {ATTESTATION_TEXT}
        </div>

        {scrolled && (
          <div className="mt-4 space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-teal shrink-0"
              />
              <span className="text-xs text-graphite-600">
                I swear under penalty of perjury that all statements above are true and accurate. I understand that VitalPath relies on this attestation to comply with federal and state healthcare laws.
              </span>
            </label>

            <div className="rounded-xl border border-teal/30 bg-teal-50/20 p-4">
              <p className="text-xs font-semibold text-navy mb-2">Electronic Signature</p>
              <Input
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Type your full legal name"
                className="font-serif text-lg"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => onAdvance({ fullLegalName: legalName.trim() })}
                disabled={!confirmed || legalName.trim().length < 2 || loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign Attestation
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Step 4: W-9 Tax Information ───────────────────────────

function W9Step({ onAdvance, loading }: { onAdvance: (data: Record<string, unknown>) => void; loading: boolean }) {
  const [form, setForm] = useState({
    legalName: "", businessName: "", taxClassification: "",
    addressLine1: "", city: "", state: "", zip: "",
    tinType: "", tinLast4: "",
  });
  const [certified, setCertified] = useState(false);

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.legalName.trim() && form.taxClassification && form.addressLine1.trim() &&
    form.city.trim() && form.state.trim() && /^\d{5}(-\d{4})?$/.test(form.zip.trim()) &&
    form.tinType && /^\d{4}$/.test(form.tinLast4) && certified;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-teal" /> Tax Information (W-9)
        </CardTitle>
        <p className="text-xs text-graphite-400">Required before any commission payment can be processed</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-4">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Your tax information is encrypted and stored securely. Only the last 4 digits of your TIN are retained. Full TIN submission will be handled via a secure IRS-compliant form in your reseller settings.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Legal Name *</label>
              <Input value={form.legalName} onChange={(e) => set("legalName", e.target.value)} placeholder="As shown on your tax return" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Business Name (if different)</label>
              <Input value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="DBA or company name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Federal Tax Classification *</label>
            <select
              value={form.taxClassification}
              onChange={(e) => set("taxClassification", e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy"
            >
              <option value="">Select classification...</option>
              <option value="INDIVIDUAL">Individual / Sole Proprietor</option>
              <option value="C_CORP">C Corporation</option>
              <option value="S_CORP">S Corporation</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="LLC">LLC</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Address *</label>
            <Input value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} placeholder="Street address" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">City *</label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">State *</label>
              <Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. TX" maxLength={2} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">ZIP *</label>
              <Input value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="12345" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">TIN Type *</label>
              <select
                value={form.tinType}
                onChange={(e) => set("tinType", e.target.value)}
                className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy"
              >
                <option value="">Select...</option>
                <option value="SSN">Social Security Number (SSN)</option>
                <option value="EIN">Employer Identification Number (EIN)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Last 4 Digits of TIN *</label>
              <Input
                value={form.tinLast4}
                onChange={(e) => set("tinLast4", e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Last 4 digits only"
                maxLength={4}
              />
            </div>
          </div>

          {/* IRS W-9 Part II Certification */}
          <div className="rounded-xl border border-navy-100/40 bg-linen/30 p-4">
            <p className="text-xs font-semibold text-navy mb-2">IRS W-9 Part II — Certification</p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-teal shrink-0"
              />
              <span className="text-xs text-graphite-600">
                Under penalties of perjury, I certify that: (1) The number shown on this form is my correct taxpayer identification number; (2) I am not subject to backup withholding because I have not been notified by the IRS that I am subject to backup withholding as a result of failure to report all interest or dividends, or the IRS has notified me that I am no longer subject to backup withholding; (3) I am a U.S. citizen or other U.S. person; (4) The FATCA code(s) entered on this form indicating that I am exempt from FATCA reporting are correct.
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onAdvance(form)} disabled={!isValid || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit W-9
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 5: Marketing Guidelines ──────────────────────────

function MarketingStep({ onAdvance, loading }: { onAdvance: () => void; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledToBottom(scrollRef);
  const { ready, remaining } = useMinTimer(120);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="h-5 w-5 text-teal" /> {MARKETING_GUIDELINES.title}
        </CardTitle>
        <p className="text-xs text-graphite-400">{MARKETING_GUIDELINES.intro}</p>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="max-h-[400px] overflow-y-auto rounded-xl border border-navy-100/40 bg-linen/30 p-6 text-sm text-graphite-600 leading-relaxed space-y-6">
          <div>
            <h4 className="font-bold text-navy mb-3">Approved Marketing Templates</h4>
            <p className="text-xs text-graphite-400 mb-3">You may use the following templates as-is or submit modifications for approval.</p>
            {MARKETING_GUIDELINES.approvedTemplates.map((t) => (
              <div key={t.name} className="mb-4 rounded-lg border border-teal/20 bg-white p-4">
                <p className="text-xs font-semibold text-teal mb-2">{t.name}</p>
                <p className="text-xs text-graphite-500 whitespace-pre-line font-mono bg-navy-50/30 rounded p-3">{t.text}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-bold text-red-600 mb-3">Prohibited Phrases and Claims</h4>
            <p className="text-xs text-graphite-400 mb-3">The following phrases are NEVER permitted in any marketing material:</p>
            <div className="space-y-2">
              {MARKETING_GUIDELINES.prohibitedPhrases.map((phrase) => (
                <div key={phrase} className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                  <span className="text-red-500 font-bold text-xs">✗</span>
                  <span className="text-xs text-red-700">&ldquo;{phrase}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
            <p className="text-xs font-semibold text-teal-800 mb-1">Custom Content Review</p>
            <p className="text-xs text-teal-700">If you want to create custom marketing content, submit it for review through your reseller dashboard. Our compliance team will review and approve within 5 business days. Do not use any custom content until it has been approved.</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {scrolled && ready && (
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-teal shrink-0"
              />
              <span className="text-xs text-graphite-600">
                I have read the marketing guidelines. I understand that I may only use pre-approved marketing materials and that all custom content requires approval before use. I understand that unauthorized marketing claims may result in termination and personal liability.
              </span>
            </label>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-graphite-400">
              {!ready && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Read for {remaining}s more</span>}
              {!scrolled && ready && <span className="flex items-center gap-1"><ChevronRight className="h-3.5 w-3.5" /> Scroll to the bottom</span>}
            </div>
            <Button
              onClick={onAdvance}
              disabled={!scrolled || !ready || !acknowledged || loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Complete Onboarding
              <CheckCircle className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 6: Complete ──────────────────────────────────────

function CompleteStep() {
  const router = useRouter();
  return (
    <Card className="border-teal/30">
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
          <CheckCircle className="h-10 w-10 text-teal" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-2">Onboarding Complete!</h2>
        <p className="text-sm text-graphite-400 max-w-md mx-auto mb-6">
          You&apos;ve completed all compliance requirements. Your reseller account is now fully activated. You can begin marketing VitalPath using the approved materials in your dashboard.
        </p>
        <div className="rounded-xl bg-navy-50/50 p-4 max-w-sm mx-auto mb-8">
          <div className="space-y-2 text-xs text-graphite-500">
            <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-teal" /> Compliance training completed</p>
            <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-teal" /> Reseller agreement signed</p>
            <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-teal" /> Healthcare provider attestation verified</p>
            <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-teal" /> W-9 tax information submitted</p>
            <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-teal" /> Marketing guidelines acknowledged</p>
            <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-teal" /> OIG/SAM exclusion check passed</p>
          </div>
        </div>
        <Button onClick={() => router.push("/reseller")} className="gap-2">
          Go to Your Dashboard
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
