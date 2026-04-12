"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X, DollarSign, TrendingUp, Users, Headphones, BarChart2, Globe,
  Check, ChevronRight, Sparkles, Calculator, Star, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResellerPromoModalProps {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
  currentReferrals?: number;
}

const benefits = [
  {
    icon: DollarSign,
    title: "3× higher commissions",
    desc: "Earn $150–$250 per conversion vs. the standard $50. Unlock exclusive payout tiers.",
    color: "text-gold-600",
    bg: "bg-gold-50",
  },
  {
    icon: Globe,
    title: "Your own branded page",
    desc: "A custom Nature's Journey landing page with your name, photo, and personalized message.",
    color: "text-teal",
    bg: "bg-teal-50",
  },
  {
    icon: BarChart2,
    title: "Partner analytics dashboard",
    desc: "Deep-dive reporting: click-throughs, conversion rates, earnings by campaign.",
    color: "text-atlantic",
    bg: "bg-navy-50/50",
  },
  {
    icon: Headphones,
    title: "Dedicated partner support",
    desc: "Priority response, a personal partner manager, and co-marketing opportunities.",
    color: "text-teal",
    bg: "bg-teal-50",
  },
  {
    icon: Users,
    title: "Done-for-you marketing kit",
    desc: "Social templates, email scripts, and tracking links — all ready to deploy.",
    color: "text-gold-600",
    bg: "bg-gold-50",
  },
];

const tiers = [
  { name: "You now", perRef: 50, note: "Standard member", highlight: false },
  { name: "Reseller", perRef: 150, note: "After approval", highlight: true },
  { name: "Elite", perRef: 250, note: "10+ conversions/mo", highlight: false },
];

const examples = [
  { name: "Coach Lisa M.", role: "Wellness coach · Instagram", refs: 8, monthly: 1200 },
  { name: "Jake B.", role: "Healthcare worker · Email list", refs: 15, monthly: 2250 },
  { name: "Maria R.", role: "Lifestyle blogger · TikTok", refs: 25, monthly: 2500 },
];

