import { HomeClient } from "@/components/home/home-client";
import { getHomeData } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomeData();

  return <HomeClient data={data} />;
}
