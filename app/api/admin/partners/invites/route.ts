import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { rateLimit } from "@/lib/rateLimit";
import { UserRole } from "@prisma/client";
import { attemptSendInviteEmail } from "@/lib/email/inviteTracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  if (!origin || !base) return true;
  return origin === base;
}

const Schema = z.object({
  partnerOrgId: z.string().min(1),
  email: z.string().email(),
});

export async function GET(req: NextRequest) {
  const actor = await getSignedInUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (actor.role !== UserRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!rateLimit(`admin-invite:${actor.id}`, { limit: 30, windowMs: 60_000 }).ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const url = new URL(req.url);
  const partnerOrgId = url.searchParams.get("partnerOrgId");

  const invites = await prisma.partnerInvite.findMany({
    where: partnerOrgId ? { partnerOrgId } : undefined,
    include: { partnerOrg: true },
    orderBy: [{ createdAt: "desc" }],
    take: 200,
  });

  return NextResponse.json({
    invites: invites.map((i) => ({
      id: i.id,
      email: i.email,
      orgId: i.partnerOrgId,
      orgName: i.partnerOrg.name,
      createdAt: i.createdAt,
      consumedAt: i.consumedAt,
      emailStatus: i.emailStatus,
      emailProvider: i.emailProvider,
      emailMessageId: i.emailMessageId,
      emailAttempts: i.emailAttempts,
      emailLastAttemptAt: i.emailLastAttemptAt,
      emailDeliveredAt: i.emailDeliveredAt,
      emailLastError: i.emailLastError,
    })),
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 400 });
  const actor = await getSignedInUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (actor.role !== UserRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!rateLimit(`admin-invite:${actor.id}`, { limit: 30, windowMs: 60_000 }).ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const partnerOrgId = parsed.data.partnerOrgId;

  const org = await prisma.partnerOrganization.findUnique({ where: { id: partnerOrgId } });
  if (!org) return NextResponse.json({ error: "Org not found." }, { status: 404 });

  const inv = await prisma.partnerInvite.upsert({
    where: { partnerOrgId_email: { partnerOrgId, email } },
    update: { consumedAt: null, consumedByUserId: null },
    create: { partnerOrgId, email },
  });

  const sendResult = await attemptSendInviteEmail(inv.id);

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await prisma.partnerMembership.upsert({
      where: { partnerOrgId_userId: { partnerOrgId, userId: user.id } },
      update: {},
      create: { partnerOrgId, userId: user.id },
    });

    if (user.role === UserRole.PUBLIC) {
      await prisma.user.update({ where: { id: user.id }, data: { role: UserRole.PARTNER } });
    }

    await prisma.partnerInvite.update({
      where: { id: inv.id },
      data: { consumedAt: new Date(), consumedByUserId: user.id },
    });

    return NextResponse.json({ ok: true, appliedNow: true, email: sendResult });
  }

  return NextResponse.json({ ok: true, appliedNow: false, email: sendResult });
}
