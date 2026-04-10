"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X, DollarSign, TrendingUp, Users, Headphones, BarChart2, Globe,
  Check, ChevronRight, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResellerPromoModalProps {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
}

const benefits = [
  {
    icon: DollarSign,
    title: "Higher commissions",
    desc: "Earn $150–$250 per conversion vs. the standard $50. Unlock exclusive payout tiers.",
    color: "text-gold-600",
    bg: "bg-gold-50",
  },
  {
    icon: Globe,
    title: "Custom landing page",
    desc: "Your own branded Nature's Journey page with your name, photo, and personalized message.",
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
    title: "Marketing kit access",
    desc: "Done-for-you social templates, email scripts, and tracking links — all ready to deploy.",
    color: "text-gold-600",
    bg: "bg-gold-50",
  },
];

const tiers = [
  { name: "Standard Member", payout: "$50", note: "Your current tier" },
  { name: "Reseller", payout: "$150", note: "After approval", highlight: true },
  { name: "Elite Partner", payout: "$250", note: "10+ conversions/month", highlight: false },
];

export function ResellerPromoModal({ open, onClose, onApplied }: ResellerPromoModalProps) {
  const [step, setStep] = useState<"info" | "form" | "done">("info");
  const [form, setForm] = useState({ name: "", platform: "", expected: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-navy via-atlantic to-teal p-8 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Partner Program
            </div>
          </div>

          <h2 className="text-2xl font-bold leading-tight mb-1">
            Turn your referrals into<br />
            <span className="text-gold-300">real income</span>
          </h2>
          <p className="text-sm text-white/75 mt-2">
            Upgrade to Reseller and earn up to <strong className="text-white">3× more</strong> per conversion
            — with your own branded page and dedicated support.
          </p>

          {/* Earning preview */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={cn(
                  "rounded-xl p-3 text-center",
                  t.highlight
                    ? "bg-white text-navy ring-2 ring-gold"
                    : "bg-white/10 text-white/90"
                )}
              >
                <p className={cn("text-xl font-bold", t.highlight ? "text-navy" : "text-white")}>
                  {t.payout}
                </p>
                <p className={cn("text-xs font-medium mt-0.5", t.highlight ? "text-navy" : "text-white/70")}>
                  {t.name}
                </p>
                {t.highlight && (
                  <span className="mt-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                    You&apos;re here next
                  </span>
                )}
                {!t.highlight && (
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
              <h3 className="text-sm font-bold text-navy mb-4">What you get as a Reseller</h3>
              <div className="space-y-3">
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

              <div className="mt-6 flex gap-3">
                <Button className="flex-1 gap-2" onClick={() => setStep("form")}>
                  Apply Now <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleClose}>Maybe Later</Button>
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
              <p className="text-xs text-graphite-400 mb-5">Takes under a minute. We review and get back to you within 1–2 business days.</p>

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
                    How will you promote Nature's Journey? <span className="text-red-400">*</span>
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

                <Button
                  className="w-full gap-2"
                  onClick={handleApply}
                  disabled={loading}
                >
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
                    In the meantime, keep sharing your referral link — all referrals during review count toward Reseller status.
                  </p>
                </div>
              </div>
              <Button className="mt-5" onClick={handleClose}>
                Got it
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
