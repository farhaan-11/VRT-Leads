"use client";

import { PAGE_SIZE } from "@/app/preview/filterLeads";
import { Button } from "@/app/preview/ui";

const ROWS = Array.from({ length: PAGE_SIZE }, (unused, index) => index);

// Grey bars in the shape of the rows that are coming. The table keeps its
// height, so nothing on the screen jumps when the real rows arrive.
export function LoadingRows() {
  return (
    <div className="flex-1">
      {ROWS.map((index) => (
        <div key={index} className="flex h-[52px] items-center gap-4 border-t border-[#F2F4F7] px-4">
          <span className="h-3 w-40 animate-pulse rounded bg-[#EAECF0]" />
          <span className="h-3 w-20 animate-pulse rounded bg-[#F2F4F7]" />
          <span className="h-3 w-28 animate-pulse rounded bg-[#F2F4F7]" />
          <span className="ml-auto h-7 w-24 animate-pulse rounded-lg bg-[#F2F4F7]" />
        </div>
      ))}
    </div>
  );
}

// An error says what happened, says that nothing was lost, and offers one
// way forward. A bare red line leaves the reader with nowhere to go.
export function ErrorBox({ onRetry }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF3F2] text-lg text-[#D92D20]">
        !
      </span>
      <p className="text-[15px] font-semibold text-[#0C111D]">Could not load the leads</p>
      <p className="max-w-sm text-[13px] text-[#667085]">
        The database did not answer. Nothing has been lost - your leads are safe.
      </p>
      <Button look="primary" className="mt-2" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

// No rows is a normal answer, not a fault. It says so plainly and offers the
// way back, because a blank panel with no words reads as broken.
export function EmptyBox({ onReset }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F4F7] text-lg text-[#667085]">
        0
      </span>
      <p className="text-[15px] font-semibold text-[#0C111D]">No leads in this view</p>
      <p className="max-w-sm text-[13px] text-[#667085]">
        Nothing matches what you picked. Everything else is still here.
      </p>
      <Button className="mt-2" onClick={onReset}>
        Show all leads
      </Button>
    </div>
  );
}
