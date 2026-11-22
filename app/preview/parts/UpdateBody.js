"use client";

import { useState } from "react";
import { Button } from "@/app/preview/ui";

const CHOICES = [
  { id: "follow_up", title: "Book a follow-up", note: "We spoke. Talking again on a set day." },
  { id: "enrolled", title: "They enrolled", note: "Closed and paid. Goes into revenue." },
  { id: "rejected", title: "Not interested", note: "Closed. No more follow-ups." },
];

const FIELD =
  "w-full rounded-lg border border-[#D0D5DD] px-3 py-2 text-[14px] text-[#0C111D] outline-none focus:border-[#3538CD]";

function Choice({ choice, chosen, onPick }) {
  const look = chosen ? "border-[#3538CD] bg-[#F5F6FF]" : "border-[#E6E8EC] hover:bg-[#F9FAFB]";

  return (
    <label className={`block cursor-pointer rounded-xl border px-3 py-2.5 ${look}`}>
      <input
        type="radio"
        name="choice"
        className="sr-only"
        checked={chosen}
        onChange={() => onPick(choice.id)}
      />
      <span className="block text-[14px] font-medium text-[#0C111D]">{choice.title}</span>
      <span className="block text-[12px] text-[#667085]">{choice.note}</span>
    </label>
  );
}

// Only the chosen step asks for anything. Three sets of fields on screen at
// once is what made the first version of this box so hard to read.
function Extra({ pick, date, amount, onDate, onAmount }) {
  if (pick === "follow_up") {
    return (
      <label className="block space-y-1">
        <span className="text-[13px] font-medium text-[#344054]">Talk again on</span>
        <input type="date" value={date} onChange={(event) => onDate(event.target.value)} className={FIELD} />
      </label>
    );
  }
  if (pick === "enrolled") {
    return (
      <label className="block space-y-1">
        <span className="text-[13px] font-medium text-[#344054]">Amount paid (USD)</span>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(event) => onAmount(event.target.value)}
          placeholder="12500"
          className={FIELD}
        />
      </label>
    );
  }
  return null;
}

function patchFor(pick, date, amount) {
  if (pick === "follow_up") {
    return { stage: "follow_up", followUp: date };
  }
  if (pick === "enrolled") {
    return { stage: "enrolled", followUp: "", amount: Number(amount) };
  }
  return { stage: "rejected", followUp: "" };
}

// The save button stays dead until the chosen step has what it needs. A
// button that looks ready and then shows an error teaches nothing.
function canSave(pick, date, amount) {
  if (pick === "follow_up") {
    return Boolean(date);
  }
  if (pick === "enrolled") {
    return Number(amount) > 0;
  }
  return pick === "rejected";
}

export default function UpdateBody({ onSave, onClose }) {
  const [pick, setPick] = useState("");
  const [date, setDate] = useState("2026-11-26");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-4 px-5 py-4">
      <div className="space-y-2">
        {CHOICES.map((choice) => (
          <Choice key={choice.id} choice={choice} chosen={pick === choice.id} onPick={setPick} />
        ))}
      </div>

      <Extra pick={pick} date={date} amount={amount} onDate={setDate} onAmount={setAmount} />

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          look="primary"
          disabled={!canSave(pick, date, amount)}
          onClick={() => onSave(patchFor(pick, date, amount))}
        >
          Save update
        </Button>
      </div>
    </div>
  );
}
