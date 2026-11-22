import Link from "next/link";
import { formatDay, daysSince, todayInNewYork } from "@/lib/dates";
import {
  StageBadge,
  LeadName,
  LeadUpdateButton,
} from "@/app/components/lead/RowActions";

const HEADINGS = [
  "Name",
  "Company",
  "Source",
  "Owner",
  "Stage",
  "Follow-up",
  "Age",
  "",
];

// A dash, never the word "null". An empty column is normal here: nobody owns
// a fresh enquiry, and only a follow-up carries a date.
function orDash(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value;
}

// Both sides are plain 2026-11-22 text, so comparing them as text compares
// them as dates. Today is read in Connecticut, the same as the red number on
// the dashboard, so the two can never disagree.
function isLate(followUpOn, today) {
  if (!followUpOn) {
    return false;
  }
  return followUpOn < today;
}

function FollowUpCell({ followUpOn, today }) {
  const late = isLate(followUpOn, today);

  return (
    <td className={`px-3 py-2 ${late ? "font-medium text-red-600" : ""}`}>
      {orDash(formatDay(followUpOn))}
    </td>
  );
}

// The name opens the history and the last cell opens the update box. Both
// open in the browser from what this row already holds, so neither waits on
// the server.
function EnquiryRow({ enquiry, today, notes }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="px-3 py-2">
        <LeadName lead={enquiry} notes={notes} />
      </td>
      <td className="max-w-56 truncate px-3 py-2">{orDash(enquiry.company)}</td>
      <td className="px-3 py-2">{orDash(enquiry.source)}</td>
      <td className="px-3 py-2">{orDash(enquiry.owner_name)}</td>
      <td className="px-3 py-2">
        <StageBadge stage={enquiry.stage} />
      </td>
      <FollowUpCell followUpOn={enquiry.follow_up_on} today={today} />
      <td className="px-3 py-2 text-right text-slate-500">
        {daysSince(enquiry.created_at)}d
      </td>
      <td className="px-3 py-2 text-right">
        <LeadUpdateButton lead={enquiry} today={today} />
      </td>
    </tr>
  );
}

function TableHead() {
  return (
    <thead>
      <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
        {HEADINGS.map((heading) => (
          <th key={heading} className="px-3 py-2 font-medium">
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// No rows is a normal answer, not a fault. It says so plainly and offers the
// way back, because a blank screen with no explanation reads as broken.
function NothingFound() {
  return (
    <div className="rounded border border-slate-200 p-8 text-center text-sm text-slate-500">
      <p>Nothing matches these filters.</p>
      <Link href="/" className="underline">
        Show all enquiries
      </Link>
    </div>
  );
}

export default function EnquiryTable({ enquiries, notesByLead }) {
  if (enquiries.length === 0) {
    return <NothingFound />;
  }

  const today = todayInNewYork();

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full text-sm">
        <TableHead />
        <tbody>
          {enquiries.map((enquiry) => (
            <EnquiryRow
              key={enquiry.id}
              enquiry={enquiry}
              today={today}
              notes={notesByLead.get(enquiry.id) || []}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
