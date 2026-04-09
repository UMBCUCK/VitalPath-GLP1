import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const path = req.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    // Prevent path traversal: ensure path starts with the authenticated user's ID
    const normalized = path.replace(/\\/g, "/");
    if (normalized.includes("..") || !normalized.startsWith(session.userId + "/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ext = normalized.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext];
    if (!contentType) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const filepath = join(process.cwd(), "uploads", normalized);

    try {
      const buffer = await readFile(filepath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
