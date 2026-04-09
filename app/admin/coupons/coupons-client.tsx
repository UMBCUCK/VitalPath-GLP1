"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, ToggleLeft, ToggleRight, Copy, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: string;
  valueCents: number | null;
  valuePct: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
  firstMonthOnly: boolean;
}

export function CouponsClient({ coupons: initial }: { coupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initial);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState("PERCENTAGE");
  const [newValue, setNewValue] = useState("");

  function copyCode(code: string, id: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function toggleActive(id: string) {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  }

  function discountDisplay(c: Coupon) {
    if (c.type === "PERCENTAGE") return `${c.valuePct}% off`;
    if (c.type === "FIXED_AMOUNT") return `${formatPrice(c.valueCents || 0)} off`;
    if (c.type === "FREE_MONTH") return "Free month";
    if (c.type === "FREE_ADDON") return "Free add-on";
    return c.type;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Coupons & Promos</h2>
          <p className="text-sm text-graphite-400">Manage discount codes and promotional offers</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Coupons</p><p className="text-2xl font-bold text-navy">{coupons.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Active</p><p className="text-2xl font-bold text-teal">{coupons.filter((c) => c.isActive).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Uses</p><p className="text-2xl font-bold text-navy">{coupons.reduce((s, c) => s + c.usedCount, 0)}</p></CardContent></Card>
      </div>

      {showCreate && (
        <Card className="border-teal/30 bg-teal-50/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-navy mb-3">Create New Coupon</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="block text-xs font-semibold text-navy mb-1">Code</label><Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="WELCOME20" /></div>
              <div><label className="block text-xs font-semibold text-navy mb-1">Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="calculator-input text-sm">
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                  <option value="FREE_MONTH">Free Month</option>
                  <option value="FREE_ADDON">Free Add-On</option>
                </select>
              </div>
              <div><label className="block text-xs font-semibold text-navy mb-1">Value</label><Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder={newType === "PERCENTAGE" ? "20" : "5000"} /></div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Create</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 bg-navy-50/30">
                <th className="px-6 py-3 text-left font-medium text-graphite-400">Code</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Discount</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Usage</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Restrictions</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
                <th className="px-4 py-3 text-right font-medium text-graphite-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-navy-50/20 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gold-600" />
                      <span className="font-mono font-bold text-navy">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code, coupon.id)} className="text-graphite-300 hover:text-navy">
                        {copiedId === coupon.id ? <Check className="h-3.5 w-3.5 text-teal" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy">{discountDisplay(coupon)}</td>
                  <td className="px-4 py-3 text-graphite-500">
                    {coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {coupon.firstMonthOnly && <Badge variant="secondary" className="text-[9px]">1st month</Badge>}
                      {coupon.expiresAt && <Badge variant="secondary" className="text-[9px]">Expires {new Date(coupon.expiresAt).toLocaleDateString()}</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(coupon.id)}>
                      {coupon.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant={coupon.isActive ? "success" : "secondary"} className="text-[10px]">
                      {coupon.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
