import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";

export async function requireRole(roles: UserRole[]) {
  const user = await getSignedInUser();
  if (!user) redirect("/sign-in");
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
