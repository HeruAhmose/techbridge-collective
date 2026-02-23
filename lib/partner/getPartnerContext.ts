import { prisma } from "@/lib/db/prisma";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { UserRole } from "@prisma/client";

export async function getPartnerOrgsForUser() {
  const user = await getSignedInUser();
  if (!user) return { user: null, orgs: [] };

  if (user.role === UserRole.ADMIN) {
    const orgs = await prisma.partnerOrganization.findMany({ orderBy: [{ name: "asc" }] });
    return { user, orgs };
  }

  if (user.role !== UserRole.PARTNER) return { user, orgs: [] };

  const memberships = await prisma.partnerMembership.findMany({
    where: { userId: user.id },
    include: { partnerOrg: true },
    orderBy: [{ createdAt: "asc" }],
  });

  return { user, orgs: memberships.map((m) => m.partnerOrg) };
}

export async function assertOrgAccess(orgId: string) {
  const user = await getSignedInUser();
  if (!user) return { user: null, ok: false as const };

  if (user.role === UserRole.ADMIN) return { user, ok: true as const };
  if (user.role !== UserRole.PARTNER) return { user, ok: false as const };

  const membership = await prisma.partnerMembership.findUnique({
    where: { partnerOrgId_userId: { partnerOrgId: orgId, userId: user.id } },
  });

  return { user, ok: Boolean(membership) as const };
}
