import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export type SignedInUser = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  role: string;
};

export async function getSignedInUser(): Promise<SignedInUser | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    return await prisma.user.findUnique({ where: { clerkUserId: userId } });
  } catch {
    return null;
  }
}
