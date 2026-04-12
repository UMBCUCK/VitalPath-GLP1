"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera, Upload, Image as ImageIcon, Lock, Eye, EyeOff,
  Plus, X, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoType = "FRONT" | "SIDE" | "BACK";

interface PhotoEntry {
  id: string;
  imageUrl: string;
  type: string;
  date: string;
  consentGiven: boolean;
}

interface PhotosClientProps {
  photos: PhotoEntry[];
}

export function PhotosClient({ photos: initialPhotos }: PhotosClientProps) {
  const [photos, setPhotos] = useState<PhotoEntry[]>(initialPhotos);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedType, setSelectedType] = useState<PhotoType>("FRONT");
  const [galleryConsent, setGalleryConsent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<PhotoType>("FRONT");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted gallery consent preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("gallery-consent");
    if (stored !== null) {
      setGalleryConsent(stored === "true");
    } else {
      setGalleryConsent(initialPhotos.some((p) => p.consentGiven));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPhotos = photos.filter((p) => p.type === selectedType);
  const earliest = filteredPhotos[filteredPhotos.length - 1];
  const latest = filteredPhotos[0];

  function triggerUpload(type: PhotoType) {
    setUploadType(type);
    setError("");
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check before any upload attempt
    if (file.size > 10 * 1024 * 1024) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please choose an image under 10 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);

      const res = await fetch("/api/photos", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      const p = data.photo;
      setPhotos((prev) => [
        {
          id: p.id,
          imageUrl: p.imageUrl,
          type: p.type,
          date: new Date(p.date || Date.now()).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
          consentGiven: p.consentGiven,
        },
        ...prev,
      ]);
      // Auto-select the uploaded type
      setSelectedType(uploadType as PhotoType);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Progress Photos</h2>
          <p className="text-sm text-graphite-400">
            {photos.length > 0 ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} · Track visual changes over time` : "Track visual changes over time"}
          </p>
        </div>
        <div className="flex gap-2">
          {filteredPhotos.length >= 2 && (
            <Button
              variant={compareMode ? "default" : "outline"}
              size="sm"
              onClick={() => setCompareMode(!compareMode)}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {compareMode ? "Exit Compare" : "Compare"}
            </Button>
          )}
          <Button
            size="sm"
            className="gap-2"
            onClick={() => triggerUpload(selectedType)}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload Photo"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <X className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Privacy notice */}
      <div className="flex items-center gap-2 rounded-xl bg-navy-50/50 px-4 py-3">
        <Lock className="h-4 w-4 text-navy-400" />
        <p className="text-xs text-graphite-500">
          Your photos are private by default. Only you can see them unless you opt into the results gallery.
        </p>
      </div>

      {/* Type filter */}
      <div className="flex gap-2">
        {(["FRONT", "SIDE", "BACK"] as PhotoType[]).map((type) => {
          const count = photos.filter((p) => p.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                selectedType === type ? "bg-navy text-white" : "bg-white text-graphite-500 hover:bg-navy-50"
              )}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()} View
              {count > 0 && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  selectedType === type ? "bg-white/20 text-white" : "bg-navy-100 text-navy"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {compareMode && earliest && latest && earliest.id !== latest.id ? (
        /* Compare mode */
        <Card>
          <CardHeader><CardTitle className="text-base">Before &amp; After Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Earliest", photo: earliest, variant: "secondary" as const },
                { label: "Latest", photo: latest, variant: "default" as const },
              ].map(({ label, photo, variant }) => (
                <div key={photo.id}>
                  <Badge variant={variant} className="mb-3">{label}</Badge>
                  <div className="overflow-hidden rounded-2xl aspect-[3/4] bg-navy-50/50 border border-navy-200">
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={`${label} progress photo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center">
                        <div>
                          <Camera className="mx-auto h-10 w-10 text-graphite-200" />
                          <p className="mt-2 text-sm text-graphite-400">{photo.date}</p>
                          <p className="text-xs text-graphite-300">{photo.type.toLowerCase()} view</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-center text-xs text-graphite-400">{photo.date}</p>
                </div>
              ))}
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
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden bg-navy-50/50">
                {photo.imageUrl ? (
                  <img
                    src={photo.imageUrl}
                    alt={`Progress photo ${photo.date}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <Camera className="mx-auto h-8 w-8 text-graphite-200" />
                      <p className="mt-2 text-xs text-graphite-300">Photo unavailable</p>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy">{photo.date}</p>
                    <p className="text-xs text-graphite-400">{photo.type.toLowerCase()} view</p>
                  </div>
                  <Badge variant={photo.consentGiven ? "default" : "secondary"} className="text-[10px]">
                    {photo.consentGiven ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload card */}
          <button
            onClick={() => triggerUpload(selectedType)}
            disabled={uploading}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-200 p-8 min-h-[280px] transition-colors hover:border-teal/50 cursor-pointer"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
              {uploading ? (
                <Loader2 className="h-6 w-6 text-teal animate-spin" />
              ) : (
                <Plus className="h-6 w-6 text-teal" />
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-navy">
              {uploading ? "Uploading…" : `Add ${selectedType.charAt(0) + selectedType.slice(1).toLowerCase()} View`}
            </p>
            <p className="mt-1 text-xs text-graphite-400">JPEG, PNG, or WebP · max 10MB</p>
          </button>

          {/* Empty state when no photos for this type */}
          {filteredPhotos.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-center justify-center rounded-2xl bg-navy-50/30 p-12 text-center">
              <Camera className="mx-auto h-12 w-12 text-graphite-200" />
              <h3 className="mt-4 text-base font-bold text-navy">No {selectedType.toLowerCase()} view photos yet</h3>
              <p className="mt-2 text-sm text-graphite-400 max-w-sm">
                Upload your first photo to start tracking visual progress. Taking photos monthly gives the best before/after comparison.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Gallery consent */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {galleryConsent ? (
                <Eye className="mt-0.5 h-5 w-5 text-teal shrink-0" />
              ) : (
                <EyeOff className="mt-0.5 h-5 w-5 text-graphite-400 shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold text-navy">Results Gallery Participation</p>
                <p className="text-xs text-graphite-400 mt-1 max-w-lg">
                  Optionally share your progress photos in our results gallery to inspire others.
                  All photos are reviewed before publication. You can withdraw consent at any time.
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={galleryConsent}
                onChange={(e) => {
                  const val = e.target.checked;
                  setGalleryConsent(val);
                  localStorage.setItem("gallery-consent", String(val));
                }}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-navy-200 peer-checked:bg-teal transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
