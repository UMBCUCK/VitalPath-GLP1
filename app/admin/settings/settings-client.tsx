"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings, DollarSign, Shield, Stethoscope, Pill, Mail,
  ToggleLeft, ToggleRight, Save, Check,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ReferralSettings {
  id: string;
  defaultPayoutCents: number;
  payoutType: string;
  payoutCapCents: number | null;
  bonusTiers: unknown;
  isActive: boolean;
}

export function AdminSettingsClient({
  referralSettings,
}: {
  referralSettings: ReferralSettings | null;
}) {
  const [saved, setSaved] = useState(false);

  // Referral config
  const [refPayout, setRefPayout] = useState(String((referralSettings?.defaultPayoutCents || 5000) / 100));
  const [refType, setRefType] = useState(referralSettings?.payoutType || "CREDIT");
  const [refCap, setRefCap] = useState(referralSettings?.payoutCapCents ? String(referralSettings.payoutCapCents / 100) : "");

  // Vendor config
  const [telehealthVendor, setTelehealthVendor] = useState(process.env.TELEHEALTH_VENDOR || "mock");
  const [pharmacyVendor, setPharmacyVendor] = useState(process.env.PHARMACY_VENDOR || "mock");

  // Feature flags
  const [features, setFeatures] = useState({
    referrals: true,
    mealPlans: true,
    calculators: true,
    labMembership: false,
    mensHealth: false,
    hairSkin: false,
    healthyAging: false,
  });

  function toggleFeature(key: string) {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  }

  async function handleSave() {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultPayoutCents: Math.round(parseFloat(refPayout) * 100),
        payoutType: refType,
        payoutCapCents: refCap ? Math.round(parseFloat(refCap) * 100) : null,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Platform Settings</h2>
          <p className="text-sm text-graphite-400">Configure referrals, vendors, compliance, and features</p>
        </div>
        <Button className="gap-2" onClick={handleSave}>
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Referral Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gold-600" /> Referral Payouts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Default Payout ($)</label>
              <Input type="number" value={refPayout} onChange={(e) => setRefPayout(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Payout Type</label>
              <select value={refType} onChange={(e) => setRefType(e.target.value)} className="calculator-input text-sm">
                <option value="CREDIT">Account Credit</option>
                <option value="CASH">Cash / Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Max Total Payout ($, blank = no cap)</label>
              <Input type="number" value={refCap} onChange={(e) => setRefCap(e.target.value)} placeholder="No cap" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-2">Tier Payouts</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { tier: "Standard", referrals: "1-4", default: 50 },
                { tier: "Silver", referrals: "5-9", default: 60 },
                { tier: "Gold", referrals: "10-24", default: 75 },
                { tier: "Ambassador", referrals: "25+", default: 100 },
              ].map((t) => (
                <div key={t.tier} className="rounded-xl border border-navy-100/40 p-3 text-center">
                  <p className="text-xs font-bold text-navy">{t.tier}</p>
                  <p className="text-[10px] text-graphite-400">{t.referrals} referrals</p>
                  <Input type="number" defaultValue={t.default} className="mt-2 h-8 text-center text-sm" />
                  <p className="text-[10px] text-graphite-300 mt-1">$/referral</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal" /> Vendor Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Telehealth Provider</label>
              <select value={telehealthVendor} onChange={(e) => setTelehealthVendor(e.target.value)} className="calculator-input text-sm">
                <option value="mock">Mock (Development)</option>
                <option value="openloop">OpenLoop Health</option>
                <option value="wheel">Wheel</option>
                <option value="custom">Custom Integration</option>
              </select>
              <p className="mt-1 text-[10px] text-graphite-300">Change requires TELEHEALTH_API_KEY and TELEHEALTH_API_URL env vars</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Pharmacy Provider</label>
              <select value={pharmacyVendor} onChange={(e) => setPharmacyVendor(e.target.value)} className="calculator-input text-sm">
                <option value="mock">Mock (Development)</option>
                <option value="generic">Generic API</option>
                <option value="truepill">Truepill</option>
                <option value="custom">Custom Integration</option>
              </select>
              <p className="mt-1 text-[10px] text-graphite-300">Change requires PHARMACY_API_KEY and PHARMACY_API_URL env vars</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Email Provider</label>
              <select className="calculator-input text-sm">
                <option value="mock">Mock (Development)</option>
                <option value="resend">Resend</option>
                <option value="sendgrid">SendGrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">From Email</label>
              <Input defaultValue="care@vitalpath.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-navy" /> Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "referrals", label: "Referral Program", desc: "Member referral links and rewards" },
              { key: "mealPlans", label: "Meal Plans & Recipes", desc: "Weekly meal plans and recipe content" },
              { key: "calculators", label: "Health Calculators", desc: "BMI, TDEE, protein, hydration tools" },
              { key: "labMembership", label: "Lab Membership", desc: "Quarterly metabolic panels" },
              { key: "mensHealth", label: "Men's Health Program", desc: "Men's health expansion category" },
              { key: "hairSkin", label: "Hair & Skin Program", desc: "Hair/skin/confidence category" },
              { key: "healthyAging", label: "Healthy Aging Program", desc: "Longevity and aging category" },
            ].map((f) => (
              <div key={f.key} className="flex items-center justify-between rounded-xl border border-navy-100/40 p-4">
                <div>
                  <p className="text-sm font-medium text-navy">{f.label}</p>
                  <p className="text-[10px] text-graphite-400">{f.desc}</p>
                </div>
                <button onClick={() => toggleFeature(f.key)}>
                  {features[f.key as keyof typeof features] ? (
                    <ToggleRight className="h-6 w-6 text-teal" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-graphite-300" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" /> Compliance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Require claim approval before publish", default: true },
            { label: "Show FDA disclaimer on all medication pages", default: true },
            { label: "Require HIPAA consent on intake", default: true },
            { label: "Enable results gallery (requires photo moderation)", default: true },
            { label: "Allow numeric claims without medical review", default: false },
          ].map((c) => (
            <label key={c.label} className="flex items-center justify-between rounded-xl border border-navy-100/40 p-4 cursor-pointer hover:bg-navy-50/20 transition-colors">
              <span className="text-sm text-navy">{c.label}</span>
              <input type="checkbox" defaultChecked={c.default} className="h-4 w-4 rounded border-navy-300 text-teal focus:ring-teal" />
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
