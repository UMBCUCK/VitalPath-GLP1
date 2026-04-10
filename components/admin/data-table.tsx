"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { cn } from "@/lib/utils";

// ── Column definition ──────────────────────────────────────────
export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
}

// ── Filter config ──────────────────────────────────────────────
interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

// ── Props ──────────────────────────────────────────────────────
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  total: number;
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSortChange?: (sort: string, order: "asc" | "desc") => void;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onExportCSV?: () => void;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  getRowId?: (row: T) => string;
  onRowClick?: (row: T) => void;
  bulkActions?: React.ReactNode;
  toolbarExtra?: React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  total,
  page,
  limit,
  sort,
  order = "desc",
  search = "",
  onPageChange,
  onLimitChange,
  onSortChange,
  onSearchChange,
  searchPlaceholder,
  filters,
  activeFilters,
  onFilterChange,
  onExportCSV,
  selectable = false,
  onSelectionChange,
  getRowId,
  onRowClick,
  bulkActions,
  toolbarExtra,
  emptyMessage = "No results found",
  loading = false,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = useCallback(
    (key: string) => {
      if (!onSortChange) return;
      if (sort === key) {
        onSortChange(key, order === "asc" ? "desc" : "asc");
      } else {
        onSortChange(key, "desc");
      }
    },
    [sort, order, onSortChange]
  );

  const toggleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        onSelectionChange?.(Array.from(next));
        return next;
      });
    },
    [onSelectionChange]
  );

  const toggleSelectAll = useCallback(() => {
    if (!getRowId) return;
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(data.map(getRowId));
      setSelectedIds(allIds);
      onSelectionChange?.(Array.from(allIds));
    }
  }, [data, getRowId, selectedIds.size, onSelectionChange]);

  const allSelected = data.length > 0 && selectedIds.size === data.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(onSearchChange || filters || onExportCSV) && (
        <DataTableToolbar
          searchValue={search}
          onSearchChange={onSearchChange || (() => {})}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onExportCSV={onExportCSV}
          selectedCount={selectedIds.size}
          bulkActions={bulkActions}
        >
          {toolbarExtra}
        </DataTableToolbar>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-navy-100/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-100/40 bg-linen/30">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-navy-200 text-teal accent-teal"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 text-left text-xs", col.className)}>
                  <DataTableColumnHeader
                    title={col.header}
                    sortKey={col.sortable ? col.key : undefined}
                    currentSort={sort}
                    currentOrder={order}
                    onSort={col.sortable ? handleSort : undefined}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100/30">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {selectable && <td className="px-3 py-3"><div className="h-4 w-4 animate-pulse rounded bg-navy-50" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-navy-50" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-graphite-300"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const rowId = getRowId?.(row) ?? String(i);
                const isSelected = selectedIds.has(rowId);
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      "transition-colors",
                      isSelected ? "bg-teal-50/30" : "hover:bg-linen/20",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(rowId)}
                          className="h-4 w-4 rounded border-navy-200 text-teal accent-teal"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3", col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}

// ── CSV Export Utility ──────────────────────────────────────────
export function exportToCSV<T>(
  data: T[],
  columns: { key: string; header: string; getValue: (row: T) => string }[],
  filename: string
) {
  const headers = columns.map((c) => c.header).join(",");
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = c.getValue(row);
      // Escape commas and quotes
      if (val.includes(",") || val.includes('"')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(",")
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
