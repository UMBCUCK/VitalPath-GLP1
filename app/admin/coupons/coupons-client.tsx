"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, ToggleLeft, ToggleRight, Copy, Check, Trash2, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: string;
  valueCents: number | null;
  valuePct: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | string | null;
  isActive: boolean;
  firstMonthOnly: boolean;
}

export function CouponsClient({ coupons: initial }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initial);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Create form state
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState("PERCENTAGE");
  const [newValue, setNewValue] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [newFirstMonthOnly, setNewFirstMonthOnly] = useState(false);

  function copyCode(code: string, id: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function toggleActive(id: string) {
    const coupon = coupons.find((c) => c.id === id);
    if (!coupon || togglingId) return;

    setTogglingId(id);
    // Optimistic update
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !coupon.isActive }),
      });
      if (!res.ok) {
        // Revert on failure
        setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: coupon.isActive } : c));
      }
    } catch {
      setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: coupon.isActive } : c));
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteCoupon(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete coupon.");
      }
    } catch {
      alert("Failed to delete coupon.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");

    if (!newCode.trim()) { setCreateError("Code is required."); return; }
    if ((newType === "PERCENTAGE" || newType === "FIXED_AMOUNT") && !newValue) {
      setCreateError("Value is required for this discount type."); return;
    }

    setCreating(true);
    try {
      const payload: Record<string, unknown> = {
        code: newCode.trim().toUpperCase(),
        type: newType,
        firstMonthOnly: newFirstMonthOnly,
        maxUses: newMaxUses || null,
        expiresAt: newExpiry || null,
      };

      if (newType === "PERCENTAGE") payload.valuePct = Number(newValue);
      if (newType === "FIXED_AMOUNT") payload.valueCents = Math.round(Number(newValue) * 100);

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || "Failed to create coupon.");
        return;
      }

      setCoupons((prev) => [data.coupon, ...prev]);
      setShowCreate(false);
      setNewCode(""); setNewType("PERCENTAGE"); setNewValue("");
      setNewMaxUses(""); setNewExpiry(""); setNewFirstMonthOnly(false);
      router.refresh();
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function discountDisplay(c: Coupon) {
    if (c.type === "PERCENTAGE") return `${c.valuePct}% off`;
    if (c.type === "FIXED_AMOUNT") return `${formatPrice(c.valueCents || 0)} off`;
    if (c.type === "FREE_MONTH") return "Free month";
    if (c.type === "FREE_ADDON") return "Free add-on";
    return c.type;
  }

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((s, c) => s + c.usedCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Coupons & Promos</h2>
          <p className="text-sm text-graphite-400">Manage discount codes and promotional offers</p>
        </div>
        <Button className="gap-2" onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}>
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Coupons</p><p className="text-2xl font-bold text-navy">{coupons.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Active</p><p className="text-2xl font-bold text-teal">{activeCount}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Uses</p><p className="text-2xl font-bold text-navy">{totalUses}</p></CardContent></Card>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="border-teal/30 bg-teal-50/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-navy mb-4">Create New Coupon</h3>
            <form onSubmit={handleCreate}>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Code *</label>
                  <Input
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="WELCOME20"
                    disabled={creating}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="calculator-input text-sm"
                    disabled={creating}
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                    <option value="FREE_MONTH">Free Month</option>
                    <option value="FREE_ADDON">Free Add-On</option>
                  </select>
                </div>
                {(newType === "PERCENTAGE" || newType === "FIXED_AMOUNT") && (
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Value {newType === "PERCENTAGE" ? "(%)" : "($)"} *
                    </label>
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder={newType === "PERCENTAGE" ? "20" : "50.00"}
                      type="number"
                      min="0"
                      disabled={creating}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Max Uses</label>
                  <Input
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(e.target.value)}
                    placeholder="Unlimited"
                    type="number"
                    min="1"
                    disabled={creating}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Expires</label>
                  <Input
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    type="date"
                    disabled={creating}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFirstMonthOnly}
                      onChange={(e) => setNewFirstMonthOnly(e.target.checked)}
                      disabled={creating}
                      className="h-4 w-4 rounded border-navy-200 accent-teal"
                    />
                    <span className="text-xs font-medium text-navy">First month only</span>
                  </label>
                </div>
              </div>
              {createError && (
                <p className="mt-3 text-xs text-red-500">{createError}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button type="submit" size="sm" disabled={creating}>
                  {creating ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Creating…</> : "Create Coupon"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowCreate(false); setCreateError(""); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-graphite-400">
              <Tag className="mb-3 h-8 w-8 opacity-30" />
              <p className="text-sm">No coupons yet</p>
              <p className="text-xs">Create your first coupon to start offering discounts</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-6 py-3 text-left font-medium text-graphite-400">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Discount</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Usage</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Restrictions</th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gold-600 flex-shrink-0" />
                        <span className="font-mono font-bold text-navy">{coupon.code}</span>
                        <button
                          onClick={() => copyCode(coupon.code, coupon.id)}
                          className="text-graphite-300 hover:text-navy transition-colors"
                          title="Copy code"
                        >
                          {copiedId === coupon.id
                            ? <Check className="h-3.5 w-3.5 text-teal" />
                            : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy">{discountDisplay(coupon)}</td>
                    <td className="px-4 py-3 text-graphite-500">
                      {coupon.usedCount}
                      {coupon.maxUses ? (
                        <span className="text-graphite-300"> / {coupon.maxUses}</span>
                      ) : null}
                      {coupon.maxUses && coupon.usedCount >= coupon.maxUses && (
                        <Badge variant="destructive" className="ml-2 text-[9px]">Exhausted</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {coupon.firstMonthOnly && (
                          <Badge variant="secondary" className="text-[9px]">1st month</Badge>
                        )}
                        {coupon.expiresAt && (
                          <Badge
                            variant={new Date(coupon.expiresAt) < new Date() ? "destructive" : "secondary"}
                            className="text-[9px]"
                          >
                            {new Date(coupon.expiresAt) < new Date() ? "Expired" : `Expires ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                          </Badge>
                        )}
                        {!coupon.firstMonthOnly && !coupon.expiresAt && (
                          <span className="text-graphite-300 text-xs">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(coupon.id)}
                        disabled={togglingId === coupon.id}
                        className="inline-flex items-center"
                        title={coupon.isActive ? "Click to disable" : "Click to enable"}
                      >
                        {togglingId === coupon.id
                          ? <Loader2 className="h-5 w-5 animate-spin text-graphite-300" />
                          : coupon.isActive
                          ? <ToggleRight className="h-5 w-5 text-teal" />
                          : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant={coupon.isActive ? "success" : "secondary"} className="text-[10px]">
                          {coupon.isActive ? "Active" : "Disabled"}
                        </Badge>
                        <button
                          onClick={() => deleteCoupon(coupon.id, coupon.code)}
                          disabled={deletingId === coupon.id}
                          className="text-graphite-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete coupon"
                        >
                          {deletingId === coupon.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
