import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <Badge variant="default" className="mb-4">
          {eyebrow}
        </Badge>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl",
          align === "center" && "mx-auto max-w-3xl"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg text-graphite-500 leading-relaxed",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
