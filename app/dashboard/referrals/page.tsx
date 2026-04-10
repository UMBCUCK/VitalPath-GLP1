"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy, Check, Gift, DollarSign, Users, TrendingUp, Send, Share2,
  BarChart2, Code2, Sparkles, Mail, ChevronRight, ArrowUpRight, Zap,
  Search, SlidersHorizontal, ArrowUpDown, Link2, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ResellerPromoModal } from "@/components/dashboard/reseller-promo-modal";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ReferralData {
  code: string;
  tier: string;
  totalReferred: number;
  totalEarned: number;
  referrals: Array<{
    id: string;
    referredEmail: string | null;
    status: string;
    payoutCents: number | null;
    createdAt: string;
  }>;
  payoutPerReferral: number;
  payoutType: string;
}

const tierThresholds = [
  { name: "Standard", min: 0, payout: 5000 },
  { name: "Silver", min: 5, payout: 6000 },
  { name: "Gold", min: 10, payout: 7500 },
  { name: "Ambassador", min: 25, payout: 10000 },
];

type Tab = "overview" | "analytics" | "widgets";
type SortDir = "asc" | "desc";
type DateRange = "7d" | "30d" | "90d" | "all";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#e9b949",
  CONVERTED: "#2ab5a5",
  PAID: "#1a8a7d",
  EXPIRED: "#9ca3af",
  FLAGGED: "#ef4444",
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function filterByRange(referrals: ReferralData["referrals"], range: DateRange) {
  if (range === "all") return referrals;
  const cutoff = daysAgo(range === "7d" ? 7 : range === "30d" ? 30 : 90);
  return referrals.filter((r) => new Date(r.createdAt) >= cutoff);
}

