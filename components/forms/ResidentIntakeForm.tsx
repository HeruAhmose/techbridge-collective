"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

export default function ResidentIntakeForm({
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
      const res  = await fetch("/api/intake/resident", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg({ ok: false, text: data?.error || "Something went wrong. Please try again." });
      } else {
        (e.target as HTMLFormElement).reset();
        setMsg({ ok: true, text: "Submitted! A Digital Navigator will reach out within 2 business days." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error — please check your connection and try again." });
    } finally {
      setPending(false);
    }
  }

  const inputCls = "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-forest">Request help</h3>
      <p className="mt-1 text-sm text-ink/60">No passwords. No SSNs. Bring your device if you can.</p>

      <form className="mt-5 grid gap-4" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Name (optional)
            <input className={inputCls} name="name" autoComplete="name" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Email (optional)
            <input className={inputCls} name="email" type="email" autoComplete="email" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Phone (optional)
            <input className={inputCls} name="phone" type="tel" autoComplete="tel" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Language
            <select className={inputCls} name="language" defaultValue="EN">
              <option value="EN">English</option>
              <option value="ES">Español</option>
            </select>
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-medium">
          What do you need help with? <span className="text-red-500">*</span>
          <select className={inputCls} name="category" required defaultValue="">
            <option value="" disabled>Select a category…</option>
            <option value="Job applications">Job applications</option>
            <option value="Benefits portals">Benefits portals (Medicaid, SNAP, etc.)</option>
            <option value="School portals">School / education portals</option>
            <option value="Email recovery">Email & account recovery</option>
            <option value="Device setup">Device setup</option>
            <option value="Telehealth">Telehealth appointments</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Describe the issue (no sensitive info) <span className="text-red-500">*</span>
          <textarea className={`${inputCls} min-h-24`} name="description" required />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Preferred hub (optional)
            <select className={inputCls} name="preferredHubLocationId" defaultValue="">
              <option value="">No preference</option>
              {hubOptions.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Preferred time (optional)
            <input className={inputCls} name="preferredTime" placeholder="e.g., weekday mornings" />
          </label>
        </div>

        <Button disabled={pending} type="submit" className="mt-1">
          {pending ? "Submitting…" : "Submit request"}
        </Button>

        {msg && (
          <p role="alert" className={`text-sm ${msg.ok ? "text-forest" : "text-red-600"}`}>
            {msg.text}
          </p>
        )}
      </form>
    </Card>
  );
}
