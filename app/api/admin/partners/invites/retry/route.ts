import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { rateLimit } from "@/lib/rateLimit";
import { UserRole } from "@prisma/client";
import { attemptSendInviteEmail } from "@/lib/email/inviteTracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({ inviteId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const actor = await getSignedInUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (actor.role !== UserRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!rateLimit(`admin-invite-retry:${actor.id}`, { limit: 30, windowMs: 60_000 }).ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const result = await attemptSendInviteEmail(parsed.data.inviteId);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true, email: result });
}
