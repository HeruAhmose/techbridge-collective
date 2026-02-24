"use client";

import { useEffect, useMemo, useState } from "react";

type Org = { id: string; name: string };

type Invite = {
  id: string;
  email: string;
  orgId: string;
  orgName: string;
  createdAt: string;
  consumedAt: string | null;
  emailStatus: "NOT_SENT" | "SENT" | "DELIVERED" | "FAILED";
  emailProvider: string | null;
  emailMessageId: string | null;
  emailAttempts: number;
  emailLastAttemptAt: string | null;
  emailDeliveredAt: string | null;
  emailLastError: string | null;
};

function fmt(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 19).replace("T", " ");
}

const btnCls =
  "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-linen disabled:opacity-50";

export default function InviteTrackingTable({ orgs }: { orgs: Org[] }) {
  const [orgId, setOrgId] = useState<string>("all");
  const [items, setItems] = useState<Invite[]>([]);
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const query = useMemo(() => (orgId === "all" ? "" : `?partnerOrgId=${encodeURIComponent(orgId)}`), [orgId]);

  async function refresh() {
    setPending(true);
    setMsg(null);
    const res = await fetch(`/api/admin/partners/invites${query}`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setMsg(data?.error || "Failed to load invites.");
      return;
    }
    setItems(Array.isArray(data.invites) ? data.invites : []);
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function retry(inviteId: string) {
    setPending(true);
    setMsg(null);
    const res = await fetch("/api/admin/partners/invites/retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setMsg(data?.error || "Retry failed.");
      return;
    }
    setMsg("Retry triggered.");
    await refresh();
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-forest">Invite delivery tracking</p>
          <p className="text-xs text-ink/55">Statuses update via webhooks (Resend) or Postmark delivery/bounce webhooks.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
          >
            <option value="all">All orgs</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <button className={btnCls} onClick={() => void refresh()} disabled={pending}>
            {pending ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {msg ? (
        <div className="rounded-md border border-ink/10 bg-linen p-3 text-sm text-ink/70">{msg}</div>
      ) : null}

      <div className="overflow-auto rounded-md border border-ink/10 bg-white">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-linen text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Org</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Attempts</th>
              <th className="px-3 py-2">Last attempt</th>
              <th className="px-3 py-2">Delivered</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Message ID</th>
              <th className="px-3 py-2">Error</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-ink/10">
                <td className="px-3 py-2">{i.email}</td>
                <td className="px-3 py-2">{i.orgName}</td>
                <td className="px-3 py-2 font-semibold">{i.emailStatus}</td>
                <td className="px-3 py-2">{i.emailAttempts}</td>
                <td className="px-3 py-2">{fmt(i.emailLastAttemptAt)}</td>
                <td className="px-3 py-2">{fmt(i.emailDeliveredAt)}</td>
                <td className="px-3 py-2">{i.emailProvider || "—"}</td>
                <td className="px-3 py-2 font-mono text-xs">{i.emailMessageId || "—"}</td>
                <td className="px-3 py-2 max-w-[240px] truncate" title={i.emailLastError || ""}>
                  {i.emailLastError || "—"}
                </td>
                <td className="px-3 py-2">
                  <button
                    className={btnCls}
                    disabled={pending || i.emailStatus === "DELIVERED"}
                    onClick={() => void retry(i.id)}
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-sm text-ink/60" colSpan={10}>
                  No invites.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
