import type { Metadata } from "next";
import TechBridgeDashboard from "@/components/dashboard/TechBridgeDashboard";

export const metadata: Metadata = {
  title: "TechMinutes® Dashboard",
  description:
    "Interactive TechMinutes® dashboard — session data, outcomes, and impact metrics for TechBridge Collective. For funders and prospective partners.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <TechBridgeDashboard />;
}
