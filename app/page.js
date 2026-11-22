import { getCurrentUser, getAllViewers } from "@/lib/currentUser";
import {
  getDashboardCounts,
  getRevenue,
} from "@/lib/queries/dashboardQueries";
import {
  readFilters,
  getEnquiryList,
  getSources,
  countEnquiries,
} from "@/lib/queries/enquiryQueries";
import { findNextSalesPerson } from "@/lib/queries/assignmentQueries";
import { getNotesForLeads } from "@/lib/queries/leadQueries";
import StatCards from "@/app/components/StatCards";
import Funnel from "@/app/components/Funnel";
import EnquiryFilters from "@/app/components/EnquiryFilters";
import LeadsTable from "@/app/components/LeadsTable";

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
  const sources = await getSources();
  const viewers = await getAllViewers();
  const nextOwner = await findNextSalesPerson();

  return { counts, revenue, enquiries, total, sources, viewers, nextOwner };
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

// A rule people can see is a rule they trust. This line sits here and not on
// the form, because the form is public and how much work each sales person
// holds is VRT's own business.
function NextInLine({ owner }) {
  if (!owner) {
    return null;
  }

  return (
    <p className="text-sm text-slate-600">
      Next enquiry goes to {owner.name} ({owner.openLeads} open leads)
    </p>
  );
}

// One call for the whole page, so the markup below stays readable and the
// order the queries run in is written down in one place.
async function loadEverything(user, filters) {
  const data = await loadPage(user, filters);
  const notesByLead = await loadNotes(data.enquiries);

  return { ...data, notesByLead };
}

// The list and its filters travel together. Picking a filter without the
// rows under it, or the rows without the filters, would make no sense.
function LeadsView({ user, data, filters }) {
  return (
    <>
      <EnquiryFilters
        user={user}
        viewers={data.viewers}
        sources={data.sources}
        filters={filters}
      />
      <LeadsTable
        enquiries={data.enquiries}
        notesByLead={data.notesByLead}
        filters={filters}
        total={data.total}
      />
    </>
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
      <NextInLine owner={data.nextOwner} />
      <StatCards user={user} counts={data.counts} revenue={data.revenue} />

      {params.tab === "insights" ? (
        <Funnel user={user} counts={data.counts} />
      ) : (
        <LeadsView user={user} data={data} filters={filters} />
      )}
    </main>
  );
}
