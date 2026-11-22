"use client";

import { formatDay } from "@/lib/dates";
import LeadNotes from "@/app/components/lead/LeadNotes";

// Nothing from the row is repeated here. The table already carries the
// owner, the company and the stage; this box answers the one thing it
// cannot - what has been said so far.
function NextStep({ lead }) {
  if (!lead.follow_up_on) {
    return null;
  }

  return (
    <p className="rounded-lg bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#667085]">
      Next follow-up:{" "}
      <span className="font-medium text-[#0C111D]">
        {formatDay(lead.follow_up_on)}
      </span>
    </p>
  );
}

export default function LeadHistoryModal({ lead, notes }) {
  return (
    <div className="space-y-3">
      <NextStep lead={lead} />
      <LeadNotes notes={notes} />
    </div>
  );
}
