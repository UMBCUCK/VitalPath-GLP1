import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const createUserSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  role: z.enum(["ADMIN", "SUPPORT"], {
    message: "Role must be ADMIN or SUPPORT",
  }),
});

// ── GET: list admin and support users ───────────────────────
export async function GET() {
  try {
    await requireAdmin();

    const users = await db.user.findMany({
      where: { role: { in: ["ADMIN", "SUPPORT"] } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Users GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ── POST: create a new admin or support user ────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    // Check for existing user
    const existing = await db.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await db.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        role: parsed.data.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "CREATE_ADMIN_USER",
        entity: "User",
        entityId: user.id,
        details: {
          email: parsed.data.email,
          role: parsed.data.role,
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Users POST]", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
