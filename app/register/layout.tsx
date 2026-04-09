import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your VitalPath account to start your weight management journey. Take the assessment, get evaluated by a provider, and begin treatment.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
