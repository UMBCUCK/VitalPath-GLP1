import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string(),
  imageUrl: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.unknown().optional().nullable(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

const blogPostUpdateSchema = blogPostSchema.partial();

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "25", 10)));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const published = searchParams.get("published") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }
    if (category) {
      where.category = category;
    }
    if (published === "true") {
      where.isPublished = true;
    } else if (published === "false") {
      where.isPublished = false;
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, limit });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Blog API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }
    const data: Record<string, unknown> = { ...parsed.data };
    if (data.publishedAt && typeof data.publishedAt === "string") {
      data.publishedAt = new Date(data.publishedAt as string);
    }
    const post = await db.blogPost.create({ data: data as any });
    return NextResponse.json({ post });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Blog API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const parsed = blogPostUpdateSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }
    const data: Record<string, unknown> = { ...parsed.data };
    if (data.publishedAt && typeof data.publishedAt === "string") {
      data.publishedAt = new Date(data.publishedAt as string);
    }
    const post = await db.blogPost.update({ where: { id }, data: data as any });
    return NextResponse.json({ post });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Blog API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
