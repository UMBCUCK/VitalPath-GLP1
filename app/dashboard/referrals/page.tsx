"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy, Check, Gift, DollarSign, TrendingUp, Send, Share2,
  BarChart2, Code2, Sparkles, Mail, ChevronRight, ArrowUpRight, Zap,
  Search, SlidersHorizontal, ArrowUpDown, Link2, RefreshCw, Trophy, Medal, Star,
  Wallet, Clock, QrCode, Lock, MessageSquare, Info,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ResellerPromoModal } from "@/components/dashboard/reseller-promo-modal";
import { ReferralQrCard } from "@/components/dashboard/referral-qr-card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

interface LeaderboardEntry {
  rank: number;
  name: string;
  isMe: boolean;
  totalReferred: number;
  totalEarned: number;
  tier: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  myRank: number | null;
  myEntry: LeaderboardEntry | null;
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

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
        entry.isMe
          ? "bg-teal-50 border-2 border-teal/30 shadow-sm"
          : "bg-navy-50/30 border border-transparent hover:border-navy-100/40"
      )}
    >
      {/* Rank badge */}
      <span className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        entry.rank === 1 ? "bg-gold-100 text-gold-700" :
        entry.rank === 2 ? "bg-slate-200 text-slate-600" :
        entry.rank === 3 ? "bg-amber-100 text-amber-700" :
        "bg-navy-100 text-graphite-500"
      )}>
        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
      </span>

      {/* Name + tier */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-semibold truncate",
          entry.isMe ? "text-teal" : "text-navy"
        )}>
          {entry.name}
          {entry.isMe && <span className="ml-1.5 text-[10px] font-normal text-teal/70">(you)</span>}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-semibold",
            entry.tier === "AMBASSADOR" ? "bg-gold-100 text-gold-700" :
            entry.tier === "GOLD" ? "bg-amber-100 text-amber-700" :
            entry.tier === "SILVER" ? "bg-slate-100 text-slate-600" :
            "bg-teal-50 text-teal"
          )}>
            {entry.tier.charAt(0) + entry.tier.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-navy">{entry.totalReferred} referral{entry.totalReferred !== 1 ? "s" : ""}</p>
        <p className="text-[10px] text-graphite-400">{formatPrice(entry.totalEarned)} earned</p>
      </div>
    </div>
  );
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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "partial" | "duplicate" | "error">("idle");
  const [inviteSentCount, setInviteSentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [showReseller, setShowReseller] = useState(false);
  const [resellerApplied, setResellerApplied] = useState(false);
  const [newConversion, setNewConversion] = useState<{ email: string; payout: number } | null>(null);

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
    const [refData, resellerData, lbData] = await Promise.all([
      fetch("/api/referrals").then((r) => r.json()),
      fetch("/api/reseller/apply").then((r) => r.json()).catch(() => ({ applied: false })),
      fetch("/api/referrals/leaderboard").then((r) => r.json()).catch(() => ({ leaderboard: [], myRank: null, myEntry: null })) as Promise<LeaderboardData>,
    ]);
    setData(refData);
    setResellerApplied(resellerData.applied || false);
    setLeaderboard(lbData.leaderboard || []);
    setMyRank(lbData.myRank ?? null);
    setMyEntry(lbData.myEntry ?? null);
    setLoading(false);

    const recentConversion = (refData.referrals as Array<{ id: string; status: string; createdAt: string; payoutCents: number | null; referredEmail: string | null }>)?.find(
      (r) =>
        r.status === "CONVERTED" &&
        Date.now() - new Date(r.createdAt).getTime() < 24 * 60 * 60 * 1000
    );
    if (recentConversion) {
      const seenKey = `seen_${recentConversion.referredEmail}_${recentConversion.createdAt}`;
      if (!sessionStorage.getItem(seenKey)) {
        setNewConversion({ email: recentConversion.referredEmail || "Someone", payout: recentConversion.payoutCents || 5000 });
        sessionStorage.setItem(seenKey, "1");
      }
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (newConversion) {
      const t = setTimeout(() => setNewConversion(null), 8000);
      return () => clearTimeout(t);
    }
  }, [newConversion]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = data ? `${origin}/qualify?ref=${data.code}` : "";

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
    if (!inviteEmail.trim()) return;
    // Support comma-separated multi-invite
    const emails = inviteEmail
      .split(/[,\s]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));
    if (emails.length === 0) return;
    setInviteStatus("sending");

    if (emails.length === 1) {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emails[0] }),
      });
      if (res.ok) {
        setInviteStatus("sent");
        setInviteSentCount(1);
        setInviteEmail("");
        setTimeout(() => setInviteStatus("idle"), 5000);
        const updated = await fetch("/api/referrals").then((r) => r.json());
        setData(updated);
      } else {
        const body = await res.json().catch(() => ({}));
        setInviteStatus(body.error === "Already invited" ? "duplicate" : "error");
        setTimeout(() => setInviteStatus("idle"), 4000);
      }
    } else {
      // Batch: fire all, collect results
      const results = await Promise.allSettled(
        emails.map((e) =>
          fetch("/api/referrals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: e }),
          }).then((r) => ({ ok: r.ok, email: e }))
        )
      );
      const sent = results.filter((r) => r.status === "fulfilled" && r.value.ok).length;
      setInviteSentCount(sent);
      setInviteEmail("");
      setInviteStatus(sent === emails.length ? "sent" : sent > 0 ? "partial" : "error");
      setTimeout(() => setInviteStatus("idle"), 6000);
      if (sent > 0) {
        const updated = await fetch("/api/referrals").then((r) => r.json());
        setData(updated);
      }
    }
  }

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function nativeShare() {
    if (!canShare || !referralLink) return;
    try {
      await navigator.share({
        title: "Join me on Nature's Journey",
        text: "I've been using Nature's Journey for GLP-1 medical weight loss — supervised by a real provider. Use my link to get started:",
        url: referralLink,
      });
    } catch {
      // User cancelled or unsupported — silent
    }
  }

  // Derived data
  const currentTier = tierThresholds.reduce(
    (acc, t) => ((data?.totalReferred || 0) >= t.min ? t : acc),
    tierThresholds[0]
  );
  const nextTier = tierThresholds.find((t) => t.min > (data?.totalReferred || 0));

  // Earnings breakdown
  const pendingEarnings = useMemo(
    () => (data?.referrals || []).filter((r) => r.status === "CONVERTED").reduce((s, r) => s + (r.payoutCents || 0), 0),
    [data]
  );
  const paidEarnings = useMemo(
    () => (data?.referrals || []).filter((r) => r.status === "PAID").reduce((s, r) => s + (r.payoutCents || 0), 0),
    [data]
  );

  // Milestones
  const milestones = useMemo(() => {
    const referred = data?.totalReferred || 0;
    const earned = data?.totalEarned || 0;
    return [
      { id: "first", emoji: "🌱", label: "First Referral", desc: "Refer your first member", unlocked: referred >= 1 },
      { id: "silver", emoji: "⭐", label: "Silver Status", desc: "5 referrals to unlock Silver", unlocked: referred >= 5 },
      { id: "gold", emoji: "🏆", label: "Gold Status", desc: "10 referrals to unlock Gold", unlocked: referred >= 10 },
      { id: "earn100", emoji: "💵", label: "$100 Earned", desc: "Earn your first $100 in credit", unlocked: earned >= 10000 },
      { id: "ambassador", emoji: "👑", label: "Ambassador", desc: "25 referrals to reach Ambassador", unlocked: referred >= 25 },
      { id: "earn500", emoji: "💰", label: "$500 Earned", desc: "Earn $500 in referral credit", unlocked: earned >= 50000 },
    ];
  }, [data]);

  // QR code visibility toggle
  const [showQr, setShowQr] = useState(false);

  // Share kit state
  const [shareChannel, setShareChannel] = useState<"text" | "instagram" | "email" | "facebook" | "linkedin">("text");

  // Earnings calculator
  const [calcReferrals, setCalcReferrals] = useState(10);

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

  // Share kit messages
  const shareMessages: Record<string, string> = {
    text: `Hey! I've been using VitalPath for GLP-1 medical weight loss and it's been amazing — down real weight with a licensed provider guiding me. Check it out here: ${referralLink}`,
    instagram: `✨ Real weight loss, real results. I've been on VitalPath's GLP-1 program and the support has been incredible. Link in bio or visit: ${referralLink} #GLP1 #WeightLoss #VitalPath`,
    email: `Subject: Something that's actually working for weight loss\n\nHey,\n\nI've been quietly trying something for the past few months and wanted to share it with you. VitalPath is a telehealth program that prescribed me GLP-1 medication (semaglutide) — supervised by a real licensed provider.\n\nI'm actually seeing results. The process was easy, shipping was fast, and the team checks in regularly.\n\nIf you've been curious about GLP-1 medications, this is the easiest way to get started safely:\n${referralLink}\n\nLet me know if you have questions — happy to share more!`,
    facebook: `I don't usually post about health stuff, but I've had too many people ask me what I'm doing differently lately. I started VitalPath's GLP-1 program and it's been a game changer — real medication, real provider, real results. If you're curious: ${referralLink}`,
    linkedin: `Over the past few months I've been quietly experimenting with something that's had a real impact on my energy and focus — VitalPath's medically supervised GLP-1 program. Sharing for anyone who might find it useful: ${referralLink}`,
  };

  // Calculator tier for a given referral count
  const calcTier = (n: number) => tierThresholds.reduce((acc, t) => (n >= t.min ? t : acc), tierThresholds[0]);
  const calcEarnings = calcReferrals * calcTier(calcReferrals).payout;
  const calcNextTier = tierThresholds.find((t) => t.min > calcReferrals);

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
      {newConversion && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl bg-navy text-white px-5 py-4 shadow-2xl max-w-sm animate-in slide-in-from-bottom-4 duration-500">
          <span className="text-2xl shrink-0">🎉</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">New referral converted!</p>
            <p className="text-xs text-white/60 mt-0.5 truncate">{newConversion.email} just signed up</p>
            <p className="text-xs text-teal mt-1 font-semibold">You earned {formatPrice(newConversion.payout)}</p>
          </div>
          <button onClick={() => setNewConversion(null)} className="shrink-0 text-white/50 hover:text-white ml-1 text-lg leading-none">×</button>
        </div>
      )}

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

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-3">
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
                <p className="text-xs text-graphite-400">Earn Per Referral</p>
                <p className="text-xl font-bold text-navy">{formatPrice(currentTier.payout)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tier progress card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Tier header gradient */}
            <div className={cn(
              "px-6 py-4",
              currentTier.name === "Ambassador" ? "bg-gradient-to-r from-gold-600 to-gold-400" :
              currentTier.name === "Gold" ? "bg-gradient-to-r from-amber-500 to-yellow-400" :
              currentTier.name === "Silver" ? "bg-gradient-to-r from-graphite-400 to-slate-300" :
              "bg-gradient-to-r from-teal to-atlantic"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    {currentTier.name === "Ambassador" ? <Trophy className="h-5 w-5 text-white" /> :
                     currentTier.name === "Gold" ? <Medal className="h-5 w-5 text-white" /> :
                     currentTier.name === "Silver" ? <Star className="h-5 w-5 text-white" /> :
                     <Gift className="h-5 w-5 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Your Tier</p>
                    <p className="text-xl font-bold text-white">{currentTier.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">Earning</p>
                  <p className="text-lg font-bold text-white">{formatPrice(currentTier.payout)}<span className="text-sm font-normal">/referral</span></p>
                </div>
              </div>
            </div>

            {/* Tier ladder */}
            <div className="px-6 py-4 space-y-3">
              {nextTier && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-graphite-500">
                      Progress to <span className="text-navy">{nextTier.name}</span>
                    </p>
                    <p className="text-xs text-graphite-400">
                      {data?.totalReferred || 0} / {nextTier.min} referrals
                    </p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-navy-100/40">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
                      style={{ width: `${Math.min(100, ((data?.totalReferred || 0) / nextTier.min) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-graphite-400">
                    {nextTier.min - (data?.totalReferred || 0)} more referral{nextTier.min - (data?.totalReferred || 0) !== 1 ? "s" : ""} to unlock{" "}
                    <span className="font-semibold text-navy">{formatPrice(nextTier.payout)}/referral</span>
                  </p>
                </div>
              )}

              {/* All tier levels */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {tierThresholds.map((tier) => {
                  const unlocked = (data?.totalReferred || 0) >= tier.min;
                  const active = tier.name === currentTier.name;
                  return (
                    <div
                      key={tier.name}
                      className={cn(
                        "rounded-xl border-2 p-3 transition-all",
                        active ? "border-teal bg-teal-50/50 shadow-sm" :
                        unlocked ? "border-emerald-200 bg-emerald-50/30" :
                        "border-navy-100/40 bg-navy-50/20 opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={cn("text-xs font-bold", active ? "text-teal" : unlocked ? "text-emerald-700" : "text-graphite-400")}>
                          {tier.name}
                        </p>
                        {active && <Check className="h-3 w-3 text-teal" />}
                        {!active && unlocked && <Check className="h-3 w-3 text-emerald-500" />}
                      </div>
                      <p className="text-sm font-bold text-navy">{formatPrice(tier.payout)}</p>
                      <p className="text-[10px] text-graphite-400">{tier.min === 0 ? "Starting tier" : `${tier.min}+ referrals`}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Near-tier urgency nudge */}
        {nextTier && (data?.totalReferred || 0) >= nextTier.min - 2 && (data?.totalReferred || 0) < nextTier.min && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-gold-300 bg-gradient-to-r from-gold-50 to-linen px-5 py-4 shadow-sm">
            <span className="text-2xl shrink-0">🔥</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy">
                {nextTier.min - (data?.totalReferred || 0) === 1
                  ? `One more referral unlocks ${nextTier.name}!`
                  : `${nextTier.min - (data?.totalReferred || 0)} referrals away from ${nextTier.name} tier`}
              </p>
              <p className="text-xs text-graphite-500 mt-0.5">
                Hit {nextTier.name} to earn <span className="font-semibold text-navy">{formatPrice(nextTier.payout)}</span> per referral — that's <span className="font-semibold text-navy">{formatPrice(nextTier.payout - (currentTier?.payout || 0))} more</span> per signup.
              </p>
            </div>
            <Badge variant="gold" className="shrink-0">{nextTier.name}</Badge>
          </div>
        )}

        {/* How it works — collapsible */}
        {(data?.totalReferred || 0) < 3 && (
          <div className="rounded-2xl border border-navy-100/40 bg-navy-50/20 overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-navy-100/40">
              {[
                { step: "1", icon: "🔗", title: "Share your link", desc: "Send your unique referral link to friends, family, or followers" },
                { step: "2", icon: "✅", title: "They sign up", desc: "When they complete checkout, your referral is instantly tracked" },
                { step: "3", icon: "💵", title: "You get paid", desc: `Earn ${formatPrice(currentTier.payout)} in credit toward your membership` },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-2 px-4 py-5 text-center">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-xs font-bold text-navy">{s.title}</p>
                  <p className="text-[11px] text-graphite-400 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {/* Tier 9.5 — in-person QR code for the user's real referral code */}
            {data?.code && <ReferralQrCard referralCode={data.code} />}

            {/* Referral link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-teal" /> Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="w-full flex-1 rounded-xl border border-navy-200 bg-navy-50/30 px-4 py-3 overflow-hidden min-w-0">
                    <p className="text-sm font-mono text-navy truncate">{referralLink || "Loading..."}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => copyText(referralLink, "link")} className="flex-1 sm:flex-none gap-2 shrink-0">
                      {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied === "link" ? "Copied!" : "Copy"}
                    </Button>
                    {canShare && (
                      <Button variant="outline" onClick={nativeShare} className="flex-1 sm:flex-none gap-2 shrink-0" title="Share via device">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%27ve%20been%20using%20Nature's Journey%20for%20GLP-1%20weight%20loss.%20Use%20my%20link%20to%20get%20started%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#1da1f2]/10 px-3 py-1.5 text-xs font-semibold text-[#1da1f2] hover:bg-[#1da1f2]/20 transition-colors"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.857L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span className="hidden sm:inline">Share on </span>X
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#1877f2]/10 px-3 py-1.5 text-xs font-semibold text-[#1877f2] hover:bg-[#1877f2]/20 transition-colors"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span className="hidden sm:inline">Share on </span>Facebook
                  </a>
                  <a
                    href={`mailto:?subject=Try%20Nature's Journey%20GLP-1&body=Hey%2C%20I%27ve%20been%20using%20Nature's Journey%20for%20medical%20weight%20loss%20and%20wanted%20to%20share%20it.%20Use%20my%20link%3A%20${encodeURIComponent(referralLink)}`}
                    className="flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy-100 transition-colors"
                  >
                    <Mail className="h-3 w-3" /> <span className="hidden sm:inline">Share via </span>Email
                  </a>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-graphite-400">
                    Your code: <span className="font-mono font-bold text-navy">{data?.code || "..."}</span>
                  </p>
                  <button
                    onClick={() => setShowQr((v) => !v)}
                    className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-2.5 py-1 text-xs font-medium text-graphite-500 hover:border-navy hover:text-navy transition-colors"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    {showQr ? "Hide QR" : "Show QR"}
                  </button>
                </div>

                {/* QR Code */}
                {showQr && referralLink && (
                  <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-navy-100/40 bg-navy-50/20 p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&color=0a2540&data=${encodeURIComponent(referralLink)}`}
                      alt="QR code for referral link"
                      className="h-[180px] w-[180px] rounded-lg"
                    />
                    <div className="text-center">
                      <p className="text-xs font-semibold text-navy">Scan to visit your referral page</p>
                      <p className="text-[10px] text-graphite-400 mt-0.5">Share in person, in print, or in a presentation</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=16&color=0a2540&data=${encodeURIComponent(referralLink)}`;
                        a.download = `referral-qr-${data?.code}.png`;
                        a.click();
                      }}
                    >
                      Download QR PNG
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Kit */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal" /> Share Kit
                  <Badge variant="secondary" className="text-[10px] ml-1">Ready-to-send copy</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-graphite-400">Pick a channel and copy the pre-written message — just paste and send.</p>
                {/* Channel tabs */}
                <div className="flex flex-wrap gap-2">
                  {(["text","instagram","email","facebook","linkedin"] as const).map((ch) => {
                    const labels: Record<string, string> = { text: "💬 Text/DM", instagram: "📸 Instagram", email: "📧 Email", facebook: "👥 Facebook", linkedin: "💼 LinkedIn" };
                    return (
                      <button
                        key={ch}
                        onClick={() => setShareChannel(ch)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-medium transition-all border",
                          shareChannel === ch
                            ? "bg-navy text-white border-navy shadow-sm"
                            : "border-navy-200 text-graphite-500 hover:border-navy hover:text-navy bg-white"
                        )}
                      >
                        {labels[ch]}
                      </button>
                    );
                  })}
                </div>
                {/* Message preview */}
                <div className="relative rounded-xl bg-navy-50/40 border border-navy-100/60 p-4">
                  <p className="text-sm text-navy whitespace-pre-wrap leading-relaxed pr-10">
                    {shareMessages[shareChannel]}
                  </p>
                  <button
                    onClick={() => copyText(shareMessages[shareChannel], `share-${shareChannel}`)}
                    className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-navy-200 bg-white px-2 py-1 text-[10px] font-semibold text-navy hover:bg-navy-50 transition-colors shadow-sm"
                  >
                    {copied === `share-${shareChannel}` ? <><Check className="h-3 w-3 text-teal" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
                {shareChannel === "instagram" && (
                  <p className="text-[11px] text-graphite-400 flex items-center gap-1">
                    <Info className="h-3 w-3 shrink-0" /> Update your bio link to your referral URL, then post this caption.
                  </p>
                )}
                {shareChannel === "email" && (
                  <p className="text-[11px] text-graphite-400 flex items-center gap-1">
                    <Info className="h-3 w-3 shrink-0" /> Subject line is included — paste the full message into your email client.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Earnings wallet */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-teal" /> Your Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl bg-teal-50/60 border border-teal/20 p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-teal mb-1">Total</p>
                    <p className="text-xl font-bold text-navy">{formatPrice(data?.totalEarned || 0)}</p>
                    <p className="text-[10px] text-graphite-400 mt-0.5">lifetime</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/60 border border-amber-200/50 p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-1">Pending</p>
                    <p className="text-xl font-bold text-navy">{formatPrice(pendingEarnings)}</p>
                    <p className="text-[10px] text-graphite-400 mt-0.5">awaiting payout</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/50 p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 mb-1">Paid</p>
                    <p className="text-xl font-bold text-navy">{formatPrice(paidEarnings)}</p>
                    <p className="text-[10px] text-graphite-400 mt-0.5">credited</p>
                  </div>
                </div>
                {pendingEarnings > 0 && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-3">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">{formatPrice(pendingEarnings)}</span> in earnings pending payout — typically processed within 7 business days of your referral&apos;s first payment.
                    </p>
                  </div>
                )}
                {pendingEarnings === 0 && paidEarnings === 0 && (data?.totalReferred || 0) === 0 && (
                  <p className="text-center text-xs text-graphite-400">Earnings appear here once your referrals sign up.</p>
                )}
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gold-600" /> Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all",
                        m.unlocked
                          ? "border-teal/30 bg-teal-50/40 shadow-sm"
                          : "border-navy-100/40 bg-navy-50/20 opacity-60"
                      )}
                    >
                      {!m.unlocked && (
                        <Lock className="absolute top-2 right-2 h-3 w-3 text-graphite-300" />
                      )}
                      {m.unlocked && (
                        <Check className="absolute top-2 right-2 h-3 w-3 text-teal" />
                      )}
                      <span className="text-2xl mb-2">{m.emoji}</span>
                      <p className={cn("text-xs font-bold", m.unlocked ? "text-navy" : "text-graphite-400")}>{m.label}</p>
                      <p className="text-[10px] text-graphite-400 mt-0.5 leading-tight">{m.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[11px] text-graphite-300">
                  {milestones.filter((m) => m.unlocked).length} of {milestones.length} milestones unlocked
                </p>
              </CardContent>
            </Card>

            {/* Invite by email */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Invite by Email</CardTitle>
                  <Badge variant="secondary" className="text-[10px]">Supports multiple</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {inviteStatus === "sent" ? (
                  <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal/20 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/10">
                      <Check className="h-4 w-4 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {inviteSentCount === 1 ? "Invite sent!" : `${inviteSentCount} invites sent!`}
                      </p>
                      <p className="text-xs text-graphite-400">We&apos;ll track each conversion automatically.</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto shrink-0 text-xs" onClick={() => setInviteStatus("idle")}>Invite more</Button>
                  </div>
                ) : inviteStatus === "partial" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
                      <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-navy">{inviteSentCount} invite{inviteSentCount !== 1 ? "s" : ""} sent</p>
                        <p className="text-xs text-graphite-400">Some addresses may already be invited or invalid.</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setInviteStatus("idle")}>Try again</Button>
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
                        type="text"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="friend@email.com, another@email.com"
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                        disabled={inviteStatus === "sending"}
                      />
                      <Button onClick={sendInvite} disabled={!inviteEmail.trim() || inviteStatus === "sending"} className="gap-2 shrink-0">
                        {inviteStatus === "sending" ? (
                          <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending...</>
                        ) : (
                          <><Send className="h-4 w-4" /> Send</>
                        )}
                      </Button>
                    </div>
                    <p className="text-[11px] text-graphite-400">
                      Separate multiple addresses with commas. Each person gets a unique tracked invite.
                    </p>
                    {inviteStatus === "error" && (
                      <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

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

            {/* Community Leaderboard */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold-600" /> Top Referrers
                  </CardTitle>
                  {myRank && (
                    <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal/20 px-3 py-1.5">
                      <span className="text-xs font-semibold text-teal">Your Rank</span>
                      <span className="text-sm font-bold text-navy">#{myRank}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="py-8 text-center">
                    <Trophy className="mx-auto h-10 w-10 text-graphite-200" />
                    <p className="mt-3 text-sm text-graphite-400">No referrers on the board yet — be the first!</p>
                    <p className="mt-1 text-xs text-graphite-300">Share your link to claim the #1 spot!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry) => (
                      <LeaderboardRow key={entry.rank} entry={entry} />
                    ))}

                    {/* Show user's position if outside top 10 */}
                    {myEntry && (
                      <>
                        <div className="flex items-center gap-2 py-1">
                          <div className="flex-1 border-t border-dashed border-navy-100/50" />
                          <span className="text-[10px] text-graphite-300 shrink-0">your position</span>
                          <div className="flex-1 border-t border-dashed border-navy-100/50" />
                        </div>
                        <LeaderboardRow entry={myEntry} />
                      </>
                    )}
                  </div>
                )}
                <p className="mt-4 text-center text-[11px] text-graphite-300">
                  Rankings update in real time &middot; Names shown as initials for privacy
                </p>
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
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Donut */}
                    <div className="shrink-0">
                      <ResponsiveContainer width={180} height={180}>
                        <PieChart>
                          <Pie
                            data={statusData.map(d => ({ name: d.status, value: d.count }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {statusData.map(({ status }) => (
                              <Cell key={status} fill={STATUS_COLORS[status] || "#9ca3af"} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,.1)", fontSize: 12 }}
                            formatter={(v: number, name: string) => [`${v} (${Math.round((v / rangedReferrals.length) * 100)}%)`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Bars */}
                    <div className="flex-1 space-y-3 w-full">
                      {statusData.map(({ status, count }) => (
                        <div key={status} className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 w-28 shrink-0">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[status] || "#9ca3af" }} />
                            <Badge
                              variant={status === "CONVERTED" || status === "PAID" ? "success" : status === "PENDING" ? "warning" : "secondary"}
                              className="text-[10px]"
                            >
                              {status}
                            </Badge>
                          </div>
                          <div className="flex-1 h-2.5 rounded-full bg-navy-50/50 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.round((count / Math.max(1, rangedReferrals.length)) * 100)}%`, background: STATUS_COLORS[status] || "#9ca3af" }}
                            />
                          </div>
                          <span className="w-7 text-right text-sm font-bold text-navy">{count}</span>
                          <span className="w-9 text-right text-xs text-graphite-400">{Math.round((count / Math.max(1, rangedReferrals.length)) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interactive Earnings Calculator */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-teal" /> Earnings Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-graphite-500">How many referrals are you aiming for?</label>
                    <span className="text-sm font-bold text-navy">{calcReferrals} referrals</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={calcReferrals}
                    onChange={(e) => setCalcReferrals(Number(e.target.value))}
                    className="w-full accent-teal h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-graphite-400 mt-1">
                    <span>1</span><span>10</span><span>25</span><span>50</span>
                  </div>
                </div>

                {/* Result */}
                <div className="rounded-2xl bg-gradient-to-br from-teal-50/60 to-navy-50/40 border border-teal/20 p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-teal mb-0.5">You would earn</p>
                      <p className="text-4xl font-bold text-navy">{formatPrice(calcEarnings)}</p>
                      <p className="text-xs text-graphite-400 mt-1">
                        {calcReferrals} × {formatPrice(calcTier(calcReferrals).payout)} at <span className="font-semibold text-navy">{calcTier(calcReferrals).name}</span> tier
                      </p>
                    </div>
                    <div className="text-right">
                      {calcNextTier && (
                        <div className="rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3">
                          <p className="text-[10px] font-semibold text-gold-700 mb-0.5">Tip: refer {calcNextTier.min} to unlock {calcNextTier.name}</p>
                          <p className="text-sm font-bold text-navy">
                            +{formatPrice((calcNextTier.payout - calcTier(calcReferrals).payout) * calcNextTier.min)} more
                          </p>
                          <p className="text-[10px] text-graphite-400">vs staying at {calcTier(calcReferrals).name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tier breakdown */}
                <div className="grid grid-cols-4 gap-2">
                  {tierThresholds.map((t) => (
                    <div
                      key={t.name}
                      className={cn(
                        "rounded-xl border p-3 text-center transition-all",
                        calcTier(calcReferrals).name === t.name
                          ? "border-teal bg-teal-50/50 shadow-sm"
                          : "border-navy-100/40 opacity-50"
                      )}
                    >
                      <p className="text-[10px] font-bold text-graphite-500">{t.name}</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formatPrice(t.payout)}</p>
                      <p className="text-[9px] text-graphite-400">{t.min === 0 ? "0+" : `${t.min}+`} refs</p>
                    </div>
                  ))}
                </div>

                <p className="text-center text-[11px] text-graphite-400">
                  At your pace ({rangedReferrals.length > 0 ? `${rangedReferrals.length} in selected period` : "0 so far"}), you&apos;re on track for{" "}
                  <span className="font-semibold text-navy">
                    {formatPrice(
                      Math.round(
                        (rangedReferrals.length / Math.max(1, dateRange === "7d" ? 0.25 : dateRange === "30d" ? 1 : dateRange === "90d" ? 3 : 12))
                        * 12 * currentTier.payout
                      )
                    )}/yr
                  </span>{" "}
                  annualised.
                  {!resellerApplied && (
                    <button onClick={() => setShowReseller(true)} className="ml-1 text-teal underline">
                      Want to earn more?
                    </button>
                  )}
                </p>
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
