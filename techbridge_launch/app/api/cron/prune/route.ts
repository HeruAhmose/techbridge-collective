import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CronRunStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCK_ID = 915_114_032; // Separate advisory lock from invite-retry

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function requireCronAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}

function envInt(name: string, d: number, min: number, max: number) {
  const v = Number(process.env[name] || d);
  if (!Number.isFinite(v)) return d;
  return Math.min(Math.max(v, min), max);
}

async function withPgAdvisoryLock<T>(fn: () => Promise<T>) {
  const got = await prisma.$queryRaw<{ locked: boolean }[]>`SELECT pg_try_advisory_lock(${LOCK_ID}) as locked`;
  if (!got?.[0]?.locked) return { locked: false as const, result: null as T | null };

  try {
    const result = await fn();
    return { locked: true as const, result };
  } finally {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(${LOCK_ID})`;
  }
}

async function cronRunCutoff(keep: number): Promise<Date | null> {
  const offset = keep - 1;
  if (offset < 0) return null;
  const rows = await prisma.$queryRaw<{ ts: Date }[]>`
    SELECT "startedAt" as ts
    FROM "CronRun"
    ORDER BY "startedAt" DESC
    OFFSET ${offset}
    LIMIT 1
  `;
  return rows?.[0]?.ts ?? null;
}

async function emailEventCutoff(keep: number): Promise<Date | null> {
  const offset = keep - 1;
  if (offset < 0) return null;
  const rows = await prisma.$queryRaw<{ ts: Date }[]>`
    SELECT "receivedAt" as ts
    FROM "EmailDeliveryEvent"
    ORDER BY "receivedAt" DESC
    OFFSET ${offset}
    LIMIT 1
  `;
  return rows?.[0]?.ts ?? null;
}

export async function GET(req: NextRequest) {
  if (!requireCronAuth(req)) return unauthorized();

  const cronRun = await prisma.cronRun.create({
    data: { jobName: "prune", status: CronRunStatus.STARTED, meta: { schedule: "17 3 * * *" } },
  });

  const keepCronRuns = envInt("PRUNE_KEEP_CRONRUNS", 2000, 200, 200_000);
  const keepWebhookEvents = envInt("PRUNE_KEEP_WEBHOOK_EVENTS", 50_000, 1_000, 2_000_000);

  const run = await withPgAdvisoryLock(async () => {
    const cronCutoff = await cronRunCutoff(keepCronRuns);
    const deletedCronRuns = cronCutoff
      ? await prisma.cronRun.deleteMany({ where: { startedAt: { lt: cronCutoff } } })
      : { count: 0 };

    const evtCutoff = await emailEventCutoff(keepWebhookEvents);
    const deletedEvents = evtCutoff
      ? await prisma.emailDeliveryEvent.deleteMany({ where: { receivedAt: { lt: evtCutoff } } })
      : { count: 0 };

    return {
      keepCronRuns,
      keepWebhookEvents,
      deletedCronRuns: deletedCronRuns.count,
      deletedEvents: deletedEvents.count,
    };
  });

  const finishedAt = new Date();
  const durationMs = Date.now() - new Date(cronRun.startedAt).getTime();

  if (!run.locked) {
    await prisma.cronRun.update({
      where: { id: cronRun.id },
      data: {
        status: CronRunStatus.SKIPPED,
        locked: false,
        finishedAt,
        durationMs,
        lastError: "Another prune run is active.",
      },
    });

    return NextResponse.json({ ok: true, locked: false, message: "Another prune run is active." });
  }

  await prisma.cronRun.update({
    where: { id: cronRun.id },
    data: {
      status: CronRunStatus.SUCCESS,
      locked: true,
      finishedAt,
      durationMs,
      meta: run.result,
    },
  });

  return NextResponse.json({ ok: true, locked: true, ...run.result });
}
