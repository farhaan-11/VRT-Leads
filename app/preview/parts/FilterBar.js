"use client";

import { viewsFor } from "@/app/preview/filterLeads";
import { OWNERS } from "@/app/preview/demoData";

// Real radio buttons, hidden behind a pill. A reader sees one row of
// choices and the browser still gives them arrow keys and a screen reader
// that says "one of seven".
function ViewPill({ view, chosen, onPick }) {
  const look = chosen
    ? "bg-[#0C111D] text-white"
    : "bg-white text-[#475467] hover:bg-[#F9FAFB]";

  return (
    <label
      className={`cursor-pointer rounded-lg border border-[#E6E8EC] px-3 py-1.5 text-[13px] font-medium transition ${look}`}
    >
      <input
        type="radio"
        name="view"
        className="sr-only"
        checked={chosen}
        onChange={() => onPick(view.id)}
      />
      {view.label}
    </label>
  );
}

// Sales people only. The admin never owns an enquiry, so listing her here
// would offer a filter that always answers with nothing.
function OwnerSelect({ owner, onPick }) {
  return (
    <select
      value={owner}
      onChange={(event) => onPick(event.target.value)}
      aria-label="Filter by owner"
      className="rounded-lg border border-[#E6E8EC] bg-white px-2.5 py-1.5 text-[13px] text-[#344054]"
    >
      <option value="">Everyone</option>
      {OWNERS.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default function FilterBar({ view, owner, isAdmin, found, nextOwner, onView, onOwner }) {
  return (
    <section className="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {viewsFor(isAdmin).map((one) => (
          <ViewPill key={one.id} view={one} chosen={one.id === view} onPick={onView} />
        ))}
      </div>

      <div className="flex items-center gap-3">
        {isAdmin ? (
          <span className="rounded-lg bg-[#F5F6FF] px-2.5 py-1.5 text-[12px] text-[#3538CD]">
            Next enquiry goes to {nextOwner.name}
          </span>
        ) : null}
        <span className="text-[13px] text-[#667085]">{found} leads</span>
        {isAdmin ? <OwnerSelect owner={owner} onPick={onOwner} /> : null}
      </div>
    </section>
  );
}
