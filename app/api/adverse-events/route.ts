import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

const adverseEventSchema = z.object({
  severity: z.enum(["MILD", "MODERATE", "SEVERE", "LIFE_THREATENING"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  medicationName: z.string().optional(),
  onsetDate: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = adverseEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { severity, description, medicationName, onsetDate } = parsed.data;

    // Create the adverse event report
    await db.adverseEventReport.create({
      data: {
        userId: session.userId,
        severity,
        description,
        medicationName: medicationName || null,
        onsetDate: onsetDate ? new Date(onsetDate) : null,
      },
    });

    // Create a confirmation notification for the user
    await db.notification.create({
      data: {
        userId: session.userId,
        type: "SYSTEM",
        title: "Adverse event report received",
        body: "Your report has been submitted and will be reviewed by your care team. You will be contacted if further information is needed.",
        link: "/dashboard/treatment",
      },
    });

    // If severity is SEVERE or LIFE_THREATENING, create an additional urgent notification
    if (severity === "SEVERE" || severity === "LIFE_THREATENING") {
      await db.notification.create({
        data: {
          userId: session.userId,
          type: "SYSTEM",
          title: "Urgent: Please contact emergency services if needed",
          body: "You reported a severe or life-threatening event. If you are in immediate danger, call 911. For urgent assistance, call our care line at (888) 509-2745. Your care team has been alerted and will prioritize your case.",
          link: "/dashboard/messages",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Adverse Events API]", error);
    return NextResponse.json(
      { error: "Failed to submit adverse event report" },
      { status: 500 }
    );
  }
}
