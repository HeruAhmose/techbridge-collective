export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import PartnerRequestForm from "@/components/forms/PartnerRequestForm";
import { Card, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Host a Hub",
  description: "Partner with TechBridge Collective to bring a Digital Navigator hub to your library, community center, or housing authority. Monthly TechMinutes® reporting included.",
};

const WHAT_YOU_PROVIDE = ["A table or corner during set hours (4–16 hrs/week)", "Wi-Fi access", "A community that needs tech help"];
const WHAT_WE_PROVIDE  = ["Trained, paid Digital Navigator", "H.K. AI on tablet for overflow & off-hours", "TechMinutes® session logging — automated"];
const WHAT_YOU_RECEIVE = ["Monthly one-page impact PDF + CSV for grant reporting", "ZIP-level heatmap of resident digital needs", "Co-branding as an official TechBridge hub partner"];

const PACKAGES = [
  {
    name: "Pilot Host",
    cost: "Year 1 · Free / Low-Cost",
    desc: "For libraries and community centers ready to move fast. We bring everything.",
    items: ["4–8 hub hours per week", "1 Digital Navigator on-site", "H.K. AI tablet support", "Monthly impact report"],
    featured: false,
  },
  {
    name: "Supported Hub",
    cost: "Year 2 · Service Contract",
    desc: "For workforce centers and housing authorities needing dedicated hours and detailed reporting.",
    items: ["16+ hub hours per week", "2 dedicated Digital Navigators", "Full TechMinutes® dashboard", "Monthly PDF + CSV reporting", "Bilingual EN/ES support"],
    featured: true,
  },
  {
    name: "Barrier Reduction",
    cost: "Targeted Program · Custom",
    desc: "For NCWorks or housing authorities targeting veterans, Spanish speakers, or seniors.",
    items: ["Population-specific training tracks", "Benefits portal specialists", "Outcome-linked reporting", "H.K. custom knowledge base"],
    featured: false,
  },
];

export default function HostAHubPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-gold/80">LIBRARIES · CITIES · COMMUNITY ORGS</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Host a <span className="text-gold">TechBridge Hub.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-cream/70">
            You provide the space. We bring paid Digital Navigators, H.K. AI, and monthly TechMinutes®
            reporting that proves community impact to your funders and leadership.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { title: "You provide", items: WHAT_YOU_PROVIDE },
              { title: "We provide",  items: WHAT_WE_PROVIDE  },
              { title: "You receive", items: WHAT_YOU_RECEIVE  },
            ].map((col) => (
              <Card key={col.title} className="border-gold/15 bg-white/5 p-6">
                <p className="text-xs font-mono tracking-[0.18em] uppercase text-gold">{col.title}</p>
                <ul className="mt-3 grid gap-2">
                  {col.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-cream/70">
                      <span className="mt-0.5 text-teal flex-shrink-0">→</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-linen">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="font-mono text-xs tracking-[0.22em] text-sage">HOSTING PACKAGES</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest">Find the right fit</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <Card key={pkg.name} className={`relative p-6 ${pkg.featured ? "ring-2 ring-gold/50 shadow-md" : ""}`}>
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-ink whitespace-nowrap">
                    Most Requested
                  </div>
                )}
                <p className="text-lg font-semibold text-forest">{pkg.name}</p>
                <p className="mt-0.5 font-mono text-xs text-gold">{pkg.cost}</p>
                <p className="mt-3 text-sm text-ink/60 leading-relaxed">{pkg.desc}</p>
                <ul className="mt-4 grid gap-1.5">
                  {pkg.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-ink/70">
                      <span className="text-teal font-bold flex-shrink-0">✓</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA form */}
      <section id="book" className="bg-forest text-cream">
        <div className="mx-auto max-w-2xl px-4 py-14">
          <p className="font-mono text-xs tracking-[0.22em] text-cream/60">NO DECKS. NO COMMITMENTS.</p>
          <h2 className="mt-2 text-3xl font-semibold">Book a 15-minute call.</h2>
          <p className="mt-3 text-sm text-cream/60 max-w-md">
            Tell us about your space, your audience, and your goals. We'll determine fit in under 15 minutes
            and have a clear next step before we hang up.
          </p>
          <div className="mt-8">
            <PartnerRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}

