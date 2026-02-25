import { NextResponse } from "next/server";
import type { SignedInUser } from "@/lib/auth/getSignedInUser";
import type { UserRole } from "@prisma/client";

/**
 * API-route auth guard. Returns a ready NextResponse (401/403) if the user
 * doesn't satisfy the role requirement, otherwise returns null (access granted).
 *
 * Usage in route handlers:
 *   const user = await getSignedInUser();
 *   const deny = apiGuard(user, ["NAVIGATOR", "ADMIN"]);
 *   if (deny) return deny;
 */
export function apiGuard(
  user: SignedInUser | null,
  roles: UserRole[],
): NextResponse | null {
  if (!user) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!roles.includes(user.role as any)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }
  return null;
}

