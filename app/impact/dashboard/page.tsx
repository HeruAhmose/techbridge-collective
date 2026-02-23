import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Card } from "@/components/ui";

const ImpactDashboardClient = dynamic(() => import("@/components/impact/ImpactDashboardClient"), { ssr: false });

export const metadata: Metadata = {
  title: "Impact Dashboard — TechMinutes®",
  description: "Interactive, non‑PII TechMinutes® dashboard for partners and funders.",
};

export const dynamicRoute = "force-dynamic";

export default function ImpactDashboardPage() {
  return (
    <main className="bg-linen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-forest">Impact Dashboard</h1>
            <p className="mt-2 max-w-prose text-sm text-ink/65">
              Live, non‑PII aggregate metrics. Use for partner updates and grant reporting.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-cream" href="/impact">
              Back to Impact
            </Link>
            <Link className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-cream" href="/partner">
              Partner login
            </Link>
          </div>
        </div>

        <Card className="mt-6 p-4">
          <ImpactDashboardClient />
        </Card>
      </div>
    </main>
  );
}
