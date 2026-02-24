"use client";

import { useState } from "react";

type Msg = { ok: boolean; text: string };

export default function AdminPromoteForm() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg]         = useState<Msg | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMsg(null);

    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res  = await fetch("/api/admin/promote", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      setMsg(res.ok
        ? { ok: true, text: "Role updated." }
        : { ok: false, text: data?.error || "Failed." },
      );
      if (res.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setMsg({ ok: false, text: "Network error." });
    } finally {
      setPending(false);
    }
  }

  const inputCls = "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
      <label className="grid gap-1.5 text-sm font-medium">
        User email
        <input className={inputCls} name="email" type="email" required autoComplete="off" />
      </label>

      <label className="grid gap-1.5 text-sm font-medium">
        Role
        <select className={inputCls} name="role" defaultValue="NAVIGATOR">
          <option value="PUBLIC">PUBLIC</option>
          <option value="PARTNER">PARTNER</option>
          <option value="NAVIGATOR">NAVIGATOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </label>

      <button
        className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-amber disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Updating…" : "Promote"}
      </button>

      {msg && (
        <p role="alert" className={`text-sm ${msg.ok ? "text-forest" : "text-red-600"}`}>
          {msg.text}
        </p>
      )}

      <p className="text-xs text-ink/50">
        Tip: Auto-assign roles via <code className="font-mono bg-linen px-1 rounded">ADMIN_EMAILS</code> and{" "}
        <code className="font-mono bg-linen px-1 rounded">NAVIGATOR_EMAILS</code> env vars.
      </p>
    </form>
  );
}
