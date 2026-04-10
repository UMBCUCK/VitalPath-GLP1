import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPatientNotes, createNote, togglePinNote, deleteNote } from "@/lib/admin-notes";
import { safeError } from "@/lib/logger";

// ── GET: list notes for a patient ───────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    if (!patientId) {
      return NextResponse.json(
        { error: "patientId is required" },
        { status: 400 }
      );
    }

    const result = await getPatientNotes(patientId, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    safeError("[Admin Notes GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// ── POST: create a new note ─────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { patientId, content } = body;

    if (!patientId || !content?.trim()) {
      return NextResponse.json(
        { error: "patientId and content are required" },
        { status: 400 }
      );
    }

    const note = await createNote(session.userId, patientId, content.trim());
    return NextResponse.json({ note });
  } catch (error) {
    safeError("[Admin Notes POST]", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// ── PUT: toggle pin on a note ───────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    const note = await togglePinNote(noteId);
    return NextResponse.json({ note });
  } catch (error) {
    safeError("[Admin Notes PUT]", error);
    return NextResponse.json(
      { error: "Failed to toggle pin" },
      { status: 500 }
    );
  }
}

// ── DELETE: delete a note ───────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const noteId = url.searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    await deleteNote(noteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    safeError("[Admin Notes DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
