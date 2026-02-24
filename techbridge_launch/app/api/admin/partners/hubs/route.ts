import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { apiGuard } from "@/lib/auth/apiGuard";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  hubLocationId: z.string().min(1),
  partnerOrgId:  z.string().min(1),
});

export async function POST(req: NextRequest) {
  const user = await getSignedInUser();
  const deny = apiGuard(user, ["ADMIN"]);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  await prisma.hubLocation.update({
    where: { id: parsed.data.hubLocationId },
    data:  { partnerOrgId: parsed.data.partnerOrgId },
  });

  return NextResponse.json({ ok: true });
}
