import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getMarketingAssets,
  createMarketingAsset,
  updateMarketingAsset,
  deleteMarketingAsset,
  incrementDownload,
} from "@/lib/admin-marketing-assets";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "50");
    const type = url.searchParams.get("type") || undefined;
    const search = url.searchParams.get("search") || undefined;

    const result = await getMarketingAssets(page, limit, type, search);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Marketing Assets GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch marketing assets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    // Handle download increment
    if (body.action === "increment_download" && body.id) {
      const asset = await incrementDownload(body.id);
      return NextResponse.json({ asset });
    }

    const { name, type, fileUrl, content, thumbnail, category, isActive } =
      body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    const validTypes = [
      "BANNER",
      "EMAIL_TEMPLATE",
      "SOCIAL_POST",
      "LANDING_PAGE",
      "DOCUMENT",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid asset type" },
        { status: 400 }
      );
    }

    const asset = await createMarketingAsset({
      name,
      type,
      fileUrl: fileUrl || null,
      content: content || null,
      thumbnail: thumbnail || null,
      category: category || null,
      isActive: isActive !== false,
      createdBy: session.userId,
    });

    return NextResponse.json({ asset });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Marketing Assets POST]", error);
    return NextResponse.json(
      { error: "Failed to create marketing asset" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Asset ID required" },
        { status: 400 }
      );
    }

    const asset = await updateMarketingAsset(id, data);
    return NextResponse.json({ asset });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Marketing Assets PUT]", error);
    return NextResponse.json(
      { error: "Failed to update marketing asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Asset ID required" },
        { status: 400 }
      );
    }

    await deleteMarketingAsset(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Marketing Assets DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete marketing asset" },
      { status: 500 }
    );
  }
}
