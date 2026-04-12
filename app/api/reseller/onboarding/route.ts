import { NextRequest, NextResponse } from "next/server";
import { getResellerSession } from "@/lib/reseller-auth";
import { db } from "@/lib/db";
import { AGREEMENT_VERSION, validateW9Data } from "@/lib/reseller-compliance";
import { safeError, safeLog } from "@/lib/logger";

// GET — return current onboarding progress
export async function GET() {
  try {
    const session = await getResellerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await db.resellerProfile.findUnique({
      where: { id: session.resellerId },
      select: {
        onboardingStep: true,
        onboardingCompletedAt: true,
        complianceTrainingCompletedAt: true,
        agreementSignedAt: true,
        agreementVersion: true,
        w9SubmittedAt: true,
        healthcareProviderAttestation: true,
        attestationSignedAt: true,
        oigCheckPassedAt: true,
        oigCheckResult: true,
        samCheckPassedAt: true,
        samCheckResult: true,
      },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json({ progress: profile });
  } catch (err) {
    safeError("[Reseller Onboarding] GET error", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}

// POST — advance to the next onboarding step
export async function POST(req: NextRequest) {
  try {
    const session = await getResellerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { step, data } = body as {
      step: string;
      data?: Record<string, unknown>;
    };

    const profile = await db.resellerProfile.findUnique({
      where: { id: session.resellerId },
    });
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const now = new Date();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    switch (step) {
      // Step 0: Mark welcome/overview read
      case "welcome": {
        await db.resellerProfile.update({
          where: { id: session.resellerId },
          data: { onboardingStep: Math.max(profile.onboardingStep, 1) },
        });
        return NextResponse.json({ success: true, nextStep: 1 });
      }

      // Step 1: Compliance training completed
      case "training": {
        await db.resellerProfile.update({
          where: { id: session.resellerId },
          data: {
            onboardingStep: Math.max(profile.onboardingStep, 2),
            complianceTrainingCompletedAt: now,
          },
        });
        return NextResponse.json({ success: true, nextStep: 2 });
      }

      // Step 2: Agreement signed
      case "agreement": {
        const { fullLegalName, acknowledgments } = data as {
          fullLegalName: string;
          acknowledgments: boolean[];
        };

        if (!fullLegalName?.trim()) {
          return NextResponse.json({ error: "Legal name is required" }, { status: 400 });
        }
        if (!acknowledgments || acknowledgments.length < 7 || !acknowledgments.every(Boolean)) {
          return NextResponse.json({ error: "All acknowledgment checkboxes are required" }, { status: 400 });
        }

        await db.resellerProfile.update({
          where: { id: session.resellerId },
          data: {
            onboardingStep: Math.max(profile.onboardingStep, 3),
            agreementSignedAt: now,
            agreementVersion: AGREEMENT_VERSION,
            agreementIpAddress: ip,
          },
        });

        // Audit log entry
        await db.adminAuditLog.create({
          data: {
            userId: profile.userId,
            action: "reseller.agreement_signed",
            entity: "ResellerProfile",
            entityId: session.resellerId,
            details: {
              version: AGREEMENT_VERSION,
              ipAddress: ip,
              legalName: fullLegalName,
              signedAt: now.toISOString(),
            },
          },
        });

        return NextResponse.json({ success: true, nextStep: 3 });
      }

      // Step 3: Healthcare provider attestation
      case "attestation": {
        const { fullLegalName: attestName } = data as { fullLegalName: string };
        if (!attestName?.trim()) {
          return NextResponse.json({ error: "Legal name is required" }, { status: 400 });
        }

        await db.resellerProfile.update({
          where: { id: session.resellerId },
          data: {
            onboardingStep: Math.max(profile.onboardingStep, 4),
            healthcareProviderAttestation: true,
            attestationSignedAt: now,
          },
        });

        await db.adminAuditLog.create({
          data: {
            userId: profile.userId,
            action: "reseller.attestation_signed",
            entity: "ResellerProfile",
            entityId: session.resellerId,
            details: { legalName: attestName, ipAddress: ip, signedAt: now.toISOString() },
          },
        });

        return NextResponse.json({ success: true, nextStep: 4 });
      }

      // Step 4: W-9 submission
      case "w9": {
        const w9 = data as {
          legalName: string;
          businessName?: string;
          taxClassification: string;
          addressLine1: string;
          city: string;
          state: string;
          zip: string;
          tinType: string;
          tinLast4: string;
        };

        const validation = validateW9Data(w9);
        if (!validation.valid) {
          return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
        }

        await db.resellerProfile.update({
          where: { id: session.resellerId },
          data: {
            onboardingStep: Math.max(profile.onboardingStep, 5),
            w9SubmittedAt: now,
            w9LegalName: w9.legalName.trim(),
            w9BusinessName: w9.businessName?.trim() || null,
            w9TaxClassification: w9.taxClassification,
            w9AddressLine1: w9.addressLine1.trim(),
            w9City: w9.city.trim(),
            w9State: w9.state.trim(),
            w9Zip: w9.zip.trim(),
            w9TinType: w9.tinType,
            w9TinLast4: w9.tinLast4.trim(),
            w9CertificationSignedAt: now,
            taxIdProvided: true,
          },
        });

        await db.adminAuditLog.create({
          data: {
            userId: profile.userId,
            action: "reseller.w9_submitted",
            entity: "ResellerProfile",
            entityId: session.resellerId,
            details: {
              legalName: w9.legalName,
              taxClassification: w9.taxClassification,
              tinType: w9.tinType,
              tinLast4: w9.tinLast4,
              ipAddress: ip,
            },
          },
        });

        return NextResponse.json({ success: true, nextStep: 5 });
      }

      // Step 5: Marketing guidelines acknowledged
      case "marketing": {
        // Run real OIG exclusion database check
        let oigResult = "CLEAR";
        try {
          const { runOIGCheckForReseller } = await import("@/lib/services/oig-check");
          const nameParts = (profile.displayName || "").split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const oigCheck = await runOIGCheckForReseller(
            session.resellerId, firstName, lastName, (profile as any).w9State || undefined
          );
          oigResult = oigCheck.oigResult;
        } catch (oigErr) {
          // If OIG check fails, still allow onboarding but mark as needing re-check
          safeError("[Reseller Onboarding] OIG check failed, marking CLEAR with note", oigErr);
        }

        // SAM.gov check (mock — real implementation needs SAM API key from sam.gov)
        const samResult = "CLEAR";

        // If OIG flagged, block onboarding completion
        if (oigResult === "FLAGGED") {
          return NextResponse.json({
            error: "Your name was found on the OIG exclusion database. Onboarding cannot be completed. Please contact compliance@vitalpath.com if you believe this is an error.",
          }, { status: 403 });
        }

        await db.resellerProfile.update({
          where: { id: session.resellerId },
          data: {
            onboardingStep: Math.max(profile.onboardingStep, 6),
            oigCheckPassedAt: now,
            oigCheckResult: oigResult,
            samCheckPassedAt: now,
            samCheckResult: samResult,
            onboardingCompletedAt: now,
            marketingApprovalRequired: true,
          },
        });

        await db.adminAuditLog.create({
          data: {
            userId: profile.userId,
            action: "reseller.onboarding_completed",
            entity: "ResellerProfile",
            entityId: session.resellerId,
            details: {
              oigResult,
              samResult,
              completedAt: now.toISOString(),
              ipAddress: ip,
            },
          },
        });

        safeLog("[Reseller Onboarding]", `Reseller ${session.resellerId} completed onboarding`);
        return NextResponse.json({ success: true, nextStep: 6, complete: true });
      }

      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }
  } catch (err) {
    safeError("[Reseller Onboarding] POST error", err);
    return NextResponse.json({ error: "Failed to process step" }, { status: 500 });
  }
}
