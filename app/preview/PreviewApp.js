"use client";

import { countsFor, nextOwnerFor, VIEWERS } from "@/app/preview/demoData";
import { filterLeads, leadsVisibleTo, pageOf } from "@/app/preview/filterLeads";
import usePreview from "@/app/preview/usePreview";
import TopBar from "@/app/preview/parts/TopBar";
import DemoStrip from "@/app/preview/parts/DemoStrip";
import StatStrip from "@/app/preview/parts/StatStrip";
import FilterBar from "@/app/preview/parts/FilterBar";
import LeadsTable from "@/app/preview/parts/LeadsTable";
import Insights from "@/app/preview/parts/Insights";
import ActionModal from "@/app/preview/parts/ActionModal";

// A real filter change goes to the server and takes a moment. The preview
// waits the same short moment, so the owner can judge what that wait looks
// like instead of imagining it.
const WAIT_IN_MS = 350;

function whichState(state) {
  if (state.force === "error") {
    return "error";
  }
  if (state.force === "busy" || state.busy) {
    return "busy";
  }
  return "ready";
}

function replaceLead(leads, id, patch) {
  return leads.map((lead) => {
    if (lead.id !== id) {
      return lead;
    }
    return { ...lead, ...patch };
  });
}

export default function PreviewApp() {
  const [state, change] = usePreview();

  const mine = leadsVisibleTo(state.leads, state.viewer);
  const found = state.force === "empty" ? [] : filterLeads(mine, state.view, state.owner);
  const isAdmin = state.viewer.role === "admin";

  // Every change that re-runs the query shows the wait, so the screen never
  // sits with stale rows while new ones are on the way.
  function reload(patch) {
    change({ ...patch, page: 1, busy: true, force: "none" });
    setTimeout(() => change({ busy: false }), WAIT_IN_MS);
  }

  function pickViewer(name) {
    const chosen = VIEWERS.find((one) => one.name === name);

    reload({ viewer: chosen, view: "all", owner: "" });
  }

  function saveLead(patch) {
    change({
      leads: replaceLead(state.leads, state.openLead.id, patch),
      openLead: null,
      openKind: "",
    });
  }

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#F6F7F9] text-[#0C111D]"
      style={{ colorScheme: "light", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <DemoStrip force={state.force} onPick={(force) => change({ force, page: 1 })} />
      <TopBar
        viewer={state.viewer}
        tab={state.tab}
        onTab={(tab) => change({ tab })}
        onViewer={pickViewer}
      />

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <StatStrip counts={countsFor(mine)} isAdmin={isAdmin} onPick={(view) => reload({ view })} />

        {state.tab === "insights" ? (
          <Insights leads={mine} />
        ) : (
          <>
            <FilterBar
              view={state.view}
              owner={state.owner}
              isAdmin={isAdmin}
              found={found.length}
              nextOwner={nextOwnerFor(mine)}
              onView={(view) => reload({ view })}
              onOwner={(owner) => reload({ owner })}
            />
            <LeadsTable
              state={whichState(state)}
              rows={pageOf(found, state.page)}
              found={found.length}
              page={state.page}
              isAdmin={isAdmin}
              onOpen={(lead, kind) => change({ openLead: lead, openKind: kind })}
              onPage={(page) => change({ page })}
              onRetry={() => reload({})}
              onReset={() => reload({ view: "all", owner: "" })}
            />
          </>
        )}
      </main>

      {state.openLead ? (
        <ActionModal
          lead={state.openLead}
          kind={state.openKind}
          leads={state.leads}
          onSave={saveLead}
          onClose={() => change({ openLead: null, openKind: "" })}
        />
      ) : null}
    </div>
  );
}
