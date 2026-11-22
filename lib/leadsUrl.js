// The address bar holds the whole state of this screen. A view someone is
// looking at can then be sent to someone else as a link, and the back button
// does what they expect.

// Nine rows fit under the cards on a laptop without the page scrolling.
// Whatever does not fit goes on the next page, which is the whole point.
//
// It lives here, and not with the queries, because the filter bar and the
// pager need it too and they run in the browser. lib/db.js cannot follow
// them there: mysql2 asks for node's own network modules, which a browser
// does not have.
export const PAGE_SIZE = 9;

export const VIEWS = [
  { id: "all", label: "All" },
  { id: "unassigned", label: "Not assigned", adminOnly: true },
  { id: "overdue", label: "Overdue" },
  { id: "new", label: "New" },
  { id: "follow_up", label: "Follow-up" },
  { id: "enrolled", label: "Enrolled" },
  { id: "rejected", label: "Not interested" },
];

export function viewsFor(isAdmin) {
  if (isAdmin) {
    return VIEWS;
  }
  return VIEWS.filter((view) => !view.adminOnly);
}

// One view at a time, never two. A reader who can only pick one thing can
// never land in a combination that shows nothing and gives no clue why.
export function viewOf(filters) {
  if (filters.overdue) {
    return "overdue";
  }
  if (filters.owner === "none") {
    return "unassigned";
  }
  return filters.stage || "all";
}

// "Not assigned" and the person dropdown both ask about the same column, so
// they can never both be on. Picking one clears the other.
export function ownerOf(filters) {
  if (!filters.owner || filters.owner === "none") {
    return "";
  }
  return String(filters.owner);
}

function viewPair(view) {
  if (view === "unassigned") {
    return ["owner", "none"];
  }
  if (view === "overdue") {
    return ["overdue", "1"];
  }
  if (view === "all") {
    return null;
  }
  return ["stage", view];
}

function pairsFor(view, owner, page) {
  const pairs = [viewPair(view)].filter(Boolean);

  if (view !== "unassigned" && owner) {
    pairs.push(["owner", owner]);
  }
  if (page > 1) {
    pairs.push(["page", String(page)]);
  }
  return pairs;
}

export function leadsHref({ view = "all", owner = "", page = 1 }) {
  const query = new URLSearchParams(pairsFor(view, owner, page)).toString();

  return query ? `/?${query}` : "/";
}
