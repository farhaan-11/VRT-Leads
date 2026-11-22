import Link from "next/link";

const STAGE_OPTIONS = [
  { value: "", label: "All stages" },
  { value: "new", label: "New" },
  { value: "follow_up", label: "Follow-up" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

const SELECT_STYLE = "rounded border border-slate-300 px-2 py-1 text-sm";

// A chip clears whatever else was set. One rule, so nobody lands in a
// combination that shows no rows and gives no clue why.
function chipsFor(user) {
  const chips = [{ label: "All", href: "/" }];

  if (user.role === "admin") {
    chips.push({ label: "Not assigned", href: "/?owner=none" });
  }
  chips.push({ label: "Overdue", href: "/?overdue=1" });

  return chips;
}

function Chip({ label, href, active }) {
  const look = active
    ? "bg-slate-900 text-white"
    : "bg-white text-slate-600 hover:border-slate-400";

  return (
    <Link
      href={href}
      className={`rounded-full border border-slate-300 px-3 py-1 text-xs ${look}`}
    >
      {label}
    </Link>
  );
}

// The "All" chip lights up only when nothing at all is set.
function activeChipHref(filters) {
  if (filters.overdue) {
    return "/?overdue=1";
  }
  if (filters.owner === "none") {
    return "/?owner=none";
  }
  if (filters.stage || filters.owner || filters.source) {
    return "";
  }
  return "/";
}

function Chips({ user, filters }) {
  const active = activeChipHref(filters);

  return chipsFor(user).map((chip) => (
    <Chip
      key={chip.label}
      label={chip.label}
      href={chip.href}
      active={chip.href === active}
    />
  ));
}

function StageSelect({ value }) {
  return (
    <select name="stage" defaultValue={value} className={SELECT_STYLE}>
      {STAGE_OPTIONS.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Sales people only. The admin is never an owner of an enquiry, so listing
// her here would offer a filter that always answers with nothing.
function OwnerSelect({ viewers, value }) {
  const salesPeople = viewers.filter((one) => one.role === "sales");

  return (
    <select name="owner" defaultValue={String(value)} className={SELECT_STYLE}>
      <option value="">All owners</option>
      <option value="none">Nobody yet</option>
      {salesPeople.map((person) => (
        <option key={person.id} value={person.id}>
          {person.name}
        </option>
      ))}
    </select>
  );
}

function SourceSelect({ sources, value }) {
  return (
    <select name="source" defaultValue={value} className={SELECT_STYLE}>
      <option value="">All sources</option>
      {sources.map((row) => (
        <option key={row.source} value={row.source}>
          {row.source}
        </option>
      ))}
    </select>
  );
}

// A plain GET form. The browser writes the chosen values into the URL by
// itself, which is where this screen keeps its filters anyway, so no
// JavaScript is needed to make it work.
//
// A sales person gets no owner dropdown. They only ever see their own rows,
// and offering the choice would suggest otherwise.
function FilterForm({ user, viewers, sources, filters }) {
  return (
    <form method="get" action="/" className="flex flex-wrap items-center gap-2">
      <StageSelect value={filters.stage} />
      {user.role === "admin" ? (
        <OwnerSelect viewers={viewers} value={filters.owner} />
      ) : null}
      <SourceSelect sources={sources} value={filters.source} />

      <button
        type="submit"
        className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white"
      >
        Filter
      </button>
    </form>
  );
}

export default function EnquiryFilters({ user, viewers, sources, filters }) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Chips user={user} filters={filters} />
      </div>

      <FilterForm
        user={user}
        viewers={viewers}
        sources={sources}
        filters={filters}
      />
    </section>
  );
}
