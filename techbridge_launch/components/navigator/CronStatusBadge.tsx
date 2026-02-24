"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CronRunStatus = "STARTED" | "SUCCESS" | "FAILED" | "SKIPPED";
type CronRun = { status: CronRunStatus; startedAt: string; finishedAt: string | null };
type BadgeState = { level: "green" | "yellow" | "red"; label: string; detail: string };

function ageMinutes(ts: string) {
  return Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 60_000));
}

function computeBadge(latest: CronRun | null, greenMinutes: number, yellowMinutes: number): BadgeState {
  if (!latest) return { level: "red", label: "Cron: unknown", detail: "No runs recorded yet." };

  const ref = latest.finishedAt || latest.startedAt;
  const age = ageMinutes(ref);

  if (latest.status === "FAILED")        return { level: "red",    label: "Cron: failed",  detail: `Last run failed (${age}m ago).` };
  if (age > yellowMinutes)               return { level: "red",    label: "Cron: stale",   detail: `Last run is stale (${age}m ago — expected every ${yellowMinutes}m).` };
  if (latest.status === "STARTED")       return { level: "yellow", label: "Cron: running", detail: `Run in progress, started ${age}m ago.` };
  if (latest.status === "SKIPPED")       return { level: "yellow", label: "Cron: skipped", detail: `Lock contention — skipped ${age}m ago.` };
  if (age <= greenMinutes)               return { level: "green",  label: "Cron: healthy", detail: `Last success ${age}m ago.` };
  return { level: "yellow", label: "Cron: ok", detail: `Last run ${latest.status} — ${age}m ago.` };
}

export default function CronStatusBadge({
  job = "invite-retry",
  greenMinutes = 30,
  yellowMinutes = 120,
  pollMs = 60_000,      // re-check every minute by default
}: {
  job?: string;
  greenMinutes?: number;
  yellowMinutes?: number;
  pollMs?: number;
}) {
  const [latest, setLatest] = useState<CronRun | null>(null);
  const alive = useRef(true);

  const fetchLatest = useCallback(async () => {
    try {
      const res  = await fetch(`/api/admin/cron/health?job=${encodeURIComponent(job)}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!alive.current) return;
      const r = data?.latest;
      setLatest(r ? { status: r.status, startedAt: r.startedAt, finishedAt: r.finishedAt } : null);
    } catch {}
  }, [job]);

  useEffect(() => {
    alive.current = true;
    void fetchLatest();
    const id = setInterval(() => void fetchLatest(), pollMs);
    return () => { alive.current = false; clearInterval(id); };
  }, [fetchLatest, pollMs]);

  const badge = useMemo(() => computeBadge(latest, greenMinutes, yellowMinutes), [latest, greenMinutes, yellowMinutes]);

  const cls =
    badge.level === "green"  ? "bg-green-100 text-green-800 border-green-200" :
    badge.level === "yellow" ? "bg-amber-100 text-amber-800 border-amber-200" :
                               "bg-red-100   text-red-800   border-red-200";

  return (
    <span
      title={badge.detail}
      aria-label={badge.detail}
      className={`inline-flex cursor-default select-none items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-60" aria-hidden />
      {badge.label}
    </span>
  );
}
