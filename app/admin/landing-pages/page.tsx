"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Users,
  Heart,
  Shield,
  Clock,
  Dumbbell,
  Zap,
  FlaskConical,
  Flame,
  DollarSign,
  Baby,
  Sparkles,
  Search,
  Palette,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeSelectorModal } from "./theme-selector-modal";
import { LP_THEMES, DEFAULT_THEME_ID, type ThemeId } from "@/lib/lp-themes";
import { getLpThemeConfig, type LpThemeAssignment } from "@/lib/lp-theme-config";

type Category = "All" | "General" | "Demographics" | "Conditions" | "Medications";

const landingPages = [
  // ─── General ───
  {
    name: "GLP-1 Weight Loss",
    path: "/lp/glp1",
    description: "Generic GLP-1 landing page. Conversion-focused with price anchoring, testimonials, FAQ, and strong CTA.",
    audience: "General",
    audienceIcon: Globe,
    audienceColor: "bg-navy-100 text-navy border-navy-200",
    sections: 8,
    category: "General" as Category,
  },
  {
    name: "Medical Weight Management",
    path: "/lp/medical-weight-management",
    description: "Feature-rich LP with provider credentials, FAQ accordion, how-it-works flow, and detailed program features. Noindex.",
    audience: "General",
    audienceIcon: Globe,
    audienceColor: "bg-navy-100 text-navy border-navy-200",
    sections: 8,
    category: "General" as Category,
  },
  {
    name: "Affordable GLP-1",
    path: "/lp/affordable",
    description: "Price-focused LP targeting cost-conscious searchers. Price comparison, value breakdown, no-insurance messaging.",
    audience: "Price-Conscious",
    audienceIcon: DollarSign,
    audienceColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    sections: 7,
    category: "General" as Category,
  },
  {
    name: "Weight Loss Without Surgery",
    path: "/lp/no-surgery",
    description: "Bariatric surgery alternative LP. Surgery vs. GLP-1 comparison, non-invasive messaging, post-surgery regain support.",
    audience: "Surgery Alternative",
    audienceIcon: Shield,
    audienceColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    sections: 7,
    category: "General" as Category,
  },
  // ─── Demographics ───
  {
    name: "Women's Weight Loss",
    path: "/lp/women",
    description: "Women-specific GLP-1 page targeting PCOS, perimenopause, thyroid conditions, and hormonal weight gain.",
    audience: "Women",
    audienceIcon: Heart,
    audienceColor: "bg-pink-100 text-pink-700 border-pink-200",
    sections: 8,
    category: "Demographics" as Category,
  },
  {
    name: "Women's Weight Loss (Premium)",
    path: "/lp/women-weight-loss",
    description: "Premium 15-section women's LP. PCOS/perimenopause/thyroid protocols, provider spotlight, comparison table, FAQ, pricing.",
    audience: "Women",
    audienceIcon: Heart,
    audienceColor: "bg-pink-100 text-pink-700 border-pink-200",
    sections: 15,
    category: "Demographics" as Category,
  },
  {
    name: "Men's Weight Loss",
    path: "/lp/men",
    description: "Premium men-specific LP with 16 sections. Visceral fat, testosterone, heart health, muscle preservation, sticky CTA.",
    audience: "Men",
    audienceIcon: Dumbbell,
    audienceColor: "bg-teal-100 text-teal-700 border-teal-200",
    sections: 16,
    category: "Demographics" as Category,
  },
  {
    name: "Adults Over 40",
    path: "/lp/over40",
    description: "Age-targeted LP for adults 40+. Metabolic slowdown, joint health, muscle preservation, and FAQ section.",
    audience: "Adults 40+",
    audienceIcon: Clock,
    audienceColor: "bg-amber-100 text-amber-700 border-amber-200",
    sections: 7,
    category: "Demographics" as Category,
  },
  {
    name: "Adults Over 50",
    path: "/lp/over50",
    description: "Age-targeted LP for adults 50+. Medication interactions, joint safety, comprehensive health screening emphasis.",
    audience: "Adults 50+",
    audienceIcon: Shield,
    audienceColor: "bg-amber-100 text-amber-700 border-amber-200",
    sections: 7,
    category: "Demographics" as Category,
  },
  {
    name: "Postpartum Weight Loss",
    path: "/lp/postpartum",
    description: "New mothers LP with prominent breastfeeding safety callouts. Hormonal recovery, safety-first positioning.",
    audience: "New Mothers",
    audienceIcon: Baby,
    audienceColor: "bg-rose-100 text-rose-700 border-rose-200",
    sections: 7,
    category: "Demographics" as Category,
  },
  // ─── Conditions ───
  {
    name: "Menopause Weight Loss",
    path: "/lp/menopause",
    description: "Menopause-specific LP. Estrogen decline, visceral fat targeting, HRT compatibility, provider spotlight.",
    audience: "Menopause",
    audienceIcon: Sparkles,
    audienceColor: "bg-purple-100 text-purple-700 border-purple-200",
    sections: 7,
    category: "Conditions" as Category,
  },
  {
    name: "PCOS Weight Loss",
    path: "/lp/pcos",
    description: "PCOS-specific LP. Insulin resistance, androgen management, fertility disclaimers, beyond-the-scale benefits.",
    audience: "PCOS",
    audienceIcon: Heart,
    audienceColor: "bg-pink-100 text-pink-700 border-pink-200",
    sections: 7,
    category: "Conditions" as Category,
  },
  {
    name: "Belly Fat / Visceral Fat",
    path: "/lp/belly-fat",
    description: "Universal pain point LP. Visceral vs subcutaneous fat, hormonal drivers, health risk education.",
    audience: "Belly Fat",
    audienceIcon: Flame,
    audienceColor: "bg-orange-100 text-orange-700 border-orange-200",
    sections: 7,
    category: "Conditions" as Category,
  },
  // ─── Medications ───
  {
    name: "Ozempic/Wegovy Alternative",
    path: "/lp/ozempic-alternative",
    description: "Highest-volume keyword LP. Same active ingredient messaging, side-by-side brand comparison, 79% savings.",
    audience: "Brand Seekers",
    audienceIcon: Zap,
    audienceColor: "bg-teal-100 text-teal-700 border-teal-200",
    sections: 7,
    category: "Medications" as Category,
  },
  {
    name: "Semaglutide Weight Loss",
    path: "/lp/semaglutide",
    description: "Medication-specific LP for semaglutide. Mechanism of action, treatment timeline, dosing education.",
    audience: "Semaglutide",
    audienceIcon: FlaskConical,
    audienceColor: "bg-teal-100 text-teal-700 border-teal-200",
    sections: 7,
    category: "Medications" as Category,
  },
  {
    name: "Tirzepatide Weight Loss",
    path: "/lp/tirzepatide",
    description: "Dual GLP-1/GIP medication LP. Tirzepatide vs semaglutide comparison, next-gen positioning. $379/mo pricing.",
    audience: "Tirzepatide",
    audienceIcon: Zap,
    audienceColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    sections: 7,
    category: "Medications" as Category,
  },
];

