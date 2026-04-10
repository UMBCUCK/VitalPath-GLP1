import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "See If You Qualify — Free GLP-1 Assessment | Nature's Journey",
  description:
    "Complete a quick health assessment to see if you qualify for GLP-1 weight loss treatment. Get a personalized weight loss projection and plan recommendation from licensed providers.",
  openGraph: {
    title: "See If You Qualify | Nature's Journey",
    description: "Quick health assessment with personalized weight loss projections. See if you qualify for GLP-1 treatment from licensed providers.",
  },
};

export default function QualifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
