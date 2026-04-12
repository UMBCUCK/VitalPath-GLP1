"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Images, Trash2, Copy, Check, Search, X, Upload,
  RefreshCw, ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function MediaLibraryClient() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setImages(data.images ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  // When a new image is uploaded, refresh and select it
  useEffect(() => {
    if (newImageUrl) {
      fetchImages().then(() => setNewImageUrl(null));
    }
  }, [newImageUrl, fetchImages]);

  async function deleteImage(filename: string) {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    setDeleting(filename);
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      setImages((prev) => prev.filter((img) => img.filename !== filename));
      if (selected?.filename === filename) setSelected(null);
    } finally {
      setDeleting(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url).catch(() => {
      navigator.clipboard.writeText(url);
    });
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const filtered = images.filter((img) =>
    !search || img.filename.toLowerCase().includes(search.toLowerCase())
  );

  const totalSize = images.reduce((s, img) => s + img.size, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Images className="h-6 w-6 text-teal" /> Media Library
          </h2>
          <p className="text-sm text-graphite-400 mt-0.5">
            {images.length} image{images.length !== 1 ? "s" : ""} · {formatBytes(totalSize)} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchImages} className="gap-1.5 h-8">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowUpload((v) => !v)} className="gap-1.5 h-8">
            <Upload className="h-3.5 w-3.5" /> Upload New
          </Button>
        </div>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <Card className="border-teal/30 bg-teal-50/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-navy">Upload a new image</p>
              <button onClick={() => setShowUpload(false)} className="text-graphite-400 hover:text-navy">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ImageUploader
              value={newImageUrl}
              onChange={(url) => {
                setNewImageUrl(url);
                if (url) setShowUpload(false);
              }}
              hint="The uploaded image will appear in the library below."
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Grid */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename…"
              className="pl-9 h-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-navy">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-6 w-6 rounded-full border-2 border-navy border-t-transparent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-graphite-400 gap-2">
              <ImageIcon className="h-10 w-10" />
              <p className="text-sm">{search ? "No images match your search" : "No images uploaded yet"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {filtered.map((img) => (
                <button
                  key={img.filename}
                  onClick={() => setSelected(img)}
                  className={cn(
                    "relative group aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selected?.filename === img.filename
                      ? "border-teal ring-2 ring-teal/30 shadow-md"
                      : "border-navy-100 hover:border-navy-300"
                  )}
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                  {/* Size badge */}
                  <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="block text-center text-white text-[9px] font-medium bg-black/50 rounded px-1 py-0.5 truncate">
                      {formatBytes(img.size)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="space-y-3">
          {selected ? (
            <Card className="sticky top-4">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Image Details</CardTitle>
                  <button onClick={() => setSelected(null)} className="text-graphite-300 hover:text-navy">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {/* Preview */}
                <div className="aspect-video rounded-lg overflow-hidden bg-graphite-100 border border-navy-100">
                  <img
                    src={selected.url}
                    alt={selected.filename}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Meta */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-graphite-400">Filename</span>
                    <span className="font-medium text-navy truncate max-w-[140px]" title={selected.filename}>{selected.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graphite-400">Size</span>
                    <span className="font-medium text-navy">{formatBytes(selected.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graphite-400">Uploaded</span>
                    <span className="font-medium text-navy">{timeAgo(selected.createdAt)}</span>
                  </div>
                </div>

                {/* URL copy */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-graphite-400 uppercase tracking-wider">URL</label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      readOnly
                      value={selected.url}
                      className="h-8 text-xs font-mono flex-1 bg-graphite-50"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => copyUrl(selected.url)}
                      className={cn(
                        "shrink-0 p-2 rounded-lg border text-xs transition-all",
                        copied === selected.url
                          ? "border-teal bg-teal-50 text-teal"
                          : "border-navy-200 text-graphite-500 hover:border-navy hover:text-navy hover:bg-navy-50"
                      )}
                      title="Copy URL"
                    >
                      {copied === selected.url ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs text-red-500 border-red-200 hover:border-red-400 hover:bg-red-50 gap-1.5"
                  disabled={deleting === selected.filename}
                  onClick={() => deleteImage(selected.filename)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleting === selected.filename ? "Deleting…" : "Delete image"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-48 text-graphite-400 gap-2">
                <ImageIcon className="h-8 w-8" />
                <p className="text-xs text-center">Click an image to see details and copy its URL</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
