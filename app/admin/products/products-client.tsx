"use client";

import { useState, useCallback } from "react";
import {
  Check, X, Package, DollarSign, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, ExternalLink, AlertCircle, Plus,
  Trash2, Edit2, ArrowRight, Eye, EyeOff, Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureItem {
  id: string;
  text: string;
  bold: boolean;
  size: "sm" | "base";
}

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
  isFeatured?: boolean;
  badge: string | null;
  stripeProductId: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdQuarterly: string | null;
  stripePriceIdAnnual: string | null;
  features: unknown;
  sortOrder: number;
}

interface PlanEditState {
  name: string;
  badge: string;
  description: string;
  priceMonthly: number;
  priceQuarterly: number | null;
  priceAnnual: number | null;
  features: FeatureItem[];
  isFeatured: boolean;
  stripeProductId: string;
  stripePriceIdMonthly: string;
  stripePriceIdQuarterly: string;
  stripePriceIdAnnual: string;
}

// ─── Feature helpers ──────────────────────────────────────────────────────────

let _fid = 0;
function genId() { return `f${++_fid}`; }

function parseFeatures(raw: unknown): FeatureItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") {
      return { id: genId(), text: item, bold: false, size: "base" as const };
    }
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      return {
        id: genId(),
        text: String(o.text ?? ""),
        bold: Boolean(o.bold),
        size: o.size === "sm" ? ("sm" as const) : ("base" as const),
      };
    }
    return { id: genId(), text: String(item ?? ""), bold: false, size: "base" as const };
  });
}

function serializeFeatures(items: FeatureItem[]): unknown[] {
  return items.map((f) => {
    if (!f.bold && f.size === "base") return f.text;
    return { text: f.text, bold: f.bold || undefined, size: f.size !== "base" ? f.size : undefined };
  });
}

function initState(p: ProductItem): PlanEditState {
  return {
    name: p.name,
    badge: p.badge ?? "",
    description: p.description ?? "",
    priceMonthly: p.priceMonthly,
    priceQuarterly: p.priceQuarterly,
    priceAnnual: p.priceAnnual,
    features: parseFeatures(p.features),
    isFeatured: p.isFeatured ?? false,
    stripeProductId: p.stripeProductId ?? "",
    stripePriceIdMonthly: p.stripePriceIdMonthly ?? "",
    stripePriceIdQuarterly: p.stripePriceIdQuarterly ?? "",
    stripePriceIdAnnual: p.stripePriceIdAnnual ?? "",
  };
}

// ─── Shared sub-inputs ────────────────────────────────────────────────────────

function PriceInput({
  label, value, onChange, placeholder,
}: { label: string; value: number | null | undefined; onChange: (v: number | null) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-graphite-400 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-graphite-400">$</span>
        <Input
          type="number"
          step="0.01"
          value={value ? String(value / 100) : ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v ? Math.round(parseFloat(v) * 100) : null);
          }}
          placeholder={placeholder ?? "0.00"}
          className="h-9 text-sm pl-7"
        />
      </div>
    </div>
  );
}

