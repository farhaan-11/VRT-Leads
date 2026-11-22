// Fixed rows for the UI preview. Nothing here touches the database, so this
// screen opens the same way every time and can never go blank while the
// owner is looking at it.

export const TODAY = "2026-11-22";

export const OWNERS = ["Priya Nair", "Marcus Hale", "Sneha Kulkarni"];

export const VIEWERS = [
  { name: "Dana Whitfield", role: "admin" },
  { name: "Priya Nair", role: "sales" },
  { name: "Marcus Hale", role: "sales" },
  { name: "Sneha Kulkarni", role: "sales" },
];

// name, company, source, owner, stage, follow-up, days waiting, amount
const ROWS = [
  ["Victor Sandoval", "Sandoval Built", "event", "Priya Nair", "follow_up", "2026-11-18", 32, 0],
  ["Rhonda Pelletier", "Pelletier HVAC", "event", "", "new", "", 68, 0],
  ["Lucille Trent", "Trent Orthodontics", "event", "Priya Nair", "new", "", 1, 0],
  ["Naomi Fulbright", "Fulbright Labs", "event", "Priya Nair", "follow_up", "2026-12-01", 17, 0],
  ["Hector Villanueva", "Villanueva Foods", "referral", "Marcus Hale", "follow_up", "2026-11-25", 38, 0],
  ["Delia Santoro", "Santoro Vineyard", "referral", "Marcus Hale", "rejected", "", 61, 0],
  ["Angela Siracusa", "Siracusa Events", "event", "Marcus Hale", "enrolled", "", 84, 12500],
  ["Darnell Boyce", "Boyce Logistics", "website", "Sneha Kulkarni", "enrolled", "", 76, 9800],
  ["Marisol Vega", "Vega Interiors", "website", "", "new", "", 12, 0],
  ["Terrence Awolowo", "Awolowo Dental", "referral", "Priya Nair", "follow_up", "2026-11-20", 44, 0],
  ["Priscilla Lamb", "Lamb and Co Law", "webinar", "Marcus Hale", "enrolled", "", 91, 15000],
  ["Owen Kirkpatrick", "Kirkpatrick Roofing", "website", "Sneha Kulkarni", "follow_up", "2026-11-27", 9, 0],
  ["Bethany Olatunji", "Olatunji Clinic", "referral", "Sneha Kulkarni", "new", "", 3, 0],
  ["Carl Hutchinson", "Hutchinson Motors", "event", "", "new", "", 21, 0],
  ["Francesca Rinaldi", "Rinaldi Bakery", "webinar", "Priya Nair", "enrolled", "", 68, 11200],
  ["Jamal Whitaker", "Whitaker Fitness", "website", "Marcus Hale", "rejected", "", 55, 0],
  ["Soledad Marquez", "Marquez Travel", "referral", "Marcus Hale", "follow_up", "2026-12-03", 14, 0],
  ["Gregory Thorne", "Thorne Accounting", "webinar", "Sneha Kulkarni", "enrolled", "", 72, 13400],
  ["Imani Baptiste", "Baptiste Salons", "website", "", "new", "", 6, 0],
  ["Rafael Okonkwo", "Okonkwo Build", "event", "Priya Nair", "follow_up", "2026-11-19", 29, 0],
  ["Heather Lindqvist", "Lindqvist Design", "referral", "Sneha Kulkarni", "new", "", 4, 0],
  ["Desmond Achebe", "Achebe Imports", "webinar", "Marcus Hale", "enrolled", "", 80, 10700],
  ["Valeria Castellanos", "Castellanos Spa", "website", "Priya Nair", "rejected", "", 48, 0],
  ["Nolan Fitzgerald", "Fitzgerald Tech", "event", "Sneha Kulkarni", "enrolled", "", 65, 14600],
];

function toLead(row, index) {
  const [name, company, source, owner, stage, followUp, waiting, amount] = row;

  return { id: index + 1, name, company, source, owner, stage, followUp, waiting, amount };
}

export const DEMO_LEADS = ROWS.map(toLead);

// Late means the promised day has already passed. Both sides are plain
// 2026-11-22 text, so comparing them as text compares them as dates.
export function isOverdue(lead) {
  if (lead.stage !== "follow_up" || !lead.followUp) {
    return false;
  }
  return lead.followUp < TODAY;
}

export function daysLate(lead) {
  const late = Date.parse(`${TODAY}T12:00:00Z`) - Date.parse(`${lead.followUp}T12:00:00Z`);

  return Math.round(late / (24 * 60 * 60 * 1000));
}

// Every number on the screen is counted from the rows on the screen. Close a
// lead in the preview and the cards move with it, the way they would live.
export function countsFor(leads) {
  const enrolled = leads.filter((lead) => lead.stage === "enrolled");

  return {
    total: leads.length,
    unassigned: leads.filter((lead) => !lead.owner).length,
    overdue: leads.filter(isOverdue).length,
    working: leads.filter((lead) => lead.stage === "new" || lead.stage === "follow_up").length,
    enrolled: enrolled.length,
    revenue: enrolled.reduce((sum, lead) => sum + lead.amount, 0),
  };
}

export function funnelFor(leads) {
  return [
    { label: "Enquiries received", value: leads.length },
    { label: "Assigned to someone", value: leads.filter((lead) => lead.owner).length },
    { label: "Contacted", value: leads.filter((lead) => lead.stage !== "new").length },
    { label: "Enrolled", value: leads.filter((lead) => lead.stage === "enrolled").length },
  ];
}

export function bySource(leads) {
  const totals = new Map();

  for (const lead of leads) {
    totals.set(lead.source, (totals.get(lead.source) || 0) + 1);
  }
  return [...totals].map(([source, count]) => ({ source, count }));
}

// Round robin by workload: the next enquiry goes to whoever is holding the
// fewest open leads. A rule people can see is a rule they trust.
export function nextOwnerFor(leads) {
  const openCounts = OWNERS.map((name) => ({
    name,
    open: leads.filter((lead) => {
      const working = lead.stage === "new" || lead.stage === "follow_up";

      return lead.owner === name && working;
    }).length,
  }));

  return openCounts.sort((first, second) => first.open - second.open)[0];
}
