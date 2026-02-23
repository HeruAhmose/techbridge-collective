import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { InviteEmailStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireBasicAuth(req: NextRequest) {
  const u = process.env.POSTMARK_WEBHOOK_BASIC_USER;
  const p = process.env.POSTMARK_WEBHOOK_BASIC_PASS;
  if (!u || !p) return true;

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Basic ")) return false;

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
  const [user, pass] = decoded.split(":");
  return user === u && pass === p;
}

export async function POST(req: NextRequest) {
  if (!requireBasicAuth(req)) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return new NextResponse("Bad request", { status: 400 });

  const messageId = String(body.MessageID || body.MessageId || "");
  const recordType = String(body.RecordType || "");
  const deliveredAt = body.DeliveredAt ? String(body.DeliveredAt) : null;
  const bouncedAt = body.BouncedAt ? String(body.BouncedAt) : null;

  let status: InviteEmailStatus | null = null;
  if (recordType.toLowerCase() === "delivery" || deliveredAt) status = InviteEmailStatus.DELIVERED;
  if (recordType.toLowerCase() === "bounce" || bouncedAt) status = InviteEmailStatus.FAILED;

  const invite = messageId
    ? await prisma.partnerInvite.findFirst({ where: { emailMessageId: messageId } })
    : null;

  await prisma.emailDeliveryEvent.create({
    data: {
      provider: "postmark",
      messageId: messageId || null,
      inviteId: invite?.id ?? null,
      eventType: recordType || (deliveredAt ? "Delivery" : bouncedAt ? "Bounce" : "Unknown"),
      payload: body as any,
    },
  });

  if (!invite || !status) return NextResponse.json({ ok: true });

  const update: any = { emailStatus: status };
  if (status === InviteEmailStatus.DELIVERED) update.emailDeliveredAt = new Date(deliveredAt || Date.now());
  if (status === InviteEmailStatus.FAILED) update.emailLastError = String(body.Details || body.Description || "Bounced");

  await prisma.partnerInvite.update({ where: { id: invite.id }, data: update });

  return NextResponse.json({ ok: true });
}
