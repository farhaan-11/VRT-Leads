import { runInTransaction } from "@/lib/db";

// Handing a lead to someone is the admin's job. A sales person never sees an
// unowned lead in the first place, so this is a second lock on the same
// door: the first one could be opened by a typed URL, this one cannot.
function findProblem(user, values) {
  if (user.role !== "admin") {
    return "only an admin can hand a lead to someone";
  }
  if (!Number.isInteger(values.enquiryId) || values.enquiryId < 1) {
    return "that lead does not exist";
  }
  if (!Number.isInteger(values.ownerId) || values.ownerId < 1) {
    return "pick who this lead goes to";
  }
  return "";
}

function readValues(input) {
  const given = input || {};

  return {
    enquiryId: Number(given.enquiryId),
    ownerId: Number(given.ownerId),
  };
}

const FIND_SALES_PERSON = `SELECT name FROM users WHERE id = ? AND role = 'sales'`;

// assigned_to IS NULL is the whole safety here. Two admins looking at the
// same backlog would otherwise both hand out the same lead, and the second
// one would quietly overwrite the first.
const TAKE_LEAD = `UPDATE enquiries
                   SET assigned_to = ?
                   WHERE id = ? AND assigned_to IS NULL`;

const WRITE_NOTE = `INSERT INTO notes (enquiry_id, user_id, body, created_at)
                    VALUES (?, ?, ?, UTC_TIMESTAMP())`;

async function saveAssignment(ask, user, values) {
  const people = await ask(FIND_SALES_PERSON, [values.ownerId]);

  if (people.length === 0) {
    return { ok: false, error: "that person is not on the sales team" };
  }

  const result = await ask(TAKE_LEAD, [values.ownerId, values.enquiryId]);
  if (result.affectedRows === 0) {
    return { ok: false, error: "someone has already taken this lead" };
  }

  // The note is written inside the same transaction. A lead that changed
  // hands with nothing in its history is a lead nobody can explain later.
  const line = `Handed to ${people[0].name}.`;
  await ask(WRITE_NOTE, [values.enquiryId, user.id, line]);

  return { ok: true, error: "" };
}

export async function assignLead(user, input) {
  const values = readValues(input);
  const problem = findProblem(user, values);

  if (problem) {
    return { ok: false, error: problem };
  }
  return runInTransaction((ask) => saveAssignment(ask, user, values));
}
