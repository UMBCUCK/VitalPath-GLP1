import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/analytics";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const result = await registerUser(parsed.data);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Create Stripe customer
    if (process.env.STRIPE_SECRET_KEY && result.user) {
      try {
        const customer = await stripe.customers.create({
          email: parsed.data.email,
          name: `${parsed.data.firstName} ${parsed.data.lastName}`,
          metadata: { userId: result.user.id },
        });

        await db.patientProfile.create({
          data: {
            userId: result.user.id,
            stripeCustomerId: customer.id,
          },
        });
      } catch (err) {
        console.error("[Register] Stripe customer creation failed:", err);
        // Non-blocking — user is still registered
      }
    }

    await trackServerEvent("CompleteRegistration", { email: parsed.data.email });

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("[Register API]", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
