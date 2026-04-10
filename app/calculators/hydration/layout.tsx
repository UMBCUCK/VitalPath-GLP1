import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hydration Calculator — Daily Water Intake Goal",
  description:
    "Free hydration calculator. Calculate your optimal daily water intake based on body weight and activity level. Proper hydration is especially important during GLP-1 weight management treatment.",
  openGraph: {
    title: "Hydration Calculator — How Much Water Should You Drink? | Nature's Journey",
    description:
      "Calculate your daily water goal in ounces, glasses, and liters. Get a time-of-day hydration schedule for optimal results.",
  },
};

export default function HydrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
