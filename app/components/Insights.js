import {
  getAverageDaysToEnrol,
  getChannelPerformance,
  getTeamWorkload,
  getWaitingBands,
} from "@/lib/queries/insightQueries";
import { money } from "@/app/components/format";
import { SURFACE } from "@/app/components/ui";
import Donut from "@/app/components/Donut";
import Funnel from "@/app/components/Funnel";
import TeamRows from "@/app/components/TeamRows";
import ChannelTiles, { ChannelHeadline } from "@/app/components/ChannelTiles";

function Panel({ title, note, children, className = "" }) {
  return (
    <section className={`${SURFACE} flex flex-col p-3.5 ${className}`}>
      <p className="text-[14px] font-semibold text-[#0C111D]">{title}</p>
      <div className="mb-3 text-[12px] text-[#667085]">{note}</div>
      {children}
    </section>
  );
}

function MoneyLine({ label, value, strong }) {
  const size = strong ? "text-[19px] font-semibold" : "text-[14px] font-medium";

  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[13px] text-[#667085]">{label}</span>
      <span className={`tabular-nums text-[#0C111D] ${size}`}>{value}</span>
    </div>
  );
}

// The numbers row is no longer on this screen, so the money sits here. On
// its own revenue says little; next to what one member is worth, and how
// long one takes to win, it says what the next quarter has to look like.
function Money({ revenue, enrolled, days }) {
  const average = enrolled === 0 ? 0 : Math.round(revenue / enrolled);

  return (
    <div className="mt-4 space-y-2 border-t border-[#F2F4F7] pt-3">
      <MoneyLine label="Revenue" value={money(revenue)} strong />
      <MoneyLine label="Average enrolment" value={money(average)} />
      <MoneyLine label="Average time to enrol" value={`${days} days`} />
    </div>
  );
}

// Green at the top of the ring, red at the bottom. It is read like a traffic
// light, so the share of leads nobody has touched in three months is the
// thing the eye lands on first. No other screen answers this.
function Waiting({ bands, revenue, enrolled, days }) {
  const open = bands.reduce((sum, band) => sum + band.value, 0);

  return (
    <Panel
      title="How long people are waiting"
      note={`${open} open leads, by how long since the enquiry`}
      className="w-[300px] shrink-0"
    >
      <Donut parts={bands} />
      <Money revenue={revenue} enrolled={enrolled} days={days} />
    </Panel>
  );
}

// Two rows, not three. Stacked panels ran off the bottom of a laptop; side
// by side the same four answers fit the window.
export default async function Insights({ user, counts, revenue }) {
  const isAdmin = user.role === "admin";
  const bands = await getWaitingBands(user);
  const days = await getAverageDaysToEnrol(user);
  const channels = await getChannelPerformance(user);
  const team = isAdmin ? await getTeamWorkload() : [];

  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-hidden">
      <Waiting bands={bands} revenue={revenue} enrolled={counts.enrolled} days={days} />

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {isAdmin ? (
          <Panel title="Who is holding what" note="open work per sales person, busiest first">
            <TeamRows team={team} />
          </Panel>
        ) : null}

        <div className="flex min-h-0 flex-1 gap-3">
          <Panel
            title="Where people drop out"
            note={`${counts.enrolled} of ${counts.received} enquiries became members`}
            className="flex-1"
          >
            <Funnel user={user} counts={counts} />
          </Panel>

          <Panel
            title="Which channel actually pays"
            note={<ChannelHeadline channels={channels} />}
            className="w-[400px] shrink-0"
          >
            <ChannelTiles channels={channels} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
