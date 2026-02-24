"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

export default function PartnerRequestForm() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg]         = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMsg(null);

    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res  = await fetch("/api/intake/partner", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg({ ok: false, text: data?.error || "Something went wrong. Please try again." });
      } else {
        (e.target as HTMLFormElement).reset();
        setMsg({ ok: true, text: "Thanks — we'll reach out within 1 business day to schedule a pilot call." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error — please check your connection and try again." });
    } finally {
      setPending(false);
    }
  }

  const inputCls = "rounded-md border border-gold/25 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

  return (
    <Card className="border-gold/20 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-cream">Book a pilot conversation</h3>
      <p className="mt-1 text-sm text-cream/60">Tell us about your space, audience, and goals.</p>

      <form className="mt-5 grid gap-4" onSubmit={onSubmit} noValidate>
        <label className="grid gap-1.5 text-sm font-medium text-cream/80">
          Organization <span className="text-gold">*</span>
          <input className={inputCls} name="organization" required autoComplete="organization" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-cream/80">
            Contact name <span className="text-gold">*</span>
            <input className={inputCls} name="contactName" required autoComplete="name" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-cream/80">
            Email <span className="text-gold">*</span>
            <input className={inputCls} name="email" type="email" required autoComplete="email" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-cream/80">
            Phone (optional)
            <input className={inputCls} name="phone" type="tel" autoComplete="tel" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-cream/80">
            City (optional)
            <input className={inputCls} name="city" autoComplete="address-level2" />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-medium text-cream/80">
          Notes (optional)
          <textarea className={`${inputCls} min-h-24`} name="notes" />
        </label>

        <Button disabled={pending} type="submit">
          {pending ? "Sending…" : "Request a 15-minute call"}
        </Button>

        {msg && (
          <p role="alert" className={`text-sm ${msg.ok ? "text-teal" : "text-red-400"}`}>
            {msg.text}
          </p>
        )}
      </form>
    </Card>
  );
}
