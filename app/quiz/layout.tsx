import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Weight Loss Assessment — See If You Qualify",
  description:
    "Take a free 2-minute assessment to see if you qualify for GLP-1 weight loss treatment. No commitment required. Get evaluated by a licensed provider online.",
  openGraph: {
    title: "Free Weight Loss Assessment | Nature's Journey",
    description: "2-minute assessment. See if you qualify for GLP-1 weight loss medication. No commitment, no appointment needed.",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
