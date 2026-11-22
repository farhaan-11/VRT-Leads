import { getCurrentUser, getAllViewers } from "@/lib/currentUser";
import {
  getDashboardCounts,
  getRevenue,
} from "@/lib/queries/dashboardQueries";
import {
  readFilters,
  getEnquiryList,
  getSources,
} from "@/lib/queries/enquiryQueries";
import StatCards from "@/app/components/StatCards";
import Funnel from "@/app/components/Funnel";
import EnquiryFilters from "@/app/components/EnquiryFilters";
import EnquiryTable from "@/app/components/EnquiryTable";

// Nothing here can be built ahead of time. The database is not reachable
// during a Vercel build, and these numbers change through the day.
export const dynamic = "force-dynamic";

// Everything this page shows, fetched in one place so the markup below stays
// readable.
async function loadPage(user, filters) {
  const counts = await getDashboardCounts(user);
  const revenue = await getRevenue(user);
  const enquiries = await getEnquiryList(user, filters);
  const sources = await getSources();
  const viewers = await getAllViewers();

  return { counts, revenue, enquiries, sources, viewers };
}

// searchParams arrives as a promise in Next 16, so it has to be awaited
// before anything can be read out of it.
export default async function HomePage({ searchParams }) {
  const user = await getCurrentUser();
  const filters = readFilters(await searchParams);
  const data = await loadPage(user, filters);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
      <StatCards user={user} counts={data.counts} revenue={data.revenue} />
      <Funnel user={user} counts={data.counts} />
      <EnquiryFilters
        user={user}
        viewers={data.viewers}
        sources={data.sources}
        filters={filters}
      />
      <EnquiryTable enquiries={data.enquiries} />
    </main>
  );
}
