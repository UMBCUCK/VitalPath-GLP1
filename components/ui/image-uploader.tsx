"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  Upload, X, ZoomIn, ZoomOut, RotateCw, ImageIcon,
  Crop, Check, Link, HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Crop helper (reliable canvas approach) ──────────────────────────────────

function getRadianAngle(deg: number) { return (deg * Math.PI) / 180; }

function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
      const safeArea = Math.ceil(2 * ((maxSize / 2) * Math.sqrt(2)));

      canvas.width = safeArea;
      canvas.height = safeArea;

      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate(getRadianAngle(rotation));
      ctx.translate(-safeArea / 2, -safeArea / 2);
      ctx.drawImage(
        image,
        safeArea / 2 - image.naturalWidth / 2,
        safeArea / 2 - image.naturalHeight / 2,
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.naturalWidth * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.naturalHeight * 0.5 - pixelCrop.y),
      );

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    });
    image.addEventListener("error", reject);
    image.src = imageSrc;
  });
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: "image/jpeg" });
}

// ─── Types ───────────────────────────────────────────────────────────────────

type AspectOption = { label: string; ratio: number | undefined };
const ASPECT_OPTIONS: AspectOption[] = [
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:4", ratio: 3 / 4 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "Free", ratio: undefined },
];

type InputMode = "upload" | "url";

