import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getConsultationPipeline,
  syncConsultationStatus,
  getConsultationMetrics,
  getPrescriptionPipeline,
} from "@/lib/admin-telehealth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "25", 10);
  const status = searchParams.get("status") || undefined;

  const [pipeline, metrics, prescriptions] = await Promise.all([
    getConsultationPipeline(page, limit, status),
    getConsultationMetrics(),
    getPrescriptionPipeline(),
  ]);

  return NextResponse.json({ pipeline, metrics, prescriptions });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { trackerId } = body;

  if (!trackerId) {
    return NextResponse.json(
      { error: "trackerId is required" },
      { status: 400 }
    );
  }

  const result = await syncConsultationStatus(trackerId);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
