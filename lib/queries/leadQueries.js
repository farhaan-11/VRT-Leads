import { runQuery } from "@/lib/db";
import { ownerFilter } from "@/lib/currentUser";

// A lead is still open while it is one of these two. Closed leads are read
// only, so every write checks this list first.
const OPEN_STAGES = ["new", "follow_up"];

// All the notes for the leads currently on screen, in one query. The list
// is already narrowed by the role rule, so the ids handed in here are only
// ever leads this viewer may see.
//
// The ? marks are built from the number of ids and nothing else. No value is
// ever joined into the text.
export async function getNotesForLeads(enquiryIds) {
  if (enquiryIds.length === 0) {
    return [];
  }
  const holes = enquiryIds.map(() => "?").join(", ");

  return runQuery(
    `SELECT notes.id, notes.enquiry_id, notes.body, notes.created_at,
            users.name AS author
     FROM notes
     JOIN users ON users.id = notes.user_id
     WHERE notes.enquiry_id IN (${holes})
     ORDER BY notes.created_at ASC, notes.id ASC`,
    enquiryIds
  );
}

function openLeadProblem(lead) {
  if (!lead) {
    return "This lead is not yours to change.";
  }
  if (!OPEN_STAGES.includes(lead.stage)) {
    return "This lead is already closed.";
  }
  return "";
}

// Every write starts here, inside the transaction. FOR UPDATE holds this one
// row until the transaction ends, so two people cannot both close the same
// lead, and a note cannot land on a lead somebody closed a minute ago while
// the modal stayed open on this screen.
export async function lockOpenLead(ask, user, id) {
  if (!Number.isInteger(id) || id < 1) {
    return { ok: false, error: "This lead could not be found." };
  }

  const role = ownerFilter(user);

  const rows = await ask(
    `SELECT stage FROM enquiries
     WHERE id = ? AND ${role.sql}
     FOR UPDATE`,
    [id, ...role.params]
  );

  const problem = openLeadProblem(rows[0]);
  if (problem) {
    return { ok: false, error: problem };
  }
  return { ok: true, lead: rows[0] };
}
