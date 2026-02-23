import { prisma } from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";

export async function applyPartnerInvites(params: { userId: string; email: string }) {
  const email = params.email.toLowerCase();

  const invites = await prisma.partnerInvite.findMany({
    where: { email, consumedAt: null },
    orderBy: [{ createdAt: "asc" }],
    take: 25,
  });

  if (invites.length === 0) return { applied: 0 };

  for (const inv of invites) {
    await prisma.partnerMembership.upsert({
      where: { partnerOrgId_userId: { partnerOrgId: inv.partnerOrgId, userId: params.userId } },
      update: {},
      create: { partnerOrgId: inv.partnerOrgId, userId: params.userId },
    });

    await prisma.partnerInvite.update({
      where: { id: inv.id },
      data: { consumedAt: new Date(), consumedByUserId: params.userId },
    });
  }

  const u = await prisma.user.findUnique({ where: { id: params.userId } });
  if (u && u.role === UserRole.PUBLIC) {
    await prisma.user.update({ where: { id: params.userId }, data: { role: UserRole.PARTNER } });
  }

  return { applied: invites.length };
}
