import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser();
  const dashboardData = await getDashboardData(currentUser.id);

  return <DashboardClient data={dashboardData} />;
}
