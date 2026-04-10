"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { cn, formatPriceDecimal } from "@/lib/utils";
import {
  Image,
  Mail,
  Share2,
  Globe,
  FileText,
  Package,
  Download,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Star,
  BarChart3,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface MarketingAsset {
  id: string;
  name: string;
  type: string;
  fileUrl: string | null;
  content: string | null;
  thumbnail: string | null;
  category: string | null;
  isActive: boolean;
  downloads: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetAnalytics {
  totalAssets: number;
  activeAssets: number;
  totalDownloads: number;
  byType: Record<string, number>;
  mostDownloaded: { name: string; downloads: number } | null;
}

interface Props {
  initialAssets: MarketingAsset[];
  initialTotal: number;
  analytics: AssetAnalytics;
}

const ASSET_TYPES = [
  { value: "ALL", label: "All" },
  { value: "BANNER", label: "Banners" },
  { value: "EMAIL_TEMPLATE", label: "Email Templates" },
  { value: "SOCIAL_POST", label: "Social Posts" },
  { value: "LANDING_PAGE", label: "Landing Pages" },
  { value: "DOCUMENT", label: "Documents" },
] as const;

const typeIcons: Record<string, typeof Image> = {
  BANNER: Image,
  EMAIL_TEMPLATE: Mail,
  SOCIAL_POST: Share2,
  LANDING_PAGE: Globe,
  DOCUMENT: FileText,
};

const typeBadgeColors: Record<string, string> = {
  BANNER: "bg-blue-50 text-blue-700 border-blue-200",
  EMAIL_TEMPLATE: "bg-purple-50 text-purple-700 border-purple-200",
  SOCIAL_POST: "bg-pink-50 text-pink-700 border-pink-200",
  LANDING_PAGE: "bg-teal-50 text-teal-700 border-teal-200",
  DOCUMENT: "bg-amber-50 text-amber-700 border-amber-200",
};

// ─── Component ──────────────────────────────────────────────

export function MarketingAssetsClient({
  initialAssets,
  initialTotal,
  analytics,
}: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [total, setTotal] = useState(initialTotal);
  const [activeTab, setActiveTab] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MarketingAsset | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("BANNER");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const resetForm = useCallback(() => {
    setFormName("");
    setFormType("BANNER");
    setFormFileUrl("");
    setFormContent("");
    setFormThumbnail("");
    setFormCategory("");
    setFormIsActive(true);
    setEditingAsset(null);
    setShowForm(false);
  }, []);

  const openEditForm = useCallback((asset: MarketingAsset) => {
    setEditingAsset(asset);
    setFormName(asset.name);
    setFormType(asset.type);
    setFormFileUrl(asset.fileUrl || "");
    setFormContent(asset.content || "");
    setFormThumbnail(asset.thumbnail || "");
    setFormCategory(asset.category || "");
    setFormIsActive(asset.isActive);
    setShowForm(true);
  }, []);

  const fetchAssets = useCallback(
    async (type?: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (type && type !== "ALL") params.set("type", type);
        const res = await fetch(`/api/admin/marketing-assets?${params}`);
        const data = await res.json();
        if (data.assets) {
          setAssets(data.assets);
          setTotal(data.total);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleTabChange = useCallback(
    (type: string) => {
      setActiveTab(type);
      fetchAssets(type);
    },
    [fetchAssets]
  );

  const handleSubmit = useCallback(async () => {
    if (!formName.trim() || !formType) return;
    setLoading(true);

    try {
      const payload = {
        ...(editingAsset ? { id: editingAsset.id } : {}),
        name: formName,
        type: formType,
        fileUrl: formFileUrl || null,
        content: formContent || null,
        thumbnail: formThumbnail || null,
        category: formCategory || null,
        isActive: formIsActive,
      };

      const res = await fetch("/api/admin/marketing-assets", {
        method: editingAsset ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchAssets(activeTab);
      }
    } finally {
      setLoading(false);
    }
  }, [
    formName,
    formType,
    formFileUrl,
    formContent,
    formThumbnail,
    formCategory,
    formIsActive,
    editingAsset,
    resetForm,
    fetchAssets,
    activeTab,
  ]);

  const handleToggleActive = useCallback(
    async (asset: MarketingAsset) => {
      const res = await fetch("/api/admin/marketing-assets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: asset.id, isActive: !asset.isActive }),
      });
      if (res.ok) fetchAssets(activeTab);
    },
    [fetchAssets, activeTab]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this marketing asset?")) return;
      const res = await fetch("/api/admin/marketing-assets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAssets(activeTab);
    },
    [fetchAssets, activeTab]
  );

  const handleDownload = useCallback(
    async (asset: MarketingAsset) => {
      await fetch("/api/admin/marketing-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "increment_download", id: asset.id }),
      });

      if (asset.fileUrl) {
        window.open(asset.fileUrl, "_blank");
      }

      // Update local state
      setAssets((prev) =>
        prev.map((a) =>
          a.id === asset.id ? { ...a, downloads: a.downloads + 1 } : a
        )
      );
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Marketing Assets</h1>
          <p className="text-sm text-graphite-400">
            Manage reseller marketing materials and downloadable assets
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Upload Asset
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Assets"
          value={String(analytics.totalAssets)}
          icon={Package}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Active Assets"
          value={String(analytics.activeAssets)}
          icon={Eye}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Total Downloads"
          value={String(analytics.totalDownloads)}
          icon={Download}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Most Popular"
          value={analytics.mostDownloaded?.name || "N/A"}
          icon={Star}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {ASSET_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === t.value
                ? "bg-navy text-white"
                : "bg-white text-graphite-500 border border-navy-100 hover:bg-linen/50"
            )}
          >
            {t.label}
            {t.value !== "ALL" && analytics.byType[t.value] != null && (
              <span className="ml-1.5 text-xs opacity-70">
                ({analytics.byType[t.value]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upload/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-navy">
                {editingAsset ? "Edit Asset" : "Upload New Asset"}
              </CardTitle>
              <button
                onClick={resetForm}
                className="rounded-lg p-1 hover:bg-navy-50 transition-colors"
              >
                <X className="h-5 w-5 text-graphite-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Spring Campaign Banner"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Type *
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                >
                  {ASSET_TYPES.filter((t) => t.value !== "ALL").map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  File URL
                </label>
                <input
                  type="url"
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  placeholder="https://cdn.example.com/asset.png"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="https://cdn.example.com/thumb.png"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Seasonal, Product, Educational"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-navy-200 text-teal accent-teal"
                  />
                  <span className="text-sm font-medium text-graphite-500">
                    Active (visible to resellers)
                  </span>
                </label>
              </div>
              {(formType === "EMAIL_TEMPLATE" ||
                formType === "SOCIAL_POST") && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-graphite-500 mb-1">
                    Content (text/HTML)
                  </label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    rows={5}
                    placeholder="Enter email template HTML or social post copy..."
                    className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm font-mono focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="rounded-lg border border-navy-100 px-4 py-2 text-sm font-medium text-graphite-500 hover:bg-linen/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formName.trim()}
                className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? "Saving..."
                  : editingAsset
                    ? "Update Asset"
                    : "Create Asset"}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Grid */}
      {loading && assets.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 rounded-lg bg-navy-50 mb-3" />
                <div className="h-4 w-2/3 rounded bg-navy-50 mb-2" />
                <div className="h-3 w-1/3 rounded bg-navy-50" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-graphite-300 mb-3" />
            <p className="text-graphite-400 font-medium">
              No marketing assets found
            </p>
            <p className="text-sm text-graphite-300 mt-1">
              Upload your first asset to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => {
            const TypeIcon = typeIcons[asset.type] || FileText;
            return (
              <Card
                key={asset.id}
                className={cn(
                  "group relative overflow-hidden transition-shadow hover:shadow-md",
                  !asset.isActive && "opacity-60"
                )}
              >
                <CardContent className="p-4">
                  {/* Thumbnail / Icon area */}
                  <div className="relative mb-3 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-navy-50 to-linen/50 overflow-hidden">
                    {asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <TypeIcon className="h-12 w-12 text-graphite-300" />
                    )}
                    {!asset.isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <Badge className="bg-gray-100 text-gray-500">
                          Inactive
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Name + Type */}
                  <h3 className="font-semibold text-navy text-sm truncate">
                    {asset.name}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        typeBadgeColors[asset.type] ||
                          "bg-gray-100 text-gray-600"
                      )}
                    >
                      {asset.type.replace("_", " ")}
                    </Badge>
                    {asset.category && (
                      <span className="text-[10px] text-graphite-300 truncate">
                        {asset.category}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-3 flex items-center justify-between text-xs text-graphite-400">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {asset.downloads} downloads
                    </span>
                    <span>
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-1.5 border-t border-navy-100/40 pt-3">
                    <button
                      onClick={() => handleDownload(asset)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-teal/10 px-2 py-1.5 text-xs font-medium text-teal hover:bg-teal/20 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <button
                      onClick={() => handleToggleActive(asset)}
                      className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 transition-colors"
                      title={
                        asset.isActive ? "Deactivate" : "Activate"
                      }
                    >
                      {asset.isActive ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditForm(asset)}
                      className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Total count */}
      {total > 0 && (
        <p className="text-center text-xs text-graphite-300">
          Showing {assets.length} of {total} assets
        </p>
      )}
    </div>
  );
}
