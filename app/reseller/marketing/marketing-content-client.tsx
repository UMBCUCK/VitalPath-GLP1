"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, FileCheck, Clock, CheckCircle, XCircle, Loader2,
  AlertTriangle, ChevronDown, ChevronRight,
} from "lucide-react";

interface Submission {
  id: string;
  contentType: string;
  title: string;
  content: string;
  platform: string | null;
  status: string;
  reviewNotes: string | null;
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

interface Props {
  submissions: Submission[];
}

const STATUS_CONFIG: Record<string, { variant: "success" | "warning" | "destructive" | "secondary"; icon: typeof CheckCircle }> = {
  PENDING: { variant: "warning", icon: Clock },
  APPROVED: { variant: "success", icon: CheckCircle },
  REJECTED: { variant: "destructive", icon: XCircle },
  REVISION_REQUESTED: { variant: "warning", icon: AlertTriangle },
};

const CONTENT_TYPES = [
  { value: "SOCIAL_POST", label: "Social Media Post" },
  { value: "EMAIL", label: "Email" },
  { value: "BLOG", label: "Blog Post" },
  { value: "VIDEO_SCRIPT", label: "Video Script" },
  { value: "LANDING_PAGE", label: "Landing Page" },
  { value: "OTHER", label: "Other" },
];

export function MarketingContentClient({ submissions: initial }: Props) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    contentType: "SOCIAL_POST",
    platform: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reseller/marketing-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setSubmissions((prev) => [data.submission, ...prev]);
      setShowForm(false);
      setForm({ title: "", content: "", contentType: "SOCIAL_POST", platform: "" });
      router.refresh();
    } catch { setError("Network error."); }
    finally { setSubmitting(false); }
  }

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const approvedCount = submissions.filter((s) => s.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Marketing Content</h2>
          <p className="text-sm text-graphite-400">
            Submit custom marketing content for compliance review (5 business day turnaround)
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Submit Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-graphite-400">Submitted</p><p className="text-lg font-bold text-navy">{submissions.length}</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-graphite-400">Pending Review</p><p className="text-lg font-bold text-amber-500">{pendingCount}</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-graphite-400">Approved</p><p className="text-lg font-bold text-emerald-500">{approvedCount}</p></CardContent></Card>
      </div>

      {/* Submit Form */}
      {showForm && (
        <Card className="border-teal/30 bg-teal-50/10">
          <CardHeader>
            <CardTitle className="text-base">Submit Content for Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Title *</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Instagram Post - Spring Promo" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Content Type *</label>
                  <select
                    value={form.contentType}
                    onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                    className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy"
                  >
                    {CONTENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Platform</label>
                  <Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="e.g. Instagram, TikTok, Email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Paste your full marketing copy here..."
                  rows={6}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy resize-none"
                  maxLength={5000}
                />
                <p className="text-right text-[10px] text-graphite-300 mt-1">{form.content.length}/5,000</p>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <FileCheck className="mr-1 h-3 w-3" />}
                  Submit for Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reminder */}
      <div className="rounded-xl border border-navy-100/40 bg-linen/30 p-4 text-xs text-graphite-500">
        <p className="font-semibold text-navy mb-1">Reminder: All custom content must be approved before use</p>
        <p>Pre-approved templates are available in your Marketing Assets section on the dashboard. Only use custom content after it has been reviewed and marked &ldquo;Approved&rdquo; by our compliance team.</p>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="py-12 text-center text-sm text-graphite-300">
              <FileCheck className="mx-auto mb-2 h-8 w-8 opacity-30" />
              No submissions yet
            </div>
          ) : (
            <div className="divide-y divide-navy-100/30">
              {submissions.map((sub) => {
                const config = STATUS_CONFIG[sub.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = config.icon;
                const isExpanded = expandedId === sub.id;

                return (
                  <div key={sub.id}>
                    <div
                      className="flex items-center justify-between px-6 py-4 hover:bg-navy-50/20 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-graphite-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-graphite-400 shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-navy text-sm truncate">{sub.title}</p>
                          <p className="text-xs text-graphite-400">
                            {sub.contentType.replace("_", " ")} {sub.platform ? `· ${sub.platform}` : ""} · {new Date(sub.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={config.variant} className="text-[10px] flex items-center gap-1 shrink-0">
                        <StatusIcon className="h-3 w-3" />
                        {sub.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-navy-100/20 bg-linen/20 px-6 py-4 space-y-3">
                        <div className="rounded-xl border border-navy-100/40 bg-white p-4 text-sm text-graphite-600 whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                          {sub.content}
                        </div>
                        {sub.reviewNotes && (
                          <div className="rounded-xl border border-teal/20 bg-teal-50/20 p-3">
                            <p className="text-xs font-semibold text-navy mb-1">Reviewer Notes:</p>
                            <p className="text-xs text-graphite-600">{sub.reviewNotes}</p>
                          </div>
                        )}
                        {sub.rejectionReason && (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                            <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason:</p>
                            <p className="text-xs text-red-600">{sub.rejectionReason}</p>
                          </div>
                        )}
                        {sub.reviewedAt && (
                          <p className="text-[10px] text-graphite-400">
                            Reviewed on {new Date(sub.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
