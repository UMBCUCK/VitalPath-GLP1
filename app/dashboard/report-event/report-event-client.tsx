"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, Send, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ReportEventClientProps {
  medicationName: string;
}

export function ReportEventClient({ medicationName }: ReportEventClientProps) {
  const [severity, setSeverity] = useState("MILD");
  const [description, setDescription] = useState("");
  const [medication, setMedication] = useState(medicationName);
  const [onsetDate, setOnsetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (description.trim().length < 20) {
      setError("Please provide a description of at least 20 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/adverse-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          severity,
          description: description.trim(),
          medicationName: medication.trim() || undefined,
          onsetDate: onsetDate || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit report. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    const isSevere = severity === "SEVERE" || severity === "LIFE_THREATENING";

    return (
      <div className="space-y-6">
        <Link href="/dashboard/treatment" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Treatment
        </Link>

        <Card className="py-12 text-center">
          <CardContent className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <Check className="h-6 w-6 text-teal" />
            </div>
            <h3 className="text-lg font-bold text-navy">Report Submitted</h3>
            <p className="text-sm text-graphite-400 max-w-md mx-auto">
              Your adverse event report has been received. Your care team will review it and follow up with you.
            </p>
            {isSevere && (
              <div className="mx-auto max-w-md rounded-xl border-2 border-red-300 bg-red-50/50 p-4 text-left">
                <p className="text-sm font-bold text-red-800">Important</p>
                <p className="mt-1 text-sm text-red-700">
                  You reported a <span className="font-semibold">{severity === "LIFE_THREATENING" ? "life-threatening" : "severe"}</span> event.
                  If you are in danger, call <a href="tel:911" className="font-bold underline">911</a> immediately.
                </p>
                <p className="mt-2 text-xs text-red-600">
                  You can also reach our care line at{" "}
                  <a href="tel:8885092745" className="font-semibold underline">(888) 509-2745</a> for urgent assistance.
                </p>
              </div>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/dashboard/treatment">
                <Button variant="outline">Back to Treatment</Button>
              </Link>
              <Link href="/dashboard/messages">
                <Button>Message Care Team</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/treatment" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Treatment
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-navy">Report Adverse Event</h2>
        <p className="text-sm text-graphite-400">Report a side effect or adverse event related to your treatment</p>
      </div>

      {/* Emergency banner */}
      <div className="flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50/50 px-4 py-3">
        <Phone className="h-5 w-5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-bold text-red-800">
            If you are experiencing a medical emergency, call 911 immediately.
          </p>
          <p className="text-xs text-red-600/90">
            For urgent concerns, call our care line:{" "}
            <a href="tel:8885092745" className="font-semibold underline">(888) 509-2745</a>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Event Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Severity */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="calculator-input w-full"
              >
                <option value="MILD">Mild -- Minor discomfort, does not interfere with daily activities</option>
                <option value="MODERATE">Moderate -- Noticeable impact on daily activities</option>
                <option value="SEVERE">Severe -- Significant impact, may need medical attention</option>
                <option value="LIFE_THREATENING">Life-Threatening -- Requires immediate medical intervention</option>
              </select>
              {(severity === "SEVERE" || severity === "LIFE_THREATENING") && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
                  <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                  <p className="text-xs text-red-700">
                    If you are in immediate danger, please call <a href="tel:911" className="font-bold underline">911</a> or go to your nearest emergency room.
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the side effect or adverse event in detail (minimum 20 characters)..."
                className="calculator-input min-h-[120px] w-full resize-y"
                required
                minLength={20}
              />
              <p className="mt-1 text-xs text-graphite-300">
                {description.length}/20 minimum characters
              </p>
            </div>

            {/* Medication */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Medication</label>
              <input
                type="text"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="e.g., Compounded Semaglutide"
                className="calculator-input w-full"
              />
            </div>

            {/* Date of onset */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Date of Onset</label>
              <input
                type="date"
                value={onsetDate}
                onChange={(e) => setOnsetDate(e.target.value)}
                className="calculator-input w-full"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={submitting || description.trim().length < 20} className="gap-2">
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-xs text-graphite-300 text-center">
        All adverse event reports are reviewed by your care team. Severe or life-threatening events
        are escalated to our medical team immediately.
      </p>
    </div>
  );
}
