"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Check, X, Package, DollarSign, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, ExternalLink, AlertCircle, Plus,
  Trash2, Edit2, ArrowRight, Eye, EyeOff, Star, Copy,
  Keyboard, Save, Layers, ClipboardList, Zap, Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";
import { ImageUploader } from "@/components/ui/image-uploader";

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
  imageUrl: string | null;
}

interface PlanEditState {
  name: string;
  badge: string;
  description: string;
  imageUrl: string | null;
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

type PreviewInterval = "monthly" | "annual" | "quarterly";

// ─── Feature templates ────────────────────────────────────────────────────────

const FEATURE_TEMPLATES: Record<string, string[]> = {
  "Core Clinical": [
    "Licensed provider evaluation",
    "Personalized treatment plan",
    "Medication, if prescribed",
    "24-48 hour pharmacy shipping",
    "Secure messaging with care team",
    "Monthly check-ins",
    "Refill coordination",
  ],
  "Nutrition & Tracking": [
    "Weekly meal plans & recipes",
    "Grocery list generator",
    "Body measurement tracking",
    "Hydration & protein tracking",
    "Progress photo vault",
  ],
  "Coaching & Support": [
    "Bi-weekly coaching check-ins",
    "Weekly coaching sessions",
    "Priority support",
    "Personalized recipe recommendations",
  ],
  "Premium Add-ons": [
    "Metabolic support supplement bundle",
    "Protein & hydration bundle",
    "Digestive comfort support",
    "Lab work coordination",
    "Maintenance transition planning",
  ],
};

// ─── Feature helpers ──────────────────────────────────────────────────────────

let _fid = 0;
function genId() { return `f${++_fid}`; }

function parseFeatures(raw: unknown): FeatureItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") return { id: genId(), text: item, bold: false, size: "base" as const };
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      return { id: genId(), text: String(o.text ?? ""), bold: Boolean(o.bold), size: o.size === "sm" ? "sm" as const : "base" as const };
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
    imageUrl: p.imageUrl ?? null,
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

function statesEqual(a: PlanEditState, b: PlanEditState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ─── Shared sub-inputs ────────────────────────────────────────────────────────

function PriceInput({ label, value, onChange, required }: {
  label: string; value: number | null | undefined;
  onChange: (v: number | null) => void; required?: boolean;
}) {
  const warn = required && (!value || value === 0);
  return (
    <div>
      <label className="block text-[10px] font-semibold text-graphite-400 mb-1.5">{label}</label>
      <div className="relative">
        <span className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 text-xs", warn ? "text-amber-400" : "text-graphite-400")}>$</span>
        <Input
          type="number" step="0.01"
          value={value ? String(value / 100) : ""}
          onChange={(e) => { const v = e.target.value; onChange(v ? Math.round(parseFloat(v) * 100) : null); }}
          placeholder="0.00"
          className={cn("h-9 text-sm pl-7", warn && "border-amber-300 focus-visible:ring-amber-300")}
        />
      </div>
      {warn && <p className="mt-1 text-[10px] text-amber-500">Price required</p>}
    </div>
  );
}

function StripeIdInput({ label, value, onChange }: { label: string; value: string | null | undefined; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-graphite-400 mb-1.5">{label}</label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="price_xxxx or prod_xxxx" className="h-9 text-xs font-mono" />
    </div>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({ item, index, total, onChange, onDelete, onMoveUp, onMoveDown }: {
  item: FeatureItem; index: number; total: number;
  onChange: (id: string, c: Partial<FeatureItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-lg border border-navy-100/60 bg-white px-2.5 py-2 hover:border-teal/40 transition-colors shadow-sm">
      <div className="flex flex-col gap-px shrink-0">
        <button onClick={() => onMoveUp(item.id)} disabled={index === 0}
          className="rounded p-0.5 text-graphite-300 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
          <ChevronUp className="h-3 w-3" />
        </button>
        <button onClick={() => onMoveDown(item.id)} disabled={index === total - 1}
          className="rounded p-0.5 text-graphite-300 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <Check className="h-3.5 w-3.5 shrink-0 text-teal/50" />
      <input
        type="text" value={item.text}
        onChange={(e) => onChange(item.id, { text: e.target.value })}
        placeholder="Feature description..."
        className={cn(
          "min-w-0 flex-1 bg-transparent text-graphite-700 outline-none placeholder:text-graphite-300",
          item.size === "sm" ? "text-xs" : "text-sm",
          item.bold && "font-semibold"
        )}
      />
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onChange(item.id, { bold: !item.bold })} title="Bold"
          className={cn(
            "h-6 w-6 rounded text-xs font-bold transition-colors select-none",
            item.bold ? "bg-navy text-white" : "text-graphite-400 hover:bg-navy-50 border border-navy-100/60"
          )}>B</button>
        <button
          onClick={() => onChange(item.id, { size: item.size === "sm" ? "base" : "sm" })}
          title={item.size === "sm" ? "Normal size" : "Small size"}
          className={cn(
            "h-6 w-7 rounded transition-colors flex items-center justify-center select-none",
            item.size === "sm" ? "bg-navy-100 text-navy border border-navy-200" : "text-graphite-400 hover:bg-navy-50 border border-navy-100/60"
          )}>
          <span className={cn("font-bold leading-none", item.size === "sm" ? "text-[9px]" : "text-[11px]")}>Aa</span>
        </button>
      </div>
      <button onClick={() => onDelete(item.id)} title="Remove"
        className="shrink-0 rounded p-1 text-graphite-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Live pricing card preview ────────────────────────────────────────────────

function PricingCardPreview({ state, interval }: { state: PlanEditState; interval: PreviewInterval }) {
  const price =
    interval === "annual" && state.priceAnnual ? Math.round(state.priceAnnual / 12)
    : interval === "quarterly" && state.priceQuarterly ? Math.round(state.priceQuarterly / 3)
    : state.priceMonthly;

  const dailyCost = (price / 100 / 30).toFixed(2);
  const annualSavings = state.priceAnnual ? state.priceMonthly * 12 - state.priceAnnual : 0;

  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl border bg-white shadow-lg transition-all duration-300",
      state.isFeatured ? "border-teal ring-2 ring-teal/25 shadow-[0_0_30px_rgba(15,154,153,0.12)]" : "border-navy-100/70"
    )}>
      {state.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <span className="inline-flex items-center rounded-full border border-gold-300 bg-gradient-to-r from-gold-100 to-gold-200 px-3 py-0.5 text-xs font-semibold text-gold-800 shadow-sm">
            {state.badge}
          </span>
        </div>
      )}
      <div className={cn("px-6 pb-4", state.badge ? "pt-9" : "pt-6")}>
        <h3 className="text-xl font-bold text-navy leading-tight">
          {state.name || <span className="text-graphite-300 italic font-normal">Plan Name</span>}
        </h3>
        <p className="mt-1.5 text-sm text-graphite-400 leading-relaxed min-h-[2.5rem]">
          {state.description || <span className="italic">Plan description...</span>}
        </p>
        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-navy tracking-tight">{formatPrice(price)}</span>
            <span className="text-sm text-graphite-400">/month</span>
          </div>
          {interval === "annual" && state.priceAnnual && annualSavings > 0 ? (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-graphite-400 line-through">{formatPrice(state.priceMonthly)}/mo</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Save {formatPrice(annualSavings)}/yr
              </span>
            </div>
          ) : (
            <span className="text-sm text-graphite-400">Just ${dailyCost}/day</span>
          )}
          {interval === "annual" && state.priceAnnual && (
            <p className="mt-0.5 text-xs text-graphite-400">Billed as {formatPrice(state.priceAnnual)}/year</p>
          )}
          {interval === "quarterly" && state.priceQuarterly && (
            <p className="mt-0.5 text-xs text-graphite-400">Billed as {formatPrice(state.priceQuarterly)}/quarter</p>
          )}
        </div>
      </div>
      <div className="flex-1 px-6 pb-4">
        <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50/60 px-3 py-2">
          <p className="text-xs font-semibold text-teal-700">
            Includes provider evaluation + GLP-1 medication (if prescribed) + ongoing support
          </p>
        </div>
        <ul className="space-y-2.5">
          {state.features.length === 0
            ? <li className="text-sm italic text-graphite-300">Add features below...</li>
            : state.features.map((f) => (
              <li key={f.id} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <span className={cn(
                  "text-graphite-600 leading-snug",
                  f.size === "sm" ? "text-xs" : "text-sm",
                  f.bold && "font-semibold"
                )}>{f.text || <span className="italic text-graphite-300">Feature text...</span>}</span>
              </li>
            ))}
        </ul>
      </div>
      <div className="px-6 pb-6 pt-2 space-y-3">
        <button className={cn(
          "w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2",
          state.isFeatured ? "bg-navy text-white" : "border border-navy/30 text-navy"
        )}>
          {state.isFeatured ? "See If I Qualify" : "Get Started"}
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-xs text-center text-graphite-400">Cancel anytime · No hidden fees</p>
      </div>
    </div>
  );
}

// ─── Plan editor pane ─────────────────────────────────────────────────────────

function PlanEditorPane({ product, allProducts, onCancel, onSaved }: {
  product: ProductItem;
  allProducts: ProductItem[];
  onCancel: () => void;
  onSaved: (updated: ProductItem) => void;
}) {
  const initialState = initState(product);
  const [state, setState] = useState<PlanEditState>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewInterval, setPreviewInterval] = useState<PreviewInterval>("monthly");
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const isDirty = !statesEqual(state, initialState);

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 50); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const updateFeature = useCallback((id: string, changes: Partial<FeatureItem>) => {
    setState((s) => ({ ...s, features: s.features.map((f) => f.id === id ? { ...f, ...changes } : f) }));
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
    setState((s) => ({ ...s, features: [...s.features, { id: genId(), text: "", bold: false, size: "base" as const }] }));
  }

  function handlePasteImport() {
    const lines = pasteText.split("\n").map((l) => l.replace(/^[-•*✓✔]\s*/, "").trim()).filter(Boolean);
    if (!lines.length) return;
    const newFeatures = lines.map((text) => ({ id: genId(), text, bold: false, size: "base" as const }));
    setState((s) => ({ ...s, features: [...s.features, ...newFeatures] }));
    setPasteText("");
    setShowPasteArea(false);
  }

  function addTemplateFeature(text: string) {
    const already = state.features.some((f) => f.text === text);
    if (already) return;
    setState((s) => ({ ...s, features: [...s.features, { id: genId(), text, bold: false, size: "base" as const }] }));
  }

  function copyFeaturesFrom(fromProduct: ProductItem) {
    const features = parseFeatures(fromProduct.features);
    setState((s) => ({ ...s, features }));
  }

  function handleCancel() {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    onCancel();
  }

  // Available preview intervals — only show toggles for prices that are actually set
  const availableIntervals: PreviewInterval[] = ["monthly"];
  if (state.priceQuarterly) availableIntervals.push("quarterly");
  if (state.priceAnnual) availableIntervals.push("annual");

  async function save() {
    if (saving) return;
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
          imageUrl: state.imageUrl || null,
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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      onSaved({
        ...product,
        name: state.name,
        description: state.description || null,
        badge: state.badge || null,
        imageUrl: state.imageUrl || null,
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

  const otherPlans = allProducts.filter((p) => p.id !== product.id);

  return (
    <div className="border-t border-navy-100/40 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100/40 bg-navy-50/50 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <div className={cn("h-1.5 w-1.5 rounded-full transition-colors", isDirty ? "bg-amber-400 animate-pulse" : "bg-teal")} />
          <span className="text-xs font-semibold text-navy">Editing: {product.name}</span>
          {isDirty
            ? <span className="text-[10px] text-amber-500 font-medium">• unsaved changes</span>
            : <span className="text-[10px] text-graphite-300">• updates preview instantly</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-graphite-500 hover:bg-navy-100/50 hover:text-navy transition-colors">
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <span className="hidden sm:flex items-center gap-1 rounded-md border border-navy-100/60 px-2 py-1 text-[10px] text-graphite-300">
            <Keyboard className="h-3 w-3" />
            {typeof navigator !== "undefined" && /Mac/i.test(navigator.platform) ? "⌘S" : "Ctrl+S"}
          </span>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 text-xs px-2.5">
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={save} disabled={saving}
            className={cn("h-7 text-xs gap-1.5 px-3 transition-all", saveSuccess && "bg-emerald-600 hover:bg-emerald-600")}>
            {saving ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving...
              </span>
            ) : saveSuccess ? (
              <><Check className="h-3.5 w-3.5" /> Saved!</>
            ) : (
              <><Save className="h-3.5 w-3.5" /> Save Changes</>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </div>
      )}

      {/* Mobile preview (below lg) */}
      {showPreview && (
        <div className="lg:hidden border-b border-navy-100/40 bg-gradient-to-r from-navy-50/60 to-transparent px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-navy">
              <Eye className="h-3.5 w-3.5 text-teal" /> Live Preview
            </p>
            {availableIntervals.length > 1 && (
              <IntervalToggle intervals={availableIntervals} value={previewInterval} onChange={setPreviewInterval} />
            )}
          </div>
          <div className="max-w-xs">
            <PricingCardPreview state={state} interval={previewInterval} />
          </div>
        </div>
      )}

      {/* Split pane */}
      <div className={cn("grid", showPreview ? "lg:grid-cols-[1fr_360px]" : "grid-cols-1")}>
        {/* ── Left: Form ── */}
        <div className="overflow-y-auto p-5 space-y-6" style={{ maxHeight: "72vh" }}>

          {/* Basic Info */}
          <section>
            <SectionLabel>Basic Info</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Plan Name</FieldLabel>
                <Input ref={nameRef} value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} className="h-9 text-sm" placeholder="Essential" />
              </div>
              <div>
                <FieldLabel optional>Badge</FieldLabel>
                <Input value={state.badge} onChange={(e) => setState((s) => ({ ...s, badge: e.target.value }))} className="h-9 text-sm" placeholder="Most Popular" />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <Input value={state.description} onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))} className="h-9 text-sm" placeholder="Short plan description shown below the name" />
              </div>
              <div className="sm:col-span-2">
                <ImageUploader
                  label="Product Image (optional)"
                  value={state.imageUrl}
                  onChange={(url) => setState((s) => ({ ...s, imageUrl: url }))}
                  hint="Shown in the product catalog. Drag & drop or click to upload."
                  defaultAspect={1}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel optional>Card Style</FieldLabel>
                <button
                  onClick={() => setState((s) => ({ ...s, isFeatured: !s.isFeatured }))}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                    state.isFeatured ? "border-teal bg-teal-50 text-teal-700" : "border-navy-100/60 text-graphite-500 hover:border-navy-200"
                  )}>
                  <Star className={cn("h-3.5 w-3.5", state.isFeatured ? "fill-teal-500 text-teal" : "text-graphite-300")} />
                  {state.isFeatured ? "Featured — teal border, dark CTA button" : "Standard card — click to mark as featured"}
                </button>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel className="mb-0">Features</SectionLabel>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-graphite-300">{state.features.length} items</span>

                {/* Feature templates */}
                <div className="relative">
                  <button
                    onClick={() => { setShowTemplates((v) => !v); setShowPasteArea(false); }}
                    className={cn(
                      "flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition-colors",
                      showTemplates ? "border-teal bg-teal-50 text-teal-700" : "border-navy-100/60 text-graphite-400 hover:border-navy-300 hover:text-navy"
                    )}>
                    <Zap className="h-2.5 w-2.5" /> Templates
                  </button>
                  {showTemplates && (
                    <div className="absolute right-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-xl border border-navy-100/60 bg-white shadow-xl">
                      <div className="border-b border-navy-100/40 px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-navy">Quick-add features</span>
                        <button onClick={() => setShowTemplates(false)} className="text-graphite-300 hover:text-navy">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto p-2 space-y-2">
                        {Object.entries(FEATURE_TEMPLATES).map(([group, items]) => (
                          <div key={group}>
                            <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-graphite-300">{group}</p>
                            {items.map((text) => {
                              const exists = state.features.some((f) => f.text === text);
                              return (
                                <button key={text} onClick={() => addTemplateFeature(text)} disabled={exists}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                                    exists ? "text-graphite-300 cursor-not-allowed" : "text-graphite-600 hover:bg-navy-50 hover:text-navy"
                                  )}>
                                  <Check className={cn("h-3 w-3 shrink-0", exists ? "text-teal" : "text-graphite-200")} />
                                  {text}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Paste bulk import */}
                <button
                  onClick={() => { setShowPasteArea((v) => !v); setShowTemplates(false); }}
                  className={cn(
                    "flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition-colors",
                    showPasteArea ? "border-teal bg-teal-50 text-teal-700" : "border-navy-100/60 text-graphite-400 hover:border-navy-300 hover:text-navy"
                  )}>
                  <ClipboardList className="h-2.5 w-2.5" /> Paste list
                </button>

                {/* Copy from plan */}
                {otherPlans.length > 0 && (
                  <div className="relative group/copy">
                    <button className="flex items-center gap-1 rounded border border-navy-100/60 px-2 py-0.5 text-[10px] text-graphite-400 hover:border-navy-300 hover:text-navy transition-colors">
                      <Copy className="h-2.5 w-2.5" /> Copy from
                    </button>
                    <div className="absolute right-0 top-full z-20 mt-1 hidden min-w-[140px] overflow-hidden rounded-lg border border-navy-100/60 bg-white shadow-lg group-hover/copy:block">
                      {otherPlans.map((op) => (
                        <button key={op.id} onClick={() => copyFeaturesFrom(op)}
                          className="block w-full px-3 py-2 text-left text-xs text-graphite-600 hover:bg-navy-50 transition-colors">
                          {op.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Paste area */}
            {showPasteArea && (
              <div className="mb-3 rounded-xl border border-teal/30 bg-teal-50/30 p-3">
                <p className="mb-2 text-[10px] font-semibold text-teal-700">
                  Paste a list — one feature per line. Leading bullets (-, •, ✓) are stripped automatically.
                </p>
                <textarea
                  autoFocus
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"Licensed provider evaluation\nPersonalized treatment plan\nMedication, if prescribed"}
                  rows={5}
                  className="w-full rounded-lg border border-teal/30 bg-white px-3 py-2 text-xs text-graphite-700 outline-none placeholder:text-graphite-300 focus:border-teal focus:ring-1 focus:ring-teal/30 resize-none font-mono"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-graphite-400">
                    {pasteText.split("\n").filter((l) => l.trim()).length} lines detected
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { setShowPasteArea(false); setPasteText(""); }}
                      className="rounded-md px-2.5 py-1 text-xs text-graphite-500 hover:bg-navy-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handlePasteImport} disabled={!pasteText.trim()}
                      className="rounded-md bg-teal px-3 py-1 text-xs font-semibold text-white hover:bg-teal/90 disabled:opacity-40 transition-colors">
                      Add {pasteText.split("\n").filter((l) => l.trim()).length} features
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              {state.features.map((f, i) => (
                <FeatureRow key={f.id} item={f} index={i} total={state.features.length}
                  onChange={updateFeature} onDelete={deleteFeature}
                  onMoveUp={(id) => moveFeature(id, -1)} onMoveDown={(id) => moveFeature(id, 1)} />
              ))}
            </div>
            <button onClick={addFeature}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-teal/40 py-2.5 text-xs font-medium text-teal hover:border-teal hover:bg-teal-50/40 transition-all">
              <Plus className="h-3.5 w-3.5" /> Add Feature
            </button>
            <p className="mt-2 text-[10px] text-graphite-300">
              <span className="font-semibold">B</span> = bold &nbsp;·&nbsp;
              <span className="font-semibold">Aa</span> = small/normal size &nbsp;·&nbsp; ↕ = reorder
            </p>
          </section>

          {/* Pricing */}
          <section>
            <SectionLabel>Pricing</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              <PriceInput label="Monthly" value={state.priceMonthly} required
                onChange={(v) => setState((s) => ({ ...s, priceMonthly: v ?? 0 }))} />
              <PriceInput label="Quarterly (optional)" value={state.priceQuarterly}
                onChange={(v) => setState((s) => ({ ...s, priceQuarterly: v }))} />
              <PriceInput label="Annual (optional)" value={state.priceAnnual}
                onChange={(v) => setState((s) => ({ ...s, priceAnnual: v }))} />
            </div>
            {state.priceMonthly > 0 && (
              <div className="mt-3 rounded-lg border border-navy-100/40 bg-navy-50/30 p-3 grid gap-2 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-graphite-300">Daily cost</p>
                  <p className="text-sm font-bold text-navy">${(state.priceMonthly / 100 / 30).toFixed(2)}/day</p>
                </div>
                {state.priceAnnual && (
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-graphite-300">Annual equiv</p>
                    <p className="text-sm font-bold text-navy">{formatPrice(Math.round(state.priceAnnual / 12))}/mo</p>
                  </div>
                )}
                {state.priceAnnual && (
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-graphite-300">Annual savings</p>
                    <p className="text-sm font-bold text-emerald-600">{formatPrice(state.priceMonthly * 12 - state.priceAnnual)}/yr</p>
                  </div>
                )}
              </div>
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

          {/* Bottom save */}
          <div className="flex justify-between items-center pt-2 border-t border-navy-100/40">
            <div className={cn("flex items-center gap-1.5 text-xs", isDirty ? "text-amber-500" : "text-graphite-300")}>
              {isDirty ? <><AlertCircle className="h-3.5 w-3.5" /> Unsaved changes</> : <><Check className="h-3.5 w-3.5 text-teal" /> All changes saved</>}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
                {saving ? "Saving..." : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right: Desktop Live Preview ── */}
        {showPreview && (
          <div className="hidden lg:block border-l border-navy-100/40 bg-gradient-to-b from-navy-50/40 to-transparent p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal/10">
                  <Eye className="h-3 w-3 text-teal" />
                </div>
                <span className="text-xs font-semibold text-navy">Live Preview</span>
              </div>
              {availableIntervals.length > 1 && (
                <IntervalToggle intervals={availableIntervals} value={previewInterval} onChange={setPreviewInterval} />
              )}
            </div>
            <div className="sticky top-5">
              <PricingCardPreview state={state} interval={previewInterval} />
              <div className="mt-3 flex justify-center gap-3 text-[10px] text-graphite-300">
                <span>{state.features.length} feature{state.features.length !== 1 ? "s" : ""}</span>
                <span>·</span>
                <span>{formatPrice(state.priceMonthly)}/mo</span>
                {state.badge && <><span>·</span><span className="text-gold-600">{state.badge}</span></>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Interval toggle (for preview) ───────────────────────────────────────────

function IntervalToggle({ intervals, value, onChange }: {
  intervals: PreviewInterval[];
  value: PreviewInterval;
  onChange: (v: PreviewInterval) => void;
}) {
  const labels: Record<PreviewInterval, string> = { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" };
  return (
    <div className="inline-flex items-center rounded-full border border-navy-100/60 bg-white p-0.5 shadow-sm">
      {intervals.map((iv) => (
        <button key={iv} onClick={() => onChange(iv)}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all",
            value === iv ? "bg-navy text-white shadow-sm" : "text-graphite-400 hover:text-navy"
          )}>
          {labels[iv]}
        </button>
      ))}
    </div>
  );
}

// ─── Add-on editor ────────────────────────────────────────────────────────────

function AddonEditorPane({ product, onCancel, onSaved }: {
  product: ProductItem; onCancel: () => void; onSaved: (updated: ProductItem) => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [priceMonthly, setPriceMonthly] = useState(product.priceMonthly);
  const [stripeMonthly, setStripeMonthly] = useState(product.stripePriceIdMonthly ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialRef = useRef({ name: product.name, description: product.description ?? "", priceMonthly: product.priceMonthly, stripeMonthly: product.stripePriceIdMonthly ?? "" });
  const isDirty = name !== initialRef.current.name || description !== initialRef.current.description || priceMonthly !== initialRef.current.priceMonthly || stripeMonthly !== initialRef.current.stripeMonthly;

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, name, description: description || null, priceMonthly, stripePriceIdMonthly: stripeMonthly || null }),
      });
      if (!res.ok) { setError("Failed to save"); return; }
      onSaved({ ...product, name, description: description || null, priceMonthly, stripePriceIdMonthly: stripeMonthly || null });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-teal/30 bg-teal-50/20 p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Name</FieldLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" />
        </div>
        <div>
          <FieldLabel>Monthly Price</FieldLabel>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-graphite-400">$</span>
            <Input type="number" step="0.01" value={priceMonthly ? String(priceMonthly / 100) : ""} onChange={(e) => setPriceMonthly(e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0)} className="h-8 text-sm pl-7" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <FieldLabel optional>Description</FieldLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-8 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel optional>Monthly Stripe Price ID</FieldLabel>
          <Input value={stripeMonthly} onChange={(e) => setStripeMonthly(e.target.value)} placeholder="price_xxxx" className="h-8 text-xs font-mono" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 text-xs">Cancel</Button>
        <Button size="sm" onClick={save} disabled={saving || !isDirty} className="h-7 text-xs gap-1.5">
          {saving ? "Saving..." : <><Save className="h-3 w-3" /> Save</>}
        </Button>
      </div>
    </div>
  );
}

// ─── Label helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mb-3 text-[10px] font-bold uppercase tracking-wider text-graphite-400", className)}>{children}</p>;
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
  const [addonFilter, setAddonFilter] = useState<string>("all");
  const [addonSearch, setAddonSearch] = useState("");
  const [reordering, setReordering] = useState(false);

  function startEdit(product: ProductItem) {
    setEditingId(product.id);
    setExpandedId(product.id);
  }

  function handleSaved(updated: ProductItem) {
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
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

  async function movePlan(id: string, dir: -1 | 1) {
    setReordering(true);
    const mems = products.filter((p) => p.type === "MEMBERSHIP");
    const idx = mems.findIndex((p) => p.id === id);
    const next = idx + dir;
    if (next < 0 || next >= mems.length) { setReordering(false); return; }

    // Swap sortOrders
    const a = mems[idx], b = mems[next];
    const newA = { ...a, sortOrder: b.sortOrder };
    const newB = { ...b, sortOrder: a.sortOrder };

    await Promise.all([
      fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, sortOrder: b.sortOrder }) }),
      fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, sortOrder: a.sortOrder }) }),
    ]);

    setProducts((prev) => prev.map((p) => p.id === a.id ? newA : p.id === b.id ? newB : p));
    setReordering(false);
  }

  const memberships = [...products.filter((p) => p.type === "MEMBERSHIP")].sort((a, b) => a.sortOrder - b.sortOrder);
  const addons = products.filter((p) => p.type !== "MEMBERSHIP");

  // Add-on categories for filter chips
  const addonCategories = Array.from(new Set(addons.map((p) => p.category)));
  const filteredAddons = addons.filter((p) => {
    const matchCat = addonFilter === "all" || p.category === addonFilter;
    const matchSearch = !addonSearch || p.name.toLowerCase().includes(addonSearch.toLowerCase()) || (p.description ?? "").toLowerCase().includes(addonSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Products & Pricing</h2>
          <p className="text-sm text-graphite-400">Manage plans, add-ons, and Stripe integration</p>
        </div>
        <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-graphite-500 hover:bg-navy-50 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> Stripe Dashboard
        </a>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Products</p><p className="text-2xl font-bold text-navy">{products.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Active</p><p className="text-2xl font-bold text-teal">{products.filter((p) => p.isActive).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Plans</p><p className="text-2xl font-bold text-navy">{memberships.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Starting From</p><p className="text-2xl font-bold text-teal">{memberships.length > 0 ? `${formatPrice(Math.min(...memberships.map((m) => m.priceMonthly)))}/mo` : "$0"}</p></CardContent></Card>
      </div>

      {/* Membership Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-teal" /> Membership Plans
            <span className="ml-auto text-[10px] font-normal text-graphite-300">Click Edit to open the live editor · ↕ drag to reorder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {memberships.map((p, idx) => (
            <div key={p.id} className={cn(
              "overflow-hidden rounded-xl border transition-all duration-200",
              editingId === p.id ? "border-teal ring-2 ring-teal/15 shadow-sm" : "border-navy-100/60",
              !p.isActive && "opacity-50"
            )}>
              {/* Summary row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-px">
                    <button onClick={() => movePlan(p.id, -1)} disabled={idx === 0 || reordering}
                      className="rounded p-0.5 text-graphite-300 hover:text-navy disabled:opacity-20 transition-colors" title="Move up">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => movePlan(p.id, 1)} disabled={idx === memberships.length - 1 || reordering}
                      className="rounded p-0.5 text-graphite-300 hover:text-navy disabled:opacity-20 transition-colors" title="Move down">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === p.id && editingId !== p.id ? null : p.id)}
                    className="text-graphite-400 hover:text-navy transition-colors ml-1">
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
                    <span className="text-xs text-graphite-400">
                      {p.slug} · {Array.isArray(p.features) ? (p.features as unknown[]).length : 0} features · sort #{p.sortOrder}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-lg font-bold text-navy">{formatPrice(p.priceMonthly)}</span>
                    <span className="text-xs text-graphite-400">/mo</span>
                    {p.priceAnnual && <span className="ml-2 text-xs text-teal">({formatPrice(Math.round(p.priceAnnual / 12))}/mo annual)</span>}
                  </div>
                  {p.stripePriceIdMonthly
                    ? <Badge variant="success" className="text-[10px] hidden sm:inline-flex">Stripe linked</Badge>
                    : <Badge variant="warning" className="text-[10px] gap-1 hidden sm:inline-flex"><AlertCircle className="h-3 w-3" /> No Stripe ID</Badge>}
                  <button onClick={() => toggleActive(p.id)} title={p.isActive ? "Deactivate" : "Activate"}>
                    {p.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                  </button>
                  {editingId !== p.id && (
                    <button onClick={() => startEdit(p)}
                      className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-2.5 py-1 text-xs font-medium text-graphite-600 hover:border-teal hover:text-teal hover:bg-teal-50/30 transition-all">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsed read-only detail */}
              {expandedId === p.id && editingId !== p.id && (
                <div className="border-t border-navy-100/40 bg-navy-50/20 px-4 py-3">
                  <div className="grid gap-4 sm:grid-cols-3 text-xs mb-3">
                    <div className="space-y-1">
                      <p className="text-graphite-400">Monthly: <span className="font-semibold text-navy">{formatPrice(p.priceMonthly)}</span></p>
                      <p className="text-graphite-400">Quarterly: <span className="font-semibold text-navy">{p.priceQuarterly ? formatPrice(p.priceQuarterly) : "—"}</span></p>
                      <p className="text-graphite-400">Annual: <span className="font-semibold text-navy">{p.priceAnnual ? formatPrice(p.priceAnnual) : "—"}</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-graphite-400">Product ID: <span className="font-mono text-[10px]">{p.stripeProductId || "—"}</span></p>
                      <p className="text-graphite-400">Price ID: <span className="font-mono text-[10px]">{p.stripePriceIdMonthly || "—"}</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-graphite-400">Features: <span className="font-semibold text-navy">{Array.isArray(p.features) ? (p.features as unknown[]).length : 0} items</span></p>
                      <p className="text-graphite-400">Sort order: <span className="font-semibold text-navy">#{p.sortOrder}</span></p>
                    </div>
                  </div>
                  <button onClick={() => startEdit(p)}
                    className="flex items-center gap-1.5 rounded-lg bg-navy text-white px-3 py-1.5 text-xs font-medium hover:bg-navy/90 transition-colors">
                    <Edit2 className="h-3 w-3" /> Open Live Editor
                  </button>
                </div>
              )}

              {/* Live editor */}
              {editingId === p.id && (
                <PlanEditorPane
                  product={p}
                  allProducts={memberships}
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
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gold-600" /> Add-Ons & Supplements
              <span className="text-xs font-normal text-graphite-400 ml-1">
                {filteredAddons.length !== addons.length ? `${filteredAddons.length} of ${addons.length}` : addons.length} products
              </span>
            </CardTitle>
            {/* Search */}
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-graphite-300" />
              <input
                value={addonSearch}
                onChange={(e) => setAddonSearch(e.target.value)}
                placeholder="Search add-ons..."
                className="h-8 rounded-lg border border-navy-100/60 bg-white pl-7 pr-3 text-xs outline-none placeholder:text-graphite-300 focus:border-teal focus:ring-1 focus:ring-teal/20 transition-colors w-44"
              />
            </div>
          </div>
          {/* Category filter chips */}
          {addonCategories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button onClick={() => setAddonFilter("all")}
                className={cn("rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                  addonFilter === "all" ? "border-navy bg-navy text-white" : "border-navy-100/60 text-graphite-500 hover:border-navy-300")}>
                All
              </button>
              {addonCategories.map((cat) => (
                <button key={cat} onClick={() => setAddonFilter(cat === addonFilter ? "all" : cat)}
                  className={cn("rounded-full border px-3 py-1 text-[11px] font-medium transition-all capitalize",
                    addonFilter === cat ? "border-teal bg-teal text-white" : "border-navy-100/60 text-graphite-500 hover:border-teal/60 hover:text-teal")}>
                  {cat.replace(/_/g, " ").toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {filteredAddons.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Layers className="h-8 w-8 text-graphite-200" />
              <p className="text-sm text-graphite-400">No add-ons match your filter</p>
              <button onClick={() => { setAddonFilter("all"); setAddonSearch(""); }}
                className="text-xs text-teal underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAddons.map((p) => (
                <div key={p.id} className={cn(
                  "rounded-xl border transition-all",
                  p.isActive ? "border-navy-100/60 bg-white" : "border-navy-100/30 bg-navy-50/30 opacity-60",
                  editingId === p.id && "border-teal ring-1 ring-teal/20"
                )}>
                  <div className="flex items-start justify-between p-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">{p.name}</p>
                      <span className="inline-flex items-center rounded-full border border-navy-100/40 bg-navy-50/60 px-2 py-0.5 text-[10px] text-graphite-400 capitalize mt-0.5">
                        {p.category.replace(/_/g, " ").toLowerCase()}
                      </span>
                      {p.description && <p className="mt-1.5 text-xs text-graphite-500 line-clamp-2 leading-relaxed">{p.description}</p>}
                      <p className="mt-2 text-sm font-bold text-teal">{formatPrice(p.priceMonthly)}<span className="text-xs font-normal text-graphite-400">/mo</span></p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {p.stripePriceIdMonthly
                          ? <span className="flex items-center gap-1 text-[10px] text-emerald-600"><Check className="h-3 w-3" /> Stripe linked</span>
                          : <span className="flex items-center gap-1 text-[10px] text-amber-500"><AlertCircle className="h-3 w-3" /> No Stripe ID</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      {editingId !== p.id && (
                        <button onClick={() => startEdit(p)}
                          className="rounded-md border border-navy-100/60 p-1.5 text-graphite-400 hover:border-teal hover:text-teal transition-all" title="Edit">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => toggleActive(p.id)} title={p.isActive ? "Deactivate" : "Activate"}>
                        {p.isActive ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                      </button>
                    </div>
                  </div>
                  {editingId === p.id && (
                    <div className="border-t border-navy-100/40 px-4 pb-4">
                      <AddonEditorPane
                        product={p}
                        onCancel={() => setEditingId(null)}
                        onSaved={(updated) => { setProducts((prev) => prev.map((x) => x.id === updated.id ? updated : x)); setEditingId(null); }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe setup */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-navy mb-2">How to connect Stripe</h3>
          <ol className="space-y-1.5 text-xs text-graphite-500 list-decimal list-inside">
            <li>Create products in <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-teal underline">Stripe Dashboard</a></li>
            <li>Copy the Product ID (prod_xxx) and Price IDs (price_xxx)</li>
            <li>Click <strong>Edit</strong> on each plan and paste the IDs in the Stripe Integration section</li>
            <li>Add webhook endpoint: <code className="rounded bg-white px-1 py-0.5 text-[10px] text-navy">{typeof window !== "undefined" ? window.location.origin : "https://yoursite.com"}/api/stripe/webhook</code></li>
            <li>Subscribe to: <code className="rounded bg-white px-1 py-0.5 text-[10px]">checkout.session.completed, customer.subscription.*, invoice.*</code></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
