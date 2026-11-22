import { revalidatePath } from "next/cache";
import { createEnquiry } from "@/lib/createEnquiry";

// A body that is not JSON throws, and the message it throws points nowhere
// near the real problem. So it is turned into one the caller can act on.
async function readJson(request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return null;
    }
    return body;
  } catch (error) {
    return null;
  }
}

function answerProblem(error, status) {
  return Response.json({ ok: false, error }, { status });
}

async function saveAndAnswer(body) {
  const result = await createEnquiry(body);

  if (!result.ok) {
    return answerProblem(result.error, 400);
  }

  // A row posted from outside changes the dashboard just as much as one
  // typed into the form.
  revalidatePath("/");
  return Response.json({
    ok: true,
    id: result.id,
    assigned_to: result.assignedTo,
  });
}

// VRT's landing pages are built elsewhere, so they need one address to post
// an enquiry to. This route holds no rules of its own: it calls the same
// createEnquiry the form calls, so validation and assignment cannot drift
// apart between the two paths.
//
// The route is open, which is fine for a demo. Real use needs a shared key
// in a header. That was left out knowingly, not missed.
export async function POST(request) {
  const body = await readJson(request);

  if (!body) {
    return answerProblem("body must be JSON", 400);
  }

  try {
    return await saveAndAnswer(body);
  } catch (error) {
    // The caller gets a plain sentence. The detail stays in the server log,
    // because an SQL error names our tables and columns.
    console.error("POST /api/enquiries failed", error);
    return answerProblem("something went wrong", 500);
  }
}
