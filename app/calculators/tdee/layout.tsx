import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TDEE Calculator — Total Daily Energy Expenditure",
  description:
    "Free TDEE calculator using the Mifflin-St Jeor equation. Estimate your daily calorie burn based on age, weight, height, and activity level. Plan for weight loss, maintenance, or muscle gain.",
  openGraph: {
    title: "TDEE Calculator — How Many Calories Do You Burn? | VitalPath",
    description:
      "Calculate your Total Daily Energy Expenditure. Get maintenance, weight loss, and weight gain calorie targets based on your body and activity level.",
  },
};

export default function TDEELayout({ children }: { children: React.ReactNode }) {
  return children;
}
