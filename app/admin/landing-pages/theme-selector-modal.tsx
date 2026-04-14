"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  ExternalLink,
  FlaskConical,
  Palette,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  LP_THEMES,
  THEME_IDS,
  DEFAULT_THEME_ID,
  getDefaultThemeForSlug,
  type ThemeId,
} from "@/lib/lp-themes";
import {
  getThemeAssignment,
  setThemeAssignment,
  type LpAbTestConfig,
} from "@/lib/lp-theme-config";

// ─── Theme Selector Modal ──────────────────────────────────

interface ThemeSelectorModalProps {
  lpName: string;
  lpPath: string;
  onClose: () => void;
}

export function ThemeSelectorModal({
  lpName,
  lpPath,
  onClose,
}: ThemeSelectorModalProps) {
  const slug = lpPath.replace("/lp/", "");
  const assignment = getThemeAssignment(slug);
  const defaultTheme = getDefaultThemeForSlug(slug);

  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(
    assignment?.themeId ?? defaultTheme
  );
  const [abEnabled, setAbEnabled] = useState(
    assignment?.abTest?.enabled ?? false
  );
  const [abControl, setAbControl] = useState<ThemeId>(
    assignment?.abTest?.variants?.control ?? defaultTheme
  );
  const [abVariant, setAbVariant] = useState<ThemeId>(
    assignment?.abTest?.variants?.variant_a ?? DEFAULT_THEME_ID
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = () => {
    const abTest: LpAbTestConfig | undefined = abEnabled
      ? {
          enabled: true,
          experimentKey: `lp_theme_${slug}`,
          variants: { control: abControl, variant_a: abVariant },
        }
      : undefined;

    setThemeAssignment(slug, {
      slug,
      themeId: selectedTheme,
      abTest,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const previewUrl = `${lpPath}?theme=${selectedTheme}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-card-foreground">
              Theme &amp; A/B Testing
            </h2>
            <p className="text-sm text-muted-foreground">{lpName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* ── Theme Grid ── */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Palette className="h-4 w-4 text-primary" />
              Select Theme
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {THEME_IDS.map((id) => {
                const theme = LP_THEMES[id];
                const isSelected = selectedTheme === id;
                const isDefault = id === defaultTheme;

                return (
                  <Card
                    key={id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                        : "hover:shadow-md hover:scale-[1.01]"
                    }`}
                    onClick={() => setSelectedTheme(id)}
                  >
                    <CardContent className="p-4">
                      {/* Color swatch bar */}
                      <div className="mb-3 flex gap-1 rounded-lg overflow-hidden h-8">
                        <div
                          className="flex-1"
                          style={{ backgroundColor: theme.preview.primary }}
                        />
                        <div
                          className="flex-1"
                          style={{ backgroundColor: theme.preview.secondary }}
                        />
                        <div
                          className="flex-1"
                          style={{ backgroundColor: theme.preview.accent }}
                        />
                      </div>

                      {/* Name + badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-card-foreground">
                            {theme.name}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                            {theme.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="shrink-0 rounded-full bg-primary p-1">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {isDefault && (
                          <Badge
                            variant="outline"
                            className="text-[9px] border-primary/30 text-primary"
                          >
                            Recommended
                          </Badge>
                        )}
                        {theme.bestFor.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[9px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* ── Preview Button ── */}
          <div className="flex items-center gap-3">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Preview {LP_THEMES[selectedTheme].name}
                <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
              </Button>
            </a>
            <span className="text-[10px] text-muted-foreground">
              Opens in new tab with ?theme= param
            </span>
          </div>

          {/* ── A/B Testing ── */}
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <FlaskConical className="h-4 w-4 text-purple-500" />
                A/B Test Themes
              </h3>
              <button
                onClick={() => setAbEnabled(!abEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  abEnabled ? "bg-purple-500" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                    abEnabled ? "translate-x-5" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>

            {abEnabled && (
              <div className="mt-4 space-y-3">
                <p className="text-[10px] text-muted-foreground">
                  Split traffic between two themes. Uses deterministic
                  hash-based assignment (50/50 split). Tracked via PostHog.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Control */}
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Control (A)
                    </label>
                    <select
                      value={abControl}
                      onChange={(e) =>
                        setAbControl(e.target.value as ThemeId)
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {THEME_IDS.map((id) => (
                        <option key={id} value={id}>
                          {LP_THEMES[id].name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1.5 flex gap-0.5 rounded overflow-hidden h-3">
                      <div
                        className="flex-1"
                        style={{
                          backgroundColor: LP_THEMES[abControl].preview.primary,
                        }}
                      />
                      <div
                        className="flex-1"
                        style={{
                          backgroundColor:
                            LP_THEMES[abControl].preview.secondary,
                        }}
                      />
                      <div
                        className="flex-1"
                        style={{
                          backgroundColor: LP_THEMES[abControl].preview.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Variant */}
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Variant (B)
                    </label>
                    <select
                      value={abVariant}
                      onChange={(e) =>
                        setAbVariant(e.target.value as ThemeId)
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {THEME_IDS.map((id) => (
                        <option key={id} value={id}>
                          {LP_THEMES[id].name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1.5 flex gap-0.5 rounded overflow-hidden h-3">
                      <div
                        className="flex-1"
                        style={{
                          backgroundColor:
                            LP_THEMES[abVariant].preview.primary,
                        }}
                      />
                      <div
                        className="flex-1"
                        style={{
                          backgroundColor:
                            LP_THEMES[abVariant].preview.secondary,
                        }}
                      />
                      <div
                        className="flex-1"
                        style={{
                          backgroundColor: LP_THEMES[abVariant].preview.accent,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">
                    Experiment key:{" "}
                    <code className="font-mono text-card-foreground">
                      lp_theme_{slug}
                    </code>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-1.5 min-w-[100px]"
            >
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Saved
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
