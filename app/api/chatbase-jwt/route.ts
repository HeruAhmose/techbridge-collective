/**
 * SERVER-SIDE ONLY — /api/chatbase-jwt
 *
 * Signs a Chatbase identity JWT using CHATBOT_IDENTITY_SECRET from env.
 * The secret NEVER leaves this file or the server. The signed short-lived token
 * is returned to an authenticated client so the widget can call:
 *   window.chatbase('identify', { token })
 *
 * Route is protected by Clerk middleware — unauthenticated requests never reach here.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSignedInUser } from "@/lib/auth/getSignedInUser";
import { signChatbaseToken } from "@/lib/chatbase/signChatbaseToken";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";

const noStore = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Pragma": "no-cache",
      "Vary": "Cookie, Authorization",
    },
  });

export async function GET(_req: NextRequest) {
  const secret = process.env.CHATBOT_IDENTITY_SECRET;

  const user = await getSignedInUser();
  if (!user) return noStore({ error: "Unauthorized" }, 401);

  // Identity verification not configured — return null token; widget works anonymously.
  if (!secret) return noStore({ token: null });

  try {
    const token = signChatbaseToken(user, secret);
    return noStore({ token });
  } catch (err) {
    console.error("[chatbase-jwt]", err);
    return noStore({ error: "Token error" }, 500);
  }
}

// Allow POST for clients that prefer it
export const POST = GET;
