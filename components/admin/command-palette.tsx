"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Package,
  FileText,
  ChefHat,
  ShieldCheck,
  Tag,
  BarChart3,
  Settings,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  type: string;
  id: string;
  label: string;
  sublabel?: string;
  href: string;
}

const quickActions = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Revenue & MRR", href: "/admin/revenue", icon: DollarSign },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Products & Pricing", href: "/admin/products", icon: Package },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: DollarSign },
  { label: "Analytics & Funnel", href: "/admin/analytics", icon: BarChart3 },
  { label: "Blog CMS", href: "/admin/blog", icon: FileText },
  { label: "Recipes & Meals", href: "/admin/recipes", icon: ChefHat },
  { label: "Campaigns", href: "/admin/campaigns", icon: ArrowRight },
  { label: "Reports & Exports", href: "/admin/reports", icon: BarChart3 },
  { label: "Experiments", href: "/admin/experiments", icon: Package },
  { label: "Automations", href: "/admin/automations", icon: ArrowRight },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Create Coupon", href: "/admin/coupons", icon: Plus },
  { label: "New Blog Post", href: "/admin/blog", icon: Plus },
];

const typeIcons: Record<string, typeof Users> = {
  customer: Users,
  product: Package,
  blog: FileText,
  recipe: ChefHat,
  claim: ShieldCheck,
  coupon: Tag,
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 200);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setSelectedIndex(0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const displayItems = query.trim()
    ? results
    : quickActions.map((a) => ({ type: "action", id: a.href, label: a.label, href: a.href }));

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, displayItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = displayItems[selectedIndex];
        if (item) navigate(item.href);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, displayItems, selectedIndex, navigate, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2">
        <div className="mx-4 overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-navy-100/40 px-4">
            <Search className="h-4.5 w-4.5 shrink-0 text-graphite-300" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers, products, pages..."
              className="h-12 flex-1 bg-transparent text-sm text-navy placeholder:text-graphite-300 outline-none"
            />
            <kbd className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-medium text-graphite-400">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto p-2">
            {loading && (
              <div className="py-6 text-center text-sm text-graphite-300">Searching...</div>
            )}
            {!loading && query.trim() && results.length === 0 && (
              <div className="py-6 text-center text-sm text-graphite-300">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
            {!loading &&
              displayItems.map((item, i) => {
                const Icon = typeIcons[item.type] || ArrowRight;
                const isQuickAction = item.type === "action";
                const qaMatch = isQuickAction
                  ? quickActions.find((a) => a.href === item.href)
                  : null;
                const DisplayIcon = qaMatch?.icon || Icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      selectedIndex === i ? "bg-navy-50" : "hover:bg-linen/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        isQuickAction ? "bg-navy-50" : "bg-teal-50"
                      )}
                    >
                      <DisplayIcon
                        className={cn(
                          "h-4 w-4",
                          isQuickAction ? "text-navy-400" : "text-teal"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{item.label}</p>
                      {"sublabel" in item && (item as SearchResult).sublabel && (
                        <p className="text-xs text-graphite-400 truncate">{(item as SearchResult).sublabel}</p>
                      )}
                    </div>
                    {!isQuickAction && (
                      <span className="shrink-0 rounded bg-navy-50 px-1.5 py-0.5 text-[10px] text-graphite-400 capitalize">
                        {item.type}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-navy-100/40 px-4 py-2">
            <div className="flex items-center gap-3 text-[10px] text-graphite-300">
              <span><kbd className="rounded bg-navy-50 px-1 py-0.5 font-medium">Up/Down</kbd> navigate</span>
              <span><kbd className="rounded bg-navy-50 px-1 py-0.5 font-medium">Enter</kbd> select</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
