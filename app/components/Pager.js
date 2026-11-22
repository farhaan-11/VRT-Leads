import Link from "next/link";
import { PAGE_SIZE } from "@/lib/queries/enquiryQueries";

const STEP = "rounded-lg border border-[#E6E8EC] px-2.5 py-1 text-[13px] text-[#344054]";

function pairsFor(filters, page) {
  return [
    ["stage", filters.stage],
    ["owner", filters.owner],
    ["source", filters.source],
    ["overdue", filters.overdue ? "1" : ""],
    ["page", page > 1 ? String(page) : ""],
  ];
}

// The pager keeps whatever filters are already set and only changes the
// page. Dropping them would quietly move the reader from page 2 of
// "overdue" to page 2 of everything, with no sign that it happened.
function hrefFor(filters, page) {
  const params = new URLSearchParams();

  for (const [name, value] of pairsFor(filters, page)) {
    if (value) {
      params.set(name, String(value));
    }
  }
  return params.toString() ? `/?${params}` : "/";
}

// A step nobody can take is still shown, in grey. A button that disappears
// at the last page makes the row jump and the reader lose their place.
function Step({ filters, page, label, enabled }) {
  if (!enabled) {
    return <span className={`${STEP} opacity-40`}>{label}</span>;
  }

  return (
    <Link href={hrefFor(filters, page)} className={`${STEP} hover:bg-[#F9FAFB]`}>
      {label}
    </Link>
  );
}

function rangeText(total, page) {
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, total);

  return `${first} to ${last} of ${total}`;
}

// Pages, not a scrollbar. The screen is meant to fit a laptop without
// moving, so the rows that do not fit live on the next page.
export default function Pager({ filters, total }) {
  const page = filters.page;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-t border-[#F2F4F7] px-4">
      <span className="text-[12px] text-[#667085]">Showing {rangeText(total, page)}</span>

      <div className="flex items-center gap-2">
        <Step filters={filters} page={page - 1} label="Previous" enabled={page > 1} />
        <span className="text-[12px] tabular-nums text-[#667085]">
          Page {page} of {lastPage}
        </span>
        <Step filters={filters} page={page + 1} label="Next" enabled={page < lastPage} />
      </div>
    </div>
  );
}
