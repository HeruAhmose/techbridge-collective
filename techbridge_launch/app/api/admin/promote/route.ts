import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { apiGuard } from "@/lib/auth/apiGuard";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email(),
  role:  z.nativeEnum(UserRole),
});

export async function POST(req: NextRequest) {
  const user = await getSignedInUser();
  const deny = apiGuard(user, ["ADMIN"]);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const updated = await prisma.user.updateMany({
    where: { email: parsed.data.email.toLowerCase() },
    data:  { role: parsed.data.role },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { error: "User not found — they must sign in once first." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