export interface ImageUploaderProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  /** Default aspect ratio, e.g. 1 for square */
  defaultAspect?: number;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ImageUploader({
  value, onChange, label, hint, defaultAspect = 1, className,
}: ImageUploaderProps) {
  // Core state
  const [stage, setStage] = useState<"idle" | "cropping" | "uploading">("idle");
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [rawFileName, setRawFileName] = useState("upload.jpg");

  // Crop state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<number | undefined>(defaultAspect);

  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── File selection ──────────────────────────────────────────────────────
  const openCropFor = useCallback((src: string, name: string) => {
    setRawSrc(src);
    setRawFileName(name);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setUploadError(null);
    setStage("cropping");
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be under 10 MB.");
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => openCropFor(reader.result as string, file.name);
    reader.readAsDataURL(file);
  }, [openCropFor]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── URL input ────────────────────────────────────────────────────────────
  function handleUrlPreview() {
    if (!urlInput.trim()) { setUrlError("Enter a URL."); return; }
    try { new URL(urlInput.trim()); } catch { setUrlError("Enter a valid URL."); return; }
    setUrlError("");
    openCropFor(urlInput.trim(), "url-image.jpg");
  }

  function applyUrlDirect() {
    if (!urlInput.trim()) { setUrlError("Enter a URL."); return; }
    try { new URL(urlInput.trim()); } catch { setUrlError("Enter a valid URL."); return; }
    setUrlError("");
    onChange(urlInput.trim());
    setUrlInput("");
  }

  // ── Crop confirm ────────────────────────────────────────────────────────
  const applyCrop = useCallback(async () => {
    if (!rawSrc || !croppedAreaPixels) return;
    setStage("uploading");
    try {
      const dataUrl = await getCroppedImg(rawSrc, croppedAreaPixels, rotation);
      const file = await dataUrlToFile(dataUrl, `upload-${Date.now()}.jpg`);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange(json.url);
      setRawSrc(null);
      setStage("idle");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setStage("cropping");
    }
  }, [rawSrc, croppedAreaPixels, rotation, onChange]);

  const cancelCrop = () => { setRawSrc(null); setStage("idle"); setUploadError(null); };
  const removeImage = (e: React.MouseEvent) => { e.stopPropagation(); onChange(null); };

  // ── Crop modal ───────────────────────────────────────────────────────────
  if (stage === "cropping" && rawSrc) {
    return (
      <div className={cn("space-y-1.5", className)}>
        {label && <p className="text-xs font-semibold text-navy">{label}</p>}
        <div className="rounded-xl border border-navy-200 overflow-hidden bg-white shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-navy-50/70 border-b border-navy-100">
            <div className="flex items-center gap-2">
              <Crop className="h-3.5 w-3.5 text-navy" />
              <span className="text-xs font-semibold text-navy">Crop & adjust</span>
            </div>
            <button onClick={cancelCrop} className="text-graphite-400 hover:text-navy transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Crop canvas */}
          <div className="relative bg-graphite-900" style={{ height: 300 }}>
            <Cropper
              image={rawSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={selectedAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              style={{ containerStyle: { background: "#1a1a2e" } }}
              showGrid
            />
          </div>

          {/* Controls */}
          <div className="bg-white px-4 py-3 space-y-2.5">
            {/* Aspect ratios */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold text-graphite-400 uppercase tracking-wider mr-0.5">Ratio</span>
              {ASPECT_OPTIONS.map((opt) => {
                const active = selectedAspect === opt.ratio;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedAspect(opt.ratio)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all",
                      active
                        ? "bg-navy text-white border-navy shadow-sm"
                        : "text-graphite-500 border-graphite-200 hover:border-navy-300 hover:text-navy"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-graphite-400 uppercase tracking-wider w-10">Zoom</span>
              <ZoomOut className="h-3.5 w-3.5 text-graphite-400 shrink-0" />
              <input
                type="range" min={1} max={3} step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-1.5 accent-navy rounded-full"
              />
              <ZoomIn className="h-3.5 w-3.5 text-graphite-400 shrink-0" />
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                title="Rotate 90°"
                className="ml-2 flex items-center gap-1 px-2 py-1 rounded-md border border-navy-100 text-graphite-500 hover:text-navy hover:border-navy-300 hover:bg-navy-50 transition-colors text-[10px] font-medium"
              >
                <RotateCw className="h-3 w-3" /> Rotate
              </button>
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">{uploadError}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-0.5">
              <Button variant="outline" size="sm" onClick={cancelCrop} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={applyCrop} className="h-8 text-xs gap-1.5">
                <Check className="h-3.5 w-3.5" /> Apply & Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Uploading spinner ────────────────────────────────────────────────────
  if (stage === "uploading") {
    return (
      <div className={cn("space-y-1.5", className)}>
        {label && <p className="text-xs font-semibold text-navy">{label}</p>}
        <div className="flex items-center justify-center rounded-xl border border-dashed border-navy-200 bg-navy-50/30" style={{ height: 120 }}>
          <div className="flex flex-col items-center gap-2 text-graphite-400">
            <div className="h-6 w-6 rounded-full border-2 border-navy border-t-transparent animate-spin" />
            <p className="text-xs font-medium text-navy">Uploading…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Has image ────────────────────────────────────────────────────────────
  if (value) {
    return (
      <div className={cn("space-y-1.5", className)}>
        {label && <p className="text-xs font-semibold text-navy">{label}</p>}
        <div className="flex items-start gap-3">
          {/* Thumbnail with hover actions */}
          <div className="group relative rounded-xl overflow-hidden border border-navy-100 shadow-sm shrink-0">
            <img
              src={value}
              alt="Uploaded"
              className="h-28 w-28 object-cover block"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                el.nextElementSibling?.classList.remove("hidden");
              }}
            />
            {/* Fallback */}
            <div className="hidden h-28 w-28 flex items-center justify-center bg-graphite-100">
              <ImageIcon className="h-8 w-8 text-graphite-300" />
            </div>
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2 bg-white/95 rounded-lg shadow-md text-navy hover:bg-white transition-all scale-90 group-hover:scale-100"
                title="Replace image"
              >
                <Crop className="h-4 w-4" />
              </button>
              <button
                onClick={removeImage}
                className="p-2 bg-white/95 rounded-lg shadow-md text-red-500 hover:bg-white transition-all scale-90 group-hover:scale-100"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 pt-1 space-y-1.5">
            <p className="text-xs font-medium text-navy">Image uploaded</p>
            <p className="text-[10px] text-graphite-400 break-all font-mono leading-tight truncate">{value}</p>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-navy-200 text-[10px] font-medium text-graphite-600 hover:border-navy hover:text-navy hover:bg-navy-50 transition-colors"
              >
                <Upload className="h-3 w-3" /> Replace
              </button>
              <button
                onClick={removeImage}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-red-200 text-[10px] font-medium text-red-500 hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
        {hint && <p className="text-[10px] text-graphite-400">{hint}</p>}
        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
      </div>
    );
  }

  // ── Empty state: upload zone + URL tab ───────────────────────────────────
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <p className="text-xs font-semibold text-navy">{label}</p>}

      {/* Mode tabs */}
      <div className="flex rounded-lg border border-navy-100 p-0.5 bg-graphite-50 w-fit gap-0.5">
        {(["upload", "url"] as InputMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => { setInputMode(mode); setUploadError(null); setUrlError(""); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-semibold transition-all",
              inputMode === mode
                ? "bg-white text-navy shadow-sm border border-navy-100"
                : "text-graphite-400 hover:text-graphite-600"
            )}
          >
            {mode === "upload" ? <HardDrive className="h-3 w-3" /> : <Link className="h-3 w-3" />}
            {mode === "upload" ? "Upload file" : "Paste URL"}
          </button>
        ))}
      </div>

      {inputMode === "upload" ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed transition-all cursor-pointer select-none py-8 gap-3",
            isDragging
              ? "border-navy bg-navy-50/60 text-navy"
              : "border-navy-200 text-graphite-400 hover:border-navy-300 hover:text-navy hover:bg-navy-50/20"
          )}
        >
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
            isDragging ? "bg-navy/10" : "bg-graphite-100"
          )}>
            {isDragging
              ? <Upload className="h-6 w-6 text-navy" />
              : <ImageIcon className="h-6 w-6" />}
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-sm font-semibold">{isDragging ? "Drop to upload" : "Upload an image"}</p>
            <p className="text-xs">Drag & drop or click to browse</p>
            <p className="text-[10px] text-graphite-300">JPEG · PNG · WebP · GIF · max 10 MB</p>
          </div>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
              placeholder="https://example.com/image.jpg"
              className="h-9 text-sm flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleUrlPreview()}
            />
          </div>
          {urlError && <p className="text-xs text-red-500">{urlError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleUrlPreview}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-navy-200 text-xs font-medium text-graphite-600 hover:border-navy hover:text-navy hover:bg-navy-50 transition-colors"
            >
              <Crop className="h-3.5 w-3.5" /> Preview & crop
            </button>
            <button
              onClick={applyUrlDirect}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-navy text-white text-xs font-medium hover:bg-navy/90 transition-colors"
            >
              <Check className="h-3.5 w-3.5" /> Use as-is
            </button>
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
      {hint && <p className="text-[10px] text-graphite-400">{hint}</p>}
      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
    </div>
  );
}
