import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  organization: z.string().min(1).max(200),
  contactName:  z.string().min(1).max(120),
  email:        z.string().email().max(254),
  phone:        z.string().max(20).optional(),
  city:         z.string().max(100).optional(),
  notes:        z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`intake:partner:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const { organization, contactName, email, phone, city, notes } = parsed.data;

  await prisma.partnerRequest.create({
    data: {
      organization,
      contactName,
      email,
      phone: phone || null,
      city:  city  || null,
      notes: notes || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
