"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Pencil,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────

interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  customDomain: string | null;
  maxMembers: number | null;
  isActive: boolean;
  billingType: string;
  billingRateCents: number | null;
  subsidyPct: number | null;
  totalMembers: number;
  totalRevenue: number;
  createdAt: string;
}

interface Metrics {
  totalOrgs: number;
  activeOrgs: number;
  totalMembers: number;
  totalRevenue: number;
  avgMembersPerOrg: number;
  revenueByType: Record<string, number>;
  membersByType: Record<string, number>;
}

interface Props {
  initialOrganizations: Organization[];
  initialTotal: number;
  metrics: Metrics;
}

const ORG_TYPES = ["EMPLOYER", "PHARMACY_CHAIN", "HEALTH_SYSTEM", "PARTNER"];
const BILLING_TYPES = ["PER_MEMBER", "FLAT_RATE", "SUBSIDIZED"];

const typeColors: Record<string, string> = {
  EMPLOYER: "bg-blue-100 text-blue-800",
  PHARMACY_CHAIN: "bg-emerald-100 text-emerald-800",
  HEALTH_SYSTEM: "bg-purple-100 text-purple-800",
  PARTNER: "bg-amber-100 text-amber-800",
};

const billingColors: Record<string, string> = {
  PER_MEMBER: "bg-teal-100 text-teal-800",
  FLAT_RATE: "bg-navy-100 text-navy-800",
  SUBSIDIZED: "bg-gold-100 text-gold-800",
};

// ─── Component ─────────────────────────────────────────────

export function OrganizationsClient({ initialOrganizations, initialTotal, metrics }: Props) {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [total, setTotal] = useState(initialTotal);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "EMPLOYER",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    billingType: "PER_MEMBER",
    billingRateCents: 0,
    subsidyPct: 0,
    maxMembers: 0,
    logoUrl: "",
    brandColor: "#0d9488",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "EMPLOYER",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      billingType: "PER_MEMBER",
      billingRateCents: 0,
      subsidyPct: 0,
      maxMembers: 0,
      logoUrl: "",
      brandColor: "#0d9488",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch("/api/admin/organizations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        if (res.ok) {
          await refreshData();
          resetForm();
        }
      } else {
        const res = await fetch("/api/admin/organizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await refreshData();
          resetForm();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (org: Organization) => {
    setFormData({
      name: org.name,
      slug: org.slug,
      type: org.type,
      contactName: org.contactName || "",
      contactEmail: org.contactEmail || "",
      contactPhone: org.contactPhone || "",
      billingType: org.billingType,
      billingRateCents: org.billingRateCents || 0,
      subsidyPct: org.subsidyPct || 0,
      maxMembers: org.maxMembers || 0,
      logoUrl: org.logoUrl || "",
      brandColor: org.brandColor || "#0d9488",
    });
    setEditingId(org.id);
    setShowForm(true);
  };

  const handleToggleActive = async (org: Organization) => {
    await fetch("/api/admin/organizations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: org.id, isActive: !org.isActive }),
    });
    await refreshData();
  };

  const refreshData = async () => {
    const params = new URLSearchParams();
    if (filterType !== "all") params.set("type", filterType);
    const res = await fetch(`/api/admin/organizations?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrganizations(data.organizations);
      setTotal(data.total);
    }
  };

  const handleFilterChange = async (type: string) => {
    setFilterType(type);
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    const res = await fetch(`/api/admin/organizations?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrganizations(data.organizations);
      setTotal(data.total);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Organizations</h2>
          <p className="text-sm text-graphite-400">
            Manage B2B partners, employers, and health systems
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-teal text-white hover:bg-teal-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Building2 className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Total Orgs</p>
              <p className="text-xl font-bold text-navy">{metrics.totalOrgs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-graphite-400">Active Members</p>
              <p className="text-xl font-bold text-navy">{metrics.totalMembers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Revenue from B2B</p>
              <p className="text-xl font-bold text-navy">{formatPrice(metrics.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-5 w-5 text-gold-600" />
            <div>
              <p className="text-xs text-graphite-400">Avg Members/Org</p>
              <p className="text-xl font-bold text-navy">{metrics.avgMembersPerOrg}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">
              {editingId ? "Edit Organization" : "New Organization"}
            </CardTitle>
            <button onClick={resetForm} className="text-graphite-400 hover:text-navy">
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  placeholder="acme-corp"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-xl border border-navy-100/40 bg-white px-3 py-2 text-sm"
                >
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Contact Name</label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Contact Email</label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="john@acme.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Contact Phone</label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Billing Type</label>
                <select
                  value={formData.billingType}
                  onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                  className="w-full rounded-xl border border-navy-100/40 bg-white px-3 py-2 text-sm"
                >
                  {BILLING_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Billing Rate (cents)</label>
                <Input
                  type="number"
                  value={formData.billingRateCents}
                  onChange={(e) => setFormData({ ...formData, billingRateCents: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Subsidy %</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.subsidyPct}
                  onChange={(e) => setFormData({ ...formData, subsidyPct: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Max Members</label>
                <Input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Logo URL</label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brandColor}
                    onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                    className="h-9 w-9 cursor-pointer rounded border border-navy-100/40"
                  />
                  <Input
                    value={formData.brandColor}
                    onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSubmit} disabled={loading} className="bg-teal text-white hover:bg-teal-600">
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter + Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Organizations ({total})</CardTitle>
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-xl border border-navy-100/40 bg-white px-3 py-1.5 text-xs"
          >
            <option value="all">All Types</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          {organizations.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">No organizations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/30 text-left text-xs text-graphite-400">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Type</th>
                    <th className="pb-2 pr-4 font-medium">Members</th>
                    <th className="pb-2 pr-4 font-medium">Revenue</th>
                    <th className="pb-2 pr-4 font-medium">Billing</th>
                    <th className="pb-2 pr-4 font-medium">Active</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/20">
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-navy-50/30">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-navy">{org.name}</p>
                          <p className="text-[10px] text-graphite-400">{org.slug}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={typeColors[org.type] || "bg-gray-100 text-gray-800"}>
                          {org.type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-navy">{org.totalMembers}</td>
                      <td className="py-3 pr-4 font-medium text-navy">{formatPrice(org.totalRevenue)}</td>
                      <td className="py-3 pr-4">
                        <Badge className={billingColors[org.billingType] || "bg-gray-100"}>
                          {org.billingType.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => handleToggleActive(org)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            org.isActive ? "bg-teal" : "bg-graphite-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              org.isActive ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleEdit(org)}
                          className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
