import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Intake — Complete Your Health Profile",
  description:
    "Complete your secure medical intake form for GLP-1 weight management. HIPAA-compliant, reviewed by a licensed provider within 24 hours.",
  robots: { index: false, follow: false },
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
