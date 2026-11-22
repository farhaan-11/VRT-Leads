"use client";

import { SURFACE, LABEL } from "@/app/preview/ui";
import { money, percent } from "@/app/preview/format";

// Red marks only the two numbers that mean work is being lost. Nothing else
// on the screen is red, so the eye goes there first.
function Tile({ card, onPick }) {
  const colour = card.red ? "text-[#D92D20]" : "text-[#0C111D]";
  const clickable = card.view
    ? "cursor-pointer hover:border-[#3538CD] hover:shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
    : "";

  return (
    <button
      type="button"
      disabled={!card.view}
      onClick={() => onPick(card.view)}
      className={`${SURFACE} ${clickable} flex flex-col gap-1 px-3.5 py-3 text-left transition`}
    >
      <span className={LABEL}>{card.label}</span>
      <span className={`text-[26px] font-semibold leading-none tabular-nums ${colour}`}>
        {card.value}
      </span>
      <span className="text-[11px] text-[#667085]">{card.note || " "}</span>
    </button>
  );
}

function workCards(counts) {
  return [
    { label: "Overdue follow-ups", value: counts.overdue, red: true, view: "overdue", note: "need a call today" },
    { label: "Working leads", value: counts.working, note: "still open" },
    {
      label: "Enrolled",
      value: counts.enrolled,
      view: "enrolled",
      note: `${percent(counts.enrolled, counts.total)}% of enquiries`,
    },
    { label: "Revenue", value: money(counts.revenue), view: "enrolled", note: "from enrolments" },
  ];
}

// A sales person never sees "Not assigned". Nobody owns those rows, so the
// card would always read zero, and a card stuck at zero makes a viewer doubt
// the rest of the screen.
function cardsFor(counts, isAdmin) {
  const cards = [{ label: "Total enquiries", value: counts.total, view: "all", note: "all time" }];

  if (isAdmin) {
    cards.push({
      label: "Not assigned",
      value: counts.unassigned,
      red: true,
      view: "unassigned",
      note: "waiting for an owner",
    });
  }
  return cards.concat(workCards(counts));
}

export default function StatStrip({ counts, isAdmin, onPick }) {
  const cards = cardsFor(counts, isAdmin);
  const columns = isAdmin ? "grid-cols-6" : "grid-cols-5";

  return (
    <section className={`grid ${columns} gap-3`}>
      {cards.map((card) => (
        <Tile key={card.label} card={card} onPick={onPick} />
      ))}
    </section>
  );
}
