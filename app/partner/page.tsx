import { Card } from "@/components/ui";
import { fmtSchedule } from "@/lib/time";
import { prisma } from "@/lib/db/prisma";
import { getPartnerOrgsForUser } from "@/lib/partner/getPartnerContext";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);
  return { start, end };
}

export const dynamic = "force-dynamic";

export default async function PartnerDashboard({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const month = typeof searchParams?.month === "string" ? searchParams.month : currentMonth();
  const orgId = typeof searchParams?.org === "string" ? searchParams.org : null;

  const { user, orgs } = await getPartnerOrgsForUser();
  if (!user) return null;

  if (orgs.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-sm font-semibold text-forest">No partner org assigned</div>
        <p className="mt-2 text-sm text-ink/65">
          Ask an admin to add you to a Partner Organization.
        </p>
      </Card>
    );
  }

  const activeOrg = orgId ? orgs.find((o) => o.id === orgId) : orgs[0];
  if (!activeOrg) {
    return (
      <Card className="p-6">
        <div className="text-sm font-semibold text-forest">Org not found</div>
        <p className="mt-2 text-sm text-ink/65">Choose an organization you have access to.</p>
      </Card>
    );
  }

  const hubs = await prisma.hubLocation.findMany({
    where: { partnerOrgId: activeOrg.id },
    orderBy: [{ city: "asc" }, { name: "asc" }],
    include: { schedules: { where: { isActive: true }, orderBy: [{ dayOfWeek: "asc" }] } },
  });

  const hubIds = hubs.map((h) => h.id);
  const { start, end } = monthRange(month);

  const total = await prisma.techMinute.aggregate({
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end }, hubLocationId: { in: hubIds.length ? hubIds : ["__none__"] } },
  });

  const byCategory = await prisma.techMinute.groupBy({
    by: ["category"],
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: start, lt: end }, hubLocationId: { in: hubIds.length ? hubIds : ["__none__"] } },
    orderBy: [{ _sum: { minutes: "desc" } }],
    take: 8,
  });

  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink/60">Organization</div>
            <div className="text-xl font-semibold text-forest">{activeOrg.name}</div>
            <div className="mt-1 text-sm text-ink/60">Month: {month}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {orgs.length > 1 ? (
              <div className="flex flex-wrap gap-2 text-sm">
                {orgs.map((o) => (
                  <a
                    key={o.id}
                    className={
                      "rounded-md border px-3 py-2 no-underline hover:bg-linen " +
                      (o.id === activeOrg.id ? "border-forest bg-cream" : "border-ink/10 bg-white")
                    }
                    href={`/partner?org=${o.id}&month=${month}`}
                  >
                    {o.name}
                  </a>
                ))}
              </div>
            ) : null}

            <a
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href={`/api/partner/reports/monthly?format=pdf&month=${month}&org=${activeOrg.id}`}
            >
              Download PDF
            </a>
            <a
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href={`/api/partner/reports/monthly?format=csv&month=${month}&org=${activeOrg.id}`}
            >
              Download CSV
            </a>
            <a
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href={`/api/partner/reports/bulk?months=12&month=${month}&org=${activeOrg.id}`}
            >
              Download last 12 months (ZIP)
            </a>
            <a
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href={`/api/partner/reports/bulk?months=12&month=${month}&org=${activeOrg.id}&includeHubCsv=1`}
            >
              ZIP + hub CSVs
            </a>
            <a
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href={`/api/partner/reports/bulk?months=12&month=${month}&org=${activeOrg.id}&includeHubCsv=1&includeSessionRows=1`}
            >
              ZIP + hub CSVs + sessions
            </a>
            <a
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href={`/api/partner/reports/bulk?months=12&month=${month}&org=${activeOrg.id}&includeHubCsv=1&includeSessionRows=1&includeResolution=1`}
            >
              ZIP + hub CSVs + sessions + resolution
            </a>
<form
  className="flex flex-wrap items-end gap-2 rounded-md border border-ink/10 bg-white p-2"
  action="/api/partner/reports/bulk"
  method="get"
>
  <input type="hidden" name="org" value={activeOrg.id} />
  <label className="grid gap-1 text-xs text-ink/60">
    Start
    <input className="rounded-md border border-ink/15 bg-white px-2 py-1 text-sm" type="month" name="start" />
  </label>
  <label className="grid gap-1 text-xs text-ink/60">
    End
    <input className="rounded-md border border-ink/15 bg-white px-2 py-1 text-sm" type="month" name="end" />
  </label>
  <label className="flex items-center gap-2 text-xs text-ink/60">
    <input type="checkbox" name="includeHubCsv" value="1" className="h-4 w-4" />
    Include hub CSVs
  </label>
  <label className="flex items-center gap-2 text-xs text-ink/60">
    <input type="checkbox" name="includeSessionRows" value="1" className="h-4 w-4" />
    Include session rows
  </label>
  <button
    className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-cream hover:bg-forest"
    type="submit"
  >
    Download ZIP (range)
  </button>
  <div className="text-[11px] text-ink/50">Max 24 months</div>
</form>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="text-4xl font-semibold text-gold">{total._sum.minutes ?? 0}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-ink/60">TechMinutes</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-semibold text-gold">{total._count._all ?? 0}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-ink/60">Sessions</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-4xl font-semibold text-gold">
            {(total._count._all ?? 0) ? Math.round(((total._sum.minutes ?? 0) / (total._count._all ?? 1)) * 10) / 10 : 0}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-ink/60">Avg minutes</div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="text-sm font-semibold text-forest">Assigned hubs</div>
          <div className="mt-4 grid gap-2">
            {hubs.map((h) => (
              <div key={h.id} className="rounded-md border border-ink/10 bg-white p-3">
                <div className="text-sm font-semibold text-ink">{h.name}</div>
                <div className="mt-1 text-xs text-ink/60">
                  {h.address}, {h.city}, {h.state} {h.zip}
                </div>
                {h.schedules?.length ? (
                  <div className="mt-2 grid gap-1">
                    {h.schedules.slice(0, 5).map((s) => (
                      <div key={s.id} className="text-xs text-ink/70">
                        {fmtSchedule(s.dayOfWeek, s.startTime, s.endTime)} • {s.cadence}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-ink/50">No active schedule on file.</div>
                )}
              </div>
            ))}
            {hubs.length === 0 ? <div className="text-sm text-ink/60">No hubs assigned yet.</div> : null}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-semibold text-forest">Top categories</div>
          <div className="mt-4 grid gap-2">
            {byCategory.map((c) => (
              <div key={c.category} className="flex items-center justify-between">
                <div className="text-sm text-ink/80">{c.category}</div>
                <div className="text-sm font-semibold text-forest">{c._sum.minutes ?? 0}m</div>
              </div>
            ))}
            {byCategory.length === 0 ? <div className="text-sm text-ink/60">No data for this month.</div> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
