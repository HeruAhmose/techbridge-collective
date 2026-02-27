export const dynamic = "force-dynamic";
import TechBridgeDashboard from "@/components/dashboard/TechBridgeDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechMinutes® Dashboard",
  description: "Interactive TechMinutes® dashboard for TechBridge Collective.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <TechBridgeDashboard />;
}
