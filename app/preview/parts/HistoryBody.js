"use client";

import { money, shortDay, sourceLabel } from "@/app/preview/format";
import { Button } from "@/app/preview/ui";

// The story of one lead, built from what the row already knows. In the real
// app these lines come from the notes table.
function historyFor(lead) {
  const steps = [{ text: `Enquiry came in from ${sourceLabel(lead.source)}`, when: `${lead.waiting} days ago` }];

  if (lead.owner) {
    steps.push({ text: `Handed to ${lead.owner}`, when: `${lead.waiting - 1} days ago` });
  }
  if (lead.stage !== "new") {
    steps.push({ text: "Spoke on the phone. Asked about cohort dates and the fee.", when: "last week" });
  }
  return steps.concat(endingFor(lead));
}

function endingFor(lead) {
  if (lead.stage === "follow_up") {
    return [{ text: `Follow-up booked for ${shortDay(lead.followUp)}`, when: "last week" }];
  }
  if (lead.stage === "enrolled") {
    return [{ text: `Enrolled. ${money(lead.amount)} paid.`, when: "this month" }];
  }
  if (lead.stage === "rejected") {
    return [{ text: "Not going ahead. No budget this year.", when: "this month" }];
  }
  return [];
}

// A line down the left with a dot per step. The eye reads it as one story
// in order, which a plain list of sentences does not give.
function Step({ step, last }) {
  return (
    <li className="relative pb-4 pl-6 last:pb-0">
      {last ? null : <span className="absolute left-[5px] top-3 h-full w-px bg-[#E6E8EC]" />}
      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#3538CD]" />
      <p className="text-[13px] text-[#0C111D]">{step.text}</p>
      <p className="text-[12px] text-[#98A2B3]">{step.when}</p>
    </li>
  );
}

export default function HistoryBody({ lead, onClose }) {
  const steps = historyFor(lead);

  return (
    <div className="space-y-4 px-5 py-4">
      <ol className="max-h-64 overflow-y-auto">
        {steps.map((step, index) => (
          <Step key={step.text} step={step} last={index === steps.length - 1} />
        ))}
      </ol>

      <div className="flex items-center gap-2 border-t border-[#F2F4F7] pt-4">
        <input
          placeholder="Add a note about this lead"
          className="flex-1 rounded-lg border border-[#D0D5DD] px-3 py-2 text-[14px] outline-none focus:border-[#3538CD]"
        />
        <Button look="primary">Add</Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
