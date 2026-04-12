import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";

// GET /api/admin/resellers/[id]/violations — get violation history
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const violations = await db.adminAuditLog.findMany({
      where: {
        entityId: id,
        action: { startsWith: "reseller.violation" },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        action: true,
        details: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ violations: violations.map((v) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    })) });
  } catch (err) {
    safeError("[Violations] GET error", err);
    return NextResponse.json({ error: "Failed to load violations" }, { status: 500 });
  }
}

// POST /api/admin/resellers/[id]/violations — log a compliance violation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const { level, description } = await req.json() as {
      level: "WARNING" | "SUSPENSION" | "TERMINATION";
      description: string;
    };

    if (!level || !description?.trim()) {
      return NextResponse.json({ error: "Level and description are required" }, { status: 400 });
    }

    const reseller = await db.resellerProfile.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        displayName: true,
        contactEmail: true,
        complianceViolationCount: true,
        status: true,
      },
    });

    if (!reseller) return NextResponse.json({ error: "Reseller not found" }, { status: 404 });

    const newCount = reseller.complianceViolationCount + 1;
    const updateData: Record<string, unknown> = {
      complianceViolationCount: newCount,
    };

    // Auto-suspend at 3+ warnings
    if (level === "SUSPENSION" || (level === "WARNING" && newCount >= 3)) {
      updateData.status = "SUSPENDED";
    }
    if (level === "TERMINATION") {
      updateData.status = "TERMINATED";
    }

    await db.resellerProfile.update({ where: { id }, data: updateData });

    // Audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: `reseller.violation.${level.toLowerCase()}`,
        entity: "ResellerProfile",
        entityId: id,
        details: {
          level,
          description,
          violationNumber: newCount,
          resultingStatus: updateData.status || reseller.status,
        },
      },
    });

    // Email the reseller
    try {
      const emailService = createEmailService();
      const statusLabels = {
        WARNING: { subject: "Compliance Warning", color: "#f59e0b" },
        SUSPENSION: { subject: "Account Suspended — Compliance Violation", color: "#ef4444" },
        TERMINATION: { subject: "Account Terminated — Compliance Violation", color: "#991b1b" },
      };
      const { subject, color } = statusLabels[level];

      await emailService.send({
        to: reseller.contactEmail,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:${color};padding:32px;border-radius:16px 16px 0 0;">
              <h1 style="color:#fff;font-size:22px;margin:0;">Compliance ${level === "WARNING" ? "Warning" : level === "SUSPENSION" ? "Suspension Notice" : "Termination Notice"}</h1>
            </div>
            <div style="background:#fff;border:1px solid #e8edf4;border-top:none;padding:32px;border-radius:0 0 16px 16px;">
              <p style="color:#677A8A;font-size:15px;">Hi ${reseller.displayName},</p>
              <p style="color:#677A8A;font-size:15px;">This notice is to inform you of a compliance violation on your VitalPath reseller account.</p>
              <div style="background:#f8f8f8;border-left:4px solid ${color};padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
                <p style="color:#333;font-size:14px;font-weight:600;margin:0 0 4px;">Violation Detail:</p>
                <p style="color:#677A8A;font-size:14px;margin:0;">${description}</p>
              </div>
              ${level === "WARNING" ? `<p style="color:#677A8A;font-size:14px;">This is warning #${newCount}. Please note that 3 warnings result in automatic account suspension.</p>` : ""}
              ${level === "SUSPENSION" ? `<p style="color:#ef4444;font-size:14px;font-weight:600;">Your account has been suspended. All marketing activities must cease immediately. Commission payouts are on hold until the matter is resolved.</p>` : ""}
              ${level === "TERMINATION" ? `<p style="color:#991b1b;font-size:14px;font-weight:600;">Your reseller account has been permanently terminated. All pending commissions are forfeited. You must immediately remove all VitalPath marketing materials.</p>` : ""}
              <p style="color:#9BAAB5;font-size:12px;margin-top:24px;">If you believe this was issued in error, contact compliance@vitalpath.com within 5 business days.</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      safeError("[Violations] Email failed", emailErr);
    }

    safeLog("[Violations]", `${level} logged for reseller ${id} (violation #${newCount})`);
    return NextResponse.json({
      success: true,
      violationCount: newCount,
      resultingStatus: updateData.status || reseller.status,
    });
  } catch (err) {
    safeError("[Violations] Error", err);
    return NextResponse.json({ error: "Failed to log violation" }, { status: 500 });
  }
}
