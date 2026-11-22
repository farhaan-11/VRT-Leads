"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { leadsHref, ownerOf, viewOf, PAGE_SIZE } from "@/lib/leadsUrl";
import { SURFACE } from "@/app/components/ui";
import FilterBar from "@/app/components/FilterBar";

const SKELETON_ROWS = Array.from({ length: PAGE_SIZE }, (unused, index) => index);

// Grey bars in the shape of the rows that are coming. The panel keeps its
// height, so nothing on the screen jumps when the real rows arrive.
function LoadingRows() {
  return (
    <section className={`${SURFACE} min-h-0 flex-1 overflow-hidden`}>
      {SKELETON_ROWS.map((index) => (
        <div
          key={index}
          className="flex h-[52px] items-center gap-4 border-t border-[#F2F4F7] px-4 first:border-t-0"
        >
          <span className="h-3 w-40 animate-pulse rounded bg-[#EAECF0]" />
          <span className="h-3 w-20 animate-pulse rounded bg-[#F2F4F7]" />
          <span className="h-3 w-28 animate-pulse rounded bg-[#F2F4F7]" />
          <span className="ml-auto h-7 w-20 animate-pulse rounded-lg bg-[#F2F4F7]" />
        </div>
      ))}
    </section>
  );
}

// The filters and the table live together here because they share one thing:
// whether the next set of rows has arrived yet. The table itself is still
// built on the server and handed in as children.
export default function LeadsScreen({ filters, isAdmin, owners, nextOwner, total, children }) {
  const router = useRouter();
  const [waiting, startTransition] = useTransition();
  const view = viewOf(filters);
  const owner = ownerOf(filters);

  // What the reader just clicked, kept only until the server answers. The
  // pill has to light up at once; waiting for the rows first makes the click
  // feel ignored. Once the rows are here the address bar is the truth again.
  const [picked, setPicked] = useState(null);
  const shown = waiting && picked ? picked : { view, owner };

  // Any change starts again at page 1. Staying on page 4 after a filter
  // change lands the reader on an empty page for no reason they can see.
  function go(next) {
    const wanted = { view, owner, ...next, page: 1 };

    // "Not assigned" and the person dropdown ask about the same column, so
    // they can never both be on. Whichever one was just clicked wins.
    if (next.owner && wanted.view === "unassigned") {
      wanted.view = "all";
    }
    if (next.view === "unassigned") {
      wanted.owner = "";
    }
    setPicked(wanted);
    startTransition(() => router.push(leadsHref(wanted)));
  }

  return (
    <>
      <FilterBar
        view={shown.view}
        owner={shown.owner}
        isAdmin={isAdmin}
        owners={owners}
        nextOwner={nextOwner}
        total={total}
        onView={(picked) => go({ view: picked })}
        onOwner={(picked) => go({ owner: picked })}
      />

      {waiting ? <LoadingRows /> : children}
    </>
  );
}
