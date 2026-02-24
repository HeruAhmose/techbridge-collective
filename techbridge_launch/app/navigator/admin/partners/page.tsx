import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui";
import PartnerOrgForms from "@/components/navigator/PartnerOrgForms";
import CronHealthWidget from "@/components/navigator/CronHealthWidget";
import CronStatusBadge from "@/components/navigator/CronStatusBadge";
import InviteTrackingTable from "@/components/navigator/InviteTrackingTable";

export const dynamic = "force-dynamic";

export default async function PartnerAdminPage() {
  await requireRole([UserRole.ADMIN]);

  const [orgs, hubs] = await Promise.all([
    prisma.partnerOrganization.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.hubLocation.findMany({ orderBy: [{ city: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <div className="grid max-w-5xl gap-6">

      {/* ── Partner org management ───────────────────────── */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-forest">Partner organizations</h1>
            <p className="mt-1 text-sm text-ink/65">
              Create orgs, assign hubs, and invite partner users. Partners only see data for their org's hubs.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <PartnerOrgForms
            orgs={orgs.map((o) => ({ id: o.id, name: o.name }))}
            hubs={hubs.map((h) => ({ id: h.id, name: h.name, partnerOrgId: h.partnerOrgId }))}
          />
        </div>
      </Card>

      {/* ── Invite delivery tracking ─────────────────────── */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-forest">Invite delivery tracking</h2>
        <p className="mt-1 text-sm text-ink/65">
          Real-time email status for all partner invites. Statuses update via webhook (Resend / Postmark).
        </p>
        <div className="mt-4">
          <InviteTrackingTable orgs={orgs.map((o) => ({ id: o.id, name: o.name }))} />
        </div>
      </Card>

      {/* ── Cron health ──────────────────────────────────── */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-forest">Cron job health</h2>
        <p className="mt-1 text-sm text-ink/65">
          Runs stored in DB. Badges turn red if a job falls outside its healthy window.
        </p>

        {/* invite-retry — runs every 10 min */}
        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-ink/80">invite-retry</span>
            <CronStatusBadge
              job="invite-retry"
              greenMinutes={30}
              yellowMinutes={120}
            />
            <span className="font-mono text-xs text-ink/40">*/10 * * * *</span>
          </div>
          <div className="mt-3">
            <CronHealthWidget job="invite-retry" />
          </div>
        </section>

        <div className="my-6 border-t border-ink/10" />

        {/* prune — runs daily at 03:17 UTC */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-ink/80">prune</span>
            <CronStatusBadge
              job="prune"
              greenMinutes={120}
              yellowMinutes={1500}
            />
            <span className="font-mono text-xs text-ink/40">17 3 * * *</span>
          </div>
          <div className="mt-3">
            <CronHealthWidget job="prune" />
          </div>
        </section>
      </Card>

    </div>
  );
}
