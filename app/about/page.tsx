export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "TechBridge Collective places neighborhood tech help desks in Durham and Raleigh NC. Named for Horace King, the 19th-century bridge builder.",
};

const FUNDING = [
  ["NTIA Digital Equity Grants",    "$500K–$3M+"],
  ["DOL WORC Initiative",           "$500K–$2.5M"],
  ["Google.org Tech for Good",      "$100K–$1.5M"],
  ["Cisco Global Impact",           "$250K–$1M+"],
  ["NSF Future of Work",            "$1M–$3M"],
  ["Lenovo Foundation NC",          "$100K–$750K"],
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.22em] text-gold/80">ABOUT</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            We build bridges,{" "}
            <em className="text-gold not-italic font-serif">not barriers.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-cream/70 leading-relaxed">
            TechBridge Collective places neighborhood tech help desks inside Durham County Library and the
            City of Raleigh Digital Impact program — staffed by paid Digital Navigators drawn from NPower
            alumni and military-connected residents, powered by H.K. AI for 24/7 triage and routing.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-forest">Named for Horace King</h2>
          <p className="mt-4 text-base text-ink/70 leading-relaxed max-w-2xl">
            H.K. — our AI navigator — is named for{" "}
            <strong className="text-ink">Horace King</strong>, the 19th-century bridge builder who crossed
            racial barriers to connect communities across the American South. Born into slavery in 1807, King
            became one of the most skilled engineers of his era, building over 100 bridges across Georgia,
            Alabama, and Mississippi. Like him, we build real connections between people and the tools,
            skills, and opportunities they deserve.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { title: "Bold Path Fellowship",   body: "$120K award supporting our two-hub pilot launch in Durham and Raleigh, May 2026." },
              { title: "NPower Partnership",      body: "Navigator talent pipeline from NPower North Carolina's cybersecurity and IT training programs." },
              { title: "Two Pilot Hubs",          body: "Durham County Library and City of Raleigh Digital Impact Program. Launching May 2026." },
              { title: "TechMinutes® Accountability", body: "Every session logged non-PII. Partners get a monthly PDF + CSV for grant reporting." },
            ].map((c) => (
              <Card key={c.title} className="p-6">
                <p className="text-sm font-semibold text-gold">{c.title}</p>
                <p className="mt-2 text-sm text-ink/70">{c.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-semibold">Active funding opportunities</h2>
          <p className="mt-2 text-sm text-cream/60 max-w-md">
            TechBridge is positioned for multiple federal, foundation, and corporate funding tracks.
          </p>
          <div className="mt-6 grid gap-px">
            {FUNDING.map(([name, amount]) => (
              <div key={name} className="flex justify-between border-b border-white/10 py-2.5 text-sm">
                <span className="text-cream/70">{name}</span>
                <span className="font-mono text-gold">{amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link href="/host-a-hub#book">
              <Button>Book a 15-min Call</Button>
            </Link>
            <Link href="/get-help">
              <Button variant="outline" className="border-gold/40 bg-transparent text-cream hover:bg-white/5">
                Get Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

