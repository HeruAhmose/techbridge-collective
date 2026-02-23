import { prisma } from "@/lib/db/prisma";
import { InviteEmailStatus } from "@prisma/client";
import { sendPartnerInviteEmail } from "@/lib/email/sendInviteEmail";

const MAX_ATTEMPTS = Number(process.env.INVITE_EMAIL_MAX_ATTEMPTS || 5);

function clip(s: string, n = 800) {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}…`;
}

export async function attemptSendInviteEmail(inviteId: string) {
  const invite = await prisma.partnerInvite.findUnique({
    where: { id: inviteId },
    include: { partnerOrg: true },
  });

  if (!invite) {
    return { ok: false as const, error: "Invite not found." };
  }

  if (invite.emailStatus === InviteEmailStatus.DELIVERED) {
    return { ok: true as const, status: invite.emailStatus, skipped: true as const };
  }

  if (invite.emailAttempts >= MAX_ATTEMPTS) {
    return { ok: false as const, error: `Max attempts reached (${MAX_ATTEMPTS}).` };
  }

  const now = new Date();

  try {
    const res = await sendPartnerInviteEmail({ to: invite.email, orgName: invite.partnerOrg.name });

    if (res.provider === "none") {
      await prisma.partnerInvite.update({
        where: { id: invite.id },
        data: {
          emailStatus: InviteEmailStatus.NOT_SENT,
          emailProvider: null,
          emailMessageId: null,
          emailLastAttemptAt: now,
          emailLastError: "Email provider not configured (EMAIL_PROVIDER/keys missing).",
        },
      });

      return { ok: true as const, status: InviteEmailStatus.NOT_SENT, provider: "none" as const };
    }

    await prisma.partnerInvite.update({
      where: { id: invite.id },
      data: {
        emailStatus: InviteEmailStatus.SENT,
        emailProvider: res.provider,
        emailMessageId: res.messageId,
        emailAttempts: { increment: 1 },
        emailLastAttemptAt: now,
        emailLastError: null,
      },
    });

    await prisma.emailDeliveryEvent.create({
      data: {
        provider: res.provider,
        messageId: res.messageId,
        inviteId: invite.id,
        eventType: "send.accepted",
        payload: { to: invite.email, org: invite.partnerOrg.name },
      },
    });

    return { ok: true as const, status: InviteEmailStatus.SENT, provider: res.provider, messageId: res.messageId };
  } catch (err: any) {
    const msg = clip(err?.message ? String(err.message) : "Send failed");
    await prisma.partnerInvite.update({
      where: { id: invite.id },
      data: {
        emailStatus: InviteEmailStatus.FAILED,
        emailAttempts: { increment: 1 },
        emailLastAttemptAt: now,
        emailLastError: msg,
      },
    });

    await prisma.emailDeliveryEvent.create({
      data: {
        provider: "unknown",
        messageId: invite.emailMessageId ?? null,
        inviteId: invite.id,
        eventType: "send.failed",
        payload: { error: msg },
      },
    });

    return { ok: false as const, error: msg };
  }
}
