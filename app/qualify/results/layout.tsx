import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Personalized Plan — Nature's Journey",
  description:
    "View your personalized weight loss projection and recommended treatment plan. Start your GLP-1 weight management journey with Nature's Journey.",
};

export default function QualifyResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
