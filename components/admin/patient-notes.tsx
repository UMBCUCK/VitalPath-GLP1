"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StickyNote, Pin, PinOff, Trash2, Send } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface Note {
  id: string;
  authorId: string;
  patientId: string;
  content: string;
  isPinned: boolean;
  authorName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return past.toLocaleDateString();
}

// ─── Component ──────────────────────────────────────────────

export function PatientNotes({
  patientId,
  initialNotes,
}: {
  patientId: string;
  initialNotes: Note[];
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addNote = useCallback(async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, content: content.trim() }),
      });

      if (res.ok) {
        const { note } = await res.json();
        // Refetch to get authorName populated
        const listRes = await fetch(
          `/api/admin/notes?patientId=${patientId}&limit=50`
        );
        if (listRes.ok) {
          const data = await listRes.json();
          setNotes(data.notes);
        } else {
          // Fallback: add note with placeholder name
          setNotes((prev) => [
            { ...note, authorName: "You", createdAt: new Date().toISOString() },
            ...prev,
          ]);
        }
        setContent("");
      }
    } finally {
      setSubmitting(false);
    }
  }, [content, patientId, submitting]);

  const togglePin = useCallback(async (noteId: string) => {
    const res = await fetch("/api/admin/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });

    if (res.ok) {
      setNotes((prev) => {
        const updated = prev.map((n) =>
          n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
        );
        // Re-sort: pinned first, then by date
        return updated.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      });
    }
  }, []);

  const removeNote = useCallback(async (noteId: string) => {
    const res = await fetch(`/api/admin/notes?noteId=${noteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-gold-600" />
          Notes ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add note form */}
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note about this patient..."
            className="flex-1 rounded-xl border border-navy-100/60 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                addNote();
              }
            }}
          />
          <Button
            size="sm"
            onClick={addNote}
            disabled={!content.trim() || submitting}
            className="self-end gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "..." : "Add"}
          </Button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p className="text-sm text-graphite-300 py-4 text-center">
            No notes yet
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`rounded-xl border p-3 transition-colors ${
                  note.isPinned
                    ? "border-gold-200 bg-gold-50/30"
                    : "border-navy-100/40 bg-navy-50/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-navy">
                        {note.authorName}
                      </span>
                      <span className="text-graphite-300">
                        {timeAgo(note.createdAt)}
                      </span>
                      {note.isPinned && (
                        <Pin className="h-3 w-3 text-gold-600 fill-gold-600" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-graphite-500 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePin(note.id)}
                      className="rounded-lg p-1.5 text-graphite-300 hover:text-gold-600 hover:bg-gold-50 transition-colors"
                      title={note.isPinned ? "Unpin" : "Pin"}
                    >
                      {note.isPinned ? (
                        <PinOff className="h-3.5 w-3.5" />
                      ) : (
                        <Pin className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => removeNote(note.id)}
                      className="rounded-lg p-1.5 text-graphite-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
