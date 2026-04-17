"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, ArrowRight, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const quickQuestions = [
  { label: "How does GLP-1 work?", answer: "GLP-1 medications mimic a natural hormone that regulates appetite and blood sugar. They help you feel fuller longer, reduce cravings, and support sustainable weight loss. Our providers prescribe the right dose for your body." },
  { label: "Is it safe?", answer: "GLP-1 medications have been extensively studied in clinical trials. Our board-certified providers review your full medical history to ensure safety. Common side effects are mild and temporary (nausea, which typically resolves in 1-2 weeks)." },
  { label: "What if I don't qualify?", answer: "If our provider determines GLP-1 medication isn't right for you, you won't be charged. We'll suggest alternative approaches that may work better for your specific health profile." },
  { label: "Can I cancel anytime?", answer: "Absolutely. No contracts, no cancellation fees. You can pause or cancel your subscription from your dashboard in two clicks. Plus, we offer a 30-day money-back guarantee." },
  { label: "How fast will I see results?", answer: "Most members notice reduced appetite within the first 1-2 weeks. Typical weight loss is 3-5 lbs in the first month, accelerating to 15%+ of body weight over 6-12 months with consistent use." },
];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState<number | null>(null);
  const [showPulse, setShowPulse] = useState(true);

  // Tier 4.3 — "Talk to a nurse" lead-capture toast
  const [showNurseToast, setShowNurseToast] = useState(false);
  const [nursePhone, setNursePhone] = useState("");
  const [nurseConsent, setNurseConsent] = useState(true);
  const [nurseSubmitted, setNurseSubmitted] = useState(false);
  const [nurseLoading, setNurseLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Tier 4.3 — after 60s on page, if the user hasn't opened chat, offer
  // to text a nurse. Dismissal is sessionStorage-scoped (like exit intent).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nurse-toast-dismissed")) return;
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNurseToast(true);
        track("nurse_toast_view", { delay_s: 60 });
      }
    }, 60_000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleNurseSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = nursePhone.replace(/\D/g, "");
    if (digits.length !== 10 || !nurseConsent || nurseLoading) return;
    setNurseLoading(true);
    track("nurse_toast_submit", { phone_provided: true });
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `nurse-${digits}@sms.placeholder.local`,
          phone: digits,
          source: "nurse_text_widget",
        }),
      });
    } catch {
      // non-blocking
    }
    setNurseSubmitted(true);
    if (typeof window !== "undefined") sessionStorage.setItem("nurse-toast-dismissed", "1");
    setNurseLoading(false);
  }

  function handleDismissNurseToast() {
    setShowNurseToast(false);
    if (typeof window !== "undefined") sessionStorage.setItem("nurse-toast-dismissed", "1");
    track("nurse_toast_dismiss");
  }

  function handleOpen() {
    setIsOpen(true);
    setShowPulse(false);
    setShowNurseToast(false);
    track("chat_widget_open", { location: "floating" });
  }

  function handleQuestionClick(index: number) {
    setActiveAnswer(index);
    track("chat_widget_question", { question: quickQuestions[index].label });
  }

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[340px] max-h-[480px] rounded-2xl border border-navy-200 bg-white shadow-2xl sm:right-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-navy to-atlantic px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageCircle className="h-5 w-5 text-white" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Care Team</p>
                <p className="text-[10px] text-white/60">Typically replies in &lt;2 hours</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[380px] overflow-y-auto p-4">
            {/* Welcome message */}
            <div className="mb-4 rounded-xl rounded-tl-none bg-navy-50 p-3">
              <p className="text-xs text-graphite-600">
                Hi! 👋 I can answer common questions instantly, or connect you with our care team.
                What can I help with?
              </p>
            </div>

            {/* Quick questions */}
            {activeAnswer === null ? (
              <div className="space-y-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(i)}
                    className="flex w-full items-center justify-between rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-left text-xs font-medium text-navy transition-all hover:border-teal hover:bg-teal-50/30"
                  >
                    {q.label}
                    <ArrowRight className="h-3 w-3 text-graphite-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {/* User message */}
                <div className="mb-3 ml-auto w-fit max-w-[80%] rounded-xl rounded-br-none bg-teal px-3 py-2">
                  <p className="text-xs text-white">{quickQuestions[activeAnswer].label}</p>
                </div>
                {/* Bot answer */}
                <div className="mb-4 rounded-xl rounded-tl-none bg-navy-50 p-3">
                  <p className="text-xs leading-relaxed text-graphite-600">
                    {quickQuestions[activeAnswer].answer}
                  </p>
                </div>
                <button
                  onClick={() => setActiveAnswer(null)}
                  className="mb-3 text-xs font-medium text-teal hover:underline"
                >
                  ← Ask another question
                </button>
              </div>
            )}

            {/* CTA */}
            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/50 p-3 text-center">
              <p className="text-xs font-medium text-navy">Ready to get started?</p>
              <a href="/qualify">
                <Button size="sm" className="mt-2 w-full gap-1 text-xs">
                  See If I Qualify <ArrowRight className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tier 4.3 — Nurse-text lead-capture toast (after 60s if chat not opened) */}
      {showNurseToast && !isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[320px] rounded-2xl border border-teal-200 bg-white shadow-premium-lg animate-fade-in-up sm:right-6">
          <button
            onClick={handleDismissNurseToast}
            className="absolute right-2 top-2 rounded-lg p-1 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {nurseSubmitted ? (
            <div className="p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="mt-3 text-sm font-bold text-navy">A nurse will text you shortly</p>
              <p className="mt-1 text-[11px] text-graphite-500">
                Typical response time: under 30 minutes during business hours.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic text-white">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy">Quick question?</p>
                  <p className="text-[10px] text-graphite-400">Text a real nurse — no signup</p>
                </div>
              </div>
              <form onSubmit={handleNurseSubmit} className="space-y-2">
                <input
                  type="tel"
                  placeholder="Your mobile number"
                  value={nursePhone}
                  onChange={(e) => setNursePhone(formatPhone(e.target.value))}
                  required
                  autoComplete="tel"
                  disabled={nurseLoading}
                  className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
                <label className="flex items-start gap-1.5 text-[10px] leading-tight text-graphite-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nurseConsent}
                    onChange={(e) => setNurseConsent(e.target.checked)}
                    className="mt-0.5 h-3 w-3 rounded border-navy-200 text-teal"
                  />
                  <span>
                    Consent to receive one text from a licensed nurse. Reply STOP to opt out.
                  </span>
                </label>
                <Button
                  type="submit"
                  size="sm"
                  variant="emerald"
                  className="w-full gap-1"
                  disabled={nurseLoading || nursePhone.replace(/\D/g, "").length !== 10 || !nurseConsent}
                >
                  {nurseLoading ? "Sending..." : "Text me a nurse"}
                  {!nurseLoading && <ArrowRight className="h-3 w-3" />}
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl sm:right-6"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {showPulse && (
              <span className="absolute inset-0 animate-ping rounded-full bg-teal/40" />
            )}
          </>
        )}
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            1
          </span>
        )}
      </button>
    </>
  );
}
