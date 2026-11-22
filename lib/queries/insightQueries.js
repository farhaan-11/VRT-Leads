import { runQuery } from "@/lib/db";
import { ownerFilter } from "@/lib/currentUser";
import { todayInNewYork } from "@/lib/dates";

// SUM over a true-or-false test counts the rows that pass it, and answers
// NULL when no row matched at all.
function toNumber(value) {
  return Number(value) || 0;
}

// How many a channel brought is only half the question. How many of those
// paid is the half that decides where VRT spends next year.
//
// LEFT JOIN, so a channel with no enrolments still appears - reading zero is
// exactly the thing worth seeing about it.
function channelSql(filter) {
  return `SELECT enquiries.source,
                 COUNT(*)                            AS total,
                 SUM(enquiries.stage = 'enrolled')   AS enrolled,
                 SUM(enrollments.amount)             AS revenue
          FROM enquiries
          LEFT JOIN enrollments ON enrollments.enquiry_id = enquiries.id
          WHERE ${filter.sql}
            AND enquiries.source IS NOT NULL
            AND enquiries.source <> ''
          GROUP BY enquiries.source
          ORDER BY COUNT(*) DESC, enquiries.source ASC`;
}

function toChannel(row) {
  return {
    source: row.source,
    total: toNumber(row.total),
    enrolled: toNumber(row.enrolled),
    revenue: toNumber(row.revenue),
  };
}

export async function getChannelPerformance(user) {
  const filter = ownerFilter(user);
  const rows = await runQuery(channelSql(filter), filter.params);

  return rows.map(toChannel);
}

// What each sales person is carrying. Busiest first, because the point of
// this panel is to show where the work has piled up.
//
// No owner filter here. Only the admin is ever shown this panel, and a
// filtered version would quietly read as the whole team.
const TEAM_SQL = `SELECT users.id,
                         users.name,
                         SUM(enquiries.stage IN ('new', 'follow_up')) AS open_leads,
                         SUM(enquiries.stage = 'follow_up'
                             AND enquiries.follow_up_on < ?)          AS overdue,
                         SUM(enquiries.stage = 'enrolled')            AS enrolled,
                         COUNT(enquiries.id)                          AS total,
                         SUM(enrollments.amount)                      AS revenue
                  FROM users
                  LEFT JOIN enquiries ON enquiries.assigned_to = users.id
                  LEFT JOIN enrollments ON enrollments.enquiry_id = enquiries.id
                  WHERE users.role = 'sales'
                  GROUP BY users.id, users.name
                  ORDER BY SUM(enquiries.stage IN ('new', 'follow_up')) DESC,
                           users.name ASC`;

function toTeamMember(row) {
  return {
    id: row.id,
    name: row.name,
    open: toNumber(row.open_leads),
    overdue: toNumber(row.overdue),
    enrolled: toNumber(row.enrolled),
    total: toNumber(row.total),
    revenue: toNumber(row.revenue),
  };
}

export async function getTeamWorkload() {
  const rows = await runQuery(TEAM_SQL, [todayInNewYork()]);

  return rows.map(toTeamMember);
}
