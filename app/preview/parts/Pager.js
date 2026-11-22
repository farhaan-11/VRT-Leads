"use client";

import { PAGE_SIZE, pageCount } from "@/app/preview/filterLeads";

function rangeText(found, page) {
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, found);

  return `${first} to ${last} of ${found}`;
}

const STEP =
  "rounded-lg border border-[#E6E8EC] px-2.5 py-1 text-[13px] text-[#344054] disabled:opacity-40 enabled:hover:bg-[#F9FAFB]";

// Pages, not a scrollbar. The screen is meant to fit a laptop without
// moving, so the rows that do not fit live on the next page.
export default function Pager({ found, page, onPage }) {
  const last = pageCount(found);

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-t border-[#F2F4F7] px-4">
      <span className="text-[12px] text-[#667085]">Showing {rangeText(found, page)}</span>

      <div className="flex items-center gap-2">
        <button type="button" className={STEP} disabled={page === 1} onClick={() => onPage(page - 1)}>
          Previous
        </button>
        <span className="text-[12px] tabular-nums text-[#667085]">
          Page {page} of {last}
        </span>
        <button type="button" className={STEP} disabled={page === last} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
