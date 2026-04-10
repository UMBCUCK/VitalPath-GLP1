"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit2, Check, X, Package, DollarSign, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, ExternalLink, AlertCircle,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  category: string;
  priceMonthly: number;
  priceQuarterly: number | null;
  priceAnnual: number | null;
  isActive: boolean;
  isAddon: boolean;
  badge: string | null;
  stripeProductId: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdQuarterly: string | null;
  stripePriceIdAnnual: string | null;
  features: unknown;
  sortOrder: number;
}

type EditForm = Partial<ProductItem>;

export function ProductsClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({});
  const [saving, setSaving] = useState(false);

  function startEdit(product: ProductItem) {
    setEditingId(product.id);
    setExpandedId(product.id);
    setEditForm({ ...product });
  }

  async function saveEdit() {
    if (!editingId || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: editForm.name,
          description: editForm.description,
          priceMonthly: editForm.priceMonthly,
          priceQuarterly: editForm.priceQuarterly || null,
          priceAnnual: editForm.priceAnnual || null,
          badge: editForm.badge || null,
          stripeProductId: editForm.stripeProductId || null,
          stripePriceIdMonthly: editForm.stripePriceIdMonthly || null,
          stripePriceIdQuarterly: editForm.stripePriceIdQuarterly || null,
          stripePriceIdAnnual: editForm.stripePriceIdAnnual || null,
        }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...editForm } as ProductItem : p));
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
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
  const totalMRR = products
    .filter((p) => p.isActive && p.type === "MEMBERSHIP")
    .reduce((sum, p) => sum + p.priceMonthly, 0);

  function PriceInput({ label, value, onChange, placeholder }: { label: string; value: number | null | undefined; onChange: (v: number | null) => void; placeholder?: string }) {
    return (
      <div>
        <label className="block text-[10px] font-semibold text-graphite-400 mb-1">{label}</label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-graphite-400">$</span>
          <Input
            type="number"
            step="0.01"
            value={value ? String(value / 100) : ""}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v ? Math.round(parseFloat(v) * 100) : null);
            }}
            placeholder={placeholder || "0.00"}
            className="h-8 text-xs pl-6 w-28"
          />
        </div>
      </div>
    );
  }

  function StripeIdInput({ label, value, onChange }: { label: string; value: string | null | undefined; onChange: (v: string) => void }) {
    return (
      <div>
        <label className="block text-[10px] font-semibold text-graphite-400 mb-1">{label}</label>
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="price_xxxx or prod_xxxx"
          className="h-8 text-xs font-mono w-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Products & Pricing</h2>
          <p className="text-sm text-graphite-400">Manage plans, add-ons, and Stripe integration</p>
        </div>
        <a
          href="https://dashboard.stripe.com/products"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-graphite-500 hover:bg-navy-50 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Stripe Dashboard
        </a>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Products</p><p className="text-2xl font-bold text-navy">{products.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Active</p><p className="text-2xl font-bold text-teal">{products.filter((p) => p.isActive).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Plans</p><p className="text-2xl font-bold text-navy">{memberships.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Starting From</p><p className="text-2xl font-bold text-teal">{memberships.length > 0 ? formatPrice(Math.min(...memberships.map(m => m.priceMonthly))) : "$0"}/mo</p></CardContent></Card>
      </div>

      {/* Membership Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-teal" /> Membership Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {memberships.map((p) => (
            <div key={p.id} className={cn(
              "rounded-xl border transition-all",
              editingId === p.id ? "border-teal ring-1 ring-teal/20" : "border-navy-100/60",
              !p.isActive && "opacity-50"
            )}>
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                    {expandedId === p.id ? <ChevronUp className="h-4 w-4 text-graphite-400" /> : <ChevronDown className="h-4 w-4 text-graphite-400" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy">{p.name}</span>
                      {p.badge && <Badge variant="gold" className="text-[10px]">{p.badge}</Badge>}
                    </div>
                    <span className="text-xs text-graphite-400">{p.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Pricing summary */}
                  <div className="text-right">
                    <span className="text-lg font-bold text-navy">{formatPrice(p.priceMonthly)}</span>
                    <span className="text-xs text-graphite-400">/mo</span>
                    {p.priceAnnual && (
                      <span className="ml-2 text-xs text-teal">
                        ({formatPrice(Math.round(p.priceAnnual / 12))}/mo annual)
                      </span>
                    )}
                  </div>

                  {/* Stripe status */}
                  {p.stripePriceIdMonthly ? (
                    <Badge variant="success" className="text-[10px]">Stripe linked</Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px] gap-1">
                      <AlertCircle className="h-3 w-3" /> No Stripe ID
                    </Badge>
                  )}

                  {/* Actions */}
                  <button onClick={() => toggleActive(p.id)}>
                    {p.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                  </button>
                  {editingId !== p.id && (
                    <button onClick={() => startEdit(p)} className="p-1.5 text-graphite-400 hover:bg-navy-50 rounded-lg">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail / edit form */}
              {expandedId === p.id && (
                <div className="border-t border-navy-100/40 px-4 py-4 bg-navy-50/20">
                  {editingId === p.id ? (
                    <div className="space-y-4">
                      {/* Basic info */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-graphite-400 mb-1">Name</label>
                          <Input value={editForm.name || ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="h-8 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-graphite-400 mb-1">Badge</label>
                          <Input value={editForm.badge || ""} onChange={(e) => setEditForm((f) => ({ ...f, badge: e.target.value }))} placeholder="Most Popular" className="h-8 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-graphite-400 mb-1">Description</label>
                          <Input value={editForm.description || ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className="h-8 text-xs" />
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <p className="text-xs font-semibold text-navy mb-2">Pricing (in dollars — stored as cents)</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <PriceInput label="Monthly" value={editForm.priceMonthly} onChange={(v) => setEditForm((f) => ({ ...f, priceMonthly: v || 0 }))} />
                          <PriceInput label="Quarterly (optional)" value={editForm.priceQuarterly} onChange={(v) => setEditForm((f) => ({ ...f, priceQuarterly: v }))} />
                          <PriceInput label="Annual (optional)" value={editForm.priceAnnual} onChange={(v) => setEditForm((f) => ({ ...f, priceAnnual: v }))} />
                        </div>
                      </div>

                      {/* Stripe IDs */}
                      <div>
                        <p className="text-xs font-semibold text-navy mb-2">Stripe Integration</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <StripeIdInput label="Stripe Product ID" value={editForm.stripeProductId} onChange={(v) => setEditForm((f) => ({ ...f, stripeProductId: v }))} />
                          <StripeIdInput label="Monthly Price ID" value={editForm.stripePriceIdMonthly} onChange={(v) => setEditForm((f) => ({ ...f, stripePriceIdMonthly: v }))} />
                          <StripeIdInput label="Quarterly Price ID" value={editForm.stripePriceIdQuarterly} onChange={(v) => setEditForm((f) => ({ ...f, stripePriceIdQuarterly: v }))} />
                          <StripeIdInput label="Annual Price ID" value={editForm.stripePriceIdAnnual} onChange={(v) => setEditForm((f) => ({ ...f, stripePriceIdAnnual: v }))} />
                        </div>
                      </div>

                      {/* Save/Cancel */}
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button size="sm" onClick={saveEdit} disabled={saving} className="gap-1.5">
                          {saving ? "Saving..." : <><Check className="h-3.5 w-3.5" /> Save Changes</>}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-graphite-400">Monthly: <span className="font-semibold text-navy">{formatPrice(p.priceMonthly)}</span></p>
                        <p className="text-xs text-graphite-400">Quarterly: <span className="font-semibold text-navy">{p.priceQuarterly ? formatPrice(p.priceQuarterly) : "—"}</span></p>
                        <p className="text-xs text-graphite-400">Annual: <span className="font-semibold text-navy">{p.priceAnnual ? formatPrice(p.priceAnnual) : "—"}</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-graphite-400">Product: <span className="font-mono text-[10px]">{p.stripeProductId || "—"}</span></p>
                        <p className="text-xs text-graphite-400">Monthly: <span className="font-mono text-[10px]">{p.stripePriceIdMonthly || "—"}</span></p>
                        <p className="text-xs text-graphite-400">Quarterly: <span className="font-mono text-[10px]">{p.stripePriceIdQuarterly || "—"}</span></p>
                        <p className="text-xs text-graphite-400">Annual: <span className="font-mono text-[10px]">{p.stripePriceIdAnnual || "—"}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add-Ons */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-gold-600" /> Add-Ons & Supplements</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addons.map((p) => (
              <div key={p.id} className={cn(
                "flex items-start justify-between rounded-xl border p-4",
                p.isActive ? "border-navy-100/60 bg-white" : "border-navy-100/30 bg-navy-50/30 opacity-60"
              )}>
                <div>
                  <p className="text-sm font-semibold text-navy">{p.name}</p>
                  <p className="text-xs text-graphite-400">{p.category.replace(/_/g, " ")}</p>
                  <p className="mt-1 text-sm font-bold text-teal">{formatPrice(p.priceMonthly)}/mo</p>
                  {p.stripePriceIdMonthly ? (
                    <p className="mt-1 text-[10px] text-emerald-500">Stripe linked</p>
                  ) : (
                    <p className="mt-1 text-[10px] text-amber-500">No Stripe ID</p>
                  )}
                </div>
                <button onClick={() => toggleActive(p.id)}>
                  {p.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup instructions */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-navy mb-2">How to connect Stripe</h3>
          <ol className="space-y-1.5 text-xs text-graphite-500 list-decimal list-inside">
            <li>Create products in <a href="https://dashboard.stripe.com/products" target="_blank" className="text-teal underline">Stripe Dashboard</a></li>
            <li>Copy the Product ID (prod_xxx) and Price IDs (price_xxx)</li>
            <li>Click Edit on each plan above and paste the IDs</li>
            <li>Set up the webhook endpoint in Stripe: <code className="bg-white px-1 py-0.5 rounded text-navy text-[10px]">{typeof window !== "undefined" ? window.location.origin : ""}/api/stripe/webhook</code></li>
            <li>Subscribe to: <code className="bg-white px-1 py-0.5 rounded text-[10px]">checkout.session.completed, customer.subscription.*, invoice.*</code></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
