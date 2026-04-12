import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPaymentPlan, createPaymentPlan } from "@/lib/payment-plans";

export async function GET() {
  try {
    const session = await requireAuth();
    const plan = await getPaymentPlan(session.userId);

    return NextResponse.json({ plan });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Payment plans GET error:", error);
    return NextResponse.json({ error: "Failed to load payment plan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const { totalCents, installments, subscriptionId } = body;

    if (!totalCents || !installments) {
      return NextResponse.json(
        { error: "Missing required fields: totalCents, installments" },
        { status: 400 }
      );
    }

    if (installments < 2 || installments > 12) {
      return NextResponse.json(
        { error: "Installments must be between 2 and 12" },
        { status: 400 }
      );
    }

    if (totalCents < 100) {
      return NextResponse.json(
        { error: "Total must be at least $1.00" },
        { status: 400 }
      );
    }

    // Check if user already has an active plan
    const existing = await getPaymentPlan(session.userId);
    if (existing && existing.status === "ACTIVE") {
      return NextResponse.json(
        { error: "You already have an active payment plan" },
        { status: 409 }
      );
    }

    const plan = await createPaymentPlan(session.userId, totalCents, installments, subscriptionId);

    return NextResponse.json({ ok: true, plan });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Payment plans POST error:", error);
    return NextResponse.json({ error: "Failed to create payment plan" }, { status: 500 });
  }
}
