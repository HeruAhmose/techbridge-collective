export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import ResidentIntakeForm from "@/components/forms/ResidentIntakeForm";
import HKOpenButton from "@/components/HKOpenButton";
import HKQuickStarts from "@/components/HKQuickStarts";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Get Help",
  description: "Find a tech help hub near you in Durham or Raleigh, or ask H.K. AI 24/7. Free. No account needed.",
};

export default async function GetHelpPage() {
  const hubs = await prisma.hubLocation.findMany({
    select: { id: true, name: true, address: true, city: true, state: true, zip: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      {/* H.K. AI section */}
      <section id="hk" className="bg-forest text-cream">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-cream/60">H.K. AI · 24/7 · FREE</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            Ask H.K. — get help <span className="text-gold">right now.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-cream/70">
            H.K. asks a few questions, gives step-by-step guidance, and connects you to a Digital Navigator
            when needed. No account. No wait. Available 24/7.
          </p>
          <p className="mt-2 text-xs text-cream/40 font-mono">
            Safety: H.K. never asks for passwords, SSNs, bank info, or 2FA codes.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="border-gold/20 bg-white/5 p-6">
              <p className="text-sm font-semibold text-gold mb-1">Quick starts</p>
              <HKQuickStarts />
            </Card>
            <div className="flex flex-col justify-center gap-3">
              <HKOpenButton className="w-full" />
              <p className="text-xs text-cream/40">
                The chat opens in the corner. No login required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hub locations */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="font-mono text-xs tracking-[0.22em] text-sage">WHERE TO WALK IN</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest">Find a hub near you</h2>
          <p className="mt-2 text-sm text-ink/60 max-w-lg">
            No appointment. No referral. Show up during hub hours — with your device or without.
            A Digital Navigator will work through your issue with you.
          </p>

          {hubs.length === 0 ? (
            <Card className="mt-8 p-6 text-ink/60 text-sm">
              Hub locations launching May 2026. Submit a help request below and we'll be in touch.
            </Card>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {hubs.map((h) => (
                <Card key={h.id} className="p-6">
                  <div className="text-base font-semibold text-forest">{h.name}</div>
                  <div className="mt-1 text-sm text-ink/60">{h.address}, {h.city}, {h.state} {h.zip}</div>
                  <div className="mt-4 flex gap-4">
                    <a
                      className="text-sm font-semibold text-sage underline-offset-4 hover:underline"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.address}, ${h.city}, ${h.state} ${h.zip}`)}`}
                      target="_blank" rel="noreferrer"
                    >
                      Open in Maps →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Resident intake form */}
      <section id="intake" className="bg-linen">
        <div className="mx-auto max-w-2xl px-4 py-14">
          <p className="font-mono text-xs tracking-[0.22em] text-sage">CAN'T MAKE IT IN?</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest">Submit a help request</h2>
          <p className="mt-2 text-sm text-ink/60">
            A Digital Navigator will follow up within 2 business days. No passwords, no SSNs — never.
          </p>
          <div className="mt-6">
            <ResidentIntakeForm hubOptions={hubs.map((h) => ({ id: h.id, name: h.name }))} />
          </div>
        </div>
      </section>
    </div>
  );
}

