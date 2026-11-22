"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/currentUser";
import { addNote } from "@/lib/addNote";
import { closeAsEnrolled, closeAsRejected } from "@/lib/closeLead";

// The viewer is read here, on the server, on every write. The form posts a
// lead id and nothing else that matters, so who may touch that lead is never
// taken from the page.
async function runWrite(write, values) {
  const user = await getCurrentUser();
  const result = await write(user, values);

  if (!result.ok) {
    return { done: false, error: result.error, typed: values };
  }

  // This write changes the cards at the top and the row underneath the
  // modal, so the whole dashboard is no longer current.
  revalidatePath("/");
  return { done: true, error: "", typed: {} };
}

// A thrown error is caught and turned into one sentence. A database that is
// asleep would otherwise show a stack trace inside the modal.
async function guard(write, values) {
  try {
    return await runWrite(write, values);
  } catch (error) {
    console.error("lead write failed", error);
    return {
      done: false,
      error: "Something went wrong on our side. Please try again.",
      typed: values,
    };
  }
}

// Only the fields that step actually has. The other two sets are not on the
// screen when this is posted, so they arrive as null and are never read.
function readStep(step, formData) {
  if (step === "enrolled") {
    return {
      write: closeAsEnrolled,
      values: {
        enquiryId: formData.get("enquiryId"),
        cohort: formData.get("cohort"),
        startDate: formData.get("startDate"),
        amount: formData.get("amount"),
        note: formData.get("note"),
      },
    };
  }

  if (step === "rejected") {
    return {
      write: closeAsRejected,
      values: {
        enquiryId: formData.get("enquiryId"),
        reason: formData.get("reason"),
      },
    };
  }

  return {
    write: addNote,
    values: {
      enquiryId: formData.get("enquiryId"),
      body: formData.get("body"),
      followUpOn: formData.get("followUpOn"),
    },
  };
}

// One form, one action, three endings. Anything other than the two closing
// words falls through to a follow-up, which is the step that changes the
// least and can always be taken again.
export async function saveLeadStep(previousState, formData) {
  const chosen = readStep(formData.get("step"), formData);

  return guard(chosen.write, chosen.values);
}
