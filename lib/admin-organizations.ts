import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────

interface OrganizationCreateData {
  name: string;
  slug: string;
  type?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  brandColor?: string;
  customDomain?: string;
  maxMembers?: number;
  billingType?: string;
  billingRateCents?: number;
  subsidyPct?: number;
}

interface OrganizationUpdateData extends Partial<OrganizationCreateData> {
  isActive?: boolean;
}

// ─── Queries ───────────────────────────────────────────────

export async function getOrganizations(
  page = 1,
  limit = 25,
  type?: string
) {
  const where: Record<string, unknown> = {};
  if (type && type !== "all") {
    where.type = type;
  }

  const [organizations, total] = await Promise.all([
    db.organization.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { members: true } },
      },
    }),
    db.organization.count({ where }),
  ]);

  return {
    organizations: organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      type: org.type,
      contactName: org.contactName,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      logoUrl: org.logoUrl,
      brandColor: org.brandColor,
      customDomain: org.customDomain,
      maxMembers: org.maxMembers,
      isActive: org.isActive,
      billingType: org.billingType,
      billingRateCents: org.billingRateCents,
      subsidyPct: org.subsidyPct,
      totalMembers: org._count.members,
      totalRevenue: org.totalRevenue,
      createdAt: org.createdAt,
    })),
    total,
  };
}

export async function createOrganization(data: OrganizationCreateData) {
  return db.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type || "EMPLOYER",
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      logoUrl: data.logoUrl,
      brandColor: data.brandColor,
      customDomain: data.customDomain,
      maxMembers: data.maxMembers,
      billingType: data.billingType || "PER_MEMBER",
      billingRateCents: data.billingRateCents,
      subsidyPct: data.subsidyPct,
    },
  });
}

export async function updateOrganization(id: string, data: OrganizationUpdateData) {
  return db.organization.update({
    where: { id },
    data,
  });
}

export async function getOrganizationDetail(id: string) {
  const org = await db.organization.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  if (!org) return null;

  // Fetch user details separately since OrganizationMember has no user relation
  const userIds = org.members.map((m) => m.userId);
  const users = userIds.length
    ? await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true, firstName: true, lastName: true },
      })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const membersWithUsers = org.members.map((m) => ({
    ...m,
    user: userMap.get(m.userId) || null,
  }));

  return {
    ...org,
    members: membersWithUsers,
    memberCount: org.members.length,
  };
}

export async function addOrganizationMember(
  orgId: string,
  userId: string,
  role = "MEMBER"
) {
  const member = await db.organizationMember.create({
    data: {
      organizationId: orgId,
      userId,
      role,
    },
  });

  // Increment totalMembers counter
  await db.organization.update({
    where: { id: orgId },
    data: { totalMembers: { increment: 1 } },
  });

  return member;
}

export async function removeOrganizationMember(orgId: string, userId: string) {
  await db.organizationMember.deleteMany({
    where: { organizationId: orgId, userId },
  });

  // Decrement totalMembers counter
  await db.organization.update({
    where: { id: orgId },
    data: { totalMembers: { decrement: 1 } },
  });
}

export async function getOrganizationMetrics() {
  const [
    totalOrgs,
    activeOrgs,
    allOrgs,
    totalMembers,
  ] = await Promise.all([
    db.organization.count(),
    db.organization.count({ where: { isActive: true } }),
    db.organization.findMany({
      select: {
        type: true,
        totalRevenue: true,
        _count: { select: { members: true } },
      },
    }),
    db.organizationMember.count(),
  ]);

  const totalRevenue = allOrgs.reduce((sum, o) => sum + o.totalRevenue, 0);

  // Revenue by org type
  const revenueByType: Record<string, number> = {};
  const membersByType: Record<string, number> = {};
  for (const org of allOrgs) {
    revenueByType[org.type] = (revenueByType[org.type] || 0) + org.totalRevenue;
    membersByType[org.type] = (membersByType[org.type] || 0) + org._count.members;
  }

  const avgMembersPerOrg = totalOrgs > 0 ? Math.round(totalMembers / totalOrgs) : 0;

  return {
    totalOrgs,
    activeOrgs,
    totalMembers,
    totalRevenue,
    avgMembersPerOrg,
    revenueByType,
    membersByType,
  };
}
