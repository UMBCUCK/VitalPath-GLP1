"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useAdminSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = useCallback(
    (key: string, fallback?: string) => searchParams.get(key) ?? fallback ?? "",
    [searchParams]
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const val = searchParams.get(key);
      return val ? parseInt(val, 10) : fallback;
    },
    [searchParams]
  );

  const set = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const page = getNumber("page", 1);
  const limit = getNumber("limit", 25);
  const sort = get("sort");
  const order = get("order", "desc") as "asc" | "desc";
  const search = get("q");
  const from = get("from");
  const to = get("to");

  return { get, getNumber, set, page, limit, sort, order, search, from, to };
}
