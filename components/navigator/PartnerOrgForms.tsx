"use client";

import { useMemo, useState } from "react";
import InviteTrackingTable from "@/components/navigator/InviteTrackingTable";

type Org = { id: string; name: string };
type Hub = { id: string; name: string; partnerOrgId: string | null };
type Msg = { ok: boolean; text: string };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

const selectCls = "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const inputCls  = selectCls;
const btnCls    = "rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-amber disabled:opacity-60";

export default function PartnerOrgForms({ orgs, hubs }: { orgs: Org[]; hubs: Hub[] }) {
  const [msg, setMsg]         = useState<Msg | null>(null);
  const [pending, setPending] = useState(false);

  const orgOpts = useMemo(() => orgs.map((o) => ({ value: o.id, label: o.name })), [orgs]);
  const hubOpts = useMemo(
    () => hubs.map((h) => ({ value: h.id, label: h.partnerOrgId ? `${h.name} (assigned)` : h.name })),
    [hubs],
  );

  async function post(url: string, payload: unknown) {
    const res  = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  function OrgSelect({ name }: { name: string }) {
    return (
      <select className={selectCls} name={name} required defaultValue="">
        <option value="" disabled>Select org…</option>
        {orgOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }

  return (
    <div className="grid gap-8">
      {/* Create org */}
      <form className="grid gap-3" onSubmit={async (e) => {
        e.preventDefault();
        setPending(true); setMsg(null);
        const fd   = new FormData(e.currentTarget);
        const name = String(fd.get("name") || "").trim();
        const r    = await post("/api/admin/partners/orgs", { name });
        setPending(false);
        setMsg(r.ok ? { ok: true, text: "Organization created." } : { ok: false, text: r.data?.error || "Failed." });
        if (r.ok) (e.target as HTMLFormElement).reset();
      }}>
        <p className="text-sm font-semibold text-forest">Create organization</p>
        <Field label="Org name">
          <input className={inputCls} name="name" required />
        </Field>
        <button className={btnCls} disabled={pending}>{pending ? "Creating…" : "Create org"}</button>
      </form>

      {/* Assign hub */}
      <form className="grid gap-3" onSubmit={async (e) => {
        e.preventDefault();
        setPending(true); setMsg(null);
        const fd           = new FormData(e.currentTarget);
        const partnerOrgId  = String(fd.get("partnerOrgId") || "");
        const hubLocationId = String(fd.get("hubLocationId") || "");
        const r = await post("/api/admin/partners/hubs", { partnerOrgId, hubLocationId });
        setPending(false);
        setMsg(r.ok ? { ok: true, text: "Hub assignment updated." } : { ok: false, text: r.data?.error || "Failed." });
      }}>
        <p className="text-sm font-semibold text-forest">Assign hub to org</p>
        <Field label="Organization"><OrgSelect name="partnerOrgId" /></Field>
        <Field label="Hub location">
          <select className={selectCls} name="hubLocationId" required defaultValue="">
            <option value="" disabled>Select hub…</option>
            {hubOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <button className={btnCls} disabled={pending}>{pending ? "Saving…" : "Assign hub"}</button>
      </form>

      {/* Invite partner user */}
      <form className="grid gap-3" onSubmit={async (e) => {
        e.preventDefault();
        setPending(true); setMsg(null);
        const fd          = new FormData(e.currentTarget);
        const partnerOrgId = String(fd.get("partnerOrgId") || "");
        const email        = String(fd.get("email") || "").trim();
        const r = await post("/api/admin/partners/invites", { partnerOrgId, email });
        setPending(false);
        setMsg(r.ok
          ? { ok: true, text: `${r.data?.appliedNow ? "Partner user added immediately." : "Invite queued — they'll be added on first login."} ${r.data?.email?.ok ? ("Email status: " + (r.data?.email?.status || "UNKNOWN") + ".") : ("Email error: " + (r.data?.email?.error || "unknown") + ".")}` }
          : { ok: false, text: r.data?.error || "Failed." },
        );
        if (r.ok) (e.target as HTMLFormElement).reset();
      }}>
        <p className="text-sm font-semibold text-forest">Invite partner user</p>
        <p className="text-xs text-ink/55">
          If they haven't signed in yet, the invite is queued and applied automatically on first login.
        </p>
        <Field label="Organization"><OrgSelect name="partnerOrgId" /></Field>
        <Field label="User email">
          <input className={inputCls} name="email" type="email" required autoComplete="off" />
        </Field>
        <button className={btnCls} disabled={pending}>{pending ? "Saving…" : "Invite partner user"}</button>
      </form>

      <InviteTrackingTable orgs={orgs} />

      {msg && (
        <div role="alert" className={`rounded-md border p-3 text-sm ${msg.ok ? "border-teal/25 bg-teal/5 text-forest" : "border-red-200 bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}
