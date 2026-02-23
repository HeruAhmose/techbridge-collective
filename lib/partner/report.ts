import PDFDocument from "pdfkit";
import { prisma } from "@/lib/db/prisma";
import { toCsv } from "@/lib/csv";

export function parseMonth(v: string | null) {
  const now = new Date();
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const s = (v || fallback).trim();
  if (!/^\d{4}-\d{2}$/.test(s)) return fallback;

  const [y, m] = s.split("-").map(Number);
  if (m < 1 || m > 12) return fallback;
  return s;
}

export function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  return { start: new Date(y, m - 1, 1), end: new Date(y, m, 1) };
}

export function monthAdd(month: string, deltaMonths: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + deltaMonths, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getPartnerScopedData(params: { orgId: string; month: string }) {
  const org = await prisma.partnerOrganization.findUnique({ where: { id: params.orgId } });
  if (!org) return null;

  const hubs = await prisma.hubLocation.findMany({ where: { partnerOrgId: params.orgId } });
  const hubIds = hubs.map((h) => h.id);
  const hubName = new Map(hubs.map((h) => [h.id, h.name]));

  const { start, end } = monthRange(params.month);

  const where = {
    createdAt: { gte: start, lt: end },
    hubLocationId: { in: hubIds.length ? hubIds : ["__none__"] },
  } as const;

  const total = await prisma.techMinute.aggregate({
    _sum: { minutes: true },
    _count: { _all: true },
    where: where as any,
  });

  const byHub = await prisma.techMinute.groupBy({
    by: ["hubLocationId"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: where as any,
    orderBy: [{ _sum: { minutes: "desc" } }],
  });

  const byCategory = await prisma.techMinute.groupBy({
    by: ["category"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: where as any,
    orderBy: [{ _sum: { minutes: "desc" } }],
    take: 10,
  });

  const byOutcome = await prisma.techMinute.groupBy({
    by: ["outcome"],
    _count: { _all: true },
    where: where as any,
  });

  return { org, hubs, hubName, total, byHub, byCategory, byOutcome };
}

export function buildPartnerCsv(params: {
  orgName: string;
  month: string;
  totalMinutes: number;
  sessions: number;
  byOutcome: Array<{ outcome: string; count: number }>;
  byCategory: Array<{ category: string; minutes: number; sessions: number }>;
  byHub: Array<{ hub: string; minutes: number; sessions: number }>;
}) {
  const rows = [
    { metric: "org", value: params.orgName },
    { metric: "month", value: params.month },
    { metric: "total_minutes", value: params.totalMinutes },
    { metric: "sessions_logged", value: params.sessions },
    ...params.byOutcome.map((o) => ({ metric: `outcome_${o.outcome}`, value: o.count })),
    ...params.byCategory.map((c) => ({ metric: `category_${c.category}`, value: `${c.minutes}m (${c.sessions} sessions)` })),
    ...params.byHub.map((h) => ({ metric: `hub_${h.hub}`, value: `${h.minutes}m (${h.sessions} sessions)` })),
  ];

  return toCsv(rows);
}

export async function buildPartnerPdf(params: {
  orgName: string;
  month: string;
  totalMinutes: number;
  sessions: number;
  byCategory: Array<{ category: string; minutes: number; sessions: number }>;
  byHub: Array<{ hub: string; minutes: number; sessions: number }>;
}) {
  const doc = new PDFDocument({ size: "LETTER", margin: 54 });
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  doc.fontSize(20).text("TechBridge Collective — Partner Report");
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor("#444").text(`Organization: ${params.orgName}`);
  doc.fontSize(12).fillColor("#444").text(`Month: ${params.month}`);
  doc.fillColor("#000").moveDown(1);

  doc.fontSize(14).text(`Total TechMinutes: ${params.totalMinutes.toLocaleString()}`);
  doc.fontSize(12).text(`Sessions logged: ${params.sessions.toLocaleString()}`);
  doc.moveDown(1);

  doc.fontSize(13).text("Top categories", { underline: true }).moveDown(0.5);
  if (params.byCategory.length) {
    params.byCategory.slice(0, 8).forEach((c) =>
      doc.fontSize(11).text(`• ${c.category}: ${c.minutes.toLocaleString()} minutes (${c.sessions} sessions)`),
    );
  } else {
    doc.fontSize(11).fillColor("#666").text("No data yet.").fillColor("#000");
  }

  doc.moveDown(1);
  doc.fontSize(13).text("By hub", { underline: true }).moveDown(0.5);
  if (params.byHub.length) {
    params.byHub.slice(0, 10).forEach((h) =>
      doc.fontSize(11).text(`• ${h.hub}: ${h.minutes.toLocaleString()} minutes (${h.sessions} sessions)`),
    );
  } else {
    doc.fontSize(11).fillColor("#666").text("No data yet.").fillColor("#000");
  }

  doc.moveDown(1);
  doc.fontSize(10).fillColor("#666").text("Non-PII aggregate metrics only. Never share passwords, SSNs, or 2FA codes.");
  doc.end();

  return await done;
}

export async function buildHubCsvFilesForMonth(params: { orgId: string; month: string }) {
  const org = await prisma.partnerOrganization.findUnique({ where: { id: params.orgId } });
  if (!org) return [];

  const hubs = await prisma.hubLocation.findMany({ where: { partnerOrgId: params.orgId } });
  if (hubs.length === 0) return [];

  const hubName = new Map(hubs.map((h) => [h.id, h.name]));
  const hubSlug = new Map(hubs.map((h) => [h.id, slug(h.name)]));
  const hubIds = hubs.map((h) => h.id);

  const { start, end } = monthRange(params.month);

  const totals = await prisma.techMinute.groupBy({
    by: ["hubLocationId"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end }, hubLocationId: { in: hubIds } } as any,
  });

  const outcomes = await prisma.techMinute.groupBy({
    by: ["hubLocationId", "outcome"],
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end }, hubLocationId: { in: hubIds } } as any,
  });

  const cats = await prisma.techMinute.groupBy({
    by: ["hubLocationId", "category"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end }, hubLocationId: { in: hubIds } } as any,
  });

  const totalByHub = new Map(totals.map((t) => [t.hubLocationId, { minutes: t._sum.minutes ?? 0, sessions: t._count._all }]));
  const outcomeByHub = new Map<string, Record<string, number>>();
  for (const o of outcomes) {
    const m = outcomeByHub.get(o.hubLocationId) ?? {};
    m[String(o.outcome)] = o._count._all;
    outcomeByHub.set(o.hubLocationId, m);
  }

  const catByHub = new Map<string, Array<{ category: string; minutes: number; sessions: number }>>();
  for (const c of cats) {
    const arr = catByHub.get(c.hubLocationId) ?? [];
    arr.push({ category: c.category, minutes: c._sum.minutes ?? 0, sessions: c._count._all });
    catByHub.set(c.hubLocationId, arr);
  }

  const files: Array<{ filename: string; csv: string }> = [];

  for (const h of hubs) {
    const totalsRow = totalByHub.get(h.id) ?? { minutes: 0, sessions: 0 };
    const o = outcomeByHub.get(h.id) ?? {};
    const c = (catByHub.get(h.id) ?? []).sort((a, b) => b.minutes - a.minutes).slice(0, 12);

    const rows = [
      { metric: "org", value: org.name },
      { metric: "month", value: params.month },
      { metric: "hub", value: hubName.get(h.id) || h.id },
      { metric: "total_minutes", value: totalsRow.minutes },
      { metric: "sessions_logged", value: totalsRow.sessions },
      ...Object.entries(o).map(([k, v]) => ({ metric: `outcome_${k}`, value: v })),
      ...c.map((x) => ({ metric: `category_${x.category}`, value: `${x.minutes}m (${x.sessions} sessions)` })),
    ];

    files.push({ filename: `hubs/hub-${hubSlug.get(h.id) || h.id}-${params.month}.csv`, csv: toCsv(rows) });
  }

  return files;
}

