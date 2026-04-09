import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Personalized Plan — VitalPath",
  description:
    "View your personalized weight loss projection and recommended treatment plan. Start your GLP-1 weight management journey with VitalPath.",
};

export default function QualifyResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
