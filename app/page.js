import { getCurrentUser } from "@/lib/currentUser";
import {
  getDashboardCounts,
  getRevenue,
} from "@/lib/queries/dashboardQueries";
import {
  readFilters,
  getEnquiryList,
  countEnquiries,
} from "@/lib/queries/enquiryQueries";
import { getSalesWorkload } from "@/lib/queries/assignmentQueries";
import { getNotesForLeads } from "@/lib/queries/leadQueries";
import StatCards from "@/app/components/StatCards";
import Funnel from "@/app/components/Funnel";
import LeadsTable from "@/app/components/LeadsTable";
import LeadsScreen from "@/app/components/LeadsScreen";

// Nothing here can be built ahead of time. The database is not reachable
// during a Vercel build, and these numbers change through the day.
export const dynamic = "force-dynamic";

// Everything this page shows, fetched in one place so the markup below stays
// readable.
async function loadPage(user, filters) {
  const counts = await getDashboardCounts(user);
  const revenue = await getRevenue(user);
  const enquiries = await getEnquiryList(user, filters);
  const total = await countEnquiries(user, filters);
  const owners = await getSalesWorkload();

  return { counts, revenue, enquiries, total, owners };
}

// Every note for the rows on screen, in one more query. With them already
// here, opening a lead costs no trip to the server at all - which is the
// whole reason the modal feels instant.
async function loadNotes(enquiries) {
  const ids = enquiries.map((enquiry) => enquiry.id);
  const notes = await getNotesForLeads(ids);
  const byLead = new Map();

  for (const note of notes) {
    const forThisLead = byLead.get(note.enquiry_id) || [];
    forThisLead.push(note);
    byLead.set(note.enquiry_id, forThisLead);
  }
  return byLead;
}

// One call for the whole page, so the markup below stays readable and the
// order the queries run in is written down in one place.
async function loadEverything(user, filters) {
  const data = await loadPage(user, filters);
  const notesByLead = await loadNotes(data.enquiries);

  return { ...data, notesByLead };
}

// The filters and the table travel together. The screen around them is a
// client component, because only the browser knows that a new set of rows
// has been asked for and has not arrived yet.
function LeadsView({ user, data, filters }) {
  return (
    <LeadsScreen
      filters={filters}
      isAdmin={user.role === "admin"}
      owners={data.owners}
      nextOwner={data.owners[0]}
      total={data.total}
    >
      <LeadsTable
        enquiries={data.enquiries}
        notesByLead={data.notesByLead}
        filters={filters}
        total={data.total}
        owners={data.owners}
        isAdmin={user.role === "admin"}
      />
    </LeadsScreen>
  );
}

// searchParams arrives as a promise in Next 16, so it has to be awaited
// before anything can be read out of it.
//
// The tab lives in the address bar rather than in the browser's memory, so
// the screen someone is looking at can be sent to someone else as a link.
export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const filters = readFilters(params);
  const data = await loadEverything(user, filters);

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4">
      <StatCards user={user} counts={data.counts} revenue={data.revenue} />

      {params.tab === "insights" ? (
        <Funnel user={user} counts={data.counts} />
      ) : (
        <LeadsView user={user} data={data} filters={filters} />
      )}
    </main>
  );
}
