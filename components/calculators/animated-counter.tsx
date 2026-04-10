"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });
  const [display, setDisplay] = useState("0");
  const prevValue = useRef(0);

  useEffect(() => {
    if (!isInView) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value.toFixed(decimals));
      prevValue.current = value;
      return;
    }

    const from = prevValue.current;
    prevValue.current = value;

    const controls = animate(from, value, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setDisplay(latest.toFixed(decimals));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
