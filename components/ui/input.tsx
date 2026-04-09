import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-navy-200 bg-white px-4 py-2 text-sm text-navy-800 ring-offset-background",
        "placeholder:text-navy-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/30 focus-visible:border-teal",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
