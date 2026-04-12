import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMarketingReviewQueue, getAllMarketingSubmissions } from "@/lib/admin-reseller-compliance";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";

// GET — list marketing content submissions (pending queue or all)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") || "PENDING";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    if (status === "PENDING") {
      const data = await getMarketingReviewQueue(page);
      return NextResponse.json(data);
    }
    const data = await getAllMarketingSubmissions(page, 25, status);
    return NextResponse.json(data);
  } catch (err) {
    safeError("[Marketing Review] GET error", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PUT — approve, reject, or request revision on a submission
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { id, action, reviewNotes, rejectionReason } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: "id and action are required" }, { status: 400 });
    }

    const validActions = ["APPROVED", "REJECTED", "REVISION_REQUESTED"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `action must be: ${validActions.join(", ")}` }, { status: 400 });
    }

    if (action === "REJECTED" && !rejectionReason?.trim()) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }

    const submission = await db.marketingContentSubmission.findUnique({
      where: { id },
    });
    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    const updated = await db.marketingContentSubmission.update({
      where: { id },
      data: {
        status: action,
        reviewedBy: session.userId,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes?.trim() || null,
        rejectionReason: action === "REJECTED" ? rejectionReason.trim() : null,
      },
    });

    // Notify reseller via email
    try {
      const reseller = await db.resellerProfile.findUnique({
        where: { id: submission.resellerId },
        select: { contactEmail: true, displayName: true },
      });

      if (reseller) {
        const emailService = createEmailService();
        const statusLabels: Record<string, { subject: string; message: string; color: string }> = {
          APPROVED: {
            subject: `Marketing content approved: "${submission.title}"`,
            message: "Your submitted marketing content has been approved! You may now use it in your marketing activities.",
            color: "#10b981",
          },
          REJECTED: {
            subject: `Marketing content not approved: "${submission.title}"`,
            message: `Your submitted marketing content was not approved.\n\nReason: ${rejectionReason}\n\nPlease review the feedback and submit a revised version.`,
            color: "#ef4444",
          },
          REVISION_REQUESTED: {
            subject: `Revision requested: "${submission.title}"`,
            message: `Your submitted marketing content requires revisions before it can be approved.\n\nFeedback: ${reviewNotes || "Please review and resubmit."}`,
            color: "#f59e0b",
          },
        };
        const { subject, message, color } = statusLabels[action];

        await emailService.send({
          to: reseller.contactEmail,
          subject,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:${color};padding:32px;border-radius:16px 16px 0 0;">
                <h1 style="color:#fff;font-size:20px;margin:0;">${subject}</h1>
              </div>
              <div style="background:#fff;border:1px solid #e8edf4;border-top:none;padding:32px;border-radius:0 0 16px 16px;">
                <p style="color:#677A8A;font-size:14px;white-space:pre-line;">${message}</p>
                <div style="text-align:center;margin-top:24px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/reseller/marketing"
                     style="background:#0D2B45;color:#fff;padding:12px 28px;border-radius:99px;text-decoration:none;font-weight:600;display:inline-block;">
                    View in Dashboard
                  </a>
                </div>
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      safeError("[Marketing Review] Email notification failed", emailErr);
    }

    // Audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: `marketing.${action.toLowerCase()}`,
        entity: "MarketingContentSubmission",
        entityId: id,
        details: {
          resellerId: submission.resellerId,
          title: submission.title,
          reviewNotes,
          rejectionReason: action === "REJECTED" ? rejectionReason : undefined,
        },
      },
    });

    safeLog("[Marketing Review]", `${action} submission ${id} for reseller ${submission.resellerId}`);
    return NextResponse.json({ submission: updated });
  } catch (err) {
    safeError("[Marketing Review] PUT error", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
