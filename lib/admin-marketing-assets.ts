import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────

export interface AssetAnalytics {
  totalAssets: number;
  activeAssets: number;
  totalDownloads: number;
  byType: Record<string, number>;
  mostDownloaded: { name: string; downloads: number } | null;
}

// ─── Queries ────────────────────────────────────────────────────

export async function getMarketingAssets(
  page = 1,
  limit = 50,
  type?: string,
  search?: string
) {
  const where: Record<string, unknown> = {};

  if (type && type !== "ALL") {
    where.type = type;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { category: { contains: search } },
    ];
  }

  const [assets, total] = await Promise.all([
    db.marketingAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.marketingAsset.count({ where }),
  ]);

  return { assets, total, page, limit };
}

export async function getAssetAnalytics(): Promise<AssetAnalytics> {
  const [assets, activeCount] = await Promise.all([
    db.marketingAsset.findMany({
      select: {
        type: true,
        downloads: true,
        name: true,
        isActive: true,
      },
      orderBy: { downloads: "desc" },
    }),
    db.marketingAsset.count({ where: { isActive: true } }),
  ]);

  const totalAssets = assets.length;
  const totalDownloads = assets.reduce((sum, a) => sum + a.downloads, 0);

  const byType: Record<string, number> = {};
  for (const a of assets) {
    byType[a.type] = (byType[a.type] || 0) + 1;
  }

  const mostDownloaded =
    assets.length > 0
      ? { name: assets[0].name, downloads: assets[0].downloads }
      : null;

  return {
    totalAssets,
    activeAssets: activeCount,
    totalDownloads,
    byType,
    mostDownloaded,
  };
}

// ─── Mutations ──────────────────────────────────────────────────

export async function createMarketingAsset(data: {
  name: string;
  type: string;
  fileUrl?: string | null;
  content?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  isActive?: boolean;
  createdBy: string;
}) {
  return db.marketingAsset.create({ data });
}

export async function updateMarketingAsset(
  id: string,
  data: {
    name?: string;
    type?: string;
    fileUrl?: string | null;
    content?: string | null;
    thumbnail?: string | null;
    category?: string | null;
    isActive?: boolean;
  }
) {
  return db.marketingAsset.update({ where: { id }, data });
}

export async function deleteMarketingAsset(id: string) {
  return db.marketingAsset.delete({ where: { id } });
}

export async function incrementDownload(id: string) {
  return db.marketingAsset.update({
    where: { id },
    data: { downloads: { increment: 1 } },
  });
}
