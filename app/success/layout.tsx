import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to VitalPath",
  description: "Your weight management journey starts now. Access your dashboard, complete your intake, and get started with your treatment plan.",
  robots: { index: false, follow: false },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
