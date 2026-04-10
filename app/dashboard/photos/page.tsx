"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image, Lock, Eye, EyeOff, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoType = "FRONT" | "SIDE" | "BACK";

interface PhotoEntry {
  id: string;
  type: PhotoType;
  date: string;
  isPublic: boolean;
  placeholder: boolean;
}

// Demo photos (placeholders)
const demoPhotos: PhotoEntry[] = [
  { id: "1", type: "FRONT", date: "Jan 15, 2026", isPublic: false, placeholder: true },
  { id: "2", type: "SIDE", date: "Jan 15, 2026", isPublic: false, placeholder: true },
  { id: "3", type: "FRONT", date: "Feb 15, 2026", isPublic: false, placeholder: true },
  { id: "4", type: "SIDE", date: "Feb 15, 2026", isPublic: false, placeholder: true },
  { id: "5", type: "FRONT", date: "Mar 15, 2026", isPublic: false, placeholder: true },
  { id: "6", type: "SIDE", date: "Mar 15, 2026", isPublic: false, placeholder: true },
];

export default function PhotosPage() {
  const [photos] = useState<PhotoEntry[]>(demoPhotos);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedType, setSelectedType] = useState<PhotoType>("FRONT");
  const [galleryConsent, setGalleryConsent] = useState(false);

  const filteredPhotos = photos.filter((p) => p.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Progress Photos</h2>
          <p className="text-sm text-graphite-400">Track visual changes over time</p>
        </div>
        <div className="flex gap-2">
          <Button variant={compareMode ? "default" : "outline"} size="sm" onClick={() => setCompareMode(!compareMode)} className="gap-2">
            <Image className="h-4 w-4" aria-hidden="true" /> {compareMode ? "Exit Compare" : "Compare"}
          </Button>
          <Button size="sm" className="gap-2">
            <Upload className="h-4 w-4" /> Upload Photo
          </Button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 rounded-xl bg-navy-50/50 px-4 py-3">
        <Lock className="h-4 w-4 text-navy-400" />
        <p className="text-xs text-graphite-500">Your photos are private by default. Only you can see them unless you opt into the results gallery.</p>
      </div>

      {/* Type filter */}
      <div className="flex gap-2">
        {(["FRONT", "SIDE", "BACK"] as PhotoType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              selectedType === type ? "bg-navy text-white" : "bg-white text-graphite-500 hover:bg-navy-50"
            )}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()} View
          </button>
        ))}
      </div>

      {compareMode ? (
        /* Compare mode - side by side */
        <Card>
          <CardHeader><CardTitle className="text-base">Before & After Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Badge variant="secondary" className="mb-3">Earliest</Badge>
                <div className="flex items-center justify-center rounded-2xl bg-navy-50/50 aspect-[3/4] border-2 border-dashed border-navy-200">
                  <div className="text-center">
                    <Camera className="mx-auto h-10 w-10 text-graphite-200" />
                    <p className="mt-2 text-sm text-graphite-400">Jan 15, 2026</p>
                    <p className="text-xs text-graphite-300">{selectedType.toLowerCase()} view</p>
                  </div>
                </div>
              </div>
              <div>
                <Badge variant="default" className="mb-3">Latest</Badge>
                <div className="flex items-center justify-center rounded-2xl bg-teal-50/50 aspect-[3/4] border-2 border-dashed border-teal/30">
                  <div className="text-center">
                    <Camera className="mx-auto h-10 w-10 text-teal/30" />
                    <p className="mt-2 text-sm text-graphite-400">Mar 15, 2026</p>
                    <p className="text-xs text-graphite-300">{selectedType.toLowerCase()} view</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-graphite-300">
              Upload photos at the same angle and distance for the best comparison.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Timeline mode */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-center rounded-xl bg-navy-50/50 aspect-[3/4] border-2 border-dashed border-navy-200 mb-3">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-graphite-200" />
                    <p className="mt-2 text-xs text-graphite-300">Photo placeholder</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy">{photo.date}</p>
                    <p className="text-xs text-graphite-400">{photo.type.toLowerCase()} view</p>
                  </div>
                  <Badge variant={photo.isPublic ? "default" : "secondary"} className="text-[10px]">
                    {photo.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload card */}
          <Card className="border-dashed border-2 border-navy-200 hover:border-teal/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-8 h-full min-h-[280px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                <Upload className="h-6 w-6 text-teal" />
              </div>
              <p className="mt-3 text-sm font-medium text-navy">Add New Photo</p>
              <p className="mt-1 text-xs text-graphite-400">JPEG or PNG, max 10MB</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery consent */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {galleryConsent ? <Eye className="mt-0.5 h-5 w-5 text-teal" /> : <EyeOff className="mt-0.5 h-5 w-5 text-graphite-400" />}
              <div>
                <p className="text-sm font-bold text-navy">Results Gallery Participation</p>
                <p className="text-xs text-graphite-400 mt-1 max-w-lg">
                  Optionally share your progress photos in our results gallery to inspire others.
                  All photos are reviewed by our team before publication.
                  You can withdraw consent at any time.
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={galleryConsent} onChange={(e) => setGalleryConsent(e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-navy-200 peer-checked:bg-teal transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