function groupByPeriod(referrals: ReferralData["referrals"], range: DateRange) {
  const map: Record<string, { label: string; total: number; converted: number }> = {};

  referrals.forEach((r) => {
    const d = new Date(r.createdAt);
    let key: string;
    let label: string;

    if (range === "7d") {
      key = d.toISOString().slice(0, 10);
      label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    } else if (range === "30d") {
      // Group into weekly buckets
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      key = weekStart.toISOString().slice(0, 10);
      label = "Wk " + weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }

    if (!map[key]) map[key] = { label, total: 0, converted: 0 };
    map[key].total++;
    if (r.status === "CONVERTED" || r.status === "PAID") map[key].converted++;
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
    .slice(-12);
}

function statusBreakdown(referrals: ReferralData["referrals"]) {
  const counts: Record<string, number> = {};
  referrals.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "All time", value: "all" },
];

const UTM_SOURCES = ["instagram", "facebook", "twitter", "youtube", "tiktok", "email", "blog", "podcast", "other"];

export default function ReferralDashboardPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sent" | "duplicate" | "error">("idle");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [showReseller, setShowReseller] = useState(false);
  const [resellerApplied, setResellerApplied] = useState(false);

  // Overview filters
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatus, setHistoryStatus] = useState("ALL");
  const [historySortDir, setHistorySortDir] = useState<SortDir>("desc");

  // Analytics filters
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  // UTM builder
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmSource, setUtmSource] = useState("instagram");
  const [utmMedium, setUtmMedium] = useState("social");

  const loadData = useCallback(async () => {
    const [refData, resellerData] = await Promise.all([
      fetch("/api/referrals").then((r) => r.json()),
      fetch("/api/reseller/apply").then((r) => r.json()).catch(() => ({ applied: false })),
    ]);
    setData(refData);
    setResellerApplied(resellerData.applied || false);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = data ? `${origin}/quiz?ref=${data.code}` : "";

  // UTM-tagged link
  const utmLink = useMemo(() => {
    if (!referralLink) return "";
    const params = new URLSearchParams();
    if (utmCampaign) params.set("utm_campaign", utmCampaign.toLowerCase().replace(/\s+/g, "_"));
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    const qs = params.toString();
    return referralLink + (qs ? "&" + qs : "");
  }, [referralLink, utmCampaign, utmSource, utmMedium]);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function sendInvite() {
    if (!inviteEmail) return;
    const res = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    if (res.ok) {
      setInviteStatus("sent");
      setInviteEmail("");
      setTimeout(() => setInviteStatus("idle"), 4000);
      const updated = await fetch("/api/referrals").then((r) => r.json());
      setData(updated);
    } else {
      const body = await res.json().catch(() => ({}));
      setInviteStatus(body.error === "Already invited" ? "duplicate" : "error");
      setTimeout(() => setInviteStatus("idle"), 4000);
    }
  }

  // Derived data
  const currentTier = tierThresholds.reduce(
    (acc, t) => ((data?.totalReferred || 0) >= t.min ? t : acc),
    tierThresholds[0]
  );
  const nextTier = tierThresholds.find((t) => t.min > (data?.totalReferred || 0));

  // Filtered history
  const filteredHistory = useMemo(() => {
    let refs = data?.referrals || [];
    if (historyStatus !== "ALL") refs = refs.filter((r) => r.status === historyStatus);
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      refs = refs.filter((r) => r.referredEmail?.toLowerCase().includes(q));
    }
    refs = [...refs].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return historySortDir === "desc" ? -diff : diff;
    });
    return refs;
  }, [data, historyStatus, historySearch, historySortDir]);

  // Analytics data filtered by date range
  const rangedReferrals = useMemo(() => filterByRange(data?.referrals || [], dateRange), [data, dateRange]);
  const chartData = useMemo(() => groupByPeriod(rangedReferrals, dateRange), [rangedReferrals, dateRange]);
  const statusData = useMemo(() => statusBreakdown(rangedReferrals), [rangedReferrals]);

  const rangedConverted = rangedReferrals.filter((r) => r.status === "CONVERTED" || r.status === "PAID").length;
  const rangedPending = rangedReferrals.filter((r) => r.status === "PENDING").length;
  const rangedEarned = rangedReferrals.reduce((s, r) => s + (r.payoutCents || 0), 0);
  const conversionRate = rangedReferrals.length > 0
    ? Math.round((rangedConverted / rangedReferrals.length) * 100)
    : 0;

  // Embed codes
  const badgeEmbedCode = `<a href="${referralLink}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#0a2540;color:#fff;padding:10px 18px;border-radius:999px;font-family:sans-serif;font-size:14px;font-weight:600;text-decoration:none;">
  💊 Try Nature's Journey — Get started with GLP-1 treatment
</a>`;

  const cardEmbedCode = `<div style="border:1px solid #e5e7eb;border-radius:16px;padding:24px;max-width:360px;font-family:sans-serif;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.08)">
  <p style="font-size:18px;font-weight:700;color:#0a2540;margin:0 0 8px">Nature's Journey GLP-1 Program</p>
  <p style="font-size:14px;color:#6b7280;margin:0 0 16px">Medical weight loss with semaglutide — supervised by licensed providers.</p>
  <a href="${referralLink}" target="_blank" rel="noopener" style="display:inline-block;background:#2ab5a5;color:#fff;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
    Start your free assessment →
  </a>
</div>`;

  const textLinkCode = `<a href="${referralLink}" target="_blank" rel="noopener">Start your Nature's Journey GLP-1 journey →</a>`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <ResellerPromoModal
        open={showReseller}
        onClose={() => setShowReseller(false)}
        onApplied={() => setResellerApplied(true)}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Referral Program</h2>
            <p className="text-sm text-graphite-400">Share Nature's Journey and earn credit toward your membership</p>
          </div>
          {!resellerApplied ? (
            <button
              onClick={() => setShowReseller(true)}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy to-atlantic px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-300" />
              Earn More — Become a Reseller
              <ChevronRight className="h-3.5 w-3.5 opacity-70" />
            </button>
          ) : (
            <Badge variant="secondary" className="shrink-0 gap-1.5 px-3 py-1.5">
              <Zap className="h-3 w-3 text-gold-600" />
              Reseller Application Pending
            </Badge>
          )}
        </div>

        {/* Mobile reseller CTA */}
        {!resellerApplied && (
          <button
            onClick={() => setShowReseller(true)}
            className="flex sm:hidden w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-navy to-atlantic px-4 py-3 text-sm font-semibold text-white shadow-md"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" />
              Earn More — Become a Reseller
            </span>
            <ChevronRight className="h-4 w-4 opacity-70" />
          </button>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Gift className="h-5 w-5 text-teal" />
              <div>
                <p className="text-xs text-graphite-400">Total Referrals</p>
                <p className="text-xl font-bold text-navy">{data?.totalReferred || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <DollarSign className="h-5 w-5 text-gold-600" />
              <div>
                <p className="text-xs text-graphite-400">Total Earned</p>
                <p className="text-xl font-bold text-navy">{formatPrice(data?.totalEarned || 0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <TrendingUp className="h-5 w-5 text-teal" />
              <div>
                <p className="text-xs text-graphite-400">Per Referral</p>
                <p className="text-xl font-bold text-navy">{formatPrice(currentTier.payout)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-atlantic" />
              <div>
                <p className="text-xs text-graphite-400">Current Tier</p>
                <p className="text-xl font-bold text-navy">{currentTier.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-navy-100/40 bg-navy-50/20 p-1">
          {(["overview", "analytics", "widgets"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-all",
                tab === t ? "bg-white shadow-sm text-navy" : "text-graphite-400 hover:text-navy"
              )}
            >
              {t === "widgets" ? "Embed Widgets" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Referral link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-teal" /> Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl border border-navy-200 bg-navy-50/30 px-4 py-3 overflow-hidden">
                    <p className="text-sm font-mono text-navy truncate">{referralLink || "Loading..."}</p>
                  </div>
                  <Button onClick={() => copyText(referralLink, "link")} className="gap-2 shrink-0">
                    {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === "link" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%27ve%20been%20using%20Nature's Journey%20for%20GLP-1%20weight%20loss.%20Use%20my%20link%20to%20get%20started%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#1da1f2]/10 px-3 py-1.5 text-xs font-semibold text-[#1da1f2] hover:bg-[#1da1f2]/20 transition-colors"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.857L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#1877f2]/10 px-3 py-1.5 text-xs font-semibold text-[#1877f2] hover:bg-[#1877f2]/20 transition-colors"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Share on Facebook
                  </a>
                  <a
                    href={`mailto:?subject=Try%20Nature's Journey%20GLP-1&body=Hey%2C%20I%27ve%20been%20using%20Nature's Journey%20for%20medical%20weight%20loss%20and%20wanted%20to%20share%20it.%20Use%20my%20link%3A%20${encodeURIComponent(referralLink)}`}
                    className="flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy-100 transition-colors"
                  >
                    <Mail className="h-3 w-3" /> Share via Email
                  </a>
                </div>
                <p className="mt-3 text-xs text-graphite-400">
                  Your code: <span className="font-mono font-bold text-navy">{data?.code || "..."}</span>
                </p>
              </CardContent>
            </Card>

            {/* Invite by email */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invite by Email</CardTitle>
              </CardHeader>
              <CardContent>
                {inviteStatus === "sent" ? (
                  <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal/20 p-3">
                    <Check className="h-5 w-5 text-teal shrink-0" />
                    <p className="text-sm font-medium text-navy">Invite recorded! We&apos;ll track the conversion.</p>
                  </div>
                ) : inviteStatus === "duplicate" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 p-3">
                      <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                      <p className="text-sm text-navy">That email was already invited. Try a different address.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setInviteStatus("idle")}>Try again</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="friend@email.com"
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                      />
                      <Button onClick={sendInvite} disabled={!inviteEmail} className="gap-2 shrink-0">
                        <Send className="h-4 w-4" /> Send Invite
                      </Button>
                    </div>
                    {inviteStatus === "error" && (
                      <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tier progress */}
            {nextTier && (
              <Card className="bg-gradient-to-r from-gold-50 to-linen border-gold-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-navy">
                        {nextTier.min - (data?.totalReferred || 0)} more referrals to reach {nextTier.name}
                      </p>
                      <p className="text-xs text-graphite-400">
                        Earn {formatPrice(nextTier.payout)} per referral at {nextTier.name} tier
                      </p>
                    </div>
                    <Badge variant="gold">{currentTier.name} → {nextTier.name}</Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-400 transition-all"
                      style={{ width: `${Math.min(100, ((data?.totalReferred || 0) / nextTier.min) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-graphite-400">
                    <span>0</span>
                    {tierThresholds.slice(1).map((t) => (
                      <span key={t.name} className={cn((data?.totalReferred || 0) >= t.min ? "font-semibold text-navy" : "")}>
                        {t.min} — {t.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History with filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <CardTitle className="text-base">Referral History</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-graphite-400" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search email..."
                        className="h-8 w-40 rounded-lg border border-navy-200 bg-white pl-8 pr-3 text-xs text-navy placeholder:text-graphite-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20"
                      />
                    </div>
                    {/* Status filter */}
                    <div className="relative flex items-center gap-1">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-graphite-400" />
                      <select
                        value={historyStatus}
                        onChange={(e) => setHistoryStatus(e.target.value)}
                        className="h-8 rounded-lg border border-navy-200 bg-white pl-2 pr-6 text-xs text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20 appearance-none"
                      >
                        <option value="ALL">All statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="PAID">Paid</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="FLAGGED">Flagged</option>
                      </select>
                    </div>
                    {/* Sort toggle */}
                    <button
                      onClick={() => setHistorySortDir((d) => d === "desc" ? "asc" : "desc")}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 text-xs text-graphite-400 hover:text-navy hover:border-navy-300 transition-colors"
                      title={historySortDir === "desc" ? "Newest first" : "Oldest first"}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      {historySortDir === "desc" ? "Newest" : "Oldest"}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(data?.referrals?.length || 0) === 0 ? (
                  <div className="py-8 text-center">
                    <Gift className="mx-auto h-10 w-10 text-graphite-200" />
                    <p className="mt-3 text-sm text-graphite-400">No referrals yet. Share your link to get started!</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-graphite-200" />
                    <p className="mt-3 text-sm text-graphite-400">No referrals match your filters.</p>
                    <button
                      onClick={() => { setHistorySearch(""); setHistoryStatus("ALL"); }}
                      className="mt-2 text-xs text-teal underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-navy-100/40 text-left">
                            <th className="pb-3 font-medium text-graphite-400">Email</th>
                            <th className="pb-3 font-medium text-graphite-400">Status</th>
                            <th className="pb-3 font-medium text-graphite-400">Earnings</th>
                            <th className="pb-3 font-medium text-graphite-400 cursor-pointer select-none" onClick={() => setHistorySortDir((d) => d === "desc" ? "asc" : "desc")}>
                              <span className="flex items-center gap-1">
                                Date <ArrowUpDown className="h-3 w-3 opacity-50" />
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-100/30">
                          {filteredHistory.map((ref) => (
                            <tr key={ref.id} className="hover:bg-navy-50/20 transition-colors">
                              <td className="py-3 text-navy">{ref.referredEmail || "—"}</td>
                              <td className="py-3">
                                <Badge
                                  variant={
                                    ref.status === "CONVERTED" || ref.status === "PAID" ? "success"
                                    : ref.status === "PENDING" ? "warning"
                                    : "secondary"
                                  }
                                >
                                  {ref.status}
                                </Badge>
                              </td>
                              <td className="py-3 font-medium text-navy">
                                {ref.payoutCents ? formatPrice(ref.payoutCents) : "—"}
                              </td>
                              <td className="py-3 text-graphite-400">
                                {new Date(ref.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs text-graphite-400">
                      Showing {filteredHistory.length} of {data?.referrals.length} referrals
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── ANALYTICS TAB ────────────────────────────────────── */}
        {tab === "analytics" && (
          <div className="space-y-6">
            {/* Date range filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-graphite-400 uppercase tracking-wide">Time range:</span>
              {DATE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    dateRange === opt.value
                      ? "bg-navy text-white shadow-sm"
                      : "border border-navy-200 text-graphite-400 hover:border-navy hover:text-navy"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wide">Referred</p>
                  <p className="text-3xl font-bold text-navy mt-1">{rangedReferrals.length}</p>
                  <p className="text-xs text-graphite-400 mt-1">in selected period</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wide">Conversion Rate</p>
                  <p className="text-3xl font-bold text-navy mt-1">{conversionRate}%</p>
                  <p className="text-xs text-graphite-400 mt-1">{rangedConverted} converted</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wide">Pending</p>
                  <p className="text-3xl font-bold text-navy mt-1">{rangedPending}</p>
                  <p className="text-xs text-graphite-400 mt-1">awaiting checkout</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wide">Earned</p>
                  <p className="text-3xl font-bold text-navy mt-1">{formatPrice(rangedEarned)}</p>
                  <p className="text-xs text-graphite-400 mt-1">in selected period</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-teal" /> Referrals Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rangedReferrals.length === 0 ? (
                  <div className="py-12 text-center">
                    <BarChart2 className="mx-auto h-10 w-10 text-graphite-200" />
                    <p className="mt-3 text-sm text-graphite-400">No referrals in this period</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barGap={4}>
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,.1)", fontSize: 12 }}
                        cursor={{ fill: "rgba(10,37,64,.04)" }}
                      />
                      <Bar dataKey="total" name="Referred" fill="#dbeafe" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="converted" name="Converted" fill="#2ab5a5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-graphite-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#dbeafe] border border-[#93c5fd] inline-block" /> Referred
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-teal inline-block" /> Converted
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Status breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length === 0 ? (
                  <p className="py-6 text-center text-sm text-graphite-400">No referrals in this period</p>
                ) : (
                  <div className="space-y-3">
                    {statusData.map(({ status, count }) => (
                      <div key={status} className="flex items-center gap-3">
                        <div className="w-28 shrink-0">
                          <Badge
                            variant={
                              status === "CONVERTED" || status === "PAID" ? "success"
                              : status === "PENDING" ? "warning"
                              : "secondary"
                            }
                          >
                            {status}
                          </Badge>
                        </div>
                        <div className="flex-1 h-3 rounded-full bg-navy-50/50 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.round((count / Math.max(1, rangedReferrals.length)) * 100)}%`,
                              background: STATUS_COLORS[status] || "#9ca3af",
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-semibold text-navy">{count}</span>
                        <span className="w-9 text-right text-xs text-graphite-400">
                          {Math.round((count / Math.max(1, rangedReferrals.length)) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Earnings projection */}
            <Card className="bg-gradient-to-br from-navy-50/30 to-teal-50/20 border-teal/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wide mb-1">Annual Projection</p>
                    <p className="text-sm text-graphite-500">
                      At your pace, you could earn{" "}
                      <span className="font-bold text-navy">
                        {formatPrice(
                          Math.round(
                            (rangedReferrals.length / Math.max(1, dateRange === "7d" ? 1/4 : dateRange === "30d" ? 1 : dateRange === "90d" ? 3 : 12))
                            * 12 * currentTier.payout
                          )
                        )}
                      </span>{" "}
                      this year at {currentTier.name} tier.
                    </p>
                    <p className="text-xs text-graphite-400 mt-1">Extrapolated from your {DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label.toLowerCase()} activity.</p>
                  </div>
                  {!resellerApplied && (
                    <button
                      onClick={() => setShowReseller(true)}
                      className="shrink-0 flex items-center gap-1.5 rounded-lg bg-navy text-white px-3 py-2 text-xs font-semibold hover:bg-atlantic transition-colors"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Boost earnings
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── WIDGETS TAB ──────────────────────────────────────── */}
        {tab === "widgets" && (
          <div className="space-y-6">
            <p className="text-sm text-graphite-400">
              Embed these on your website, blog, or email. All links include your referral code automatically.
            </p>

            {/* UTM Campaign Link Builder */}
            <Card className="border-teal/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-teal" /> Campaign Link Builder
                  <Badge variant="secondary" className="text-xs ml-1">UTM tracking</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-graphite-400">
                  Create tracked links for specific campaigns so you can see which channel drives the most conversions.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">Campaign name</label>
                    <Input
                      value={utmCampaign}
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      placeholder="e.g. spring-promo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">Source</label>
                    <select
                      value={utmSource}
                      onChange={(e) => setUtmSource(e.target.value)}
                      className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    >
                      {UTM_SOURCES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">Medium</label>
                    <select
                      value={utmMedium}
                      onChange={(e) => setUtmMedium(e.target.value)}
                      className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    >
                      <option value="social">Social</option>
                      <option value="email">Email</option>
                      <option value="paid">Paid</option>
                      <option value="organic">Organic</option>
                      <option value="referral">Referral</option>
                      <option value="content">Content</option>
                    </select>
                  </div>
                </div>
                <div className="rounded-xl border border-navy-200 bg-navy-50/30 p-4">
                  <p className="text-xs font-semibold text-graphite-400 mb-2">Generated link:</p>
                  <p className="text-xs font-mono text-navy break-all leading-relaxed">{utmLink}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="gap-2"
                    onClick={() => copyText(utmLink, "utm")}
                  >
                    {copied === "utm" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === "utm" ? "Copied!" : "Copy Campaign Link"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => { setUtmCampaign(""); setUtmSource("instagram"); setUtmMedium("social"); }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pill Badge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-teal" /> Pill Badge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-navy-50/30 p-5 flex items-center justify-center">
                  <a
                    href={referralLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                  >
                    💊 Try Nature's Journey — Get started with GLP-1 treatment
                  </a>
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-xl bg-navy/95 p-4 text-xs text-white/80 leading-relaxed whitespace-pre-wrap break-all">
                    {badgeEmbedCode}
                  </pre>
                  <Button
                    size="sm" variant="outline"
                    className="absolute top-3 right-3 gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    onClick={() => copyText(badgeEmbedCode, "badge")}
                  >
                    {copied === "badge" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === "badge" ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-teal" /> Referral Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-navy-50/30 p-5 flex items-center justify-center">
                  <div className="border border-gray-200 rounded-2xl p-6 max-w-[360px] w-full bg-white shadow-sm">
                    <p className="text-lg font-bold text-navy mb-2">Nature's Journey GLP-1 Program</p>
                    <p className="text-sm text-graphite-400 mb-4">Medical weight loss with semaglutide — supervised by licensed providers.</p>
                    <a href={referralLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Start your free assessment <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-xl bg-navy/95 p-4 text-xs text-white/80 leading-relaxed whitespace-pre-wrap break-all">
                    {cardEmbedCode}
                  </pre>
                  <Button
                    size="sm" variant="outline"
                    className="absolute top-3 right-3 gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    onClick={() => copyText(cardEmbedCode, "card")}
                  >
                    {copied === "card" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === "card" ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Text Link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-teal" /> Text Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-navy-50/30 p-5">
                  <a href={referralLink} target="_blank" rel="noopener noreferrer" className="text-sm text-teal underline font-medium">
                    Start your Nature's Journey GLP-1 journey →
                  </a>
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-xl bg-navy/95 p-4 text-xs text-white/80 leading-relaxed whitespace-pre-wrap break-all">
                    {textLinkCode}
                  </pre>
                  <Button
                    size="sm" variant="outline"
                    className="absolute top-3 right-3 gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    onClick={() => copyText(textLinkCode, "text")}
                  >
                    {copied === "text" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === "text" ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Raw link */}
            <Card className="border-dashed border-navy-200">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-navy">Raw referral link</p>
                  <p className="text-xs text-graphite-400 font-mono mt-0.5 truncate max-w-xs">{referralLink}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => copyText(referralLink, "raw")}>
                  {copied === "raw" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "raw" ? "Copied" : "Copy Link"}
                </Button>
              </CardContent>
            </Card>

            {/* Reseller upsell */}
            {!resellerApplied && (
              <div className="rounded-2xl bg-gradient-to-r from-navy to-atlantic p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-gold-300" />
                      <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Reseller Program</span>
                    </div>
                    <p className="font-bold text-lg">Want a custom branded page?</p>
                    <p className="text-sm text-white/70 mt-1 max-w-sm">
                      Resellers get a personalized landing page, higher commissions, and a full marketing kit — all ready to deploy.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReseller(true)}
                    className="shrink-0 flex items-center gap-2 rounded-xl bg-white text-navy px-4 py-2.5 text-sm font-bold hover:bg-white/90 transition-colors shadow-md"
                  >
                    Learn More <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
