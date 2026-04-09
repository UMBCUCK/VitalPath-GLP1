"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vitalpath-funnel";

export interface FunnelState {
  quiz?: Record<string, unknown>;
  intake?: Record<string, unknown>;
  recommendedPlan?: string;
  email?: string;
  step?: string;
}

export function useFunnelStore() {
  const [state, setState] = useState<FunnelState>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const update = useCallback((partial: Partial<FunnelState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setState({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { state, update, clear };
}
