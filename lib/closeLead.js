import { runInTransaction } from "@/lib/db";
import { lockOpenLead } from "@/lib/queries/leadQueries";
import { isRealDay } from "@/lib/dates";
import { insertNote, readText, MAX_NOTE_LENGTH } from "@/lib/addNote";

// What the two columns can hold. MySQL in strict mode throws on a longer
// value, and that reaches the screen as a blank error page instead of a
// sentence naming the field.
const MAX_COHORT_LENGTH = 60;
const MAX_REASON_LENGTH = 120;

// amount is DECIMAL(10,2), so this is the largest number the column holds.
const MAX_AMOUNT = 99999999.99;

function findAmountProblem(amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "amount must be a number above 0";
  }
  if (amount > MAX_AMOUNT) {
    return "amount is larger than this field holds";
  }
  return "";
}

// The cohort start date may be in the past. A cohort that is already running
// can still take an enrollment today, which is why this date has no "today
// or later" rule like the follow-up date does.
function findCohortProblem(values) {
  if (!values.cohort) {
    return "cohort is required";
  }
  if (values.cohort.length > MAX_COHORT_LENGTH) {
    return `cohort is longer than ${MAX_COHORT_LENGTH} characters`;
  }
  if (!isRealDay(values.startDate)) {
    return "start date is required";
  }
  return "";
}

// The note is optional here. The cohort, the date and the money are the
// record; what was said on the call is welcome, not demanded.
function findEnrolledProblem(values) {
  const cohortProblem = findCohortProblem(values);
  if (cohortProblem) {
    return cohortProblem;
  }
  if (values.note.length > MAX_NOTE_LENGTH) {
    return `the note is longer than ${MAX_NOTE_LENGTH} characters`;
  }
  return findAmountProblem(values.amount);
}

// follow_up_on is cleared on purpose. Left as it was, a closed lead would
// keep showing up in tomorrow's overdue count with no work left to do.
const CLOSE_AS_ENROLLED = `UPDATE enquiries
                              SET stage = 'enrolled',
                                  follow_up_on = NULL,
                                  updated_at = UTC_TIMESTAMP()
                            WHERE id = ?`;

const INSERT_ENROLLMENT = `INSERT INTO enrollments
                             (enquiry_id, cohort, start_date, amount, created_at)
                           VALUES (?, ?, ?, ?, UTC_TIMESTAMP())`;

// The unique key on enrollments.enquiry_id is the last guard here. Even if
// two clicks got through, one lead cannot hold two enrollments, so the same
// money can never be counted twice on the dashboard.
function writeEnrolled(user, values) {
  return runInTransaction(async (ask) => {
    const locked = await lockOpenLead(ask, user, values.enquiryId);
    if (!locked.ok) {
      return locked;
    }

    await ask(CLOSE_AS_ENROLLED, [values.enquiryId]);
    await ask(INSERT_ENROLLMENT, [
      values.enquiryId,
      values.cohort,
      values.startDate,
      values.amount,
    ]);

    if (values.note) {
      await insertNote(ask, user, values.enquiryId, values.note);
    }
    return { ok: true };
  });
}

export async function closeAsEnrolled(user, input) {
  const given = input || {};
  const values = {
    enquiryId: Number(given.enquiryId),
    cohort: readText(given.cohort),
    startDate: readText(given.startDate),
    amount: Number(readText(given.amount)),
    note: readText(given.note),
  };

  const problem = findEnrolledProblem(values);
  if (problem) {
    return { ok: false, error: problem };
  }
  return writeEnrolled(user, values);
}

const CLOSE_AS_REJECTED = `UPDATE enquiries
                              SET stage = 'rejected',
                                  rejected_reason = ?,
                                  follow_up_on = NULL,
                                  updated_at = UTC_TIMESTAMP()
                            WHERE id = ?`;

function findRejectedProblem(reason) {
  if (!reason) {
    return "a reason is required";
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return `the reason is longer than ${MAX_REASON_LENGTH} characters`;
  }
  return "";
}

// The reason is written twice on purpose. In rejected_reason it is a value
// VRT can count across leads; as a note it is the last line of the history,
// so the story of the lead does not stop mid sentence.
//
// This write touches one table of its own, but it runs in a transaction
// anyway so the lock above it means something. Without the lock two people
// could both pass the "is it still open" check and both close the lead.
export async function closeAsRejected(user, input) {
  const given = input || {};
  const enquiryId = Number(given.enquiryId);
  const reason = readText(given.reason);

  const problem = findRejectedProblem(reason);
  if (problem) {
    return { ok: false, error: problem };
  }

  return runInTransaction(async (ask) => {
    const locked = await lockOpenLead(ask, user, enquiryId);
    if (!locked.ok) {
      return locked;
    }

    await ask(CLOSE_AS_REJECTED, [reason, enquiryId]);
    await insertNote(ask, user, enquiryId, reason);
    return { ok: true };
  });
}
