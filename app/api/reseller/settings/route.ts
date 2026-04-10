import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getResellerSession } from "@/lib/reseller-auth";
import { getResellerProfileData } from "@/lib/reseller-data";

// ── GET: Current reseller profile ─────────────────────────────

export async function GET() {
  try {
    const session = await getResellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getResellerProfileData(session.resellerId);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[Reseller Settings GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// ── PUT: Update profile / payout preferences ──────────────────

export async function PUT(req: NextRequest) {
  try {
    const session = await getResellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Only allow updating specific fields
    const allowedFields: Record<string, boolean> = {
      displayName: true,
      companyName: true,
      contactEmail: true,
      contactPhone: true,
      payoutMethod: true,
      payoutBankName: true,
      payoutAccountLast4: true,
      payoutRoutingLast4: true,
      taxIdProvided: true,
    };

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields[key] && value !== undefined) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Validate payout method
    if (updateData.payoutMethod) {
      const validMethods = ["CREDIT", "BANK_ACH", "CHECK"];
      if (!validMethods.includes(updateData.payoutMethod as string)) {
        return NextResponse.json(
          { error: "Invalid payout method" },
          { status: 400 }
        );
      }
    }

    // Validate display name not empty
    if (updateData.displayName !== undefined && !updateData.displayName) {
      return NextResponse.json(
        { error: "Display name cannot be empty" },
        { status: 400 }
      );
    }

    const updated = await db.resellerProfile.update({
      where: { id: session.resellerId },
      data: updateData,
      select: {
        id: true,
        displayName: true,
        companyName: true,
        contactEmail: true,
        contactPhone: true,
        payoutMethod: true,
        payoutBankName: true,
        payoutAccountLast4: true,
        payoutRoutingLast4: true,
        taxIdProvided: true,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("[Reseller Settings PUT]", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
