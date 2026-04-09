import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { safeError } from "@/lib/logger";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const MIME_TO_EXT: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};

// GET — list user's photos
export async function GET() {
  try {
    const session = await requireAuth();
    const photos = await db.progressPhoto.findMany({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ photos });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — upload a photo
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "FRONT";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type against whitelist
    const allowedExts = MIME_TO_EXT[file.type];
    if (!allowedExts) {
      return NextResponse.json(
        { error: "File must be a JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    // Validate and sanitize file extension
    const rawExt = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    if (!ALLOWED_EXTENSIONS.has(rawExt) || !allowedExts.includes(rawExt)) {
      return NextResponse.json(
        { error: "File extension does not match its type" },
        { status: 400 }
      );
    }

    // Save to non-public uploads directory
    const uploadsDir = join(process.cwd(), "uploads", session.userId);
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${type.toLowerCase()}_${Date.now()}.${rawExt}`;
    const filepath = join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const imageUrl = `/api/photos/serve?path=${session.userId}/${filename}`;

    // Create DB record
    const photo = await db.progressPhoto.create({
      data: {
        userId: session.userId,
        imageUrl,
        type: type as "FRONT" | "SIDE" | "BACK" | "CUSTOM",
        consentGiven: false,
      },
    });

    return NextResponse.json({ photo });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Photos API]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
