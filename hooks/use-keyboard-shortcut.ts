"use client";

import { useEffect, useCallback } from "react";

type KeyCombo = {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

export function useKeyboardShortcut(combo: KeyCombo, callback: () => void) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      const metaMatch = combo.meta ? e.metaKey || e.ctrlKey : true;
      const ctrlMatch = combo.ctrl ? e.ctrlKey : true;
      const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = combo.alt ? e.altKey : !e.altKey;

      if (e.key.toLowerCase() === combo.key.toLowerCase() && metaMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        callback();
      }
    },
    [combo, callback]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
