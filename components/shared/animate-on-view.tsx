"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateOnViewProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in-up" | "fade-in-left";
  delay?: number;
}

export function AnimateOnView({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
}: AnimateOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? `animate-${animation}` : "opacity-0"} ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
