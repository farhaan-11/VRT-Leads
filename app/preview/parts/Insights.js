"use client";

import { bySource, countsFor, funnelFor } from "@/app/preview/demoData";
import { percent, sourceLabel } from "@/app/preview/format";
import { SURFACE, LABEL } from "@/app/preview/ui";
import Donut from "@/app/preview/parts/Donut";
import Funnel from "@/app/preview/parts/Funnel";

const STAGE_PARTS = [
  { stage: "new", label: "New", colour: "#98A2B3" },
  { stage: "follow_up", label: "Follow-up", colour: "#F79009" },
  { stage: "enrolled", label: "Enrolled", colour: "#17B26A" },
  { stage: "rejected", label: "Not interested", colour: "#F04438" },
];

function Panel({ title, note, children, className = "" }) {
  return (
    <section className={`${SURFACE} flex flex-col p-4 ${className}`}>
      <p className={LABEL}>{title}</p>
      <p className="mb-3 text-[12px] text-[#98A2B3]">{note}</p>
      <div className="flex min-h-0 flex-1 flex-col justify-center">{children}</div>
    </section>
  );
}

function stagePartsFor(leads) {
  return STAGE_PARTS.map((part) => ({
    label: part.label,
    colour: part.colour,
    value: leads.filter((lead) => lead.stage === part.stage).length,
  }));
}

// Where the enquiries came from. A thin bar next to each number makes the
// biggest source obvious without the reader comparing digits.
function SourceRows({ leads }) {
  const rows = bySource(leads);
  const most = Math.max(...rows.map((row) => row.count));

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.source} className="flex items-center gap-3 text-[13px]">
          <span className="w-20 shrink-0 text-[#475467]">{sourceLabel(row.source)}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#F2F4F7]">
            <span
              className="block h-2 rounded-full bg-[#3538CD]"
              style={{ width: `${percent(row.count, most)}%` }}
            />
          </span>
          <span className="w-6 text-right tabular-nums text-[#0C111D]">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Insights({ leads }) {
  const counts = countsFor(leads);

  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <Panel title="Where leads stand" note="every enquiry, by stage" className="w-[320px] shrink-0">
        <Donut parts={stagePartsFor(leads)} />
      </Panel>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Panel
          title="Where people drop out"
          note={`${counts.enrolled} of ${counts.total} enquiries became members`}
          className="flex-1"
        >
          <Funnel steps={funnelFor(leads)} />
        </Panel>

        <Panel title="Where leads come from" note="which channel brings the most enquiries" className="flex-1">
          <SourceRows leads={leads} />
        </Panel>
      </div>
    </div>
  );
}
