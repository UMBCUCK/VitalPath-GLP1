import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    // Save to local uploads directory (swap to S3/R2 in production)
    const uploadsDir = join(process.cwd(), "public", "uploads", session.userId);
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${type.toLowerCase()}_${Date.now()}.${ext}`;
    const filepath = join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const imageUrl = `/uploads/${session.userId}/${filename}`;

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
    console.error("[Photos API]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
