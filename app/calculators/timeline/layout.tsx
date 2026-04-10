import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weight Loss Timeline Calculator — How Long to Reach Your Goal",
  description:
    "Free weight loss timeline calculator. See your projected week-by-week progress with GLP-1 medication versus diet alone. Personalized based on your body stats.",
  openGraph: {
    title: "Weight Loss Timeline Calculator | Nature's Journey",
    description:
      "Visualize your personalized weight loss journey. Compare projected results with GLP-1 treatment versus diet alone.",
  },
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
