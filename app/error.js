"use client";

// This catches a throw inside app/page.js (the dashboard) or any component
// rendered under it. The layout above still works, so the top bar and the
// nav are drawn as usual and only the middle is replaced.
//
// The most likely cause by far is the hosted database being asleep — TiDB's
// free plan sleeps after a quiet spell and the first request after can take
// a few seconds or fail. Retry fixes it on the next try, which is why the
// button here is the main one.
export default function DashboardError({ error, reset }) {
  console.error("dashboard error", error);

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border border-[#E6E8EC] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF3F2] text-xl font-semibold text-[#D92D20]">
          !
        </div>

        <h1 className="text-[18px] font-semibold text-[#0C111D]">
          Could not load the dashboard
        </h1>

        <p className="mt-2 text-[14px] leading-relaxed text-[#667085]">
          Something went wrong while loading. The database may be waking up —
          this usually clears on the next try.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-[#3538CD] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2D31A6]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
