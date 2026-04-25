"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, CreditCard, Bell, LogOut, Pause, ArrowDown, Tag,
  AlertTriangle, Check, ChevronRight, Sparkles, TrendingUp, Zap, Lock, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { ResellerPromoModal } from "@/components/dashboard/reseller-promo-modal";
import { WearablesSection } from "./wearables-section";

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

interface SubscriptionData {
  planName: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [cancelStep, setCancelStep] = useState<CancelStep>("none");
  const [cancelReason, setCancelReason] = useState("");
  const [saveOfferAccepted, setSaveOfferAccepted] = useState(false);
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [resellerStatus, setResellerStatus] = useState<{ applied: boolean; appliedAt: string | null; status: string | null }>({ applied: false, appliedAt: null, status: null });
  // Password change state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwVisible, setPwVisible] = useState(false);
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [pwError, setPwError] = useState("");
  // Notification prefs (controlled)
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: false, marketing: true });

  useEffect(() => {
    fetch("/api/reseller/apply")
      .then((r) => r.json())
      .then(setResellerStatus)
      .catch(() => {});

    // Load real profile data
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.firstName !== undefined) {
          setProfileForm({ firstName: d.firstName, lastName: d.lastName, phone: d.phone });
          setUserEmail(d.email || "");
          setProfileLoaded(true);
        }
        if (d.subscription) setSubscription(d.subscription);
      })
      .catch(() => setProfileLoaded(true));
  }, []);

  async function changePassword() {
    setPwError("");
    if (!pwForm.current || !pwForm.next) { setPwError("Please fill in all fields."); return; }
    if (pwForm.next.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("New passwords don't match."); return; }
    setPwStatus("saving");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwStatus("ok");
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwStatus("idle"), 3000);
      } else {
        setPwStatus("error");
        setPwError(data.error || "Failed to update password.");
      }
    } catch {
      setPwStatus("error");
      setPwError("Something went wrong. Please try again.");
    }
  }

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

    // Tier 7.3 — wire all save-offer types to real endpoints so the
    // retention modal actually persists and applies Stripe mutations.
    try {
      if (offerType === "pause") {
        await fetch("/api/subscription/pause", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ months: 1 }),
        });
      } else if (["discount", "downgrade", "coaching", "provider_consult"].includes(offerType)) {
        await fetch("/api/subscription/save-offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offerType, reason: cancelReason || undefined }),
        });
      }
    } catch {
      // Non-blocking — still show the success state so the user exits the
      // cancel flow. Admin will see the save offer record regardless.
    }

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
          {userEmail && (
            <div className="rounded-xl bg-navy-50/50 px-4 py-2.5">
              <p className="text-xs text-graphite-400">Email address</p>
              <p className="text-sm font-medium text-navy">{userEmail}</p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="block text-xs font-semibold text-navy mb-1">First Name</label><Input value={profileForm.firstName} onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} placeholder={profileLoaded ? "Jordan" : "Loading…"} disabled={!profileLoaded} /></div>
            <div><label className="block text-xs font-semibold text-navy mb-1">Last Name</label><Input value={profileForm.lastName} onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} placeholder={profileLoaded ? "Miller" : "Loading…"} disabled={!profileLoaded} /></div>
          </div>
          <div><label className="block text-xs font-semibold text-navy mb-1">Phone</label><Input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" type="tel" /></div>
          <Button variant="outline" size="sm" onClick={saveProfile} disabled={!profileLoaded}>
            {profileSaved ? <><Check className="h-3.5 w-3.5 mr-1.5" />Saved!</> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4 text-navy" /> Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {pwStatus === "ok" ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
              <Check className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700">Password updated successfully!</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Current Password</label>
                <div className="relative">
                  <Input type={pwVisible ? "text" : "password"} value={pwForm.current} onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} placeholder="Current password" className="pr-10" />
                  <button type="button" onClick={() => setPwVisible((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-navy">
                    {pwVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">New Password</label>
                  <Input type={pwVisible ? "text" : "password"} value={pwForm.next} onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Confirm New Password</label>
                  <Input type={pwVisible ? "text" : "password"} value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" />
                </div>
              </div>
              {pwError && <p className="text-xs text-red-600">{pwError}</p>}
              <Button variant="outline" size="sm" onClick={changePassword} disabled={pwStatus === "saving"}>
                {pwStatus === "saving" ? "Updating…" : "Update Password"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-gold-600" /> Subscription</CardTitle></CardHeader>
        <CardContent>
          {subscription ? (
            <>
              <div className={cn(
                "flex items-center justify-between rounded-xl p-4 mb-4",
                subscription.cancelAtPeriodEnd ? "bg-amber-50 border border-amber-200" : "bg-teal-50/50"
              )}>
                <div>
                  <p className="text-sm font-bold text-navy">{subscription.planName || "Active Plan"}</p>
                  {subscription.currentPeriodEnd && (
                    <p className="text-xs text-graphite-400">
                      {subscription.cancelAtPeriodEnd ? "Cancels" : "Next billing"}:{" "}
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
                <Badge variant={subscription.status === "ACTIVE" ? "success" : subscription.status === "PAST_DUE" ? "warning" : "secondary"}>
                  {subscription.cancelAtPeriodEnd ? "Canceling" : subscription.status}
                </Badge>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-sm text-amber-800">Your subscription is set to cancel at the end of the billing period. You&apos;ll retain access until then.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-navy-50/40 p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-navy">No active subscription</p>
                <p className="text-xs text-graphite-400">Start a plan to access treatment services</p>
              </div>
              <Badge variant="secondary">Inactive</Badge>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={async () => {
              const res = await fetch("/api/billing/portal", { method: "POST" });
              const d = await res.json();
              if (d.url) window.location.href = d.url;
            }}>Manage Billing</Button>
            <Button variant="outline" size="sm" asChild><a href="/pricing">Change Plan</a></Button>

            {/* Tier 8.3 — one-click pause for active subscriptions.
                Pauses billing for 1 month via Stripe's pause_collection.
                Keeps the subscription alive so the user can resume. */}
            {subscription?.status === "ACTIVE" && !subscription.cancelAtPeriodEnd && (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={async () => {
                  track(ANALYTICS_EVENTS.SAVE_OFFER_ACCEPT, {
                    offer_type: "pause",
                    reason: "one_click_pause",
                    location: "settings_top",
                  });
                  try {
                    const res = await fetch("/api/subscription/pause", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ months: 1 }),
                    });
                    if (res.ok) {
                      // Reflect the paused state locally without a full reload
                      setSubscription((s) => (s ? { ...s, status: "PAUSED" } : s));
                    }
                  } catch {
                    // non-blocking
                  }
                }}
              >
                Pause 1 month
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-navy" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              { key: "email" as const, label: "Email notifications", description: "Refill reminders, check-in prompts, and milestone alerts" },
              { key: "sms" as const, label: "SMS notifications", description: "Shipping updates and urgent care messages" },
              { key: "marketing" as const, label: "Marketing emails", description: "Tips, recipes, and program updates. Unsubscribe anytime." },
            ] as const
          ).map((n) => (
            <label key={n.key} className="flex items-start justify-between rounded-xl border border-navy-100/40 p-4 cursor-pointer hover:bg-navy-50/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-navy">{n.label}</p>
                <p className="text-xs text-graphite-400">{n.description}</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs[n.key]}
                onChange={(e) => setNotifPrefs((p) => ({ ...p, [n.key]: e.target.checked }))}
                className="mt-1 h-4 w-4 rounded border-navy-300 text-teal focus:ring-teal"
              />
            </label>
          ))}
          <p className="text-xs text-graphite-400 pt-1">
            Clinical notifications (dose reminders, provider messages) cannot be disabled for patient safety.
          </p>
        </CardContent>
      </Card>

      {/* Connected Devices / Wearables */}
      <WearablesSection />

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
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Make money with Nature's Journey</span>
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
                    <p className="text-xs text-graphite-400">Keep your treatment at a lower price point. $179/mo instead of $379/mo.</p>
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
