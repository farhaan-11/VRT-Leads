import { runInTransaction } from "@/lib/db";
import { lockOpenLead } from "@/lib/queries/leadQueries";
import { isRealDay, todayInNewYork } from "@/lib/dates";

// The column is TEXT, so this limit is mine, not MySQL's. A note is what was
// said on one call; past this length somebody is pasting a document in.
export const MAX_NOTE_LENGTH = 2000;

// Only a string counts as a value, the same rule createEnquiry uses. A
// number arriving here would otherwise be stored as "123".
export function readText(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function readValues(input) {
  const given = input || {};

  return {
    enquiryId: Number(given.enquiryId),
    body: readText(given.body),
    followUpOn: readText(given.followUpOn),
  };
}

// Both days are plain 2026-11-22 text, so comparing them as text compares
// them as days. Today is read in Connecticut, like every other date here.
//
// The date is required on purpose. Left optional it would be left blank, and
// "when is the next step" is the one thing this dashboard exists to show.
function findDateProblem(followUpOn) {
  if (!followUpOn) {
    return "next follow-up date is required";
  }
  if (!isRealDay(followUpOn)) {
    return "next follow-up date is not a real date";
  }
  if (followUpOn < todayInNewYork()) {
    return "next follow-up date cannot be in the past";
  }
  return "";
}

// The lead id is not checked here. lockOpenLead checks it for all three
// writes, so there is one answer to "is this a lead I may change" and not
// three that can drift.
function findProblem(values) {
  if (!values.body) {
    return "the note cannot be empty";
  }
  if (values.body.length > MAX_NOTE_LENGTH) {
    return `the note is longer than ${MAX_NOTE_LENGTH} characters`;
  }
  return findDateProblem(values.followUpOn);
}

const INSERT_NOTE = `INSERT INTO notes (enquiry_id, user_id, body, created_at)
                     VALUES (?, ?, ?, UTC_TIMESTAMP())`;

// Closing a lead writes a note too, so the history carries the last word as
// well as the calls before it. Every note in this app is written here.
export async function insertNote(ask, user, enquiryId, body) {
  await ask(INSERT_NOTE, [enquiryId, user.id, body]);
}

// A note means somebody has now spoken to this lead, so the stage moves on
// and the next date is set in the same write.
const MOVE_LEAD = `UPDATE enquiries
                      SET stage = 'follow_up',
                          follow_up_on = ?,
                          updated_at = UTC_TIMESTAMP()
                    WHERE id = ?`;

// A note does not change who owns the lead. Only the admin can open a lead
// nobody owns, and the admin is never an owner of one - her name is not in
// the owner dropdown, so a lead handed to her could not be filtered back
// out. Handing it to a sales person is the assign action, which is its own
// piece of work.
async function writeNote(ask, user, values) {
  await insertNote(ask, user, values.enquiryId, values.body);
  await ask(MOVE_LEAD, [values.followUpOn, values.enquiryId]);
}

// One transaction for all of it. If the note landed and the date did not,
// the screen would say the call happened and still show the old follow-up,
// and nobody would ever see an error.
export async function addNote(user, input) {
  const values = readValues(input);

  const problem = findProblem(values);
  if (problem) {
    return { ok: false, error: problem };
  }

  return runInTransaction(async (ask) => {
    const locked = await lockOpenLead(ask, user, values.enquiryId);
    if (!locked.ok) {
      return locked;
    }

    await writeNote(ask, user, values);
    return { ok: true };
  });
}
