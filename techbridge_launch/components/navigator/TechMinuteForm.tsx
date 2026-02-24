"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

export default function TechMinuteForm({
  hubOptions,
}: {
  hubOptions: Array<{ id: string; name: string }>;
}) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg]         = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMsg(null);

    const fd      = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res  = await fetch("/api/techminutes", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg({ ok: false, text: data?.error || "Could not save — try again." });
      } else {
        (e.target as HTMLFormElement).reset();
        setMsg({ ok: true, text: "✓ Saved." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error." });
    } finally {
      setPending(false);
    }
  }

  const inputCls = "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-forest">Log TechMinutes®</h3>
      <p className="mt-1 text-sm text-ink/60">Non-PII only. No client names — just category, minutes, outcome.</p>

      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1.5 text-sm font-medium">
          Hub location <span className="text-red-500">*</span>
          <select className={inputCls} name="hubLocationId" required defaultValue="">
            <option value="" disabled>Select…</option>
            {hubOptions.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1.5 text-sm font-medium">
            Minutes <span className="text-red-500">*</span>
            <input className={inputCls} name="minutes" type="number" min="1" max="480" required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium md:col-span-2">
            Category <span className="text-red-500">*</span>
            <input className={inputCls} name="category" placeholder="e.g., Job applications" required />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-medium">
          Outcome <span className="text-red-500">*</span>
          <select className={inputCls} name="outcome" defaultValue="RESOLVED" required>
            <option value="RESOLVED">Resolved</option>
            <option value="NEEDS_HELP">Needs human help</option>
            <option value="FOLLOW_UP">Follow-up needed</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Resolution notes (optional)
          <textarea className={`${inputCls} min-h-20`} name="resolution" />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="isEscalated" type="checkbox" className="h-4 w-4 accent-forest" />
          Escalated to in-person appointment / hub visit
        </label>

        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : "Save log"}
        </Button>

        {msg && (
          <p role="alert" className={`text-sm ${msg.ok ? "text-forest font-semibold" : "text-red-600"}`}>
            {msg.text}
          </p>
        )}
      </form>
    </Card>
  );
}
