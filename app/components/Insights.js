import { getChannelPerformance, getTeamWorkload } from "@/lib/queries/insightQueries";
import { money } from "@/app/components/format";
import { SURFACE } from "@/app/components/ui";
import Donut from "@/app/components/Donut";
import Funnel from "@/app/components/Funnel";
import ChannelRows from "@/app/components/ChannelRows";
import TeamRows from "@/app/components/TeamRows";

const STAGE_PARTS = [
  { key: "fresh", label: "New", colour: "#98A2B3" },
  { key: "following", label: "Follow-up", colour: "#F79009" },
  { key: "enrolled", label: "Enrolled", colour: "#17B26A" },
  { key: "rejected", label: "Not interested", colour: "#F04438" },
];

function Panel({ title, note, className = "", children }) {
  return (
    <section className={`${SURFACE} flex flex-col p-4 ${className}`}>
      <p className="text-[15px] font-semibold text-[#0C111D]">{title}</p>
      <p className="mb-4 text-[12px] text-[#667085]">{note}</p>
      {children}
    </section>
  );
}

function stagePartsFor(counts) {
  return STAGE_PARTS.map((part) => ({
    label: part.label,
    colour: part.colour,
    value: counts[part.key],
  }));
}

function MoneyLine({ label, value, strong }) {
  const size = strong ? "text-[20px] font-semibold" : "text-[14px] font-medium";

  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[13px] text-[#667085]">{label}</span>
      <span className={`tabular-nums text-[#0C111D] ${size}`}>{value}</span>
    </div>
  );
}

// The money sits under the ring because the numbers row is no longer on this
// screen. Revenue on its own says little; next to what one member is worth
// it says how many more VRT needs.
function Money({ revenue, enrolled }) {
  const average = enrolled === 0 ? 0 : Math.round(revenue / enrolled);

  return (
    <div className="mt-5 space-y-2 border-t border-[#F2F4F7] pt-4">
      <MoneyLine label="Revenue" value={money(revenue)} strong />
      <MoneyLine label="Average enrolment" value={money(average)} />
    </div>
  );
}

// This screen asks its own questions of the database. The leads list needs
// none of these answers, so none of them is fetched until this tab is open.
export default async function Insights({ user, counts, revenue }) {
  const isAdmin = user.role === "admin";
  const channels = await getChannelPerformance(user);
  const team = isAdmin ? await getTeamWorkload() : [];

  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-y-auto">
      <Panel title="Where leads stand" note="every enquiry, by stage" className="w-[310px] shrink-0">
        <Donut parts={stagePartsFor(counts)} />
        <Money revenue={revenue} enrolled={counts.enrolled} />
      </Panel>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Panel
          title="Where people drop out"
          note={`${counts.enrolled} of ${counts.received} enquiries became members`}
        >
          <Funnel user={user} counts={counts} />
        </Panel>

        <Panel
          title="Which channel actually pays"
          note="how many each channel brought, and how many of them signed"
        >
          <ChannelRows channels={channels} />
        </Panel>

        {isAdmin ? (
          <Panel
            title="Who is holding what"
            note="open work per sales person, busiest first"
          >
            <TeamRows team={team} />
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
