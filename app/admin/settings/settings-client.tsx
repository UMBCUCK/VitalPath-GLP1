"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Settings, DollarSign, Shield, Stethoscope, Pill, Mail,
  ToggleLeft, ToggleRight, Save, Check, Palette, Sun, Moon, Droplets, Settings2, ArrowRight,
} from "lucide-react";
import { useAdminTheme, type AdminTheme, applyAdminTheme } from "@/components/admin/dark-mode-toggle";
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
  const { theme: activeTheme, setTheme } = useAdminTheme();

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

      {/* Navigation settings link */}
      <Link href="/admin/settings/navigation">
        <Card className="border border-navy-100/60 hover:border-teal hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal transition-colors">
              <Settings2 className="h-5 w-5 text-teal group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-navy">Customize Sidebar Navigation</p>
              <p className="text-xs text-graphite-400">Reorder, rename, toggle visibility, or move pages between groups</p>
            </div>
            <ArrowRight className="h-4 w-4 text-graphite-300 group-hover:text-teal transition-colors" />
          </CardContent>
        </Card>
      </Link>

      {/* Appearance */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> Appearance — Admin Theme
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose the color scheme for the admin panel. Changes apply instantly and persist across sessions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Default Theme */}
            <button
              onClick={() => setTheme("default")}
              className={`group relative flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                activeTheme === "default"
                  ? "border-primary shadow-md"
                  : "border-navy-100/40 hover:border-navy-200"
              }`}
            >
              {activeTheme === "default" && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
              {/* Preview swatch */}
              <div className="flex h-16 w-full overflow-hidden rounded-xl border border-navy-100/30">
                <div className="w-1/3 bg-white border-r border-navy-100/30" />
                <div className="flex-1 bg-[#F5EFE7]/50 flex flex-col gap-1 p-1.5">
                  <div className="h-2 w-3/4 rounded bg-[#0E223D]/20" />
                  <div className="h-2 w-1/2 rounded bg-[#1F6F78]/40" />
                  <div className="mt-auto h-3 w-2/3 rounded bg-[#1F6F78]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-gold-600" />
                <div>
                  <p className="text-sm font-semibold text-navy">Default (Warm)</p>
                  <p className="text-[10px] text-graphite-400">Linen · Navy · Teal</p>
                </div>
              </div>
            </button>

            {/* Cerulean Theme */}
            <button
              onClick={() => setTheme("cerulean")}
              className={`group relative flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                activeTheme === "cerulean"
                  ? "border-[#00baee] shadow-md shadow-sky-100"
                  : "border-navy-100/40 hover:border-sky-300"
              }`}
            >
              {activeTheme === "cerulean" && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#00baee]">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
              {/* Preview swatch */}
              <div className="flex h-16 w-full overflow-hidden rounded-xl border border-sky-200">
                <div className="w-1/3 bg-white border-r border-sky-200" />
                <div className="flex-1 bg-[#f0f9ff] flex flex-col gap-1 p-1.5">
                  <div className="h-2 w-3/4 rounded bg-[#0b2a33]/20" />
                  <div className="h-2 w-1/2 rounded bg-[#00baee]/40" />
                  <div className="mt-auto h-3 w-2/3 rounded bg-[#00baee]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-sky-500" />
                <div>
                  <p className="text-sm font-semibold text-navy">Cerulean (Light)</p>
                  <p className="text-[10px] text-graphite-400">White · Cerulean Blue · Black</p>
                </div>
              </div>
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => setTheme("dark")}
              className={`group relative flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                activeTheme === "dark"
                  ? "border-indigo-400 shadow-md shadow-indigo-100"
                  : "border-navy-100/40 hover:border-indigo-300"
              }`}
            >
              {activeTheme === "dark" && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
              {/* Preview swatch */}
              <div className="flex h-16 w-full overflow-hidden rounded-xl border border-navy-800/30">
                <div className="w-1/3 bg-[#0d1b2e] border-r border-white/10" />
                <div className="flex-1 bg-[#0a1525] flex flex-col gap-1 p-1.5">
                  <div className="h-2 w-3/4 rounded bg-white/20" />
                  <div className="h-2 w-1/2 rounded bg-teal/40" />
                  <div className="mt-auto h-3 w-2/3 rounded bg-teal-500/80" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-navy">Dark</p>
                  <p className="text-[10px] text-graphite-400">Deep Navy · Teal accents</p>
                </div>
              </div>
            </button>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">
            The theme toggle in the header (
            <Droplets className="inline h-3 w-3 mx-0.5" />
            <Sun className="inline h-3 w-3 mx-0.5" />
            <Moon className="inline h-3 w-3 mx-0.5" />
            ) cycles through all three themes. Your preference is saved per-browser.
          </p>
        </CardContent>
      </Card>

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
              <Input defaultValue="care@naturesjourneyhealth.com" />
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
