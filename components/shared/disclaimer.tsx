import { cn } from "@/lib/utils";

interface DisclaimerProps {
  text: string;
  className?: string;
  size?: "sm" | "default";
}

export function Disclaimer({ text, className, size = "default" }: DisclaimerProps) {
  return (
    <p
      className={cn(
        "text-graphite-400 leading-relaxed",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
    >
      {text}
    </p>
  );
}
