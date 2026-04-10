"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Check, Star, Sparkles, ArrowRight, Lock, Pill,
  Flame, Droplets, Leaf, ChefHat, Users, TestTube, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  marketplaceDesc: string | null;
  priceMonthly: number;
  type: string;
  category: string;
  badge: string | null;
  features: unknown;
  iconName: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  stripePriceIdMonthly: string | null;
}

interface ActiveItem {
  slug: string;
  name: string;
  price: number;
}

interface ShopClientProps {
  eligible: boolean;
  reason?: string;
  products: Product[];
  activeProductSlugs: string[];
  activeItems: ActiveItem[];
}

const iconMap: Record<string, typeof Pill> = {
  Flame, Droplets, Leaf, ChefHat, Users, TestTube, Pill, Sparkles, Star,
};

const categoryLabels: Record<string, string> = {
  METABOLIC_SUPPORT: "Supplements",
  NUTRITION: "Nutrition",
  HYDRATION_PROTEIN: "Supplements",
  DIGESTIVE: "Supplements",
  COACHING: "Coaching",
  LABS: "Labs",
  MEAL_PLANS: "Nutrition",
  WEIGHT_MANAGEMENT: "Plans",
};

export function ShopClient({ eligible, reason, products, activeProductSlugs, activeItems }: ShopClientProps) {
  const [filter, setFilter] = useState("all");
  const [purchasingSlug, setPurchasingSlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<string[]>([]);

  const categories = ["all", ...new Set(products.map((p) => categoryLabels[p.category] || "Other"))];

  const filteredProducts = filter === "all"
    ? products
    : products.filter((p) => (categoryLabels[p.category] || "Other") === filter);

  const featuredProducts = products.filter((p) => p.isFeatured && !activeProductSlugs.includes(p.slug) && !purchased.includes(p.slug));

  async function handlePurchase(product: Product) {
    if (purchasingSlug) return;
    setPurchasingSlug(product.slug);
    setConfirmSlug(null);

    track("shop_purchase_start", { product: product.slug, price: product.priceMonthly });

    try {
      const res = await fetch("/api/stripe/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: product.slug }),
      });

      if (res.ok) {
        setPurchased((prev) => [...prev, product.slug]);
        track("shop_purchase_complete", { product: product.slug });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add product. Please try again.");
        track("shop_purchase_error", { product: product.slug, error: data.error });
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setPurchasingSlug(null);
    }
  }

  // Gated state — not eligible
  if (!eligible) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 mb-4">
          <Lock className="h-8 w-8 text-navy-300" />
        </div>
        <h1 className="text-2xl font-bold text-navy">Shop Unlocks After Approval</h1>
        <p className="mt-2 max-w-md text-sm text-graphite-500">
          {reason === "no_subscription"
            ? "Subscribe to a VitalPath plan to access our curated product shop."
            : "Your treatment plan needs to be approved by a provider before you can add products."}
        </p>
        <Link href={reason === "no_subscription" ? "/pricing" : "/dashboard/treatment"}>
          <Button className="mt-6 gap-2">
            {reason === "no_subscription" ? "View Plans" : "Check Treatment Status"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const isActive = (slug: string) => activeProductSlugs.includes(slug) || purchased.includes(slug);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-teal" />
          Your Health Shop
        </h1>
        <p className="mt-1 text-sm text-graphite-400">
          Add products to your plan with one click. Charged on your next billing cycle.
        </p>
      </div>

      {/* Active Add-ons */}
      {activeItems.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-graphite-400 uppercase tracking-wider mb-3">
            Your Active Add-ons
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item) => (
              <div key={item.slug} className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{item.name}</p>
                    <p className="text-xs text-teal">{formatPrice(item.price)}/mo</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">Active</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-graphite-400 uppercase tracking-wider mb-3">
            <Sparkles className="inline h-4 w-4 text-gold mr-1" />
            Recommended For You
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProducts.slice(0, 2).map((product) => {
              const Icon = iconMap[product.iconName || ""] || Pill;
              return (
                <Card key={product.id} className="border-gold-200 bg-gradient-to-br from-gold-50/30 to-linen overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50">
                        <Icon className="h-6 w-6 text-gold-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-navy">{product.name}</h3>
                          {product.badge && <Badge variant="gold" className="text-[10px]">{product.badge}</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-graphite-500">
                          {product.marketplaceDesc || product.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-navy">
                            {formatPrice(product.priceMonthly)}<span className="text-xs font-normal text-graphite-400">/mo</span>
                          </span>
                          <Button
                            size="sm"
                            variant="gold"
                            className="gap-1.5"
                            disabled={!!purchasingSlug}
                            onClick={() => setConfirmSlug(product.slug)}
                          >
                            Add to Plan <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              filter === cat
                ? "bg-navy text-white"
                : "bg-navy-50 text-graphite-500 hover:bg-navy-100"
            )}
          >
            {cat === "all" ? "All Products" : cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const Icon = iconMap[product.iconName || ""] || Pill;
          const active = isActive(product.slug);
          const features = Array.isArray(product.features) ? product.features as string[] : [];

          return (
            <Card
              key={product.id}
              className={cn(
                "flex flex-col transition-all duration-200",
                active && "border-teal-100 bg-teal-50/10",
                product.isFeatured && !active && "ring-1 ring-gold-200"
              )}
            >
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <Icon className="h-5 w-5 text-teal" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {product.badge && <Badge variant="gold" className="text-[10px]">{product.badge}</Badge>}
                    <Badge variant="secondary" className="text-[10px]">
                      {categoryLabels[product.category] || product.category}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-navy">{product.name}</h3>
                <p className="mt-1 text-xs text-graphite-500 flex-1">
                  {product.marketplaceDesc || product.description}
                </p>

                {features.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-graphite-500">
                        <Check className="h-3 w-3 shrink-0 text-teal" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-navy-100/40 pt-3">
                  <span className="text-base font-bold text-navy">
                    {formatPrice(product.priceMonthly)}<span className="text-xs font-normal text-graphite-400">/mo</span>
                  </span>

                  {active ? (
                    <Badge variant="success" className="gap-1">
                      <Check className="h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={!!purchasingSlug || !product.stripePriceIdMonthly}
                      onClick={() => setConfirmSlug(product.slug)}
                    >
                      {purchasingSlug === product.slug ? "Adding..." : "Add to Plan"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center text-sm text-graphite-400">
          No products in this category yet.
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmSlug && (() => {
        const product = products.find((p) => p.slug === confirmSlug);
        if (!product) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setConfirmSlug(null)} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-premium-xl">
              <button onClick={() => setConfirmSlug(null)} className="absolute right-3 top-3 p-1 text-graphite-400 hover:text-navy">
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-lg font-bold text-navy">Add to your plan?</h3>
              <p className="mt-2 text-sm text-graphite-500">
                <strong>{product.name}</strong> will be added to your subscription for{" "}
                <strong>{formatPrice(product.priceMonthly)}/mo</strong>.
              </p>
              <p className="mt-2 text-xs text-graphite-400">
                You&apos;ll be charged a prorated amount for the remainder of this billing period.
                Cancel anytime from your settings.
              </p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmSlug(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1.5"
                  disabled={!!purchasingSlug}
                  onClick={() => handlePurchase(product)}
                >
                  {purchasingSlug === product.slug ? "Adding..." : <>Confirm <Check className="h-3.5 w-3.5" /></>}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
