import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Health Profile Calculator — All Your Numbers in One Place",
  description:
    "Enter your stats once and get your BMI, daily calories, protein target, hydration goal, and weight loss timeline — all personalized and saveable to your account.",
  openGraph: {
    title: "Complete Health Profile Calculator | VitalPath",
    description:
      "One calculator for all your health numbers. BMI, TDEE, protein, hydration, and projected timeline — personalized and saved to your account.",
  },
};

export default function CompleteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
