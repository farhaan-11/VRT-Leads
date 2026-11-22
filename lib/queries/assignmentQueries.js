import { runQuery } from "@/lib/db";

// A new enquiry goes to the sales person holding the fewest open leads.
// Closed leads are not work any more, so they are left out of the count.
//
// Routing by conversion rate was considered and rejected. The strongest
// person would take every lead and a newer person would never get a chance
// to improve. "Fewest open leads" is also one sentence a business reader
// understands at once.
const NEXT_SALES_PERSON_SQL = `SELECT users.id,
                                      users.name,
                                      COUNT(enquiries.id) AS open_leads
                               FROM users
                               LEFT JOIN enquiries
                                 ON enquiries.assigned_to = users.id
                                AND enquiries.stage IN ('new', 'follow_up')
                               WHERE users.role = 'sales'
                               GROUP BY users.id, users.name
                               ORDER BY COUNT(enquiries.id) ASC, users.id ASC
                               LIMIT 1`;

// LEFT JOIN, not JOIN. A sales person with no leads at all is exactly the
// person the next enquiry should go to, and a plain join would drop them.
//
// The id breaks a tie, so two people on the same count always answer in the
// same order instead of swapping between requests.
export async function findNextSalesPerson() {
  const rows = await runQuery(NEXT_SALES_PERSON_SQL);
  const row = rows[0];

  if (!row) {
    return null;
  }
  return { id: row.id, name: row.name, openLeads: Number(row.open_leads) || 0 };
}
