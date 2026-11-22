import { runQuery } from "@/lib/db";
import { findNextSalesPerson } from "@/lib/queries/assignmentQueries";

// What each column can hold. MySQL in strict mode throws on a longer value,
// and that reaches the visitor as a blank error page instead of a sentence
// telling them which field to shorten.
const MAX_LENGTH = {
  first_name: 60,
  last_name: 60,
  email: 150,
  phone: 30,
  job_title: 80,
  company: 150,
  company_size: 20,
  state: 2,
  source: 50,
  message: 2000,
};

const REQUIRED_FIELDS = ["first_name", "last_name", "email"];

// The four channels the form offers. The API route takes the same four, so
// one typo on a landing page cannot invent a fifth row in the dashboard's
// source table.
const SOURCES = ["website", "event", "referral", "linkedin"];

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TWO_LETTERS = /^[A-Z]{2}$/;

// Only a string counts as a value. A number or an object arriving from the
// API would otherwise turn into "123" or "[object Object]" and sit in the
// table looking like somebody's name.
function readText(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

// An untouched field is NULL in the table, not an empty string. The enquiry
// list and the source dropdown both test for NULL.
function emptyToNull(value) {
  return value === "" ? null : value;
}

// Nothing the caller sent beyond this list is kept. The body is never spread
// into the insert, so an extra key cannot reach a column we did not mean.
function cleanValues(input) {
  const given = input || {};
  const values = {};

  for (const field of Object.keys(MAX_LENGTH)) {
    values[field] = readText(given[field]);
  }

  values.state = values.state.toUpperCase();
  values.source = values.source.toLowerCase() || "website";
  return values;
}

function findMissingField(values) {
  for (const field of REQUIRED_FIELDS) {
    if (!values[field]) {
      return field;
    }
  }
  return "";
}

function findTooLongField(values) {
  for (const field of Object.keys(MAX_LENGTH)) {
    if (values[field].length > MAX_LENGTH[field]) {
      return field;
    }
  }
  return "";
}

function findBadValue(values) {
  if (!EMAIL_SHAPE.test(values.email)) {
    return "email does not look like an email address";
  }
  if (values.state && !TWO_LETTERS.test(values.state)) {
    return "state must be two letters, like CT";
  }
  if (!SOURCES.includes(values.source)) {
    return `source must be one of ${SOURCES.join(", ")}`;
  }
  return "";
}

// The first problem found, written in words the visitor can act on. One
// message at a time is enough, and the field name is the one printed on the
// form above it.
function findProblem(values) {
  const missing = findMissingField(values);
  if (missing) {
    return `${missing.replace("_", " ")} is required`;
  }

  const tooLong = findTooLongField(values);
  if (tooLong) {
    const limit = MAX_LENGTH[tooLong];
    return `${tooLong.replace("_", " ")} is longer than ${limit} characters`;
  }
  return findBadValue(values);
}

// UTC_TIMESTAMP(), not NOW(). NOW() answers in the database server's own
// time zone, and every timestamp in this app is stored in UTC.
//
// A new row is always stage 'new' with no follow-up date. The caller does
// not get to choose either one.
const INSERT_SQL = `INSERT INTO enquiries
  (first_name, last_name, email, phone, job_title, company, company_size,
   state, source, message, assigned_to, assigned_at, stage,
   created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new',
          UTC_TIMESTAMP(), UTC_TIMESTAMP())`;

function insertValues(values, owner) {
  // mysql2 writes a Date as UTC because the pool is set to timezone "Z".
  // This one is not UTC_TIMESTAMP() in the SQL because it has to be NULL
  // when nobody was assigned.
  const assignedAt = owner ? new Date() : null;

  return [
    values.first_name,
    values.last_name,
    values.email,
    emptyToNull(values.phone),
    emptyToNull(values.job_title),
    emptyToNull(values.company),
    emptyToNull(values.company_size),
    emptyToNull(values.state),
    values.source,
    emptyToNull(values.message),
    owner ? owner.id : null,
    assignedAt,
  ];
}

// Both the form and the API route come here, so an enquiry is born in one
// place only. Validation and automatic assignment cannot drift apart
// between the two paths, which is where two entry points usually go wrong.
//
// If no sales person exists the enquiry is still saved, just unassigned.
// Losing the enquiry would be worse than leaving it for somebody to pick up.
export async function createEnquiry(input) {
  const values = cleanValues(input);

  const problem = findProblem(values);
  if (problem) {
    return { ok: false, error: problem };
  }

  const owner = await findNextSalesPerson();
  const result = await runQuery(INSERT_SQL, insertValues(values, owner));

  return { ok: true, id: result.insertId, assignedTo: owner ? owner.name : null };
}
