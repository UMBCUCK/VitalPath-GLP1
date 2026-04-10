"use client";

import { useState } from "react";
import { Search, Download, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onExportCSV?: () => void;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  children?: React.ReactNode;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  activeFilters = {},
  onFilterChange,
  onExportCSV,
  selectedCount = 0,
  bulkActions,
  children,
}: DataTableToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== "");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-300" />
          <Input
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-300 hover:text-navy"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {filters?.map((filter) => (
          <select
            key={filter.key}
            value={activeFilters[filter.key] || ""}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            className="h-9 rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy transition-colors hover:border-navy-300"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs"
            onClick={() => filters?.forEach((f) => onFilterChange?.(f.key, ""))}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}

        {children}
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-teal">
              {selectedCount} selected
            </span>
            {bulkActions}
          </div>
        )}
        {onExportCSV && (
          <Button variant="outline" size="sm" className="h-9 text-xs" onClick={onExportCSV}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );
}
