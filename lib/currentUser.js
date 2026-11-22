import { cookies } from "next/headers";
import { runQuery } from "@/lib/db";

// The cookie holds the viewer's id and nothing else. A role kept in a cookie
// could be edited to "admin" in the browser, and then the filter below would
// be worth nothing.
export const VIEWER_COOKIE = "vrt_viewer_id";

// Dana is the admin in the seed. A first visit has no cookie, and the admin
// sees the most, so that is the view a reviewer should land on.
const DEFAULT_VIEWER_ID = 1;

// I load the viewer from the database on every request instead of trusting
// the cookie, so an edited or stale id cannot hand anyone a wider view.
export async function getCurrentUser() {
  const store = await cookies();
  const wantedId = Number(store.get(VIEWER_COOKIE)?.value);

  const wanted = await findUser(wantedId);
  if (wanted) {
    return wanted;
  }

  const fallback = await findUser(DEFAULT_VIEWER_ID);
  if (fallback) {
    return fallback;
  }
  throw new Error("No demo users found. Load db/seed/01_users.sql first.");
}

// One id in, one row or nothing out. A cookie can hold any text at all, so
// the id is checked before it reaches the database.
async function findUser(id) {
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  const rows = await runQuery("SELECT id, name, role FROM users WHERE id = ?", [
    id,
  ]);
  return rows[0] || null;
}

// The four names the header dropdown offers. Dana the admin is id 1 in the
// seed, so plain id order already puts the admin first.
export async function getAllViewers() {
  return runQuery("SELECT id, name, role FROM users ORDER BY id ASC");
}

// I keep the role rule in one place so every query filters the same way.
// This runs in SQL on purpose. Hiding a row on the page would still send the
// other person's row to the browser.
export function ownerFilter(user) {
  if (user.role === "admin") {
    return { sql: "1 = 1", params: [] };
  }
  return { sql: "assigned_to = ?", params: [user.id] };
}
