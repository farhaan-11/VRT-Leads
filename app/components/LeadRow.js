import { daysSince } from "@/lib/dates";
import { money, shortDay, sourceLabel } from "@/app/components/format";
import { Avatar, StageBadge } from "@/app/components/ui";
import { LeadName, RowAction } from "@/app/components/lead/RowActions";

const CELL = "px-4 align-middle";

// Both sides are plain 2026-11-22 text, so comparing them as text compares
// them as dates. Today is read in Connecticut, the same as the red number on
// the cards, so the two can never disagree.
function isLate(lead, today) {
  if (lead.stage !== "follow_up" || !lead.follow_up_on) {
    return false;
  }
  return lead.follow_up_on < today;
}

function daysLate(lead, today) {
  const gap = Date.parse(`${today}T12:00:00Z`) - Date.parse(`${lead.follow_up_on}T12:00:00Z`);

  return Math.round(gap / (24 * 60 * 60 * 1000));
}

// An unowned lead is the backlog this screen exists to show, so it is said
// in words and in amber rather than left as an empty cell. The dot keeps the
// pill matching the stage badges elsewhere on the row.
function OwnerCell({ owner }) {
  if (!owner) {
    return (
      <td className={CELL}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFAEB] px-2.5 py-1 text-xs font-medium text-[#B54708]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F79009]" />
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

// This column always says something. A follow-up shows its date, an
// enrolment shows the money, and a new lead says plainly that nobody has
// called yet - which is itself the thing worth seeing.
function nextStepFor(lead, today) {
  if (lead.stage === "enrolled") {
    return { main: money(Number(lead.amount || 0)), note: "paid", tone: "text-[#067647]" };
  }
  if (lead.stage === "rejected") {
    return { main: "Closed", note: "not interested", tone: "text-[#667085]" };
  }
  if (lead.stage === "new") {
    return { main: "No call yet", note: "waiting on first contact", tone: "text-[#667085]" };
  }
  if (isLate(lead, today)) {
    return {
      main: shortDay(lead.follow_up_on),
      note: `${daysLate(lead, today)} days late`,
      tone: "text-[#D92D20]",
    };
  }
  return { main: shortDay(lead.follow_up_on), note: "call booked", tone: "text-[#344054]" };
}

function NextStepCell({ lead, today }) {
  const step = nextStepFor(lead, today);
  const noteTone = step.tone === "text-[#D92D20]" ? "text-[#D92D20]" : "text-[#98A2B3]";

  return (
    <td className={CELL}>
      <span className={`block text-[13px] font-medium ${step.tone}`}>{step.main}</span>
      <span className={`block text-[12px] ${noteTone}`}>{step.note}</span>
    </td>
  );
}

// A faint tint on the whole row, so the rows that matter are seen without the
// eye having to find a single red cell. White everywhere else keeps the strip
// calm.
function rowTone(late, stage) {
  if (late) {
    return "bg-[#FFFBFA] hover:bg-[#FEF3F2]";
  }
  if (stage === "enrolled") {
    return "bg-[#F6FEF9] hover:bg-[#ECFDF3]";
  }
  return "hover:bg-[#F6F7F9]";
}

export default function LeadRow({ lead, today, notes, owners, isAdmin }) {
  const late = isLate(lead, today);

  return (
    <tr className={`h-[52px] border-t border-[#F2F4F7] transition ${rowTone(late, lead.stage)}`}>
      <td className={CELL}>
        <LeadName lead={lead} notes={notes} />
        <span className="block truncate text-[12px] text-[#667085]">{lead.company}</span>
      </td>
      <td className={`${CELL} text-[13px] text-[#667085]`}>{sourceLabel(lead.source)}</td>
      <OwnerCell owner={lead.owner_name} />
      <td className={CELL}>
        <StageBadge stage={lead.stage} />
      </td>
      <NextStepCell lead={lead} today={today} />
      <td className={`${CELL} text-[13px] tabular-nums text-[#667085]`}>
        {daysSince(lead.created_at)} days
      </td>
      <td className={`${CELL} text-right`}>
        <RowAction
          lead={lead}
          notes={notes}
          owners={owners}
          isAdmin={isAdmin}
          today={today}
          late={late}
        />
      </td>
    </tr>
  );
}
