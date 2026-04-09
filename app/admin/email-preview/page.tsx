"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Eye } from "lucide-react";
import {
  welcomeSequence,
  quizAbandonment,
  checkoutAbandonment,
  refillReminder,
  milestoneCongrats,
  cancellationSaveOffer,
} from "@/lib/services/lifecycle-emails";

const templates = [
  { id: "welcome-day0", name: "Welcome — Day 0", category: "Onboarding", ...welcomeSequence.day0("Jordan") },
  { id: "welcome-day3", name: "Welcome — Day 3", category: "Onboarding", ...welcomeSequence.day3("Jordan") },
  { id: "welcome-day7", name: "Welcome — Day 7", category: "Onboarding", ...welcomeSequence.day7("Jordan") },
  { id: "quiz-abandon", name: "Quiz Abandonment", category: "Recovery", ...quizAbandonment("Jordan") },
  { id: "checkout-1hr", name: "Checkout Abandon — 1hr", category: "Recovery", ...checkoutAbandonment.hour1("Jordan") },
  { id: "checkout-24hr", name: "Checkout Abandon — 24hr", category: "Recovery", ...checkoutAbandonment.hour24("Jordan") },
  { id: "refill", name: "Refill Reminder", category: "Treatment", ...refillReminder("Jordan", 7) },
  { id: "milestone", name: "Milestone Congratulations", category: "Engagement", ...milestoneCongrats("Jordan", "You've lost 15 pounds! That's a major milestone.") },
  { id: "cancel-save", name: "Cancellation Save Offer", category: "Retention", ...cancellationSaveOffer("Jordan") },
];

const categoryColors: Record<string, string> = {
  Onboarding: "bg-teal-50 text-teal-700",
  Recovery: "bg-amber-50 text-amber-700",
  Treatment: "bg-atlantic/5 text-atlantic",
  Engagement: "bg-gold-50 text-gold-700",
  Retention: "bg-red-50 text-red-700",
};

export default function EmailPreviewPage() {
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const selected = templates.find((t) => t.id === selectedId)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Email Templates</h2>
        <p className="text-sm text-graphite-400">Preview all lifecycle email templates before connecting to Resend</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Template list */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">Templates ({templates.length})</CardTitle></CardHeader>
          <CardContent className="space-y-1 p-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors ${selectedId === t.id ? "bg-teal-50" : "hover:bg-navy-50/50"}`}
              >
                <Mail className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${selectedId === t.id ? "text-teal" : "text-graphite-300"}`} />
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${selectedId === t.id ? "text-teal-800" : "text-navy"}`}>{t.name}</p>
                  <span className={`inline-block rounded px-1 py-0.5 text-[8px] font-semibold mt-0.5 ${categoryColors[t.category] || "bg-navy-50 text-navy"}`}>
                    {t.category}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-navy">{selected.name}</p>
                  <p className="text-xs text-graphite-400">Subject: {selected.subject}</p>
                </div>
                <Badge className={categoryColors[selected.category] || ""}>{selected.category}</Badge>
              </div>

              {/* Email preview iframe-like container */}
              <div className="rounded-xl border border-navy-200 bg-white overflow-hidden">
                <div className="flex items-center gap-2 border-b border-navy-200 bg-navy-50/30 px-4 py-2">
                  <Eye className="h-3.5 w-3.5 text-graphite-400" />
                  <span className="text-xs text-graphite-400">Email Preview</span>
                </div>
                <div
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: selected.html }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Raw HTML toggle */}
          <Card>
            <CardHeader><CardTitle className="text-sm">HTML Source</CardTitle></CardHeader>
            <CardContent>
              <pre className="max-h-48 overflow-auto rounded-xl bg-navy-50/50 p-4 text-[10px] text-graphite-500 font-mono whitespace-pre-wrap">
                {selected.html.substring(0, 2000)}
                {selected.html.length > 2000 && "..."}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
