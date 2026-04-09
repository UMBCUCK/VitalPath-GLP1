"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Send, Check } from "lucide-react";

export function DoseAdjustmentForm() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Dose Adjustment Request",
        body: `I'd like to discuss a dose adjustment.\n\nReason: ${reason}`,
      }),
    });
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setReason(""); }, 3000);
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal/20 px-4 py-3">
        <Check className="h-4 w-4 text-teal" />
        <p className="text-sm font-medium text-teal-800">Request sent to your care team</p>
      </div>
    );
  }

  if (!open) {
    return (
      <Button variant="outline" className="w-full gap-2" onClick={() => setOpen(true)}>
        <AlertCircle className="h-4 w-4" /> Request Dose Adjustment
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-navy-200 p-4">
      <p className="text-sm font-semibold text-navy">Request Dose Adjustment</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal min-h-[80px] resize-y"
        placeholder="Describe why you'd like to adjust your dose (e.g., side effects, plateaued progress, tolerance)..."
      />
      <div className="flex gap-2">
        <Button size="sm" className="gap-1" onClick={handleSubmit} disabled={!reason.trim()}>
          <Send className="h-3.5 w-3.5" /> Send Request
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}
