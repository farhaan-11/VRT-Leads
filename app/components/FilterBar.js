"use client";

import { viewsFor } from "@/lib/leadsUrl";

// A real radio button behind a pill. The reader sees one row of choices, and
// the browser still gives them arrow keys and a screen reader that says
// "one of seven".
function ViewPill({ view, chosen, onPick }) {
  const look = chosen
    ? "bg-[#0C111D] text-white border-[#0C111D] shadow-sm"
    : "bg-white text-[#475467] border-[#E6E8EC] hover:bg-[#F9FAFB]";

  return (
    <label
      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${look}`}
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
function OwnerSelect({ owners, owner, onPick }) {
  return (
    <select
      value={owner}
      onChange={(event) => onPick(event.target.value)}
      aria-label="Filter by owner"
      className="rounded-lg border border-[#E6E8EC] bg-white px-2.5 py-1.5 text-[13px] text-[#344054]"
    >
      <option value="">Everyone</option>
      {owners.map((person) => (
        <option key={person.id} value={person.id}>
          {person.name}
        </option>
      ))}
    </select>
  );
}

// A rule people can see is a rule they trust. Admin only: how much work each
// sales person is holding is VRT's own business, not a teammate's.
function NextInLine({ owner }) {
  if (!owner) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#C7D7FE] bg-[#F5F6FF] px-2.5 py-1.5 text-[12px] font-medium text-[#3538CD]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#3538CD]" />
      Next enquiry goes to {owner.name}
    </span>
  );
}

export default function FilterBar({ view, owner, isAdmin, owners, nextOwner, total, onView, onOwner }) {
  return (
    <section className="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {viewsFor(isAdmin).map((one) => (
          <ViewPill key={one.id} view={one} chosen={one.id === view} onPick={onView} />
        ))}
      </div>

      <div className="flex items-center gap-3">
        {isAdmin ? <NextInLine owner={nextOwner} /> : null}
        <span className="text-[13px] text-[#667085]">{total} leads</span>
        {isAdmin ? <OwnerSelect owners={owners} owner={owner} onPick={onOwner} /> : null}
      </div>
    </section>
  );
}
