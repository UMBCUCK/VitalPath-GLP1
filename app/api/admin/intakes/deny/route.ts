import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { intakeId } = await req.json();

    const intake = await db.intakeSubmission.update({
      where: { id: intakeId },
      data: { status: "DENIED", eligibilityResult: "NOT_ELIGIBLE" },
    });

    // Notify patient
    await db.notification.create({
      data: {
        userId: intake.userId,
        type: "SYSTEM",
        title: "Eligibility update",
        body: "Based on your provider evaluation, GLP-1 medication is not recommended at this time. Your provider will discuss alternative options.",
        link: "/dashboard",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Deny Intake]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
