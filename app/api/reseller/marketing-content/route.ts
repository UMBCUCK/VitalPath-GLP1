import { NextRequest, NextResponse } from "next/server";
import { getResellerSession } from "@/lib/reseller-auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

// GET — list reseller's own submissions
export async function GET(req: NextRequest) {
  try {
    const session = await getResellerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));

    const [submissions, total] = await Promise.all([
      db.marketingContentSubmission.findMany({
        where: { resellerId: session.resellerId },
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.marketingContentSubmission.count({
        where: { resellerId: session.resellerId },
      }),
    ]);

    return NextResponse.json({ submissions, total });
  } catch (err) {
    safeError("[Marketing Content] GET error", err);
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
  }
}

// POST — submit new marketing content for review
export async function POST(req: NextRequest) {
  try {
    const session = await getResellerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content, contentType, platform } = await req.json();

    if (!title?.trim() || !content?.trim() || !contentType) {
      return NextResponse.json({ error: "Title, content, and type are required" }, { status: 400 });
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: "Content must be under 5,000 characters" }, { status: 400 });
    }

    const validTypes = ["SOCIAL_POST", "EMAIL", "BLOG", "VIDEO_SCRIPT", "LANDING_PAGE", "OTHER"];
    if (!validTypes.includes(contentType)) {
      return NextResponse.json({ error: `Invalid content type. Must be one of: ${validTypes.join(", ")}` }, { status: 400 });
    }

    const submission = await db.marketingContentSubmission.create({
      data: {
        resellerId: session.resellerId,
        title: title.trim(),
        content: content.trim(),
        contentType,
        platform: platform?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (err) {
    safeError("[Marketing Content] POST error", err);
    return NextResponse.json({ error: "Failed to submit content" }, { status: 500 });
  }
}
