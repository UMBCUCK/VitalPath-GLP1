import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Assessment Results — Recommended Plan",
  description:
    "Based on your assessment, here's your recommended Nature's Journey weight management plan. See your personalized treatment recommendation.",
  robots: { index: false, follow: false },
};

export default function QuizResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
