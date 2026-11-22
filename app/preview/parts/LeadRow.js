"use client";

import { daysLate, isOverdue } from "@/app/preview/demoData";
import { money, shortDay, sourceLabel } from "@/app/preview/format";
import { Avatar, StageBadge } from "@/app/preview/ui";
import RowAction from "@/app/preview/parts/RowAction";

const CELL = "px-4 py-0 align-middle";

function LeadCell({ lead, onOpen }) {
  return (
    <td className={CELL}>
      <button
        type="button"
        onClick={() => onOpen(lead, "history")}
        className="block text-left"
      >
        <span className="block truncate text-[14px] font-medium text-[#0C111D] hover:text-[#3538CD]">
          {lead.name}
        </span>
        <span className="block truncate text-[12px] text-[#667085]">{lead.company}</span>
      </button>
    </td>
  );
}

// An unowned lead is the backlog this screen exists to show, so it is said
// in words and in amber rather than left as an empty cell.
function OwnerCell({ owner }) {
  if (!owner) {
    return (
      <td className={CELL}>
        <span className="rounded-full bg-[#FFFAEB] px-2.5 py-1 text-xs font-medium text-[#B54708]">
          Nobody yet
        </span>
      </td>
    );
  }

  return (
    <td className={CELL}>
      <span className="flex items-center gap-2">
        <Avatar name={owner} />
        <span className="truncate text-[13px] text-[#344054]">{owner}</span>
      </span>
    </td>
  );
}

// This column always says something useful. A follow-up shows its date, an
// enrolment shows the money, and a new lead says plainly that nobody has
// called yet - which is itself the thing worth seeing.
function nextStepFor(lead) {
  if (lead.stage === "enrolled") {
    return { main: money(lead.amount), note: "paid", tone: "text-[#067647]" };
  }
  if (lead.stage === "rejected") {
    return { main: "Closed", note: "not interested", tone: "text-[#667085]" };
  }
  if (lead.stage === "new") {
    return { main: "No call yet", note: "waiting on first contact", tone: "text-[#667085]" };
  }
  if (isOverdue(lead)) {
    return { main: shortDay(lead.followUp), note: `${daysLate(lead)} days late`, tone: "text-[#D92D20]" };
  }
  return { main: shortDay(lead.followUp), note: "call booked", tone: "text-[#344054]" };
}

function NextStepCell({ lead }) {
  const step = nextStepFor(lead);

  return (
    <td className={CELL}>
      <span className={`block text-[13px] font-medium ${step.tone}`}>{step.main}</span>
      <span className={`block text-[12px] ${step.tone === "text-[#D92D20]" ? "text-[#D92D20]" : "text-[#98A2B3]"}`}>
        {step.note}
      </span>
    </td>
  );
}

export default function LeadRow({ lead, isAdmin, onOpen }) {
  return (
    <tr className="h-[52px] border-t border-[#F2F4F7] transition hover:bg-[#FAFAFB]">
      <LeadCell lead={lead} onOpen={onOpen} />
      <td className={`${CELL} text-[13px] text-[#667085]`}>{sourceLabel(lead.source)}</td>
      <OwnerCell owner={lead.owner} />
      <td className={CELL}>
        <StageBadge stage={lead.stage} />
      </td>
      <NextStepCell lead={lead} />
      <td className={`${CELL} text-[13px] tabular-nums text-[#667085]`}>{lead.waiting} days</td>
      <td className={`${CELL} text-right`}>
        <RowAction lead={lead} isAdmin={isAdmin} onOpen={onOpen} />
      </td>
    </tr>
  );
}
