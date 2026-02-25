export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { fmtSchedule } from "@/lib/time";
import HKOpenButton from "@/components/HKOpenButton";
import HKQuickStarts from "@/components/HKQuickStarts";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Live Platform Demo · TechBridge Collective",
  description:
    "Interactive demonstration of TechBridge Collective — TechMinutes® reporting, Digital Navigator hubs, and H.K. AI. For funders and prospective partners.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

// ── Sample fallback data ──────────────────────────────────────────────────────
const SAMPLE_STATS = { totalMinutes: 2_847, sessions: 94, resolved: 71, needsHelp: 14, followUp: 9 };

const SAMPLE_CATEGORIES = [
  { category: "Job applications",  minutes: 684, sessions: 23 },
  { category: "Benefits portals",  minutes: 531, sessions: 18 },
  { category: "Email recovery",    minutes: 390, sessions: 13 },
  { category: "Device setup",      minutes: 354, sessions: 12 },
  { category: "School portals",    minutes: 312, sessions: 10 },
  { category: "Telehealth",        minutes: 288, sessions:  9 },
  { category: "Document uploads",  minutes: 174, sessions:  6 },
  { category: "Other",             minutes: 114, sessions:  3 },
];

const SAMPLE_HUB_BREAKDOWN = [
  { name: "Durham Library Hub",         minutes: 1_692, sessions: 56 },
  { name: "Raleigh Digital Impact Hub", minutes: 1_155, sessions: 38 },
];

