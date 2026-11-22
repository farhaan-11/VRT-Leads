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
  "mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900";

function FieldLabel({ label, required, children }) {
  return (
    <label className="block text-sm">
      <span className="text-slate-600">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

// defaultValue brings back what was typed. maxLength matches the column, so
// a long paste is stopped here instead of coming back as an error.
function TextField({ name, label, typed, type, required }) {
  return (
    <FieldLabel label={label} required={required}>
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

function ChoiceField({ name, label, options, typed, blankLabel }) {
  return (
    <FieldLabel label={label}>
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
    <FieldLabel label="What can we help with?">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="first_name" label="First name" typed={typed} required />
        <TextField name="last_name" label="Last name" typed={typed} required />
      </div>

      <TextField name="email" label="Email" type="email" typed={typed} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="phone" label="Phone" type="tel" typed={typed} />
        <TextField name="job_title" label="Job title" typed={typed} />
        <TextField name="company" label="Company" typed={typed} />
        <ChoiceField
          name="company_size"
          label="Company size"
          options={COMPANY_SIZES.map((size) => ({ value: size, label: size }))}
          typed={typed}
          blankLabel="Prefer not to say"
        />
        <TextField name="state" label="State (2 letters, like CT)" typed={typed} />
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
    <form action={submit} className="space-y-4">
      <Problem error={state.error} />
      <Fields typed={state.typed} />

      <button
        type="submit"
        disabled={sending}
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
