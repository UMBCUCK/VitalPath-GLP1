"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Watch,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle2,
  Apple,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

interface DeviceConnection {
  id: string;
  userId: string;
  platform: string;
  isActive: boolean;
  lastSyncAt: string | null;
  createdAt: string;
}

type Platform = "APPLE_HEALTH" | "GOOGLE_FIT" | "FITBIT" | "WHOOP" | "OURA";

interface PlatformConfig {
  key: Platform;
  label: string;
  description: string;
  color: string;
  bg: string;
  borderActive: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    key: "APPLE_HEALTH",
    label: "Apple Health",
    description: "Sync weight, steps, heart rate, and sleep data",
    color: "text-red-600",
    bg: "bg-red-50",
    borderActive: "border-red-200",
  },
  {
    key: "GOOGLE_FIT",
    label: "Google Fit",
    description: "Connect your Google Fit activity and health data",
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderActive: "border-blue-200",
  },
  {
    key: "FITBIT",
    label: "Fitbit",
    description: "Import steps, sleep, and heart rate from Fitbit",
    color: "text-teal-600",
    bg: "bg-teal-50",
    borderActive: "border-teal-200",
  },
  {
    key: "WHOOP",
    label: "Whoop",
    description: "Recovery, strain, and sleep performance data",
    color: "text-amber-600",
    bg: "bg-amber-50",
    borderActive: "border-amber-200",
  },
  {
    key: "OURA",
    label: "Oura Ring",
    description: "Sleep quality, readiness, and activity tracking",
    color: "text-purple-600",
    bg: "bg-purple-50",
    borderActive: "border-purple-200",
  },
];

// ── Component ──────────────────────────────────────────────────

export function WearablesSection() {
  const [devices, setDevices] = useState<DeviceConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    try {
      const res = await fetch("/api/wearables?include=devices");
      const data = await res.json();
      setDevices(data.devices || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function getConnection(platform: Platform): DeviceConnection | undefined {
    return devices.find((d) => d.platform === platform && d.isActive);
  }

  async function handleConnect(platform: Platform) {
    setConnectingPlatform(platform);
    try {
      const res = await fetch("/api/wearables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", platform }),
      });
      if (res.ok) {
        await fetchDevices();
      }
    } finally {
      setConnectingPlatform(null);
    }
  }

  async function handleDisconnect(platform: Platform) {
    setDisconnectingPlatform(platform);
    try {
      const res = await fetch(`/api/wearables?platform=${platform}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchDevices();
      }
    } finally {
      setDisconnectingPlatform(null);
    }
  }

  function formatLastSync(dateStr: string | null): string {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Watch className="h-4 w-4 text-teal" /> Connected Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-graphite-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Watch className="h-4 w-4 text-teal" /> Connected Devices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {PLATFORMS.map((platform) => {
          const connection = getConnection(platform.key);
          const isConnected = !!connection;
          const isConnecting = connectingPlatform === platform.key;
          const isDisconnecting = disconnectingPlatform === platform.key;

          return (
            <div
              key={platform.key}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 p-4 transition-all",
                isConnected
                  ? `${platform.borderActive} bg-white`
                  : "border-navy-100/40 bg-navy-50/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  platform.bg
                )}>
                  {platform.key === "APPLE_HEALTH" ? (
                    <Apple className={cn("h-5 w-5", platform.color)} />
                  ) : platform.key === "GOOGLE_FIT" ? (
                    <Smartphone className={cn("h-5 w-5", platform.color)} />
                  ) : (
                    <Watch className={cn("h-5 w-5", platform.color)} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-navy">{platform.label}</p>
                    {isConnected && (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <Wifi className="h-2.5 w-2.5" /> Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-graphite-400">
                    {isConnected
                      ? `Last sync: ${formatLastSync(connection.lastSyncAt)}`
                      : platform.description}
                  </p>
                </div>
              </div>

              <div>
                {isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-graphite-500"
                    onClick={() => handleDisconnect(platform.key)}
                    disabled={isDisconnecting}
                  >
                    {isDisconnecting ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <WifiOff className="h-3 w-3 mr-1" />
                    )}
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleConnect(platform.key)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    Connect
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
