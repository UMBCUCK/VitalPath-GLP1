export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getConsultationPipeline,
  getConsultationMetrics,
  getPrescriptionPipeline,
} from "@/lib/admin-telehealth";
import { TelehealthClient } from "./telehealth-client";

export default async function AdminTelehealthPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [pipeline, metrics, prescriptions] = await Promise.all([
    getConsultationPipeline(),
    getConsultationMetrics(),
    getPrescriptionPipeline(),
  ]);

  return (
    <TelehealthClient
      pipeline={pipeline}
      metrics={metrics}
      prescriptions={prescriptions}
    />
  );
}
