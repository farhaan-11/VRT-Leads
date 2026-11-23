import { leadsHref } from "@/lib/leadsUrl";
import { conversionPercent } from "@/lib/queries/dashboardQueries";
import { money } from "@/app/components/format";
import { SURFACE, LABEL } from "@/app/components/ui";
import { NavLink } from "@/app/components/Nav";

const TILE = `${SURFACE} flex flex-col gap-1 px-3.5 py-3 text-left`;

// Red marks only the two numbers that mean work is being lost. Nothing else
// on this screen is red, so the eye goes there first.
function Body({ card }) {
  const colour = card.red ? "text-[#D92D20]" : "text-[#0C111D]";

  return (
    <>
      <span className={LABEL}>{card.label}</span>
      <span className={`text-[26px] font-semibold leading-none tabular-nums ${colour}`}>
        {card.value}
      </span>
      <span className="text-[11px] text-[#667085]">{card.note || "\u00A0"}</span>
    </>
  );
}

// A number is not only something to read. Most of these land on the rows
// they counted, which is where the work actually starts.
function Tile({ card }) {
  if (!card.view) {
    return (
      <div className={TILE}>
        <Body card={card} />
      </div>
    );
  }

  return (
    <NavLink href={leadsHref({ view: card.view })} className={`${TILE} hover:border-[#3538CD]`}>
      <Body card={card} />
    </NavLink>
  );
}

function workCards(counts, revenue) {
  return [
    { label: "Overdue follow-ups", value: counts.overdue, red: true, view: "overdue", note: "need a call today" },
    { label: "Working leads", value: counts.working, note: "still open" },
    {
      label: "Enrolled",
      value: counts.enrolled,
      view: "enrolled",
      note: `${conversionPercent(counts)}% of enquiries`,
    },
    { label: "Revenue", value: money(revenue), view: "enrolled", note: "from enrolments" },
  ];
}

// A sales person never sees "Not assigned". Nobody owns those rows, so the
// tile would always read zero, and a number stuck at zero makes a viewer
// doubt the rest of the screen.
function cardsFor(user, counts, revenue) {
  const cards = [{ label: "Total enquiries", value: counts.received, view: "all", note: "all time" }];

  if (user.role === "admin") {
    cards.push({
      label: "Not assigned",
      value: counts.unassigned,
      red: true,
      view: "unassigned",
      note: "waiting for an owner",
    });
  }
  return cards.concat(workCards(counts, revenue));
}

export default function StatStrip({ user, counts, revenue }) {
  const cards = cardsFor(user, counts, revenue);
  const columns = user.role === "admin" ? "grid-cols-6" : "grid-cols-5";

  return (
    <section className={`grid shrink-0 ${columns} gap-3`}>
      {cards.map((card) => (
        <Tile key={card.label} card={card} />
      ))}
    </section>
  );
}
