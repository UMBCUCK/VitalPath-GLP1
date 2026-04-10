import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import crypto from "crypto";

// ─── Available Scopes ──────────────────────────────────────

export const AVAILABLE_SCOPES = [
  "customers:read",
  "orders:read",
  "subscriptions:read",
  "analytics:read",
  "products:read",
] as const;

export type ApiScope = (typeof AVAILABLE_SCOPES)[number];

// ─── Types ─────────────────────────────────────────────────

export interface ApiKeyListItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt: Date | null;
  usageCount: number;
  expiresAt: Date | null;
  createdBy: string;
  createdAt: Date;
}

export interface CreateApiKeyResult {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey: string; // Only returned once, never stored
  scopes: string[];
  rateLimit: number;
  expiresAt: Date | null;
}

// ─── Get API Keys ──────────────────────────────────────────

export async function getApiKeys(): Promise<ApiKeyListItem[]> {
  const keys = await db.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      rateLimit: true,
      isActive: true,
      lastUsedAt: true,
      usageCount: true,
      expiresAt: true,
      createdBy: true,
      createdAt: true,
    },
  });

  return keys.map((k) => ({
    ...k,
    scopes: (k.scopes as string[]) || [],
  }));
}

// ─── Create API Key ────────────────────────────────────────

export async function createApiKey(
  name: string,
  scopes: string[],
  rateLimit = 1000,
  expiresAt: Date | null,
  createdBy: string
): Promise<CreateApiKeyResult> {
  // Generate a random API key
  const rawKey = crypto.randomUUID().replace(/-/g, "");
  const fullKey = `vp_live_${rawKey}`;
  const keyPrefix = fullKey.slice(0, 16); // "vp_live_xxxxxxxx"

  // Hash the key with bcryptjs for secure storage
  const keyHash = await hash(fullKey, 12);

  const apiKey = await db.apiKey.create({
    data: {
      name,
      keyHash,
      keyPrefix,
      scopes,
      rateLimit,
      isActive: true,
      expiresAt,
      createdBy,
    },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    keyPrefix,
    fullKey, // Return once only
    scopes: scopes,
    rateLimit,
    expiresAt,
  };
}

// ─── Revoke API Key ────────────────────────────────────────

export async function revokeApiKey(id: string): Promise<void> {
  await db.apiKey.update({
    where: { id },
    data: { isActive: false },
  });
}

// ─── Validate API Key ──────────────────────────────────────

export async function validateApiKey(
  key: string
): Promise<{ valid: false } | { valid: true; scopes: string[]; keyId: string }> {
  // Get all active keys to compare
  const activeKeys = await db.apiKey.findMany({
    where: { isActive: true },
    select: {
      id: true,
      keyHash: true,
      scopes: true,
      expiresAt: true,
    },
  });

  for (const apiKey of activeKeys) {
    const matches = await compare(key, apiKey.keyHash);
    if (matches) {
      // Check expiry
      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return { valid: false };
      }

      // Update usage stats
      await db.apiKey.update({
        where: { id: apiKey.id },
        data: {
          lastUsedAt: new Date(),
          usageCount: { increment: 1 },
        },
      });

      return {
        valid: true,
        scopes: (apiKey.scopes as string[]) || [],
        keyId: apiKey.id,
      };
    }
  }

  return { valid: false };
}
