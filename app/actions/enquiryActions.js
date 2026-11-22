"use server";

import { revalidatePath } from "next/cache";
import { createEnquiry } from "@/lib/createEnquiry";

// Only these names are read out of the form. Anything else posted with it
// is dropped here rather than carried any further.
const FORM_FIELDS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "job_title",
  "company",
  "company_size",
  "state",
  "source",
  "message",
];

function readForm(formData) {
  const typed = {};

  for (const field of FORM_FIELDS) {
    typed[field] = formData.get(field);
  }
  return typed;
}

async function saveEnquiry(typed) {
  const result = await createEnquiry(typed);

  if (!result.ok) {
    return { done: false, error: result.error, typed };
  }

  // This row changes the counts at the top of the dashboard and the list
  // below them, so the page the visitor came from is no longer current.
  revalidatePath("/");
  return { done: true, error: "", typed: {} };
}

// The form posts here. The values typed go back with any error, so a failed
// submit does not hand the visitor an empty form to fill again.
//
// A thrown error is caught on purpose. A database that is asleep or full
// would otherwise show a stack trace to somebody who only wanted to send
// their name.
export async function submitEnquiry(previousState, formData) {
  const typed = readForm(formData);

  try {
    return await saveEnquiry(typed);
  } catch (error) {
    console.error("createEnquiry failed", error);
    return {
      done: false,
      error: "Something went wrong on our side. Please try again.",
      typed,
    };
  }
}
