import { db } from "@/lib/db";
/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Role hierarchy ─────────────────────────────────────────
export type AdminRole = "SUPER_ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";

const ROLE_RANK: Record<AdminRole, number> = {
  SUPER_ADMIN: 4,
  MANAGER: 3,
  EDITOR: 2,
  VIEWER: 1,
};

// Pages accessible per role (SUPER_ADMIN has all, so not listed)
const ROLE_PAGES: Record<string, string[]> = {
  MANAGER: [
    "dashboard", "analytics", "customers", "products", "claims",
    "coupons", "meal-plans", "recipes", "referrals", "states",
    "blog", "experiments",
  ],
  EDITOR: ["customers", "blog", "recipes", "meal-plans", "products"],
  VIEWER: [
    "dashboard", "analytics", "customers", "products", "claims",
    "coupons", "meal-plans", "recipes", "referrals", "states",
    "blog", "experiments", "settings",
  ],
};

// Actions accessible per role
const ROLE_ACTIONS: Record<string, string[]> = {
  MANAGER: ["read", "write", "delete", "approve"],
  EDITOR: ["read", "write"],
  VIEWER: ["read"],
};

// ─── Queries ────────────────────────────────────────────────

export async function getAdminPermissions() {
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPPORT"] } },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const permissions = await db.adminPermission.findMany();
  const permMap = new Map(permissions.map((p) => [p.userId, p]));

  return admins.map((user) => {
    const perm = permMap.get(user.id);
    return {
      ...user,
      adminRole: (perm?.role as AdminRole) || "VIEWER",
      pages: (perm?.pages as string[] | null) || null,
      actions: (perm?.actions as string[] | null) || null,
      permissionId: perm?.id || null,
    };
  });
}

export async function setAdminPermission(
  userId: string,
  role: AdminRole,
  pages?: string[] | null,
  actions?: string[] | null
) {
  return db.adminPermission.upsert({
    where: { userId },
    create: {
      userId,
      role,
      pages: (pages ?? null) as any,
      actions: (actions ?? null) as any,
    },
    update: {
      role,
      pages: (pages ?? null) as any,
      actions: (actions ?? null) as any,
    },
  });
}

export async function hasPermission(
  userId: string,
  page?: string,
  action?: string
): Promise<boolean> {
  const perm = await db.adminPermission.findUnique({ where: { userId } });

  // No permission record: default to VIEWER (read-only)
  const role = (perm?.role as AdminRole) || "VIEWER";

  // SUPER_ADMIN has unrestricted access
  if (role === "SUPER_ADMIN") return true;

  // Check page access
  if (page) {
    const customPages = perm?.pages as string[] | null;
    const allowedPages = customPages || ROLE_PAGES[role] || [];
    if (!allowedPages.includes(page)) return false;
  }

  // Check action access
  if (action) {
    const customActions = perm?.actions as string[] | null;
    const allowedActions = customActions || ROLE_ACTIONS[role] || [];
    if (!allowedActions.includes(action)) return false;
  }

  return true;
}

export function getRoleRank(role: AdminRole): number {
  return ROLE_RANK[role] || 0;
}

export function getRoleDescription(role: AdminRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Full access to everything including system settings and user management";
    case "MANAGER":
      return "Read and write access to all content and operations, except system settings";
    case "EDITOR":
      return "Read and write access to content pages (customers, blog, recipes, products)";
    case "VIEWER":
      return "Read-only access to all pages, no editing or deletion";
    default:
      return "";
  }
}
