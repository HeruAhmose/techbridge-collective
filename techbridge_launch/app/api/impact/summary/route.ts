import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clampInt(v: string | null, d: number, min: number, max: number) {
  const n = Number(v ?? d);
  if (!Number.isFinite(n)) return d;
  return Math.min(Math.max(Math.trunc(n), min), max);
}

function fmtWeekLabel(d: Date) {
  // e.g. "Jan 05"
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const days = clampInt(url.searchParams.get("days"), 30, 7, 365);

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [agg, outcomes, cats, hubsAgg, recent] = await Promise.all([
    prisma.techMinute.aggregate({
      _sum: { minutes: true },
      _count: { _all: true },
      where: { createdAt: { gte: since } },
    }),
    prisma.techMinute.groupBy({
      by: ["outcome"],
      _count: { _all: true },
      where: { createdAt: { gte: since } },
    }),
    prisma.techMinute.groupBy({
      by: ["category"],
      _sum: { minutes: true },
      _count: { _all: true },
      where: { createdAt: { gte: since } },
      orderBy: [{ _sum: { minutes: "desc" } }],
      take: 10,
    }),
    prisma.techMinute.groupBy({
      by: ["hubLocationId"],
      _sum: { minutes: true },
      _count: { _all: true },
      where: { createdAt: { gte: since } },
      orderBy: [{ _sum: { minutes: "desc" } }],
      take: 10,
    }),
    prisma.techMinute.findMany({
      where: { createdAt: { gte: since } },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
      select: {
        id: true,
        createdAt: true,
        minutes: true,
        category: true,
        outcome: true,
        hubLocationId: true,
      },
    }),
  ]);

  // Weekly trend (server-side) via Postgres date_trunc('week').
  const weeklyRaw = await prisma.$queryRaw<
    Array<{ week_start: Date; minutes: bigint; sessions: bigint }>
  >`
    SELECT date_trunc('week', "createdAt") as week_start,
           COALESCE(SUM("minutes"), 0)     as minutes,
           COUNT(*)                        as sessions
    FROM "TechMinute"
    WHERE "createdAt" >= ${since}
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const hubNames = await prisma.hubLocation.findMany({ select: { id: true, name: true } });
  const hubMap = new Map(hubNames.map((h) => [h.id, h.name]));

  const out = {
    days,
    minutes: Number(agg._sum.minutes ?? 0),
    sessions: Number(agg._count._all ?? 0),
    resolved: outcomes.find((o) => o.outcome === "RESOLVED")?._count._all ?? 0,
    needsHelp: outcomes.find((o) => o.outcome === "NEEDS_HELP")?._count._all ?? 0,
    followUp: outcomes.find((o) => o.outcome === "FOLLOW_UP")?._count._all ?? 0,
    categories: cats.map((c) => ({
      name: c.category,
      minutes: Number(c._sum.minutes ?? 0),
      sessions: Number(c._count._all ?? 0),
    })),
    hubs: hubsAgg.map((h) => ({
      name: hubMap.get(h.hubLocationId) ?? h.hubLocationId,
      minutes: Number(h._sum.minutes ?? 0),
      sessions: Number(h._count._all ?? 0),
    })),
    weekly: weeklyRaw.map((w) => ({
      week: fmtWeekLabel(new Date(w.week_start)),
      minutes: Number(w.minutes),
      sessions: Number(w.sessions),
    })),
    recent: recent.map((r) => ({
      id: r.id,
      hub: hubMap.get(r.hubLocationId) ?? r.hubLocationId,
      cat: r.category,
      min: r.minutes,
      outcome: r.outcome,
      at: r.createdAt.toISOString(),
    })),
  };

  return NextResponse.json(out, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
