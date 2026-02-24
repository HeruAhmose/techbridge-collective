type EmailProvider = "resend" | "postmark" | "none";

export type InviteSendResult =
  | { sent: false; provider: "none" }
  | { sent: true; provider: "resend" | "postmark"; messageId: string };

function providerFromEnv(): EmailProvider {
  const explicit = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
  if (explicit === "resend" || explicit === "postmark" || explicit === "none") return explicit;
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.POSTMARK_SERVER_TOKEN) return "postmark";
  return "none";
}

function baseUrl(): string {
  const b = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return b.replace(/\/$/, "");
}

function fromEmail(): string {
  return process.env.INVITE_EMAIL_FROM || process.env.EMAIL_FROM || "no-reply@techbridge.local";
}

function inviteLink(): string {
  // /partner is protected by Clerk middleware; it will trigger sign-in if needed.
  return `${baseUrl()}/partner`;
}

function signInLink(): string {
  return `${baseUrl()}/sign-in`;
}

function timeoutMs(): number {
  const n = Number(process.env.EMAIL_SEND_TIMEOUT_MS || 10_000);
  return Number.isFinite(n) ? Math.min(Math.max(n, 2_000), 30_000) : 10_000;
}

function htmlTemplate(params: { orgName: string; inviteUrl: string }) {
  return `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5;">
    <h2 style="margin:0 0 12px;">You’ve been invited to a Partner Dashboard</h2>
    <p style="margin:0 0 12px;">Organization: <b>${escapeHtml(params.orgName)}</b></p>
    <p style="margin:0 0 16px;">Use the button below to sign in and view your partner reports.</p>
    <p style="margin:0 0 20px;">
      <a href="${params.inviteUrl}" style="background:#d4a843;color:#0c1a14;text-decoration:none;padding:10px 14px;border-radius:8px;display:inline-block;font-weight:700;">
        Sign in to view dashboard
      </a>
    </p>
    <p style="margin:0 0 8px;color:#555;">If the button doesn't work, open:</p>
    <p style="margin:0 0 20px;"><a href="${params.inviteUrl}">${params.inviteUrl}</a></p>
    <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
    <p style="margin:0;color:#666;font-size:12px;">Security reminder: we will never ask for passwords, SSNs, or 2FA codes in email.</p>
  </div>
  `.trim();
}

function textTemplate(params: { orgName: string; inviteUrl: string; signInUrl: string }) {
  return [
    "You’ve been invited to a Partner Dashboard",
    `Organization: ${params.orgName}`,
    "",
    "Sign in to view your partner reports:",
    params.inviteUrl,
    "",
    `Direct sign-in: ${params.signInUrl}`,
    "",
    "Security reminder: we will never ask for passwords, SSNs, or 2FA codes.",
  ].join("\n");
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs());
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function sendViaResend(params: { to: string; subject: string; html: string; text: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");

  const res = await fetchWithTimeout("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail(),
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${body}`);
  }

  const data = (await res.json().catch(() => ({}))) as { id?: string };
  if (!data.id) throw new Error("Resend: missing id in response");
  return data.id;
}

async function sendViaPostmark(params: { to: string; subject: string; html: string; text: string }) {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) throw new Error("Missing POSTMARK_SERVER_TOKEN");

  const res = await fetchWithTimeout("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: { "X-Postmark-Server-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({
      From: fromEmail(),
      To: params.to,
      Subject: params.subject,
      HtmlBody: params.html,
      TextBody: params.text,
      MessageStream: process.env.POSTMARK_MESSAGE_STREAM || "outbound",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Postmark failed (${res.status}): ${body}`);
  }

  const data = (await res.json().catch(() => ({}))) as { MessageID?: string };
  if (!data.MessageID) throw new Error("Postmark: missing MessageID in response");
  return data.MessageID;
}

export async function sendPartnerInviteEmail(params: { to: string; orgName: string }): Promise<InviteSendResult> {
  const provider = providerFromEnv();
  if (provider === "none") return { sent: false, provider: "none" };

  const inviteUrl = inviteLink();
  const signInUrl = signInLink();
  const subject = `You’re invited: ${params.orgName} Partner Dashboard`;

  const html = htmlTemplate({ orgName: params.orgName, inviteUrl });
  const text = textTemplate({ orgName: params.orgName, inviteUrl, signInUrl });

  if (provider === "resend") {
    const messageId = await sendViaResend({ to: params.to, subject, html, text });
    return { sent: true, provider: "resend", messageId };
  }

  const messageId = await sendViaPostmark({ to: params.to, subject, html, text });
  return { sent: true, provider: "postmark", messageId };
}
