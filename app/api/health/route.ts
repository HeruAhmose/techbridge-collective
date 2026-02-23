import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, ts: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
