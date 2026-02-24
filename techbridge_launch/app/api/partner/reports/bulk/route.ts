import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { assertOrgAccess } from "@/lib/partner/getPartnerContext";
import { buildHubCsvFilesForMonth, buildHubSessionRowCsvFilesForMonth, buildPartnerCsv, buildPartnerPdf, getPartnerScopedData, monthAdd, parseMonth, slug } from "@/lib/partner/report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function monthToInt(m: string) {
  const [y, mo] = m.split("-").map((x) => Number(x));
  return y * 12 + (mo - 1);
}

function intToMonth(v: number) {
  const y = Math.floor(v / 12);
  const m = (v % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function monthsBetweenInclusive(start: string, end: string) {
  const a = monthToInt(start);
  const b = monthToInt(end);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const out: string[] = [];
  for (let i = lo; i <= hi; i += 1) out.push(intToMonth(i));
  return { months: out, swapped: a > b };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orgId = url.searchParams.get("org");
  if (!orgId) return NextResponse.json({ error: "Missing org." }, { status: 400 });

  const access = await assertOrgAccess(orgId);
  if (!access.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const startParam = url.searchParams.get("start");
  const endParam   = url.searchParams.get("end");
  const anchorMonth = parseMonth(url.searchParams.get("month"));

  let monthList: string[];
  if (startParam || endParam) {
    const start = parseMonth(startParam || anchorMonth);
    const end   = parseMonth(endParam || anchorMonth);
    const r = monthsBetweenInclusive(start, end);
    monthList = r.months;
  } else {
    const months = Math.min(Math.max(Number(url.searchParams.get("months") || 12), 1), 24);
    monthList = Array.from({ length: months }, (_, i) => monthAdd(anchorMonth, -i));
  }

  if (monthList.length > 24) monthList = monthList.slice(0, 24);

  const includeHubCsv = ["1", "true", "yes"].includes(String(url.searchParams.get("includeHubCsv") || "").toLowerCase());
  const includeSessionRows = ["1", "true", "yes"].includes(String(url.searchParams.get("includeSessionRows") || "").toLowerCase());
  const includeResolution = ["1", "true", "yes"].includes(String(url.searchParams.get("includeResolution") || "").toLowerCase());

  const extraColumnsRaw = String(url.searchParams.get("extraColumns") || "").toLowerCase();
  const requested = extraColumnsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const allowed = new Set(["resolution"]);
  const accepted = requested.filter((c) => allowed.has(c));


const sortedMonths = [...monthList].sort((a, b) => monthToInt(a) - monthToInt(b));
const rangeLabel = `${sortedMonths[0]}_to_${sortedMonths[sortedMonths.length - 1]}`.replace(/[^0-9A-Za-z_-]/g, "-");

  const zip = new JSZip();

  for (const month of monthList) {
    const data = await getPartnerScopedData({ orgId, month });
    if (!data) return NextResponse.json({ error: "Org not found." }, { status: 404 });

    const orgSlug = slug(data.org.name);
    const totalMinutes = data.total._sum.minutes ?? 0;
    const sessions = data.total._count._all ?? 0;

    const byOutcome = data.byOutcome.map((o) => ({ outcome: String(o.outcome), count: o._count._all }));
    const byCategory = data.byCategory.map((c) => ({ category: c.category, minutes: c._sum.minutes ?? 0, sessions: c._count._all }));
    const byHub = data.byHub.map((h) => ({
      hub: data.hubName.get(h.hubLocationId) || h.hubLocationId,
      minutes: h._sum.minutes ?? 0,
      sessions: h._count._all,
    }));

    zip.file(
      `partner-${orgSlug}-${month}.csv`,
      buildPartnerCsv({ orgName: data.org.name, month, totalMinutes, sessions, byOutcome, byCategory, byHub }),
    );
    zip.file(
      `partner-${orgSlug}-${month}.pdf`,
      await buildPartnerPdf({ orgName: data.org.name, month, totalMinutes, sessions, byCategory, byHub }),
    );

    if (includeHubCsv) {
      const hubFiles = await buildHubCsvFilesForMonth({ orgId, month });
      for (const f of hubFiles) zip.file(`${orgSlug}/${month}/${f.filename}`, f.csv);
    }

    if (includeSessionRows) {
      const wantResolution = includeResolution || accepted.includes("resolution");
      const res = await buildHubSessionRowCsvFilesForMonth({ orgId, month, includeResolution: wantResolution, allowedExtraColumns: accepted });
      for (const f of res.files) zip.file(`${orgSlug}/${month}/${f.filename}`, f.csv);
      if (res.warning) zip.file(`${orgSlug}/${month}/warnings/session-rows-warning.txt`, res.warning);
      if (requested.length && accepted.length !== requested.length) {
        const ignored = requested.filter((c) => !accepted.includes(c));
        zip.file(`${orgSlug}/${month}/warnings/extra-columns-warning.txt`, `Ignored extraColumns: ${ignored.join(", ")}. Allowed: resolution.`);
      }
    }
  }

  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="partner-reports-${rangeLabel}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
