"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, Package, DollarSign, ToggleLeft, ToggleRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  priceMonthly: number;
  isActive: boolean;
  isAddon: boolean;
  badge: string | null;
  stripePriceIdMonthly: string | null;
  features: unknown;
  sortOrder: number;
}

export function ProductsClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductItem>>({});

  function startEdit(product: ProductItem) {
    setEditingId(product.id);
    setEditForm({ ...product });
  }

  async function saveEdit() {
    if (!editingId) return;
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, name: editForm.name, priceMonthly: editForm.priceMonthly, badge: editForm.badge, stripePriceIdMonthly: editForm.stripePriceIdMonthly }),
    });
    setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...editForm } as ProductItem : p));
    setEditingId(null);
  }

  async function toggleActive(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !product.isActive }),
    });
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  }

  const memberships = products.filter((p) => p.type === "MEMBERSHIP");
  const addons = products.filter((p) => p.type !== "MEMBERSHIP");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Products & Plans</h2>
        <p className="text-sm text-graphite-400">Manage subscription plans, add-ons, and bundles (real database)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total</p><p className="text-2xl font-bold text-navy">{products.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Active</p><p className="text-2xl font-bold text-teal">{products.filter((p) => p.isActive).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Plans</p><p className="text-2xl font-bold text-navy">{memberships.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Add-Ons</p><p className="text-2xl font-bold text-navy">{addons.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-teal" /> Membership Plans</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 bg-navy-50/30"><th className="px-4 py-3 text-left font-medium text-graphite-400">Name</th><th className="px-4 py-3 text-left font-medium text-graphite-400">Price</th><th className="px-4 py-3 text-left font-medium text-graphite-400">Badge</th><th className="px-4 py-3 text-left font-medium text-graphite-400">Stripe Price</th><th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th><th className="px-4 py-3 text-right font-medium text-graphite-400">Edit</th></tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {memberships.map((p) => (
                <tr key={p.id} className="hover:bg-navy-50/20">
                  {editingId === p.id ? (
                    <>
                      <td className="px-4 py-3"><Input value={editForm.name || ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="h-8 text-xs" /></td>
                      <td className="px-4 py-3"><Input type="number" value={String((editForm.priceMonthly || 0) / 100)} onChange={(e) => setEditForm((f) => ({ ...f, priceMonthly: Math.round(parseFloat(e.target.value) * 100) }))} className="h-8 text-xs w-24" /></td>
                      <td className="px-4 py-3"><Input value={editForm.badge || ""} onChange={(e) => setEditForm((f) => ({ ...f, badge: e.target.value }))} className="h-8 text-xs" /></td>
                      <td className="px-4 py-3 font-mono text-[10px] text-graphite-400">{p.stripePriceIdMonthly}</td>
                      <td className="px-4 py-3"><Badge variant="success">Active</Badge></td>
                      <td className="px-4 py-3 text-right flex gap-1 justify-end"><button onClick={saveEdit} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg"><Check className="h-4 w-4" /></button><button onClick={() => setEditingId(null)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><X className="h-4 w-4" /></button></td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-navy">{p.name}</td>
                      <td className="px-4 py-3 font-semibold text-navy">{formatPrice(p.priceMonthly)}/mo</td>
                      <td className="px-4 py-3">{p.badge ? <Badge variant="gold">{p.badge}</Badge> : "—"}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-graphite-400">{p.stripePriceIdMonthly || "—"}</td>
                      <td className="px-4 py-3"><button onClick={() => toggleActive(p.id)}>{p.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}</button></td>
                      <td className="px-4 py-3 text-right"><button onClick={() => startEdit(p)} className="p-1.5 text-graphite-400 hover:bg-navy-50 rounded-lg"><Edit2 className="h-4 w-4" /></button></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-gold-600" /> Add-Ons</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addons.map((p) => (
              <div key={p.id} className={`flex items-start justify-between rounded-xl border p-4 ${p.isActive ? "border-navy-100/60 bg-white" : "border-navy-100/30 bg-navy-50/30 opacity-60"}`}>
                <div>
                  <p className="text-sm font-semibold text-navy">{p.name}</p>
                  <p className="text-xs text-graphite-400">{p.category.replace("_", " ")}</p>
                  <p className="mt-1 text-sm font-bold text-teal">{formatPrice(p.priceMonthly)}/mo</p>
                </div>
                <button onClick={() => toggleActive(p.id)}>
                  {p.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
