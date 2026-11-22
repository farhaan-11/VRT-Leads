"use client";

import { useState } from "react";
import { OWNERS } from "@/app/preview/demoData";
import { Avatar, Button } from "@/app/preview/ui";

// The open count sits next to each name. Handing a lead to the person who
// is already buried is the mistake this box exists to prevent.
function openLeadsFor(leads, name) {
  return leads.filter((lead) => {
    const working = lead.stage === "new" || lead.stage === "follow_up";

    return lead.owner === name && working;
  }).length;
}

function OwnerChoice({ name, open, chosen, onPick }) {
  const look = chosen ? "border-[#3538CD] bg-[#F5F6FF]" : "border-[#E6E8EC] hover:bg-[#F9FAFB]";

  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 ${look}`}>
      <input
        type="radio"
        name="owner"
        className="sr-only"
        checked={chosen}
        onChange={() => onPick(name)}
      />
      <Avatar name={name} />
      <span className="flex-1 text-[14px] font-medium text-[#0C111D]">{name}</span>
      <span className="text-[12px] text-[#667085]">{open} open</span>
    </label>
  );
}

export default function AssignBody({ leads, onSave, onClose }) {
  const [picked, setPicked] = useState("");

  return (
    <div className="space-y-4 px-5 py-4">
      <div className="space-y-2">
        {OWNERS.map((name) => (
          <OwnerChoice
            key={name}
            name={name}
            open={openLeadsFor(leads, name)}
            chosen={picked === name}
            onPick={setPicked}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button look="primary" disabled={!picked} onClick={() => onSave({ owner: picked })}>
          Assign lead
        </Button>
      </div>
    </div>
  );
}