export function ResellerPromoModal({
  open,
  onClose,
  onApplied,
  currentReferrals = 0,
}: ResellerPromoModalProps) {
  const [step, setStep] = useState<"info" | "form" | "done">("info");
  const [form, setForm] = useState({ name: "", platform: "", expected: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calcRefs, setCalcRefs] = useState(Math.max(5, currentReferrals || 10));

  const standardEarnings = calcRefs * 50;
  const resellerEarnings = calcRefs * 150;
  const eliteEarnings = calcRefs * 250;
  const annualDifference = (resellerEarnings - standardEarnings) * 12;

  async function handleApply() {
    if (!form.name || !form.platform) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/reseller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStep("done");
        onApplied?.();
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep("info");
    setForm({ name: "", platform: "", expected: "" });
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-navy via-atlantic to-teal p-8 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badge row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Partner Program
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gold/30 border border-gold/40 px-3 py-1 text-[10px] font-bold text-gold-200">
              <Star className="h-3 w-3 fill-current" />
              847 active resellers · avg $1,340/mo
            </div>
          </div>

          <h2 className="text-2xl font-bold leading-tight mb-1">
            You&apos;re already building momentum —<br />
            <span className="text-gold-300">now get paid 3× more for it.</span>
          </h2>
          <p className="text-sm text-white/75 mt-2">
            Upgrade to Reseller and earn up to <strong className="text-white">$250 per conversion</strong> with your own branded page and dedicated support.
          </p>

          {/* Tier comparison */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={cn(
                  "rounded-xl p-3 text-center",
                  t.highlight ? "bg-white text-navy ring-2 ring-gold" : "bg-white/10 text-white/90"
                )}
              >
                <p className={cn("text-xl font-bold", t.highlight ? "text-navy" : "text-white")}>
                  ${t.perRef}
                </p>
                <p className={cn("text-xs font-medium mt-0.5", t.highlight ? "text-navy" : "text-white/70")}>
                  {t.name}
                </p>
                {t.highlight ? (
                  <span className="mt-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                    Your next step
                  </span>
                ) : (
                  <p className="mt-1 text-[10px] text-white/50">{t.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === "info" && (
            <>
              {/* Earnings Calculator */}
              <div className="mb-6 rounded-2xl border border-navy-100/80 bg-gradient-to-br from-navy-50/40 to-white p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
                    <Calculator className="h-4 w-4 text-teal" />
                  </div>
                  <h3 className="text-sm font-bold text-navy">Earnings Calculator</h3>
                </div>

                {/* Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-xs text-graphite-400">Monthly referrals</label>
                    <span className="text-lg font-bold text-navy">{calcRefs}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={calcRefs}
                    onChange={(e) => setCalcRefs(Number(e.target.value))}
                    className="w-full h-2 rounded-full accent-teal cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-graphite-300 mt-1">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Earnings comparison */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-xl bg-white border border-navy-100 p-3 text-center">
                    <p className="text-[10px] text-graphite-400 mb-1">Standard</p>
                    <p className="text-lg font-bold text-graphite-500">
                      ${standardEarnings.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-graphite-300">/month</p>
                  </div>
                  <div className="rounded-xl bg-teal-50 border-2 border-teal/30 p-3 text-center relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-teal px-2 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">
                      Reseller
                    </div>
                    <p className="text-[10px] text-teal-700 mb-1 mt-1">You get</p>
                    <p className="text-lg font-bold text-teal">
                      ${resellerEarnings.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-teal-600">/month</p>
                  </div>
                  <div className="rounded-xl bg-white border border-navy-100 p-3 text-center">
                    <p className="text-[10px] text-graphite-400 mb-1">Elite (10+)</p>
                    <p className="text-lg font-bold text-gold-600">
                      ${eliteEarnings.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-graphite-300">/month</p>
                  </div>
                </div>

                {/* Annual callout */}
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-50 to-teal-50 border border-teal/20 px-4 py-3">
                  <Zap className="h-4 w-4 text-teal shrink-0" />
                  <p className="text-xs text-navy">
                    Upgrading to Reseller could earn you an extra{" "}
                    <strong className="text-teal">${annualDifference.toLocaleString()}/year</strong>{" "}
                    at your current referral pace.
                  </p>
                </div>
              </div>

              {/* Real examples */}
              <div className="mb-5">
                <p className="text-xs font-bold text-navy mb-3">Real partner income examples</p>
                <div className="space-y-2">
                  {examples.map((ex) => (
                    <div
                      key={ex.name}
                      className="flex items-center justify-between rounded-xl bg-navy-50/40 px-4 py-2.5"
                    >
                      <div>
                        <p className="text-xs font-semibold text-navy">{ex.name}</p>
                        <p className="text-[10px] text-graphite-400">{ex.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal">${ex.monthly.toLocaleString()}/mo</p>
                        <p className="text-[10px] text-graphite-400">{ex.refs} refs/month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <h3 className="text-xs font-bold text-navy mb-3">What you get as a Reseller</h3>
              <div className="space-y-2.5 mb-6">
                {benefits.map((b) => (
                  <div key={b.title} className={cn("flex items-start gap-3 rounded-xl p-3", b.bg)}>
                    <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm", b.color)}>
                      <b.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{b.title}</p>
                      <p className="text-xs text-graphite-400 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 gap-2 bg-gradient-to-r from-navy to-atlantic hover:opacity-90" onClick={() => setStep("form")}>
                  Apply Now — It&apos;s Free <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleClose}>Later</Button>
              </div>
              <p className="mt-3 text-center text-xs text-graphite-400">
                Free to apply. Most applications reviewed within 1–2 business days.
              </p>
            </>
          )}

          {step === "form" && (
            <>
              <button
                onClick={() => setStep("info")}
                className="mb-4 flex items-center gap-1 text-xs text-graphite-400 hover:text-navy transition-colors"
              >
                ← Back
              </button>

              <h3 className="text-sm font-bold text-navy mb-1">Quick application</h3>
              <p className="text-xs text-graphite-400 mb-5">
                Takes under a minute. We review and get back to you within 1–2 business days.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    Your name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="First and last name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    How will you promote Nature&apos;s Journey? <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.platform}
                    onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                    placeholder="e.g. Instagram, blog, YouTube, email list..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    Estimated monthly referrals
                  </label>
                  <select
                    value={form.expected}
                    onChange={(e) => setForm((p) => ({ ...p, expected: e.target.value }))}
                    className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                  >
                    <option value="">Select a range...</option>
                    <option value="1-5">1–5 per month</option>
                    <option value="5-15">5–15 per month</option>
                    <option value="15-30">15–30 per month</option>
                    <option value="30+">30+ per month</option>
                  </select>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button className="w-full gap-2" onClick={handleApply} disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </>
          )}

          {step === "done" && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                <Check className="h-8 w-8 text-teal" />
              </div>
              <h3 className="text-lg font-bold text-navy">Application submitted!</h3>
              <p className="mt-2 text-sm text-graphite-400 max-w-sm mx-auto">
                We&apos;ll review your application and reach out within 1–2 business days.
                Once approved, your commissions and dashboard upgrade automatically.
              </p>
              <div className="mt-5 rounded-xl bg-teal-50/50 border border-teal/20 p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-teal shrink-0" />
                  <p className="text-xs text-navy font-medium">
                    Keep sharing your referral link — all referrals during review count toward Reseller status.
                  </p>
                </div>
              </div>
              <Button className="mt-5" onClick={handleClose}>Got it</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
