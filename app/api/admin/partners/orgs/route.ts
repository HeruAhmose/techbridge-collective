import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { apiGuard } from "@/lib/auth/apiGuard";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getSignedInUser();
  const deny = apiGuard(user, ["ADMIN"]);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = z.object({ name: z.string().min(1).max(200) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const org = await prisma.partnerOrganization.upsert({
    where:  { name: parsed.data.name },
    update: {},
    create: { name: parsed.data.name },
  });

  return NextResponse.json({ id: org.id }, { status: 201 });
}
