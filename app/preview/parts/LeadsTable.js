"use client";

import { SURFACE, LABEL } from "@/app/preview/ui";
import LeadRow from "@/app/preview/parts/LeadRow";
import Pager from "@/app/preview/parts/Pager";
import { LoadingRows, ErrorBox, EmptyBox } from "@/app/preview/parts/TableStates";

const HEADINGS = ["Lead", "Source", "Owner", "Stage", "Next step", "Waiting", ""];

// Fixed widths, so a long company name cannot push the action button off
// the right edge and the columns stay in the same place on every page.
const WIDTHS = ["25%", "9%", "15%", "12%", "17%", "9%", "13%"];

function TableHead() {
  return (
    <thead className="bg-[#FCFCFD]">
      <tr className="h-10 border-b border-[#E6E8EC]">
        {HEADINGS.map((heading, index) => (
          <th
            key={heading || "action"}
            className={`${LABEL} px-4 text-left ${index === HEADINGS.length - 1 ? "text-right" : ""}`}
          >
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Rows({ rows, isAdmin, onOpen }) {
  return (
    <div className="flex-1">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {HEADINGS.map((heading, index) => (
            <col key={heading || "action"} style={{ width: WIDTHS[index] }} />
          ))}
        </colgroup>
        <TableHead />
        <tbody>
          {rows.map((lead) => (
            <LeadRow key={lead.id} lead={lead} isAdmin={isAdmin} onOpen={onOpen} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// One panel, four possible insides: loading, error, nothing, or the rows.
// Each one keeps the same frame, so the screen never jumps between them.
function Inside({ state, rows, isAdmin, onOpen, onRetry, onReset }) {
  if (state === "busy") {
    return <LoadingRows />;
  }
  if (state === "error") {
    return <ErrorBox onRetry={onRetry} />;
  }
  if (rows.length === 0) {
    return <EmptyBox onReset={onReset} />;
  }
  return <Rows rows={rows} isAdmin={isAdmin} onOpen={onOpen} />;
}

export default function LeadsTable({ state, rows, found, page, isAdmin, onOpen, onPage, onRetry, onReset }) {
  const showPager = state === "ready" && rows.length > 0;

  return (
    <section className={`${SURFACE} flex min-h-0 flex-1 flex-col overflow-hidden`}>
      <Inside
        state={state}
        rows={rows}
        isAdmin={isAdmin}
        onOpen={onOpen}
        onRetry={onRetry}
        onReset={onReset}
      />
      {showPager ? <Pager found={found} page={page} onPage={onPage} /> : null}
    </section>
  );
}
