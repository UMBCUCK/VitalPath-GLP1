import { db } from "@/lib/db";

// ─── Get paginated notes for a patient ─────────────────────

export async function getPatientNotes(
  patientId: string,
  page = 1,
  limit = 20
) {
  const [notes, total] = await Promise.all([
    db.adminNote.findMany({
      where: { patientId },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.adminNote.count({ where: { patientId } }),
  ]);

  // Fetch author names for all notes
  const authorIds = [...new Set(notes.map((n) => n.authorId))];
  const authors = await db.user.findMany({
    where: { id: { in: authorIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const authorMap = new Map(authors.map((a) => [a.id, a]));

  const enriched = notes.map((note) => {
    const author = authorMap.get(note.authorId);
    return {
      ...note,
      authorName: author
        ? [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email
        : "Unknown",
    };
  });

  return { notes: enriched, total, page, limit };
}

// ─── Create a note ─────────────────────────────────────────

export async function createNote(
  authorId: string,
  patientId: string,
  content: string
) {
  return db.adminNote.create({
    data: { authorId, patientId, content },
  });
}

// ─── Toggle pin status ─────────────────────────────────────

export async function togglePinNote(noteId: string) {
  const note = await db.adminNote.findUnique({ where: { id: noteId } });
  if (!note) throw new Error("Note not found");

  return db.adminNote.update({
    where: { id: noteId },
    data: { isPinned: !note.isPinned },
  });
}

// ─── Delete a note ─────────────────────────────────────────

export async function deleteNote(noteId: string) {
  return db.adminNote.delete({ where: { id: noteId } });
}
