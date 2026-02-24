import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db/prisma";
import { InviteEmailStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResendEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
    subject?: string;
    bounce?: { message?: string; type?: string; subType?: string };
    error?: { message?: string };
  };
};

function statusForEvent(type: string): InviteEmailStatus | null {
  switch (type) {
    case "email.sent":
      return InviteEmailStatus.SENT;
    case "email.delivered":
      return InviteEmailStatus.DELIVERED;
    case "email.bounced":
    case "email.failed":
      return InviteEmailStatus.FAILED;
    default:
      return null;
  }
}

function verifyIfConfigured(req: NextRequest, raw: string): ResendEvent | null {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return JSON.parse(raw) as ResendEvent;
  }

  const wh = new Webhook(secret);
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  // Throws if invalid.
  return wh.verify(raw, headers) as ResendEvent;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  let evt: ResendEvent;

  try {
    evt = verifyIfConfigured(req, raw) ?? (JSON.parse(raw) as ResendEvent);
  } catch {
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  const messageId = evt.data?.email_id;
  const status = statusForEvent(String(evt.type || ""));

  const invite = messageId
    ? await prisma.partnerInvite.findFirst({ where: { emailMessageId: messageId } })
    : null;

  // Always store event (for audit), even if no matching invite.
  await prisma.emailDeliveryEvent.create({
    data: {
      provider: "resend",
      messageId: messageId ?? null,
      inviteId: invite?.id ?? null,
      eventType: String(evt.type || "unknown"),
      payload: evt as any,
    },
  });

  if (!invite || !status) return NextResponse.json({ ok: true });

  const update: any = { emailStatus: status };
  if (status === InviteEmailStatus.DELIVERED) update.emailDeliveredAt = new Date();
  if (status === InviteEmailStatus.FAILED) {
    update.emailLastError =
      evt.data?.bounce?.message || evt.data?.error?.message || invite.emailLastError || "Delivery failed";
  }

  await prisma.partnerInvite.update({ where: { id: invite.id }, data: update });

  return NextResponse.json({ ok: true });
}
