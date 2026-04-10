import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const medicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  type: z.enum(["branded", "generic", "compounded"]),
  form: z.enum(["pill", "pen", "injection", "oral"]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

async function requireAdmin(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// GET — list all medications (admin, includes inactive)
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const medications = await (db as any).medicationCatalog.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ medications });
  } catch {
    return NextResponse.json({ medications: [] });
  }
}

// POST — create a new medication
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const body = await req.json();
  const parsed = medicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  try {
    const med = await (db as any).medicationCatalog.create({
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
        description: parsed.data.description || null,
      },
    });
    return NextResponse.json({ medication: med });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A medication with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create medication" }, { status: 500 });
  }
}

// PUT — update an existing medication
export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const body = await req.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const parsed = medicationSchema.partial().safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  try {
    const med = await (db as any).medicationCatalog.update({
      where: { id },
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl === "" ? null : parsed.data.imageUrl,
      },
    });
    return NextResponse.json({ medication: med });
  } catch {
    return NextResponse.json({ error: "Failed to update medication" }, { status: 500 });
  }
}

// DELETE — remove a medication
export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  try {
    await (db as any).medicationCatalog.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete medication" }, { status: 500 });
  }
}
