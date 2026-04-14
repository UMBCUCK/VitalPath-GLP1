import { cn } from "@/lib/utils";

/** Nature's Journey three-leaf logo mark */
export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-16 w-16", className)}
      aria-hidden="true"
    >
      {/* Left leaf */}
      <path
        d="M14 28C14 28 6 22 8 12C8 12 14 8 18 16C18 16 16 24 14 28Z"
        fill="url(#leaf-left)"
      />
      {/* Center leaf */}
      <path
        d="M20 26C20 26 14 18 18 6C18 6 22 6 26 6C26 6 22 18 20 26Z"
        fill="url(#leaf-center)"
      />
      {/* Right leaf */}
      <path
        d="M26 28C26 28 34 22 32 12C32 12 26 8 22 16C22 16 24 24 26 28Z"
        fill="url(#leaf-right)"
      />
      {/* Center vein highlight */}
      <path
        d="M20 28L20 10"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <defs>
        <linearGradient id="leaf-left" x1="8" y1="28" x2="18" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#005066" />
          <stop offset="1" stopColor="#0098D4" />
        </linearGradient>
        <linearGradient id="leaf-center" x1="20" y1="26" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0077A8" />
          <stop offset="1" stopColor="#00BAEE" />
        </linearGradient>
        <linearGradient id="leaf-right" x1="32" y1="28" x2="22" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#005066" />
          <stop offset="1" stopColor="#0098D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Full brand logo: leaf icon + "Nature's Journey" text */
export function BrandLogo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LeafIcon />
      {showText && (
        <span className="text-lg font-bold text-navy tracking-tight leading-tight">
          Natures Journey
        </span>
      )}
    </div>
  );
}
