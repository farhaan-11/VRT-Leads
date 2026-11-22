import Link from "next/link";
import { conversionPercent } from "@/lib/queries/dashboardQueries";

const CARD_STYLE = "block rounded border border-slate-200 p-4";

// US dollars with no cents. Every seeded amount is a whole number, and cents
// across six cards only make the row harder to read.
function formatMoney(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

// Red marks the two numbers that mean work is being lost. Nothing else on
// this screen is red, so the eye goes there first.
function CardBody({ label, value, note, red }) {
  return (
    <>
      <p className="h-8 text-xs uppercase leading-tight tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`text-3xl font-semibold ${red ? "text-red-600" : ""}`}>
        {value}
      </p>
      <p className="h-4 text-xs text-slate-500">{note}</p>
    </>
  );
}

// A number is not only something to read. Three of these land on the rows
// they counted, which is where the work actually starts.
function StatCard({ label, value, note, red, href }) {
  const body = <CardBody label={label} value={value} note={note} red={red} />;

  if (!href) {
    return <div className={CARD_STYLE}>{body}</div>;
  }
  return (
    <Link href={href} className={`${CARD_STYLE} hover:border-slate-500`}>
      {body}
    </Link>
  );
}

function notAssignedCard(counts) {
  return {
    label: "Not assigned yet",
    value: counts.unassigned,
    red: true,
    href: "/?owner=none",
  };
}

// The four cards every viewer sees, in the order VRT reads them.
function workCards(counts, revenue) {
  return [
    {
      label: "Overdue follow-ups",
      value: counts.overdue,
      red: true,
      href: "/?overdue=1",
    },
    { label: "Working leads", value: counts.working },
    {
      label: "Enrolled",
      value: counts.enrolled,
      note: `${conversionPercent(counts)}% conversion`,
      href: "/?stage=enrolled",
    },
    { label: "Revenue", value: formatMoney(revenue) },
  ];
}

// A sales person never sees "Not assigned". Nobody owns those rows, so the
// card would always read zero, and a card stuck at zero makes a viewer doubt
// the rest of the screen.
function cardsFor(user, counts, revenue) {
  const cards = [{ label: "Total enquiries", value: counts.received, href: "/" }];

  if (user.role === "admin") {
    cards.push(notAssignedCard(counts));
  }
  return cards.concat(workCards(counts, revenue));
}

export default function StatCards({ user, counts, revenue }) {
  const cards = cardsFor(user, counts, revenue);

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          note={card.note}
          red={card.red}
          href={card.href}
        />
      ))}
    </section>
  );
}
