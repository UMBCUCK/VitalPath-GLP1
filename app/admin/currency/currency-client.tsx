"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import {
  Globe2,
  Plus,
  Calculator,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface Currency {
  id: string;
  currencyCode: string;
  symbol: string;
  exchangeRate: number;
  isActive: boolean;
  updatedAt: string;
}

interface TaxRule {
  id: string;
  jurisdiction: string;
  taxRate: number;
  taxName: string;
  appliesTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  currencies: Currency[];
  taxRules: TaxRule[];
}

const appliesToBadge: Record<string, string> = {
  ALL: "bg-blue-50 text-blue-700 border-blue-200",
  MEMBERSHIP: "bg-purple-50 text-purple-700 border-purple-200",
  ADDON: "bg-amber-50 text-amber-700 border-amber-200",
  SUPPLEMENT: "bg-teal-50 text-teal-700 border-teal-200",
};

// ─── Component ──────────────────────────────────────────────

export function CurrencyClient({ currencies: initialCurrencies, taxRules: initialTaxRules }: Props) {
  const router = useRouter();
  const [currencies] = useState(initialCurrencies);
  const [taxRules] = useState(initialTaxRules);

  // Currency editing
  const [editingCurrencyId, setEditingCurrencyId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState("");

  // New currency form
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [newCurrCode, setNewCurrCode] = useState("");
  const [newCurrSymbol, setNewCurrSymbol] = useState("");
  const [newCurrRate, setNewCurrRate] = useState("1.0");

  // New tax rule form
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [taxJurisdiction, setTaxJurisdiction] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [taxName, setTaxName] = useState("");
  const [taxAppliesTo, setTaxAppliesTo] = useState("ALL");

  // Tax calculator
  const [calcAmount, setCalcAmount] = useState("");
  const [calcJurisdiction, setCalcJurisdiction] = useState("");
  const [calcResult, setCalcResult] = useState<{ taxAmount: number; taxRate: number; taxName: string } | null>(null);

  // Edit tax rule
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);
  const [editTaxRate, setEditTaxRate] = useState("");
  const [editTaxName, setEditTaxName] = useState("");

  // ─── Handlers ──────────────────────────────────────────────

  const handleUpdateCurrency = async (id: string, data: Record<string, unknown>) => {
    await fetch("/api/admin/currency", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "currency", id, ...data }),
    });
    router.refresh();
  };

  const handleSaveRate = async (id: string) => {
    await handleUpdateCurrency(id, { exchangeRate: parseFloat(editRate) });
    setEditingCurrencyId(null);
  };

  const handleToggleCurrency = async (id: string, isActive: boolean) => {
    await handleUpdateCurrency(id, { isActive: !isActive });
  };

  const handleCreateCurrency = async () => {
    await fetch("/api/admin/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "currency",
        currencyCode: newCurrCode,
        symbol: newCurrSymbol,
        exchangeRate: parseFloat(newCurrRate),
        isActive: true,
      }),
    });
    setShowCurrencyForm(false);
    setNewCurrCode("");
    setNewCurrSymbol("");
    setNewCurrRate("1.0");
    router.refresh();
  };

  const handleCreateTaxRule = async () => {
    await fetch("/api/admin/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "tax-rule",
        jurisdiction: taxJurisdiction,
        taxRate: parseFloat(taxRate) / 100,
        taxName: taxName,
        appliesTo: taxAppliesTo,
        isActive: true,
      }),
    });
    setShowTaxForm(false);
    setTaxJurisdiction("");
    setTaxRate("");
    setTaxName("");
    setTaxAppliesTo("ALL");
    router.refresh();
  };

  const handleUpdateTaxRule = async (id: string) => {
    await fetch("/api/admin/currency", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "tax-rule",
        id,
        taxRate: parseFloat(editTaxRate) / 100,
        taxName: editTaxName,
      }),
    });
    setEditingTaxId(null);
    router.refresh();
  };

  const handleToggleTaxRule = async (id: string, isActive: boolean) => {
    await fetch("/api/admin/currency", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "tax-rule", id, isActive: !isActive }),
    });
    router.refresh();
  };

  const handleDeleteTaxRule = async (id: string) => {
    await fetch(`/api/admin/currency?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleCalculateTax = async () => {
    const cents = Math.round(parseFloat(calcAmount) * 100);
    const res = await fetch(
      `/api/admin/currency?section=calculate&amount=${cents}&jurisdiction=${calcJurisdiction}&productType=ALL`
    );
    const data = await res.json();
    setCalcResult(data);
  };

  // ─── Tax table columns ─────────────────────────────────────

  const taxColumns: ColumnDef<TaxRule>[] = [
    {
      key: "jurisdiction",
      header: "Jurisdiction",
      render: (row) => (
        <span className="font-semibold text-navy">{row.jurisdiction}</span>
      ),
    },
    {
      key: "taxRate",
      header: "Tax Rate",
      render: (row) =>
        editingTaxId === row.id ? (
          <Input
            type="number"
            step="0.01"
            value={editTaxRate}
            onChange={(e) => setEditTaxRate(e.target.value)}
            className="w-24"
          />
        ) : (
          <span>{(row.taxRate * 100).toFixed(2)}%</span>
        ),
    },
    {
      key: "taxName",
      header: "Tax Name",
      render: (row) =>
        editingTaxId === row.id ? (
          <Input
            value={editTaxName}
            onChange={(e) => setEditTaxName(e.target.value)}
            className="w-32"
          />
        ) : (
          <span>{row.taxName}</span>
        ),
    },
    {
      key: "appliesTo",
      header: "Applies To",
      render: (row) => (
        <Badge
          variant="outline"
          className={appliesToBadge[row.appliesTo] ?? ""}
        >
          {row.appliesTo}
        </Badge>
      ),
    },
    {
      key: "active",
      header: "Active",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleTaxRule(row.id, row.isActive);
          }}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            row.isActive ? "bg-teal" : "bg-graphite-200"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              row.isActive ? "translate-x-4" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          {editingTaxId === row.id ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateTaxRule(row.id);
                }}
              >
                <Check className="h-4 w-4 text-emerald-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTaxId(null);
                }}
              >
                <X className="h-4 w-4 text-graphite-400" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTaxId(row.id);
                  setEditTaxRate(String(row.taxRate * 100));
                  setEditTaxName(row.taxName);
                }}
              >
                <Pencil className="h-4 w-4 text-graphite-400" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTaxRule(row.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Currency & Tax Configuration</h2>
        <p className="text-sm text-graphite-400">
          Manage currencies, exchange rates, and jurisdiction-specific tax rules
        </p>
      </div>

      {/* Currencies section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-5 w-5 text-teal" /> Currencies
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCurrencyForm(!showCurrencyForm)}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Currency
          </Button>
        </CardHeader>
        <CardContent>
          {showCurrencyForm && (
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-navy-100/40 bg-linen/20 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Code</label>
                <Input
                  placeholder="EUR"
                  value={newCurrCode}
                  onChange={(e) => setNewCurrCode(e.target.value)}
                  className="w-24"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Symbol</label>
                <Input
                  placeholder="$"
                  value={newCurrSymbol}
                  onChange={(e) => setNewCurrSymbol(e.target.value)}
                  className="w-20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Exchange Rate (vs USD)</label>
                <Input
                  type="number"
                  step="0.001"
                  value={newCurrRate}
                  onChange={(e) => setNewCurrRate(e.target.value)}
                  className="w-28"
                />
              </div>
              <Button onClick={handleCreateCurrency} size="sm">
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCurrencyForm(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-navy-100/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-linen/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500">Exchange Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500">Last Updated</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {currencies.map((c) => (
                  <tr key={c.id} className="hover:bg-linen/20">
                    <td className="px-4 py-3 font-semibold text-navy">{c.currencyCode}</td>
                    <td className="px-4 py-3">{c.symbol}</td>
                    <td className="px-4 py-3">
                      {editingCurrencyId === c.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.001"
                            value={editRate}
                            onChange={(e) => setEditRate(e.target.value)}
                            className="w-28"
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveRate(c.id)}>
                            <Check className="h-4 w-4 text-emerald-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingCurrencyId(null)}>
                            <X className="h-4 w-4 text-graphite-400" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCurrencyId(c.id);
                            setEditRate(String(c.exchangeRate));
                          }}
                          className="text-left hover:text-teal transition-colors"
                        >
                          {c.exchangeRate.toFixed(4)}
                          <Pencil className="ml-2 inline h-3 w-3 text-graphite-300" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleCurrency(c.id, c.isActive)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          c.isActive ? "bg-teal" : "bg-graphite-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                            c.isActive ? "translate-x-4" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-graphite-400">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {c.currencyCode === "USD" && (
                        <Badge variant="outline" className="text-xs text-graphite-400">Base</Badge>
                      )}
                    </td>
                  </tr>
                ))}
                {currencies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-graphite-300">
                      No currencies configured. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tax Rules section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Tax Rules</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTaxForm(!showTaxForm)}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Tax Rule
          </Button>
        </CardHeader>
        <CardContent>
          {showTaxForm && (
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-navy-100/40 bg-linen/20 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Jurisdiction</label>
                <Input
                  placeholder="TX, CA, ON..."
                  value={taxJurisdiction}
                  onChange={(e) => setTaxJurisdiction(e.target.value)}
                  className="w-28"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Rate (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="8.25"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-24"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Tax Name</label>
                <Input
                  placeholder="Sales Tax"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  className="w-32"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Applies To</label>
                <select
                  value={taxAppliesTo}
                  onChange={(e) => setTaxAppliesTo(e.target.value)}
                  className="rounded-lg border border-navy-100 px-3 py-2 text-sm"
                >
                  <option value="ALL">All</option>
                  <option value="MEMBERSHIP">Membership</option>
                  <option value="ADDON">Add-on</option>
                  <option value="SUPPLEMENT">Supplement</option>
                </select>
              </div>
              <Button onClick={handleCreateTaxRule} size="sm">
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowTaxForm(false)}>
                Cancel
              </Button>
            </div>
          )}

          <DataTable
            data={taxRules}
            columns={taxColumns}
            total={taxRules.length}
            page={1}
            limit={100}
            onPageChange={() => {}}
            emptyMessage="No tax rules configured. Add one above."
          />
        </CardContent>
      </Card>

      {/* Tax Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-5 w-5 text-teal" /> Tax Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Amount ($)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="99.00"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                className="w-32"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Jurisdiction</label>
              <Input
                placeholder="TX"
                value={calcJurisdiction}
                onChange={(e) => setCalcJurisdiction(e.target.value)}
                className="w-28"
              />
            </div>
            <Button onClick={handleCalculateTax}>Calculate</Button>
          </div>

          {calcResult && (
            <div className="mt-4 rounded-lg bg-linen/30 p-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-graphite-400">Subtotal</p>
                  <p className="text-lg font-bold text-navy">${calcAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-graphite-400">Tax ({calcResult.taxName})</p>
                  <p className="text-lg font-bold text-navy">
                    ${(calcResult.taxAmount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-graphite-400">Rate</p>
                  <p className="text-lg font-bold text-navy">
                    {(calcResult.taxRate * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-graphite-400">Total</p>
                  <p className="text-lg font-bold text-teal">
                    ${(parseFloat(calcAmount) + calcResult.taxAmount / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
