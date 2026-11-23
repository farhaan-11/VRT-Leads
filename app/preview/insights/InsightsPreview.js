import { SURFACE } from "@/app/components/ui";
import Donut from "@/app/components/Donut";
import Funnel from "@/app/components/Funnel";
import TeamRows from "@/app/components/TeamRows";
import ChannelTiles, { ChannelHeadline } from "@/app/preview/insights/ChannelTiles";
import { CHANNELS, COUNTS, MONEY, TEAM, VIEWER, WAITING } from "@/app/preview/insights/demo";

function Panel({ title, note, children, className = "" }) {
  return (
    <section className={`${SURFACE} flex flex-col p-3.5 ${className}`}>
      <p className="text-[14px] font-semibold text-[#0C111D]">{title}</p>
      <div className="mb-3 text-[12px] text-[#667085]">{note}</div>
      {children}
    </section>
  );
}

function MoneyLines() {
  return (
    <div className="mt-4 space-y-2 border-t border-[#F2F4F7] pt-3">
      {MONEY.map((line) => (
        <div key={line.label} className="flex items-baseline justify-between">
          <span className="text-[13px] text-[#667085]">{line.label}</span>
          <span
            className={`tabular-nums text-[#0C111D] ${
              line.strong ? "text-[19px] font-semibold" : "text-[14px] font-medium"
            }`}
          >
            {line.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Green at the top, red at the bottom. The ring is read like a traffic
// light, so the share of leads nobody has touched in three months is the
// thing the eye lands on first.
function WaitingPanel() {
  const open = WAITING.reduce((sum, band) => sum + band.value, 0);

  return (
    <Panel
      title="How long people are waiting"
      note={`${open} open leads, by how long since the enquiry`}
      className="w-[300px] shrink-0"
    >
      <Donut parts={WAITING} />
      <MoneyLines />
    </Panel>
  );
}

// Two rows, not three. Stacked panels ran off the bottom of a laptop; side
// by side the same four answers fit in the window.
export default function InsightsPreview() {
  return (
    <div
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#F6F7F9] text-[#0C111D]"
      style={{ colorScheme: "light", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-dashed border-[#EAAA08] bg-[#FFFAEB] px-4 text-[11px] text-[#B54708]">
        <span className="font-semibold uppercase tracking-wide">Preview only</span>
        <span>the real Insights tab is untouched</span>
      </div>

      <main className="flex min-h-0 flex-1 gap-3 p-3">
        <WaitingPanel />

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <Panel title="Who is holding what" note="open work per sales person, busiest first">
            <TeamRows team={TEAM} />
          </Panel>

          <div className="flex min-h-0 flex-1 gap-3">
            <Panel
              title="Where people drop out"
              note={`${COUNTS.enrolled} of ${COUNTS.received} enquiries became members`}
              className="flex-1"
            >
              <Funnel user={VIEWER} counts={COUNTS} />
            </Panel>

            <Panel
              title="Which channel actually pays"
              note={<ChannelHeadline channels={CHANNELS} />}
              className="w-[400px] shrink-0"
            >
              <ChannelTiles channels={CHANNELS} />
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}