function StripeIdInput({
  label, value, onChange,
}: { label: string; value: string | null | undefined; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-graphite-400 mb-1.5">{label}</label>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="price_xxxx or prod_xxxx"
        className="h-9 text-xs font-mono"
      />
    </div>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({
  item, index, total, onChange, onDelete, onMoveUp, onMoveDown,
}: {
  item: FeatureItem; index: number; total: number;
  onChange: (id: string, changes: Partial<FeatureItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-lg border border-navy-100/60 bg-white px-2.5 py-2 hover:border-teal/40 transition-colors shadow-sm">
      {/* Reorder */}
      <div className="flex flex-col gap-px shrink-0">
        <button
          onClick={() => onMoveUp(item.id)}
          disabled={index === 0}
          className="rounded p-0.5 text-graphite-300 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          onClick={() => onMoveDown(item.id)}
          disabled={index === total - 1}
          className="rounded p-0.5 text-graphite-300 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Check icon preview */}
      <Check className="h-3.5 w-3.5 shrink-0 text-teal/60" />

      {/* Text */}
      <input
        type="text"
        value={item.text}
        onChange={(e) => onChange(item.id, { text: e.target.value })}
        placeholder="Feature description..."
        className={cn(
          "min-w-0 flex-1 bg-transparent text-graphite-700 outline-none placeholder:text-graphite-300",
          item.size === "sm" ? "text-xs" : "text-sm",
          item.bold && "font-semibold"
        )}
      />

      {/* Format controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onChange(item.id, { bold: !item.bold })}
          title="Toggle bold"
          className={cn(
            "h-6 w-6 rounded text-xs font-bold transition-colors select-none",
            item.bold
              ? "bg-navy text-white"
              : "text-graphite-400 hover:bg-navy-50 border border-navy-100/60"
          )}
        >
          B
        </button>
        <button
          onClick={() => onChange(item.id, { size: item.size === "sm" ? "base" : "sm" })}
          title={item.size === "sm" ? "Switch to normal size" : "Switch to small size"}
          className={cn(
            "h-6 w-7 rounded transition-colors flex items-center justify-center select-none",
            item.size === "sm"
              ? "bg-navy-100 text-navy border border-navy-200"
              : "text-graphite-400 hover:bg-navy-50 border border-navy-100/60"
          )}
        >
          <span className={cn("font-bold leading-none", item.size === "sm" ? "text-[9px]" : "text-[11px]")}>Aa</span>
        </button>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="shrink-0 rounded p-1 text-graphite-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
        title="Remove feature"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Live pricing card preview ────────────────────────────────────────────────

function PricingCardPreview({ state }: { state: PlanEditState }) {
  const dailyCost = (state.priceMonthly / 100 / 30).toFixed(2);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white shadow-lg transition-all duration-200",
        state.isFeatured
          ? "border-teal ring-2 ring-teal/25 shadow-[0_0_30px_rgba(15,154,153,0.12)]"
          : "border-navy-100/70"
      )}
    >
      {/* Badge */}
      {state.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <span className="inline-flex items-center rounded-full border border-gold-300 bg-gradient-to-r from-gold-100 to-gold-200 px-3 py-0.5 text-xs font-semibold text-gold-800 shadow-sm">
            {state.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className={cn("px-6 pb-4", state.badge ? "pt-9" : "pt-6")}>
        <h3 className="text-xl font-bold text-navy leading-tight">
          {state.name || <span className="text-graphite-300 italic font-normal">Plan Name</span>}
        </h3>
        <p className="mt-1.5 text-sm text-graphite-400 leading-relaxed">
          {state.description || <span className="italic">Plan description...</span>}
        </p>
        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-navy tracking-tight">
              {formatPrice(state.priceMonthly)}
            </span>
            <span className="text-sm text-graphite-400">/month</span>
          </div>
          <span className="text-sm text-graphite-400">Just ${dailyCost}/day</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 pb-4">
        <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50/60 px-3 py-2">
          <p className="text-xs font-semibold text-teal-700">
            Includes provider evaluation + GLP-1 medication (if prescribed) + ongoing support
          </p>
        </div>
        <ul className="space-y-3">
          {state.features.length === 0 ? (
            <li className="text-sm italic text-graphite-300">Add features to see them here...</li>
          ) : (
            state.features.map((f) => (
              <li key={f.id} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <span
                  className={cn(
                    "text-graphite-600 leading-snug",
                    f.size === "sm" ? "text-xs" : "text-sm",
                    f.bold && "font-semibold"
                  )}
                >
                  {f.text || <span className="italic text-graphite-300">Feature text...</span>}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2 space-y-3">
        <button
          className={cn(
            "w-full rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2",
            state.isFeatured
              ? "bg-navy text-white hover:bg-navy/90"
              : "border border-navy/30 text-navy hover:bg-navy-50"
          )}
        >
          {state.isFeatured ? "See If I Qualify" : "Get Started"}
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-xs text-center text-graphite-400">
          Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}

// ─── Split-pane plan editor ───────────────────────────────────────────────────

function PlanEditorPane({
  product, onCancel, onSaved,
}: {
  product: ProductItem;
  onCancel: () => void;
  onSaved: (updated: ProductItem) => void;
}) {
  const [state, setState] = useState<PlanEditState>(() => initState(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const updateFeature = useCallback((id: string, changes: Partial<FeatureItem>) => {
    setState((s) => ({
      ...s,
      features: s.features.map((f) => (f.id === id ? { ...f, ...changes } : f)),
    }));
  }, []);

  const deleteFeature = useCallback((id: string) => {
    setState((s) => ({ ...s, features: s.features.filter((f) => f.id !== id) }));
  }, []);

  const moveFeature = useCallback((id: string, dir: -1 | 1) => {
    setState((s) => {
      const idx = s.features.findIndex((f) => f.id === id);
      if (idx < 0) return s;
      const next = idx + dir;
      if (next < 0 || next >= s.features.length) return s;
      const arr = [...s.features];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return { ...s, features: arr };
    });
  }, []);

  function addFeature() {
    setState((s) => ({
      ...s,
      features: [...s.features, { id: genId(), text: "", bold: false, size: "base" }],
    }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: state.name,
          description: state.description || null,
          badge: state.badge || null,
          priceMonthly: state.priceMonthly,
          priceQuarterly: state.priceQuarterly,
          priceAnnual: state.priceAnnual,
          features: serializeFeatures(state.features),
          isFeatured: state.isFeatured,
          stripeProductId: state.stripeProductId || null,
          stripePriceIdMonthly: state.stripePriceIdMonthly || null,
          stripePriceIdQuarterly: state.stripePriceIdQuarterly || null,
          stripePriceIdAnnual: state.stripePriceIdAnnual || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to save");
        return;
      }
      onSaved({
        ...product,
        name: state.name,
        description: state.description || null,
        badge: state.badge || null,
        priceMonthly: state.priceMonthly,
        priceQuarterly: state.priceQuarterly,
        priceAnnual: state.priceAnnual,
        features: serializeFeatures(state.features),
        isFeatured: state.isFeatured,
        stripeProductId: state.stripeProductId || null,
        stripePriceIdMonthly: state.stripePriceIdMonthly || null,
        stripePriceIdQuarterly: state.stripePriceIdQuarterly || null,
        stripePriceIdAnnual: state.stripePriceIdAnnual || null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-t border-navy-100/40 bg-white">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between border-b border-navy-100/40 bg-navy-50/50 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-xs font-semibold text-navy">Editing: {product.name}</span>
          <span className="text-[10px] text-graphite-300">• changes update preview instantly</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-graphite-500 hover:bg-navy-100/50 hover:text-navy transition-colors"
          >
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 text-xs px-2.5">
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={save} disabled={saving} className="h-7 text-xs gap-1.5 px-3">
            {saving ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving...
              </span>
            ) : (
              <><Check className="h-3.5 w-3.5" /> Save Changes</>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Split pane */}
      <div className={cn("grid", showPreview ? "lg:grid-cols-[1fr_360px]" : "grid-cols-1")}>
        {/* ── Left: Form ── */}
        <div className="overflow-y-auto p-5" style={{ maxHeight: "76vh" }}>
          <div className="space-y-6">

            {/* Basic Info */}
            <section>
              <SectionLabel>Basic Info</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel>Plan Name</FieldLabel>
                  <Input
                    value={state.name}
                    onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                    className="h-9 text-sm"
                    placeholder="Essential"
                  />
                </div>
                <div>
                  <FieldLabel optional>Badge</FieldLabel>
                  <Input
                    value={state.badge}
                    onChange={(e) => setState((s) => ({ ...s, badge: e.target.value }))}
                    className="h-9 text-sm"
                    placeholder="Most Popular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <Input
                    value={state.description}
                    onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
                    className="h-9 text-sm"
                    placeholder="Short plan description shown below the name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel optional>Card Style</FieldLabel>
                  <button
                    onClick={() => setState((s) => ({ ...s, isFeatured: !s.isFeatured }))}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      state.isFeatured
                        ? "border-teal bg-teal-50 text-teal-700"
                        : "border-navy-100/60 text-graphite-500 hover:border-navy-200"
                    )}
                  >
                    <Star className={cn("h-3.5 w-3.5", state.isFeatured ? "fill-teal text-teal" : "text-graphite-300")} />
                    {state.isFeatured ? "Featured (highlighted card + teal border)" : "Standard card — click to mark as featured"}
                  </button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <SectionLabel className="mb-0">Features</SectionLabel>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-graphite-300">{state.features.length} items · drag ↕ to reorder</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {state.features.map((f, i) => (
                  <FeatureRow
                    key={f.id}
                    item={f}
                    index={i}
                    total={state.features.length}
                    onChange={updateFeature}
                    onDelete={deleteFeature}
                    onMoveUp={(id) => moveFeature(id, -1)}
                    onMoveDown={(id) => moveFeature(id, 1)}
                  />
                ))}
              </div>
              <button
                onClick={addFeature}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-teal/40 py-2.5 text-xs font-medium text-teal hover:border-teal hover:bg-teal-50/40 transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Feature
              </button>
              <p className="mt-2 text-[10px] text-graphite-300">
                <span className="font-semibold">B</span> = bold text &nbsp;·&nbsp;
                <span className="font-semibold">Aa</span> = toggle small/normal size &nbsp;·&nbsp;
                ↕ = reorder
              </p>
            </section>

            {/* Pricing */}
            <section>
              <SectionLabel>Pricing</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-3">
                <PriceInput
                  label="Monthly"
                  value={state.priceMonthly}
                  onChange={(v) => setState((s) => ({ ...s, priceMonthly: v ?? 0 }))}
                />
                <PriceInput
                  label="Quarterly (optional)"
                  value={state.priceQuarterly}
                  onChange={(v) => setState((s) => ({ ...s, priceQuarterly: v }))}
                />
                <PriceInput
                  label="Annual (optional)"
                  value={state.priceAnnual}
                  onChange={(v) => setState((s) => ({ ...s, priceAnnual: v }))}
                />
              </div>
              {state.priceMonthly > 0 && (
                <p className="mt-2 text-[10px] text-graphite-400">
                  Daily cost: <span className="font-semibold text-navy">${(state.priceMonthly / 100 / 30).toFixed(2)}/day</span>
                  {state.priceAnnual && (
                    <> &nbsp;·&nbsp; Annual monthly equiv: <span className="font-semibold text-navy">{formatPrice(Math.round(state.priceAnnual / 12))}/mo</span></>
                  )}
                </p>
              )}
            </section>

            {/* Stripe */}
            <section>
              <SectionLabel>Stripe Integration</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                <StripeIdInput label="Stripe Product ID" value={state.stripeProductId} onChange={(v) => setState((s) => ({ ...s, stripeProductId: v }))} />
                <StripeIdInput label="Monthly Price ID" value={state.stripePriceIdMonthly} onChange={(v) => setState((s) => ({ ...s, stripePriceIdMonthly: v }))} />
                <StripeIdInput label="Quarterly Price ID" value={state.stripePriceIdQuarterly} onChange={(v) => setState((s) => ({ ...s, stripePriceIdQuarterly: v }))} />
                <StripeIdInput label="Annual Price ID" value={state.stripePriceIdAnnual} onChange={(v) => setState((s) => ({ ...s, stripePriceIdAnnual: v }))} />
              </div>
            </section>

            {/* Bottom save row */}
            <div className="flex justify-end gap-2 pt-2 border-t border-navy-100/40">
              <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
              <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
                {saving ? "Saving..." : <><Check className="h-3.5 w-3.5" /> Save Changes</>}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        {showPreview && (
          <div className="border-l border-navy-100/40 bg-gradient-to-b from-navy-50/40 to-transparent p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal/10">
                <Eye className="h-3 w-3 text-teal" />
              </div>
              <span className="text-xs font-semibold text-navy">Live Preview</span>
              <span className="text-[10px] text-graphite-300">Updates as you type</span>
            </div>
            <div className="sticky top-5">
              <PricingCardPreview state={state} />
              <p className="mt-3 text-center text-[10px] text-graphite-300">
                Matches the public pricing page card
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Label helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-3 text-[10px] font-bold uppercase tracking-wider text-graphite-400", className)}>
      {children}
    </p>
  );
}
function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-[10px] font-semibold text-graphite-400 mb-1.5">
      {children}
      {optional && <span className="ml-1 font-normal text-graphite-300">(optional)</span>}
    </label>
  );
}

// ─── Main page component ───────────────────────────────────────────────────────

export function ProductsClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function startEdit(product: ProductItem) {
    setEditingId(product.id);
    setExpandedId(product.id);
  }

  function handleSaved(updated: ProductItem) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  }

  const memberships = products.filter((p) => p.type === "MEMBERSHIP");
  const addons = products.filter((p) => p.type !== "MEMBERSHIP");

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-graphite-400">Total Products</p>
          <p className="text-2xl font-bold text-navy">{products.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-graphite-400">Active</p>
          <p className="text-2xl font-bold text-teal">{products.filter((p) => p.isActive).length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-graphite-400">Plans</p>
          <p className="text-2xl font-bold text-navy">{memberships.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-graphite-400">Starting From</p>
          <p className="text-2xl font-bold text-teal">
            {memberships.length > 0
              ? `${formatPrice(Math.min(...memberships.map((m) => m.priceMonthly)))}/mo`
              : "$0"}
          </p>
        </CardContent></Card>
      </div>

      {/* Membership Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-teal" /> Membership Plans
            <span className="ml-auto text-[10px] font-normal text-graphite-300">Click Edit to open the live editor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {memberships.map((p) => (
            <div
              key={p.id}
              className={cn(
                "overflow-hidden rounded-xl border transition-all duration-200",
                editingId === p.id ? "border-teal ring-2 ring-teal/15 shadow-sm" : "border-navy-100/60",
                !p.isActive && "opacity-50"
              )}
            >
              {/* Summary row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedId(expandedId === p.id && editingId !== p.id ? null : (editingId === p.id ? null : p.id))}
                    className="text-graphite-400 hover:text-navy transition-colors"
                  >
                    {expandedId === p.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy">{p.name}</span>
                      {p.badge && <Badge variant="gold" className="text-[10px]">{p.badge}</Badge>}
                      {p.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-600">
                          <Star className="h-2.5 w-2.5 fill-teal-500" /> Featured
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-graphite-400">{p.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-lg font-bold text-navy">{formatPrice(p.priceMonthly)}</span>
                    <span className="text-xs text-graphite-400">/mo</span>
                    {p.priceAnnual && (
                      <span className="ml-2 text-xs text-teal">
                        ({formatPrice(Math.round(p.priceAnnual / 12))}/mo annual)
                      </span>
                    )}
                  </div>
                  {p.stripePriceIdMonthly ? (
                    <Badge variant="success" className="text-[10px] hidden sm:inline-flex">Stripe linked</Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px] gap-1 hidden sm:inline-flex">
                      <AlertCircle className="h-3 w-3" /> No Stripe ID
                    </Badge>
                  )}
                  <button onClick={() => toggleActive(p.id)} title={p.isActive ? "Deactivate" : "Activate"}>
                    {p.isActive
                      ? <ToggleRight className="h-5 w-5 text-teal" />
                      : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                  </button>
                  {editingId !== p.id && (
                    <button
                      onClick={() => startEdit(p)}
                      className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-2.5 py-1 text-xs font-medium text-graphite-600 hover:border-teal hover:text-teal hover:bg-teal-50/30 transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsed read-only detail */}
              {expandedId === p.id && editingId !== p.id && (
                <div className="border-t border-navy-100/40 bg-navy-50/20 px-4 py-3">
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="space-y-1">
                      <p className="text-graphite-400">Monthly: <span className="font-semibold text-navy">{formatPrice(p.priceMonthly)}</span></p>
                      <p className="text-graphite-400">Quarterly: <span className="font-semibold text-navy">{p.priceQuarterly ? formatPrice(p.priceQuarterly) : "—"}</span></p>
                      <p className="text-graphite-400">Annual: <span className="font-semibold text-navy">{p.priceAnnual ? formatPrice(p.priceAnnual) : "—"}</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-graphite-400">Product ID: <span className="font-mono text-[10px]">{p.stripeProductId || "—"}</span></p>
                      <p className="text-graphite-400">Monthly ID: <span className="font-mono text-[10px]">{p.stripePriceIdMonthly || "—"}</span></p>
                      <p className="text-graphite-400">Features: <span className="font-semibold text-navy">{Array.isArray(p.features) ? (p.features as unknown[]).length : 0} items</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => startEdit(p)}
                    className="mt-3 flex items-center gap-1.5 rounded-lg bg-navy text-white px-3 py-1.5 text-xs font-medium hover:bg-navy/90 transition-colors"
                  >
                    <Edit2 className="h-3 w-3" /> Open Live Editor
                  </button>
                </div>
              )}

              {/* Live editor */}
              {editingId === p.id && (
                <PlanEditorPane
                  product={p}
                  onCancel={() => { setEditingId(null); setExpandedId(null); }}
                  onSaved={handleSaved}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add-Ons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gold-600" /> Add-Ons & Supplements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addons.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-start justify-between rounded-xl border p-4",
                  p.isActive ? "border-navy-100/60 bg-white" : "border-navy-100/30 bg-navy-50/30 opacity-60"
                )}
              >
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
                  {p.isActive
                    ? <ToggleRight className="h-5 w-5 text-teal" />
                    : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stripe setup guide */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-navy mb-2">How to connect Stripe</h3>
          <ol className="space-y-1.5 text-xs text-graphite-500 list-decimal list-inside">
            <li>Create products in <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-teal underline">Stripe Dashboard</a></li>
            <li>Copy the Product ID (prod_xxx) and Price IDs (price_xxx)</li>
            <li>Click <strong>Edit</strong> on each plan above and paste the IDs in the Stripe Integration section</li>
            <li>Add webhook endpoint in Stripe: <code className="rounded bg-white px-1 py-0.5 text-[10px] text-navy">{typeof window !== "undefined" ? window.location.origin : "https://yoursite.com"}/api/stripe/webhook</code></li>
            <li>Subscribe to: <code className="rounded bg-white px-1 py-0.5 text-[10px]">checkout.session.completed, customer.subscription.*, invoice.*</code></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
