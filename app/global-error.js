"use client";

import "./globals.css";

// This boundary catches a throw inside the root layout itself — the TopBar
// reads the database on every request, and a sleeping TiDB would otherwise
// hand the reviewer a stack trace. The layout is what failed, so I own my
// own html and body here and cannot lean on the one in app/layout.js.
//
// The errors never reach the reader as words, only the shape. I log them
// here so a quiet failure on the live site still leaves a trail.
export default function GlobalError({ error, reset }) {
  console.error("global error", error);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#F6F7F9] p-6">
        <section className="w-full max-w-md rounded-xl border border-[#E6E8EC] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF3F2] text-xl font-semibold text-[#D92D20]">
            !
          </div>

          <h1 className="text-[18px] font-semibold text-[#0C111D]">
            We hit a snag loading the dashboard
          </h1>

          <p className="mt-2 text-[14px] leading-relaxed text-[#667085]">
            The database may be waking up. This usually clears on the next
            try.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-lg bg-[#3538CD] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2D31A6]"
            >
              Try again
            </button>

            {/* The events page reads no database, so it still opens even when
                the dashboard cannot. This keeps a visitor with a path forward. */}
            <a
              href="/events"
              className="rounded-lg border border-[#D0D5DD] bg-white px-4 py-2 text-[13px] font-medium text-[#344054] hover:bg-[#F9FAFB]"
            >
              Go to Events
            </a>
          </div>
        </section>
      </body>
    </html>
  );
}
