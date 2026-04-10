import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protein Calculator — Daily Protein Intake for Weight Loss",
  description:
    "Free protein calculator. Find your ideal daily protein intake based on body weight, activity level, and goals. Especially important during GLP-1-supported weight management for preserving lean muscle.",
  openGraph: {
    title: "Protein Calculator — How Much Protein Do You Need? | Nature's Journey",
    description:
      "Calculate your optimal daily protein range. Get per-meal targets to support lean muscle during weight loss.",
  },
};

export default function ProteinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
