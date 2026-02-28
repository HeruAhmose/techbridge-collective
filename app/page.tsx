export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { fmtSchedule } from "@/lib/time";
import { HKHero, HKChat } from "@/components/HKWidget";
import { Card, Button } from "@/components/ui";

export const revalidate = 300; // ISR: refresh every 5 min for live stats

export default async function HomePage() {
  const [hubs, minutesAgg, topCategories, outcomes] = await Promise.all([
    prisma.hubLocation.findMany({
      include: {
        schedules: { where: { isActive: true }, orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
      },
      orderBy: { name: "asc" },
    }),
    prisma.techMinute.aggregate({
      _sum:   { minutes: true },
      _count: { _all: true },
      where:  { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.techMinute.groupBy({
      by:      ["category"],
      _sum:    { minutes: true },
      _count:  { _all: true },
      where:   { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      orderBy: [{ _sum: { minutes: "desc" } }],
      take:    5,
    }),
    prisma.techMinute.groupBy({
      by:      ["outcome"],
      _count:  { _all: true },
      where:   { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const totalMinutes = minutesAgg._sum.minutes ?? 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-cream overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="font-mono text-xs tracking-[0.22em] text-gold/80 uppercase">
            Neighborhood Tech Help · Durham & Raleigh, NC
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.15] md:text-6xl">
            Tech help, right in your{" "}
            <span className="text-gold">neighborhood.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-cream/70 md:text-lg leading-relaxed">
            Free 1:1 support at libraries and community centers — staffed by paid Digital Navigators, backed
            by H.K. AI 24/7. Plus TechMinutes® reporting so partners can prove impact.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/get-help">
              <Button className="w-full sm:w-auto">Find Help Near Me</Button>
            </Link>
            <Link href="/host-a-hub">
              <Button variant="outline" className="w-full border-gold/40 bg-transparent text-cream hover:bg-white/5 sm:w-auto">
                Host a Hub
              </Button>
            </Link>
          </div>

          {/* H.K. Hero Entry — compact button that expands into full chat */}
          <div className="mt-8 max-w-sm">
            <HKHero />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "1:1 Support",       desc: "Devices, portals, accounts, job apps." },
              { label: "Trusted Spaces",    desc: "Libraries, community centers, housing." },
              { label: "TechMinutes®",      desc: "Monthly reporting + story-ready metrics." },
            ].map((f) => (
              <Card key={f.label} className="border-gold/15 bg-white/5 p-5">
                <div className="text-sm font-semibold text-gold">{f.label}</div>
                <div className="mt-1 text-sm text-cream/70">{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hub schedule */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.22em] text-sage">WHERE WE OPERATE</p>
              <h2 className="mt-2 text-3xl font-semibold text-forest">Upcoming hub schedule</h2>
            </div>
            <Link href="/get-help">
              <Button variant="outline">See all locations</Button>
            </Link>
          </div>

          {hubs.length === 0 ? (
            <Card className="mt-8 p-6 text-ink/60 text-sm">
              Hub schedule launching May 2026. <Link href="/get-help#intake" className="font-semibold text-sage hover:underline underline-offset-4">Submit a help request</Link> to be notified.
            </Card>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {hubs.map((h) => (
                <Card key={h.id} className="p-6">
                  <div className="text-lg font-semibold text-forest">{h.name}</div>
                  <div className="mt-1 text-sm text-ink/60">{h.address}, {h.city}, {h.state} {h.zip}</div>

                  <div className="mt-4 grid gap-1.5">
                    {h.schedules.length ? (
                      h.schedules.map((s) => (
                        <div key={s.id} className="font-mono text-xs text-ink/70">
                          {fmtSchedule(s.dayOfWeek, s.startTime, s.endTime)}{" "}
                          <span className="text-ink/40">·</span> {s.cadence}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-ink/50">Schedule coming soon.</div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                    <a
                      className="text-sage underline-offset-4 hover:underline"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.address}, ${h.city}, ${h.state} ${h.zip}`)}`}
                      target="_blank" rel="noreferrer"
                    >
                      Open in Maps
                    </a>
                    <span className="text-ink/30">·</span>
                    <Link className="text-sage underline-offset-4 hover:underline" href="/get-help#intake">
                      Request help
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* H.K. AI — Full interactive chat replaces old Quick Starts */}
      <section id="hk" className="bg-linen">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="font-mono text-xs tracking-[0.22em] text-sage">H.K. AI</p>
          <div className="mt-2 grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-3xl font-semibold text-forest">
                Ask H.K. — get help now, or book a Navigator
              </h2>
              <p className="mt-4 text-sm text-ink/70 leading-relaxed">
                H.K. asks a few clarifying questions, gives step-by-step guidance, and escalates to hub
                hours when needed. Named for Horace King, the 19th-century bridge builder who connected
                communities across the South.
              </p>
              <p className="mt-2 text-xs text-ink/50 font-mono">
                H.K. never asks for passwords, SSNs, or sensitive data.
              </p>
              <div className="mt-6">
                <Link href="/get-help#intake">
                  <Button variant="outline">Request a Navigator visit</Button>
                </Link>
              </div>
            </div>

            {/* Interactive H.K. Chat */}
            <HKChat height={520} />
          </div>
        </div>
      </section>

      {/* Impact snapshot */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-center">
            <p className="font-mono text-xs tracking-[0.22em] text-cream/60">IMPACT SNAPSHOT (LAST 30 DAYS)</p>
            <h2 className="mt-2 text-3xl font-semibold">Proof partners can use</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <Card className="border-gold/20 bg-white/5 p-6 text-center">
              <div className="text-4xl font-semibold text-gold">{totalMinutes.toLocaleString()}</div>
              <div className="mt-2 font-mono text-xs tracking-[0.18em] text-cream/60">TOTAL TECHMINUTES</div>
            </Card>

            <Card className="border-gold/20 bg-white/5 p-6">
              <div className="text-sm font-semibold text-gold mb-3">Top categories</div>
              <div className="grid gap-1.5 text-xs text-cream/75">
                {topCategories.length ? (
                  topCategories.map((c) => (
                    <div key={c.category} className="flex items-center justify-between gap-3">
                      <span className="truncate">{c.category}</span>
                      <span className="font-mono text-cream/50">{(c._sum.minutes ?? 0).toLocaleString()}m</span>
                    </div>
                  ))
                ) : (
                  <div className="text-cream/50">No logs yet.</div>
                )}
              </div>
            </Card>

            <Card className="border-gold/20 bg-white/5 p-6 md:col-span-2">
              <div className="text-sm font-semibold text-gold mb-3">Outcomes</div>
              <div className="grid grid-cols-3 gap-3">
                {["RESOLVED", "NEEDS_HELP", "FOLLOW_UP"].map((o) => {
                  const v = outcomes.find((x) => x.outcome === o)?._count._all ?? 0;
                  return (
                    <div key={o} className="rounded-lg border border-white/10 bg-black/10 p-3 text-center">
                      <div className="text-2xl font-semibold text-cream">{v}</div>
                      <div className="mt-1 font-mono text-[10px] tracking-[0.15em] text-cream/50 uppercase">{o.replace("_", " ")}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/impact">
              <Button className="bg-gold text-ink hover:bg-amber">See full impact</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
