import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { attemptSendInviteEmail } from "@/lib/email/inviteTracking";
import { CronRunStatus, InviteEmailStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCK_ID = 915_114_031; // Stable lock id for pg_try_advisory_lock

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

function notSentRetrySeconds() {
  return envInt("INVITE_NOT_SENT_RETRY_SECONDS", 3600, 60, 7 * 86_400);
}

function backoffSeconds(attempts: number) {
  const base = envInt("INVITE_RETRY_BASE_SECONDS", 300, 0, 3600); // 5 min default
  const cap = envInt("INVITE_RETRY_MAX_SECONDS", 86_400, 60, 7 * 86_400); // 24h default
  if (attempts <= 0) return 0;
  const delay = base * Math.pow(2, Math.min(attempts - 1, 12));
  return Math.min(delay, cap);
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

export async function GET(req: NextRequest) {
  if (!requireCronAuth(req)) return unauthorized();

  const cronRun = await prisma.cronRun.create({
    data: {
      jobName: "invite-retry",
      status: CronRunStatus.STARTED,
      meta: { schedule: "*/10 * * * *" },
    },
  });

  const batch = envInt("INVITE_CRON_BATCH", 50, 1, 200);
  const now = Date.now();

  const run = await withPgAdvisoryLock(async () => {
    const candidates = await prisma.partnerInvite.findMany({
      where: {
        consumedAt: null,
        emailStatus: { in: [InviteEmailStatus.FAILED, InviteEmailStatus.NOT_SENT] },
        emailAttempts: { lt: envInt("INVITE_EMAIL_MAX_ATTEMPTS", 5, 1, 20) },
      },
      orderBy: [{ emailLastAttemptAt: "asc" }, { createdAt: "asc" }],
      take: batch * 3,
    });

    const eligible = candidates.filter((i) => {
      const delay = i.emailStatus === InviteEmailStatus.NOT_SENT ? notSentRetrySeconds() : backoffSeconds(i.emailAttempts);
      if (!i.emailLastAttemptAt) return true;
      return now - new Date(i.emailLastAttemptAt).getTime() >= delay * 1000;
    });

    let attempted = 0;
    let processed = 0;
    const errors: Array<{ inviteId: string; error: string }> = [];

    for (const inv of eligible.slice(0, batch)) {
      attempted += 1;
      const res = await attemptSendInviteEmail(inv.id);
      processed += 1;
      if (!res.ok) errors.push({ inviteId: inv.id, error: res.error });
    }

    return { attempted, processed, skipped: candidates.length - eligible.length, errors };
  });

  if (!run.locked) {
    await prisma.cronRun.update({
      where: { id: cronRun.id },
      data: {
        status: CronRunStatus.SKIPPED,
        locked: false,
        finishedAt: new Date(),
        durationMs: Date.now() - new Date(cronRun.startedAt).getTime(),
      },
    });

    return NextResponse.json({ ok: true, locked: false, message: "Another cron run is active." });
  }

  await prisma.cronRun.update({
    where: { id: cronRun.id },
    data: {
      status: CronRunStatus.SUCCESS,
      locked: true,
      finishedAt: new Date(),
      durationMs: Date.now() - new Date(cronRun.startedAt).getTime(),
      attempted: run.result?.attempted ?? 0,
      processed: run.result?.processed ?? 0,
      skipped: run.result?.skipped ?? 0,
      errorsCount: Array.isArray(run.result?.errors) ? run.result.errors.length : 0,
      lastError: Array.isArray(run.result?.errors) && run.result.errors.length ? run.result.errors[0].error : null,
    },
  });

  return NextResponse.json({ ok: true, locked: true, ...run.result });
}
