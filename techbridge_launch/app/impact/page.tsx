import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui";
import dynamic from "next/dynamic";

const ImpactDashboardClient = dynamic(() => import("@/components/impact/ImpactDashboardClient"), { ssr: false });

export const metadata: Metadata = {
  title: "TechMinutes® Impact",
  description: "Real-time TechMinutes® data from TechBridge Collective hubs in Durham and Raleigh. Non-PII aggregate metrics for partners and funders.",
};

export const revalidate = 300; // ISR: refresh every 5 minutes

export default async function ImpactPage() {
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [agg30, agg90, cats, outcomes, byHub] = await Promise.all([
    prisma.techMinute.aggregate({ _sum: { minutes: true }, _count: { _all: true }, where: { createdAt: { gte: since30 } } }),
    prisma.techMinute.aggregate({ _sum: { minutes: true }, _count: { _all: true }, where: { createdAt: { gte: since90 } } }),
    prisma.techMinute.groupBy({
      by: ["category"],
      _sum: { minutes: true }, _count: { _all: true },
      where: { createdAt: { gte: since30 } },
      orderBy: [{ _sum: { minutes: "desc" } }],
      take: 8,
    }),
    prisma.techMinute.groupBy({
      by: ["outcome"],
      _count: { _all: true },
      where: { createdAt: { gte: since30 } },
    }),
    prisma.techMinute.groupBy({
      by: ["hubLocationId"],
      _sum: { minutes: true }, _count: { _all: true },
      where: { createdAt: { gte: since30 } },
      orderBy: [{ _sum: { minutes: "desc" } }],
    }),
  ]);

  const hubs = await prisma.hubLocation.findMany({ select: { id: true, name: true } });
  const hubMap = Object.fromEntries(hubs.map((h) => [h.id, h.name]));

  const total30 = agg30._count._all;
  const resolved = outcomes.find((o) => o.outcome === "RESOLVED")?._count._all ?? 0;
  const resolveRate = total30 > 0 ? Math.round((resolved / total30) * 100) : 0;

  const stats = [
    { label: "TechMinutes (30d)",  value: (agg30._sum.minutes ?? 0).toLocaleString() },
    { label: "Sessions (30d)",     value: total30.toLocaleString() },
    { label: "Resolution rate",    value: `${resolveRate}%` },
    { label: "TechMinutes (90d)",  value: (agg90._sum.minutes ?? 0).toLocaleString() },
  ];

  return (
    <div>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-cream/60">PROOF PARTNERS CAN USE</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">TechMinutes® Impact</h1>
          <p className="mt-3 text-base text-cream/70 max-w-xl">
            Non-PII only. Aggregated at neighborhood level. Partners receive this as a monthly one-page
            PDF + CSV they can use in grant reports.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="border-gold/20 bg-white/5 p-6 text-center">
                <div className="text-4xl font-semibold text-gold">{s.value || "—"}</div>
                <div className="mt-2 font-mono text-xs tracking-[0.16em] text-cream/60 uppercase">{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
<section className="mx-auto max-w-6xl px-4 py-10">
  <div className="mb-3 flex items-center justify-between">
    <p className="text-sm font-semibold text-forest">Interactive dashboard</p>
    <Link href="/impact/dashboard" className="text-sm font-semibold text-sage underline-offset-4 hover:underline">
      Fullscreen →
    </Link>
  </div>
  <ImpactDashboardClient />
</section>

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-6 md:grid-cols-2">
          {/* Category bars */}
          <Card className="p-6">
            <p className="text-sm font-semibold text-forest mb-5">Top categories (last 30 days)</p>
            {cats.length ? (
              cats.map((c) => {
                const max = cats[0]._sum.minutes ?? 1;
                const pct = Math.round(((c._sum.minutes ?? 0) / max) * 100);
                return (
                  <div key={c.category} className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-ink/80">{c.category}</span>
                      <span className="font-mono text-xs text-ink/50">{(c._sum.minutes ?? 0).toLocaleString()}m · {c._count._all} sessions</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-forest to-teal transition-all duration-700"
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-ink/50">No data yet. Start logging TechMinutes® to see impact here.</p>
            )}
          </Card>

          <div className="grid gap-4">
            {/* Outcomes */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-forest mb-4">Outcomes (last 30 days)</p>
              <div className="grid grid-cols-3 gap-3">
                {["RESOLVED", "NEEDS_HELP", "FOLLOW_UP"].map((o) => {
                  const v = outcomes.find((x) => x.outcome === o)?._count._all ?? 0;
                  return (
                    <div key={o} className="rounded-lg border border-ink/10 p-3 text-center">
                      <div className="text-2xl font-semibold text-forest">{v}</div>
                      <div className="mt-1 font-mono text-[10px] tracking-[0.15em] text-ink/50 uppercase">{o.replace("_", " ")}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* By hub */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-forest mb-4">By hub (last 30 days)</p>
              {byHub.length ? (
                byHub.map((h) => (
                  <div key={h.hubLocationId} className="flex justify-between py-2 border-b border-ink/5 last:border-0 text-sm">
                    <span className="text-ink/70">{hubMap[h.hubLocationId] ?? "Unknown"}</span>
                    <span className="font-mono text-xs text-gold">{(h._sum.minutes ?? 0).toLocaleString()}m · {h._count._all} sessions</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/50">No data yet.</p>
              )}
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-linen">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-sm text-ink/60">
            Data is non-PII aggregate only. No names, no contact info stored in metrics.
            Refreshed every 5 minutes.
          </p>
          <div className="mt-4">
            <Link href="/partner" className="text-sm font-semibold text-sage underline-offset-4 hover:underline">
              Partner login for full reports & CSV downloads →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
