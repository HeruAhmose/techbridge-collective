import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { apiGuard } from "@/lib/auth/apiGuard";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  hubLocationId:  z.string().min(1),
  minutes:        z.coerce.number().int().min(1).max(480),
  category:       z.string().min(1).max(120),
  outcome:        z.enum(["RESOLVED", "NEEDS_HELP", "FOLLOW_UP"]),
  resolution:     z.string().max(1000).optional(),
  isEscalated:    z.preprocess(
    (v) => v === "on" || v === true || v === "true",
    z.boolean(),
  ).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSignedInUser();
  const deny = apiGuard(user, ["NAVIGATOR", "ADMIN"]);
  if (deny) return deny;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { hubLocationId, minutes, category, outcome, resolution, isEscalated } = parsed.data;

  const log = await prisma.techMinute.create({
    data: {
      hubLocationId,
      navigatorUserId: user!.id,
      minutes,
      category,
      outcome,
      resolution: resolution || null,
      isEscalated: isEscalated ?? false,
    },
  });

  return NextResponse.json({ id: log.id }, { status: 201 });
}

export async function GET() {
  const user = await getSignedInUser();
  const deny = apiGuard(user, ["NAVIGATOR", "ADMIN"]);
  if (deny) return deny;

  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const logs = await prisma.techMinute.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      hubLocation: { select: { name: true } },
      navigator:   { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({ logs }, { headers: { "Cache-Control": "no-store" } });
}
