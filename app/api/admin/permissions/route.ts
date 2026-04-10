import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminPermissions, setAdminPermission, hasPermission } from "@/lib/admin-permissions";
import { safeError } from "@/lib/logger";

// ── GET: list all admin users with their permissions ────────
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admins = await getAdminPermissions();
    return NextResponse.json({ admins });
  } catch (error) {
    safeError("[Admin Permissions GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}

// ── PUT: set permission for an admin user (SUPER_ADMIN only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only SUPER_ADMIN can modify permissions
    const canManage = await hasPermission(session.userId, "settings", "write");
    if (!canManage) {
      // Check if caller is SUPER_ADMIN via the permission record
      const isSuperAdmin = await hasPermission(session.userId);
      if (!isSuperAdmin) {
        return NextResponse.json(
          { error: "Only SUPER_ADMIN can modify permissions" },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { userId, role, pages, actions } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["SUPER_ADMIN", "MANAGER", "EDITOR", "VIEWER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const permission = await setAdminPermission(userId, role, pages, actions);
    return NextResponse.json({ permission });
  } catch (error) {
    safeError("[Admin Permissions PUT]", error);
    return NextResponse.json(
      { error: "Failed to update permission" },
      { status: 500 }
    );
  }
}
