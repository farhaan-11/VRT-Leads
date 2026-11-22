import { runQuery } from "@/lib/db";

// This page is only here to prove step 1 works end to end. The real
// dashboard replaces it in step 4.

// Nothing here can be built ahead of time. The database is not reachable
// during a Vercel build, and these numbers change through the day.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await runQuery("SELECT COUNT(*) AS total FROM enquiries");

  // COUNT comes back as a string, and an empty table would give no row.
  const total = Number(rows[0]?.total) || 0;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-4xl font-semibold">{total} enquiries</p>
    </main>
  );
}
