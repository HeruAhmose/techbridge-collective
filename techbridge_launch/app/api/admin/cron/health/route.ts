import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { UserRole } from "@prisma/client";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const actor = await getSignedInUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (actor.role !== UserRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!rateLimit(`admin-cron-health:${actor.id}`, { limit: 60, windowMs: 60_000 }).ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const url = new URL(req.url);
  const job = (url.searchParams.get("job") || "invite-retry").slice(0, 80);

  const runs = await prisma.cronRun.findMany({
    where: { jobName: job },
    orderBy: [{ startedAt: "desc" }],
    take: 25,
  });

  const latest = runs[0] || null;

  return NextResponse.json({
    ok: true,
    job,
    latest,
    runs,
  }, { headers: { "Cache-Control": "no-store" } });
}
