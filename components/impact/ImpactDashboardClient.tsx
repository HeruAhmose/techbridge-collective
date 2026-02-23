"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

type Outcome = "RESOLVED" | "NEEDS_HELP" | "FOLLOW_UP";

type ImpactSummary = {
  days: number;
  minutes: number;
  sessions: number;
  resolved: number;
  needsHelp: number;
  followUp: number;
  categories: Array<{ name: string; minutes: number; sessions: number }>;
  hubs: Array<{ name: string; minutes: number; sessions: number }>;
  weekly: Array<{ week: string; minutes: number; sessions: number }>;
  recent: Array<{ id: string; hub: string; cat: string; min: number; outcome: Outcome; at: string }>;
};

const C = {
  ink: "#0c1a14",
  forest: "#133a25",
  moss: "#1e5435",
  sage: "#2d7a4a",
  gold: "#d4a843",
  amber: "#f0c060",
  cream: "#f7f3ec",
  linen: "#ede8df",
  teal: "#5bbfa0",
  mist: "#8a9e92",
};

function clampDays(d: number) {
  if (d <= 0) return 30;
  return Math.min(Math.max(Math.trunc(d), 7), 365);
}

function fmtWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pct(n: number, d: number) {
  if (d <= 0) return 0;
  return Math.round((n / d) * 100);
}

export default function ImpactDashboardClient() {
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<ImpactSummary | null>(null);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async (d: number) => {
    const dd = clampDays(d);
    setPending(true);
    setErr(null);

    try {
      const res = await fetch(`/api/impact/summary?days=${dd}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ImpactSummary;
      setData(json);
    } catch (e: any) {
      setErr(e?.message ? String(e.message) : "Failed to load");
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    void load(days);
  }, [days, load]);

  const outcomeData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Resolved", value: data.resolved, color: C.sage },
      { name: "Needs help", value: data.needsHelp, color: C.amber },
      { name: "Follow-up", value: data.followUp, color: C.teal },
    ];
  }, [data]);

  const resolutionRate = useMemo(() => (data ? pct(data.resolved, data.sessions) : 0), [data]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-forest">Interactive dashboard</div>
          <div className="text-xs text-ink/60">Non‑PII aggregate data; refreshes automatically.</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={
                "rounded-md border px-3 py-2 text-sm font-semibold " +
                (days === d ? "border-forest bg-cream text-forest" : "border-ink/10 bg-white text-ink hover:bg-linen")
              }
              disabled={pending}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {err ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">Error: {err}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-ink/60">TechMinutes</div>
          <div className="mt-2 text-3xl font-semibold text-gold">{data?.minutes?.toLocaleString() ?? "—"}</div>
          <div className="mt-1 text-xs text-ink/50">{days} day window</div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-ink/60">Sessions</div>
          <div className="mt-2 text-3xl font-semibold text-gold">{data?.sessions?.toLocaleString() ?? "—"}</div>
          <div className="mt-1 text-xs text-ink/50">Logged visits</div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-ink/60">Resolution rate</div>
          <div className="mt-2 text-3xl font-semibold text-gold">{data ? `${resolutionRate}%` : "—"}</div>
          <div className="mt-1 text-xs text-ink/50">Resolved without escalation</div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-ink/60">Needs human help</div>
          <div className="mt-2 text-3xl font-semibold text-gold">{data?.needsHelp?.toLocaleString() ?? "—"}</div>
          <div className="mt-1 text-xs text-ink/50">Escalations</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-forest">Weekly trend</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.weekly ?? []} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#e7e1d7" strokeDasharray="4 4" />
                <XAxis dataKey="week" tick={{ fill: C.mist, fontSize: 12 }} />
                <YAxis tick={{ fill: C.mist, fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke={C.gold} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sessions" stroke={C.teal} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-forest">Outcomes</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomeData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {outcomeData.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid gap-1 text-xs text-ink/70">
            {outcomeData.map((o) => (
              <div key={o.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: o.color }} />
                  <span>{o.name}</span>
                </div>
                <span className="font-semibold">{o.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-forest">Top categories</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.categories ?? []} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: C.mist, fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: C.mist, fontSize: 12 }} width={110} />
                <Tooltip />
                <Bar dataKey="minutes" fill={C.gold} radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-forest">Hubs</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.hubs ?? []} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: C.mist, fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: C.mist, fontSize: 12 }} width={110} />
                <Tooltip />
                <Bar dataKey="minutes" fill={C.teal} radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-forest">Recent sessions (non‑PII)</div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-linen text-xs uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Hub</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Minutes</th>
                <th className="px-3 py-2">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent ?? []).map((r) => (
                <tr key={r.id} className="border-t border-ink/10">
                  <td className="px-3 py-2">{fmtWhen(r.at)}</td>
                  <td className="px-3 py-2">{r.hub}</td>
                  <td className="px-3 py-2">{r.cat}</td>
                  <td className="px-3 py-2 font-semibold">{r.min}</td>
                  <td className="px-3 py-2">{r.outcome}</td>
                </tr>
              ))}
              {!data?.recent?.length ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-ink/60" colSpan={5}>
                    No sessions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {pending ? <div className="text-xs text-ink/55">Loading…</div> : null}
    </div>
  );
}
