import { redirect } from "next/navigation";

// The visitor-facing form moved to /events — the enquiry form sits below the
// list of upcoming events there. I keep this route as a redirect so any old
// bookmark or copied link still lands on the form.
export default function OldNewEnquiryPage() {
  redirect("/events");
}
