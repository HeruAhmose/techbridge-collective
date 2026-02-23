import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { apiGuard } from "@/lib/auth/apiGuard";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  partnerOrgId: z.string().min(1),
  email:        z.string().email(),
});

export async function POST(req: NextRequest) {
  const user = await getSignedInUser();
  const deny = apiGuard(user, ["ADMIN"]);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const target = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!target) {
    return NextResponse.json(
      { error: "User not found — they must sign in once first. Use /invites to queue for new users." },
      { status: 404 },
    );
  }

  if (target.role === UserRole.PUBLIC) {
    await prisma.user.update({ where: { id: target.id }, data: { role: UserRole.PARTNER } });
  }

  await prisma.partnerMembership.upsert({
    where:  { partnerOrgId_userId: { partnerOrgId: parsed.data.partnerOrgId, userId: target.id } },
    update: {},
    create: { partnerOrgId: parsed.data.partnerOrgId, userId: target.id },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
