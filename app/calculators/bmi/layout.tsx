import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator — Check Your Body Mass Index",
  description:
    "Free BMI calculator. Enter your height and weight to calculate your body mass index instantly. Understand BMI categories and what they mean for GLP-1 weight management eligibility.",
  openGraph: {
    title: "BMI Calculator — Check Your Body Mass Index | VitalPath",
    description:
      "Calculate your BMI in seconds. Understand where you stand and whether you may qualify for provider-guided GLP-1 weight management.",
  },
};

export default function BMILayout({ children }: { children: React.ReactNode }) {
  return children;
}
