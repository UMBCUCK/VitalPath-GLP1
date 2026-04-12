"use client";

import { useState } from "react";
import {
  ChevronUp, ChevronDown, Eye, EyeOff, Pencil, Check, X,
  ArrowUpDown, RotateCcw, GripVertical, FolderOpen, Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavConfig } from "@/hooks/use-nav-config";
import { navGroups } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export default function NavigationSettingsPage() {
  const {
    config,
    loaded,
    toggleItemVisibility,
    toggleGroupVisibility,
    renameItem,
    renameGroup,
    moveItemUp,
    moveItemDown,
    moveGroupUp,
    moveGroupDown,
    moveItem,
    resetToDefaults,
  } = useNavConfig(navGroups);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [movingItem, setMovingItem] = useState<{ groupId: string; itemId: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!loaded) return <div className="p-8 text-center text-graphite-400">Loading...</div>;

  const visibleCount = config.groups.reduce(
    (acc, g) => acc + (g.visible ? g.items.filter((i) => i.visible).length : 0),
    0
  );
  const totalCount = config.groups.reduce((acc, g) => acc + g.items.length, 0);

  function startEditItem(groupId: string, itemId: string, currentLabel: string) {
    setEditingItem(`${groupId}:${itemId}`);
    setEditValue(currentLabel);
  }

  function saveEditItem(groupId: string, itemId: string) {
    if (editValue.trim()) {
      renameItem(groupId, itemId, editValue.trim());
    }
    setEditingItem(null);
  }

  function startEditGroup(groupId: string, currentTitle: string) {
    setEditingGroup(groupId);
    setEditValue(currentTitle);
  }

  function saveEditGroup(groupId: string) {
    if (editValue.trim()) {
      renameGroup(groupId, editValue.trim());
    }
    setEditingGroup(null);
  }

  function startMoveItem(groupId: string, itemId: string) {
    setMovingItem({ groupId, itemId });
  }

  function completeMoveItem(toGroupId: string) {
    if (!movingItem) return;
    const toGroup = config.groups.find((g) => g.id === toGroupId);
    if (!toGroup) return;
    moveItem(movingItem.groupId, movingItem.itemId, toGroupId, toGroup.items.length);
    setMovingItem(null);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-teal" />
            Navigation Settings
          </h1>
          <p className="mt-1 text-sm text-graphite-500">
            Customize your sidebar — reorder, rename, toggle visibility, or move items between groups.
            Changes are saved automatically and apply only to your browser.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {visibleCount}/{totalCount} visible
          </Badge>
          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-graphite-500">Reset to defaults?</span>
              <Button size="sm" variant="destructive" onClick={() => { resetToDefaults(); setShowResetConfirm(false); }}>
                Yes, reset
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowResetConfirm(true)}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Moving item banner */}
      {movingItem && (
        <div className="rounded-xl border-2 border-dashed border-teal bg-teal-50 p-4">
          <p className="text-sm font-medium text-teal-800">
            Select a group to move the item into, or click Cancel.
          </p>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => setMovingItem(null)}>
            Cancel Move
          </Button>
        </div>
      )}

      {/* Groups */}
      {config.groups.map((group, gi) => (
        <Card key={group.id} className={cn(!group.visible && "opacity-50")}>
          <CardContent className="p-0">
            {/* Group header */}
            <div className="flex items-center gap-3 border-b border-navy-100/40 px-5 py-3">
              <GripVertical className="h-4 w-4 text-graphite-300" />

              {/* Group title (editable) */}
              {editingGroup === group.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm font-bold"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditGroup(group.id);
                      if (e.key === "Escape") setEditingGroup(null);
                    }}
                  />
                  <Button size="sm" variant="ghost" onClick={() => saveEditGroup(group.id)}>
                    <Check className="h-3.5 w-3.5 text-teal" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingGroup(null)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <h2 className="text-sm font-bold text-navy uppercase tracking-wide">{group.title}</h2>
                  <button
                    onClick={() => startEditGroup(group.id, group.title)}
                    className="rounded p-1 text-graphite-300 hover:bg-navy-50 hover:text-navy"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <Badge variant="outline" className="text-[10px] ml-1">
                    {group.items.filter((i) => i.visible).length}/{group.items.length}
                  </Badge>
                </div>
              )}

              {/* Move item into this group */}
              {movingItem && movingItem.groupId !== group.id && (
                <Button size="sm" variant="outline" className="gap-1 text-xs border-teal text-teal" onClick={() => completeMoveItem(group.id)}>
                  <FolderOpen className="h-3 w-3" /> Move here
                </Button>
              )}

              {/* Group controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleGroupVisibility(group.id)}
                  className="rounded p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"
                  title={group.visible ? "Hide entire group" : "Show group"}
                >
                  {group.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => moveGroupUp(group.id)}
                  disabled={gi === 0}
                  className="rounded p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveGroupDown(group.id)}
                  disabled={gi === config.groups.length - 1}
                  className="rounded p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-navy-100/20">
              {group.items.map((item, ii) => {
                const isEditing = editingItem === `${group.id}:${item.id}`;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 px-5 py-2.5 transition-colors",
                      !item.visible && "opacity-40",
                      movingItem?.itemId === item.id && "bg-teal-50 ring-2 ring-teal/30"
                    )}
                  >
                    <GripVertical className="h-3.5 w-3.5 text-graphite-200" />

                    {/* Item label (editable) */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-7 text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditItem(group.id, item.id);
                            if (e.key === "Escape") setEditingItem(null);
                          }}
                        />
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => saveEditItem(group.id, item.id)}>
                          <Check className="h-3 w-3 text-teal" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingItem(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm text-navy truncate">{item.label}</span>
                        <span className="text-[10px] text-graphite-300 truncate hidden sm:inline">{item.id}</span>
                      </div>
                    )}

                    {/* Item controls */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      {!isEditing && (
                        <button
                          onClick={() => startEditItem(group.id, item.id, item.label)}
                          className="rounded p-1.5 text-graphite-300 hover:bg-navy-50 hover:text-navy"
                          title="Rename"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => startMoveItem(group.id, item.id)}
                        className="rounded p-1.5 text-graphite-300 hover:bg-navy-50 hover:text-navy"
                        title="Move to another group"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => toggleItemVisibility(group.id, item.id)}
                        className="rounded p-1.5 text-graphite-300 hover:bg-navy-50 hover:text-navy"
                        title={item.visible ? "Hide" : "Show"}
                      >
                        {item.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => moveItemUp(group.id, item.id)}
                        disabled={ii === 0}
                        className="rounded p-1.5 text-graphite-300 hover:bg-navy-50 hover:text-navy disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveItemDown(group.id, item.id)}
                        disabled={ii === group.items.length - 1}
                        className="rounded p-1.5 text-graphite-300 hover:bg-navy-50 hover:text-navy disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Instructions */}
      <div className="rounded-xl bg-navy-50/50 p-4 text-xs text-graphite-500 space-y-1">
        <p><strong>How it works:</strong></p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><Eye className="inline h-3 w-3" /> / <EyeOff className="inline h-3 w-3" /> — Toggle visibility (hidden items are NOT deleted, just hidden from the sidebar)</li>
          <li><Pencil className="inline h-3 w-3" /> — Rename any item or group</li>
          <li><ChevronUp className="inline h-3 w-3" /> <ChevronDown className="inline h-3 w-3" /> — Reorder items within a group or reorder groups</li>
          <li><ArrowUpDown className="inline h-3 w-3" /> — Move an item to a different group (subcategory)</li>
          <li><RotateCcw className="inline h-3 w-3" /> Reset — Restore all defaults (names, order, visibility)</li>
          <li>Changes save automatically and persist in your browser</li>
        </ul>
      </div>
    </div>
  );
}
