import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TechBridgeDashboard from "@/components/dashboard/TechBridgeDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechMinutes® Dashboard",
  description: "Interactive TechMinutes® dashboard for TechBridge Collective.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <TechBridgeDashboard />;
}
