"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Photo {
  id: string;
  imageUrl: string;
  date: Date | string;
  weightLbs?: number | null;
}

interface PhotoComparisonProps {
  photos: Photo[];
}

export function PhotoComparison({ photos }: PhotoComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // All hooks MUST be above any conditional return
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(5, Math.min(95, x)));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(5, Math.min(95, x)));
  }, []);

  // Need at least 2 photos — early return AFTER all hooks
  if (photos.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4 text-teal" /> Progress Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-xl bg-navy-50/50 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Camera className="h-7 w-7 text-graphite-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-navy">
                {photos.length === 0 ? "No progress photos yet" : "Add one more photo to compare"}
              </p>
              <p className="text-xs text-graphite-400 mt-1">
                Take regular photos to see your transformation over time
              </p>
            </div>
            <Link href="/dashboard/photos">
              <Button size="sm" className="gap-2">
                <Camera className="h-3.5 w-3.5" />
                Take a progress photo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const beforePhoto = photos[photos.length - 1]; // earliest
  const afterPhoto = photos[0]; // latest

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4 text-teal" /> Progress Photos
          </CardTitle>
          <Link href="/dashboard/photos">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Camera className="h-3 w-3" /> New Photo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Slider comparison */}
        <div
          ref={containerRef}
          className="relative aspect-[3/4] max-h-[400px] w-full cursor-ew-resize overflow-hidden rounded-xl bg-gray-100 select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {/* After (full background) */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterPhoto.imageUrl}
              alt="Current progress"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Before (clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforePhoto.imageUrl}
              alt="Starting point"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 z-10"
            style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          >
            <div className="h-full w-0.5 bg-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
              <div className="flex items-center gap-0">
                <ChevronLeft className="h-3.5 w-3.5 text-navy" />
                <ChevronRight className="h-3.5 w-3.5 text-navy" />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-navy/80 px-2.5 py-1.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-white">Before</p>
            <p className="text-[9px] text-navy-300">{formatDate(beforePhoto.date)}</p>
            {beforePhoto.weightLbs && (
              <p className="text-[9px] text-gold-400">{Math.round(beforePhoto.weightLbs)} lbs</p>
            )}
          </div>

          <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-navy/80 px-2.5 py-1.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-white">Now</p>
            <p className="text-[9px] text-navy-300">{formatDate(afterPhoto.date)}</p>
            {afterPhoto.weightLbs && (
              <p className="text-[9px] text-gold-400">{Math.round(afterPhoto.weightLbs)} lbs</p>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-graphite-300">
          Drag the slider to compare your progress
        </p>
      </CardContent>
    </Card>
  );
}
