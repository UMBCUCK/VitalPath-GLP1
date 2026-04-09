import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
}

export function SectionShell({ children, className, id, as: Tag = "section" }: SectionShellProps) {
  return (
    <Tag id={id} className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
