"use client";

/**
 * BeforeAfterShare
 * ─────────────────────────────────────────────────────────────
 * Tier 12.6 — Builds a side-by-side before/after composite from the
 * member's earliest and latest progress photos, then offers
 * one-click sharing (download / native share / copy link).
 *
 * Drives:
 *   - Authentic UGC for marketing (with explicit member consent)
 *   - Referral viral coefficient — visible progress is the strongest
 *     trigger for friends-asking-about-it conversions
 *   - Member intrinsic motivation (seeing the gap)
 *
 * Privacy: composition happens entirely client-side on a hidden
 * canvas. Nothing uploads unless the member explicitly chooses
 * Native Share or downloads + uploads to their own social.
 */
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Download,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export interface BeforeAfterShareProps {
  beforePhotoUrl?: string | null;
  afterPhotoUrl?: string | null;
  beforeWeight?: number | null;
  afterWeight?: number | null;
  daysBetween?: number | null;
  /** First name for the composite watermark. */
  firstName?: string | null;
}

export function BeforeAfterShare({
  beforePhotoUrl,
  afterPhotoUrl,
  beforeWeight,
  afterWeight,
  daysBetween,
  firstName,
}: BeforeAfterShareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const lost =
    beforeWeight && afterWeight && beforeWeight > afterWeight
      ? beforeWeight - afterWeight
      : null;

  // Render the composite when both photos + canvas are available
  useEffect(() => {
    if (!beforePhotoUrl || !afterPhotoUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = "#0E223D";
    ctx.fillRect(0, 0, W, H);

    const before = new window.Image();
    const after = new window.Image();
    before.crossOrigin = "anonymous";
    after.crossOrigin = "anonymous";

    // Capture the canvas reference inside the effect closure so the
    // `onLoad` callbacks (which fire later, after the photos load) can
    // safely reference a non-null canvas. Same for the 2D context.
    const localCanvas = canvas;
    const localCtx = ctx;

    let loaded = 0;
    function onLoad() {
      loaded++;
      if (loaded < 2) return;
      // Render side-by-side, full-bleed within their halves
      drawCovered(localCtx, before, 0, 0, W / 2, H);
      drawCovered(localCtx, after, W / 2, 0, W / 2, H);

      // Center divider
      localCtx.fillStyle = "rgba(255,255,255,0.95)";
      localCtx.fillRect(W / 2 - 2, 0, 4, H);

      // Top labels
      drawLabel(localCtx, "BEFORE", 24, 60, "left");
      drawLabel(localCtx, "AFTER", W - 24, 60, "right");

      // Footer band
      const footerH = 110;
      localCtx.fillStyle = "rgba(0,0,0,0.55)";
      localCtx.fillRect(0, H - footerH, W, footerH);

      // Footer text
      localCtx.fillStyle = "#FFFFFF";
      localCtx.font = "700 36px system-ui, sans-serif";
      localCtx.textAlign = "center";
      localCtx.fillText(
        lost
          ? `${firstName ?? "I"} lost ${Math.round(lost)} lbs in ${daysBetween ?? "a few"} days`
          : `${firstName ?? "Member"}'s GLP-1 progress`,
        W / 2,
        H - 60,
      );
      localCtx.font = "500 22px system-ui, sans-serif";
      localCtx.fillStyle = "rgba(255,255,255,0.7)";
      localCtx.fillText("Nature's Journey · GLP-1 weight management", W / 2, H - 24);

      setComposedUrl(localCanvas.toDataURL("image/png"));
    }

    before.onload = onLoad;
    after.onload = onLoad;
    before.onerror = () => setComposedUrl(null);
    after.onerror = () => setComposedUrl(null);
    before.src = beforePhotoUrl;
    after.src = afterPhotoUrl;
  }, [beforePhotoUrl, afterPhotoUrl, lost, daysBetween, firstName]);

  if (!beforePhotoUrl || !afterPhotoUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            Before / After share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-navy-100 bg-cloud/40 p-6 text-center">
            <Camera className="mx-auto h-8 w-8 text-graphite-300" />
            <p className="mt-3 text-sm font-bold text-navy">
              Two photos unlock this card
            </p>
            <p className="mt-1 text-xs text-graphite-500">
              Upload a starting photo and a recent photo from your photo vault — we&apos;ll
              build a shareable side-by-side composite.
            </p>
            <Button asChild size="sm" className="mt-4">
              <a href="/dashboard/photos">Open photo vault</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  function handleDownload() {
    if (!composedUrl) return;
    track("before_after_download", { has_lost: !!lost });
    const a = document.createElement("a");
    a.href = composedUrl;
    a.download = `natures-journey-progress-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleShare() {
    if (!composedUrl) return;
    track("before_after_native_share", { has_lost: !!lost });
    try {
      const res = await fetch(composedUrl);
      const blob = await res.blob();
      const file = new File([blob], "progress.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My GLP-1 progress",
          text: lost
            ? `${Math.round(lost)} lbs in ${daysBetween ?? "a few"} days on Nature's Journey`
            : "My Nature's Journey progress",
        });
        return;
      }
    } catch {
      // user cancelled or browser doesn't support file share
    }
    handleDownload();
  }

  async function handleCopyLink() {
    track("before_after_copy_link", { has_lost: !!lost });
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/qualify`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          Before / After share
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-navy-100/60 bg-cloud/40">
          {composedUrl ? (
            // intentionally <img>: composedUrl is a data URL not optimizable by Next/Image
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={composedUrl}
              alt="Before and after progress composite"
              className="block w-full"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center text-xs text-graphite-400">
              Composing your progress shot…
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="emerald"
            disabled={!composedUrl}
            onClick={handleShare}
            className="gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!composedUrl}
            onClick={handleDownload}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Link copied" : "Copy referral link"}
          </Button>
        </div>

        <p className="mt-3 text-[11px] text-graphite-400">
          Composed locally on your device. Nothing uploads until you choose to share.
          Sharing your progress is one of the strongest ways to inspire others — and your
          referral link gives them $50 off their first month.
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Helpers ─────────────────────────────────────────────────
function drawCovered(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  // Object-fit: cover into the (x,y,w,h) rectangle
  const ratio = Math.max(w / img.width, h / img.height);
  const dw = img.width * ratio;
  const dh = img.height * ratio;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  align: "left" | "right",
) {
  ctx.font = "700 28px system-ui, sans-serif";
  const padding = 14;
  const metrics = ctx.measureText(text);
  const tw = metrics.width + padding * 2;
  const th = 40;

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(align === "right" ? x - tw : x, y, tw, th);
  ctx.fillStyle = "#0E223D";
  ctx.textAlign = align === "right" ? "right" : "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, align === "right" ? x - padding : x + padding, y + th / 2);
}
