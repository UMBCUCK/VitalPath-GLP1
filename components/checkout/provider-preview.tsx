"use client";

import { useState } from "react";
import { Clock, MessageCircle, Award, Star, Shield, GraduationCap, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const providers = [
  {
    initials: "SC",
    name: "Dr. Sarah Chen, MD",
    credential: "Internal Medicine, Obesity Medicine",
    institution: "Harvard Medical School",
    experience: "14 years",
    patients: "5,200+",
    rating: 4.9,
    reviews: 847,
    specialties: ["GLP-1 Protocols", "Metabolic Syndrome", "Women's Health"],
    bio: "Specializes in GLP-1 treatment protocols with 8 peer-reviewed publications on weight management.",
  },
  {
    initials: "MW",
    name: "Dr. Marcus Webb, DO",
    credential: "Endocrinology, Family Medicine",
    institution: "Johns Hopkins University",
    experience: "19 years",
    patients: "8,100+",
    rating: 4.9,
    reviews: 1203,
    specialties: ["Diabetes Management", "Clinical Trials", "Hormone Therapy"],
    bio: "Clinical trial investigator on SURMOUNT-2 tirzepatide study. Board-certified in obesity medicine.",
  },
  {
    initials: "PN",
    name: "Dr. Priya Nair, MD",
    credential: "Preventive Medicine, Telehealth",
    institution: "UCLA School of Medicine",
    experience: "11 years",
    patients: "3,800+",
    rating: 4.8,
    reviews: 612,
    specialties: ["PCOS", "Perimenopause", "Telehealth Medicine"],
    bio: "Pioneer in virtual weight management. Specialty focus on PCOS and perimenopause-related weight gain.",
  },
];

const trustDetails = [
  { icon: Clock, text: "Provider review within 24 hours (business days)" },
  { icon: MessageCircle, text: "Direct messaging from your dashboard" },
  { icon: Shield, text: "HIPAA-encrypted consultations" },
  { icon: Award, text: "Board-certified in obesity medicine" },
];

export function ProviderPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const provider = providers[selectedIdx];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-navy">Your Care Team</h3>
          <Badge variant="outline" className="text-[10px]">
            <GraduationCap className="h-2.5 w-2.5 mr-1" />
            Board-Certified Providers
          </Badge>
        </div>

        {/* Provider selector */}
        <div className="flex gap-2 mb-5">
          {providers.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelectedIdx(i)}
              className={cn(
                "flex-1 flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all",
                selectedIdx === i
                  ? "border-teal bg-teal-50/50"
                  : "border-navy-100 hover:border-navy-200"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                selectedIdx === i
                  ? "bg-gradient-to-br from-teal to-atlantic"
                  : "bg-navy-200 text-navy"
              )}>
                {p.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-navy truncate">{p.name}</p>
                <p className="text-[10px] text-graphite-400 truncate">{p.institution}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Selected provider detail */}
        <div className="rounded-xl bg-navy-50/40 p-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic text-xl font-bold text-white">
              {provider.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-navy">{provider.name}</h4>
              <p className="text-xs text-graphite-500">{provider.credential}</p>
              <p className="text-[10px] text-graphite-400">{provider.institution}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-[10px] text-graphite-500">
                  <Star className="h-3 w-3 text-gold fill-gold" />
                  {provider.rating}/5 ({provider.reviews} reviews)
                </span>
                <span className="text-[10px] text-graphite-400">
                  {provider.experience} experience
                </span>
                <span className="text-[10px] text-graphite-400">
                  {provider.patients} patients treated
                </span>
              </div>

              <p className="mt-2 text-xs text-graphite-600 leading-relaxed">{provider.bio}</p>

              <div className="mt-2 flex flex-wrap gap-1">
                {provider.specialties.map((s) => (
                  <Badge key={s} variant="outline" className="text-[9px] px-1.5 py-0">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust details */}
        <div className="grid grid-cols-2 gap-2">
          {trustDetails.map((d) => (
            <div key={d.text} className="flex items-center gap-2 rounded-lg bg-white p-2">
              <d.icon className="h-3.5 w-3.5 text-teal shrink-0" />
              <span className="text-[10px] text-graphite-500">{d.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
