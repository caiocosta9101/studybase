import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getDashboardData } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return <DashboardClient data={dashboardData} />;
}
