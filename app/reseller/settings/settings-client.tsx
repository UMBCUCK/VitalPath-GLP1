"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPriceDecimal } from "@/lib/utils";
import {
  User,
  Building,
  CreditCard,
  FileText,
  Crown,
  DollarSign,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ProfileData {
  id: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  contactPhone: string | null;
  tier: string;
  status: string;
  commissionPct: number | null;
  subscriptionCommissionEnabled: boolean;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
  payoutMethod: string;
  payoutBankName: string | null;
  payoutAccountLast4: string | null;
  payoutRoutingLast4: string | null;
  taxIdProvided: boolean;
  taxId1099Eligible: boolean;
}

interface PayoutSummaryData {
  totalEarned: number;
  totalPaid: number;
  pendingPayout: number;
  nextPayoutEstimate: string;
}

interface TierProgressData {
  currentTier: string;
  nextTier: string | null;
  requirements: {
    sales: { current: number; needed: number };
    recruits: { current: number; needed: number };
    revenue: { current: number; needed: number };
  };
  progressPct: number;
}

interface Props {
  profile: ProfileData;
  payoutSummary: PayoutSummaryData;
  tierProgress: TierProgressData;
}

export function SettingsClient({ profile, payoutSummary, tierProgress }: Props) {
  const [form, setForm] = useState({
    displayName: profile.displayName,
    companyName: profile.companyName || "",
    contactEmail: profile.contactEmail,
    contactPhone: profile.contactPhone || "",
  });

  const [payout, setPayout] = useState({
    payoutMethod: profile.payoutMethod,
    payoutBankName: profile.payoutBankName || "",
    payoutAccountLast4: profile.payoutAccountLast4 || "",
    payoutRoutingLast4: profile.payoutRoutingLast4 || "",
  });

  const [taxIdProvided, setTaxIdProvided] = useState(profile.taxIdProvided);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutSaveStatus, setPayoutSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/reseller/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          companyName: form.companyName || null,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone || null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayout = async () => {
    setPayoutSaving(true);
    setPayoutSaveStatus("idle");
    try {
      const res = await fetch("/api/reseller/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutMethod: payout.payoutMethod,
          payoutBankName: payout.payoutBankName || null,
          payoutAccountLast4: payout.payoutAccountLast4 || null,
          payoutRoutingLast4: payout.payoutRoutingLast4 || null,
          taxIdProvided,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setPayoutSaveStatus("success");
      setTimeout(() => setPayoutSaveStatus("idle"), 3000);
    } catch {
      setPayoutSaveStatus("error");
    } finally {
      setPayoutSaving(false);
    }
  };

  const tierColor = (t: string) => {
    const colors: Record<string, string> = {
      STANDARD: "bg-gray-100 text-gray-700",
      SILVER: "bg-slate-100 text-slate-700",
      GOLD: "bg-amber-50 text-amber-700 border-amber-200",
      AMBASSADOR: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[t] || "bg-gray-100 text-gray-700";
  };

  const inputClasses =
    "w-full rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Settings</h2>
        <p className="text-sm text-graphite-400">
          Manage your account, payout preferences, and program details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-base font-semibold text-navy">
                Profile
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, displayName: e.target.value }))
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, companyName: e.target.value }))
                }
                placeholder="Optional"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactEmail: e.target.value }))
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactPhone: e.target.value }))
                }
                placeholder="Optional"
                className={inputClasses}
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-50 transition-colors"
            >
              {saveStatus === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </>
              ) : saveStatus === "error" ? (
                <>
                  <AlertCircle className="h-4 w-4" /> Error
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
                </>
              )}
            </button>
          </CardContent>
        </Card>

        {/* Payout Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <CreditCard className="h-4 w-4 text-emerald-600" />
              </div>
              <CardTitle className="text-base font-semibold text-navy">
                Payout Preferences
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                Payout Method
              </label>
              <select
                value={payout.payoutMethod}
                onChange={(e) =>
                  setPayout((p) => ({ ...p, payoutMethod: e.target.value }))
                }
                className={inputClasses}
              >
                <option value="CREDIT">Account Credit</option>
                <option value="BANK_ACH">Bank ACH</option>
                <option value="CHECK">Check</option>
              </select>
            </div>

            {payout.payoutMethod === "BANK_ACH" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={payout.payoutBankName}
                    onChange={(e) =>
                      setPayout((p) => ({ ...p, payoutBankName: e.target.value }))
                    }
                    placeholder="e.g. Chase Bank"
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                      Account Last 4
                    </label>
                    <input
                      type="text"
                      value={payout.payoutAccountLast4}
                      onChange={(e) =>
                        setPayout((p) => ({
                          ...p,
                          payoutAccountLast4: e.target.value.slice(0, 4),
                        }))
                      }
                      maxLength={4}
                      placeholder="1234"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-graphite-500 mb-1.5">
                      Routing Last 4
                    </label>
                    <input
                      type="text"
                      value={payout.payoutRoutingLast4}
                      onChange={(e) =>
                        setPayout((p) => ({
                          ...p,
                          payoutRoutingLast4: e.target.value.slice(0, 4),
                        }))
                      }
                      maxLength={4}
                      placeholder="5678"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleSavePayout}
              disabled={payoutSaving}
              className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-50 transition-colors"
            >
              {payoutSaveStatus === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </>
              ) : payoutSaveStatus === "error" ? (
                <>
                  <AlertCircle className="h-4 w-4" /> Error
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />{" "}
                  {payoutSaving ? "Saving..." : "Save Payout Settings"}
                </>
              )}
            </button>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
              <CardTitle className="text-base font-semibold text-navy">
                Tax Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-navy-100/60 p-3">
              <div>
                <p className="text-sm font-medium text-navy">W-9 Status</p>
                <p className="text-xs text-graphite-400">
                  Required for payouts exceeding $600/year
                </p>
              </div>
              {taxIdProvided ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  On File
                </Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  Not Submitted
                </Badge>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={taxIdProvided}
                onChange={(e) => setTaxIdProvided(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal accent-teal"
              />
              <div>
                <p className="text-sm font-medium text-navy">
                  I have submitted my W-9 / Tax ID
                </p>
                <p className="text-xs text-graphite-400">
                  Check this box to confirm your tax documents are on file
                </p>
              </div>
            </label>

            {profile.taxId1099Eligible && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-sm text-amber-800">
                  Your earnings qualify for 1099 reporting. Please ensure your
                  W-9 information is up to date.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                <DollarSign className="h-4 w-4 text-teal" />
              </div>
              <CardTitle className="text-base font-semibold text-navy">
                Commission Summary
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-navy-100/30">
              <span className="text-sm text-graphite-500">Total Earned</span>
              <span className="text-sm font-semibold text-navy">
                {formatPriceDecimal(payoutSummary.totalEarned)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-navy-100/30">
              <span className="text-sm text-graphite-500">Total Paid</span>
              <span className="text-sm font-semibold text-emerald-600">
                {formatPriceDecimal(payoutSummary.totalPaid)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-navy-100/30">
              <span className="text-sm text-graphite-500">Pending Payout</span>
              <span className="text-sm font-semibold text-amber-600">
                {formatPriceDecimal(payoutSummary.pendingPayout)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-graphite-500">
                Next Estimated Payout
              </span>
              <span className="text-sm font-medium text-navy">
                {payoutSummary.nextPayoutEstimate}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Program Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                <Crown className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-base font-semibold text-navy">
                Program Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-navy-100/60 p-4">
                <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                  Current Tier
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={tierColor(tierProgress.currentTier)}>
                    {tierProgress.currentTier}
                  </Badge>
                  {tierProgress.nextTier && (
                    <span className="text-xs text-graphite-400">
                      {tierProgress.progressPct}% to {tierProgress.nextTier}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-navy-100/60 p-4">
                <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                  Commission Rate
                </p>
                <p className="mt-2 text-lg font-bold text-navy">
                  {profile.commissionPct != null
                    ? `${profile.commissionPct}%`
                    : "Tiered"}
                </p>
              </div>

              <div className="rounded-lg border border-navy-100/60 p-4">
                <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                  Subscription Commission
                </p>
                <Badge
                  className={
                    profile.subscriptionCommissionEnabled
                      ? "mt-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "mt-2 bg-gray-100 text-gray-500"
                  }
                >
                  {profile.subscriptionCommissionEnabled
                    ? "Enabled"
                    : "Disabled"}
                </Badge>
              </div>

              <div className="rounded-lg border border-navy-100/60 p-4">
                <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                  Tier 1 Override
                </p>
                <p className="mt-2 text-lg font-bold text-teal">
                  {profile.tier1OverridePct}%
                </p>
              </div>

              <div className="rounded-lg border border-navy-100/60 p-4">
                <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                  Tier 2 Override
                </p>
                <p className="mt-2 text-lg font-bold text-blue-600">
                  {profile.tier2OverridePct}%
                </p>
              </div>

              <div className="rounded-lg border border-navy-100/60 p-4">
                <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                  Tier 3 Override
                </p>
                <p className="mt-2 text-lg font-bold text-purple-600">
                  {profile.tier3OverridePct}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
