import { runQuery } from "@/lib/db";
import { ownerFilter } from "@/lib/currentUser";
import { todayInNewYork } from "@/lib/dates";

// Every count arrives from MySQL as a string, and SUM answers NULL when no
// row matched at all.
function toNumber(value) {
  return Number(value) || 0;
}

// Ten counts in one pass over the table. SUM over a true-or-false test
// counts the rows that pass it, so none of these costs an extra query.
function countsSql(filter) {
  return `SELECT COUNT(*)                           AS received,
                 SUM(assigned_to IS NULL)           AS unassigned,
                 SUM(assigned_to IS NOT NULL)       AS assigned,
                 SUM(stage <> 'new')                AS contacted,
                 SUM(stage IN ('new', 'follow_up')) AS working,
                 SUM(stage = 'new')                 AS fresh,
                 SUM(stage = 'follow_up')           AS following,
                 SUM(stage = 'enrolled')            AS enrolled,
                 SUM(stage = 'rejected')            AS rejected,
                 SUM(stage = 'follow_up' AND follow_up_on < ?) AS overdue
          FROM enquiries
          WHERE ${filter.sql}`;
}

function readCounts(row) {
  return {
    received: toNumber(row?.received),
    unassigned: toNumber(row?.unassigned),
    assigned: toNumber(row?.assigned),
    contacted: toNumber(row?.contacted),
    working: toNumber(row?.working),
    fresh: toNumber(row?.fresh),
    following: toNumber(row?.following),
    enrolled: toNumber(row?.enrolled),
    rejected: toNumber(row?.rejected),
    overdue: toNumber(row?.overdue),
  };
}

export async function getDashboardCounts(user) {
  const filter = ownerFilter(user);

  // The date's ? sits before the filter's ?, so it goes in first. Swapped,
  // this returns a wrong number quietly instead of throwing.
  const params = [todayInNewYork(), ...filter.params];
  const rows = await runQuery(countsSql(filter), params);

  return readCounts(rows[0]);
}

// Money lives in enrollments, so this joins back to enquiries to ask the
// same ownership question. Only enquiries has an assigned_to column, so the
// filter text needs no table name in front of it.
export async function getRevenue(user) {
  const filter = ownerFilter(user);

  const rows = await runQuery(
    `SELECT SUM(enrollments.amount) AS revenue
     FROM enrollments
     JOIN enquiries ON enquiries.id = enrollments.enquiry_id
     WHERE ${filter.sql}`,
    filter.params
  );
  return toNumber(rows[0]?.revenue);
}

// Conversion is a share of the enquiries this viewer can see. An empty table
// would divide by zero, so that case answers 0 rather than NaN.
export function conversionPercent(counts) {
  if (counts.received === 0) {
    return 0;
  }
  return Math.round((counts.enrolled / counts.received) * 100);
}
