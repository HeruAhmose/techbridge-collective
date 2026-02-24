import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";
import { roleForEmail } from "@/lib/auth/roles";
import { applyPartnerInvites } from "@/lib/auth/applyPartnerInvites";

export type SignedInUser = {
  id: string; // DB user id
  clerkUserId: string;
  email: string;
  name: string | null;
  role: UserRole;
};

function primaryEmail(u: any): string | null {
  const primary =
    u.emailAddresses?.find((e: any) => e.id === u.primaryEmailAddressId)?.emailAddress ??
    u.emailAddresses?.[0]?.emailAddress ??
    null;
  return primary ? String(primary).toLowerCase() : null;
}

export async function getSignedInUser(): Promise<SignedInUser | null> {
  const { userId } = auth();
  if (!userId) return null;

  const cu = await clerkClient.users.getUser(userId);
  const email = primaryEmail(cu);
  if (!email) return null;

  const desiredRole = roleForEmail(email);

  const dbUser = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email,
      name: cu.firstName || cu.lastName ? `${cu.firstName ?? ""} ${cu.lastName ?? ""}`.trim() : null,
      role: desiredRole === UserRole.PUBLIC ? undefined : desiredRole,
    },
    create: {
      clerkUserId: userId,
      email,
      name: cu.firstName || cu.lastName ? `${cu.firstName ?? ""} ${cu.lastName ?? ""}`.trim() || null : null,
      role: desiredRole,
    },
  });

  await applyPartnerInvites({ userId: dbUser.id, email: dbUser.email });

  return {
    id: dbUser.id,
    clerkUserId: dbUser.clerkUserId,
    email: dbUser.email,
    name: dbUser.name ?? null,
    role: dbUser.role,
  };
}
