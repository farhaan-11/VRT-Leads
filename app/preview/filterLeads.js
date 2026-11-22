import { isOverdue } from "@/app/preview/demoData";

// One view at a time, never two at once. A reader who can only pick one
// thing can never land in a combination that shows nothing and gives no
// clue why.
export const VIEWS = [
  { id: "all", label: "All" },
  { id: "unassigned", label: "Not assigned", adminOnly: true },
  { id: "overdue", label: "Overdue" },
  { id: "new", label: "New" },
  { id: "follow_up", label: "Follow-up" },
  { id: "enrolled", label: "Enrolled" },
  { id: "rejected", label: "Not interested" },
];

// Nine rows fit under the cards on a normal laptop without the page
// scrolling. More rows live on the next page, which is the whole point.
export const PAGE_SIZE = 9;

export function viewsFor(isAdmin) {
  if (isAdmin) {
    return VIEWS;
  }
  return VIEWS.filter((view) => !view.adminOnly);
}

function matchesView(lead, view) {
  if (view === "all") {
    return true;
  }
  if (view === "unassigned") {
    return !lead.owner;
  }
  if (view === "overdue") {
    return isOverdue(lead);
  }
  return lead.stage === view;
}

// A sales person sees their own rows and nothing else. The rule sits here,
// in one place, so no screen can forget it.
export function leadsVisibleTo(leads, viewer) {
  if (viewer.role === "admin") {
    return leads;
  }
  return leads.filter((lead) => lead.owner === viewer.name);
}

// Late rows first, then the ones waiting longest. The top of the list is
// always the work that is slipping.
function byUrgency(first, second) {
  const firstLate = isOverdue(first) ? 0 : 1;
  const secondLate = isOverdue(second) ? 0 : 1;

  if (firstLate !== secondLate) {
    return firstLate - secondLate;
  }
  return second.waiting - first.waiting;
}

export function filterLeads(leads, view, owner) {
  const kept = leads.filter((lead) => {
    if (owner && lead.owner !== owner) {
      return false;
    }
    return matchesView(lead, view);
  });

  return [...kept].sort(byUrgency);
}

export function pageCount(total) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function pageOf(leads, page) {
  const start = (page - 1) * PAGE_SIZE;

  return leads.slice(start, start + PAGE_SIZE);
}