export async function buildHubSessionRowCsvFilesForMonth(params: {
  orgId: string;
  month: string;
  includeResolution?: boolean;
  allowedExtraColumns?: string[];
  maxRows?: number;
  chunkSize?: number;
}) {
  const org = await prisma.partnerOrganization.findUnique({ where: { id: params.orgId } });
  if (!org) return { files: [], warning: "Org not found." as string | null };

  const hubs = await prisma.hubLocation.findMany({ where: { partnerOrgId: params.orgId } });
  if (hubs.length === 0) return { files: [], warning: null as string | null };

  const hubName = new Map(hubs.map((h) => [h.id, h.name]));
  const hubSlug = new Map(hubs.map((h) => [h.id, slug(h.name)]));
  const hubIds = hubs.map((h) => h.id);

  const maxRows = params.maxRows ?? Number(process.env.SESSION_EXPORT_MAX_ROWS || 50_000);
  const chunkSize = params.chunkSize ?? Number(process.env.SESSION_EXPORT_CHUNK_SIZE || 10_000);

  const allow = new Set(params.allowedExtraColumns ?? []);
  const includeResolutionCol = Boolean(params.includeResolution) || allow.has("resolution");

  const { start, end } = monthRange(params.month);

  const select: any = {
    id: true,
    createdAt: true,
    hubLocationId: true,
    minutes: true,
    category: true,
    outcome: true,
    isEscalated: true,
  };
  if (includeResolutionCol) select.resolution = true;

  const rows = await prisma.techMinute.findMany({
    where: { createdAt: { gte: start, lt: end }, hubLocationId: { in: hubIds } } as any,
    orderBy: [{ hubLocationId: "asc" }, { createdAt: "asc" }],
    take: maxRows + 1,
    select,
  });

  if (rows.length > maxRows) {
    return {
      files: [],
      warning: `Too many session rows for ${params.month}. Limit is ${maxRows}. Narrow the date range or raise SESSION_EXPORT_MAX_ROWS.`,
    };
  }

  const byHub = new Map<string, any[]>();
  for (const r of rows) {
    const arr = byHub.get(r.hubLocationId) ?? [];
    arr.push(r);
    byHub.set(r.hubLocationId, arr);
  }

  const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

  const files: Array<{ filename: string; csv: string }> = [];

  for (const [hubId, hubRows] of byHub.entries()) {
    const hSlug = hubSlug.get(hubId) || hubId;
    const hName = hubName.get(hubId) || hubId;

    const parts = Math.max(1, Math.ceil(hubRows.length / chunkSize));

    for (let i = 0; i < parts; i += 1) {
      const chunk = hubRows.slice(i * chunkSize, (i + 1) * chunkSize);

      const header = includeResolutionCol
        ? "session_id,created_at,hub,minutes,category,outcome,escalated,resolution"
        : "session_id,created_at,hub,minutes,category,outcome,escalated";

      const lines = chunk.map((x) => {
        const created = new Date(x.createdAt).toISOString();
        const esc = x.isEscalated ? "yes" : "no";
        const base = [q(String(x.id)), q(created), q(hName), String(x.minutes), q(String(x.category)), q(String(x.outcome)), esc];
        if (!includeResolutionCol) return base.join(",");

        const reso = q(String(x.resolution || "").replace(/\s+/g, " ").slice(0, 300));
        return [...base, reso].join(",");
      });

      const csv = [header, ...lines].join("\n");
      const suffix = parts > 1 ? `-part-${String(i + 1).padStart(3, "0")}` : "";
      files.push({ filename: `sessions/hub-${hSlug}-${params.month}-sessions${suffix}.csv`, csv });
    }
  }

  return { files, warning: null };
}
