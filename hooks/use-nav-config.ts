"use client";

import { useState, useCallback, useEffect } from "react";

// ─── Types ──────────────────────────────────────────────────

export interface NavItemConfig {
  /** Original href — used as stable ID (never changes) */
  id: string;
  /** Display label (editable) */
  label: string;
  /** Whether this item is visible in the sidebar */
  visible: boolean;
  /** Sort order within its group */
  order: number;
}

export interface NavGroupConfig {
  /** Group ID (matches original title, lowercased) */
  id: string;
  /** Display title (editable) */
  title: string;
  /** Whether the entire group is visible */
  visible: boolean;
  /** Sort order among groups */
  order: number;
  /** Items in this group */
  items: NavItemConfig[];
}

export interface NavConfig {
  version: number;
  groups: NavGroupConfig[];
}

const STORAGE_KEY = "vp-admin-nav-config";
const CONFIG_VERSION = 1;

// ─── Default from hardcoded navGroups ───────────────────────

function buildDefaultConfig(navGroups: Array<{ title: string; items: Array<{ label: string; href: string }> }>): NavConfig {
  return {
    version: CONFIG_VERSION,
    groups: navGroups.map((group, gi) => ({
      id: group.title.toLowerCase().replace(/\s+/g, "-"),
      title: group.title,
      visible: true,
      order: gi,
      items: group.items.map((item, ii) => ({
        id: item.href,
        label: item.label,
        visible: true,
        order: ii,
      })),
    })),
  };
}

// ─── Hook ───────────────────────────────────────────────────

export function useNavConfig(
  defaultNavGroups: Array<{ title: string; items: Array<{ label: string; href: string }> }>
) {
  const [config, setConfig] = useState<NavConfig>(() => buildDefaultConfig(defaultNavGroups));
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as NavConfig;
        if (parsed.version === CONFIG_VERSION) {
          // Merge with defaults — add any new items that don't exist in stored config
          const merged = mergeWithDefaults(parsed, defaultNavGroups);
          setConfig(merged);
        }
      }
    } catch {
      // Use defaults
    }
    setLoaded(true);
  }, [defaultNavGroups]);

  // Persist to localStorage
  const save = useCallback((next: NavConfig) => {
    setConfig(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or unavailable
    }
  }, []);

  // ─── Mutation helpers ─────────────────────────────────────

  const toggleItemVisibility = useCallback((groupId: string, itemId: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const group = next.groups.find((g) => g.id === groupId);
      const item = group?.items.find((i) => i.id === itemId);
      if (item) item.visible = !item.visible;
      save(next);
      return next;
    });
  }, [save]);

  const toggleGroupVisibility = useCallback((groupId: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const group = next.groups.find((g) => g.id === groupId);
      if (group) group.visible = !group.visible;
      save(next);
      return next;
    });
  }, [save]);

  const renameItem = useCallback((groupId: string, itemId: string, newLabel: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const group = next.groups.find((g) => g.id === groupId);
      const item = group?.items.find((i) => i.id === itemId);
      if (item) item.label = newLabel;
      save(next);
      return next;
    });
  }, [save]);

  const renameGroup = useCallback((groupId: string, newTitle: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const group = next.groups.find((g) => g.id === groupId);
      if (group) group.title = newTitle;
      save(next);
      return next;
    });
  }, [save]);

  const moveItem = useCallback((fromGroupId: string, itemId: string, toGroupId: string, toIndex: number) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const fromGroup = next.groups.find((g) => g.id === fromGroupId);
      const toGroup = next.groups.find((g) => g.id === toGroupId);
      if (!fromGroup || !toGroup) return prev;

      const itemIdx = fromGroup.items.findIndex((i) => i.id === itemId);
      if (itemIdx === -1) return prev;

      const [item] = fromGroup.items.splice(itemIdx, 1);
      toGroup.items.splice(toIndex, 0, item);

      // Re-index orders
      fromGroup.items.forEach((it, i) => { it.order = i; });
      toGroup.items.forEach((it, i) => { it.order = i; });

      save(next);
      return next;
    });
  }, [save]);

  const moveItemUp = useCallback((groupId: string, itemId: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const group = next.groups.find((g) => g.id === groupId);
      if (!group) return prev;
      const idx = group.items.findIndex((i) => i.id === itemId);
      if (idx <= 0) return prev;
      [group.items[idx - 1], group.items[idx]] = [group.items[idx], group.items[idx - 1]];
      group.items.forEach((it, i) => { it.order = i; });
      save(next);
      return next;
    });
  }, [save]);

  const moveItemDown = useCallback((groupId: string, itemId: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const group = next.groups.find((g) => g.id === groupId);
      if (!group) return prev;
      const idx = group.items.findIndex((i) => i.id === itemId);
      if (idx === -1 || idx >= group.items.length - 1) return prev;
      [group.items[idx], group.items[idx + 1]] = [group.items[idx + 1], group.items[idx]];
      group.items.forEach((it, i) => { it.order = i; });
      save(next);
      return next;
    });
  }, [save]);

  const moveGroupUp = useCallback((groupId: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const idx = next.groups.findIndex((g) => g.id === groupId);
      if (idx <= 0) return prev;
      [next.groups[idx - 1], next.groups[idx]] = [next.groups[idx], next.groups[idx - 1]];
      next.groups.forEach((g, i) => { g.order = i; });
      save(next);
      return next;
    });
  }, [save]);

  const moveGroupDown = useCallback((groupId: string) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const idx = next.groups.findIndex((g) => g.id === groupId);
      if (idx === -1 || idx >= next.groups.length - 1) return prev;
      [next.groups[idx], next.groups[idx + 1]] = [next.groups[idx + 1], next.groups[idx]];
      next.groups.forEach((g, i) => { g.order = i; });
      save(next);
      return next;
    });
  }, [save]);

  const resetToDefaults = useCallback(() => {
    const defaults = buildDefaultConfig(defaultNavGroups);
    save(defaults);
  }, [defaultNavGroups, save]);

  return {
    config,
    loaded,
    toggleItemVisibility,
    toggleGroupVisibility,
    renameItem,
    renameGroup,
    moveItem,
    moveItemUp,
    moveItemDown,
    moveGroupUp,
    moveGroupDown,
    resetToDefaults,
  };
}

// ─── Merge saved config with defaults (handles new pages added after save) ──

function mergeWithDefaults(
  saved: NavConfig,
  defaults: Array<{ title: string; items: Array<{ label: string; href: string }> }>
): NavConfig {
  const defaultConfig = buildDefaultConfig(defaults);

  // Build set of all saved item IDs
  const savedItemIds = new Set<string>();
  saved.groups.forEach((g) => g.items.forEach((i) => savedItemIds.add(i.id)));

  // Build set of all saved group IDs
  const savedGroupIds = new Set(saved.groups.map((g) => g.id));

  // Add any new groups/items from defaults that aren't in saved config
  for (const defGroup of defaultConfig.groups) {
    if (!savedGroupIds.has(defGroup.id)) {
      // Entire new group — add at end
      saved.groups.push(defGroup);
    } else {
      const savedGroup = saved.groups.find((g) => g.id === defGroup.id)!;
      for (const defItem of defGroup.items) {
        if (!savedItemIds.has(defItem.id)) {
          savedGroup.items.push(defItem);
        }
      }
    }
  }

  return saved;
}
