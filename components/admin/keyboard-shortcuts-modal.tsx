"use client";

import { X } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "K"], description: "Open command palette" },
  { keys: ["G", "then", "D"], description: "Go to Dashboard" },
  { keys: ["G", "then", "C"], description: "Go to Customers" },
  { keys: ["G", "then", "R"], description: "Go to Revenue" },
  { keys: ["G", "then", "S"], description: "Go to Settings" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["Esc"], description: "Close modal/palette" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="mx-4 rounded-2xl border border-navy-100/60 bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy">Keyboard Shortcuts</h3>
            <button onClick={onClose} className="rounded-lg p-1 text-graphite-400 hover:bg-navy-50 hover:text-navy">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.description} className="flex items-center justify-between">
                <span className="text-sm text-graphite-500">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) =>
                    key === "then" ? (
                      <span key={i} className="text-xs text-graphite-300">then</span>
                    ) : (
                      <kbd
                        key={i}
                        className="rounded-md border border-navy-100/60 bg-navy-50 px-2 py-0.5 text-xs font-medium text-graphite-500"
                      >
                        {key}
                      </kbd>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
