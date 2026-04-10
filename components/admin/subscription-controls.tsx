"use client";

import { useState, useCallback } from "react";
import {
  Lock,
  Unlock,
  DollarSign,
  Link2,
  Link2Off,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SubscriptionData {
  id: string;
  status: string;
  adminLocked: boolean;
  adminNotes: string | null;
  commissionDisabled: boolean;
  referredByReseller: string | null;
  resellerName?: string | null;
  interval: string;
  items: { product: { name: string } | null; priceInCents: number }[];
}

interface SubscriptionControlsProps {
  subscription: SubscriptionData;
}

type ActionResult = { success: boolean; error?: string };

export function SubscriptionControls({ subscription: initialSub }: SubscriptionControlsProps) {
  const [sub, setSub] = useState(initialSub);
  const [notes, setNotes] = useState(sub.adminNotes || "");
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [statusDrop, setStatusDrop] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const callApi = useCallback(
    async (action: string, value?: string): Promise<ActionResult> => {
      setLoading(action);
      try {
        const res = await fetch("/api/admin/subscriptions/control", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId: sub.id, action, value }),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast("error", data.error || "Failed to update");
          return { success: false, error: data.error };
        }
        // Update local state
        if (data.subscription) {
          setSub((prev) => ({ ...prev, ...data.subscription }));
        }
        showToast("success", `Subscription ${action.replace(/_/g, " ")} successful`);
        return { success: true };
      } catch {
        showToast("error", "Network error");
        return { success: false, error: "Network error" };
      } finally {
        setLoading(null);
        setConfirmAction(null);
      }
    },
    [sub.id, showToast]
  );

  const handleToggleLock = () => callApi(sub.adminLocked ? "unlock" : "lock");
  const handleToggleCommission = () =>
    callApi(sub.commissionDisabled ? "enable_commission" : "disable_commission");
  const handleSaveNotes = () => callApi("set_notes", notes);
  const handleUnlinkReseller = () => callApi("unlink_reseller");

  const handleChangeStatus = (newStatus: string) => {
    if (newStatus === "CANCELED") {
      setConfirmAction(`change_status:${newStatus}`);
    } else {
      callApi("change_status", newStatus);
    }
    setStatusDrop(false);
  };

  const planName = sub.items[0]?.product?.name || "Unknown Plan";

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-800",
    PAUSED: "bg-amber-100 text-amber-800",
    CANCELED: "bg-red-100 text-red-800",
    PAST_DUE: "bg-orange-100 text-orange-800",
    TRIALING: "bg-blue-100 text-blue-800",
    EXPIRED: "bg-gray-100 text-gray-800",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Lock className="h-4 w-4 text-teal" /> Subscription Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Toast notification */}
        {toast && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium animate-in fade-in slide-in-from-top-1",
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {toast.message}
          </div>
        )}

        {/* Status + Plan info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-graphite-400">Current Plan</p>
            <p className="text-sm font-semibold text-navy">{planName}</p>
            <p className="text-xs text-graphite-400 mt-0.5">{sub.interval}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setStatusDrop(!statusDrop)}
              disabled={loading === "change_status"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                statusColors[sub.status] || "bg-gray-100 text-gray-800"
              )}
            >
              {loading === "change_status" && <Loader2 className="h-3 w-3 animate-spin" />}
              {sub.status}
            </button>
            {statusDrop && (
              <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-xl border border-navy-100/60 bg-white py-1 shadow-premium">
                {["ACTIVE", "PAUSED", "CANCELED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleChangeStatus(s)}
                    disabled={s === sub.status}
                    className={cn(
                      "block w-full px-3 py-2 text-left text-xs hover:bg-navy-50 transition-colors",
                      s === sub.status ? "text-graphite-300" : "text-navy"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation dialog for destructive actions */}
        {confirmAction && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-semibold text-red-800">Confirm Action</p>
            </div>
            <p className="text-xs text-red-700 mb-3">
              This will cancel the subscription. This action may affect billing and customer access.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const [action, value] = confirmAction.split(":");
                  callApi(action, value);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm Cancel"}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs text-navy hover:bg-navy-50 transition-colors"
              >
                Nevermind
              </button>
            </div>
          </div>
        )}

        {/* Toggle Controls */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Lock Toggle */}
          <button
            onClick={handleToggleLock}
            disabled={loading === "lock" || loading === "unlock"}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-sm",
              sub.adminLocked
                ? "border-amber-200 bg-amber-50"
                : "border-navy-100/60 bg-white hover:bg-navy-50/30"
            )}
          >
            {loading === "lock" || loading === "unlock" ? (
              <Loader2 className="h-5 w-5 animate-spin text-graphite-400" />
            ) : sub.adminLocked ? (
              <Lock className="h-5 w-5 text-amber-600" />
            ) : (
              <Unlock className="h-5 w-5 text-graphite-400" />
            )}
            <div className="text-left">
              <p className="text-xs font-semibold text-navy">
                {sub.adminLocked ? "Locked" : "Unlocked"}
              </p>
              <p className="text-[10px] text-graphite-400">
                {sub.adminLocked
                  ? "Customer cannot make changes"
                  : "Customer can self-service"}
              </p>
            </div>
          </button>

          {/* Commission Toggle */}
          <button
            onClick={handleToggleCommission}
            disabled={loading === "disable_commission" || loading === "enable_commission"}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-sm",
              sub.commissionDisabled
                ? "border-red-200 bg-red-50"
                : "border-navy-100/60 bg-white hover:bg-navy-50/30"
            )}
          >
            {loading === "disable_commission" || loading === "enable_commission" ? (
              <Loader2 className="h-5 w-5 animate-spin text-graphite-400" />
            ) : (
              <DollarSign
                className={cn(
                  "h-5 w-5",
                  sub.commissionDisabled ? "text-red-500" : "text-emerald-500"
                )}
              />
            )}
            <div className="text-left">
              <p className="text-xs font-semibold text-navy">
                Commission {sub.commissionDisabled ? "Disabled" : "Enabled"}
              </p>
              <p className="text-[10px] text-graphite-400">
                {sub.commissionDisabled
                  ? "No payouts for this subscription"
                  : "Reseller receives payouts"}
              </p>
            </div>
          </button>
        </div>

        {/* Linked Reseller */}
        <div className="rounded-xl border border-navy-100/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-graphite-400" />
              <div>
                <p className="text-xs font-semibold text-navy">Linked Reseller</p>
                <p className="text-[10px] text-graphite-400">
                  {sub.referredByReseller
                    ? sub.resellerName || sub.referredByReseller
                    : "No reseller linked"}
                </p>
              </div>
            </div>
            {sub.referredByReseller && (
              <button
                onClick={handleUnlinkReseller}
                disabled={loading === "unlink_reseller"}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                {loading === "unlink_reseller" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Link2Off className="h-3 w-3" />
                )}
                Unlink
              </button>
            )}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy">Admin Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add internal notes about this subscription..."
            className="w-full rounded-xl border border-navy-200 px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20 resize-none"
          />
          <button
            onClick={handleSaveNotes}
            disabled={loading === "set_notes" || notes === (sub.adminNotes || "")}
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              notes !== (sub.adminNotes || "")
                ? "bg-teal text-white hover:bg-teal-600"
                : "bg-navy-50 text-graphite-300 cursor-not-allowed"
            )}
          >
            {loading === "set_notes" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            Save Notes
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
