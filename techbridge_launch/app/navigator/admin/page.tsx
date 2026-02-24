import { UserRole } from "@prisma/client";
import Link from "next/link";
import { requireRole } from "@/lib/auth/requireRole";
import { Card } from "@/components/ui";
import AdminPromoteForm from "@/components/navigator/AdminPromoteForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireRole([UserRole.ADMIN]);

  return (
    <div className="grid max-w-3xl gap-4">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-forest">Admin — Promote user role</h2>
        <p className="mt-2 text-sm text-ink/65">
          User must sign in once to create their DB record, then you can promote by email.
        </p>
        <AdminPromoteForm />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-forest">Admin — Partner organizations</h2>
        <p className="mt-2 text-sm text-ink/65">
          Create partner orgs, assign hub locations, and add partner users (role: PARTNER).
        </p>
        <Link
          className="mt-4 inline-block rounded-md bg-ink px-4 py-2 text-sm font-semibold text-cream no-underline hover:bg-forest"
          href="/navigator/admin/partners"
        >
          Manage partner orgs →
        </Link>
      </Card>
    </div>
  );
}
