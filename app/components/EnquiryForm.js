"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/actions/enquiryActions";

const EMPTY_STATE = { done: false, error: "", typed: {} };

// The visitor picks this themselves. We used to set it to "website" for
// everyone, which made every event enquiry look like a web form and left
// the dashboard's source table saying nothing.
const SOURCES = [
  { value: "website", label: "Website" },
  { value: "event", label: "Event" },
  { value: "referral", label: "Referral" },
  { value: "linkedin", label: "LinkedIn" },
];

const COMPANY_SIZES = ["20-50", "51-200", "201-500"];

// The same limits the columns have. These only stop a long paste early; the
// real check runs on the server, because values also arrive through the API
// route where no browser is involved.
const MAX_LENGTH = {
  first_name: 60,
  last_name: 60,
  email: 150,
  phone: 30,
  job_title: 80,
  company: 150,
  state: 2,
};

// White background and dark text are set here and not left to the browser.
// This page is also opened on laptops set to dark mode, where an input with
// no colours of its own reads as empty.
const BOX_STYLE =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-[#3538CD] focus:outline-none focus:ring-2 focus:ring-[#3538CD]/15";

// I show "*" in red for a field the visitor must fill, and "(optional)" in
// grey for one they may leave blank. A field that is required but pre-filled
// (like source) takes neither, because a marker on something already answered
// only reads as noise.
function FieldLabel({ label, required, optional, children }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
        {optional ? <span className="font-normal text-slate-400"> (optional)</span> : null}
      </span>
      {children}
    </label>
  );
}

// defaultValue brings back what was typed. maxLength matches the column, so
// a long paste is stopped here instead of coming back as an error.
function TextField({ name, label, typed, type, required, optional }) {
  return (
    <FieldLabel label={label} required={required} optional={optional}>
      <input
        name={name}
        type={type || "text"}
        required={required}
        maxLength={MAX_LENGTH[name]}
        defaultValue={typed[name] || ""}
        className={BOX_STYLE}
      />
    </FieldLabel>
  );
}

function ChoiceField({ name, label, options, typed, blankLabel, optional }) {
  return (
    <FieldLabel label={label} optional={optional}>
      <select name={name} defaultValue={typed[name] || ""} className={BOX_STYLE}>
        {blankLabel ? <option value="">{blankLabel}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}

function MessageField({ typed }) {
  return (
    <FieldLabel label="What can we help with?" optional>
      <textarea
        name="message"
        rows={4}
        maxLength={2000}
        defaultValue={typed.message || ""}
        className={BOX_STYLE}
      />
    </FieldLabel>
  );
}

// One line above the fields, so a visitor knows what the markers mean before
// they meet the first one.
function Legend() {
  return (
    <p className="text-xs text-slate-500">
      Fields marked <span className="text-red-600">*</span> are required. Others are optional.
    </p>
  );
}

// One sentence, in the words the server sent back. The server checks every
// value even though the browser checks some of them first, because the same
// values also arrive through the API route.
function Problem({ error }) {
  if (!error) {
    return null;
  }
  return (
    <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
      {error}
    </p>
  );
}

// Nothing about who picked it up. That is VRT's business, not the visitor's.
function ThankYou() {
  return (
    <div className="rounded border border-slate-200 p-6">
      <p className="text-lg font-semibold">Thank you.</p>
      <p className="mt-2 text-sm text-slate-600">
        We have your enquiry and someone from VRT will be in touch.
      </p>
    </div>
  );
}

function Fields({ typed }) {
  return (
    <>
      <Legend />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="first_name" label="First name" typed={typed} required />
        <TextField name="last_name" label="Last name" typed={typed} required />
      </div>

      <TextField name="email" label="Email" type="email" typed={typed} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="phone" label="Phone" type="tel" typed={typed} optional />
        <TextField name="job_title" label="Job title" typed={typed} optional />
        <TextField name="company" label="Company" typed={typed} optional />
        <ChoiceField
          name="company_size"
          label="Company size"
          options={COMPANY_SIZES.map((size) => ({ value: size, label: size }))}
          typed={typed}
          blankLabel="Prefer not to say"
          optional
        />
        <TextField name="state" label="State (2 letters, like CT)" typed={typed} optional />
        <ChoiceField
          name="source"
          label="How did you hear about us?"
          options={SOURCES}
          typed={typed}
        />
      </div>

      <MessageField typed={typed} />
    </>
  );
}

// useActionState keeps the typed values and the error across a submit. It is
// the one piece of browser JavaScript in this app, and it is here because
// the other way round is putting a visitor's name and email in the URL.
export default function EnquiryForm() {
  const [state, submit, sending] = useActionState(submitEnquiry, EMPTY_STATE);

  if (state.done) {
    return <ThankYou />;
  }

  return (
    <form action={submit} className="space-y-5">
      <Problem error={state.error} />
      <Fields typed={state.typed} />

      <button
        type="submit"
        disabled={sending}
        className="rounded-lg bg-[#3538CD] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D31A6] disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
