import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getResellerSession } from "@/lib/reseller-auth";
import {
  getResellerNetwork,
  getResellerOverrideEarnings,
  getResellerTierProgress,
} from "@/lib/reseller-data";

// ── GET: Fetch network data ────────────────────────────────────

export async function GET() {
  try {
    const session = await getResellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [network, overrideEarnings, tierProgress] = await Promise.all([
      getResellerNetwork(session.resellerId),
      getResellerOverrideEarnings(session.resellerId),
      getResellerTierProgress(session.resellerId),
    ]);

    return NextResponse.json({ network, overrideEarnings, tierProgress });
  } catch (error) {
    console.error("[Reseller Network GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch network data" },
      { status: 500 }
    );
  }
}

// ── POST: Invite a sub-reseller ────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await getResellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, displayName, companyName } = body;

    if (!email || !displayName) {
      return NextResponse.json(
        { error: "Email and display name are required" },
        { status: 400 }
      );
    }

    // Check the inviting reseller exists and get their depth
    const inviter = await db.resellerProfile.findUnique({
      where: { id: session.resellerId },
      select: { networkDepth: true, referralCode: true },
    });

    if (!inviter) {
      return NextResponse.json(
        { error: "Inviting reseller not found" },
        { status: 404 }
      );
    }

    // Enforce max depth of 3
    if (inviter.networkDepth >= 3) {
      return NextResponse.json(
        { error: "Maximum network depth reached. Sub-resellers at this level cannot recruit further." },
        { status: 400 }
      );
    }

    // Check if a user with this email already exists as a reseller
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    });

    if (existingUser) {
      const existingReseller = await db.resellerProfile.findUnique({
        where: { userId: existingUser.id },
      });
      if (existingReseller) {
        return NextResponse.json(
          { error: "This email is already associated with a reseller account" },
          { status: 409 }
        );
      }
    }

    // Create a pending reseller invitation by logging a network event
    await db.resellerNetworkEvent.create({
      data: {
        eventType: "INVITE",
        resellerId: session.resellerId,
        metadata: JSON.stringify({
          invitedEmail: email.toLowerCase().trim(),
          invitedName: displayName,
          invitedCompany: companyName || null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invitation recorded for ${email}. They will be linked to your network when they sign up using your referral code.`,
    });
  } catch (error) {
    console.error("[Reseller Network POST]", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
