"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { VIEWER_COOKIE } from "@/lib/currentUser";

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

const COOKIE_OPTIONS = {
  httpOnly: true, // no code in the browser reads or writes this cookie
  sameSite: "lax",
  path: "/",
  maxAge: ONE_YEAR_IN_SECONDS,
};

// The header dropdown posts here. I store the id only; getCurrentUser checks
// it against the database, so a bad id costs nothing but the admin view.
export async function switchViewer(formData) {
  const id = Number(formData.get("viewerId"));

  if (!Number.isInteger(id) || id < 1) {
    return;
  }

  const store = await cookies();
  store.set(VIEWER_COOKIE, String(id), COOKIE_OPTIONS);

  // Without this the cookie changes but the header and the numbers already on
  // screen stay as they were.
  revalidatePath("/", "layout");
}
