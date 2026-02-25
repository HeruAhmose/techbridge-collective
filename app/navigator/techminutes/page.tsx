export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db/prisma";
import TechMinuteForm from "@/components/navigator/TechMinuteForm";
import { Card } from "@/components/ui";
import { requireRole } from "@/lib/auth/requireRole";
import { UserRole } from "@prisma/client";

export default async function NavigatorTechMinutes() {
  const user = await requireRole([UserRole.NAVIGATOR, UserRole.ADMIN]);
  const hubs = await prisma.hubLocation.findMany({ orderBy: { name: "asc" } });

  const recent = await prisma.techMinute.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    where: { navigatorUserId: user.id },
    include: { hubLocation: true },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TechMinuteForm hubOptions={hubs.map((h) => ({ id: h.id, name: h.name }))} />

      <Card className="p-6">
        <div className="text-lg font-semibold text-forest">Your recent logs</div>
        <div className="mt-4 grid gap-3">
          {recent.length ? (
            recent.map((r) => (
              <div key={r.id} className="rounded-lg border border-ink/10 bg-white p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-forest">{r.category}</div>
                  <div className="font-mono text-xs text-ink/60">{r.minutes}m</div>
                </div>
                <div className="mt-1 text-xs text-ink/60">
                  {r.hubLocation.name} · {r.outcome} · {new Date(r.createdAt).toLocaleString()}
                </div>
                {r.resolution ? <div className="mt-2 text-xs text-ink/70">{r.resolution}</div> : null}
              </div>
            ))
          ) : (
            <div className="text-sm text-ink/60">No logs yet. Add your first TechMinutes entry.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

