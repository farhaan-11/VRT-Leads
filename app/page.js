import { runQuery } from "@/lib/db";
import { getCurrentUser, ownerFilter } from "@/lib/currentUser";

// This page is only here to prove the role filter works end to end. The real
// dashboard replaces it in step 4.

// Nothing here can be built ahead of time. The database is not reachable
// during a Vercel build, and these numbers change through the day.
export const dynamic = "force-dynamic";

// One count, narrowed to whoever is viewing.
async function countEnquiries(user) {
  const filter = ownerFilter(user);

  // The filter text is ours, never anything a person typed. Every value a
  // person supplies still goes in through a ? placeholder.
  const rows = await runQuery(
    `SELECT COUNT(*) AS total FROM enquiries WHERE ${filter.sql}`,
    filter.params
  );

  // COUNT comes back as a string, and an empty table would give no row.
  return Number(rows[0]?.total) || 0;
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const total = await countEnquiries(user);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2">
      <p className="text-4xl font-semibold">{total} enquiries</p>
      <p className="text-sm text-slate-500">
        Viewing as {user.name} ({user.role})
      </p>
    </main>
  );
}
