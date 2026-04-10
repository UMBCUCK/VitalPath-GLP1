"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, CreditCard, Bell, LogOut, Pause, ArrowDown, Tag,
  AlertTriangle, Check, ChevronRight, Sparkles, TrendingUp, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { ResellerPromoModal } from "@/components/dashboard/reseller-promo-modal";

type CancelStep = "none" | "reason" | "offer" | "confirm" | "done";

const cancelReasons = [
  "Too expensive",
  "Not seeing results",
  "Side effects from medication",
  "Found a different solution",
  "Don't need it anymore",
  "Taking a break",
  "Other",
];

export default function SettingsPage() {
  const router = useRouter();
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [cancelStep, setCancelStep] = useState<CancelStep>("none");
  const [cancelReason, setCancelReason] = useState("");
  const [saveOfferAccepted, setSaveOfferAccepted] = useState(false);
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [resellerStatus, setResellerStatus] = useState<{ applied: boolean; appliedAt: string | null; status: string | null }>({ applied: false, appliedAt: null, status: null });

  useEffect(() => {
    fetch("/api/reseller/apply")
      .then((r) => r.json())
      .then(setResellerStatus)
      .catch(() => {});
  }, []);

  async function saveProfile() {
    await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  function startCancel() {
    track(ANALYTICS_EVENTS.CANCEL_INITIATE);
    setCancelStep("reason");
  }

  function selectReason(reason: string) {
    setCancelReason(reason);
    track(ANALYTICS_EVENTS.CANCEL_REASON_SELECT, { reason });
    setCancelStep("offer");
    track(ANALYTICS_EVENTS.SAVE_OFFER_VIEW, { reason });
  }

  async function acceptSaveOffer(offerType: string) {
    track(ANALYTICS_EVENTS.SAVE_OFFER_ACCEPT, { offer_type: offerType, reason: cancelReason });
    if (offerType === "pause") {
      await fetch("/api/subscription/pause", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ months: 1 }) });
    }
    // downgrade + discount would call similar endpoints in production
    setSaveOfferAccepted(true);
    setCancelStep("done");
  }

  async function confirmCancel() {
    track(ANALYTICS_EVENTS.CANCEL_COMPLETE, { reason: cancelReason });
    await fetch("/api/subscription/cancel", { method: "POST" });
    setCancelStep("done");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
    <ResellerPromoModal
      open={showResellerModal}
      onClose={() => setShowResellerModal(false)}
      onApplied={() => setResellerStatus({ applied: true, appliedAt: new Date().toISOString(), status: "pending" })}
    />
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Settings</h2>

      {/* Account */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-teal" /> Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="block text-xs font-semibold text-navy mb-1">First Name</label><Input value={profileForm.firstName} onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="Jordan" /></div>
            <div><label className="block text-xs font-semibold text-navy mb-1">Last Name</label><Input value={profileForm.lastName} onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Miller" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-navy mb-1">Phone</label><Input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" type="tel" /></div>
          <Button variant="outline" size="sm" onClick={saveProfile}>{profileSaved ? "Saved!" : "Save Changes"}</Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-gold-600" /> Subscription</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl bg-teal-50/50 p-4 mb-4">
            <div>
              <p className="text-sm font-bold text-navy">Premium Plan</p>
              <p className="text-xs text-graphite-400">$397/month &middot; Next billing: Apr 15, 2026</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Change Plan</Button>
            <Button variant="outline" size="sm">Update Payment</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-navy" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Email notifications", description: "Refill reminders, check-in prompts, milestone alerts", default: true },
            { label: "SMS notifications", description: "Shipping updates and urgent care messages", default: false },
            { label: "Marketing emails", description: "Tips, recipes, and program updates", default: true },
          ].map((n) => (
            <label key={n.label} className="flex items-start justify-between rounded-xl border border-navy-100/40 p-4 cursor-pointer hover:bg-navy-50/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-navy">{n.label}</p>
                <p className="text-xs text-graphite-400">{n.description}</p>
              </div>
              <input type="checkbox" defaultChecked={n.default} className="mt-1 h-4 w-4 rounded border-navy-300 text-teal focus:ring-teal" />
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Partner Program */}
      <Card className={cn(
        "overflow-hidden transition-all",
        !resellerStatus.applied && "ring-2 ring-gold/40"
      )}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold-600" /> Partner Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resellerStatus.applied ? (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <Zap className="h-5 w-5 text-teal" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-navy">Reseller application submitted</p>
                  <Badge variant="warning" className="text-xs">Pending review</Badge>
                </div>
                <p className="text-xs text-graphite-400">
                  Applied{" "}
                  {resellerStatus.appliedAt
                    ? new Date(resellerStatus.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "recently"}
                  . We typically respond within 1–2 business days.
                </p>
                <p className="text-xs text-teal mt-2 font-medium">
                  Once approved, your commission rate upgrades automatically to $150/referral.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-navy/95 to-atlantic p-5 text-white">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-gold-300" />
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Make money with VitalPath</span>
                </div>
                <p className="text-lg font-bold mb-1">Earn $150–$250 per referral</p>
                <p className="text-sm text-white/70 mb-4 max-w-sm">
                  Upgrade to our Reseller program and unlock 3× higher commissions, a custom branded page, and a full marketing kit.
                </p>
                <div className="flex flex-wrap gap-3 mb-5">
                  {["3× commissions", "Custom landing page", "Marketing kit", "Partner support"].map((b) => (
                    <span key={b} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                      <Check className="h-3 w-3 text-gold-300" /> {b}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowResellerModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-navy shadow-lg hover:bg-white/90 transition-colors"
                >
                  Apply Now — it&apos;s free
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel / Pause section */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-graphite-500">
            <AlertTriangle className="h-4 w-4" /> Cancel or Pause
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cancelStep === "none" && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-graphite-400">Need to make changes to your subscription?</p>
              <Button variant="outline" size="sm" onClick={startCancel} className="text-graphite-500">
                Cancel Subscription
              </Button>
            </div>
          )}

          {cancelStep === "reason" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy">We're sorry to see you go. Can you tell us why?</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {cancelReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => selectReason(reason)}
                    className="flex items-center gap-2 rounded-xl border-2 border-navy-200 px-4 py-3 text-sm text-left text-graphite-600 hover:border-navy-300 transition-all"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-graphite-400" />
                    {reason}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCancelStep("none")}>Never mind</Button>
            </div>
          )}

          {cancelStep === "offer" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy">Before you go, we have some options:</h3>
              <div className="space-y-3">
                {/* Reason-specific primary offer */}
                {cancelReason === "Too expensive" && (
                  <button onClick={() => acceptSaveOffer("discount")} className="flex w-full items-start gap-3 rounded-xl border-2 border-gold-200 bg-gold-50/30 p-4 text-left hover:border-gold transition-all">
                    <Tag className="mt-0.5 h-5 w-5 text-gold-600" />
                    <div>
                      <p className="text-sm font-bold text-navy">25% off for the next 3 months</p>
                      <p className="text-xs text-graphite-400">We want to make this work for your budget. That brings Premium to $284/mo.</p>
                    </div>
                  </button>
                )}
                {cancelReason === "Not seeing results" && (
                  <button onClick={() => acceptSaveOffer("coaching")} className="flex w-full items-start gap-3 rounded-xl border-2 border-teal/30 bg-teal-50/30 p-4 text-left hover:border-teal transition-all">
                    <Check className="mt-0.5 h-5 w-5 text-teal" />
                    <div>
                      <p className="text-sm font-bold text-navy">Free 1-on-1 coaching session to review your plan</p>
                      <p className="text-xs text-graphite-400">It typically takes 8-12 weeks for full results. Let us help optimize your treatment.</p>
                    </div>
                  </button>
                )}
                {cancelReason === "Side effects from medication" && (
                  <button onClick={() => acceptSaveOffer("provider_consult")} className="flex w-full items-start gap-3 rounded-xl border-2 border-teal/30 bg-teal-50/30 p-4 text-left hover:border-teal transition-all">
                    <Check className="mt-0.5 h-5 w-5 text-teal" />
                    <div>
                      <p className="text-sm font-bold text-navy">Schedule a provider check-in for dose adjustment</p>
                      <p className="text-xs text-graphite-400">Side effects often improve with dose adjustments. Your provider can help fine-tune your treatment.</p>
                    </div>
                  </button>
                )}

                {/* Universal offers shown for all reasons */}
                <button onClick={() => acceptSaveOffer("pause")} className="flex w-full items-start gap-3 rounded-xl border-2 border-teal/30 bg-teal-50/30 p-4 text-left hover:border-teal transition-all">
                  <Pause className="mt-0.5 h-5 w-5 text-teal" />
                  <div>
                    <p className="text-sm font-bold text-navy">Pause for 1-3 months</p>
                    <p className="text-xs text-graphite-400">Take a break without losing your data or progress. Resume anytime, no charge during pause.</p>
                  </div>
                </button>

                <button onClick={() => acceptSaveOffer("downgrade")} className="flex w-full items-start gap-3 rounded-xl border-2 border-navy-200 p-4 text-left hover:border-navy-300 transition-all">
                  <ArrowDown className="mt-0.5 h-5 w-5 text-navy" />
                  <div>
                    <p className="text-sm font-bold text-navy">Downgrade to Essential</p>
                    <p className="text-xs text-graphite-400">Keep your treatment at a lower price point. $279/mo instead of $379/mo.</p>
                  </div>
                </button>

                {cancelReason !== "Too expensive" && (
                  <button onClick={() => acceptSaveOffer("discount")} className="flex w-full items-start gap-3 rounded-xl border-2 border-gold-200 bg-gold-50/30 p-4 text-left hover:border-gold transition-all">
                    <Tag className="mt-0.5 h-5 w-5 text-gold-600" />
                    <div>
                      <p className="text-sm font-bold text-navy">Stay with 20% off for 2 months</p>
                      <p className="text-xs text-graphite-400">We&apos;ll apply a discount to your next two billing cycles.</p>
                    </div>
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-navy-100/40">
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setCancelStep("confirm")}>
                  No thanks, proceed with cancellation
                </Button>
              </div>
            </div>
          )}

          {cancelStep === "confirm" && (
            <div className="space-y-4 text-center py-4">
              <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
              <h3 className="text-base font-bold text-navy">Are you sure?</h3>
              <p className="text-sm text-graphite-400 max-w-md mx-auto">
                Your subscription will remain active until the end of your current billing period.
                You'll lose access to meal plans, coaching, and tracking tools after that date.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setCancelStep("none")}>Keep My Subscription</Button>
                <Button variant="destructive" onClick={confirmCancel}>Confirm Cancellation</Button>
              </div>
            </div>
          )}

          {cancelStep === "done" && (
            <div className="text-center py-4">
              <Check className="mx-auto h-10 w-10 text-teal" />
              <h3 className="mt-3 text-base font-bold text-navy">
                {saveOfferAccepted ? "Your changes have been applied" : "Your subscription has been canceled"}
              </h3>
              <p className="mt-2 text-sm text-graphite-400">
                {saveOfferAccepted
                  ? "We've updated your subscription. Thank you for staying with us."
                  : "Your access continues through the end of your billing period. You can reactivate anytime."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logout */}
      <div className="flex justify-end">
        <Button variant="ghost" className="gap-2 text-graphite-400" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
    </>
  );
}
