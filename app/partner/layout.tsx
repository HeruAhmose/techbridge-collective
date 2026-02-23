import Link from "next/link";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  await requireRole([UserRole.PARTNER, UserRole.ADMIN]);

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink/60">Partner Dashboard</div>
            <div className="text-xl font-semibold text-forest">Reports & rollups</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen" href="/partner">
              Dashboard
            </Link>
            <Link className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen" href="/impact">
              Public Impact
            </Link>
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
