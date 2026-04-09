"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Gift, DollarSign, Users, TrendingUp, Send, Share2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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

export default function ReferralDashboardPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const referralLink = data
    ? `${window.location.origin}/quiz?ref=${data.code}`
    : "";

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendInvite() {
    if (!inviteEmail) return;
    const res = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    if (res.ok) {
      setInviteSent(true);
      setInviteEmail("");
      setTimeout(() => setInviteSent(false), 3000);
      // Refresh data
      const updated = await fetch("/api/referrals").then((r) => r.json());
      setData(updated);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
      </div>
    );
  }

  const currentTier = tierThresholds.reduce((acc, t) =>
    (data?.totalReferred || 0) >= t.min ? t : acc, tierThresholds[0]
  );
  const nextTier = tierThresholds.find((t) => t.min > (data?.totalReferred || 0));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Referral Program</h2>
        <p className="text-sm text-graphite-400">Share VitalPath and earn credit toward your membership</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><Gift className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Referrals</p><p className="text-xl font-bold text-navy">{data?.totalReferred || 0}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><DollarSign className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Total Earned</p><p className="text-xl font-bold text-navy">{formatPrice(data?.totalEarned || 0)}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Per Referral</p><p className="text-xl font-bold text-navy">{formatPrice(currentTier.payout)}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Current Tier</p><p className="text-xl font-bold text-navy">{currentTier.name}</p></div></CardContent></Card>
      </div>

      {/* Referral link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-4 w-4 text-teal" /> Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl border border-navy-200 bg-navy-50/30 px-4 py-3">
              <p className="text-sm font-mono text-navy truncate">{referralLink || "Loading..."}</p>
            </div>
            <Button onClick={copyLink} className="gap-2 shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
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
          {inviteSent ? (
            <div className="flex items-center gap-3 py-2">
              <Check className="h-5 w-5 text-teal" />
              <p className="text-sm font-medium text-navy">Invite recorded! We'll track the conversion.</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@email.com"
                className="flex-1"
              />
              <Button onClick={sendInvite} disabled={!inviteEmail} className="gap-2 shrink-0">
                <Send className="h-4 w-4" /> Send Invite
              </Button>
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
          </CardContent>
        </Card>
      )}

      {/* Referral history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {(data?.referrals?.length || 0) === 0 ? (
            <div className="py-8 text-center">
              <Gift className="mx-auto h-10 w-10 text-graphite-200" />
              <p className="mt-3 text-sm text-graphite-400">No referrals yet. Share your link to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 text-left">
                    <th className="pb-3 font-medium text-graphite-400">Email</th>
                    <th className="pb-3 font-medium text-graphite-400">Status</th>
                    <th className="pb-3 font-medium text-graphite-400">Earnings</th>
                    <th className="pb-3 font-medium text-graphite-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {data?.referrals?.map((ref) => (
                    <tr key={ref.id}>
                      <td className="py-3 text-navy">{ref.referredEmail || "—"}</td>
                      <td className="py-3">
                        <Badge variant={ref.status === "CONVERTED" || ref.status === "PAID" ? "success" : ref.status === "PENDING" ? "warning" : "secondary"}>
                          {ref.status}
                        </Badge>
                      </td>
                      <td className="py-3 font-medium text-navy">{ref.payoutCents ? formatPrice(ref.payoutCents) : "—"}</td>
                      <td className="py-3 text-graphite-400">{new Date(ref.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
