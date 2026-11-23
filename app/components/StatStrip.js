import { leadsHref } from "@/lib/leadsUrl";
import { conversionPercent } from "@/lib/queries/dashboardQueries";
import { money } from "@/app/components/format";
import { SURFACE, LABEL } from "@/app/components/ui";
import { Icon } from "@/app/components/icons";
import { NavLink } from "@/app/components/Nav";

// Three tones give the strip a shape the eye can read in a second. A red
// strip and red number mark a card where work is being lost. A soft indigo
// tint marks good news. Neutral is everything else.
const TONES = {
  warning: {
    card: "border-l-4 border-l-[#D92D20]",
    icon: "text-[#D92D20]",
    value: "text-[#D92D20]",
  },
  positive: {
    card: "bg-gradient-to-br from-white to-[#F5F6FF]",
    icon: "text-[#3538CD]",
    value: "text-[#0C111D]",
  },
  neutral: {
    card: "",
    icon: "text-[#98A2B3]",
    value: "text-[#0C111D]",
  },
};

const TILE_BASE = `${SURFACE} flex flex-col gap-1.5 px-4 py-3.5 text-left`;

// Only tiles that link to the list lift on hover. A static tile that moves
// looks clickable and is not.
const TILE_LINK = "transition hover:-translate-y-0.5 hover:shadow-md hover:border-[#3538CD]";

function Body({ card, tone }) {
  return (
    <>
      <span className="flex items-center gap-2">
        <Icon name={card.icon} className={`h-4 w-4 ${tone.icon}`} />
        <span className={LABEL}>{card.label}</span>
      </span>
      <span className={`text-[32px] font-semibold leading-none tabular-nums ${tone.value}`}>
        {card.value}
      </span>
      <span className="text-[12px] text-[#667085]">{card.note || " "}</span>
    </>
  );
}

function Tile({ card }) {
  const tone = TONES[card.tone || "neutral"];

  if (!card.view) {
    return (
      <div className={`${TILE_BASE} ${tone.card}`}>
        <Body card={card} tone={tone} />
      </div>
    );
  }

  return (
    <NavLink href={leadsHref({ view: card.view })} className={`${TILE_BASE} ${TILE_LINK} ${tone.card}`}>
      <Body card={card} tone={tone} />
    </NavLink>
  );
}

function workCards(counts, revenue) {
  return [
    {
      label: "Overdue follow-ups",
      value: counts.overdue,
      tone: "warning",
      icon: "clock",
      view: "overdue",
      note: "need a call today",
    },
    {
      label: "Working leads",
      value: counts.working,
      icon: "briefcase",
      note: "still open",
    },
    {
      label: "Enrolled",
      value: counts.enrolled,
      tone: "positive",
      icon: "check",
      view: "enrolled",
      note: `${conversionPercent(counts)}% of enquiries`,
    },
    {
      label: "Revenue",
      value: money(revenue),
      tone: "positive",
      icon: "dollar",
      view: "enrolled",
      note: "from enrolments",
    },
  ];
}

// A sales person never sees "Not assigned". Nobody owns those rows, so the
// tile would always read zero, and a number stuck at zero makes a viewer
// doubt the rest of the screen.
function cardsFor(user, counts, revenue) {
  const cards = [
    {
      label: "Total enquiries",
      value: counts.received,
      icon: "inbox",
      view: "all",
      note: "all time",
    },
  ];

  if (user.role === "admin") {
    cards.push({
      label: "Not assigned",
      value: counts.unassigned,
      tone: "warning",
      icon: "userX",
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
