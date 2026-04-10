import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import {
  createResellerSession,
  destroyResellerSession,
} from "@/lib/reseller-auth";

// ── POST: Login ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check that user has a reseller profile
    const resellerProfile = await db.resellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, status: true, displayName: true },
    });

    if (!resellerProfile) {
      return NextResponse.json(
        { error: "No reseller account found for this email" },
        { status: 403 }
      );
    }

    if (resellerProfile.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your reseller account is not active. Contact support." },
        { status: 403 }
      );
    }

    // Create session
    await createResellerSession(resellerProfile.id);

    return NextResponse.json({
      success: true,
      reseller: {
        id: resellerProfile.id,
        displayName: resellerProfile.displayName,
      },
    });
  } catch (error) {
    console.error("[Reseller Auth POST]", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

// ── DELETE: Logout ─────────────────────────────────────────────

export async function DELETE() {
  try {
    await destroyResellerSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Reseller Auth DELETE]", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
