"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, ChefHat, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "blog" | "recipe" | "faq" | "page";
  title: string;
  href: string;
  subtitle?: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ blogs: SearchResult[]; recipes: SearchResult[]; faqs: SearchResult[]; pages: SearchResult[] }>({ blogs: [], recipes: [], faqs: [], pages: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cmd+K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query || query.length < 2) { setResults({ blogs: [], recipes: [], faqs: [], pages: [] }); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || { blogs: [], recipes: [], faqs: [], pages: [] });
      } catch { /* ignore */ }
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const allResults = [...results.pages, ...results.blogs, ...results.recipes, ...results.faqs];
  const hasResults = allResults.length > 0;

  const typeIcon = (type: string) => {
    switch (type) {
      case "blog": return <FileText className="h-4 w-4 text-teal" />;
      case "recipe": return <ChefHat className="h-4 w-4 text-gold-600" />;
      case "faq": return <HelpCircle className="h-4 w-4 text-atlantic" />;
      default: return <ArrowRight className="h-4 w-4 text-navy-400" />;
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-xl border border-navy-200 bg-navy-50/30 px-3 py-1.5 text-xs text-graphite-400 transition-colors hover:bg-navy-50 md:flex"
        aria-label="Search (Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-graphite-300 border border-navy-200">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-lg rounded-2xl border border-navy-100/60 bg-white shadow-premium-xl mx-4">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-navy-100/40 px-4 py-3">
          <Search className="h-5 w-5 text-graphite-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, blog, recipes, FAQ..."
            className="flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-graphite-300"
            autoComplete="off"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-graphite-400 hover:text-navy">
              <X className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setOpen(false)} className="rounded-lg bg-navy-50 px-2 py-1 text-[10px] font-medium text-graphite-400">
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal border-t-transparent" />
            </div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <div className="py-8 text-center">
              <p className="text-sm text-graphite-400">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="p-2">
              {allResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => navigate(result.href)}
                  className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-navy-50"
                >
                  {typeIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-xs text-graphite-400 truncate">{result.subtitle}</p>
                    )}
                  </div>
                  <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[9px] text-graphite-300 capitalize shrink-0">
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-4 text-center text-xs text-graphite-300">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
