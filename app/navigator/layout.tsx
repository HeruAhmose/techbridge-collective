import type { Metadata } from "next";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/requireRole";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Navigator Portal — TechBridge",
};

export default async function NavigatorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole([UserRole.NAVIGATOR, UserRole.ADMIN]);

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink/60">Navigator Portal</div>
            <div className="text-xl font-semibold text-forest">
              Welcome{user.name ? `, ${user.name}` : ""} ({user.role})
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href="/navigator"
            >
              Intake
            </Link>
            <Link
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
              href="/navigator/techminutes"
            >
              TechMinutes
            </Link>
            {user.role === UserRole.ADMIN ? (
              <Link
                className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm no-underline hover:bg-linen"
                href="/navigator/admin"
              >
                Admin
              </Link>
            ) : null}
            <UserMenu />
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
