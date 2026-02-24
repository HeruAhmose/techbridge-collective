import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  name:                  z.string().max(120).optional(),
  email:                 z.string().email().max(254).optional().or(z.literal("")),
  phone:                 z.string().max(20).optional(),
  language:              z.enum(["EN", "ES"]).default("EN"),
  category:              z.string().min(1).max(120),
  description:           z.string().min(1).max(2000),
  preferredHubLocationId: z.string().optional().or(z.literal("")),
  preferredTime:         z.string().max(120).optional(),
});

export async function POST(req: NextRequest) {
  // 10 requests per IP per 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`intake:resident:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests — please wait a few minutes." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const { name, email, phone, language, category, description, preferredHubLocationId, preferredTime } =
    parsed.data;

  await prisma.residentRequest.create({
    data: {
      name: name || null,
      email: email || null,
      phone: phone || null,
      language,
      category,
      description,
      preferredHubLocationId: preferredHubLocationId || null,
      preferredTime: preferredTime || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
