"use client";

import { VIEWERS } from "@/app/preview/demoData";
import { Avatar } from "@/app/preview/ui";

const TABS = [
  { id: "leads", label: "Leads" },
  { id: "insights", label: "Insights" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3538CD] text-[11px] font-bold text-white">
        VR
      </span>
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-white">VRT Leads</p>
        <p className="text-[11px] text-[#98A2B3]">VEGA programme</p>
      </div>
    </div>
  );
}

// Two screens, one bar. The table is the work and the charts are the
// picture, so they sit side by side rather than stacked on one long page.
function Tabs({ tab, onPick }) {
  return (
    <div className="flex rounded-lg bg-[#1D2432] p-0.5">
      {TABS.map((one) => {
        const chosen = tab === one.id;

        return (
          <button
            key={one.id}
            type="button"
            onClick={() => onPick(one.id)}
            className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition ${
              chosen ? "bg-white text-[#0C111D]" : "text-[#98A2B3] hover:text-white"
            }`}
          >
            {one.label}
          </button>
        );
      })}
    </div>
  );
}

// Changing the viewer changes the screen at once. A dropdown that needed a
// second button to take effect made the reader wonder whether it worked.
function ViewAs({ viewer, onPick }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={viewer.name} />
      <select
        value={viewer.name}
        onChange={(event) => onPick(event.target.value)}
        aria-label="View as"
        className="rounded-lg border border-[#2A3344] bg-[#161C28] px-2.5 py-1.5 text-[13px] text-white"
      >
        {VIEWERS.map((one) => (
          <option key={one.name} value={one.name}>
            {one.name} - {one.role}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TopBar({ viewer, tab, onTab, onViewer }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 bg-[#0C111D] px-4">
      <div className="flex items-center gap-6">
        <Brand />
        <Tabs tab={tab} onPick={onTab} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-[#3538CD] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#2D31A6]"
        >
          New enquiry
        </button>
        <ViewAs viewer={viewer} onPick={onViewer} />
      </div>
    </header>
  );
}
