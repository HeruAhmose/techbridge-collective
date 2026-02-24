"use client";

import { useCallback, useEffect, useState } from "react";

type CronRunStatus = "STARTED" | "SUCCESS" | "FAILED" | "SKIPPED";

type CronRun = {
  id: string;
  jobName: string;
  status: CronRunStatus;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  locked: boolean;
  attempted: number;
  processed: number;
  skipped: number;
  errorsCount: number;
  lastError: string | null;
};

function fmt(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 19).replace("T", " ") + " UTC";
}

function statusBadge(status: CronRunStatus) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold";
  if (status === "SUCCESS") return `${base} bg-green-100 text-green-800`;
  if (status === "FAILED")  return `${base} bg-red-100 text-red-800`;
  if (status === "SKIPPED") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-slate-100 text-slate-700`;
}

export default function CronHealthWidget({ job = "invite-retry" }: { job?: string }) {
  const [latest, setLatest] = useState<CronRun | null>(null);
  const [runs,   setRuns]   = useState<CronRun[]>([]);
  const [pending, setPending] = useState(false);
  const [msg, setMsg]         = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setPending(true);
    setMsg(null);
    try {
      const res  = await fetch(`/api/admin/cron/health?job=${encodeURIComponent(job)}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.error || "Failed to load cron health.");
        return;
      }
      setLatest(data.latest ?? null);
      setRuns(Array.isArray(data.runs) ? data.runs : []);
    } catch {
      setMsg("Network error — check connection.");
    } finally {
      setPending(false);
    }
  }, [job]);

  useEffect(() => { void refresh(); }, [refresh]);

  const stat = (label: string, value: number | string) => (
    <div className="rounded-md border border-ink/10 bg-cream p-3">
      <div className="text-xs text-ink/55">{label}</div>
      <div className="text-lg font-semibold text-forest">{value}</div>
    </div>
  );

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink/50">Last 25 runs stored in DB</p>
        <button
          className="rounded-md border border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink hover:bg-linen disabled:opacity-50"
          onClick={() => void refresh()}
          disabled={pending}
        >
          {pending ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {msg && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {msg}
        </div>
      )}

      {/* Latest run summary */}
      <div className="rounded-md border border-ink/10 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={statusBadge(latest?.status ?? "STARTED")}>{latest?.status ?? "—"}</span>
          <span className="text-ink/60">Started: <strong>{fmt(latest?.startedAt ?? null)}</strong></span>
          <span className="text-ink/60">Finished: <strong>{fmt(latest?.finishedAt ?? null)}</strong></span>
          <span className="text-ink/60">Duration: <strong>{latest?.durationMs != null ? `${latest.durationMs}ms` : "—"}</strong></span>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4">
          {stat("Attempted",  latest?.attempted  ?? 0)}
          {stat("Processed",  latest?.processed  ?? 0)}
          {stat("Skipped",    latest?.skipped    ?? 0)}
          {stat("Errors",     latest?.errorsCount ?? 0)}
        </div>

        {latest?.lastError && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
            <div className="text-xs font-semibold text-red-700">Last error</div>
            <pre className="mt-1 whitespace-pre-wrap text-xs text-red-900">{latest.lastError}</pre>
          </div>
        )}
      </div>

      {/* History table */}
      <div className="overflow-auto rounded-md border border-ink/10 bg-white">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="bg-linen text-xs uppercase tracking-wide text-ink/55">
            <tr>
              {["Started (UTC)", "Status", "Duration", "Attempted", "Processed", "Skipped", "Errors"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id} className="border-t border-ink/8 hover:bg-cream/50">
                <td className="px-3 py-2 font-mono text-xs">{fmt(r.startedAt)}</td>
                <td className="px-3 py-2"><span className={statusBadge(r.status)}>{r.status}</span></td>
                <td className="px-3 py-2 font-mono text-xs">{r.durationMs != null ? `${r.durationMs}ms` : "—"}</td>
                <td className="px-3 py-2">{r.attempted}</td>
                <td className="px-3 py-2">{r.processed}</td>
                <td className="px-3 py-2">{r.skipped}</td>
                <td className="px-3 py-2">{r.errorsCount}</td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-sm text-ink/50">
                  No runs yet. Cron will fire on Vercel's schedule.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