const categories: Category[] = ["All", "General", "Demographics", "Conditions", "Medications"];

export default function AdminLandingPagesPage() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [themeModal, setThemeModal] = useState<{ name: string; path: string } | null>(null);
  const [assignments, setAssignments] = useState<Record<string, LpThemeAssignment>>({});

  // Load theme assignments from localStorage
  useEffect(() => {
    const config = getLpThemeConfig();
    setAssignments(config.assignments);
  }, [themeModal]); // Refresh when modal closes

  const copyUrl = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    });
  };

  const filteredPages = landingPages.filter((lp) => {
    const matchesCategory = activeCategory === "All" || lp.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      lp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.audience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              Landing Pages
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and preview all {landingPages.length} marketing landing pages
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-card-foreground">{landingPages.length}</p>
            <p className="text-xs text-muted-foreground">Total Pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{landingPages.length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">{landingPages.filter(l => l.category === "Demographics").length}</p>
            <p className="text-xs text-muted-foreground">Demographic</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{landingPages.filter(l => l.category === "Conditions").length}</p>
            <p className="text-xs text-muted-foreground">Condition</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{landingPages.filter(l => l.category === "Medications").length}</p>
            <p className="text-xs text-muted-foreground">Medication</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat} {cat !== "All" && `(${landingPages.filter(l => l.category === cat).length})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-60"
          />
        </div>
      </div>

      {/* Landing page cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map((lp) => (
          <Card
            key={lp.path}
            className="flex flex-col transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{lp.name}</CardTitle>
                <Badge className={`shrink-0 gap-1 text-[10px] ${lp.audienceColor}`}>
                  <lp.audienceIcon className="h-3 w-3" />
                  {lp.audience}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {lp.sections} sections
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {lp.category}
                </Badge>
                {(() => {
                  const slug = lp.path.replace("/lp/", "");
                  const a = assignments[slug];
                  return (
                    <>
                      {a && a.themeId !== DEFAULT_THEME_ID && LP_THEMES[a.themeId] && (
                        <Badge
                          className="text-[9px] gap-1"
                          style={{
                            backgroundColor: LP_THEMES[a.themeId].preview.secondary + "18",
                            color: LP_THEMES[a.themeId].preview.secondary,
                            borderWidth: "1px",
                            borderColor: LP_THEMES[a.themeId].preview.secondary + "30",
                          }}
                        >
                          <Palette className="h-2.5 w-2.5" />
                          {LP_THEMES[a.themeId].name}
                        </Badge>
                      )}
                      {a?.abTest?.enabled && (
                        <Badge
                          variant="outline"
                          className="text-[9px] gap-1 border-purple-200 text-purple-600"
                        >
                          <FlaskConical className="h-2.5 w-2.5" /> A/B
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 pt-0">
              <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
                {lp.description}
              </p>
              <div className="rounded-lg bg-muted/50 px-3 py-2">
                <code className="text-xs text-muted-foreground">{lp.path}</code>
              </div>
              <div className="flex gap-2">
                <Link
                  href={lp.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Page
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => copyUrl(lp.path)}
                >
                  {copiedPath === lp.path ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 mt-2"
                onClick={() =>
                  setThemeModal({ name: lp.name, path: lp.path })
                }
              >
                <Palette className="h-3.5 w-3.5" />
                Theme &amp; A/B Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No landing pages match your search.
        </div>
      )}

      {/* Help text */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-card-foreground">
              Using Landing Pages
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Landing pages are standalone conversion pages designed for paid
              ads, email campaigns, and targeted traffic. Each page has a
              specific audience and is optimized for a single CTA. Use the
              &quot;Theme &amp; A/B Test&quot; button to customize colors and
              run split tests. Preview themes with the ?theme= URL parameter.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Selector Modal */}
      {themeModal && (
        <ThemeSelectorModal
          lpName={themeModal.name}
          lpPath={themeModal.path}
          onClose={() => setThemeModal(null)}
        />
      )}
    </div>
  );
}
