import { getCurrentUser } from "@/lib/currentUser";
import {
  getDashboardCounts,
  getRevenue,
} from "@/lib/queries/dashboardQueries";
import StatCards from "@/app/components/StatCards";
import Funnel from "@/app/components/Funnel";

// Nothing here can be built ahead of time. The database is not reachable
// during a Vercel build, and these numbers change through the day.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const counts = await getDashboardCounts(user);
  const revenue = await getRevenue(user);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
      <StatCards user={user} counts={counts} revenue={revenue} />
      <Funnel user={user} counts={counts} />
    </main>
  );
}
