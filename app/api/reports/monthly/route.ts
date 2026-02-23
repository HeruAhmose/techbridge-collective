import { NextRequest } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/db/prisma";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseMonth(v: string | null) {
  const now = new Date();
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const s = (v || fallback).trim();

  if (!/^\d{4}-\d{2}$/.test(s)) return fallback;
  const [y, m] = s.split("-").map((x) => Number(x));
  if (m < 1 || m > 12) return fallback;
  return s;
}

function monthRange(month: string) {
  const [y, m] = month.split("-").map((x) => Number(x));
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);
  return { start, end };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const month = parseMonth(url.searchParams.get("month"));
  const format = (url.searchParams.get("format") || "pdf").toLowerCase();
  const { start, end } = monthRange(month);

  const total = await prisma.techMinute.aggregate({
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end } },
  });

  const byHub = await prisma.techMinute.groupBy({
    by: ["hubLocationId"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end } },
    orderBy: [{ _sum: { minutes: "desc" } }],
  });

  const hubs = await prisma.hubLocation.findMany({
    where: { id: { in: byHub.map((x) => x.hubLocationId) } },
  });
  const hubName = new Map(hubs.map((h) => [h.id, h.name]));

  const byCategory = await prisma.techMinute.groupBy({
    by: ["category"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end } },
    orderBy: [{ _sum: { minutes: "desc" } }],
    take: 10,
  });

  const byOutcome = await prisma.techMinute.groupBy({
    by: ["outcome"],
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end } },
  });

  if (format === "csv") {
    const rows = [
      { metric: "month", value: month },
      { metric: "total_minutes", value: total._sum.minutes ?? 0 },
      { metric: "sessions_logged", value: total._count._all ?? 0 },
      ...byOutcome.map((o) => ({ metric: `outcome_${o.outcome}`, value: o._count._all })),
      ...byCategory.map((c) => ({
        metric: `category_${c.category}`,
        value: `${c._sum.minutes ?? 0}m (${c._count._all} sessions)`,
      })),
      ...byHub.map((h) => ({
        metric: `hub_${hubName.get(h.hubLocationId) || h.hubLocationId}`,
        value: `${h._sum.minutes ?? 0}m (${h._count._all} sessions)`,
      })),
    ];

    const csv = toCsv(rows);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="techminutes-${month}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const doc = new PDFDocument({ size: "LETTER", margin: 54 });
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  doc.fontSize(20).text("TechBridge Collective — TechMinutes® Report", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor("#444444").text(`Month: ${month}`, { align: "left" });
  doc.fillColor("#000000");
  doc.moveDown(1);

  doc.fontSize(14).text(`Total TechMinutes: ${(total._sum.minutes ?? 0).toLocaleString()}`);
  doc.fontSize(12).text(`Sessions logged: ${(total._count._all ?? 0).toLocaleString()}`);
  doc.moveDown(1);

  doc.fontSize(13).text("Top categories", { underline: true });
  doc.moveDown(0.5);
  if (byCategory.length) {
    byCategory.slice(0, 8).forEach((c) => {
      doc
        .fontSize(11)
        .text(`• ${c.category}: ${(c._sum.minutes ?? 0).toLocaleString()} minutes (${c._count._all} sessions)`);
    });
  } else {
    doc.fontSize(11).fillColor("#666").text("No data yet.").fillColor("#000");
  }

  doc.moveDown(1);
  doc.fontSize(13).text("By hub", { underline: true });
  doc.moveDown(0.5);
  if (byHub.length) {
    byHub.slice(0, 8).forEach((h) => {
      const name = hubName.get(h.hubLocationId) || h.hubLocationId;
      doc
        .fontSize(11)
        .text(`• ${name}: ${(h._sum.minutes ?? 0).toLocaleString()} minutes (${h._count._all} sessions)`);
    });
  } else {
    doc.fontSize(11).fillColor("#666").text("No data yet.").fillColor("#000");
  }

  doc.moveDown(1);
  doc
    .fontSize(10)
    .fillColor("#666")
    .text("Non‑PII aggregate metrics only. Never share passwords, SSNs, or 2FA codes.");
  doc.end();

  const pdf = await done;

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="techminutes-${month}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

