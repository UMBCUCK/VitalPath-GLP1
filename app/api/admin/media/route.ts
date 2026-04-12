import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await readdir(UPLOAD_DIR);
    const images = await Promise.all(
      files
        .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .map(async (filename) => {
          const fileStat = await stat(join(UPLOAD_DIR, filename)).catch(() => null);
          return {
            filename,
            url: `/uploads/${filename}`,
            size: fileStat?.size ?? 0,
            createdAt: fileStat?.mtime?.toISOString() ?? new Date().toISOString(),
          };
        })
    );
    // Newest first
    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await req.json();
  if (!filename || typeof filename !== "string" || filename.includes("/") || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    await unlink(join(UPLOAD_DIR, filename));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
