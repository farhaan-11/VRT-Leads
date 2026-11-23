import { todayInNewYork } from "@/lib/dates";
import { SURFACE, LABEL } from "@/app/components/ui";
import LeadRow from "@/app/components/LeadRow";
import Pager from "@/app/components/Pager";
import { NavLink } from "@/app/components/Nav";

const HEADINGS = ["Lead", "Source", "Owner", "Stage", "Next step", "Waiting", ""];

// Fixed widths, so a long company name cannot push the button off the right
// edge and the columns stay in the same place on every page.
const WIDTHS = ["25%", "9%", "15%", "12%", "17%", "9%", "13%"];

function TableHead() {
  return (
    <thead className="bg-[#F9FAFB]">
      <tr className="h-10 border-b border-[#E6E8EC]">
        {HEADINGS.map((heading, index) => (
          <th
            key={heading || "action"}
            className={`${LABEL} px-4 text-left ${index === HEADINGS.length - 1 ? "text-right" : ""}`}
          >
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// No rows is a normal answer, not a fault. It says so plainly and offers the
// way back, because a blank panel with no words reads as broken.
function NothingFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F4F7] text-lg text-[#667085]">
        0
      </span>
      <p className="text-[15px] font-semibold text-[#0C111D]">No leads in this view</p>
      <p className="text-[13px] text-[#667085]">
        Nothing matches what you picked. Everything else is still here.
      </p>
      <NavLink href="/" className="mt-2 text-[13px] font-medium text-[#3538CD] hover:underline">
        Show all leads
      </NavLink>
    </div>
  );
}

function Rows({ enquiries, notesByLead, today, owners, isAdmin }) {
  return (
    <table className="w-full table-fixed border-collapse">
      <colgroup>
        {HEADINGS.map((heading, index) => (
          <col key={heading || "action"} style={{ width: WIDTHS[index] }} />
        ))}
      </colgroup>
      <TableHead />
      <tbody>
        {enquiries.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            today={today}
            notes={notesByLead.get(lead.id) || []}
            owners={owners}
            isAdmin={isAdmin}
          />
        ))}
      </tbody>
    </table>
  );
}

// The panel owns the leftover height. Its rows scroll only on a screen too
// short to hold nine of them, so on a laptop nothing moves at all.
export default function LeadsTable({ enquiries, notesByLead, filters, total, owners, isAdmin }) {
  const today = todayInNewYork();

  return (
    <section className={`${SURFACE} flex min-h-0 flex-1 flex-col overflow-hidden`}>
      {enquiries.length === 0 ? (
        <NothingFound />
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Rows
              enquiries={enquiries}
              notesByLead={notesByLead}
              today={today}
              owners={owners}
              isAdmin={isAdmin}
            />
          </div>
          <Pager filters={filters} total={total} />
        </>
      )}
    </section>
  );
}
