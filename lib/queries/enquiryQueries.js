import { runQuery, runPagedQuery } from "@/lib/db";
import { ownerFilter } from "@/lib/currentUser";
import { todayInNewYork } from "@/lib/dates";
import { PAGE_SIZE } from "@/lib/leadsUrl";

const STAGES = ["new", "follow_up", "enrolled", "rejected"];

// Next hands back an array when the same name appears twice in the URL.
function firstValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
}

// Only the four stages the column allows. A made-up stage would show an
// empty table and never say why, so it is dropped instead.
function pickStage(value) {
  const stage = firstValue(value);

  if (STAGES.includes(stage)) {
    return stage;
  }
  return "";
}

// "none" means nobody owns the row. A number means that sales person.
function pickOwner(value) {
  const owner = firstValue(value);
  if (owner === "none") {
    return "none";
  }

  const id = Number(owner);
  if (Number.isInteger(id) && id > 0) {
    return id;
  }
  return "";
}

// Source is free text in the table, so there is no list to check against.
// The value still goes in through a ?, and a source nobody used answers with
// no rows, which the screen explains.
function pickSource(value) {
  return firstValue(value).trim().slice(0, 50);
}

// Page 1 whenever anything else arrives. A typed page number is not worth
// an error screen, and the first page is always a correct answer.
function pickPage(value) {
  const page = Number(firstValue(value));

  if (Number.isInteger(page) && page > 0) {
    return page;
  }
  return 1;
}

export function readFilters(searchParams = {}) {
  return {
    page: pickPage(searchParams.page),
    stage: pickStage(searchParams.stage),
    owner: pickOwner(searchParams.owner),
    source: pickSource(searchParams.source),
    overdue: firstValue(searchParams.overdue) === "1",
  };
}

function addStage(filters, parts, values) {
  if (!filters.stage) {
    return;
  }

  parts.push("enquiries.stage = ?");
  values.push(filters.stage);
}

function addOwner(filters, parts, values) {
  if (filters.owner === "none") {
    parts.push("enquiries.assigned_to IS NULL");
    return;
  }
  if (!filters.owner) {
    return;
  }

  parts.push("enquiries.assigned_to = ?");
  values.push(filters.owner);
}

function addSource(filters, parts, values) {
  if (!filters.source) {
    return;
  }

  parts.push("enquiries.source = ?");
  values.push(filters.source);
}

// follow_up_on is NULL on every other stage, and NULL < date is never true,
// so the stage test here is for the reader more than for the database.
function addOverdue(filters, parts, values) {
  if (!filters.overdue) {
    return;
  }

  parts.push("(enquiries.stage = 'follow_up' AND enquiries.follow_up_on < ?)");
  values.push(todayInNewYork());
}

// I build the text and its values together. Built apart they drift, and a
// value in the wrong place returns wrong rows without ever throwing.
//
// The role rule goes in first and is never optional. Everything after it can
// only narrow the result further.
function buildWhere(user, filters) {
  const roleRule = ownerFilter(user);
  const parts = [roleRule.sql];
  const values = [...roleRule.params];

  addStage(filters, parts, values);
  addOwner(filters, parts, values);
  addSource(filters, parts, values);
  addOverdue(filters, parts, values);

  return { sql: parts.join(" AND "), values };
}

// follow_up_on is asked for as text on purpose. mysql2 turns a DATE into a
// JavaScript Date at UTC midnight, and printing that in New York would show
// the day before.
const COLUMNS = `enquiries.id,
                 enquiries.first_name,
                 enquiries.last_name,
                 enquiries.email,
                 enquiries.company,
                 enquiries.source,
                 enquiries.stage,
                 enquiries.created_at,
                 DATE_FORMAT(enquiries.follow_up_on, '%Y-%m-%d') AS follow_up_on,
                 users.name AS owner_name,
                 enrollments.amount`;

// Overdue rows first, then rows nobody owns, then newest. A new enquiry is
// safe; a forgotten one is not.
const ORDER_BY = `ORDER BY
  (enquiries.stage = 'follow_up' AND enquiries.follow_up_on < ?) DESC,
  (enquiries.assigned_to IS NULL) DESC,
  enquiries.created_at DESC`;

// LEFT JOIN, not JOIN. A plain join would quietly drop every row nobody owns,
// which is exactly the backlog this screen exists to show.
export async function getEnquiryList(user, filters) {
  const where = buildWhere(user, filters);

  const offset = (filters.page - 1) * PAGE_SIZE;

  // The values follow the same order the question is written in: the WHERE
  // ones, then the one in ORDER BY, then the two in LIMIT.
  const values = [...where.values, todayInNewYork(), PAGE_SIZE, offset];

  return runPagedQuery(
    `SELECT ${COLUMNS}
     FROM enquiries
     LEFT JOIN users ON users.id = enquiries.assigned_to
     LEFT JOIN enrollments ON enrollments.enquiry_id = enquiries.id
     WHERE ${where.sql}
     ${ORDER_BY}
     LIMIT ? OFFSET ?`,
    values
  );
}

// The pager has to know how many rows the filters match in all, not how
// many are on this page. Same WHERE, so the two can never disagree.
export async function countEnquiries(user, filters) {
  const where = buildWhere(user, filters);
  const rows = await runQuery(
    `SELECT COUNT(*) AS total FROM enquiries WHERE ${where.sql}`,
    where.values
  );

  return Number(rows[0].total);
}

// Only the sources that exist, so the dropdown never offers one with no rows
// behind it.
export async function getSources() {
  return runQuery(
    `SELECT DISTINCT source
     FROM enquiries
     WHERE source IS NOT NULL AND source <> ''
     ORDER BY source ASC`
  );
}
