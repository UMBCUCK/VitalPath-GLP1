"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, UserCheck, Star } from "lucide-react";

const notifications = [
  { icon: ShoppingBag, text: "Over 3,200 patients started treatment this month", time: "Program stats", color: "text-navy" },
  { icon: TrendingUp, text: "Member story: 28 lbs lost on the Premium plan", time: "Individual result · Not typical", color: "text-emerald-600" },
  { icon: Star, text: "94% of members would recommend to a friend", time: "Post-program member survey", color: "text-gold" },
  { icon: TrendingUp, text: "Members average 15% body weight loss over 12 months", time: "Member data · Individual results vary", color: "text-emerald-600" },
  { icon: UserCheck, text: "Most patients complete their assessment in under 10 min", time: "Program data", color: "text-teal" },
  { icon: Star, text: "4.9/5 average rating", time: "2,400+ post-program survey responses", color: "text-gold" },
  { icon: ShoppingBag, text: "GLP-1 program starting at $179/mo", time: "Current pricing", color: "text-navy" },
  { icon: TrendingUp, text: "30-day satisfaction guarantee on all plans", time: "See terms for details", color: "text-emerald-600" },
];

export function SocialProofNotification() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show first notification after 8 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 8000);

    return () => clearTimeout(initialTimer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || !visible) return;

    // Auto-hide after 5 seconds, show next after 25-40 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    const nextTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % notifications.length);
      setVisible(true);
    }, 25000 + Math.random() * 15000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [current, visible, dismissed]);

  if (dismissed || !visible) return null;

  const notif = notifications[current];

  return (
    <div className="fixed bottom-20 left-4 z-40 w-72 animate-in slide-in-from-bottom-4 duration-300 sm:bottom-6">
      <div className="rounded-xl border border-navy-100/60 bg-white p-3 shadow-lg">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy-100 text-[10px] text-graphite-400 hover:bg-navy-200"
          aria-label="Dismiss"
        >
          ×
        </button>
        <div className="flex items-start gap-2.5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 ${notif.color}`}>
            <notif.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-navy leading-snug">{notif.text}</p>
            <p className="mt-0.5 text-[10px] text-graphite-400">{notif.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
