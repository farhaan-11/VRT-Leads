import { runQuery } from "@/lib/db";

// A new enquiry goes to the sales person holding the fewest open leads.
// Closed leads are not work any more, so they are left out of the count.
//
// Routing by conversion rate was considered and rejected. The strongest
// person would take every lead and a newer person would never get a chance
// to improve. "Fewest open leads" is also one sentence a business reader
// understands at once.
const SALES_WORKLOAD_SQL = `SELECT users.id,
                                      users.name,
                                      COUNT(enquiries.id) AS open_leads
                               FROM users
                               LEFT JOIN enquiries
                                 ON enquiries.assigned_to = users.id
                                AND enquiries.stage IN ('new', 'follow_up')
                               WHERE users.role = 'sales'
                               GROUP BY users.id, users.name
                               ORDER BY COUNT(enquiries.id) ASC, users.id ASC`;

// LEFT JOIN, not JOIN. A sales person with no leads at all is exactly the
// person the next enquiry should go to, and a plain join would drop them.
//
// The id breaks a tie, so two people on the same count always answer in the
// same order instead of swapping between requests.
function toPerson(row) {
  return { id: row.id, name: row.name, openLeads: Number(row.open_leads) || 0 };
}

// Every sales person with the work they are holding, lightest first. The
// dashboard uses the list twice: the owner dropdown, and the assign box,
// where seeing the counts stops a lead going to whoever is already buried.
export async function getSalesWorkload() {
  const rows = await runQuery(SALES_WORKLOAD_SQL);

  return rows.map(toPerson);
}

// The one at the front of that list is the one the next enquiry goes to.
export async function findNextSalesPerson() {
  const people = await getSalesWorkload();

  return people[0] || null;
}
