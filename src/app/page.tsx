import { HomeClient } from "@/components/home/home-client";
import { requireCurrentUser } from "@/lib/auth/session";
import { getHomeData } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const currentUser = await requireCurrentUser();
  const data = await getHomeData(currentUser.id);

  return <HomeClient data={data} />;
}
