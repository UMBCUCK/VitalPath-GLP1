"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Copy, Check, ExternalLink, Palette, Eye, Users } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface ReferralOption {
  code: string;
  userName: string;
  totalReferred: number;
}

export default function AdminWidgetsPage() {
  // Widget config
  const [selectedRef, setSelectedRef] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("700");
  const [hideTimeline, setHideTimeline] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<ReferralOption[]>([]);
  const [customRef, setCustomRef] = useState("");

  useEffect(() => {
    fetch("/api/admin/widget-referrals")
      .then((r) => r.ok ? r.json() : { referrals: [] })
      .then((data) => setReferrals(data.referrals || []))
      .catch(() => {});
  }, []);

  // Build embed URL
  const params = new URLSearchParams();
  const refCode = selectedRef || customRef;
  if (refCode) params.set("ref", refCode);
  if (theme === "dark") params.set("theme", "dark");
  if (hideTimeline) params.set("hideTimeline", "1");
  if (partnerName) params.set("partner", partnerName);
  const embedUrl = `${APP_URL}/embed/calculator${params.toString() ? `?${params.toString()}` : ""}`;

  const embedCode = `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  style="border: none; border-radius: 16px; overflow: hidden;"
  allow="clipboard-write"
  title="Nature's Journey Health Calculator"
></iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Widget Manager</h1>
        <p className="mt-1 text-sm text-graphite-500">
          Generate embeddable calculator widgets for partners. All leads funnel through Nature's Journey with referral attribution.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-teal" /> Referral Attribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Link to Referral Code
                </label>
                {referrals.length > 0 ? (
                  <select
                    value={selectedRef}
                    onChange={(e) => { setSelectedRef(e.target.value); setCustomRef(""); }}
                    className="calculator-input text-sm py-2"
                  >
                    <option value="">No referral (direct Nature's Journey)</option>
                    {referrals.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code} &mdash; {r.userName} ({r.totalReferred} referrals)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="VP-ABC12345"
                    value={customRef}
                    onChange={(e) => { setCustomRef(e.target.value); setSelectedRef(""); }}
                    className="calculator-input text-sm py-2"
                  />
                )}
                <p className="text-[10px] text-graphite-400 mt-1">
                  All signups from this widget will be attributed to this referral code for payouts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Partner Name (optional)</label>
                <input
                  type="text"
                  placeholder="Dr. Smith's Clinic"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="calculator-input text-sm py-2"
                />
                <p className="text-[10px] text-graphite-400 mt-1">
                  Shows &quot;Powered by Nature's Journey &middot; via [partner]&quot; in the widget.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-gold-600" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`rounded-xl border-2 py-2.5 text-sm font-medium capitalize transition-all ${
                        theme === t ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Width</label>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="calculator-input text-sm py-2"
                    placeholder="100% or 600px"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Height (px)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="calculator-input text-sm py-2"
                    placeholder="700"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideTimeline}
                  onChange={(e) => setHideTimeline(e.target.checked)}
                  className="rounded border-navy-200"
                />
                <span className="text-sm text-navy">Hide weight loss timeline chart</span>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Embed code + preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4 text-atlantic" /> Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="rounded-xl bg-navy-50 p-4 text-xs font-mono text-navy overflow-x-auto whitespace-pre-wrap break-all">
                  {embedCode}
                </pre>
                <Button
                  size="sm"
                  className="absolute top-2 right-2 gap-1"
                  onClick={handleCopy}
                >
                  {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                </Button>
              </div>

              <div className="mt-4 flex gap-2">
                <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3 w-3" /> Preview
                  </Button>
                </a>
                <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-3 w-3" /> Open Full
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How Partner Widgets Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-graphite-500">
              <div className="flex gap-3">
                <Badge variant="default" className="shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center text-[10px]">1</Badge>
                <p>Partner adds the embed code to their website</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="default" className="shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center text-[10px]">2</Badge>
                <p>Visitors use the calculator and see their results</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="default" className="shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center text-[10px]">3</Badge>
                <p>&quot;See If I Qualify&quot; opens Nature's Journey with the <code className="text-teal">?ref=CODE</code> parameter</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="default" className="shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center text-[10px]">4</Badge>
                <p>Signups are attributed to the partner&apos;s referral code for payouts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