const PARTNER_HIGHLIGHTS = [
  { icon: "📚", name: "Durham County Library",          role: "Pilot host — main branch" },
  { icon: "🏙️",  name: "City of Raleigh Digital Impact", role: "Pilot host — SE Raleigh" },
  { icon: "🎓", name: "NPower North Carolina",          role: "Navigator talent pipeline" },
  { icon: "⚖️",  name: "NCWorks Career Centers",         role: "Resident referral lane" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DemoPage() {
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [hubs, agg, cats, outcomes, byHub] = await Promise.all([
    prisma.hubLocation.findMany({
      include: { schedules: { where: { isActive: true }, orderBy: [{ dayOfWeek: "asc" }] } },
      orderBy: { name: "asc" },
    }),
    prisma.techMinute.aggregate({
      _sum: { minutes: true }, _count: { _all: true },
      where: { createdAt: { gte: since30 } },
    }),
    prisma.techMinute.groupBy({
      by: ["category"], _sum: { minutes: true }, _count: { _all: true },
      where: { createdAt: { gte: since30 } },
      orderBy: [{ _sum: { minutes: "desc" } }], take: 8,
    }),
    prisma.techMinute.groupBy({
      by: ["outcome"], _count: { _all: true },
      where: { createdAt: { gte: since30 } },
    }),
    prisma.techMinute.groupBy({
      by: ["hubLocationId"], _sum: { minutes: true }, _count: { _all: true },
      where: { createdAt: { gte: since30 } },
      orderBy: [{ _sum: { minutes: "desc" } }],
    }),
  ]);

  const hubMap = Object.fromEntries(hubs.map((h) => [h.id, h.name]));
  const hasLiveData = (agg._count._all ?? 0) > 0;

  const totalMinutes  = hasLiveData ? (agg._sum.minutes ?? 0)   : SAMPLE_STATS.totalMinutes;
  const totalSessions = hasLiveData ? (agg._count._all ?? 0)    : SAMPLE_STATS.sessions;
  const resolvedCount = hasLiveData
    ? (outcomes.find((o) => o.outcome === "RESOLVED")?._count._all ?? 0)
    : SAMPLE_STATS.resolved;
  const resolveRate = totalSessions > 0 ? Math.round((resolvedCount / totalSessions) * 100) : 76;

  const categoryRows = hasLiveData
    ? cats.map((c) => ({ category: c.category, minutes: c._sum.minutes ?? 0, sessions: c._count._all }))
    : SAMPLE_CATEGORIES;

  const hubRows = hasLiveData
    ? byHub.map((h) => ({ name: hubMap[h.hubLocationId] ?? h.hubLocationId, minutes: h._sum.minutes ?? 0, sessions: h._count._all }))
    : SAMPLE_HUB_BREAKDOWN;

  const maxCatMinutes = categoryRows[0]?.minutes ?? 1;

  return (
    <div className="relative">
      {/* ── Demo banner ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 flex items-center justify-between gap-3 border-b border-gold/30 bg-gold/10 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-gold" />
          <span className="text-xs font-semibold text-ink/80">
            Demo Mode — {hasLiveData ? "Live data from your DB" : "Sample data — seed the DB to see real numbers"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard"
            className="rounded-md bg-forest px-3 py-1.5 text-xs font-bold text-cream no-underline hover:bg-moss transition">
            Interactive Dashboard →
          </Link>
          <Link href="/host-a-hub#book"
            className="rounded-md bg-gold px-3 py-1.5 text-xs font-bold text-ink no-underline hover:bg-amber transition">
            Book a Pilot Call →
          </Link>
          <Link href="/"
            className="rounded-md border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink no-underline hover:bg-linen transition">
            ← Live Site
          </Link>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#d4a843 0,#d4a843 1px,transparent 0,transparent 50%)", backgroundSize: "24px 24px" }} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="font-mono text-xs tracking-[0.28em] text-gold/70 uppercase">Platform Demo · May 2026 Launch</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.1] md:text-7xl">
            TechBridge<br /><span className="text-gold">Collective.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/70 leading-relaxed">
            Neighborhood tech help desks at Durham County Library and City of Raleigh Digital Impact —
            with H.K. AI, paid Digital Navigators, and TechMinutes® reporting.
          </p>

          {/* Live KPI strip */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-gold/20 bg-gold/10 sm:grid-cols-4">
            {[
              { n: totalMinutes.toLocaleString(), label: "TechMinutes (30d)" },
              { n: totalSessions.toLocaleString(), label: "Sessions (30d)" },
              { n: `${resolveRate}%`, label: "Resolution rate" },
              { n: hubs.length || "2", label: "Active hubs" },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col items-center justify-center px-6 py-8">
                <div className="text-4xl font-semibold text-gold md:text-5xl">{n}</div>
                <div className="mt-2 font-mono text-[11px] tracking-[0.2em] text-cream/50 uppercase">{label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard"
              className="inline-flex items-center rounded-md bg-gold px-5 py-2.5 text-sm font-bold text-ink no-underline hover:bg-amber transition">
              Open Interactive Dashboard →
            </Link>
            <HKOpenButton className="bg-transparent border border-gold/40 text-cream hover:bg-white/5" />
            <Link href="#techminutes"
              className="inline-flex items-center rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-cream no-underline transition hover:bg-white/5">
              See TechMinutes® Data ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── Partner logos ─────────────────────────────────────────────────── */}
      <section className="border-b border-ink/8 bg-linen">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="mb-6 font-mono text-xs tracking-[0.22em] text-ink/40 uppercase">Pilot Partners & Pipeline</p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {PARTNER_HIGHLIGHTS.map((p) => (
              <div key={p.name} className="flex items-start gap-3 rounded-lg border border-ink/8 bg-white p-4">
                <span className="mt-0.5 text-xl">{p.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-ink">{p.name}</div>
                  <div className="mt-0.5 text-xs text-ink/55">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hub schedules ─────────────────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-sage">WHERE WE OPERATE</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest">Two pilot hubs, May 2026</h2>
          <p className="mt-2 max-w-xl text-sm text-ink/60">
            No referral. No appointment. Walk in with your device — or without one.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {hubs.length > 0 ? hubs.map((h) => (
              <Card key={h.id} className="p-6">
                <div className="text-base font-semibold text-forest">{h.name}</div>
                <div className="mt-0.5 text-sm text-ink/55">{h.address}, {h.city}, {h.state} {h.zip}</div>
                {h.notes && <div className="mt-2 text-xs text-ink/50">{h.notes}</div>}
                <div className="mt-4 grid gap-1.5">
                  {h.schedules.length ? h.schedules.map((s) => (
                    <div key={s.id} className="font-mono text-xs text-ink/65">
                      {fmtSchedule(s.dayOfWeek, s.startTime, s.endTime)}<span className="mx-1.5 text-ink/30">·</span>{s.cadence}
                    </div>
                  )) : <div className="text-xs text-ink/40">Schedule TBD</div>}
                </div>
                <a
                  className="mt-4 inline-block text-sm font-semibold text-sage underline-offset-4 hover:underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.address}, ${h.city}, ${h.state} ${h.zip}`)}`}
                  target="_blank" rel="noreferrer"
                >
                  Open in Maps →
                </a>
              </Card>
            )) : SAMPLE_HUB_BREAKDOWN.map((h) => (
              <Card key={h.name} className="p-6 opacity-80">
                <div className="flex items-center gap-2">
                  <div className="text-base font-semibold text-forest">{h.name}</div>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-mono text-gold">SAMPLE</span>
                </div>
                <div className="mt-3 text-xs text-ink/50">Seed the database to see real address and schedule.</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── TechMinutes® dashboard teaser ─────────────────────────────────── */}
      <section id="techminutes" className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.22em] text-cream/50">PROOF PARTNERS CAN USE</p>
              <h2 className="mt-2 text-3xl font-semibold">TechMinutes® Dashboard</h2>
              <p className="mt-2 max-w-md text-sm text-cream/60">
                Non-PII only. Partners receive this as a monthly PDF + CSV for grant reporting.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {!hasLiveData && (
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-mono text-gold">
                  Sample data — run: npm run db:seed
                </span>
              )}
              <Link href="/dashboard"
                className="rounded-md bg-gold px-4 py-2 text-sm font-bold text-ink no-underline hover:bg-amber transition">
                Open Full Interactive Dashboard →
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="grid gap-3 lg:col-span-1">
              {[
                { label: "Total TechMinutes", value: totalMinutes.toLocaleString(), sub: "Last 30 days" },
                { label: "Sessions logged",   value: totalSessions.toLocaleString(), sub: "Last 30 days" },
                { label: "Resolution rate",   value: `${resolveRate}%`, sub: "Sessions fully resolved" },
              ].map((s) => (
                <Card key={s.label} className="border-gold/15 bg-white/5 p-5">
                  <div className="text-xs font-mono tracking-[0.18em] text-cream/50 uppercase">{s.label}</div>
                  <div className="mt-1 text-3xl font-semibold text-gold">{s.value}</div>
                  <div className="mt-0.5 text-xs text-cream/40">{s.sub}</div>
                </Card>
              ))}

              <Card className="border-gold/15 bg-white/5 p-5">
                <div className="text-xs font-mono tracking-[0.18em] text-cream/50 uppercase mb-3">Outcomes</div>
                <div className="grid grid-cols-3 gap-2">
                  {["RESOLVED", "NEEDS_HELP", "FOLLOW_UP"].map((o) => {
                    const live   = outcomes.find((x) => x.outcome === o)?._count._all ?? 0;
                    const sample = o === "RESOLVED" ? SAMPLE_STATS.resolved : o === "NEEDS_HELP" ? SAMPLE_STATS.needsHelp : SAMPLE_STATS.followUp;
                    const v      = hasLiveData ? live : sample;
                    return (
                      <div key={o} className="rounded-lg border border-white/10 bg-black/10 p-3 text-center">
                        <div className="text-xl font-semibold text-cream">{v}</div>
                        <div className="mt-0.5 text-[9px] font-mono tracking-[0.12em] text-cream/40">{o.replace("_", " ")}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <Card className="border-gold/15 bg-white/5 p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold text-gold">Top categories</div>
                <div className="text-xs text-cream/40 font-mono">Minutes · Sessions</div>
              </div>
              <div className="grid gap-3">
                {categoryRows.map((c) => {
                  const pct = Math.round((c.minutes / maxCatMinutes) * 100);
                  return (
                    <div key={c.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-cream/80">{c.category}</span>
                        <span className="font-mono text-xs text-cream/50">{c.minutes.toLocaleString()}m · {c.sessions}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-amber transition-all duration-700"
                          style={{ width: `${pct}%` }}
                          role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="text-xs font-mono tracking-[0.18em] text-cream/50 uppercase mb-3">By hub</div>
                <div className="grid gap-2">
                  {hubRows.map((h) => (
                    <div key={h.name} className="flex items-center justify-between text-sm">
                      <span className="text-cream/70">{h.name}</span>
                      <span className="font-mono text-xs text-gold">{h.minutes.toLocaleString()}m · {h.sessions} sessions</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-gold/20 bg-white/5 p-5">
            <div className="flex-1">
              <div className="text-sm font-semibold text-cream">Partner gets monthly reports automatically</div>
              <div className="mt-0.5 text-xs text-cream/50">Available as PDF one-pager + CSV for import into grant spreadsheets.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/api/reports/monthly?format=pdf" className="rounded-md border border-gold/30 bg-white/5 px-3 py-2 text-xs font-semibold text-cream no-underline hover:bg-white/10 transition">
                Download PDF sample
              </a>
              <a href="/api/reports/monthly?format=csv" className="rounded-md border border-gold/30 bg-white/5 px-3 py-2 text-xs font-semibold text-cream no-underline hover:bg-white/10 transition">
                Download CSV sample
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── H.K. AI ───────────────────────────────────────────────────────── */}
      <section className="bg-linen">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-sage">H.K. AI · LIVE DEMO</p>
          <div className="mt-2 grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-3xl font-semibold text-forest">Ask H.K. — live, right now.</h2>
              <p className="mt-4 text-sm text-ink/70 leading-relaxed max-w-md">
                H.K. (named for Horace King, the 19th-century bridge builder) gives step-by-step guidance
                and escalates to hub hours when needed. This is the real widget, not a mockup.
              </p>
              <div className="mt-2 rounded-lg border border-teal/20 bg-teal/5 p-3 text-xs text-ink/60">
                <strong className="text-ink">Safety reminder:</strong> H.K. never asks for passwords, SSNs, bank info, or 2FA codes.
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <HKOpenButton />
                <Link href="/get-help#intake"
                  className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink no-underline hover:bg-linen transition">
                  Book a Navigator session
                </Link>
              </div>
            </div>
            <Card className="p-6">
              <div className="text-sm font-semibold text-forest">Try a quick start</div>
              <HKQuickStarts />
              <div className="mt-5 text-xs text-ink/50">
                Powered by Chatbase. The live widget opens in the bottom-right corner.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Funding pipeline ─────────────────────────────────────────────── */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-gold/70">GROWTH RUNWAY</p>
          <h2 className="mt-2 text-3xl font-semibold">Funding pipeline</h2>
          <p className="mt-3 max-w-xl text-sm text-cream/60">
            TechBridge is positioned for multiple federal, foundation, and corporate tracks aligned with the May 2026 two-hub pilot.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {([
              ["Bold Path Fellowship (current)", "$120K",       "Seed funding — two-hub pilot"],
              ["NTIA Digital Equity Grants",     "$500K–$3M+",  "Federal — post-pilot scale"],
              ["DOL WORC Initiative",            "$500K–$2.5M", "Workforce development alignment"],
              ["Google.org Tech for Good",       "$100K–$1.5M", "Corporate foundation"],
              ["Cisco Global Impact",            "$250K–$1M+",  "Tech sector equity"],
              ["Lenovo Foundation NC",           "$100K–$750K", "NC-based anchor funder"],
            ] as const).map(([name, amount, note]) => (
              <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/8 px-5 py-3.5 last:border-0 hover:bg-white/3 transition">
                <div>
                  <div className="text-sm font-semibold text-cream/85">{name}</div>
                  <div className="text-xs text-cream/40">{note}</div>
                </div>
                <div className="font-mono text-sm font-semibold text-gold">{amount}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-gold">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-semibold text-ink md:text-4xl">Ready to bring a hub to your community?</h2>
          <p className="mt-4 max-w-xl mx-auto text-sm text-ink/70">
            A 15-minute call is all it takes. We'll determine fit, walk through TechMinutes® reporting, and map out a launch timeline.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/host-a-hub#book" className="rounded-md bg-ink px-6 py-3 text-sm font-bold text-cream no-underline hover:bg-forest transition">
              Book a 15-min Pilot Call
            </Link>
            <Link href="/get-help" className="rounded-md border-2 border-ink/20 px-6 py-3 text-sm font-semibold text-ink no-underline hover:bg-ink/5 transition">
              I need help now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

