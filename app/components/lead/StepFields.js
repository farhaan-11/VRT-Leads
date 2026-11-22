"use client";

// White box and dark text are set here, not left to the browser. The modal
// is white even on a laptop in dark mode, where an input with no colours of
// its own reads as empty.
const BOX_STYLE =
  "mt-1 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-[14px] text-[#0C111D] outline-none focus:border-[#3538CD]";

function Field({ label, optional, children }) {
  return (
    <label className="block text-sm">
      <span className="text-[13px] font-medium text-[#344054]">
        {label}
        {optional ? " (optional)" : " *"}
      </span>
      {children}
    </label>
  );
}

// min stops a past date in the browser. today comes from the server, so the
// browser's own clock never decides what counts as past.
function FollowUpFields({ typed, today }) {
  return (
    <>
      <Field label="What was said">
        <textarea
          name="body"
          rows={3}
          required
          maxLength={2000}
          defaultValue={typed.body || ""}
          className={BOX_STYLE}
        />
      </Field>

      <Field label="Next follow-up">
        <input
          type="date"
          name="followUpOn"
          required
          min={today}
          defaultValue={typed.followUpOn || ""}
          className={BOX_STYLE}
        />
      </Field>
    </>
  );
}

// The start date carries no min. A cohort that is already running can still
// take an enrollment today.
function EnrolledFields({ typed }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cohort">
          <input
            name="cohort"
            required
            maxLength={60}
            defaultValue={typed.cohort || ""}
            className={BOX_STYLE}
          />
        </Field>

        <Field label="Start date">
          <input
            type="date"
            name="startDate"
            required
            defaultValue={typed.startDate || ""}
            className={BOX_STYLE}
          />
        </Field>
      </div>

      <Field label="Amount paid (USD)">
        <input
          type="number"
          name="amount"
          required
          min="1"
          step="0.01"
          defaultValue={typed.amount || ""}
          className={BOX_STYLE}
        />
      </Field>

      <Field label="What was said" optional>
        <textarea
          name="note"
          rows={2}
          maxLength={2000}
          defaultValue={typed.note || ""}
          className={BOX_STYLE}
        />
      </Field>
    </>
  );
}

// One line, and it is required. Left optional it would be left blank, and
// the column would be worth nothing when VRT asks why leads are lost. It is
// saved as the reason and as the last note, so the history ends properly.
function RejectedFields({ typed }) {
  return (
    <Field label="Why did they say no?">
      <input
        name="reason"
        required
        maxLength={120}
        defaultValue={typed.reason || ""}
        className={BOX_STYLE}
      />
    </Field>
  );
}

export default function StepFields({ step, typed, today }) {
  if (step === "enrolled") {
    return <EnrolledFields typed={typed} />;
  }
  if (step === "rejected") {
    return <RejectedFields typed={typed} />;
  }
  return <FollowUpFields typed={typed} today={today} />;
}
