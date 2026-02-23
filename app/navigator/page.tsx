import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Card, Button } from "@/components/ui";

export default async function NavigatorDashboard() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const totals = await prisma.techMinute.aggregate({
    _sum: { minutes: true },
    _count: { _all: true },
    where: { createdAt: { gte: since } },
  });

  const openResidents = await prisma.residentRequest.count({ where: { status: "NEW" } });
  const openPartners = await prisma.partnerRequest.count({ where: { status: "NEW" } });

  const recent = await prisma.techMinute.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { hubLocation: true, navigator: true },
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-semibold text-forest">{(totals._sum.minutes ?? 0).toLocaleString()}</div>
          <div className="mt-2 text-xs font-mono tracking-[0.18em] text-ink/50">MINUTES (7D)</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-semibold text-forest">{(totals._count._all ?? 0).toLocaleString()}</div>
          <div className="mt-2 text-xs font-mono tracking-[0.18em] text-ink/50">SESSIONS (7D)</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-semibold text-forest">{openResidents}</div>
          <div className="mt-2 text-xs font-mono tracking-[0.18em] text-ink/50">NEW RESIDENT REQUESTS</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-semibold text-forest">{openPartners}</div>
          <div className="mt-2 text-xs font-mono tracking-[0.18em] text-ink/50">NEW PARTNER LEADS</div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-forest">Quick actions</div>
            <Link href="/navigator/techminutes">
              <Button className="h-9 px-3">Log TechMinutes</Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-ink/70">
            <a className="font-semibold text-sage underline-offset-4 hover:underline" href="/api/reports/monthly?format=csv">
              Download CSV (current month)
            </a>
            <a className="font-semibold text-sage underline-offset-4 hover:underline" href="/api/reports/monthly?format=pdf">
              Download PDF (current month)
            </a>
            <Link className="font-semibold text-sage underline-offset-4 hover:underline" href="/impact">
              Public Impact Page
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-semibold text-forest">Recent logs</div>
          <div className="mt-4 grid gap-3">
            {recent.length ? (
              recent.map((r) => (
                <div key={r.id} className="rounded-lg border border-ink/10 bg-white p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-forest">{r.category}</div>
                    <div className="font-mono text-xs text-ink/60">{r.minutes}m</div>
                  </div>
                  <div className="mt-1 text-xs text-ink/60">
                    {r.hubLocation.name} · {r.outcome} · {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-ink/60">No logs yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
