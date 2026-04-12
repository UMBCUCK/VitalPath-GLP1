"use client";

import { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  "142 people started their journey this week",
  "Sarah from TX lost 34 lbs in 4 months",
  "94% of members would recommend VitalPath",
  "Average weight loss: 15% of body weight",
];

export function SocialProofBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const cycle = useCallback(() => {
    setVisible(false);
    const fadeTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
      setVisible(true);
    }, 400);
    return fadeTimer;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      cycle();
    }, 4000);
    return () => clearInterval(interval);
  }, [cycle]);

  return (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-navy-50/60 px-4 py-2.5">
      <Users className="h-3.5 w-3.5 shrink-0 text-teal" />
      <p
        className={cn(
          "text-xs font-medium text-graphite-500 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {messages[current]}
      </p>
    </div>
  );
}
