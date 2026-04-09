import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your VitalPath account to access your dashboard, track progress, and manage your weight management program.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
